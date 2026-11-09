import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createServer } from "vite";

let vite;
let server;
let html;
let origin;

before(async () => {
  server = createHttpServer();
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: { server } },
    appType: "spa",
  });
  const { supportPage } = await vite.ssrLoadModule("/src/support.js");
  html = supportPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await vite?.close();
});

test("Support uses the shared hero and preserves the four existing FAQ topics", () => {
  assert.match(html, /<h1 id="support-title">Hỗ trợ kỹ thuật<\/h1>/);
  assert.ok(html.includes('class="about-reference-hero"'));
  assert.equal((html.match(/class="support-topic"/g) || []).length, 4);
  assert.equal((html.match(/<details id="support-faq-/g) || []).length, 4);
  for (const text of ["Cần cung cấp gì khi yêu cầu hỗ trợ?", "Chính sách bảo hành được xác định như thế nào?", "Có thể nâng cấp hệ thống hiện tại không?", "AQPTech có hỗ trợ hệ thống OEM không?"]) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /undefined|NaN|class="page-intro"|<iframe|<form/);
});

test("Support has accessible sections, preparation guidance and actual contact destinations", () => {
  for (const id of ["topics", "preparation", "faq"]) {
    assert.match(html, new RegExp(`<section id="support-${id}"[^>]*aria-labelledby="support-${id}-title"`));
    assert.ok(html.includes(`id="support-${id}-title"`));
  }
  const checklist = html.match(/<ul class="support-checklist" role="list">([\s\S]*?)<\/ul>/)[1];
  const process = html.match(/<ol class="support-process" role="list">([\s\S]*?)<\/ol>/)[1];
  assert.equal((checklist.match(/<li>/g) || []).length, 4);
  assert.equal((process.match(/<li>/g) || []).length, 3);
  for (const interest of ["Hỗ trợ kỹ thuật", "Bảo hành & bảo trì", "Nâng cấp hệ thống", "Hỗ trợ OEM"]) assert.ok(html.includes(`href="/contact?interest=${encodeURIComponent(interest)}"`));
  assert.ok(html.includes('href="/services#ps-stage-maintenance"'));
  assert.ok(html.includes('href="#support-faq"'));
  assert.match(html, /width="980" height="653" fetchpriority="high"/);
});

test("Support retains privacy and warranty qualifications without inventing contact channels", () => {
  for (const text of ["Không gửi mật khẩu, khóa truy cập", "ẩn dữ liệu riêng tư", "thỏa thuận dự án", "công suất nguồn, khe mở rộng", "thời gian phản hồi được xác nhận", "không phải nhân sự hoặc cơ sở AQPTech"]) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /href="(?:tel:|mailto:)|24\/7|phản hồi trong \d+|đảm bảo xử lý|đăng nhập/i);
});

test("Support renders the branded navigation, responsive content, keyboard FAQs and contact prefill", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/support`, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".support-reference-page.home-page").count(), 1);
    assert.equal(await page.locator(".home-header, .home-footer").count(), 2);
    assert.equal(await page.locator(".utility-bar").count(), 0);
    assert.equal(await page.locator('meta[name="theme-color"]').getAttribute("content"), "#000000");
    assert.equal(await page.locator('.home-header a[href="/support"]').getAttribute("aria-current"), "page");
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    }
    await page.locator('#support-faq-warranty > summary').focus();
    await page.locator('#support-faq-warranty > summary').press("Enter");
    assert.equal(await page.locator('#support-faq-warranty > div').isVisible(), true);
    await page.locator('#support-faq-warranty > summary').press("Space");
    assert.equal(await page.locator('#support-faq-warranty').getAttribute("open"), null);
    assert.ok(await page.locator(".support-revealed").count() > 0);
    await page.locator('.support-topic[href*="OEM"]').click();
    await page.waitForURL("**/contact?interest=**");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Hỗ trợ OEM");
    assert.equal(await page.locator(".support-reference-page").count(), 0);
    await page.goBack({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.support-faq-list details').count(), 4);
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await reduced.goto(`${origin}/support#support-faq`, { waitUntil: "networkidle" });
    assert.equal(await reduced.locator('.support-revealed').count(), 0);
    assert.ok(await reduced.locator('[data-support-reveal]').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === "1" && getComputedStyle(element).animationName === "none")));
    assert.ok(await reduced.evaluate(() => scrollY > 400));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
