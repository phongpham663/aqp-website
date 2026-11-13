import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";
import { articles, catalogProducts, products, services, solutions } from "../src/data.js";
import { renderSite } from "../src/site-renderer.js";

const origin = process.env.TEST_BASE_URL;
const hardware = products.filter((item) => !catalogProducts.some((product) => product.slug === item.slug));
const genericSolutions = solutions.filter((item) => !item.completed);
const pages = [
  ...articles.map((item) => ({ path: `/insights/${item.slug}`, type: "article", item })),
  ...hardware.map((item) => ({ path: `/products/${item.slug}`, type: "detail", item })),
  ...genericSolutions.map((item) => ({ path: `/solutions/${item.slug}`, type: "detail", item })),
  ...services.map((item) => ({ path: `/services/${item.slug}`, type: "service", item })),
  { path: "/privacy", type: "policy" }, { path: "/terms", type: "policy" },
];

test("All twenty migrated pages and missing routes share the company frame and newsletter", () => {
  assert.equal(pages.length, 20);
  for (const { path, type } of pages) {
    const page = renderSite(path);
    assert.equal(page.found, true, path);
    assert.match(page.classes, /\bhome-page\b/);
    assert.match(page.classes, /\bcompany-reference-page\b/);
    assert.ok(page.classes.split(" ").includes(`${type}-reference-page`), path);
    assert.equal((page.html.match(/<header\b/g) || []).length, 1, path);
    assert.equal((page.html.match(/<h1\b/g) || []).length, 1, path);
    assert.equal((page.html.match(/<footer\b/g) || []).length, 1, path);
    assert.equal((page.html.match(/<form data-api="newsletter"/g) || []).length, 1, path);
    assert.match(page.html, /class="home-footer"/);
    assert.match(page.html, /name="consent"[^>]*required/);
    assert.match(page.html, /name="website"[^>]*tabindex="-1"/);
    assert.match(page.html, /id="home-contact-panel"/);
    assert.doesNotMatch(page.html, /class="site-footer"|undefined|NaN/);
  }
  for (const path of ["/missing-page", "/products/missing", "/solutions/missing", "/services/missing", "/insights/missing"]) {
    const page = renderSite(path);
    assert.equal(page.found, false, path);
    assert.match(page.classes, /not-found-reference-page/);
    assert.doesNotMatch(page.classes, /article-reference-page|detail-reference-page|service-reference-page|policy-reference-page/);
    assert.match(page.html, /class="home-footer"/);
  }
});

test("Detail and service content, recommendations and publication boundaries remain intact", () => {
  for (const { path, item } of pages.filter((page) => page.type === "detail" || page.type === "service")) {
    const page = renderSite(path);
    assert.equal(page.title, `${item.name} | AQPTech`);
    assert.ok(page.html.includes(item.description), path);
    for (const feature of item.features || item.needs) assert.ok(page.html.includes(feature), `${path}: ${feature}`);
    assert.ok(page.html.includes(`/contact?interest=${encodeURIComponent(item.name)}`), path);
    if (item.applications) assert.ok(page.html.includes(item.applications), path);
    if (item.productSlugs) for (const slug of item.productSlugs) assert.ok(page.html.includes(`href="/products/${slug}"`), path);
  }
  assert.equal((renderSite("/privacy").html.match(/<section><h2>/g) || []).length, 5);
  assert.equal((renderSite("/terms").html.match(/<section><h2>/g) || []).length, 4);
  const header = renderSite("/").html.match(/<header\b[\s\S]*?<\/header>/)[0];
  for (const item of genericSolutions) assert.ok(!header.includes(`/solutions/${item.slug}`));
  assert.equal(catalogProducts.length, 4);
  for (const item of hardware) assert.ok(!renderSite("/products").html.includes(`href="/products/${item.slug}"`));
  const aboutHtml = renderSite("/about").html;
  for (const item of [...catalogProducts, ...services]) assert.ok(aboutHtml.includes(`/${services.includes(item) ? "services" : "products"}/${item.slug}`));
  for (const item of genericSolutions) assert.ok(!aboutHtml.includes(`/solutions/${item.slug}`));
});

test("All migrated families render white content, company buttons and black footers without overflow", { skip: !origin, timeout: 120000 }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const { path } of [...pages, { path: "/missing-page" }]) {
        const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), path === "/missing-page" ? 404 : 200, path);
        await page.evaluate(async () => {
          const images = [...document.querySelectorAll("main img")];
          images.forEach((image) => { image.loading = "eager"; });
          await Promise.all(images.map((image) => image.decode()));
          await document.fonts.ready;
        });
        assert.equal(await page.locator(".company-reference-page").count(), 1, path);
        assert.equal(await page.locator(".home-newsletter-form").count(), 1, path);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, path);
        assert.equal(await page.locator("#app").evaluate((app) => getComputedStyle(app).backgroundColor), "rgb(255, 255, 255)", path);
        assert.ok(await page.locator(".home-footer").evaluate((footer) => getComputedStyle(footer).backgroundColor.match(/\d+/g).every((value) => Number(value) < 32)), path);
        assert.ok(await page.locator("main img").evaluateAll((images) => images.every((image) => image.naturalWidth > 0 && getComputedStyle(image).filter === "none")), path);
        assert.ok(await page.locator("main .button-primary").evaluateAll((buttons) => buttons.every((button) => ["rgb(204, 0, 51)", "rgb(168, 0, 42)"].includes(getComputedStyle(button).backgroundColor))), path);
      }
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Migrated pages support Next navigation, widget cleanup, contact prefill and newsletter", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    const submissions = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/newsletter", async (route) => {
      submissions.push(route.request().postDataJSON());
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, message: "Company newsletter received." }) });
    });
    await page.goto(`${origin}/products/storage`, { waitUntil: "networkidle" });
    await page.locator('main a[href="/products/servers"]').first().click();
    await page.waitForURL(`${origin}/products/servers`);
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator(".detail-reference-page").count(), 1);
    await page.locator("[data-home-contact]").click();
    assert.equal(await page.locator("#home-contact-panel").isVisible(), true);
    await page.locator("[data-home-contact]").press("Escape");
    assert.equal(await page.locator("#home-contact-panel").isVisible(), false);
    await page.locator('.detail-hero a[href^="/contact?interest="]').click();
    await page.waitForURL("**/contact?interest=*");
    assert.equal(await page.locator('[name="interest"]').inputValue(), hardware.find((item) => item.slug === "servers").name);
    await page.goBack({ waitUntil: "networkidle" });
    await page.locator('footer a[href="/privacy"]').last().click();
    await page.waitForURL(`${origin}/privacy`);
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator(".policy-reference-page").count(), 1);
    const form = page.locator(".home-newsletter-form");
    await form.locator('[name="email"]').fill("company@example.com");
    await form.locator('[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector(".home-newsletter-form .form-status").textContent === "Company newsletter received.");
    assert.equal(submissions.length, 1);
    assert.equal(submissions[0].consent, true);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Migrated detail, service, policy, article and 404 pages remain readable without JavaScript", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 320, height: 900 } });
    for (const { path } of [...pages, { path: "/missing-page" }]) {
      const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), path === "/missing-page" ? 404 : 200, path);
      assert.equal(await page.locator("main h1:visible").count(), 1, path);
      assert.equal(await page.locator("#main-nav").isVisible(), true, path);
      assert.equal(await page.locator(".home-newsletter-form").count(), 1, path);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320, path);
    }
    await page.locator('.not-found a[href="/"]').click();
    await page.waitForURL(`${origin}/`);
    assert.equal(await page.locator(".home-landing-page").count(), 1);
  } finally { await browser.close(); }
});
