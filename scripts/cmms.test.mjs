import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
import { renderSite } from "../src/site-renderer.js";
import { renderCatalog } from "../src/catalog.js";
import { articles, catalogProducts, images, products, services, solutions } from "../src/data.js";

const origin = process.env.TEST_BASE_URL;
const path = "/products/cmms";
const legacyPath = "/products/servedeck-cmms";
const site = renderSite(path);

test("CMMS has an independent page with maintenance capabilities and consultation links", () => {
  assert.equal(site.found, true);
  for (const name of ["home-page", "industry-solution-page", "cmms-page"]) {
    assert.ok(site.classes.split(" ").includes(name));
  }
  assert.match(site.title, /^CMMS.*AQPTech/);
  assert.match(site.description, /bảo trì.*tài sản/);
  assert.equal((site.html.match(/<h1\b/g) || []).length, 1);
  assert.ok(site.html.includes('<h1 id="cmms-title">CMMS</h1>'));
  assert.equal((site.html.match(/class="cmms-module"/g) || []).length, 3);
  assert.ok(site.html.includes('href="/products"'));
  assert.equal((site.html.match(/href="\/contact\?interest=CMMS"/g) || []).length, 2);
  assert.equal((site.html.match(/Hình minh họa chức năng với dữ liệu mẫu/g) || []).length, 3);
  assert.equal((site.html.match(/class="cmms-readiness-list"/g) || []).length, 1);
  for (const target of site.html.matchAll(/href="#(cmms-[^"]+)"/g)) {
    assert.ok(site.html.includes(`id="${target[1]}"`));
  }
  assert.ok(site.html.includes("SLA, lịch và checklist cần được cấu hình"));
  assert.ok(site.html.includes("không phải ảnh chụp giao diện của một nhà cung cấp cụ thể"));
  assert.doesNotMatch(site.html, /undefined|NaN|AI dự đoán|cam kết giảm|class="detail-hero/);
  assert.doesNotMatch(site.html, /servedeck/i);
  assert.equal(renderSite(legacyPath).pathname, path);
  assert.equal(renderSite(`${legacyPath}/`).html, site.html);
});

test("CMMS uses a local engineering photo and three original feature illustrations", async () => {
  const main = site.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const media = [...main.matchAll(/<img\b[^>]+src="(\/assets\/[^" ]+)"[^>]*>/g)];
  assert.equal(media.length, 4);
  assert.equal(media.filter(([markup]) => markup.includes('fetchpriority="high"')).length, 1);
  assert.equal(media[0][1], images.engineer);
  assert.equal(media.filter(([, source]) => source.startsWith("/assets/cmms/images/")).length, 3);
  for (const [markup, source] of media) {
    assert.match(markup, /alt="[^"]+"/);
    assert.match(markup, /width="\d+" height="\d+"/);
    await access(new URL(`..${source}`, import.meta.url));
    if (source.endsWith(".svg")) {
      const svg = await readFile(new URL(`..${source}`, import.meta.url), "utf8");
      assert.match(svg, /width="1200" height="780" viewBox="0 0 1200 780"/);
      assert.match(svg, /<title\b[^>]*>CMMS/);
      assert.match(svg, /<desc\b/);
      assert.doesNotMatch(svg, /servedeck|https?:\/\/(?!www\.w3\.org)|<script|<foreignObject/i);
    }
  }
});

test("CMMS is discoverable by name and Vietnamese maintenance terms with correct home metadata", () => {
  for (const query of ["CMMS", "bao tri", "tài sản", "lệnh công việc"]) {
    const results = renderCatalog("Phần mềm", query);
    assert.match(results.html, /href="\/products\/cmms"/);
    assert.ok(results.count.startsWith("1 nền tảng"));
  }
  assert.ok(renderCatalog("Phần mềm", "ServeDeck").count.startsWith("0 nền tảng"));
  const product = catalogProducts.find((item) => item.slug === "cmms");
  assert.ok(product);
  const home = renderSite("/");
  const card = home.html.match(/<article class="home-software-card" data-product="cmms">[\s\S]*?<\/article>/)?.[0];
  assert.ok(card);
  assert.ok(card.includes(product.homeLabel));
  assert.ok(card.includes(`alt="${product.imageAlt}"`));
  assert.ok(card.includes('width="1200" height="780"'));
  assert.doesNotMatch(card, /servedeck|IVA \/ PHÂN TÍCH VIDEO|phân tích phương tiện/i);
});

test("No public page associates CMMS with ServeDeck content, images or links", () => {
  const paths = [
    "/", "/about", "/solutions", "/products", "/services", "/insights", "/support", "/contact", "/privacy", "/terms", legacyPath,
    ...products.map((item) => `/products/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
    ...articles.map((item) => `/insights/${item.slug}`),
  ];
  for (const pathname of paths) {
    const page = renderSite(pathname);
    assert.equal(page.found, true, pathname);
    assert.doesNotMatch(`${page.title} ${page.description} ${page.html}`, /servedeck/i, pathname);
  }
});

test("The legacy CMMS URL permanently redirects to the neutral URL with its query intact", { skip: !origin }, async () => {
  for (const suffix of ["", "/"]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetch(`${origin}${legacyPath}${suffix}?source=legacy&language=vi`, { method, redirect: "manual" });
      assert.equal(response.status, 308);
      assert.ok(response.headers.get("location").endsWith(`${path}?source=legacy&language=vi`));
    }
  }
  const response = await fetch(`${origin}${legacyPath}`);
  assert.equal(response.status, 200);
  assert.equal(new URL(response.url).pathname, path);
  assert.doesNotMatch(await response.text(), /servedeck/i);
});

test("CMMS supports catalog navigation, responsive assets, section anchors and prefilled contact", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    const vendorMedia = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (/\/assets\/servedeck\/|https?:\/\/[^/]*servedeck\.com/i.test(request.url())) vendorMedia.push(request.url()); });
    await page.goto(`${origin}/products?q=bao%20tri`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), 1);
    await page.locator(`#product-results a[href="${path}"]`).click();
    await page.waitForURL(`**${path}`);
    assert.equal(await page.locator(".cmms-page").count(), 1);
    assert.equal(await page.locator(".home-header, .home-footer").count(), 2);
    assert.equal(await page.locator("main h1").textContent(), "CMMS");
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll("main img")];
      images.forEach((image) => { image.loading = "eager"; });
      await Promise.all(images.map((image) => image.decode()));
    });
    assert.equal(await page.locator('main img[src^="/assets/cmms/"]').count(), 3);
    assert.doesNotMatch(await page.locator("main").innerHTML(), /servedeck/i);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
      assert.ok(await page.locator(".cmms-module-media img").evaluateAll((images) => images.every((image) => {
        const bounds = image.getBoundingClientRect();
        return image.complete && image.naturalWidth > 0 && Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight) < 0.01;
      })));
    }
    await page.locator('.industry-section-nav a[href="#cmms-workflow"]').focus();
    await page.locator('.industry-section-nav a[href="#cmms-workflow"]').press("Enter");
    // The shared client scrolls same-page anchors without changing the URL.
    assert.ok(await page.locator("#cmms-workflow").evaluate((section) => Math.abs(section.getBoundingClientRect().top) < 160));
    await page.locator("#cmms-resources .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "CMMS");
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.locator(`.home-product-copy a[href="${path}"]`).click();
    await page.waitForURL(`**${path}`);
    assert.equal(await page.locator(".cmms-page").count(), 1);
    await page.goto(`${origin}${legacyPath}`, { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, path);
    assert.equal(await page.locator("main h1").textContent(), "CMMS");
    assert.deepEqual(vendorMedia, []);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("CMMS remains readable and reachable without JavaScript on mobile", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 844 }, reducedMotion: "reduce" });
    const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator(".cmms-module:visible").count(), 3);
    assert.equal(await page.locator("#main-nav").isVisible(), true);
    assert.equal(await page.locator("body").evaluate(() => document.documentElement.scrollWidth), 320);
    await page.locator('.industry-section-nav a[href="#cmms-modules"]').click();
    assert.equal(new URL(page.url()).hash, "#cmms-modules");
    assert.equal(await page.locator(".cmms-readiness-list li").count(), 3);
    await page.locator("#cmms-resources .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "CMMS");
  } finally {
    await browser.close();
  }
});
