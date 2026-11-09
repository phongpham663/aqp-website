import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { imageType } from "./collect-iclab.mjs";
import { robotsPolicy, verifyCollection } from "./collect-magal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = "https://wt-security.com/en-gb/application/event-security";
const origin = new URL(source).origin;
const targets = {
  "event-security": "Event Security",
  "construction-site-security": "Construction Site Security",
};
const cdn = "https://a.storyblok.com";
const publicDataPaths = ["/api/solutionsData", "/api/newsData"];
const maxImageBytes = 16 * 1024 * 1024;
const maxTotalBytes = 100 * 1024 * 1024;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const saveJson = async (file, value) => {
  await writeFile(`${file}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  await rename(`${file}.tmp`, file);
};

export function watchtowerTarget(slug = "event-security") {
  if (!Object.hasOwn(targets, slug)) throw new Error("Use event-security or construction-site-security");
  return { slug, name: targets[slug], source: `${origin}/en-gb/application/${slug}`, output: path.join(root, "assets/watchtower", slug) };
}

export function publicResource(raw, base = source, pageSource = source) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  if (!Object.keys(targets).some((slug) => watchtowerTarget(slug).source === pageSource)) return null;
  try {
    const url = new URL(raw, base);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    url.hash = "";
    if (url.href === pageSource || url.href === `${pageSource}/`) return url.href;
    if (url.origin === cdn && (url.pathname.startsWith("/f/236211/") || url.pathname === "/robots.txt")) return url.href;
    if (url.origin !== origin) return null;
    if (publicDataPaths.includes(url.pathname) && [...url.searchParams].every(([key, value]) => (key === "locale" && value === "en-gb") || (url.pathname === "/api/newsData" && key === "amount" && value === "2"))) return url.href;
    if (/\/(?:api|admin|login|auth|account|dashboard)(?:\/|$)/i.test(url.pathname)) return null;
    if (url.pathname === "/robots.txt" || url.pathname.startsWith("/_nuxt/") || url.pathname === `${new URL(pageSource).pathname}/_payload.json` || /\.(?:png|jpe?g|webp|svg|gif|avif|ico|woff2?|ttf|css|js)$/i.test(url.pathname)) return url.href;
  } catch {}
  return null;
}

export async function fetchResource(raw, { maximum = maxImageBytes, allowed = () => true, beforeRequest = async () => {}, request = fetch, pageSource = source } = {}) {
  let url = publicResource(raw, pageSource, pageSource);
  if (!url) throw new Error("URL outside public page and asset scope");
  for (let attempt = 0; attempt < 6; attempt++) {
    if (!allowed(url)) throw new Error("Disallowed by robots.txt");
    await beforeRequest(url);
    const response = await request(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(45000),
      headers: { "User-Agent": "AQPTechReferenceCollector/1.0" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = publicResource(response.headers.get("location"), url, pageSource);
      await response.body?.cancel();
      if (!next) throw new Error("Redirect outside public page and asset scope");
      url = next;
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`HTTP ${response.status}`);
    }
    if (Number(response.headers.get("content-length")) > maximum) {
      await response.body?.cancel();
      throw new Error("Byte limit exceeded");
    }
    const chunks = [];
    let size = 0;
    try {
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > maximum) throw new Error("Byte limit exceeded");
        chunks.push(chunk);
      }
    } catch (error) {
      await response.body?.cancel().catch(() => {});
      throw error;
    }
    return { url, bytes: Buffer.concat(chunks), contentType: response.headers.get("content-type") || "" };
  }
  throw new Error("Too many redirects");
}

export function analyzePage(page) {
  return {
    source: page.url,
    analyzedAt: new Date().toISOString(),
    language: "vi",
    title: page.title,
    description: page.description,
    content: { headings: page.headings, paragraphs: page.paragraphs },
    conversion: {
      callsToAction: page.links.filter((link) => /quote|contact|request|touch/i.test(link.text)),
      forms: page.forms,
      formSubmissionTested: false,
    },
    visualDesign: { typography: page.typography, colors: page.colors, dimensions: page.dimensions },
    quality: {
      h1Count: page.headings.filter((heading) => heading.tag === "H1").length,
      missingDescription: !page.description,
      emptyAltImages: page.images.filter((image) => !image.alt),
      brokenImages: page.images.filter((image) => image.src && !image.naturalWidth),
      issues: page.issues,
    },
    images: page.images,
    sourceClaimsNotIndependentlyVerified: true,
    limitations: "Phân tích nội dung và giao diện công khai của một trang tại thời điểm thu thập. Các mô tả về dịch vụ thuộc Watchtower, chưa được kiểm chứng độc lập. Không đăng nhập, gửi biểu mẫu hoặc thu thập dữ liệu khách hàng; không phải bản sao website hoạt động offline. Nội dung, hình ảnh và nhãn hiệu vẫn thuộc chủ sở hữu, việc tải về không cấp quyền tái sử dụng.",
  };
}

async function analyze(slug = "event-security") {
  const { output, name } = watchtowerTarget(slug);
  const page = JSON.parse(await readFile(path.join(output, `pages/${slug}-desktop.json`), "utf8"));
  const manifest = JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8"));
  const analysis = analyzePage(page);
  analysis.collection = { images: manifest.downloaded.length, imageBytes: manifest.downloaded.reduce((sum, record) => sum + record.bytes, 0), failures: manifest.failures, skipped: manifest.skipped };
  const lines = [
    `PHAN TICH TRANG ${name.toUpperCase()} - WATCHTOWER`,
    `Nguồn: ${analysis.source}`,
    `Thời điểm: ${analysis.analyzedAt}`,
    `Tiêu đề: ${analysis.title}`,
    `Mô tả SEO: ${analysis.description || "Không ghi nhận"}`,
    "", "CẤU TRÚC NỘI DUNG",
    ...analysis.content.headings.map((heading) => `${heading.tag}: ${heading.text}`),
    "", "NỘI DUNG GỐC",
    ...analysis.content.paragraphs,
    "", "ĐIỂM CHUYỂN ĐỔI",
    ...analysis.conversion.callsToAction.map((link) => `${link.text}: ${link.url}`),
    `Số biểu mẫu HTML: ${analysis.conversion.forms.length}. Không gửi thử biểu mẫu.`,
    "", "GIAO DIỆN & CHẤT LƯỢNG",
    `Số H1: ${analysis.quality.h1Count}; ảnh alt trống: ${analysis.quality.emptyAltImages.length}; ảnh chưa tải: ${analysis.quality.brokenImages.length}.`,
    ...analysis.visualDesign.typography.map((style) => `${style.tag}: ${style.font}, ${style.size}, ${style.weight}, ${style.color}`),
    "", "DỮ LIỆU ĐÃ TẢI",
    `Ảnh: ${analysis.collection.images}; dung lượng: ${(analysis.collection.imageBytes / 1024 / 1024).toFixed(2)} MB.`,
    `Lỗi thu thập: ${analysis.collection.failures.length}.`,
    "", analysis.limitations,
  ];
  await saveJson(path.join(output, "analysis.json"), analysis);
  await writeFile(path.join(output, "analysis.txt"), `${lines.join("\n")}\n`);
  return analysis;
}

async function collect({ slug = "event-security", screenshotsOnly = false } = {}) {
  const { source, output, name } = watchtowerTarget(slug);
  for (const folder of ["pages", "screenshots/desktop", "screenshots/mobile", "discovery", ...(screenshotsOnly ? [] : ["images"])]) await mkdir(path.join(output, folder), { recursive: true });
  const manifest = {
    source, startedAt: new Date().toISOString(), state: "collecting",
    mode: screenshotsOnly ? "screenshot" : "all",
    scope: `One public ${name} page, original/rendered HTML, text, embedded JSON, its two public display-data endpoints, metadata and desktop/mobile screenshots.${screenshotsOnly ? " No separate image downloads." : " Publicly referenced images from wt-security.com and its Storyblok space 236211; 16 MB per image, 100 MB total images."} No login, form submissions, portal, other pages, video streams or tracking requests.`,
    rightsNote: "Downloaded content, images and trademarks belong to their owners; collection does not grant reuse rights.",
    pages: [], screenshots: [], downloaded: [], failures: [], skipped: [], imageReferences: [], robots: [], blockedRequestCounts: {},
  };
  const saveManifest = () => saveJson(path.join(output, "manifest.json"), manifest);
  const saveArtifact = async (file, bytes) => {
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
    await writeFile(path.join(output, file), buffer);
    return { file, bytes: buffer.length, sha256: hash(buffer) };
  };
  const policies = new Map();
  const lastRequest = new Map();
  const throttle = async (url) => {
    const host = new URL(url).origin;
    const interval = Math.max(500, policies.get(host)?.delayMs || 0);
    await delay(Math.max(0, (lastRequest.get(host) || 0) + interval - Date.now()));
    lastRequest.set(host, Date.now());
  };
  const allowed = (url) => policies.get(new URL(url).origin)?.allowed(url) ?? true;
  for (const host of [origin, cdn]) {
    try {
      const resource = await fetchResource(`${host}/robots.txt`, { maximum: 1024 * 1024, pageSource: source });
      policies.set(host, robotsPolicy(resource.bytes.toString()));
      manifest.robots.push({ origin: host, status: "available", artifact: await saveArtifact(`discovery/${new URL(host).hostname}-robots.txt`, resource.bytes) });
    } catch (error) {
      // A CDN may not publish robots.txt even though its referenced images are public.
      if (!/^HTTP 4\d\d$/.test(error.message) || error.message === "HTTP 429") throw error;
      manifest.robots.push({ origin: host, status: "unavailable", error: error.message });
    }
  }
  if (!allowed(source)) throw new Error(`${name} page disallowed by robots.txt`);
  await saveManifest();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const references = new Set();
  const issues = [];
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce", serviceWorkers: "block" });
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = publicResource(request.url(), source, source);
      if (request.method() !== "GET" || !url || !allowed(url) || ["media", "websocket"].includes(request.resourceType())) {
        const key = `${request.method()} ${new URL(request.url()).hostname} ${request.resourceType()}`;
        manifest.blockedRequestCounts[key] = (manifest.blockedRequestCounts[key] || 0) + 1;
        return route.abort();
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => issues.push(error.message));
    page.on("response", (response) => {
      if (response.headers()["content-type"]?.startsWith("image/") && publicResource(response.url(), source, source)) references.add(response.url());
    });
    const original = await fetchResource(source, { maximum: 8 * 1024 * 1024, allowed, beforeRequest: throttle, pageSource: source });
    if (!/text\/html/i.test(original.contentType)) throw new Error("Source response is not HTML");
    const record = { url: original.url, status: 200, capturedAt: new Date().toISOString(), artifacts: [], issues };
    manifest.pages.push(record);
    record.artifacts.push(await saveArtifact(`pages/${slug}-source.html`, original.bytes));
    for (const dataPath of publicDataPaths) {
      const query = dataPath === "/api/newsData" ? "?amount=2&locale=en-gb" : "?locale=en-gb";
      const resource = await fetchResource(`${origin}${dataPath}${query}`, { maximum: 8 * 1024 * 1024, allowed, beforeRequest: throttle, pageSource: source });
      JSON.parse(resource.bytes.toString());
      record.artifacts.push(await saveArtifact(`pages/${slug}-${path.basename(dataPath)}.json`, resource.bytes));
    }
    await throttle(source);
    const response = await page.goto(source, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (!response?.ok() || ![source, `${source}/`].includes(page.url())) throw new Error(`Page HTTP ${response?.status()} or out-of-scope redirect`);
    await page.waitForSelector("h1", { timeout: 15000 });
    await page.waitForLoadState("load", { timeout: 15000 }).catch(() => issues.push("Load event timeout; captured available rendered content"));
    for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
      await page.setViewportSize(viewport);
      await page.evaluate(async () => {
        await Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 7000))]);
        for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 30000); y += innerHeight * 0.8) {
          scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 180));
        }
        await Promise.race([Promise.all([...document.images].map((image) => image.decode().catch(() => {}))), new Promise((resolve) => setTimeout(resolve, 7000))]);
        for (const video of document.querySelectorAll("video")) video.pause();
        scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 400));
      });
      const metadata = await page.evaluate(() => {
        const visible = (element) => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
        const content = document.querySelector("main") || document.body;
        const imageReferences = new Set();
        const add = (raw) => { try { if (raw) imageReferences.add(new URL(raw, location.href).href); } catch {} };
        const images = [...document.images].map((image) => {
          for (const value of [image.currentSrc, image.src, image.getAttribute("data-src")]) add(value);
          for (const entry of (image.srcset || "").split(",")) add(entry.trim().split(/\s+/)[0]);
          return { src: image.currentSrc || image.src, alt: image.alt, width: image.width, height: image.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight };
        });
        for (const element of document.querySelectorAll("*")) {
          for (const match of getComputedStyle(element).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)) add(match[1]);
        }
        const typography = [...content.querySelectorAll("h1,h2,h3,p")].filter(visible).slice(0, 40).map((element) => {
          const style = getComputedStyle(element);
          return { tag: element.tagName, text: element.innerText.trim().slice(0, 250), font: style.fontFamily, size: style.fontSize, weight: style.fontWeight, color: style.color };
        });
        return {
          url: location.href, title: document.title, lang: document.documentElement.lang,
          description: document.querySelector('meta[name="description"]')?.content || "",
          viewport: { width: innerWidth, height: innerHeight },
          dimensions: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          headings: [...content.querySelectorAll("h1,h2,h3,h4")].filter(visible).map((element) => ({ tag: element.tagName, text: element.innerText.trim() })).filter((heading) => heading.text),
          paragraphs: [...new Set([...content.querySelectorAll("p,div")].filter(visible).filter((element) => element.tagName === "P" || [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 40)).map((element) => element.innerText.trim()).filter(Boolean))],
          contentText: content.innerText,
          links: [...document.querySelectorAll("a[href]")].map((link) => ({ text: link.innerText.trim(), url: link.href })),
          forms: [...document.forms].map((form) => ({ action: form.action, method: form.method, fields: [...form.querySelectorAll("input,select,textarea")].map((field) => ({ name: field.name, type: field.type, label: field.labels?.[0]?.innerText || field.placeholder || "" })) })),
          images, imageReferences: [...imageReferences], typography,
          colors: [...new Set(typography.map((style) => style.color))],
          stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href),
          scripts: [...document.querySelectorAll("script[src]")].map((script) => script.src),
          embeddedData: [...document.querySelectorAll('script[type="application/json"],script[type="application/ld+json"]')].map((script) => ({ id: script.id, type: script.type, text: script.textContent })),
        };
      });
      metadata.issues = [...issues];
      for (const url of metadata.imageReferences) if (publicResource(url, source, source)) references.add(url);
      record.title = metadata.title;
      record.artifacts.push(await saveArtifact(`pages/${slug}-${device}.html`, await page.content()));
      record.artifacts.push(await saveArtifact(`pages/${slug}-${device}.txt`, await page.locator("body").innerText()));
      record.artifacts.push(await saveArtifact(`pages/${slug}-${device}.json`, `${JSON.stringify(metadata, null, 2)}\n`));
      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      manifest.screenshots.push({ device, url: source, ...await saveArtifact(`screenshots/${device}/${slug}.png`, screenshot) });
      if (device === "desktop") {
        record.artifacts.push(await saveArtifact(`pages/${slug}-embedded-data.json`, `${JSON.stringify(metadata.embeddedData, null, 2)}\n`));
        record.artifacts.push(await saveArtifact(`pages/${slug}-content.txt`, metadata.contentText));
      }
      console.log(`CAPTURE ${device}: ${metadata.dimensions.width}x${metadata.dimensions.height}, ${metadata.images.length} images`);
    }
  } catch (error) {
    manifest.failures.push({ phase: "page", url: source, error: error.message });
  } finally {
    await browser.close();
    await saveManifest();
  }
  // Keep originals as well as responsive variants used by the rendered page.
  for (const raw of [...references]) {
    const url = new URL(raw);
    if (url.origin === cdn && url.pathname.includes("/m/")) references.add(`${cdn}${url.pathname.split("/m/")[0]}`);
  }
  let totalBytes = 0;
  manifest.imageReferences = [...references];
  for (const url of screenshotsOnly ? [] : references) {
    try {
      const remaining = maxTotalBytes - totalBytes;
      if (remaining <= 0) throw new Error("Collection byte limit exceeded");
      const resource = await fetchResource(url, { maximum: Math.min(maxImageBytes, remaining), allowed, beforeRequest: throttle, pageSource: source });
      const type = imageType(resource.bytes);
      if (!type) throw new Error("Response is not a supported image");
      const pathname = new URL(url).pathname.split("/m/")[0];
      const stem = path.parse(path.basename(pathname)).name.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100) || "image";
      const artifact = await saveArtifact(`images/${stem}--${hash(url).slice(0, 10)}.${type}`, resource.bytes);
      manifest.downloaded.push({ url, kind: "images", type, contentType: resource.contentType, sourcePages: [source], ...artifact });
      totalBytes += resource.bytes.length;
      console.log(`IMAGE ${manifest.downloaded.length}: ${stem} (${(resource.bytes.length / 1024).toFixed(1)} KB)`);
    } catch (error) {
      manifest.failures.push({ phase: "image", url, error: error.message });
      if (/HTTP (401|403|429)/.test(error.message)) break;
    }
  }
  manifest.finishedAt = new Date().toISOString();
  manifest.state = manifest.failures.length ? "partial" : "complete";
  await saveManifest();
  if (!screenshotsOnly && manifest.pages[0]?.artifacts.some((artifact) => artifact.file === `pages/${slug}-desktop.json`)) await analyze(slug);
  const verification = await verifyCollection(output);
  console.log(JSON.stringify({ output, state: manifest.state, images: manifest.downloaded.length, imageBytes: totalBytes, verification }, null, 2));
  if (!verification.valid || manifest.failures.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const phase = process.argv[2] || "all";
    const slug = process.argv[3] || "event-security";
    const { output } = watchtowerTarget(slug);
    if (process.argv.length > 4) throw new Error("Use all, screenshot, analyze or verify followed by a supported page slug");
    if (phase === "all" || phase === "screenshot") await collect({ slug, screenshotsOnly: phase === "screenshot" });
    else if (phase === "analyze") console.log(JSON.stringify(await analyze(slug), null, 2));
    else if (phase === "verify") {
      const result = await verifyCollection(output);
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else throw new Error("Use all, screenshot, analyze or verify followed by a supported page slug");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
