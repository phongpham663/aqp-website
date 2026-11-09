import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { robotsPolicy, verifyCollection } from "./collect-magal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "assets/iclab");
const origin = "https://iclab.identifycapacity.com";
const paths = [
  "/",
  "/platform",
  "/multilayer-objects",
  ...[
    "agriculture",
    "cities",
    "energy",
    "industry",
    "supply-chain",
    "transport",
  ].map((name) => `/solutions/${name}`),
  "/contact",
  "/privacypolicy",
];
const maxImageBytes = 16 * 1024 * 1024;
const maxTotalBytes = 150 * 1024 * 1024;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const saveJson = async (file, value) => {
  await writeFile(`${file}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  await rename(`${file}.tmp`, file);
};
const nameFor = (url) =>
  new URL(url).pathname.replace(/^\/+|\/+$/g, "").replaceAll("/", "-") ||
  "home";

export function imageUrl(raw, base = origin) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const url = new URL(raw, base);
    if (url.origin !== origin || url.username || url.password) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

export function publicPage(raw) {
  const url = imageUrl(raw);
  if (!url) return null;
  const parsed = new URL(url);
  return !parsed.search &&
    paths.includes(parsed.pathname.replace(/\/+$/, "") || "/")
    ? url
    : null;
}

export function imageType(bytes) {
  if (
    bytes.length >= 24 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "png";
  if (
    bytes.length > 2 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return "jpg";
  if (["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString()))
    return "gif";
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
  const text = bytes.subarray(0, 1024).toString().trim();
  if (
    /^(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>)/i.test(text)
  )
    return "svg";
  return null;
}

export async function fetchPublicResource(
  raw,
  {
    maximum = maxImageBytes,
    allowed = () => true,
    beforeRequest = async () => {},
    request = fetch,
  } = {},
) {
  let url = imageUrl(raw);
  if (!url) throw new Error("External or unsupported URL");
  for (let attempt = 0; attempt < 6; attempt++) {
    if (!allowed(url)) throw new Error("Disallowed by robots.txt");
    await beforeRequest();
    const response = await request(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(45000),
      headers: { "User-Agent": "AQPTechReferenceCollector/1.0" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = imageUrl(response.headers.get("location"), url);
      await response.body?.cancel();
      if (!next) throw new Error("Redirect outside source website");
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
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > maximum) throw new Error("Byte limit exceeded");
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

export function analyzePages(pages) {
  const home = pages.find((page) => new URL(page.url).pathname === "/");
  const repeat = (property) =>
    [...new Set(pages.map((page) => page[property]).filter(Boolean))]
      .map((value) => ({
        value,
        urls: pages
          .filter((page) => page[property] === value)
          .map((page) => page.url),
      }))
      .filter((group) => group.urls.length > 1);
  return {
    source: origin,
    analyzedAt: new Date().toISOString(),
    language: "vi",
    summary:
      "ICLab giới thiệu nền tảng Operational Intelligence cho hạ tầng quan trọng, kết hợp quản lý video, Machine Vision, dữ liệu IoT và edge gateway để hỗ trợ theo dõi vận hành và ra quyết định.",
    positioning: {
      headline:
        home?.headings.find((heading) => heading.tag === "H1")?.text || "",
      audience: [
        "Đơn vị vận hành hạ tầng quan trọng",
        "Doanh nghiệp cần giám sát video và thiết bị IoT",
        "Nhóm quản lý vận hành, tích hợp hệ thống và chuyển đổi số",
      ],
      evidence: pages
        .filter((page) =>
          ["/", "/platform"].includes(new URL(page.url).pathname),
        )
        .map((page) => ({ url: page.url, headings: page.headings })),
    },
    productArchitecture: [
      {
        name: "ICLab Platform",
        description:
          "Dashboard kết hợp video, bản đồ, biểu đồ, widget, cảnh báo và dữ liệu vận hành.",
        source: `${origin}/platform`,
      },
      {
        name: "Multilayer Visual Objects",
        description:
          "Ghép hình ảnh camera với dữ liệu IoT và kết quả Machine Vision thành các lớp thông tin có ngữ cảnh. Trang nguồn công bố khả năng tối đa 32 lớp.",
        source: `${origin}/multilayer-objects`,
        claimNotIndependentlyVerified: true,
      },
      {
        name: "Visual Control / AI / IoT / Edge",
        description:
          "Bốn nhóm năng lực được trình bày trên home: quản lý video, phân tích AI, quản lý thiết bị IoT và kết nối tại biên.",
        source: origin,
      },
    ],
    industryPages: pages
      .filter((page) => new URL(page.url).pathname.startsWith("/solutions/"))
      .map((page) => ({
        url: page.url,
        heading:
          page.headings.find((heading) => heading.tag === "H1")?.text || "",
        sections: page.headings
          .filter((heading) => heading.tag === "H2")
          .map((heading) => heading.text),
        introduction: page.paragraphs.slice(0, 3),
      })),
    homepageSections:
      home?.headings.filter((heading) =>
        ["H1", "H2", "H3"].includes(heading.tag),
      ) || [],
    navigation: home?.navigation || [],
    conversion: {
      approach:
        "Tìm hiểu nền tảng và giải pháp, sau đó liên hệ hoặc xem demo. Phần đăng nhập là một luồng riêng, không được truy cập trong quá trình thu thập.",
      callsToAction: [
        ...new Map(
          pages
            .flatMap((page) =>
              page.links.filter((link) =>
                /contact|get in touch|explore platform|platform overview|learn more|ready|watch/i.test(
                  link.text,
                ),
              ),
            )
            .map((link) => [`${link.url}|${link.text}`, link]),
        ).values(),
      ],
      contactForms: pages
        .filter((page) => page.forms.length)
        .map((page) => ({ url: page.url, forms: page.forms })),
      formSubmissionTested: false,
    },
    visualDesign: {
      observations:
        "Phối nền trắng, nền xanh-đen và nền sáng trung tính; điểm nhấn xanh dương, CTA bo tròn, ảnh dashboard và icon công nghệ. Typography được ghi nhận từ CSS tính toán, không phải kiểm chứng độc lập việc tải từng font.",
      palette: home?.colors || [],
      typography: home?.typography || [],
      layout:
        "Header điều hướng, hero giàu hình ảnh, các khối mô tả nền tảng kết hợp ảnh dashboard, nhóm năng lực, giải pháp theo ngành, công nghệ kết nối, CTA và footer.",
      referenceScreenshots: "screenshots/desktop/",
      viewport: { width: 1440, height: 1000 },
    },
    observedTechnology: {
      reactDetected: pages.some((page) => page.reactDetected),
      pageAuthorMeta: home?.author || "",
      stylesheets: home?.stylesheets || [],
      scripts: home?.scripts || [],
      caveat:
        "Chỉ là dấu hiệu quan sát được từ trình duyệt; không kết luận về backend, bảo mật hoặc khả năng vận hành thực tế.",
    },
    contentQuality: {
      repeatedTitles: repeat("title"),
      repeatedDescriptions: repeat("description"),
      missingDescriptions: pages
        .filter((page) => !page.description)
        .map((page) => page.url),
      h1CountsToReview: pages
        .filter(
          (page) =>
            page.headings.filter((heading) => heading.tag === "H1").length !==
            1,
        )
        .map((page) => ({
          url: page.url,
          count: page.headings.filter((heading) => heading.tag === "H1").length,
        })),
      emptyAltImages: pages
        .map((page) => ({
          url: page.url,
          count: page.images.filter((image) => !image.alt).length,
        }))
        .filter((page) => page.count),
      horizontalOverflow: pages
        .filter((page) => page.dimensions.width > page.viewport.width)
        .map((page) => ({ url: page.url, width: page.dimensions.width })),
      browserIssues: pages
        .filter((page) => page.issues.length)
        .map((page) => ({ url: page.url, issues: page.issues })),
      caveat:
        "Ảnh có alt trống có thể là ảnh trang trí; cần rà soát ngữ cảnh. Đây không phải kiểm toán SEO, accessibility, hiệu năng hoặc bảo mật đầy đủ.",
    },
    takeawaysForAQPTech: [
      "Tham khảo cách liên kết hạ tầng máy chủ, GPU và lưu trữ với bài toán vận hành bằng video, AI và IoT.",
      "Trình bày luồng dữ liệu từ thiết bị hiện trường qua edge đến dashboard, thay vì chỉ liệt kê sản phẩm.",
      "Tổ chức giải pháp theo ngành và dùng ảnh giao diện thực tế để giải thích giá trị.",
      "Không sử dụng tên sản phẩm, thương hiệu hoặc tuyên bố tính năng của ICLab như năng lực đã xác nhận của AQPTech.",
    ],
    limitations:
      "Phân tích dựa trên nội dung marketing công khai và ảnh desktop. Không truy cập tài khoản, dashboard vận hành, không gửi biểu mẫu và không xác minh độc lập các tuyên bố tính năng.",
  };
}

async function analyzeCollection() {
  const manifest = JSON.parse(
    await readFile(path.join(output, "manifest.json"), "utf8"),
  );
  const pages = await Promise.all(
    manifest.pages.map(async (page) =>
      JSON.parse(await readFile(path.join(output, page.metadata), "utf8")),
    ),
  );
  const analysis = analyzePages(pages);
  analysis.collection = {
    pages: pages.length,
    screenshots: manifest.screenshots.length,
    images: manifest.downloaded.length,
    failures: manifest.failures.length,
    scope: manifest.scope,
  };
  await saveJson(path.join(output, "analysis.json"), analysis);
  const lines = [
    "PHÂN TÍCH NỘI DUNG ICLAB",
    `Nguồn: ${origin}`,
    `Thời điểm: ${analysis.analyzedAt}`,
    "",
    analysis.summary,
    "",
    "NỀN TẢNG VÀ KHÁC BIỆT",
    ...analysis.productArchitecture.map(
      (item) => `- ${item.name}: ${item.description}\n  Nguồn: ${item.source}`,
    ),
    "",
    "LĨNH VỰC ỨNG DỤNG",
    ...analysis.industryPages.map((item) => `- ${item.heading}: ${item.url}`),
    "",
    "THIẾT KẾ VÀ BỐ CỤC",
    analysis.visualDesign.observations,
    analysis.visualDesign.layout,
    `- Font tiêu đề khai báo: ${analysis.visualDesign.typography.find((item) => item.tag === "H1")?.family || "Chưa ghi nhận"}`,
    `- Font nội dung khai báo: ${analysis.visualDesign.typography.find((item) => item.tag === "P")?.family || "Chưa ghi nhận"}`,
    "",
    "LUỒNG CHUYỂN ĐỔI",
    analysis.conversion.approach,
    `- Trang có biểu mẫu HTML quan sát được: ${analysis.conversion.contactForms.length}. Không gửi thử biểu mẫu hoặc email.`,
    "",
    "NỘI DUNG CẦN RÀ SOÁT",
    `- Nhóm title lặp lại: ${analysis.contentQuality.repeatedTitles.length}`,
    `- Nhóm meta description lặp lại: ${analysis.contentQuality.repeatedDescriptions.length}`,
    `- Trang thiếu meta description: ${analysis.contentQuality.missingDescriptions.length}`,
    `- Trang cần rà soát số lượng H1: ${analysis.contentQuality.h1CountsToReview.length}`,
    `- Trang có ảnh alt trống: ${analysis.contentQuality.emptyAltImages.length} (có thể gồm ảnh trang trí)`,
    "",
    "THAM KHẢO CHO AQPTECH",
    ...analysis.takeawaysForAQPTech.map((item) => `- ${item}`),
    "",
    "PHẠM VI",
    analysis.limitations,
  ];
  await writeFile(path.join(output, "analysis.txt"), `${lines.join("\n")}\n`);
  return analysis;
}

async function collect() {
  for (const folder of [
    "screenshots/desktop",
    "pages",
    "images",
    "styles",
    "discovery",
  ])
    await mkdir(path.join(output, folder), { recursive: true });
  const manifest = {
    source: origin,
    startedAt: new Date().toISOString(),
    state: "collecting",
    scope:
      "11 allowlisted public pages, desktop 1440x1000 full-page screenshots, rendered HTML/text/metadata and public same-origin images. 16 MB per image, 150 MB total images. No authentication or private operational dashboard access; no form submissions; not a complete offline mirror.",
    rightsNote:
      "Original content, images and trademarks belong to their owners. Collection does not grant reuse rights.",
    pages: [],
    screenshots: [],
    downloaded: [],
    failures: [],
    skipped: [],
    imageReferences: [],
    externalReferences: [],
  };
  const saveManifest = () =>
    saveJson(path.join(output, "manifest.json"), manifest);
  const saveArtifact = async (file, bytes) => {
    const buffer = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
    await writeFile(path.join(output, file), buffer);
    return { file, bytes: buffer.length, sha256: hash(buffer) };
  };
  let policy = { allowed: () => true, delayMs: 0 };
  let lastRequest = 0;
  const throttle = async () => {
    await delay(
      Math.max(0, lastRequest + Math.max(1000, policy.delayMs) - Date.now()),
    );
    lastRequest = Date.now();
  };
  const fetchPublic = (raw, maximum = maxImageBytes) =>
    fetchPublicResource(raw, {
      maximum,
      allowed: (url) => policy.allowed(url),
      beforeRequest: throttle,
    });
  try {
    const robots = await fetchPublic(`${origin}/robots.txt`, 1024 * 1024);
    await saveArtifact("discovery/robots.txt", robots.bytes);
    policy = robotsPolicy(robots.bytes.toString());
  } catch (error) {
    manifest.failures.push({ phase: "robots", error: error.message });
  }
  manifest.crawlDelayMs = Math.max(1000, policy.delayMs);
  await saveManifest();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const assets = new Map();
  const references = new Set();
  const external = new Set();
  const pending = new Set();
  let totalBytes = 0;
  let activeSource = origin;
  const skip = (url, reason) => {
    if (
      !manifest.skipped.some(
        (item) => item.url === url && item.reason === reason,
      )
    )
      manifest.skipped.push({ url, reason });
  };
  async function saveImage(resource, source) {
    const type = imageType(resource.bytes);
    if (!type) {
      skip(resource.url, "Response is not a supported image");
      return;
    }
    if (
      resource.bytes.length > maxImageBytes ||
      totalBytes + resource.bytes.length > maxTotalBytes
    ) {
      skip(resource.url, "Image or collection exceeds byte limit");
      return;
    }
    let stem;
    try {
      stem = path.parse(
        decodeURIComponent(path.basename(new URL(resource.url).pathname)),
      ).name;
    } catch {
      stem = "image";
    }
    stem = stem.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100) || "image";
    const artifact = await saveArtifact(
      `images/${stem}--${hash(resource.url).slice(0, 10)}.${type}`,
      resource.bytes,
    );
    const record = {
      url: resource.url,
      kind: "images",
      type,
      contentType: resource.contentType,
      ...artifact,
      sourcePages: [source],
    };
    assets.set(resource.url, record);
    manifest.downloaded.push(record);
    totalBytes += resource.bytes.length;
  }
  page.on("response", (response) => {
    const source = activeSource;
    const work = (async () => {
      const url = imageUrl(response.url());
      if (
        !url ||
        response.request().method() !== "GET" ||
        !response.headers()["content-type"]?.startsWith("image/")
      )
        return;
      references.add(url);
      if (assets.has(url)) {
        const record = assets.get(url);
        if (record && !record.sourcePages.includes(source))
          record.sourcePages.push(source);
        return;
      }
      if (!response.ok()) {
        skip(url, `Image HTTP ${response.status()}`);
        return;
      }
      if (Number(response.headers()["content-length"]) > maxImageBytes) {
        skip(url, "Byte limit exceeded");
        return;
      }
      assets.set(url, null);
      try {
        await saveImage(
          {
            url,
            bytes: await response.body(),
            contentType: response.headers()["content-type"],
          },
          source,
        );
      } catch (error) {
        manifest.failures.push({ phase: "image", url, error: error.message });
      }
    })();
    pending.add(work);
    work.finally(() => pending.delete(work));
  });
  let stopped = false;
  try {
    for (const route of paths) {
      const url = `${origin}${route}`;
      if (!policy.allowed(url)) {
        skip(url, "Disallowed by robots.txt");
        continue;
      }
      const issues = [];
      const onError = (error) => issues.push(error.message);
      page.on("pageerror", onError);
      activeSource = url;
      try {
        await throttle();
        const response = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        if (!response?.ok()) {
          if ([401, 403, 429].includes(response?.status())) stopped = true;
          throw new Error(`Page HTTP ${response?.status()}`);
        }
        if (!publicPage(page.url()))
          throw new Error("Redirect outside public page allowlist");
        await page.waitForSelector("main h1, h1", { timeout: 15000 });
        await page
          .waitForLoadState("load", { timeout: 10000 })
          .catch(() =>
            issues.push("Load event timeout; rendered content captured"),
          );
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
            await new Promise((resolve) => setTimeout(resolve, 170));
          }
          await Promise.race([
            Promise.all(
              [...document.images].map((image) =>
                image.decode().catch(() => {}),
              ),
            ),
            new Promise((resolve) => setTimeout(resolve, 7000)),
          ]);
          for (const video of document.querySelectorAll("video")) video.pause();
          scrollTo(0, 0);
          await new Promise((resolve) => setTimeout(resolve, 600));
        });
        const metadata = await page.evaluate(() => {
          const main = document.querySelector("main") || document.body;
          const visible = (element) => element.getClientRects().length > 0;
          const style = (element) => {
            const computed = getComputedStyle(element);
            return {
              tag: element.tagName,
              text: element.innerText.trim().slice(0, 220),
              family: computed.fontFamily,
              size: computed.fontSize,
              weight: computed.fontWeight,
              color: computed.color,
            };
          };
          const backgrounds = [
            ...new Set(
              [...main.querySelectorAll("*")].flatMap((element) =>
                [
                  ...getComputedStyle(element).backgroundImage.matchAll(
                    /url\(["']?([^"')]+)["']?\)/g,
                  ),
                ].map((match) => new URL(match[1], location.href).href),
              ),
            ),
          ];
          const images = [...document.images].map((image) => ({
            url: image.currentSrc || image.src,
            src: image.src,
            srcset: image.srcset,
            alt: image.alt,
            loaded: image.complete && image.naturalWidth > 0,
            width: image.naturalWidth,
            height: image.naturalHeight,
          }));
          const colors = new Map();
          for (const element of [...main.querySelectorAll("*")]
            .filter(visible)
            .slice(0, 1800)) {
            const computed = getComputedStyle(element);
            for (const color of [computed.color, computed.backgroundColor])
              if (color !== "rgba(0, 0, 0, 0)")
                colors.set(color, (colors.get(color) || 0) + 1);
          }
          const links = [...document.querySelectorAll("a[href]")].map(
            (link) => ({ text: link.innerText.trim(), url: link.href }),
          );
          return {
            url: location.href,
            title: document.title,
            description:
              document.querySelector('meta[name="description"]')?.content || "",
            author:
              document.querySelector('meta[name="author"]')?.content || "",
            headings: [...main.querySelectorAll("h1,h2,h3,h4")]
              .filter(visible)
              .map((element) => ({
                tag: element.tagName,
                text: element.innerText.trim(),
              })),
            paragraphs: [...main.querySelectorAll("p")]
              .filter(visible)
              .map((element) => element.innerText.trim())
              .filter(Boolean),
            text: main.innerText,
            links,
            navigation: [...document.querySelectorAll("header a,nav a")]
              .filter(visible)
              .map((link) => ({ text: link.innerText.trim(), url: link.href })),
            images,
            backgrounds,
            forms: [...document.forms].map((form) => ({
              action: form.getAttribute("action"),
              method: form.method,
              fields: [...form.querySelectorAll("input,textarea,select")].map(
                (input) => ({ name: input.name, type: input.type }),
              ),
            })),
            colors: [...colors]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([color, count]) => ({ color, count })),
            typography: [...main.querySelectorAll("h1,h2,h3,p")]
              .filter(visible)
              .slice(0, 20)
              .map(style),
            stylesheets: [
              ...document.querySelectorAll('link[rel="stylesheet"]'),
            ].map((link) => link.href),
            inlineStyles: [...document.querySelectorAll("style")]
              .map((element) => element.textContent)
              .filter(Boolean),
            scripts: [...document.scripts]
              .map((script) => script.src)
              .filter(Boolean),
            reactDetected:
              !!document.querySelector("#root") &&
              Object.keys(document.querySelector("#root")).some((key) =>
                key.startsWith("__reactContainer"),
              ),
            viewport: { width: innerWidth, height: innerHeight },
            dimensions: {
              width: document.documentElement.scrollWidth,
              height: document.documentElement.scrollHeight,
            },
          };
        });
        const name = nameFor(url);
        const capturedAt = new Date().toISOString();
        const record = {
          url: metadata.url,
          title: metadata.title,
          capturedAt,
          status: response.status(),
          metadata: `pages/${name}-desktop.json`,
          artifacts: [],
        };
        record.artifacts.push(
          await saveArtifact(
            `pages/${name}-source.html`,
            await response.text(),
          ),
        );
        record.artifacts.push(
          await saveArtifact(
            `pages/${name}-desktop.html`,
            await page.content(),
          ),
        );
        record.artifacts.push(
          await saveArtifact(`pages/${name}-desktop.txt`, metadata.text),
        );
        record.artifacts.push(
          await saveArtifact(
            record.metadata,
            `${JSON.stringify({ ...metadata, text: undefined, inlineStyles: undefined, capturedAt, issues }, null, 2)}\n`,
          ),
        );
        if (metadata.inlineStyles.length)
          record.artifacts.push({
            ...(await saveArtifact(
              `styles/${name}-inline.css`,
              metadata.inlineStyles.join("\n\n"),
            )),
            kind: "styles",
            source: "embedded in source HTML",
          });
        const truncated = metadata.dimensions.height > 40000;
        manifest.screenshots.push({
          url: metadata.url,
          device: "desktop",
          viewport: metadata.viewport,
          truncated,
          ...(await saveArtifact(
            `screenshots/desktop/${name}.png`,
            await page.screenshot({
              fullPage: !truncated,
              ...(truncated
                ? {
                    clip: {
                      x: 0,
                      y: 0,
                      width: metadata.dimensions.width,
                      height: 40000,
                    },
                  }
                : {}),
              animations: "disabled",
              timeout: 60000,
            }),
          )),
        });
        if (route === "/")
          manifest.screenshots.push({
            url: metadata.url,
            device: "desktop",
            viewport: metadata.viewport,
            area: "initial-viewport",
            ...(await saveArtifact(
              "screenshots/desktop/home-viewport.png",
              await page.screenshot({ animations: "disabled" }),
            )),
          });
        for (const raw of [
          ...metadata.images.flatMap((image) => [
            image.url,
            image.src,
            ...image.srcset
              .split(",")
              .map((part) => part.trim().split(/\s+/)[0]),
          ]),
          ...metadata.backgrounds,
        ]) {
          if (!raw) continue;
          const target = imageUrl(raw, metadata.url);
          if (target) references.add(target);
          else external.add(raw);
        }
        for (const link of metadata.links)
          if (/^https?:/.test(link.url) && !imageUrl(link.url))
            external.add(link.url);
        await Promise.all([...pending]);
        manifest.pages.push(record);
        console.log(
          `CAPTURE ${manifest.pages.length}/${paths.length} ${route} | ${manifest.downloaded.length} images`,
        );
      } catch (error) {
        manifest.failures.push({ phase: "page", url, error: error.message });
        console.error(`FAILED ${url}: ${error.message}`);
      } finally {
        page.off("pageerror", onError);
      }
      manifest.imageReferences = [...references];
      manifest.externalReferences = [...external];
      await saveManifest();
      if (stopped) break;
    }
    await Promise.all([...pending]);
    for (const url of [...references]
      .filter((url) => !assets.get(url))
      .slice(0, 120)) {
      if (
        stopped ||
        manifest.failures.some(
          (failure) =>
            failure.url === url && /HTTP (?:401|403|429)/.test(failure.error),
        )
      )
        continue;
      try {
        await saveImage(
          await fetchPublic(url),
          "DOM image/background reference",
        );
      } catch (error) {
        if (/Byte limit|robots|outside/.test(error.message))
          skip(url, error.message);
        else
          manifest.failures.push({ phase: "image", url, error: error.message });
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await Promise.all([...pending]);
    manifest.finishedAt = new Date().toISOString();
    manifest.state = stopped ? "stopped-by-access-response" : "complete";
    manifest.imageReferences = [...references];
    manifest.externalReferences = [...external];
    await saveManifest();
  }
  await analyzeCollection();
  const verified = await verifyCollection(output);
  console.log(JSON.stringify(verified, null, 2));
  if (!verified.valid || !manifest.pages.length) process.exitCode = 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const phase = process.argv[2] || "all";
    if (process.argv.length > 3) throw new Error("Use all, analyze or verify");
    if (phase === "all") await collect();
    else if (phase === "analyze")
      console.log(
        JSON.stringify((await analyzeCollection()).collection, null, 2),
      );
    else if (phase === "verify") {
      const result = await verifyCollection(output);
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else throw new Error("Phase must be all, analyze or verify");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
