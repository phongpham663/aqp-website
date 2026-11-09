import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { robotsPolicy, verifyCollection } from "./collect-magal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.opretail.com";
const defaultOutput = path.join(root, "assets/opretail");
const maxHeight = 40000;
const maxTotalBytes = 512 * 1024 * 1024;
const privatePath = /\/(?:login|log-in|signin|sign-in|signup|sign-up|register|logout|auth|account|admin|dashboard|portal|user|api|_nuxt|wp-admin|wp-login\.php|wp-json)(?:\/|$)/i;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const saveJson = async (file, value) => {
  await writeFile(`${file}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  await rename(`${file}.tmp`, file);
};

function sourceUrl(raw, base = origin, source = origin) {
  try {
    const url = new URL(raw, base);
    const canonical = new URL(source);
    const hostname = canonical.hostname.replace(/^www\./, "");
    if (url.protocol !== "https:" || url.port || url.username || url.password ||
      ![hostname, `www.${hostname}`].includes(url.hostname) ||
      privatePath.test(decodeURIComponent(url.pathname))) return null;
    url.hostname = canonical.hostname;
    url.hash = "";
    return url.href;
  } catch { return null; }
}

export function publicPage(raw, base = origin, source = origin) {
  const value = sourceUrl(raw, base, source);
  if (!value) return null;
  const url = new URL(value);
  if (url.search || /\.(?:pdf|zip|xml|json|js|css|woff2?|png|jpe?g|webp|svg|gif|ico|mp4|exe)$/i.test(decodeURIComponent(url.pathname))) return null;
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

export function sitemapLocations(xml) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((match) =>
    match[1].trim().replace(/&(amp|lt|gt|quot|apos);/g, (_, entity) => entities[entity]));
}

export async function collect({ output = defaultOutput, maxPages = 100, refreshMobile = false, source = origin, sitemapPath = "/sitemap.xml" } = {}) {
  const sourceAddress = new URL(source);
  if (sourceAddress.protocol !== "https:" || sourceAddress.port || sourceAddress.username || sourceAddress.password || sourceAddress.pathname !== "/" || sourceAddress.search || sourceAddress.hash) throw new Error("Source must be a public HTTPS origin");
  const origin = sourceAddress.origin;
  if (origin !== "https://www.opretail.com" && output === defaultOutput) throw new Error("Specify a separate output directory for a different website");
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 300) throw new Error("max-pages must be 1-300");
  const relative = path.relative(path.join(root, "assets"), output);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Output must be a subdirectory of assets/");
  const manifestPath = path.join(output, "manifest.json");
  const exists = await access(manifestPath).then(() => true, () => false);
  if (exists && !refreshMobile) throw new Error("Collection already exists; use verify, refresh-mobile or --output=assets/opretail-new");
  if (refreshMobile && !exists) throw new Error("refresh-mobile requires an existing collection");
  for (const folder of ["pages", "screenshots/desktop", "screenshots/mobile", "discovery"]) await mkdir(path.join(output, folder), { recursive: true });

  const manifest = refreshMobile ? JSON.parse(await readFile(manifestPath, "utf8")) : {
    source: origin, startedAt: new Date().toISOString(), state: "collecting",
    scope: `Public HTTPS pages on ${sourceAddress.hostname}, discovered from sitemap and internal links; desktop and mobile full-page captures with source/rendered HTML, visible text and metadata. No query variants, login/private routes or external site navigation. No separate asset downloads or form submissions.`,
    rightsNote: "Content, images and trademarks belong to their owners. This snapshot does not grant reuse rights, validate vendor claims or constitute an offline website mirror. Optional cookies may be rejected only in isolated capture contexts.",
    limits: { maxPages, maxHeight, maxTotalBytes },
    pages: [], screenshots: [], downloaded: [], skipped: [], failures: [], discovery: [], pending: [],
  };
  if (manifest.source !== origin) throw new Error("Collection source does not match the requested website");
  if (refreshMobile) {
    if (!(await verifyCollection(output)).valid) throw new Error("Existing artifacts changed; refusing to overwrite them");
    manifest.refreshRuns ??= [];
    manifest.refreshRuns.push({ startedAt: new Date().toISOString(), scope: "Responsive mobile captures and desktop homepage; existing desktop pages preserved" });
  }
  manifest.state = "collecting";
  const existingSizes = new Map([...manifest.discovery, ...manifest.screenshots, ...manifest.pages.flatMap((page) => page.artifacts)].map((artifact) => [artifact.file, artifact.bytes]));
  let totalBytes = refreshMobile ? manifest.totalBytes : 0;
  const save = async (file, value, extra = {}) => {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
    const difference = bytes.length - (existingSizes.get(file) || 0);
    if (totalBytes + difference > maxTotalBytes) throw new Error("Collection byte budget exceeded");
    totalBytes += difference;
    try { await writeFile(path.join(output, file), bytes); }
    catch (error) { totalBytes -= difference; throw error; }
    existingSizes.set(file, bytes.length);
    return { file, bytes: bytes.length, sha256: hash(bytes), ...extra };
  };
  const checkpoint = () => saveJson(manifestPath, manifest);
  await checkpoint();
  let policy = { delayMs: 0, allowed: () => true };
  let lastNavigation = 0;
  let slots = Promise.resolve();
  const requestSlot = () => {
    slots = slots.then(async () => {
      await delay(Math.max(0, lastNavigation + Math.max(1000, policy.delayMs) - Date.now()));
      lastNavigation = Date.now();
    });
    return slots;
  };
  const fetchText = async (raw) => {
    let url = sourceUrl(raw, origin, origin);
    for (let redirects = 0; redirects < 6; redirects++) {
      if (!url || new URL(url).search || !policy.allowed(url)) throw new Error("Unsupported or disallowed discovery URL");
      await requestSlot();
      const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000), headers: { "User-Agent": "AQPTechReferenceCollector/1.0" } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const next = sourceUrl(response.headers.get("location"), url, origin);
        await response.body?.cancel();
        url = next;
        continue;
      }
      if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP ${response.status}: ${url}`); }
      const chunks = [];
      let size = 0;
      try {
        for await (const chunk of response.body) {
          size += chunk.length;
          if (size > 5 * 1024 * 1024) throw new Error("Discovery document exceeds 5 MB");
          chunks.push(chunk);
        }
      } catch (error) { await response.body?.cancel().catch(() => {}); throw error; }
      return Buffer.concat(chunks);
    }
    throw new Error("Too many discovery redirects");
  };

  let browser;
  try {
    const robots = await fetchText(`${origin}/robots.txt`);
    if (/<(?:html|!doctype)\b/i.test(robots.toString())) throw new Error("robots.txt returned HTML; policy could not be verified");
    const robotsArtifact = await save("discovery/robots.txt", robots);
    manifest.discovery = [...manifest.discovery.filter((artifact) => artifact.file !== robotsArtifact.file), robotsArtifact];
    policy = robotsPolicy(robots.toString());
    manifest.crawlDelayMs = Math.max(1000, policy.delayMs);
    const pending = new Set(refreshMobile ? manifest.pages.map((page) => page.requestedUrl) : [origin + "/"]);
    const seen = new Set();
    const skipped = new Set();
    const enqueue = (raw, base = origin) => {
      const url = publicPage(raw, base, origin);
      if (url && policy.allowed(url)) { if (!seen.has(url)) pending.add(url); }
      else if (!skipped.has(raw)) {
        skipped.add(raw);
        manifest.skipped.push({ url: raw, reason: url ? "robots.txt" : "External, private, query variant or non-page resource" });
      }
    };
    const sitemaps = refreshMobile ? [] : [new URL(sitemapPath, origin).href];
    const visitedSitemaps = new Set();
    while (sitemaps.length && visitedSitemaps.size < 12) {
      const url = sitemaps.shift();
      if (visitedSitemaps.has(url)) continue;
      visitedSitemaps.add(url);
      const xml = await fetchText(url);
      if (!/<(?:urlset|sitemapindex)\b/i.test(xml.toString())) throw new Error(`Invalid sitemap response: ${url}`);
      manifest.discovery.push(await save(`discovery/sitemap-${visitedSitemaps.size}.xml`, xml, { url }));
      const locations = sitemapLocations(xml.toString());
      if (/<sitemapindex\b/i.test(xml.toString())) {
        for (const item of locations) { const target = sourceUrl(item, origin, origin); if (target) sitemaps.push(target); }
      } else locations.forEach((item) => enqueue(item));
    }
    if (sitemaps.length) throw new Error("Sitemap index limit reached; cannot claim full discovery");
    if (!refreshMobile) manifest.sitemapPages = pending.size;
    console.log(`Discovered ${pending.size} initial pages; robots allows collection, delay ${manifest.crawlDelayMs}ms`);
    await checkpoint();

    const { chromium } = await import("playwright");
    browser = await chromium.launch({ headless: true });
    const contexts = {
      desktop: await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" }),
      mobile: await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: "reduce" }),
    };
    const cookiesHandled = { desktop: false, mobile: false };
    const rejectCookies = async (page, device, adjustments, finalCheck = false) => {
      if (cookiesHandled[device]) return false;
      const reject = page.getByRole("button", { name: /^(Reject|Reject all)$/i }).first();
      if (!await reject.waitFor({ state: "visible", timeout: 2000 }).then(() => true, () => false)) {
        if (finalCheck) cookiesHandled[device] = true;
        return false;
      }
      // The source's oversized mobile cookie dialog breaks coordinate-based clicks.
      await reject.evaluate((button) => button.click());
      await reject.waitFor({ state: "hidden", timeout: 5000 });
      cookiesHandled[device] = true;
      adjustments.push("Rejected optional cookies in isolated context");
      await page.getByText(/^Setting\s*Success$/i).first().waitFor({ state: "hidden", timeout: 6000 }).catch(() => {});
      return true;
    };
    for (const context of Object.values(contexts)) {
      await context.route("**/*", async (route) => {
        const request = route.request();
        if (request.isNavigationRequest() && request.frame().parentFrame() === null) {
          const url = publicPage(request.url(), origin, origin);
          if (!url || !policy.allowed(url)) return route.abort();
          await requestSlot();
        }
        await route.continue();
      });
    }

    const capture = async (url, device, name) => {
      const page = await contexts[device].newPage();
      const issues = [];
      const adjustments = [];
      page.on("pageerror", (error) => issues.push(error.message));
      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
        if (!publicPage(page.url(), origin, origin)) throw new Error("Page redirected outside public scope");
        const artifacts = [];
        if (device === "desktop") artifacts.push(await save(`pages/${name}-source.html`, await response.body(), { kind: "source" }));
        await page.waitForLoadState("load", { timeout: 12000 }).catch(() => issues.push("Load event timeout; DOM captured"));
        await rejectCookies(page, device, adjustments);
        const prepare = () => page.evaluate(async (limit) => {
          await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 5000))]);
          for (let y = 0; y < Math.min(document.documentElement.scrollHeight, limit); y += innerHeight * 0.75) {
            scrollTo({ top: y, behavior: "instant" });
            await new Promise((resolve) => setTimeout(resolve, 220));
          }
          await Promise.race([Promise.all([...document.images].map((image) => image.decode().catch(() => {}))), new Promise((resolve) => setTimeout(resolve, 5000))]);
          scrollTo({ top: 0, behavior: "instant" });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }, maxHeight);
        await prepare();
        if (await rejectCookies(page, device, adjustments, true)) await prepare();
        const metadata = await page.evaluate(() => ({
          url: location.href, title: document.title, description: document.querySelector('meta[name="description"]')?.content || "",
          viewport: { width: innerWidth, height: innerHeight }, userAgent: navigator.userAgent,
          dimensions: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          headings: [...document.querySelectorAll("h1,h2,h3,h4")].map((element) => ({ tag: element.tagName, text: element.innerText.trim() })).filter((heading) => heading.text),
          links: [...document.querySelectorAll("a[href]")].map((element) => ({ url: element.href, text: element.innerText.trim() })),
          images: [...document.images].map((image) => ({ url: image.currentSrc || image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight, loaded: image.complete && image.naturalWidth > 0 })),
          forms: [...document.forms].map((form) => ({ action: form.action, method: form.method, fields: [...form.elements].map((field) => ({ name: field.name, type: field.type, required: field.required })) })),
          stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((element) => element.href),
          scripts: [...document.querySelectorAll("script[src]")].map((element) => element.src),
        }));
        if (metadata.dimensions.height > maxHeight) throw new Error(`Page exceeds ${maxHeight}px capture limit`);
        metadata.capturedAt = new Date().toISOString();
        metadata.issues = issues;
        metadata.adjustments = adjustments;
        metadata.formSubmissionTested = false;
        metadata.viewportMode = device === "mobile" ? "Responsive 390px viewport; not a mobile user-agent emulation. Full-page PNG includes any horizontal overflow of the source." : "Desktop viewport";
        const screenshot = await page.screenshot({ fullPage: true, timeout: 30000 });
        artifacts.push(await save(`pages/${name}-${device}.html`, await page.content(), { kind: "rendered" }));
        artifacts.push(await save(`pages/${name}-${device}.txt`, await page.locator("body").innerText(), { kind: "text" }));
        artifacts.push(await save(`pages/${name}-${device}.json`, JSON.stringify(metadata, null, 2), { kind: "metadata" }));
        const shot = await save(`screenshots/${device}/${name}.png`, screenshot, { url, device, width: screenshot.readUInt32BE(16), height: screenshot.readUInt32BE(20) });
        const shotIndex = manifest.screenshots.findIndex((record) => record.file === shot.file);
        if (shotIndex < 0) manifest.screenshots.push(shot);
        else manifest.screenshots[shotIndex] = shot;
        return { device, metadata, artifacts };
      } catch (error) {
        manifest.failures.push({ url, device, error: error.message });
        return null;
      } finally { await page.close(); }
    };

    while (pending.size && seen.size < maxPages && totalBytes < maxTotalBytes) {
      const url = pending.values().next().value;
      pending.delete(url);
      seen.add(url);
      const slug = new URL(url).pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100) || "home";
      const name = `${slug}--${hash(url).slice(0, 8)}`;
      const devices = refreshMobile && url !== origin + "/" ? ["mobile"] : ["desktop", "mobile"];
      const captures = (await Promise.all(devices.map((device) => capture(url, device, name)))).filter(Boolean);
      const oldIndex = manifest.pages.findIndex((record) => record.requestedUrl === url);
      const old = oldIndex < 0 ? null : manifest.pages[oldIndex];
      const artifacts = captures.flatMap((item) => item.artifacts);
      const updatedFiles = new Set(artifacts.map((artifact) => artifact.file));
      const record = { requestedUrl: url, url: captures[0]?.metadata.url || url, state: captures.length === devices.length ? "complete" : "partial", artifacts: [...(old?.artifacts || []).filter((artifact) => !updatedFiles.has(artifact.file)), ...artifacts], captures: { ...old?.captures, ...Object.fromEntries(captures.map((item) => [item.device, item.metadata])) } };
      if (oldIndex < 0) manifest.pages.push(record);
      else manifest.pages[oldIndex] = record;
      if (!refreshMobile) for (const item of captures) item.metadata.links.forEach((link) => enqueue(link.url, item.metadata.url));
      manifest.pending = [...pending];
      await checkpoint();
      console.log(`[${seen.size}] ${record.state}: ${url} (${captures.length}/${devices.length} views; ${pending.size} pending)`);
    }
    manifest.pending = [...pending];
    manifest.state = manifest.failures.length || pending.size ? "partial" : "complete";
  } catch (error) {
    manifest.state = "failed";
    manifest.failures.push({ phase: "collection", error: error.message });
  } finally {
    await browser?.close();
    manifest.finishedAt = new Date().toISOString();
    if (refreshMobile) manifest.refreshRuns.at(-1).finishedAt = manifest.finishedAt;
    manifest.totalBytes = totalBytes;
    manifest.completedPages = manifest.pages.filter((page) => page.state === "complete").length;
    await checkpoint();
  }
  const verification = await verifyCollection(output);
  console.log(JSON.stringify({ output: path.relative(root, output), state: manifest.state, completedPages: manifest.completedPages, ...verification }, null, 2));
  if (manifest.state !== "complete" || !verification.valid) process.exitCode = 1;
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (!args.every((argument) => ["all", "verify", "refresh-mobile"].includes(argument) || /^--max-pages=\d+$/.test(argument) || argument.startsWith("--output="))) throw new Error("Use all, verify or refresh-mobile, --max-pages=N and --output=assets/directory");
    const output = path.resolve(root, args.find((argument) => argument.startsWith("--output="))?.slice(9) || "assets/opretail");
    if (args.includes("verify")) {
      const result = await verifyCollection(output);
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else await collect({ output, maxPages: Number(args.find((argument) => argument.startsWith("--max-pages="))?.split("=")[1] || 100), refreshMobile: args.includes("refresh-mobile") });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
