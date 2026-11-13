import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";
import { createAppServer } from "./server.mjs";
import { productRedirects } from "../src/route-redirects.js";
import { renderCatalog } from "../src/catalog.js";
import { renderSite } from "../src/site-renderer.js";

let vite;
let server;
let redirectServer;
let origin;
let redirectOrigin;
let data;
let header;
let catalogHtml;
const softwareSlugs = ["veolink", "intelligent-video-analytics", "cmms", "fortisoptix"];
const softwareNames = ["Veolink", "Intelligent Video Analytics", "CMMS", "FortisOptix"];

before(async () => {
  server = createHttpServer();
  vite = await createServer({ root: fileURLToPath(new URL("../", import.meta.url)), server: { middlewareMode: true, hmr: { server } }, appType: "spa" });
  data = await vite.ssrLoadModule("/src/data.js");
  const { homeHeader } = await vite.ssrLoadModule("/src/home.js");
  header = homeHeader({ icon: () => "", logo: () => "AQPTech" });
  const { productsPage } = await vite.ssrLoadModule("/src/products.js");
  catalogHtml = productsPage({ icon: (name) => `<i data-lucide="${name}"></i>`, escape: (value) => value, search: `?category=${encodeURIComponent("Phần mềm")}&q=video` });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  redirectServer = await createAppServer({ dev: false });
  await new Promise((resolve) => redirectServer.listen(0, "127.0.0.1", resolve));
  redirectOrigin = `http://127.0.0.1:${redirectServer.address().port}`;
});
after(async () => {
  for (const current of [server, redirectServer]) {
    current?.closeAllConnections();
    if (current) await new Promise((resolve) => current.close(resolve));
  }
  await vite?.close();
});

test("Veolink, IVA, CMMS and FortisOptix belong to the software catalog, not the solution menu", () => {
  assert.equal(data.products.length, 10);
  assert.deepEqual(data.catalogProducts.map((item) => item.slug), softwareSlugs);
  for (const slug of softwareSlugs) {
    const product = data.products.find((item) => item.slug === slug);
    assert.equal(product.category, "Phần mềm");
    assert.ok(product.features.length > 0 && product.image && product.label);
    assert.ok(!data.solutions.some((item) => item.slug === slug));
    assert.ok(!header.includes(`href="/solutions/${slug}"`));
  }
});

test("FortisOptix presents planned low-code capabilities, coming-soon status and qualified local imagery", () => {
  assert.equal(data.products.find((item) => item.slug === "fortisoptix").statusLabel, "Comming Soon - Sắp ra mắt");
  const page = renderSite("/products/fortisoptix");
  assert.equal(page.found, true);
  assert.equal(page.title, "FortisOptix - Nền tảng AI cho robot và tự động hóa | AQPTech");
  assert.match(page.classes, /\bfortisoptix-page\b/);
  assert.match(page.classes, /\bindustry-solution-page\b/);
  assert.match(page.html, /<h1 id="fortisoptix-title">FortisOptix<\/h1>/);
  assert.ok(page.html.includes("Nền tảng AI cho robot và tự động hóa."));
  assert.ok(page.html.includes('href="/products">Sản phẩm</a>'));
  assert.ok(page.html.includes('href="/contact?interest=FortisOptix"'));
  for (const id of ["ai", "automation", "deployment"]) {
    assert.ok(page.html.includes(`href="#fortisoptix-${id}"`));
    assert.match(page.html, new RegExp(`<article id="fortisoptix-${id}"[^>]*aria-labelledby="fortisoptix-${id}-title"`));
  }
  for (const text of ["AI không thay thế bộ điều khiển an toàn", "không mặc định mọi robot hoặc thiết bị đều tương thích", "cơ chế dừng", "tiêu chí nghiệm thu"]) assert.ok(page.html.includes(text));
  for (const text of ["low-code", "kéo thả", "gán nhãn", "CPU hoặc GPU", "Modbus/TCP", "Arduino I/O", "MQTT", "REST API", "RTSP", "MJPEG", "chuẩn bị ra mắt", "khi phát hành"]) assert.ok(page.html.includes(text), text);
  assert.ok(page.html.includes("Quan tâm sản phẩm"));
  for (const pathname of ["/", "/products", "/products/fortisoptix"]) {
    const html = renderSite(pathname).html;
    assert.equal((html.match(/class="product-status"/g) || []).length, 1, pathname);
    assert.match(html, /<span class="product-status">Comming Soon - Sắp ra mắt<\/span>/, pathname);
  }
  for (const slug of softwareSlugs.filter((slug) => slug !== "fortisoptix")) assert.doesNotMatch(renderSite(`/products/${slug}`).html, /class="product-status"/);
  const main = page.html.match(/<main\b[\s\S]*?<\/main>/)[0];
  const images = [...main.matchAll(/<img\b[^>]+>/g)].map((match) => match[0]);
  assert.equal(images.length, 2);
  for (const image of images) {
    assert.match(image, /src="\/assets\/velasea\/images\/industrial-conveyor-980x653--3ff4b4cb38\.jpg"/);
    assert.match(image, /alt="[^"]+" width="980" height="653"/);
  }
  assert.doesNotMatch(main, /Nguồn:|href="https?:\/\/|cira-ai\.com|<iframe|undefined|NaN/);
  for (const query of ["FortisOptix", "ROBOT", "tự động hóa", "tu dong hoa", "low-code", "sap ra mat"]) {
    const results = renderCatalog("Phần mềm", query);
    assert.ok(results.count.startsWith("1 nền tảng phù hợp"), query);
    assert.match(results.html, /href="\/products\/fortisoptix"/);
  }
});

test("Product catalog uses the shared AQP hero and retains accessible filter/search hooks", () => {
  assert.match(catalogHtml, /<h1 id="products-title">Sản phẩm<\/h1>/);
  assert.ok(catalogHtml.includes('class="about-reference-hero"'));
  assert.ok(catalogHtml.includes('id="products-catalog"'));
  assert.ok(catalogHtml.includes('aria-labelledby="products-catalog-title"'));
  assert.ok(catalogHtml.includes('class="filter-tab selected" data-category="Phần mềm" aria-pressed="true"'));
  assert.ok(catalogHtml.includes('value="video" aria-controls="product-results"'));
  assert.ok(catalogHtml.includes('href="#products-catalog"'));
  assert.ok(catalogHtml.includes('href="/contact?interest=T%C6%B0%20v%E1%BA%A5n%20s%E1%BA%A3n%20ph%E1%BA%A9m"'));
  assert.match(catalogHtml, /width="1280" height="817" fetchpriority="high"/);
  assert.doesNotMatch(catalogHtml, /class="page-intro"|class="cta-section"|undefined|NaN/);
  assert.doesNotMatch(catalogHtml, /data-category="(?:AI & Edge|Máy chủ|Lưu trữ|Giám sát|Kết nối)"/);
});

test("Old product URLs return permanent redirects and preserve query parameters", async () => {
  for (const [oldPath, newPath] of productRedirects) {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetch(`${redirectOrigin}${oldPath}/?q=video%20analytics&region=Vietnam`, { method, redirect: "manual" });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), `${newPath}?q=video%20analytics&region=Vietnam`);
      assert.equal(await response.text(), "");
    }
  }
});

test("Software products are searchable, retain detailed pages and resolve legacy SPA links", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/products`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), softwareSlugs.length);
    assert.deepEqual(await page.locator("#product-results h3").allTextContents(), softwareNames);
    assert.equal(await page.locator("#product-results .product-status").count(), 1);
    assert.equal(await page.locator('#product-results a[href="/products/fortisoptix"] .product-status').textContent(), "Comming Soon - Sắp ra mắt");
    await page.getByRole("button", { name: "Phần mềm", exact: true }).click();
    assert.deepEqual(await page.locator("#product-results h3").allTextContents(), softwareNames);
    await page.locator("#product-search").fill("INTELLIGENT VIDEO ANALYTICS");
    assert.equal(await page.locator("#product-results .product-card").count(), 1);
    assert.equal(await page.locator("#product-results .product-status").count(), 0);
    await page.locator('#product-results a[href="/products/intelligent-video-analytics"]').first().click();
    await page.waitForURL("**/products/intelligent-video-analytics");
    assert.equal(await page.locator(".video-analytics-page").count(), 1);
    assert.equal(await page.locator('.industry-breadcrumb a[href="/products"]').textContent(), "Sản phẩm");
    await page.goto(`${origin}/products?q=tu%20dong%20hoa`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), 1);
    assert.deepEqual(await page.locator("#product-results h3").allTextContents(), ["FortisOptix"]);
    await page.locator('#product-results a[href="/products/fortisoptix"]').click();
    await page.waitForURL("**/products/fortisoptix");
    await page.waitForFunction(() => document.title === "FortisOptix - Nền tảng AI cho robot và tự động hóa | AQPTech");
    assert.equal(await page.locator(".fortisoptix-page.industry-solution-page").count(), 1);
    assert.equal(await page.locator(".about-hero-panel .product-status").textContent(), "Comming Soon - Sắp ra mắt");
    assert.equal(await page.locator(".about-hero-panel .product-status").isVisible(), true);
    assert.match(await page.locator("main .industry-hero-actions .home-button").textContent(), /Quan tâm sản phẩm/);
    assert.equal(await page.locator('.industry-breadcrumb a[href="/products"]').textContent(), "Sản phẩm");
    assert.equal(await page.locator('main a[href^="https:"]').count(), 0);
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll("main img")];
      images.forEach((image) => { image.loading = "eager"; });
      await Promise.all(images.map((image) => image.decode()));
      await document.fonts.ready;
    });
    assert.ok(await page.locator("main img").evaluateAll((images) => images.every((image) => image.naturalWidth === 980 && image.naturalHeight === 653)));
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
      assert.equal(await page.locator("main h1:visible").count(), 1);
      assert.ok(await page.locator(".product-status").evaluate((badge) => {
        const bounds = badge.getBoundingClientRect();
        return bounds.width > 0 && bounds.left >= 0 && bounds.right <= innerWidth;
      }));
    }
    await page.locator('.industry-section-nav a[href="#fortisoptix-automation"]').click();
    assert.ok(await page.locator("#fortisoptix-automation").evaluate((section) => Math.abs(section.getBoundingClientRect().top) < 160));
    await page.locator("main .industry-hero-actions .home-button").click();
    await page.waitForURL("**/contact?interest=FortisOptix");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "FortisOptix");
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [oldPath, newPath] of productRedirects) {
      await page.goto(`${origin}${oldPath}?source=legacy`, { waitUntil: "networkidle" });
      assert.equal(new URL(page.url()).pathname, newPath);
      assert.equal(new URL(page.url()).search, "?source=legacy");
      assert.equal(await page.locator(".home-header").count(), 1);
      assert.equal(await page.locator('.industry-breadcrumb a[href="/products"]').count(), 1);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await page.locator("main h1").count(), 1);
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
      }
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Branded product catalog preserves empty/reset states, query links, newsletter and responsive layout", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/products`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".products-reference-page.home-page").count(), 1);
    assert.equal(await page.locator(".home-header, .home-footer").count(), 2);
    assert.equal(await page.locator(".utility-bar").count(), 0);
    assert.equal(await page.locator('meta[name="theme-color"]').getAttribute("content"), "#000000");
    assert.equal(await page.locator('footer form[data-api="newsletter"]').count(), 1);
    assert.equal(await page.locator("footer .footer-logo img").count(), 3);
    await page.getByRole("button", { name: "Phần mềm", exact: true }).click();
    await page.waitForFunction(() => getComputedStyle(document.querySelector(".filter-tab.selected")).backgroundColor === "rgb(204, 0, 51)");
    assert.equal(await page.locator('.filter-tab.selected').evaluate((button) => getComputedStyle(button).backgroundColor), "rgb(204, 0, 51)");
    await page.locator("#product-search").fill("no-product-matches-this-query");
    assert.equal(await page.locator("#product-results .product-card").count(), 0);
    assert.equal(await page.locator("#product-results .empty-state").isVisible(), true);
    await page.locator("#clear-filters").click();
    assert.equal(await page.locator("#product-results .product-card").count(), softwareSlugs.length);
    assert.equal(await page.locator("#product-search").inputValue(), "");
    assert.equal(new URL(page.url()).search, "");
    await page.goto(`${origin}/products?category=${encodeURIComponent("Máy chủ")}`, { waitUntil: "networkidle" });
    assert.deepEqual(await page.locator("#product-results h3").allTextContents(), softwareNames);
    assert.deepEqual(await page.locator(".filter-tab").allTextContents(), ["Tất cả", "Phần mềm"]);
    await page.goto(`${origin}/products?category=${encodeURIComponent("Phần mềm")}&q=Veolink`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), 1);
    assert.equal(await page.locator("#product-search").inputValue(), "Veolink");
    await page.locator("#product-search").fill("");
    assert.equal(await page.locator("#product-results .product-card").count(), softwareSlugs.length);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
    }
    await page.locator(".products-contact .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Tư vấn sản phẩm");
    assert.equal(await page.locator(".products-reference-page").count(), 0);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), softwareSlugs.length);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
