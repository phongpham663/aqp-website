import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";
import { renderSite } from "../src/site-renderer.js";
import { catalogProducts, completedSolutions, services } from "../src/data.js";

const origin = process.env.TEST_BASE_URL;
const site = renderSite("/");

test("Home presents the published solutions, software and service stages without draft content", () => {
  assert.ok(site.classes.split(" ").includes("home-landing-page"));
  assert.equal((site.html.match(/<h1\b/g) || []).length, 1);
  assert.match(site.html, /<h1 id="home-title">Kết nối an ninh\./);
  const cards = [...site.html.matchAll(/class="home-solution-card" href="\/solutions\/([^"]+)" data-home-group="([^"]+)"/g)];
  assert.deepEqual(cards.map((card) => card[1]).sort(), completedSolutions.map((solution) => solution.slug).sort());
  for (const [group, count] of [["infrastructure", 5], ["field", 2], ["operations", 2]]) {
    assert.equal(cards.filter((card) => card[2] === group).length, count);
  }
  assert.equal((site.html.match(/class="home-software-card"/g) || []).length, catalogProducts.length);
  assert.equal((site.html.match(/class="product-status"/g) || []).length, 1);
  assert.match(site.html, /data-product="fortisoptix">[\s\S]*?<span class="product-status">Comming Soon - Sắp ra mắt<\/span>/);
  for (const product of catalogProducts) assert.ok(site.html.includes(`href="/products/${product.slug}"`));
  for (const stage of ["planning", "implementation", "handover", "maintenance"]) {
    assert.ok(site.html.includes(`href="/services#ps-stage-${stage}"`));
  }
  const counts = [...site.html.matchAll(/class="home-capability-number">(\d+)</g)].map((match) => Number(match[1]));
  assert.deepEqual(counts, [catalogProducts.length, completedSolutions.length, services.length]);
  assert.ok(site.html.includes('aria-label="Lọc giải pháp theo nhu cầu" hidden'));
  assert.ok(site.html.includes('aria-controls="home-news-track"'));
  assert.doesNotMatch(site.html, /home-scope-note|không phải bằng chứng công trình, đối tác hoặc chứng nhận AQPTech/);
  assert.doesNotMatch(site.html, /undefined|NaN|data-category=|href="\/solutions\/(?:industrial|retail|data-centers)"/);
  assert.ok(!renderSite("/products").classes.split(" ").includes("home-landing-page"));
});

test("Public pages omit the requested reference footnotes without losing their main content", () => {
  for (const path of ["/", "/solutions/seaports-terminals", "/solutions/oil-gas", "/solutions/national-borders", "/solutions/critical-sites", "/solutions/gates-access", "/products/intelligent-video-analytics", "/products/veolink", "/solutions/event-security", "/solutions/construction-site-security", "/solutions/store-analytics", "/solutions/factory-intelligence", "/services"]) {
    const page = renderSite(path);
    assert.equal(page.found, true, path);
    assert.doesNotMatch(page.html, /home-scope-note|không phải bằng chứng công trình|Nội dung tham khảo từ giải pháp|Nội dung và hình ảnh tham khảo từ|Nội dung và hình ảnh dùng làm tư liệu tham khảo|Hình ảnh và giao diện minh họa thuộc OVOPARK|Hình ảnh giao diện và minh họa tham khảo từ|Khung vòng đời và ảnh phòng điều hành tham khảo|Hình ảnh và mô hình triển khai được tham khảo|Nội dung và ảnh nguồn thuộc Watchtower/, path);
    assert.equal((page.html.match(/<h1\b/g) || []).length, 1, path);
    assert.match(page.html, /class="home-footer"/);
  }
  for (const path of ["/privacy", "/terms"]) assert.match(renderSite(path).html, /class="policy-content container"/);
});

test("Home uses existing local images with dimensions and a priority hero", async () => {
  const hero = site.html.match(/<section class="home-hero home-texture"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  assert.match(hero, /src="\/assets\/velasea\/images\/velasea-hero_racks-1280x817--75b79a8043\.png"/);
  assert.match(hero, /width="1280" height="817" fetchpriority="high"/);
  assert.doesNotMatch(hero, /home-hero-media|home-media-label|home-hero-flow|figcaption/);
  const images = [...site.html.matchAll(/<img\b[^>]+>/g)].map((match) => match[0]);
  assert.ok(images.length >= 15);
  assert.equal(images.filter((image) => image.includes('fetchpriority="high"')).length, 1);
  for (const image of images) {
    assert.match(image, /alt="[^"]*"/);
    assert.match(image, /width="\d+" height="\d+"/);
    const [, source] = image.match(/src="([^"]+)"/);
    assert.ok(source.startsWith("/assets/"));
    await access(new URL(`..${source}`, import.meta.url));
  }
});

test("Home filters work with keyboard and survive Next navigation without stale handlers", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.locator(".home-solution-filters").waitFor({ state: "visible" });
    assert.equal(await page.locator("main h1").count(), 1);
    assert.equal(await page.locator(".home-solution-card:visible").count(), 9);
    await page.locator('.home-hero-actions a[href="#home-solutions"]').click();
    assert.ok(await page.locator("#home-solutions").evaluate((section) => section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < 160));
    for (const [group, count] of [["infrastructure", 5], ["field", 2], ["operations", 2], ["all", 9]]) {
      const button = page.locator(`[data-home-filter="${group}"]`);
      await button.focus();
      await button.press("Enter");
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator('.home-solution-filters [aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator(".home-solution-card:visible").count(), count);
      assert.equal(await page.locator("#home-solution-count").textContent(), `${count} giải pháp`);
      assert.ok(await page.locator(".home-solution-card[hidden]").evaluateAll((cards) => cards.every((card) => getComputedStyle(card).display === "none")));
    }
    await page.locator('[data-home-filter="operations"]').click();
    await page.locator('.home-solution-card[href="/solutions/factory-intelligence"]').click();
    await page.waitForURL("**/solutions/factory-intelligence");
    assert.equal(await page.locator(".factory-intelligence-page").count(), 1);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".home-solution-card:visible").count(), 9);
    await page.locator('[data-home-filter="field"]').click();
    assert.equal(await page.locator(".home-solution-card:visible").count(), 2);
    await page.locator('[data-home-contact]').click();
    assert.equal(await page.locator("#home-contact-panel").isVisible(), true);
    await page.locator('[data-home-contact]').press("Escape");
    assert.equal(await page.locator("#home-contact-panel").isVisible(), false);
    assert.equal(await page.locator('[data-home-contact]').getAttribute("aria-expanded"), "false");
    await page.locator('.home-product-copy a[href="/products/veolink"]').click();
    await page.waitForURL("**/products/veolink");
    assert.equal(await page.locator(".veolink-page").count(), 1);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.home-software-card[data-product="fortisoptix"] .product-status').textContent(), "Comming Soon - Sắp ra mắt");
    await page.locator('.home-product-copy a[href="/products/fortisoptix"]').click();
    await page.waitForURL("**/products/fortisoptix");
    assert.equal(await page.locator(".fortisoptix-page").count(), 1);
    await page.goBack({ waitUntil: "networkidle" });
    await page.locator('.home-journey-grid a[href="/services#ps-stage-handover"]').click();
    await page.waitForURL("**/services#ps-stage-handover");
    assert.equal(await page.locator("#ps-stage-handover").count(), 1);
    await page.goBack({ waitUntil: "networkidle" });
    await page.locator(".home-project-actions .home-button").click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Tư vấn giải pháp");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("Home is responsive and its article carousel supports controls, keyboard and reduced motion", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.locator(".home-solution-filters").waitFor({ state: "visible" });
    assert.equal(await page.locator(".home-news-controls").isVisible(), false);
    for (const width of [1920, 1440, 1024, 768, 600, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      assert.ok(await page.locator('.home-software-card[data-product="fortisoptix"] .product-status').evaluate((badge) => {
        const bounds = badge.getBoundingClientRect();
        return bounds.width > 0 && bounds.left >= 0 && bounds.right <= innerWidth;
      }));
      const hero = await page.locator(".home-hero").evaluate((section) => {
        const image = section.querySelector(".home-hero-image img");
        const photo = image.getBoundingClientRect();
        const copy = section.querySelector(".home-hero-copy").getBoundingClientRect();
        return { background: getComputedStyle(section).backgroundImage, clip: getComputedStyle(image).clipPath, ratio: photo.width / photo.height, photoX: photo.x, photoY: photo.y, copyRight: copy.right, copyBottom: copy.bottom };
      });
      assert.match(hero.background, /repeating-linear-gradient/);
      assert.match(hero.clip, /polygon/);
      assert.ok(Math.abs(hero.ratio - 1280 / 817) < 0.01);
      assert.ok(width > 760 ? hero.photoX >= hero.copyRight : hero.photoY >= hero.copyBottom);
      assert.ok(await page.locator("#home-title").evaluate((heading) => parseFloat(getComputedStyle(heading).fontSize) >= 32));
      assert.ok(await page.locator(".home-solution-filters button").evaluateAll((buttons) => buttons.every((button) => button.getBoundingClientRect().height >= 44)));
    }
    assert.ok(await page.locator("main [aria-controls]").evaluateAll((controls) => controls.every((control) => document.getElementById(control.getAttribute("aria-controls")))));
    await page.evaluate(async () => {
      const images = [...document.querySelectorAll("main img")];
      images.forEach((image) => { image.loading = "eager"; });
      await Promise.all(images.map((image) => image.decode()));
    });
    await page.locator(".home-news-controls").waitFor({ state: "visible" });
    await page.locator('[data-news-direction="-1"]').waitFor({ state: "visible" });
    assert.equal(await page.locator('[data-news-direction="-1"]').isDisabled(), true);
    await page.locator('[data-news-direction="1"]').click();
    await page.waitForFunction(() => document.querySelector(".home-news-position").textContent === "2 / 3");
    const track = page.locator("#home-news-track");
    await track.focus();
    await track.press("End");
    await page.waitForFunction(() => document.querySelector(".home-news-position").textContent === "3 / 3");
    assert.equal(await page.locator('[data-news-direction="1"]').isDisabled(), true);
    await track.press("Home");
    await page.waitForFunction(() => document.querySelector(".home-news-position").textContent === "1 / 3");
    await track.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector(".home-news-position").textContent === "2 / 3");
    await track.press("ArrowLeft");
    await page.waitForFunction(() => document.querySelector(".home-news-position").textContent === "1 / 3");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(() => document.querySelector(".home-news-controls").hidden);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    await page.locator(".nav-dropdown summary").click();
    await page.locator('.dropdown-panel a[href="/solutions/store-analytics"]').click();
    await page.waitForURL("**/solutions/store-analytics");
    assert.equal(await page.locator(".store-analytics-page").count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("Home retains all solution links, navigation and newsletter consent without JavaScript", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    // Keep native anchor navigation synchronous when page scripts are disabled.
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".home-solution-filters").isVisible(), false);
    assert.equal(await page.locator(".home-solution-card:visible").count(), 9);
    assert.equal(await page.locator("#main-nav").isVisible(), true);
    assert.equal(await page.locator(".menu-toggle").isVisible(), false);
    assert.equal(await page.locator(".site-header").evaluate((header) => getComputedStyle(header).position), "static");
    assert.equal(await page.locator('footer [name="consent"]').getAttribute("required"), "");
    assert.equal(await page.locator('footer a[href="mailto:contact@aqptech.vn"]').count(), 1);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.locator("body").evaluate(() => document.documentElement.scrollWidth), width);
    }
    await page.locator('.home-hero-actions a[href="#home-solutions"]').click();
    assert.equal(new URL(page.url()).hash, "#home-solutions");
    assert.ok(await page.locator("#home-solutions").evaluate((section) => section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < 160));
  } finally {
    await browser.close();
  }
});
