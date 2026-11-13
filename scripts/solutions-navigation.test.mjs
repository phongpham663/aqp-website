import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";
import { renderSite } from "../src/site-renderer.js";

let vite;
let header;
let allSolutions;
let completedSolutions;
let publicPaths;
const origin = process.env.TEST_BASE_URL;
const slugs = ["gates-access", "event-security", "construction-site-security", "seaports-terminals", "oil-gas", "national-borders", "critical-sites", "store-analytics", "factory-intelligence"];

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const data = await vite.ssrLoadModule("/src/data.js");
  allSolutions = data.solutions;
  completedSolutions = data.completedSolutions;
  publicPaths = [
    "/", "/about", "/solutions", "/products", "/services", "/insights", "/support", "/contact", "/privacy", "/terms",
    ...data.solutions.map((item) => `/solutions/${item.slug}`),
    ...data.products.map((item) => `/products/${item.slug}`),
    ...data.services.map((item) => `/services/${item.slug}`),
    ...data.articles.map((item) => `/insights/${item.slug}`),
  ];
  const { homeHeader } = await vite.ssrLoadModule("/src/home.js");
  header = homeHeader({ icon: () => "", logo: () => "AQPTech" });
});

after(async () => { await vite?.close(); });

test("Solutions navigation publishes only the nine completed solution pages in order", () => {
  assert.deepEqual(completedSolutions.map((solution) => solution.slug), slugs);
  const links = [...header.matchAll(/href="\/solutions\/([^"]+)"/g)];
  assert.deepEqual(links.map((match) => match[1]), slugs);
  assert.ok(header.includes('href="/solutions"'));
  for (const [slug, label] of [
    ["gates-access", "Cổng & kiểm soát ra vào"],
    ["event-security", "An ninh sự kiện"],
    ["construction-site-security", "An ninh công trường"],
    ["store-analytics", "Phân tích cửa hàng"],
    ["factory-intelligence", "Nhà máy thông minh"],
  ]) assert.ok(header.includes(`href="/solutions/${slug}">${label}</a>`));
  assert.doesNotMatch(header, /Store Analytics -|Factory Intelligence -/);
});

test("Draft solutions remain available for development but are absent from the menu", () => {
  const drafts = allSolutions.filter((solution) => !solution.completed);
  assert.deepEqual(drafts.map((solution) => solution.slug), ["data-centers", "industrial", "smart-cities", "logistics", "retail", "education"]);
  for (const draft of drafts) assert.ok(!header.includes(`href="/solutions/${draft.slug}"`));
  assert.equal(allSolutions.length, 15);
});

test("Public pages do not display external source or reference material links", () => {
  for (const pathname of publicPaths) {
    const html = renderSite(pathname).html;
    assert.doesNotMatch(html, /Nguồn\s*:/iu, pathname);
    for (const [link] of html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>[\s\S]*?<\/a>/g)) {
      assert.doesNotMatch(link, /Nguồn|tư liệu|tham khảo/iu, pathname);
    }
  }
});

test("Every public route, redirect alias and 404 uses the same header without changing page layouts", () => {
  const normalize = (html) => html.replace(/ active(?=")/g, "").replace(/ aria-current="page"/g, "");
  const sharedHeader = renderSite("/").html.match(/<header\b[\s\S]*?<\/header>/)[0];
  for (const pathname of [...publicPaths, "/missing-page", "/products/missing-page", "/solutions/missing-page", "/solutions/veolink", "/solutions/intelligent-video-analytics", "/products/veolink/"]) {
    const site = renderSite(pathname);
    const headers = [...site.html.matchAll(/<header\b[\s\S]*?<\/header>/g)];
    assert.equal(headers.length, 1, pathname);
    assert.equal(normalize(headers[0][0]), sharedHeader, pathname);
    assert.equal(site.themeColor, "#000000", pathname);
    assert.doesNotMatch(site.html, /class="utility-bar"/);
    assert.doesNotMatch(headers[0][0], /class="container header-inner"/);
  }
  assert.match(renderSite("/about").html, /class="home-footer"/);
  assert.match(renderSite("/privacy").html, /class="home-footer"/);
  assert.ok(renderSite("/privacy").classes.includes("policy-reference-page"));
});

test("Navigation highlights the containing section and only marks an exact page as current", () => {
  const exactPages = new Set([
    "/about", "/solutions", "/products", "/services", "/insights", "/support", "/contact",
    ...completedSolutions.map((item) => `/solutions/${item.slug}`),
  ]);
  for (const pathname of publicPaths) {
    const header = renderSite(pathname).html.match(/<header\b[\s\S]*?<\/header>/)[0];
    const current = [...header.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*aria-current="page"/g)].map((match) => match[1]);
    assert.deepEqual(current, exactPages.has(pathname) ? [pathname] : [], pathname);
    const section = `/${pathname.split("/")[1]}`;
    if (section === "/solutions") assert.match(header, /<summary class="nav-link active">/);
    else if (exactPages.has(section)) assert.ok(header.includes(`class="nav-link active" href="${section}"`), pathname);
    else assert.doesNotMatch(header, /class="nav-link active"/);
  }
  for (const pathname of ["/solutions/veolink", "/solutions/intelligent-video-analytics"]) {
    const header = renderSite(pathname).html.match(/<header\b[\s\S]*?<\/header>/)[0];
    assert.match(header, /class="nav-link active" href="\/products"/);
    assert.doesNotMatch(header, /<summary class="nav-link active">|href="\/products" aria-current="page"/);
  }
});

test("Unknown pages keep a server-rendered 404 header without intercepting APIs, assets or redirects", { skip: !origin }, async () => {
  for (const pathname of ["/missing-page", "/products/missing-page?q=video", "/solutions/missing-page", "/apiary", "/404/nested"]) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, 404, pathname);
    const html = await response.text();
    assert.equal((html.match(/<header\b/g) || []).length, 1, pathname);
    assert.match(html, /class="site-header home-header"/);
    assert.match(html, /<noscript>/);
    assert.match(html, /<meta name="robots" content="noindex"/);
    assert.match(html, /<meta name="theme-color" content="#000000"/);
    assert.doesNotMatch(html, /id="__next_error__"/);
  }
  const head = await fetch(`${origin}/missing-page`, { method: "HEAD" });
  assert.equal(head.status, 404);
  assert.equal(await head.text(), "");
  const rsc = await fetch(`${origin}/missing-page`, { headers: { RSC: "1" } });
  assert.equal(rsc.status, 404);
  assert.match(rsc.headers.get("content-type"), /text\/x-component/);
  await rsc.text();
  for (const pathname of ["/about", "/%61bout", "/products?q=video", "/products/veolink/"]) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), /class="site-header home-header"/);
  }
  for (const pathname of ["/api/health", "/api/not-found"]) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, pathname === "/api/health" ? 200 : 404, pathname);
    assert.match(response.headers.get("content-type"), /application\/json/);
    await response.json();
  }
  for (const pathname of ["/favicon-aqptech.png", "/favicon%2Daqptech.png", "/assets/velasea/images/velasea-hero_racks-1280x817--75b79a8043.png"]) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type"), /image\/png/);
    await response.arrayBuffer();
  }
  const redirect = await fetch(`${origin}/solutions/veolink/?q=video`, { redirect: "manual" });
  assert.equal(redirect.status, 308);
  assert.match(redirect.headers.get("location"), /\/products\/veolink\?q=video$/);
});

test("Header geometry and menus stay consistent across every page on desktop and mobile", { skip: !origin, timeout: 180000 }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      let baseline;
      for (const pathname of [...publicPaths, "/missing-page"]) {
        await page.goto(`${origin}${pathname}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const toggle = page.locator(".menu-toggle");
        assert.equal(await toggle.isVisible(), width <= 1000, pathname);
        if (width <= 1000) await toggle.click();
        const layout = await page.locator(".site-header").evaluate((header) => {
          const inner = header.querySelector(".header-inner").getBoundingClientRect();
          const brand = header.querySelector(".brand").getBoundingClientRect();
          const nav = header.querySelector(".main-nav");
          const navStyle = getComputedStyle(nav);
          return {
            height: header.getBoundingClientRect().height,
            background: getComputedStyle(header).backgroundColor,
            innerX: inner.x, innerWidth: inner.width, brandX: brand.x, brandWidth: brand.width,
            brandFont: getComputedStyle(header.querySelector(".brand-name")).fontSize,
            taglineColor: getComputedStyle(header.querySelector(".brand-tagline")).color,
            navDisplay: navStyle.display, navGap: navStyle.gap,
            navFont: getComputedStyle(nav.querySelector(".nav-link")).fontSize,
            links: [...nav.querySelectorAll("a")].map((link) => link.getAttribute("href")),
            fits: header.scrollWidth <= header.clientWidth && nav.scrollWidth <= nav.clientWidth,
          };
        });
        assert.equal(layout.height, width > 760 ? 92 : 76, pathname);
        assert.equal(layout.background, "rgb(0, 0, 0)", pathname);
        assert.equal(layout.navDisplay, "flex", pathname);
        assert.ok(layout.fits, pathname);
        baseline ??= layout;
        assert.deepEqual(layout, baseline, `${pathname} at ${width}px`);
        await page.locator(".nav-dropdown summary").click();
        assert.equal(await page.locator(".dropdown-panel").isVisible(), true, pathname);
        assert.ok(await page.locator(".dropdown-panel").evaluate((panel) => {
          const rect = panel.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= innerWidth && panel.scrollWidth <= panel.clientWidth;
        }), pathname);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator(".nav-dropdown").getAttribute("open"), null, pathname);
        assert.equal(await toggle.getAttribute("aria-expanded"), "false", pathname);
      }
    }
    await page.goto(origin, { waitUntil: "networkidle" });
    for (const width of [1920, 1200, 1024, 1000, 768, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const toggle = page.locator(".menu-toggle");
      assert.equal(await toggle.isVisible(), width <= 1000);
      if (width <= 1000) await toggle.click();
      assert.equal(await page.locator("#main-nav").isVisible(), true);
      assert.ok(await page.locator(".site-header").evaluate((header) => header.scrollWidth <= header.clientWidth));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.keyboard.press("Escape");
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Mobile navigation resets on Next navigation and when selecting the current page", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/privacy`, { waitUntil: "networkidle" });
    for (const pathname of ["/about", "/about", "/insights", "/products"]) {
      await page.locator(".menu-toggle").click();
      await page.locator(`#main-nav > a[href="${pathname}"]`).click();
      await page.waitForURL(`${origin}${pathname}`);
      await page.waitForLoadState("networkidle");
      assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
      assert.equal(await page.locator("#main-nav").isVisible(), false);
      assert.equal(await page.locator(`#main-nav > a[href="${pathname}"]`).getAttribute("aria-current"), "page");
    }
    await page.locator(".menu-toggle").click();
    await page.locator(".nav-dropdown summary").press("Enter");
    await page.locator('.dropdown-panel a[href="/solutions/critical-sites"]').click();
    await page.waitForURL(`${origin}/solutions/critical-sites`);
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator('.dropdown-panel a[aria-current="page"]').getAttribute("href"), "/solutions/critical-sites");
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    await page.locator(".menu-toggle").click();
    await page.locator('#main-nav > a[href="/about"]').evaluate((link) => { link.href = "/missing-page"; });
    await page.locator('#main-nav > a[href="/missing-page"]').click();
    await page.waitForURL(`${origin}/missing-page`);
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator(".site-header").count(), 1);
    assert.match(await page.locator("main").textContent(), /KHÔNG TÌM THẤY/);
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("Every header remains usable without JavaScript on tablet and small mobile screens", { skip: !origin }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, reducedMotion: "reduce" });
    for (const width of [768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      for (const pathname of ["/", "/about", "/services", "/insights", "/privacy", "/missing-page"]) {
        const response = await page.goto(`${origin}${pathname}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), pathname === "/missing-page" ? 404 : 200, pathname);
        assert.equal(await page.locator("#main-nav").isVisible(), true, pathname);
        assert.equal(await page.locator(".menu-toggle").isVisible(), false, pathname);
        assert.equal(await page.locator(".site-header").evaluate((header) => getComputedStyle(header).position), "static", pathname);
        assert.equal(await page.locator("#main-nav").evaluate((nav) => getComputedStyle(nav).flexDirection), "column", pathname);
        await page.locator(".nav-dropdown summary").click();
        assert.equal(await page.locator(".dropdown-panel > a:visible").count(), 10, pathname);
        assert.ok(await page.locator(".site-header").evaluate((header) => header.scrollWidth <= header.clientWidth), `${pathname} at ${width}px`);
      }
    }
  } finally { await browser.close(); }
});
