import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
import { renderSite } from "../src/site-renderer.js";
import { renderCatalog } from "../src/catalog.js";
import { catalogProducts } from "../src/data.js";

const origin = process.env.TEST_BASE_URL;
const path = "/products/servedeck-cmms";
const site = renderSite(path);

test("CMMS has a dedicated branded page with sourced capabilities and consultation links", () => {
  assert.equal(site.found, true);
  for (const name of ["home-page", "industry-solution-page", "cmms-page"]) {
    assert.ok(site.classes.split(" ").includes(name));
  }
  assert.match(site.title, /ServeDeck CMMS.*AQPTech/);
  assert.match(site.description, /bảo trì.*tài sản/);
  assert.equal((site.html.match(/<h1\b/g) || []).length, 1);
  assert.ok(site.html.includes('<h1 id="cmms-title">ServeDeck CMMS</h1>'));
  assert.equal((site.html.match(/class="cmms-module"/g) || []).length, 3);
  assert.ok(site.html.includes('href="/products"'));
  assert.equal((site.html.match(/href="\/contact\?interest=ServeDeck%20CMMS"/g) || []).length, 2);
  assert.equal((site.html.match(/https:\/\/www\.servedeck\.com\/our-solutions\/operation-maintenance\//g) || []).length, 3);
  for (const target of site.html.matchAll(/href="#(cmms-[^"]+)"/g)) {
    assert.ok(site.html.includes(`id="${target[1]}"`));
  }
  assert.ok(site.html.includes("không hàm ý quan hệ đối tác"));
  assert.ok(site.html.includes("SLA, lịch và checklist cần được cấu hình"));
  assert.doesNotMatch(site.html, /undefined|NaN|AI dự đoán|cam kết giảm|class="detail-hero/);
});

test("CMMS uses four local official images with explicit dimensions and accessible descriptions", async () => {
  const images = [...site.html.matchAll(/<img\b[^>]+src="(\/assets\/servedeck\/[^" ]+)"[^>]*>/g)];
  assert.equal(images.length, 4);
  assert.equal(images.filter(([markup]) => markup.includes('fetchpriority="high"')).length, 1);
  for (const [markup, source] of images) {
    assert.match(markup, /alt="[^"]+"/);
    assert.match(markup, /width="\d+" height="\d+"/);
    await access(new URL(`..${source}`, import.meta.url));
  }
});

test("CMMS is discoverable by name and Vietnamese maintenance terms with correct home metadata", () => {
  for (const query of ["CMMS", "ServeDeck", "bao tri", "tài sản"]) {
    const results = renderCatalog("Phần mềm", query);
    assert.match(results.html, /href="\/products\/servedeck-cmms"/);
    assert.ok(results.count.startsWith("1 nền tảng"));
  }
  const product = catalogProducts.find((item) => item.slug === "servedeck-cmms");
  assert.ok(product);
  const home = renderSite("/");
  const card = home.html.match(/<article class="home-software-card" data-product="servedeck-cmms">[\s\S]*?<\/article>/)?.[0];
  assert.ok(card);
  assert.ok(card.includes(product.homeLabel));
  assert.ok(card.includes(`alt="${product.imageAlt}"`));
  assert.ok(card.includes('width="1201" height="565"'));
  assert.doesNotMatch(card, /IVA \/ PHÂN TÍCH VIDEO|phân tích phương tiện/);
});

test("CMMS supports catalog navigation, responsive assets, section anchors and prefilled contact", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/products?q=bao%20tri`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("#product-results .product-card").count(), 1);
    await page.locator(`#product-results a[href="${path}"]`).click();
    await page.waitForURL(`**${path}`);
    assert.equal(await page.locator(".cmms-page").count(), 1);
    assert.equal(await page.locator(".home-header, .home-footer").count(), 2);
    assert.equal(await page.locator("main h1").textContent(), "ServeDeck CMMS");
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll('main img[src^="/assets/servedeck/"]')];
      images.forEach((image) => { image.loading = "eager"; });
      await Promise.all(images.map((image) => image.decode()));
    });
    assert.equal(await page.locator('main img[src^="/assets/servedeck/"]').count(), 4);
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
    assert.equal(await page.locator('[name="interest"]').inputValue(), "ServeDeck CMMS");
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.locator(`.home-product-copy a[href="${path}"]`).click();
    await page.waitForURL(`**${path}`);
    assert.equal(await page.locator(".cmms-page").count(), 1);
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
    assert.equal(await page.locator(".cmms-source-links a").count(), 3);
    await page.locator("#cmms-resources .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "ServeDeck CMMS");
  } finally {
    await browser.close();
  }
});
