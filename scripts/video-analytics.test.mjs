import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";
import { renderSite } from "../src/site-renderer.js";
import { products, solutions, services, articles } from "../src/data.js";

let vite;
let html;
let seaportsHtml;
let sharedPages;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const { videoAnalyticsPage } = await vite.ssrLoadModule("/src/video-analytics.js");
  const { seaportsPage } = await vite.ssrLoadModule("/src/seaports.js");
  const icon = (name) => `<i data-lucide="${name}"></i>`;
  html = videoAnalyticsPage({ icon });
  seaportsHtml = seaportsPage({ icon });
  sharedPages = [html, seaportsHtml];
  for (const [path, name] of [["/src/oil-gas.js", "oilGasPage"], ["/src/national-borders.js", "nationalBordersPage"], ["/src/critical-sites.js", "criticalSitesPage"], ["/src/gates-access.js", "gatesAccessPage"]]) {
    const module = await vite.ssrLoadModule(path);
    sharedPages.push(module[name]({ icon }));
  }
});

after(async () => {
  await vite?.close();
});

test("Intelligent Video Analytics preserves all reference capability points and benefits", () => {
  assert.match(html, /<h1 id="intelligent-video-analytics-title">Intelligent Video Analytics<\/h1>/);
  const lists = [...html.matchAll(/<article id="iva-[\s\S]*?<ul>([\s\S]*?)<\/ul>/g)];
  assert.deepEqual(lists.map((match) => (match[1].match(/<li>/g) || []).length), [5, 2, 3]);
  assert.equal((html.match(/<article class="industry-benefit">/g) || []).length, 7);
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("IVA section navigation and consultation links have valid targets", () => {
  for (const id of ["iva-safety-environment", "iva-security", "iva-operational-efficiency"]) {
    assert.ok(html.includes(`href="#${id}"`));
    assert.match(html, new RegExp(`<article id="${id}"[^>]*aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title"`));
  }
  assert.ok(html.includes(`/contact?interest=${encodeURIComponent("Intelligent Video Analytics")}`));
  assert.ok(html.includes("không thay thế hoàn toàn giám sát của con người"));
  assert.ok(html.includes("không thay thế đánh giá y tế"));
});

test("IVA retains consultation without the removed original-solution link", () => {
  assert.doesNotMatch(html, /href="https:\/\/www\.magalsolutions\.com\/intelligent-video-analytics\/"/);
  assert.doesNotMatch(html, /industry-video-link|Xem brochure|\.pdf|youtube\.com/);
  assert.doesNotMatch(html, /Nội dung tham khảo từ giải pháp/);
});

test("All six shared solution pages omit the removed Magal source link and language note", () => {
  assert.equal(sharedPages.length, 6);
  for (const rendered of sharedPages) {
    assert.doesNotMatch(rendered, /Xem giải pháp gốc của Magal|Tài liệu gốc bằng tiếng Anh từ Magal Solutions|Nội dung tham khảo từ giải pháp/);
    const resources = rendered.match(/<div class="industry-resources">([\s\S]*?)<\/section>/)[1];
    assert.match(resources, /<h3>[^<]+<\/h3>/);
    assert.match(resources, /class="home-button" href="\/contact\?interest=/);
  }
});

test("Shared solution pages omit Magal videos and brochures while preserving consultation links", () => {
  for (const rendered of sharedPages) {
    assert.doesNotMatch(rendered, /industry-video-link|youtube\.com|youtu\.be|Xem video Magal|Video Magal:/);
    assert.doesNotMatch(rendered, /Xem brochure Magal|brochureUrl|href="[^"]*\.pdf"/);
    assert.match(rendered, /class="home-button" href="\/contact\?interest=/);
  }
});

test("All website pages omit links to Magal brochures", () => {
  const paths = [
    "/", "/about", "/solutions", "/products", "/services", "/insights", "/contact", "/support", "/privacy", "/terms",
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...products.map((item) => `/products/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
    ...articles.map((item) => `/insights/${item.slug}`),
  ];
  for (const path of paths) {
    const site = renderSite(path);
    assert.equal(site.found, true, path);
    assert.doesNotMatch(site.html, /Xem brochure Maga|href="[^"]*(?:\/assets\/magal\/documents\/|magalsolutions\.com\/[^"\s]*\.pdf)/i, path);
  }
});

test("Former brochure pages retain working consultation on desktop and mobile", { skip: !process.env.TEST_BASE_URL }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const slugs = ["seaports-terminals", "oil-gas", "national-borders", "critical-sites"];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const slug of slugs) {
        const response = await page.goto(`${process.env.TEST_BASE_URL}/solutions/${slug}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200, slug);
        assert.equal(await page.locator("main h1").count(), 1);
        assert.equal(await page.getByRole("link", { name: /Xem brochure Maga/i }).count(), 0);
        const consultation = page.locator(".industry-resources a");
        assert.equal(await consultation.count(), 1);
        const solution = solutions.find((item) => item.slug === slug);
        assert.equal(await consultation.getAttribute("href"), `/contact?interest=${encodeURIComponent(solution.name)}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      }
    }
    await page.locator(".industry-resources .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), solutions.find((item) => item.slug === "critical-sites").name);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
