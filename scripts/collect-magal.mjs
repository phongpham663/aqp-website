import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "assets/magal");
const origin = "https://www.magalsolutions.com";
const maxAssetBytes = 25 * 1024 * 1024;
const maxTotalBytes = 350 * 1024 * 1024;
const initialPaths = [
  "/",
  "/about/",
  "/seaports-terminals/",
  "/oil-gas/",
  "/borders/",
  "/critical-sites/",
  "/fortis-x-c5i-powerful-seamless-and-scalable/",
  "/intelligent-video-analytics/",
  "/gates-access/",
  "/perimeter-intrusion-detection-systems-pids/",
  ...["fensor", "dtr", "magbar", "innofence", "tunnelguard-2"].map(
    (name) => `/perimeter-intrusion-detection-systems-pids/${name}/`,
  ),
  "/our-professional-services/",
  "/resources/",
  ...[
    "brochures-en",
    "videos",
    "ebooks-and-booklets",
    "infographics",
    "blog",
  ].map((name) => `/resource-category/${name}/`),
  "/events/",
  "/in-the-media/",
  "/join-us/",
  "/sustainability-international-standards-certification/",
  "/contact-us/",
  "/privacy-policy/",
];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = async (file, value) => {
  const temporary = `${file}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, file);
};

export function publicUrl(raw, base = origin) {
  try {
    const url = new URL(raw, base);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !["www.magalsolutions.com", "magalsolutions.com"].includes(url.hostname)
    )
      return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

export function pageUrl(raw, base = origin) {
  const result = publicUrl(raw, base);
  if (!result) return null;
  const url = new URL(result);
  if (
    url.search ||
    /^\/es(?:\/|$)/i.test(url.pathname) ||
    /\/(?:wp-admin|wp-json|wp-content|wp-includes|feed|author|tag|page)(?:\/|$)/i.test(
      url.pathname,
    ) ||
    /\.[a-z0-9]+$/i.test(url.pathname)
  )
    return null;
  return result;
}

export function robotsPolicy(text) {
  let applicable = true;
  let delayMs = 0;
  const rules = [];
  for (const line of text.split(/\r?\n/)) {
    const clean = line.split("#")[0].trim();
    const match = clean.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    const [, directive, value] = match;
    if (directive.toLowerCase() === "user-agent")
      applicable = value === "*" || /aqptechreferencecollector/i.test(value);
    if (!applicable) continue;
    if (
      directive.toLowerCase() === "crawl-delay" &&
      Number.isFinite(Number(value))
    )
      delayMs = Math.max(delayMs, Number(value) * 1000);
    if (["allow", "disallow"].includes(directive.toLowerCase()) && value) {
      const pattern = value
        .replace(/[.+?^{}()|[\]\\]/g, "\\$&")
        .replaceAll("*", ".*");
      rules.push({
        allow: directive.toLowerCase() === "allow",
        length: value.replaceAll("*", "").length,
        pattern: new RegExp(`^${pattern}`),
      });
    }
  }
  return {
    delayMs,
    allowed(url) {
      const target = new URL(url, origin);
      const matches = rules
        .filter((rule) => rule.pattern.test(target.pathname + target.search))
        .sort(
          (a, b) => b.length - a.length || Number(b.allow) - Number(a.allow),
        );
      return !matches.length || matches[0].allow;
    },
  };
}

export function assetKind(contentType, url) {
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (mime.startsWith("image/")) return "images";
  if (mime.startsWith("font/") || /(?:font|woff|opentype)/.test(mime))
    return "fonts";
  if (mime === "text/css") return "styles";
  if (/javascript|ecmascript/.test(mime)) return "scripts";
  if (
    mime === "application/pdf" ||
    /\.(?:pdf|docx?|pptx?|xlsx?|zip)(?:\?|$)/i.test(url)
  )
    return "documents";
  if (/^(?:video|audio)\//.test(mime)) return "media";
  if (mime === "application/json") return "data";
  return null;
}

function assetExtension(type, url) {
  const mime = type.split(";")[0].trim().toLowerCase();
  const known = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/x-icon": ".ico",
    "text/css": ".css",
    "text/javascript": ".js",
    "application/javascript": ".js",
    "application/json": ".json",
    "application/pdf": ".pdf",
    "font/woff": ".woff",
    "font/woff2": ".woff2",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
  };
  return (
    known[mime] ||
    path
      .extname(new URL(url).pathname)
      .replace(/[^.a-zA-Z0-9]/g, "")
      .slice(0, 12) ||
    ".bin"
  );
}

function artifactName(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "home";
  const readable = pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 100);
  return `${readable || "page"}--${hash(url).slice(0, 8)}`;
}

export async function verifyCollection(directory = output) {
  const manifest = JSON.parse(
    await readFile(path.join(directory, "manifest.json"), "utf8"),
  );
  const invalid = [];
  const files = [
    ...manifest.downloaded,
    ...manifest.screenshots,
    ...manifest.pages.flatMap((page) => page.artifacts),
  ];
  for (const record of files) {
    try {
      const target = path.resolve(directory, record.file);
      const relative = path.relative(directory, target);
      if (
        relative === ".." ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative)
      )
        throw new Error("Path escapes collection directory");
      const bytes = await readFile(target);
      if (
        !bytes.length ||
        bytes.length !== record.bytes ||
        hash(bytes) !== record.sha256
      )
        throw new Error("Invalid size or checksum");
      if (
        record.file.endsWith(".png") &&
        (!bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
          bytes.readUInt32BE(16) < 1 ||
          bytes.readUInt32BE(20) < 1)
      )
        throw new Error("Invalid PNG");
      if (
        record.file.endsWith(".pdf") &&
        bytes.subarray(0, 5).toString() !== "%PDF-"
      )
        throw new Error("Invalid PDF");
    } catch (error) {
      invalid.push({ file: record.file, error: error.message });
    }
  }
  const result = {
    verifiedAt: new Date().toISOString(),
    valid: !invalid.length,
    pages: manifest.pages.length,
    screenshots: manifest.screenshots.length,
    assets: manifest.downloaded.length,
    inlineStyleFiles: manifest.pages.filter((page) =>
      page.artifacts.some(
        (artifact) =>
          artifact.kind === "styles" &&
          artifact.source === "embedded in source HTML",
      ),
    ).length,
    totalAssetBytes: manifest.downloaded.reduce(
      (total, asset) => total + asset.bytes,
      0,
    ),
    assetTypes: Object.fromEntries(
      [...new Set(manifest.downloaded.map((asset) => asset.kind))].map(
        (kind) => [
          kind,
          manifest.downloaded.filter((asset) => asset.kind === kind).length,
        ],
      ),
    ),
    failures: manifest.failures.length,
    skipped: manifest.skipped.length,
    invalid,
  };
  await json(path.join(directory, "verification.json"), result);
  return result;
}

async function collect({
  maxPages = 36,
  maxDocuments = 12,
  downloadsOnly = false,
} = {}) {
  for (const folder of [
    "screenshots/desktop",
    "screenshots/mobile",
    "pages",
    "images",
    "fonts",
    "styles",
    "scripts",
    "documents",
    "media",
    "data",
    "discovery",
  ])
    await mkdir(path.join(output, folder), { recursive: true });
  const manifest = downloadsOnly
    ? JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8"))
    : {
        source: origin,
        startedAt: new Date().toISOString(),
        state: "collecting",
        crawlDelayMs: 10000,
        scope: `Up to ${maxPages} public English pages, desktop/mobile viewport screenshots, rendered HTML/text/metadata and same-domain public resources. Up to ${maxDocuments} additional linked documents/media per download run, 25 MB per asset. Not a complete or offline-rewritten website mirror.`,
        rightsNote:
          "Content, images and trademarks belong to their respective owners. Collection does not grant reuse rights. No forms are submitted, no logins or access-control bypasses are attempted, and external videos are indexed rather than downloaded.",
        pages: [],
        screenshots: [],
        downloaded: [],
        skipped: [],
        failures: [],
        externalReferences: [],
        documentReferences: [],
      };
  if (manifest.source !== origin)
    throw new Error("Collection source does not match Magal Solutions");
  manifest.state = "collecting";
  if (downloadsOnly) {
    manifest.downloadRuns ??= [];
    manifest.downloadRuns.push({
      startedAt: new Date().toISOString(),
      maxDocuments,
    });
    manifest.scope = manifest.scope.replace(
      "additional linked documents/media,",
      "additional linked documents/media per download run,",
    );
  }
  const saveManifest = () => json(path.join(output, "manifest.json"), manifest);
  let policy = { delayMs: 10000, allowed: () => true };
  let lastCrawl = 0;
  const crawlSlot = async () => {
    await delay(Math.max(0, lastCrawl + manifest.crawlDelayMs - Date.now()));
    lastCrawl = Date.now();
  };
  async function fetchPublic(raw, maximum = maxAssetBytes) {
    let url = publicUrl(raw);
    if (!url) throw new Error("External or unsupported URL");
    for (let redirects = 0; redirects < 6; redirects++) {
      if (!policy.allowed(url)) throw new Error("Disallowed by robots.txt");
      await crawlSlot();
      const response = await fetch(url, {
        redirect: "manual",
        headers: {
          "User-Agent": "AQPTechReferenceCollector/1.0",
          Accept: "*/*",
        },
        signal: AbortSignal.timeout(60000),
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const redirected = publicUrl(response.headers.get("location"), url);
        await response.body?.cancel();
        if (!redirected) throw new Error("Redirect leaves the allowed website");
        url = redirected;
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(`HTTP ${response.status}`);
      }
      if (Number(response.headers.get("content-length")) > maximum) {
        await response.body?.cancel();
        throw new Error("Asset exceeds byte limit");
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > maximum) {
          await response.body.cancel().catch(() => {});
          throw new Error("Asset exceeds byte limit");
        }
        chunks.push(chunk);
      }
      return {
        url,
        bytes: Buffer.concat(chunks),
        contentType: response.headers.get("content-type") || "",
      };
    }
    throw new Error("Too many redirects");
  }
  const saveArtifact = async (file, bytes) => {
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
    await writeFile(path.join(output, file), buffer);
    return { file, bytes: buffer.length, sha256: hash(buffer) };
  };
  try {
    const robots = await fetchPublic(`${origin}/robots.txt`, 1024 * 1024);
    await saveArtifact("discovery/robots.txt", robots.bytes);
    policy = robotsPolicy(robots.bytes.toString());
    manifest.crawlDelayMs = Math.max(10000, policy.delayMs);
  } catch (error) {
    manifest.failures.push({ phase: "robots", error: error.message });
  }
  try {
    const sitemap = await fetchPublic(
      `${origin}/sitemap_index.xml`,
      5 * 1024 * 1024,
    );
    await saveArtifact("discovery/sitemap_index.xml", sitemap.bytes);
  } catch (error) {
    manifest.failures.push({ phase: "sitemap", error: error.message });
  }
  await saveManifest();

  const { chromium } = await import(
    process.env.PLAYWRIGHT_MODULE
      ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
      : "playwright"
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const assets = new Map(
    manifest.downloaded.map((asset) => [asset.url, asset]),
  );
  const pending = new Set();
  const documents = new Set(manifest.documentReferences);
  const external = new Set(manifest.externalReferences);
  let totalBytes = manifest.downloaded.reduce(
    (total, asset) => total + asset.bytes,
    0,
  );
  let currentSource = origin;
  const skip = (url, reason) => {
    if (
      !manifest.skipped.some(
        (item) => item.url === url && item.reason === reason,
      )
    )
      manifest.skipped.push({ url, reason });
  };
  async function saveAsset({ url, bytes, contentType }, sourcePage) {
    const kind = assetKind(contentType, url);
    if (!kind || !bytes.length) {
      skip(url, "Unsupported or empty resource");
      return;
    }
    if (
      bytes.length > maxAssetBytes ||
      totalBytes + bytes.length > maxTotalBytes
    ) {
      skip(url, "Asset or collection exceeds byte limit");
      return;
    }
    if (
      kind === "documents" &&
      /\.pdf(?:\?|$)/i.test(url) &&
      bytes.subarray(0, 5).toString() !== "%PDF-"
    )
      throw new Error("Document is not a valid PDF");
    if (
      ["images", "fonts", "scripts", "styles", "media"].includes(kind) &&
      /^\s*(?:<!doctype\s+html|<html)/i.test(bytes.subarray(0, 200).toString())
    )
      throw new Error("Resource returned HTML rather than its declared type");
    let original;
    try {
      original = decodeURIComponent(path.basename(new URL(url).pathname));
    } catch {
      original = "asset";
    }
    const stem =
      path
        .parse(original)
        .name.replace(/[^a-zA-Z0-9_-]/g, "-")
        .slice(0, 100) || "asset";
    const file = `${kind}/${stem}--${hash(url).slice(0, 10)}${assetExtension(contentType, url)}`;
    const artifact = await saveArtifact(file, bytes);
    const record = {
      url,
      kind,
      contentType,
      ...artifact,
      sourcePages: [sourcePage],
    };
    assets.set(url, record);
    manifest.downloaded.push(record);
    totalBytes += bytes.length;
    if (manifest.downloaded.length % 25 === 0)
      console.log(
        `ASSETS ${manifest.downloaded.length} (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`,
      );
  }
  async function observeResponse(response, sourcePage) {
    const url = publicUrl(response.url());
    if (!url || response.request().method() !== "GET") return;
    const type = response.headers()["content-type"] || "";
    const kind = assetKind(type, url);
    if (!kind) return;
    if (assets.has(url)) {
      const record = assets.get(url);
      if (record && !record.sourcePages.includes(sourcePage))
        record.sourcePages.push(sourcePage);
      return;
    }
    if (kind === "media" || response.status() === 206) {
      documents.add(url);
      skip(
        url,
        "Media indexed for bounded full-file download; partial responses are not archived",
      );
      return;
    }
    if (!response.ok()) {
      skip(url, `Resource HTTP ${response.status()}`);
      return;
    }
    if (Number(response.headers()["content-length"]) > maxAssetBytes) {
      skip(url, "Asset exceeds byte limit");
      return;
    }
    assets.set(url, null);
    try {
      await saveAsset(
        { url, bytes: await response.body(), contentType: type },
        sourcePage,
      );
    } catch (error) {
      manifest.failures.push({ phase: "asset", url, error: error.message });
    }
  }
  page.on("response", (response) => {
    const work = observeResponse(response, currentSource).catch((error) =>
      manifest.failures.push({
        phase: "asset",
        url: response.url(),
        error: error.message,
      }),
    );
    pending.add(work);
    work.finally(() => pending.delete(work));
  });
  const queue = downloadsOnly
    ? []
    : initialPaths.map((relative) => `${origin}${relative}`);
  const queued = new Set(queue);
  let stopped = false;
  try {
    while (queue.length && manifest.pages.length < maxPages && !stopped) {
      const url = queue.shift();
      if (!policy.allowed(url)) {
        skip(url, "Disallowed by robots.txt");
        continue;
      }
      const issues = [];
      const errorListener = (error) => issues.push(error.message);
      page.on("pageerror", errorListener);
      currentSource = url;
      try {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await crawlSlot();
        const response = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        if (!response?.ok()) {
          if ([401, 403, 429].includes(response?.status())) stopped = true;
          throw new Error(`Page HTTP ${response?.status()}`);
        }
        if (!pageUrl(page.url()))
          throw new Error("Page redirected outside public English scope");
        await page
          .waitForLoadState("load", { timeout: 15000 })
          .catch(() =>
            issues.push(
              "Load event exceeded 15 seconds; captured rendered content",
            ),
          );
        const sourceHtml = await response.text();
        const result = {
          url: page.url(),
          requestedUrl: url,
          title: "",
          capturedAt: new Date().toISOString(),
          status: response.status(),
          artifacts: [],
          devices: [],
          issues,
        };
        result.artifacts.push(
          await saveArtifact(
            `pages/${artifactName(url)}-source.html`,
            sourceHtml,
          ),
        );
        for (const [device, viewport] of [
          ["desktop", { width: 1440, height: 1000 }],
          ["mobile", { width: 390, height: 844 }],
        ]) {
          await page.setViewportSize(viewport);
          await page.evaluate(async () => {
            await Promise.race([
              document.fonts.ready,
              new Promise((resolve) => setTimeout(resolve, 7000)),
            ]);
            for (
              let y = 0;
              y < Math.min(document.documentElement.scrollHeight, 40000);
              y += innerHeight * 0.85
            ) {
              scrollTo(0, y);
              await new Promise((resolve) => setTimeout(resolve, 130));
            }
            await Promise.race([
              Promise.all(
                [...document.images].map((image) =>
                  image.decode().catch(() => {}),
                ),
              ),
              new Promise((resolve) => setTimeout(resolve, 7000)),
            ]);
            for (const video of document.querySelectorAll("video"))
              video.pause();
            for (const animation of document.getAnimations()) animation.pause();
            scrollTo(0, 0);
            await new Promise((resolve) => setTimeout(resolve, 500));
          });
          for (const selector of [
            ".cky-btn-reject",
            "#cookie_action_close_header_reject",
          ]) {
            const reject = page.locator(selector).first();
            if (await reject.isVisible().catch(() => false))
              await reject.click({ timeout: 2000 }).catch(() => {});
          }
          const metadata = await page.evaluate(() => {
            const visible = (element) => element.getClientRects().length > 0;
            const links = [...document.querySelectorAll("a[href]")].map(
              (link) => ({
                url: link.href,
                text: link.innerText.trim(),
                download: link.hasAttribute("download"),
              }),
            );
            const references = new Set();
            const add = (raw) => {
              try {
                const url = new URL(raw, location.href);
                if (["https:", "http:"].includes(url.protocol)) {
                  url.hash = "";
                  references.add(url.href);
                }
              } catch {}
            };
            for (const image of document.images) {
              add(image.currentSrc);
              for (const name of ["src", "data-src", "data-lazy-src"])
                if (image.getAttribute(name)) add(image.getAttribute(name));
              for (const entry of (image.srcset || "").split(","))
                if (entry.trim()) add(entry.trim().split(/\s+/)[0]);
            }
            for (const element of document.querySelectorAll("*"))
              for (const match of getComputedStyle(
                element,
              ).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))
                add(match[1]);
            for (const element of document.querySelectorAll(
              "video,video source,audio,audio source,iframe",
            ))
              if (element.src) add(element.src);
            const styles = [...document.querySelectorAll("h1,h2,h3,h4,p")]
              .filter(visible)
              .slice(0, 50)
              .map((element) => {
                const style = getComputedStyle(element);
                return {
                  tag: element.tagName,
                  text: element.innerText.trim().slice(0, 300),
                  font: style.fontFamily,
                  size: style.fontSize,
                  weight: style.fontWeight,
                  color: style.color,
                };
              });
            return {
              url: location.href,
              title: document.title,
              description:
                document.querySelector('meta[name="description"]')?.content ||
                "",
              lang: document.documentElement.lang,
              viewport: { width: innerWidth, height: innerHeight },
              dimensions: {
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
              },
              headings: [...document.querySelectorAll("h1,h2,h3,h4")]
                .filter(visible)
                .map((element) => ({
                  tag: element.tagName,
                  text: element.innerText.trim(),
                })),
              text: document.body.innerText,
              links,
              references: [...references],
              typography: styles,
              images: [...document.images].map((image) => ({
                src: image.currentSrc || image.src,
                alt: image.alt,
                loaded: image.complete && image.naturalWidth > 0,
                width: image.naturalWidth,
                height: image.naturalHeight,
              })),
            };
          });
          const name = `${artifactName(url)}-${device}`;
          const html = await page.content();
          result.title = metadata.title;
          result.artifacts.push(await saveArtifact(`pages/${name}.html`, html));
          result.artifacts.push(
            await saveArtifact(`pages/${name}.txt`, metadata.text),
          );
          result.artifacts.push(
            await saveArtifact(
              `pages/${name}.json`,
              `${JSON.stringify({ ...metadata, text: undefined, capturedAt: result.capturedAt, device, emulation: "Responsive viewport resize of the same rendered page; not a distinct mobile user-agent", issues }, null, 2)}\n`,
            ),
          );
          result.devices.push({
            device,
            viewport,
            dimensions: metadata.dimensions,
          });
          const screenshotFile = `screenshots/${device}/${artifactName(url)}.png`;
          const truncated = metadata.dimensions.height > 40000;
          const screenshot = await page.screenshot({
            fullPage: !truncated,
            ...(truncated
              ? {
                  clip: {
                    x: 0,
                    y: 0,
                    width: Math.max(viewport.width, metadata.dimensions.width),
                    height: 40000,
                  },
                }
              : {}),
            animations: "disabled",
            timeout: 60000,
          });
          manifest.screenshots.push({
            url: metadata.url,
            device,
            viewport,
            truncated,
            ...(await saveArtifact(screenshotFile, screenshot)),
          });
          if (new URL(url).pathname === "/")
            manifest.screenshots.push({
              url: metadata.url,
              device,
              viewport,
              area: "initial-viewport",
              ...(await saveArtifact(
                `screenshots/${device}/home-viewport.png`,
                await page.screenshot({
                  animations: "disabled",
                  timeout: 60000,
                }),
              )),
            });
          for (const reference of metadata.references)
            if (!publicUrl(reference)) external.add(reference);
          for (const link of metadata.links) {
            const candidate = pageUrl(link.url);
            if (candidate && !queued.has(candidate)) {
              queue.push(candidate);
              queued.add(candidate);
            }
            const asset = publicUrl(link.url);
            if (
              asset &&
              /\.(?:pdf|docx?|pptx?|xlsx?|zip|mp4|webm)(?:\?|$)/i.test(asset)
            )
              documents.add(asset);
            if (!asset && /^https?:/.test(link.url)) external.add(link.url);
          }
        }
        await Promise.all([...pending]);
        manifest.pages.push(result);
        console.log(
          `CAPTURE ${manifest.pages.length}/${maxPages} ${new URL(url).pathname} | desktop + mobile | ${manifest.downloaded.length} assets`,
        );
      } catch (error) {
        manifest.failures.push({ phase: "page", url, error: error.message });
        console.error(`FAILED ${url}: ${error.message}`);
        if (new URL(url).pathname === "/") stopped = true;
      } finally {
        page.off("pageerror", errorListener);
      }
      manifest.externalReferences = [...external];
      manifest.documentReferences = [...documents];
      await saveManifest();
    }
    await Promise.all([...pending]);
    let additional = 0;
    for (const url of [...documents].sort(
      (a, b) =>
        Number(/\.(?:mp4|webm)(?:\?|$)/i.test(a)) -
        Number(/\.(?:mp4|webm)(?:\?|$)/i.test(b)),
    )) {
      if (assets.get(url)) continue;
      if (
        downloadsOnly &&
        manifest.failures.some(
          (failure) =>
            failure.url === url && /HTTP (?:401|403|429)/.test(failure.error),
        )
      )
        continue;
      if (stopped || additional >= maxDocuments) {
        skip(url, "Additional document/media limit reached or crawl stopped");
        continue;
      }
      additional++;
      try {
        const resource = await fetchPublic(url);
        await saveAsset(resource, "linked-public-resource");
        if (assets.get(url))
          manifest.skipped = manifest.skipped.filter(
            (item) => item.url !== url,
          );
        console.log(
          `DOWNLOAD ${additional}/${maxDocuments} ${new URL(url).pathname}`,
        );
      } catch (error) {
        if (/byte limit|robots|Redirect leaves/.test(error.message))
          skip(url, error.message);
        else
          manifest.failures.push({
            phase: "document",
            url,
            error: error.message,
          });
      }
      await saveManifest();
    }
  } finally {
    await context.close();
    await browser.close();
    await Promise.all([...pending]);
    manifest.finishedAt = new Date().toISOString();
    manifest.state = stopped ? "stopped-by-access-response" : "complete";
    if (!downloadsOnly) manifest.remainingPages = queue.length;
    manifest.externalReferences = [...external];
    manifest.documentReferences = [...documents];
    await saveManifest();
  }
  for (const record of manifest.pages) {
    const source = record.artifacts.find((artifact) =>
      artifact.file.endsWith("-source.html"),
    );
    if (!source) continue;
    const html = await readFile(path.join(output, source.file), "utf8");
    const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
      .map((match) => match[1].trim())
      .filter(Boolean);
    if (!styles.length) continue;
    const file = `styles/${artifactName(record.requestedUrl || record.url)}-inline.css`;
    const artifact = await saveArtifact(file, styles.join("\n\n"));
    record.artifacts = record.artifacts.filter(
      (existing) => existing.file !== file,
    );
    record.artifacts.push({
      ...artifact,
      kind: "styles",
      source: "embedded in source HTML",
    });
  }
  await saveManifest();
  await json(path.join(output, "analysis.json"), {
    source: origin,
    analyzedAt: new Date().toISOString(),
    home: manifest.pages.find((record) => new URL(record.url).pathname === "/"),
    collection: {
      pages: manifest.pages.length,
      screenshots: manifest.screenshots.length,
      assets: manifest.downloaded.length,
      crawlDelayMs: manifest.crawlDelayMs,
    },
    scope: manifest.scope,
    rightsNote: manifest.rightsNote,
  });
  const result = await verifyCollection();
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid || !manifest.pages.length) process.exitCode = 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const args = process.argv.slice(2);
    const phase = args.find((argument) => !argument.startsWith("--")) || "all";
    if (
      !args.every(
        (argument) =>
          ["all", "download", "verify"].includes(argument) ||
          /^--max-(?:pages|documents)=\d+$/.test(argument),
      )
    )
      throw new Error(
        "Use all, download or verify, optionally --max-pages=N --max-documents=N",
      );
    if (phase === "verify") {
      const result = await verifyCollection();
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else if (["all", "download"].includes(phase)) {
      const option = (name, fallback) =>
        Number(
          args
            .find((argument) => argument.startsWith(`--${name}=`))
            ?.split("=")[1] ?? fallback,
        );
      const maxPages = option("max-pages", 36);
      const maxDocuments = option("max-documents", 12);
      if (maxPages < 1 || maxPages > 100 || maxDocuments > 100)
        throw new Error("max-pages must be 1–100; max-documents must be 0–100");
      await collect({
        maxPages,
        maxDocuments,
        downloadsOnly: phase === "download",
      });
    } else throw new Error("Phase must be all, download or verify");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
