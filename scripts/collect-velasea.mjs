import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "assets/velasea");
const origin = "https://velasea.com";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
const phase = process.argv[2] || "inspect";
const primaryPages = [
  "/",
  "/about/",
  "/solutions/",
  "/oem/",
  "/ironlink/",
  "/professional-services/",
  "/case-studies/",
  "/partners/",
  "/leadership/",
  "/careers/",
  "/news/",
  "/blog/",
  "/support/",
  "/contact/",
  "/products/servers/",
  "/products/nvrs/",
  "/products/storage/",
  "/products/networking/",
  "/products/workstations/",
  "/products/screening/",
];
const additionalPages = [
  ...[
    "aviation",
    "finance",
    "casinos",
    "real-estate",
    "infrastructure",
    "data-centers",
    "education",
    "government",
    "healthcare",
    "hospitality",
    "industrial",
    "maritime",
    "mining",
    "retail",
    "transportation",
    "utilities",
  ].map((industry) => `/solutions/${industry}/`),
  "/remote-management/",
  "/rentals/",
  "/platform-certified/",
  "/collection/media-players/",
  "/collection/video-wall-controllers/",
  "/collection/professional-series/",
  "/video-analytics/",
  "/how-to-buy/",
];
const nameFor = (urlPath) =>
  urlPath === "/"
    ? "home"
    : urlPath.replace(/^\/+|\/+$/g, "").replaceAll("/", "-");
const relative = (file) => path.relative(root, file).split(path.sep).join("/");
const saveJson = async (file, value) =>
  writeFile(file, `${JSON.stringify(value, null, 2)}\n`);

for (const dir of [
  "screenshots/desktop",
  "screenshots/mobile",
  "images",
  "pages",
]) {
  await mkdir(path.join(output, dir), { recursive: true });
}

function imageType(bytes) {
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg";
  if (/^GIF8[79]a/.test(bytes.subarray(0, 6).toString())) return "gif";
  if (
    bytes.subarray(0, 4).toString() === "RIFF" &&
    bytes.subarray(8, 12).toString() === "WEBP"
  )
    return "webp";
  if (
    bytes.subarray(4, 8).toString() === "ftyp" &&
    /avif|avis/.test(bytes.subarray(8, 32).toString())
  )
    return "avif";
  if (
    /<svg[\s>]/i.test(bytes.subarray(0, 4096).toString()) &&
    !/<html[\s>]/i.test(bytes.subarray(0, 4096).toString())
  )
    return "svg";
  return null;
}

async function browserSession(work) {
  const modulePath = process.env.PLAYWRIGHT_MODULE;
  const { chromium } = await import(
    modulePath ? pathToFileURL(modulePath).href : "playwright"
  );
  const browser = await chromium.launch({ headless: true });
  try {
    await work(browser);
  } finally {
    await browser.close();
  }
}

async function inspectPage(page, urlPath, device) {
  const observedImages = new Set();
  const issues = [];
  const onResponse = (response) => {
    if (response.headers()["content-type"]?.startsWith("image/"))
      observedImages.add(response.url());
  };
  const onError = (error) => issues.push(error.message);
  page.on("response", onResponse);
  page.on("pageerror", onError);
  try {
    const response = await page.goto(`${origin}${urlPath}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    if (!response?.ok())
      throw new Error(`HTTP ${response?.status()} for ${urlPath}`);
    await page.waitForLoadState("load", { timeout: 20000 }).catch(() => {});
    await page.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
      // Scroll through the page so lazy images and scroll-triggered content render.
      for (
        let y = 0;
        y < Math.min(document.documentElement.scrollHeight, 40000);
        y += window.innerHeight * 0.8
      ) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 160));
      }
      await Promise.race([
        Promise.all(
          [...document.images].map((image) => image.decode().catch(() => {})),
        ),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 600));
    });
    const data = await page.evaluate(() => {
      const assets = new Map();
      const add = (raw, kind, alt = "") => {
        if (
          !raw ||
          raw.startsWith("#") ||
          raw.startsWith("data:") ||
          raw.startsWith("blob:")
        )
          return;
        try {
          const url = new URL(raw, location.href);
          if (!["https:", "http:"].includes(url.protocol)) return;
          url.hash = "";
          if (url.pathname.includes("/wp-content/uploads/"))
            url.searchParams.delete("ver");
          const key = url.href;
          const existing = assets.get(key);
          if (!existing) assets.set(key, { url: key, kinds: [kind], alt });
          else if (!existing.kinds.includes(kind)) existing.kinds.push(kind);
        } catch {}
      };
      const urlsFromCss = (css, kind) => {
        for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
          add(match[1], kind);
      };
      for (const image of document.images) {
        for (const attr of [
          "src",
          "data-src",
          "data-lazy-src",
          "data-original",
        ])
          add(image.getAttribute(attr), "image", image.alt);
        add(image.currentSrc, "rendered-image", image.alt);
        for (const attr of ["srcset", "data-srcset", "data-lazy-srcset"]) {
          for (const entry of (image.getAttribute(attr) || "").split(","))
            add(entry.trim().split(/\s+/)[0], "responsive-image", image.alt);
        }
      }
      for (const source of document.querySelectorAll("picture source")) {
        for (const entry of (source.srcset || "").split(","))
          add(entry.trim().split(/\s+/)[0], "picture");
      }
      for (const element of document.querySelectorAll("*")) {
        urlsFromCss(getComputedStyle(element).backgroundImage, "background");
        for (const pseudo of ["::before", "::after"]) {
          const style = getComputedStyle(element, pseudo);
          urlsFromCss(style.backgroundImage, "pseudo-background");
          urlsFromCss(style.content, "pseudo-content");
        }
        urlsFromCss(element.getAttribute("style") || "", "inline-style");
      }
      for (const link of document.querySelectorAll('link[rel*="icon"]'))
        add(link.href, "favicon");
      for (const video of document.querySelectorAll("video[poster]"))
        add(video.poster, "video-poster");
      for (const use of document.querySelectorAll("svg use"))
        add(
          use.getAttribute("href") || use.getAttribute("xlink:href"),
          "svg-reference",
        );
      const visible = (element) => element.getClientRects().length > 0;
      const styleOf = (element) => {
        const style = getComputedStyle(element);
        return {
          text: element.innerText?.trim().slice(0, 180),
          tag: element.tagName,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      };
      const colors = new Map();
      for (const element of document.querySelectorAll("body *")) {
        if (!visible(element)) continue;
        const style = getComputedStyle(element);
        for (const color of [style.color, style.backgroundColor]) {
          if (color !== "rgba(0, 0, 0, 0)")
            colors.set(color, (colors.get(color) || 0) + 1);
        }
      }
      return {
        url: location.href,
        title: document.title,
        description:
          document.querySelector('meta[name="description"]')?.content || "",
        generator:
          document.querySelector('meta[name="generator"]')?.content || "",
        viewport: { width: innerWidth, height: innerHeight },
        dimensions: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        headings: [...document.querySelectorAll("h1,h2,h3,h4")]
          .filter(visible)
          .map(styleOf),
        bodyStyle: styleOf(document.body),
        topColors: [...colors].sort((a, b) => b[1] - a[1]).slice(0, 20),
        links: [
          ...new Map(
            [...document.querySelectorAll("a[href]")].map((link) => [
              link.href,
              { text: link.innerText.trim(), url: link.href },
            ]),
          ).values(),
        ],
        imageElements: [...document.images].map((image) => ({
          url: image.currentSrc || image.src,
          alt: image.alt,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          loaded: image.complete && image.naturalWidth > 0,
        })),
        assets: [...assets.values()],
        stylesheets: [
          ...document.querySelectorAll('link[rel="stylesheet"]'),
        ].map((link) => link.href),
        scripts: [...document.scripts]
          .map((script) => script.src)
          .filter(Boolean),
      };
    });
    for (const url of observedImages) {
      if (!data.assets.some((asset) => asset.url === url))
        data.assets.push({ url, kinds: ["network-image"], alt: "" });
    }
    const record = {
      capturedAt: new Date().toISOString(),
      device,
      status: response.status(),
      ...data,
      issues,
    };
    await saveJson(
      path.join(output, "pages", `${nameFor(urlPath)}-${device}.json`),
      record,
    );
    return record;
  } finally {
    page.off("response", onResponse);
    page.off("pageerror", onError);
  }
}

if (phase === "inspect") {
  await browserSession(async (browser) => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      userAgent,
    });
    const data = await inspectPage(page, "/", "desktop");
    console.log(
      JSON.stringify(
        {
          title: data.title,
          generator: data.generator,
          headings: data.headings,
          colors: data.topColors,
          body: data.bodyStyle,
          assets: data.assets.length,
          dimensions: data.dimensions,
          stylesheets: data.stylesheets,
          issues: data.issues,
        },
        null,
        2,
      ),
    );
  });
} else if (phase === "capture") {
  const screenshots = [];
  const failures = [];
  await browserSession(async (browser) => {
    for (const device of ["desktop", "mobile"]) {
      const context = await browser.newContext({
        viewport:
          device === "desktop"
            ? { width: 1440, height: 1000 }
            : { width: 390, height: 844 },
        deviceScaleFactor: 1,
        isMobile: device === "mobile",
        hasTouch: device === "mobile",
        reducedMotion: "reduce",
        userAgent,
      });
      const page = await context.newPage();
      for (const urlPath of primaryPages) {
        try {
          const data = await inspectPage(page, urlPath, device);
          const file = path.join(
            output,
            "screenshots",
            device,
            `${nameFor(urlPath)}.png`,
          );
          await page.screenshot({
            path: file,
            fullPage: true,
            animations: "disabled",
            timeout: 60000,
          });
          screenshots.push({
            url: data.url,
            title: data.title,
            device,
            viewport: data.viewport,
            file: relative(file),
          });
          if (urlPath === "/") {
            const hero = path.join(
              output,
              "screenshots",
              device,
              "home-viewport.png",
            );
            await page.screenshot({ path: hero, animations: "disabled" });
            screenshots.push({
              url: data.url,
              device,
              viewport: data.viewport,
              file: relative(hero),
              area: "initial-viewport",
            });
          }
          console.log(
            `CAPTURE ${device} ${urlPath} (${data.assets.length} image references)`,
          );
        } catch (error) {
          failures.push({
            url: `${origin}${urlPath}`,
            device,
            error: error.message,
          });
          console.error(`FAILED ${device} ${urlPath}: ${error.message}`);
        }
        await saveJson(path.join(output, "screenshots.json"), {
          screenshots,
          failures,
        });
      }
      await context.close();
    }
  });
  console.log(
    `Saved ${screenshots.length} screenshots; ${failures.length} failures.`,
  );
} else if (phase === "download") {
  const pageFailures = [];
  const surveyed = new Set(await readdir(path.join(output, "pages")));
  await browserSession(async (browser) => {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
      userAgent,
    });
    for (const urlPath of additionalPages) {
      if (surveyed.has(`${nameFor(urlPath)}-desktop.json`)) continue;
      try {
        const data = await inspectPage(page, urlPath, "desktop");
        console.log(
          `SURVEY ${urlPath} (${data.assets.length} image references)`,
        );
      } catch (error) {
        pageFailures.push({ url: `${origin}${urlPath}`, error: error.message });
        console.error(`FAILED survey ${urlPath}: ${error.message}`);
      }
    }
  });
  const assets = new Map();
  const pages = [];
  const excluded = new Set();
  for (const file of await readdir(path.join(output, "pages"))) {
    if (!file.endsWith(".json")) continue;
    const record = JSON.parse(
      await readFile(path.join(output, "pages", file), "utf8"),
    );
    pages.push({
      url: record.url,
      device: record.device,
      title: record.title,
      metadata: `assets/velasea/pages/${file}`,
    });
    for (const asset of record.assets) {
      const url = new URL(asset.url);
      if (
        url.hostname !== "velasea.com" &&
        !url.hostname.endsWith(".velasea.com")
      ) {
        excluded.add(asset.url);
        continue;
      }
      url.hash = "";
      if (url.pathname.includes("/wp-content/uploads/"))
        url.searchParams.delete("ver");
      const key = url.href;
      if (!assets.has(key)) assets.set(key, { ...asset, url: key, pages: [] });
      const entry = assets.get(key);
      if (!entry.pages.includes(record.url)) entry.pages.push(record.url);
      entry.kinds = [...new Set([...entry.kinds, ...asset.kinds])];
      if (!entry.alt && asset.alt) entry.alt = asset.alt;
    }
  }
  const downloaded = [];
  const failures = [];
  const rejected = [];
  const previous = await readFile(path.join(output, "manifest.json"), "utf8")
    .then(JSON.parse)
    .catch((error) => {
      if (error.code === "ENOENT") return { downloaded: [] };
      throw error;
    });
  const cached = new Map(
    previous.downloaded.map((asset) => [asset.url, asset]),
  );
  const queue = [...assets.values()];
  await browserSession(async (browser) => {
    const page = await browser.newPage({ userAgent });
    const response = await page.goto(origin, {
      waitUntil: "load",
      timeout: 60000,
    });
    if (!response?.ok())
      throw new Error(`Download session returned HTTP ${response?.status()}`);
    async function worker() {
      while (queue.length) {
        const asset = queue.shift();
        const existing = cached.get(asset.url);
        if (existing) {
          const bytes = await readFile(path.join(root, existing.file)).catch(
            (error) => {
              if (error.code === "ENOENT") return null;
              throw error;
            },
          );
          if (
            bytes &&
            createHash("sha256").update(bytes).digest("hex") === existing.sha256
          ) {
            downloaded.push({ ...existing, ...asset });
            continue;
          }
        }
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            // Use the browser session because the site rejects non-browser HTTP clients.
            const response = await page.evaluate(async (url) => {
              const response = await fetch(url, {
                signal: AbortSignal.timeout(30000),
              });
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              const blob = await response.blob();
              const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              return {
                base64,
                contentType: response.headers.get("content-type"),
              };
            }, asset.url);
            const bytes = Buffer.from(response.base64, "base64");
            const type = imageType(bytes);
            if (!type) {
              rejected.push({
                ...asset,
                contentType: response.contentType,
                reason: "Reference does not return a supported image",
              });
              lastError = null;
              break;
            }
            const original = path.basename(
              decodeURIComponent(new URL(asset.url).pathname),
            );
            const stem =
              path
                .parse(original)
                .name.replace(/[^a-zA-Z0-9._-]/g, "-")
                .slice(0, 150) || "image";
            const suffix = createHash("sha256")
              .update(asset.url)
              .digest("hex")
              .slice(0, 10);
            const file = path.join(
              output,
              "images",
              `${stem}--${suffix}.${type}`,
            );
            await writeFile(file, bytes);
            downloaded.push({
              ...asset,
              file: relative(file),
              type,
              bytes: bytes.length,
              contentType: response.contentType,
              sha256: createHash("sha256").update(bytes).digest("hex"),
            });
            console.log(
              `DOWNLOAD ${downloaded.length}/${assets.size} ${original} (${bytes.length} bytes)`,
            );
            lastError = null;
            break;
          } catch (error) {
            lastError = error.message;
            if (attempt < 2)
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * (attempt + 1)),
              );
          }
        }
        if (lastError) {
          failures.push({ ...asset, error: lastError });
          console.error(`FAILED image ${asset.url}: ${lastError}`);
        }
      }
    }
    await Promise.all(Array.from({ length: 4 }, worker));
  });
  downloaded.sort((a, b) => a.file.localeCompare(b.file));
  await saveJson(path.join(output, "manifest.json"), {
    source: origin,
    collectedAt: new Date().toISOString(),
    scope:
      "20 primary pages on desktop/mobile plus 24 related pages; public same-domain images only; not a complete website mirror",
    pages,
    downloaded,
    failures,
    rejectedNonImages: rejected,
    pageFailures,
    excludedExternalImages: [...excluded],
    totalBytes: downloaded.reduce((sum, asset) => sum + asset.bytes, 0),
    rightsNote:
      "Original images and trademarks belong to their respective owners. Downloading does not grant reuse rights.",
  });
  console.log(
    `Saved ${downloaded.length} images; ${failures.length} image failures; ${pageFailures.length} page failures.`,
  );
} else if (phase === "verify") {
  const manifest = JSON.parse(
    await readFile(path.join(output, "manifest.json"), "utf8"),
  );
  const captures = JSON.parse(
    await readFile(path.join(output, "screenshots.json"), "utf8"),
  );
  const invalid = [];
  const pageRecords = [];
  for (const file of await readdir(path.join(output, "pages"))) {
    if (file.endsWith(".json"))
      pageRecords.push(
        JSON.parse(await readFile(path.join(output, "pages", file), "utf8")),
      );
  }
  for (const image of manifest.downloaded) {
    const bytes = await readFile(path.join(root, image.file));
    if (
      imageType(bytes) !== image.type ||
      createHash("sha256").update(bytes).digest("hex") !== image.sha256
    )
      invalid.push(image.file);
  }
  for (const screenshot of captures.screenshots) {
    const bytes = await readFile(path.join(root, screenshot.file));
    const record = pageRecords.find(
      (page) =>
        page.url === screenshot.url && page.device === screenshot.device,
    );
    // A full-page capture preserves real horizontal overflow on the source website.
    const expectedWidth =
      screenshot.area === "initial-viewport"
        ? screenshot.viewport.width
        : Math.max(record.dimensions.width, screenshot.viewport.width);
    if (
      imageType(bytes) !== "png" ||
      bytes.readUInt32BE(16) !== expectedWidth ||
      bytes.readUInt32BE(20) === 0
    )
      invalid.push(screenshot.file);
  }
  const home = pageRecords.find(
    (page) => page.url === `${origin}/` && page.device === "desktop",
  );
  await saveJson(path.join(output, "analysis.json"), {
    source: origin,
    analyzedAt: new Date().toISOString(),
    business:
      "B2B purpose-built computing, OEM hardware and enterprise infrastructure for integrators and software partners. Primary conversion paths are solutions, case studies, contact and quote requests.",
    navigation: [
      "Company",
      "Solutions",
      "Services",
      "Products",
      "Support",
      "Sales",
    ],
    technology: {
      cms: "WordPress",
      theme: home.generator,
      observedPlugins: [
        "Divi Pixel",
        "Divi Plus",
        "Divi Mega Pro",
        "Gravity Forms",
        "WooCommerce",
        "YMC Smart Filter",
      ],
      chat: "Zoho SalesIQ",
    },
    visualDesign: {
      palette: {
        accent: "#CC0033",
        darkerAccent: "#AA002B",
        headerAndFooter: "#000000",
        sectionDark: "#1A1A1A",
        contentText: "#444444",
        lightText: "#CCCCCC",
        lightBackground: "#FFFFFF",
      },
      typography: {
        headings: "Josefin Sans, uppercase and spaced lettering",
        body: "Overpass",
        observedBody: home.bodyStyle,
      },
      motifs: [
        "Angular red brand shapes",
        "Diagonal charcoal texture",
        "Enterprise photography",
        "Monochrome red SVG icons",
        "Rectangular red CTA buttons",
        "Alternating light and dark sections",
      ],
      desktop:
        "Horizontal navigation, two-column hero, multi-column cards and footer.",
      mobile:
        "Hamburger navigation, smaller logo, image above hero copy, stacked content and footer columns.",
    },
    homepageSections: [
      "Header/navigation",
      "Problem/solution hero with three CTAs",
      "Product-category icon carousel",
      "Pain points and value proposition",
      "Facility photography and embedded video",
      "Three engineering/quality/expertise cards",
      "Company statistics and network/leadership/career links",
      "News and press carousel",
      "Newsletter form",
      "Contact/social footer",
    ],
    observations: {
      horizontalOverflow: pageRecords
        .filter((page) => page.dimensions.width > page.viewport.width)
        .map((page) => ({
          url: page.url,
          device: page.device,
          viewportWidth: page.viewport.width,
          documentWidth: page.dimensions.width,
        })),
      missingDescription: [
        ...new Set(
          pageRecords
            .filter((page) => !page.description)
            .map((page) => page.url),
        ),
      ],
      multipleVisibleH1: pageRecords
        .filter(
          (page) =>
            page.device === "desktop" &&
            page.headings.filter((heading) => heading.tag === "H1").length > 1,
        )
        .map((page) => ({
          url: page.url,
          count: page.headings.filter((heading) => heading.tag === "H1").length,
        })),
      embeddedVideo:
        "The homepage embedded video showed a connection/security restriction during capture. The screenshots preserve that observed third-party state.",
      floatingChat:
        "The live chat prompt overlays part of the content on small screens.",
      caveat:
        "These are rendered-page observations, not a full accessibility, SEO or performance audit. Carousel copies can inflate heading counts.",
    },
    collection: {
      uniquePages: new Set(pageRecords.map((page) => page.url)).size,
      screenshots: captures.screenshots.length,
      images: manifest.downloaded.length,
      scope: manifest.scope,
      includesResponsiveVariants: true,
    },
    files: {
      images: "assets/velasea/images/",
      desktopScreenshots: "assets/velasea/screenshots/desktop/",
      mobileScreenshots: "assets/velasea/screenshots/mobile/",
      imageManifest: "assets/velasea/manifest.json",
      pageMetadata: "assets/velasea/pages/",
    },
    rightsNote: manifest.rightsNote,
  });
  const result = {
    verifiedAt: new Date().toISOString(),
    images: manifest.downloaded.length,
    screenshots: captures.screenshots.length,
    uniquePages: new Set(manifest.pages.map((page) => page.url)).size,
    totalImageBytes: manifest.totalBytes,
    imageFailures: manifest.failures,
    pageFailures: manifest.pageFailures,
    screenshotFailures: captures.failures,
    rejectedNonImages: manifest.rejectedNonImages,
    invalid,
    types: Object.fromEntries(
      [...new Set(manifest.downloaded.map((asset) => asset.type))].map(
        (type) => [
          type,
          manifest.downloaded.filter((asset) => asset.type === type).length,
        ],
      ),
    ),
  };
  await saveJson(path.join(output, "verification.json"), result);
  console.log(JSON.stringify(result, null, 2));
  if (invalid.length) process.exitCode = 1;
} else {
  throw new Error("Phase must be inspect, capture, download, or verify.");
}
