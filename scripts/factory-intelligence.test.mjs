import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";

let vite;
let server;
let origin;
let html;

before(async () => {
  server = createHttpServer();
  vite = await createServer({ root: fileURLToPath(new URL("../", import.meta.url)), server: { middlewareMode: true, hmr: { server } }, appType: "spa" });
  const { factoryIntelligencePage } = await vite.ssrLoadModule("/src/factory-intelligence.js");
  html = factoryIntelligencePage({ icon: (name) => `<i data-lucide="${name}"></i>` });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await vite?.close();
});

test("Factory Intelligence contains the IoT architecture, three analysis levels and operational use cases", () => {
  assert.match(html, /<h1 id="fi-title">Factory Intelligence<\/h1>/);
  for (const [pattern, count] of [[/class="fi-flow-step"/g, 5], [/class="fi-analysis-row"/g, 3], [/class="fi-benefit"/g, 4], [/class="fi-integration"/g, 4], [/class="fi-use-case"/g, 7], [/<details id="fi-faq-/g, 6]]) assert.equal((html.match(pattern) || []).length, count);
  for (const text of ["SINGLE ASSET DEEP DIVE", "BASELINE & GAP ANALYSIS", "PLANT-WIDE PERFORMANCE", "OPC UA", "SAP / Oracle", "Tulip / Infor", "PTC ThingWorx", "Qlik", "Phân tích Pareto", "Bảo trì theo tình trạng"]) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /undefined|NaN|<iframe|<form/);
});

test("Factory Intelligence retains accessible anchors and valid video/contact destinations", () => {
  for (const id of ["connectivity", "analytics", "applications", "faq"]) {
    assert.ok(html.includes(`href="#fi-${id}" data-fi-section-link`));
    assert.match(html, new RegExp(`<section id="fi-${id}"[^>]*aria-labelledby="fi-${id}-title"[^>]*data-fi-section`));
    assert.ok(html.includes(`id="fi-${id}-title"`));
  }
  for (const id of ["asset", "baseline", "plant"]) assert.match(html, new RegExp(`<article id="fi-${id}"[^>]*aria-labelledby="fi-${id}-title"`));
  assert.ok(html.includes('href="/contact?interest=Factory%20Intelligence"'));
  assert.match(html, /href="https:\/\/youtu\.be\/cEvl_PURLuo" target="_blank" rel="noopener noreferrer"/);
  assert.ok(html.includes('href="/products/edge-industrial"'));
  assert.ok(html.includes('href="/services/integration"'));
  assert.ok(html.includes('class="fi-reading-progress" aria-hidden="true"'));
});

test("Factory Intelligence uses local sized images and distinguishes demo data from deployment claims", () => {
  const images = [...html.matchAll(/<img[^>]+>/g)].map((match) => match[0]);
  assert.equal(images.length, 7);
  for (const image of images) {
    assert.match(image, /src="\/assets\//);
    assert.match(image, /alt="[^"]+" width="\d+" height="\d+"/);
  }
  assert.equal(images.filter((image) => image.includes('loading="lazy"')).length, 5);
  assert.equal(images.filter((image) => image.includes('fetchpriority="high"')).length, 2);
  for (const text of ["dữ liệu minh họa", "không phải kết quả triển khai", "Không mặc định mọi máy", "thời gian lưu giữ", "được phê duyệt", "không hàm ý quan hệ đối tác", "thử nghiệm trước khi nhân rộng"]) assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /fi-scope-note|Hình ảnh giao diện và minh họa tham khảo|10,000|10\.000|30 phút|ISO|27001|50%|cam kết ROI|đảm bảo tăng/i);
});

test("Factory Intelligence supports responsive reading, keyboard FAQs, navigation and reduced motion", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/solutions/factory-intelligence`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".factory-intelligence-page.home-page").count(), 1);
    assert.equal(await page.locator("footer .footer-logo img").count(), 3);
    assert.equal(await page.locator("main i[data-lucide]").count(), 0);
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('[data-fi-section-link][href="#fi-analytics"]').click();
    await page.waitForFunction(() => document.querySelector('[data-fi-section-link][href="#fi-analytics"]').getAttribute("aria-current") === "location");
    assert.ok(await page.locator(".fi-revealed").count() > 0);
    const progress = await page.locator(".fi-section-nav").evaluate((nav) => Number(nav.style.getPropertyValue("--fi-progress")));
    assert.ok(progress > 0 && progress < 1);
    const summary = page.locator("#fi-faq-machines > summary");
    await summary.focus();
    await summary.press("Enter");
    assert.equal(await page.locator("#fi-faq-machines > div").isVisible(), true);
    await summary.press("Space");
    assert.equal(await page.locator("#fi-faq-machines").getAttribute("open"), null);
    await page.locator(".fi-contact .home-button").click();
    await page.waitForURL("**/contact?interest=Factory%20Intelligence");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Factory Intelligence");
    assert.equal(await page.locator(".factory-intelligence-page").count(), 0);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".fi-analysis-row").count(), 3);
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await reduced.goto(`${origin}/solutions/factory-intelligence#fi-analytics`, { waitUntil: "networkidle" });
    assert.equal(await reduced.locator(".fi-revealed").count(), 0);
    assert.ok(await reduced.locator("[data-fi-reveal]").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === "1" && getComputedStyle(element).animationName === "none")));
    assert.ok(await reduced.evaluate(() => scrollY > 500));
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
