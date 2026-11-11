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
let data;
const title = "V\u1ec1 AQPTech";
const interest = "T\u01b0 v\u1ea5n gi\u1ea3i ph\u00e1p";

before(async () => {
  server = createHttpServer();
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: { server } },
    appType: "spa",
  });
  data = await vite.ssrLoadModule("/src/data.js");
  const { aboutPage } = await vite.ssrLoadModule("/src/about.js");
  html = aboutPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await vite?.close();
});

test("About introduces three capabilities and uses the live product and solution directories", () => {
  assert.ok(html.includes(`<h1 id="about-title">${title}</h1>`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/class="about-capability"/g) || []).length, 3);
  for (const product of data.catalogProducts) {
    assert.ok(html.includes(`href="/products/${product.slug}">${product.name}`));
    assert.ok(!html.includes(`href="/solutions/${product.slug}"`));
  }
  for (const service of data.services) {
    assert.ok(html.includes(`href="/services/${service.slug}"`));
  }
  const directory = html.match(/<div class="about-solution-grid">([\s\S]*?)<\/div>/)[1];
  assert.deepEqual(
    [...directory.matchAll(/href="([^"]+)"/g)].map((match) => match[1]),
    data.completedSolutions.map((solution) => `/solutions/${solution.slug}`),
  );
  for (const solution of data.completedSolutions) {
    assert.ok(directory.includes(`<span>${solution.menuName || solution.name}</span>`));
  }
  assert.doesNotMatch(html, /undefined|NaN|about-capability-network|about-capability-directory/);
});

test("About preserves semantic process, native FAQs, qualified imagery and shared contact details", () => {
  const steps = html.match(/<ol class="about-process-steps" role="list">([\s\S]*?)<\/ol>/)[1];
  assert.equal((steps.match(/<li>/g) || []).length, 4);
  assert.equal((steps.match(/class="about-step-output"/g) || []).length, 4);
  assert.equal((html.match(/<details><summary>/g) || []).length, 3);
  assert.match(html, /width="2160" height="1230" fetchpriority="high"/);
  assert.match(html, /kh\u00f4ng ph\u1ea3i nh\u00e2n s\u1ef1 AQPTech/);
  assert.match(html, /class="about-scope-note"/);
  assert.match(html, /\(SLA\)/);
  assert.ok(html.includes('href="#about-capabilities"'));
  assert.equal(html.split(`href="/contact?interest=${encodeURIComponent(interest)}"`).length - 1, 2);
  assert.ok(html.includes(`href="mailto:${data.companyContact.email}"`));
  assert.ok(html.includes(`href="${data.companyContact.phoneHref}"`));
  assert.doesNotMatch(html, /24\/7|100%|class="about-company-photo"/);
});

test("About renders responsive accessible content, keyboard FAQs and working consultation journeys", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${origin}/about`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), `${title} | AQPTech`);
    assert.equal(await page.locator(".about-reference-page.home-page").count(), 1);
    assert.equal(await page.locator(".home-header, .home-footer").count(), 2);
    assert.equal(await page.locator('.home-header a[href="/about"]').getAttribute("aria-current"), "page");
    assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), await page.locator(".about-hero-panel > p").textContent());
    assert.equal(await page.locator(".about-capability").count(), 3);
    assert.equal(await page.locator(".about-solution-grid > a").count(), data.completedSolutions.length);
    assert.equal(await page.locator('.about-contact-actions a[href^="mailto:"]').textContent(), data.companyContact.email);
    assert.equal(await page.locator('.about-contact-actions a[href^="tel:"]').getAttribute("href"), data.companyContact.phoneHref);
    await page.locator(".about-hero-photo").evaluate((image) => image.decode());
    assert.equal(await page.locator(".about-hero-photo").evaluate((image) => image.naturalWidth === Number(image.getAttribute("width")) && image.naturalHeight === Number(image.getAttribute("height"))), true);
    assert.equal(await page.locator("main [aria-labelledby]").evaluateAll((elements) => elements.every((element) => element.getAttribute("aria-labelledby").split(/\s+/).every((id) => document.getElementById(id)))), true);
    assert.equal(await page.locator("[id]").evaluateAll((elements) => new Set(elements.map((element) => element.id)).size === elements.length), true);

    for (const width of [1440, 1024, 768, 760, 600, 480, 390, 360, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
      assert.equal(await page.locator("main *").evaluateAll((elements) => elements.every((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.width === 0 || (bounds.left >= -1 && bounds.right <= innerWidth + 1);
      })), true, `About content overflow at ${width}px`);
    }
    for (const faq of await page.locator(".about-question-list details").all()) {
      const summary = faq.locator("summary");
      await summary.focus();
      await summary.press("Enter");
      assert.equal(await faq.locator("p").isVisible(), true);
      assert.equal(await summary.evaluate((element) => getComputedStyle(element).outlineStyle), "solid");
      await summary.press("Space");
      assert.equal(await faq.getAttribute("open"), null);
    }
    assert.equal(await page.locator(".about-question-list summary svg, .about-solution-grid > a").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).transitionDuration.split(",").every((duration) => Number.parseFloat(duration) <= 0.00001))), true);
    await page.locator("footer .footer-info").scrollIntoViewIfNeeded();
    for (const image of await page.locator("footer .footer-logo img").all()) {
      await image.evaluate((element) => element.decode());
      assert.equal(await image.evaluate((element) => element.naturalWidth > 0), true);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator(".about-hero-link").click();
    assert.equal(await page.locator("#about-capabilities").evaluate((element) => {
      const top = element.getBoundingClientRect().top;
      return top >= document.querySelector(".home-header").getBoundingClientRect().bottom && top < innerHeight;
    }), true);

    for (const product of data.catalogProducts) {
      await page.locator(`.about-capability-links a[href="/products/${product.slug}"]`).click();
      await page.waitForURL(`${origin}/products/${product.slug}`);
      assert.equal(await page.locator("main h1").textContent(), product.name);
      assert.equal(await page.locator(".about-reference-page").count(), 0);
      await page.goBack({ waitUntil: "networkidle" });
      assert.equal(await page.locator(".about-reference-page").count(), 1);
    }
    for (const selector of [".about-hero-actions .home-button", ".about-contact-actions .home-button"]) {
      await page.locator(selector).click();
      await page.waitForURL((url) => url.pathname === "/contact" && url.searchParams.get("interest") === interest);
      assert.equal(await page.locator('[name="interest"]').inputValue(), interest);
      assert.equal(await page.locator(".about-reference-page").count(), 0);
      await page.goBack({ waitUntil: "networkidle" });
      assert.equal(await page.locator(".about-reference-page").count(), 1);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
