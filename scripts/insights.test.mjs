import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
import { articles, images } from "../src/data.js";
import { escape } from "../src/html.js";
import { renderSite } from "../src/site-renderer.js";

const origin = process.env.TEST_BASE_URL;
const listing = renderSite("/insights");
const main = listing.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];

test("Insights uses the company hero, branded footer and one consent-based newsletter", () => {
  assert.equal(listing.found, true);
  assert.match(listing.classes, /\bhome-page\b/);
  assert.match(listing.classes, /\binsights-reference-page\b/);
  assert.equal((listing.html.match(/<header\b/g) || []).length, 1);
  assert.equal((listing.html.match(/<h1\b/g) || []).length, 1);
  assert.equal((listing.html.match(/<footer\b/g) || []).length, 1);
  assert.equal((listing.html.match(/<form data-api="newsletter"/g) || []).length, 1);
  assert.match(main, /<h1 id="insights-title">/);
  assert.match(main, /href="#insights-articles"/);
  assert.match(main, /id="insights-articles"[^>]*aria-labelledby="insights-articles-title"/);
  assert.match(main, /class="insights-count"><strong>03<\/strong>/);
  assert.match(listing.html, /class="home-footer"/);
  assert.match(listing.html, /class="home-newsletter-form"/);
  assert.match(listing.html, /name="email"[^>]*required/);
  assert.match(listing.html, /name="consent"[^>]*required/);
  assert.match(listing.html, /name="website"[^>]*tabindex="-1"/);
  assert.match(listing.html, /href="\/insights" aria-current="page"/);
  assert.doesNotMatch(main, /class="page-intro"|class="cta-section"|class="article-card"|data-category=|home-news-track|undefined|NaN/);
  assert.equal(renderSite("/insights/").html, listing.html);
});

test("Insights preserves every article and uses local images with real dimensions", async () => {
  const cards = [...main.matchAll(/<a class="insights-card"[\s\S]*?<\/a>/g)].map((match) => match[0]);
  assert.equal(cards.length, articles.length);
  for (const [index, article] of articles.entries()) {
    const card = cards[index];
    assert.ok(card.includes(`href="/insights/${article.slug}"`));
    assert.ok(card.includes(`aria-labelledby="insights-${article.slug}-title"`));
    assert.ok(card.includes(`id="insights-${article.slug}-title"`));
    for (const text of [article.title, article.category, article.summary, article.time]) assert.ok(card.includes(escape(text)), text);
    assert.ok(card.includes(`src="${article.image}"`));
    assert.ok(card.includes(`width="${article.imageWidth}" height="${article.imageHeight}" loading="lazy"`));
    assert.equal((card.match(/<a\b/g) || []).length, 1);
    await access(new URL(`..${article.image}`, import.meta.url));
  }
  assert.ok(main.includes(`src="${images.dataCenter}"`));
  await access(new URL(`..${images.dataCenter}`, import.meta.url));
  assert.equal((main.match(/fetchpriority="high"/g) || []).length, 1);
  assert.equal((main.match(/loading="lazy"/g) || []).length, articles.length);
});

test("Article detail content, related links and unknown-route handling remain unchanged", () => {
  for (const article of articles) {
    const detail = renderSite(`/insights/${article.slug}`);
    assert.equal(detail.found, true);
    assert.equal(detail.title, `${article.title} | AQPTech`);
    assert.match(detail.classes, /home-page/);
    assert.match(detail.classes, /article-reference-page/);
    assert.match(detail.classes, /company-reference-page/);
    assert.doesNotMatch(detail.classes, /insights-reference-page/);
    assert.match(detail.html, /class="article-detail container"/);
    assert.match(detail.html, /class="home-footer"/);
    assert.equal((detail.html.match(/<form data-api="newsletter"/g) || []).length, 1);
    assert.equal((detail.html.match(/class="insights-card"/g) || []).length, articles.length - 1);
    assert.equal((detail.html.match(/class="article-cover"/g) || []).length, 1);
    assert.ok(detail.html.includes(`width="${article.imageWidth}" height="${article.imageHeight}" fetchpriority="high"`));
    assert.ok(detail.html.includes(escape(article.category)));
    assert.ok(detail.html.includes(article.time));
    assert.ok(detail.html.includes(escape(article.summary)));
    for (const [index, [heading, text]] of article.sections.entries()) {
      assert.ok(detail.html.includes(`>${escape(heading)}</h2>`));
      assert.ok(detail.html.includes(escape(text)));
      assert.ok(detail.html.includes(`href="#article-section-${index + 1}"`));
      assert.ok(detail.html.includes(`id="article-section-${index + 1}" aria-labelledby="article-heading-${index + 1}"`));
    }
    for (const related of articles.filter((item) => item.slug !== article.slug)) assert.ok(detail.html.includes(`href="/insights/${related.slug}"`));
    assert.ok(!detail.html.includes(`href="/insights/${article.slug}"`));
  }
  for (const path of ["/insights/missing-article", "/insights/missing/article"]) {
    const missing = renderSite(path);
    assert.equal(missing.found, false);
    assert.doesNotMatch(missing.classes, /insights-reference-page/);
    assert.match(missing.html, /class="not-found container"/);
  }
});

test("Insights is responsive, accessible and uses natural-color images with reduced motion", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 1200, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/insights`, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        const images = [...document.querySelectorAll("main img")];
        images.forEach((image) => { image.loading = "eager"; });
        await Promise.all(images.map((image) => image.decode()));
        await document.fonts.ready;
      });
      assert.equal(await page.locator(".insights-card:visible").count(), articles.length);
      const columns = await page.locator(".insights-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(/\s+/).length);
      assert.equal(columns, width > 1100 ? 3 : width > 760 ? 2 : 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.locator("#app").evaluate((app) => getComputedStyle(app).backgroundColor), "rgb(255, 255, 255)");
      assert.ok(await page.locator(".insights-card").evaluateAll((cards) => cards.every((card) => {
        const rect = card.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth + 1 && card.scrollWidth <= card.clientWidth;
      })));
      assert.ok(await page.locator(".insights-card-image img").evaluateAll((images) => images.every((image) =>
        image.naturalWidth === Number(image.getAttribute("width")) && image.naturalHeight === Number(image.getAttribute("height")) && getComputedStyle(image).filter === "none")));
    }
    await page.locator('.industry-hero-actions a[href="#insights-articles"]').click();
    assert.equal(new URL(page.url()).pathname, "/insights");
    assert.ok(await page.locator("#insights-articles").evaluate((section) => {
      const top = section.getBoundingClientRect().top;
      const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
      return top >= headerBottom && top < headerBottom + 50;
    }));
    await page.locator(".insights-card").first().hover();
    assert.equal(await page.locator(".insights-card-image img").first().evaluate((image) => getComputedStyle(image).transform), "none");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Insights supports keyboard article navigation, back navigation, contact and newsletter", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    const submissions = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/newsletter", async (route) => {
      submissions.push(route.request().postDataJSON());
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ ok: true, message: "Newsletter registration received." }) });
    });
    await page.goto(`${origin}/products`, { waitUntil: "networkidle" });
    await page.locator('#main-nav > a[href="/insights"]').click();
    await page.waitForURL(`${origin}/insights`);
    await page.waitForLoadState("networkidle");
    const card = page.locator(`.insights-card[href="/insights/${articles[0].slug}"]`);
    await card.focus();
    await card.press("Enter");
    await page.waitForURL(`${origin}/insights/${articles[0].slug}`);
    assert.equal(await page.locator("main h1").textContent(), articles[0].title);
    assert.equal(await page.locator(".insights-reference-page").count(), 0);
    assert.equal(await page.locator(".article-reference-page").count(), 1);
    assert.equal(await page.locator(".home-footer").count(), 1);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".insights-reference-page").count(), 1);
    await page.locator("[data-home-contact]").click();
    assert.equal(await page.locator("#home-contact-panel").isVisible(), true);
    await page.locator("[data-home-contact]").press("Escape");
    assert.equal(await page.locator("#home-contact-panel").isVisible(), false);
    const form = page.locator(".home-newsletter-form");
    await form.locator('[name="firstName"]').fill("Linh");
    await form.locator('[name="lastName"]').fill("Nguyen");
    await form.locator('[name="email"]').fill("insights@example.com");
    await form.locator('[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector(".home-newsletter-form .form-status").textContent === "Newsletter registration received.");
    assert.equal(submissions.length, 1);
    assert.equal(submissions[0].email, "insights@example.com");
    assert.equal(submissions[0].consent, true);
    assert.equal(submissions[0].firstName, "Linh");
    const contact = page.locator(".insights-help .home-button");
    const interest = new URL(await contact.getAttribute("href"), origin).searchParams.get("interest");
    await contact.click();
    await page.waitForURL("**/contact?interest=*");
    assert.equal(await page.locator('[name="interest"]').inputValue(), interest);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("All article pages provide responsive reading, natural-color covers and keyboard contents", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const article of articles) {
        await page.goto(`${origin}/insights/${article.slug}`, { waitUntil: "networkidle" });
        await page.evaluate(async () => {
          const images = [...document.querySelectorAll("main img")];
          images.forEach((image) => { image.loading = "eager"; });
          await Promise.all(images.map((image) => image.decode()));
          await document.fonts.ready;
        });
        assert.equal(await page.locator("main h1").textContent(), article.title);
        assert.equal(await page.locator(".article-body > section").count(), article.sections.length);
        assert.equal(await page.locator(".article-toc a").count(), article.sections.length);
        assert.equal(await page.locator(".related-articles .insights-card").count(), articles.length - 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        assert.equal(await page.locator(".article-toc").evaluate((toc) => getComputedStyle(toc).position), width > 760 ? "sticky" : "static");
        assert.ok(await page.locator(".article-body p").evaluateAll((paragraphs) => paragraphs.every((p) => parseFloat(getComputedStyle(p).fontSize) >= 15)));
        assert.ok(await page.locator("main img").evaluateAll((images) => images.every((image) =>
          getComputedStyle(image).filter === "none" && image.naturalWidth === Number(image.getAttribute("width")) && image.naturalHeight === Number(image.getAttribute("height")))));
        const target = page.locator('.article-toc a[href="#article-section-2"]');
        await target.focus();
        await target.press("Enter");
        assert.ok(await page.locator("#article-section-2").evaluate((section) => {
          const top = section.getBoundingClientRect().top;
          const headerBottom = document.querySelector(".site-header").getBoundingClientRect().bottom;
          return top >= headerBottom - 1 && top < headerBottom + 50;
        }));
      }
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Article contents and related links work without JavaScript", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 320, height: 900 } });
    await page.goto(`${origin}/insights/${articles[0].slug}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".article-body > section:visible").count(), articles[0].sections.length);
    await page.locator('.article-toc a[href="#article-section-3"]').click();
    assert.equal(new URL(page.url()).hash, "#article-section-3");
    assert.ok(await page.locator("#article-section-3").evaluate((section) => {
      const top = section.getBoundingClientRect().top;
      return top >= 0 && top < 160;
    }));
    await page.locator(`.related-articles a[href="/insights/${articles[1].slug}"]`).click();
    await page.waitForURL(`${origin}/insights/${articles[1].slug}`);
    assert.equal(await page.locator("main h1").textContent(), articles[1].title);
    assert.equal(await page.locator(".article-reference-page").count(), 1);
  } finally { await browser.close(); }
});

test("Insights cards and native section links remain usable without JavaScript", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, reducedMotion: "reduce" });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/insights`, { waitUntil: "networkidle" });
      assert.equal(await page.locator(".insights-card:visible").count(), articles.length);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.equal(await page.locator("#main-nav").isVisible(), true);
      assert.equal(await page.locator('footer [name="consent"]').getAttribute("required"), "");
    }
    await page.locator('.industry-hero-actions a[href="#insights-articles"]').click();
    assert.equal(new URL(page.url()).hash, "#insights-articles");
    assert.ok(await page.locator("#insights-articles").evaluate((section) => {
      const top = section.getBoundingClientRect().top;
      return top >= 0 && top < 160;
    }));
    await page.locator(`.insights-card[href="/insights/${articles[2].slug}"]`).click();
    await page.waitForURL(`${origin}/insights/${articles[2].slug}`);
    assert.equal(await page.locator("main h1").textContent(), articles[2].title);
  } finally { await browser.close(); }
});
