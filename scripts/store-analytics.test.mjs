import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createRendererServer as createServer } from "./test-site.mjs";
import { chromium } from "playwright";

let vite;
let html;
let server;
let origin;

before(async () => {
  server = createHttpServer();
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: { server } },
    appType: "spa",
  });
  const { storeAnalyticsPage } = await vite.ssrLoadModule("/src/store-analytics.js");
  html = storeAnalyticsPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await vite?.close();
});

test("Store Analytics renders four analyses, four features and five native FAQs", () => {
  assert.match(html, /<h1 id="sa-title">Store Analytics<\/h1>/);
  assert.equal((html.match(/class="sa-analysis-row"/g) || []).length, 4);
  assert.equal((html.match(/class="sa-feature"/g) || []).length, 4);
  assert.equal((html.match(/<details id="sa-faq-/g) || []).length, 5);
  for (const label of ["TRAFFIC ANALYSIS", "DEMOGRAPHIC ANALYSIS", "CUSTOMER BEHAVIOR", "STORE KPI ANALYSIS", "REAL-TIME", "ACCURATE COUNTING", "AI-POWERED", "COMPREHENSIVE REPORTING"]) assert.ok(html.includes(label));
  assert.doesNotMatch(html, /undefined|NaN|opacity:0|visibility:hidden/);
});

test("Store Analytics section navigation and headings retain accessible targets", () => {
  for (const id of ["analytics", "scenarios", "features", "faq"]) {
    assert.ok(html.includes(`href="#sa-${id}" data-sa-section-link`));
    assert.match(html, new RegExp(`<section id="sa-${id}"[^>]*aria-labelledby="sa-${id}-title"[^>]*data-sa-section`));
    assert.ok(html.includes(`id="sa-${id}-title"`));
  }
  for (const id of ["traffic", "audience", "behavior", "performance"]) {
    assert.match(html, new RegExp(`<article id="sa-${id}"[^>]*aria-labelledby="sa-${id}-title"`));
    assert.ok(html.includes(`id="sa-${id}-title"`));
  }
  assert.ok(html.includes('class="sa-reading-progress" aria-hidden="true"'));
});

test("Store Analytics uses local sized images, lazy content and real AQP routes", () => {
  const images = [...html.matchAll(/<img [^>]+>/g)].map((match) => match[0]);
  assert.equal(images.length, 11);
  for (const image of images) {
    assert.match(image, /src="\/assets\/opretail\/images\//);
    assert.match(image, /alt="[^"]+"/);
    assert.match(image, /width="\d+" height="\d+"/);
  }
  assert.equal(images.filter((image) => image.includes('loading="lazy"')).length, 9);
  assert.equal(images.filter((image) => image.includes('fetchpriority="high"')).length, 2);
  assert.ok(html.includes('href="/contact?interest=Store%20Analytics"'));
  for (const href of ["/products/intelligent-video-analytics", "/products/ip-video", "/services/integration"]) assert.ok(html.includes(`href="${href}"`));
  assert.doesNotMatch(html, /<iframe|<form|href="(?:#|https:[^"]*(?:login|trial))"/);
});

test("Store Analytics qualifies AI, sample data, hardware compatibility and source attribution", () => {
  for (const text of ["độ tuổi và giới tính ước lượng", "không xác định danh tính", "dữ liệu tổng hợp", "không phải dữ liệu của khách hàng AQPTech", "không mặc định mọi camera IP", "dữ liệu giao dịch từ POS", "không hàm ý quan hệ đối tác", "thử nghiệm thực tế"]) assert.ok(html.includes(text));
  assert.match(html, /href="https:\/\/www\.opretail\.com\/products\/op-analytics" target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /400,000|4000|NDAA|GDPR|info@opretail|13771942521/);
});

test("Store Analytics is responsive, scroll-aware, keyboard-accessible and respects reduced motion", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/solutions/store-analytics`, { waitUntil: "networkidle" });
    assert.match(await page.title(), /Store Analytics - Phân tích cửa hàng/);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('[data-sa-section-link][href="#sa-features"]').click();
    await page.waitForFunction(() => document.querySelector('[data-sa-section-link][href="#sa-features"]').getAttribute("aria-current") === "location");
    assert.ok(await page.locator(".sa-revealed").count() > 0);
    const progress = await page.locator(".sa-section-nav").evaluate((nav) => Number(nav.style.getPropertyValue("--sa-progress")));
    assert.ok(progress > 0 && progress < 1);
    const summary = page.locator("#sa-faq-reports > summary");
    await summary.focus();
    await summary.press("Enter");
    assert.equal(await page.locator("#sa-faq-reports > div").isVisible(), true);
    await summary.press("Space");
    assert.equal(await page.locator("#sa-faq-reports").getAttribute("open"), null);
    await page.locator(".sa-contact .home-button").click();
    await page.waitForURL("**/contact?interest=Store%20Analytics");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Store Analytics");
    assert.equal(await page.locator(".store-analytics-page").count(), 0);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".sa-feature").count(), 4);
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await reduced.goto(`${origin}/solutions/store-analytics#sa-scenarios`, { waitUntil: "networkidle" });
    assert.equal(await reduced.locator(".sa-revealed").count(), 0);
    assert.ok(await reduced.locator("[data-sa-reveal]").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === "1" && getComputedStyle(element).animationName === "none")));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
