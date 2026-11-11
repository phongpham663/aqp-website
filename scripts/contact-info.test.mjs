import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";
import { renderSite } from "../src/site-renderer.js";

let vite;
let server;
let origin;
let companyContact;
let infoHtml;
let homeHtml;

before(async () => {
  server = createHttpServer();
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: { server } },
    appType: "spa",
  });
  ({ companyContact } = await vite.ssrLoadModule("/src/data.js"));
  const { footerInfo } = await vite.ssrLoadModule("/src/footer-info.js");
  const { homeFooter } = await vite.ssrLoadModule("/src/home.js");
  const icon = (name) => `<i data-lucide="${name}"></i>`;
  infoHtml = footerInfo({ icon });
  homeHtml = homeFooter({ icon, logo: () => "<span>AQPTech</span>" });
  server.on("request", vite.middlewares);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await vite?.close();
});

test("Company contact data preserves the supplied email, phone and three department addresses", () => {
  assert.equal(companyContact.email, "contact@aqptech.vn");
  assert.equal(companyContact.phone, "0378053305");
  assert.equal(companyContact.phoneHref, `tel:+84${companyContact.phone.slice(1)}`);
  assert.deepEqual(companyContact.offices, [
    { name: "Phòng Kinh Doanh", address: "491/1 Trường Chinh, Phường Tân Bình, Thành phố Hồ Chí Minh", lang: "vi" },
    { name: "Phòng Nghiên cứu và Phát triển", address: "216/1 Điện Biên Phủ, Phường Xuân Hòa, Hồ Chí Minh", lang: "vi" },
    { name: "Phòng Thí nghiệm và Đào tạo", address: "Lot E2-M1, Saigon Hi-Tech Park (SHTP), Tang Nhon Phu Ward, Ho Chi Minh City", lang: "en" },
  ]);
});

test("Contact omits the map and all region choices while retaining contact details and form fields", () => {
  for (const region of ["", "Việt Nam", "Châu Á – Thái Bình Dương"]) {
    const site = renderSite("/contact", `?${new URLSearchParams({ interest: "Hỗ trợ kỹ thuật", region })}`);
    assert.equal(site.found, true);
    assert.doesNotMatch(site.html, /contact-(?:map|world|region)|data-(?:map-control|region-choice)|name="region"|Châu Á|Châu Âu|Châu Mỹ|Natural Earth|Khu vực dự kiến triển khai/);
    assert.match(site.html, /name="interest"[^>]*value="Hỗ trợ kỹ thuật"/);
    assert.equal((site.html.match(/class="contact-office"/g) || []).length, 3);
    for (const name of ["lastName", "firstName", "company", "email", "phone", "interest", "message", "consent", "website"]) {
      assert.ok(site.html.includes(`name="${name}"`), name);
    }
    assert.match(site.html, /<form class="contact-form contact-reference-form" data-api="contact">/);
    assert.match(site.html, /name="consent" type="checkbox" required/);
    assert.match(site.html, /href="\/privacy"/);
    assert.match(site.html, /href="\/support"/);
  }
});

test("Footer information uses local accessible logos and actual direct-contact links", () => {
  assert.ok(infoHtml.includes('href="mailto:contact@aqptech.vn"'));
  assert.ok(infoHtml.includes('href="tel:+84378053305"'));
  const images = [...infoHtml.matchAll(/<img[^>]+>/g)].map((match) => match[0]);
  assert.equal(images.length, 3);
  for (const image of images) {
    assert.match(image, /src="\/assets\/branding\//);
    assert.match(image, /alt="[^"]+" width="\d+" height="\d+" loading="lazy"/);
  }
  assert.ok(infoHtml.includes("Logo DMCA"));
  assert.ok(infoHtml.includes("Logo NCSC VN"));
  assert.ok(infoHtml.includes("Logo Đã thông báo Bộ Công Thương"));
  assert.doesNotMatch(infoHtml, /undefined|NaN|href="https?:|đã xác minh|được chứng nhận|đối tác chính thức/i);
});

test("Branded footer places the new contact/logo row after legal links and retains newsletter consent", () => {
  assert.equal((homeHtml.match(/class="footer-info"/g) || []).length, 1);
  assert.ok(homeHtml.indexOf('class="footer-info"') > homeHtml.indexOf('class="home-footer-bottom"'));
  assert.ok(homeHtml.indexOf('class="footer-info"') < homeHtml.indexOf("</footer>"));
  assert.match(homeHtml, /<form data-api="newsletter"/);
  assert.match(homeHtml, /name="consent" type="checkbox" required/);
  assert.ok(homeHtml.includes('href="/privacy"'));
});

test("Contact details and both footer variants render accurately without mobile overflow", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${origin}/contact?interest=Hỗ%20trợ%20kỹ%20thuật`, { waitUntil: "networkidle" });
    const offices = await page.locator(".contact-office").evaluateAll((rows) => rows.map((row) => ({
      name: row.querySelector("dt").textContent,
      address: row.querySelector("address").textContent,
      lang: row.querySelector("address").getAttribute("lang"),
    })));
    assert.deepEqual(offices, companyContact.offices);
    assert.doesNotMatch(await page.locator(".contact-reference-info").textContent(), /Đang cập nhật|sẽ được cập nhật/);
    assert.equal(await page.locator('.contact-details a[href^="mailto:"]').textContent(), companyContact.email);
    assert.equal(await page.locator('.contact-details a[href^="tel:"]').getAttribute("href"), companyContact.phoneHref);
    assert.equal(await page.locator('[name="interest"]').inputValue(), "Hỗ trợ kỹ thuật");
    assert.equal(await page.locator('.contact-worldmap, .contact-region-section, [name="region"]').count(), 0);
    for (const path of ["/", "/contact", "/products", "/support"]) {
      await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
      const footer = page.locator("footer");
      assert.equal(await footer.locator(".footer-info").count(), 1);
      assert.equal(await footer.locator('a[href="mailto:contact@aqptech.vn"]').count(), 1);
      assert.equal(await footer.locator('a[href="tel:+84378053305"]').count(), 1);
      await footer.locator(".footer-info").scrollIntoViewIfNeeded();
      assert.ok(await footer.locator(".footer-logo").evaluateAll((logos) => logos.every((logo) => getComputedStyle(logo).backgroundColor === "rgba(0, 0, 0, 0)" && getComputedStyle(logo).borderTopWidth === "0px")));
      const images = await footer.locator(".footer-logo img").all();
      assert.equal(images.length, 3);
      for (const image of images) {
        await image.evaluate((element) => element.decode());
        assert.equal(await image.isVisible(), true);
        assert.equal(await image.evaluate((element) => element.naturalWidth === Number(element.getAttribute("width")) && element.naturalHeight === Number(element.getAttribute("height"))), true);
      }
      assert.equal(await footer.locator(".footer-logo-ncsc img").evaluate((image) => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, 1, 1).data[3];
      }), 0);
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForFunction(() => document.documentElement.scrollWidth === innerWidth);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, path);
      }
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("Contact submissions and resets work without a region on desktop and mobile", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    const payloads = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/contact", async (route) => {
      payloads.push(route.request().postDataJSON());
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ message: "Đã ghi nhận yêu cầu.", id: "test-contact-id" }) });
    });
    for (const [index, width] of [1440, 390].entries()) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${process.env.TEST_BASE_URL}/contact?interest=Hỗ%20trợ%20kỹ%20thuật&region=Việt%20Nam`, { waitUntil: "networkidle" });
      assert.equal(await page.locator('.contact-worldmap, .contact-region-section, [name="region"]').count(), 0);
      const form = page.locator('form[data-api="contact"]');
      await form.locator('[name="lastName"]').fill("Nguyen Van");
      await form.locator('[name="firstName"]').fill("An");
      await form.locator('[name="company"]').fill("Example Company");
      await form.locator('[name="email"]').fill("contact-test@example.com");
      await form.locator('[name="phone"]').fill("0900000000");
      await form.locator('[name="message"]').fill("Yeu cau tu van cau hinh may chu.");
      await form.locator('[type="submit"]').click();
      assert.equal(payloads.length, index);
      await form.locator('[name="consent"]').check();
      await form.locator('[type="submit"]').click();
      await form.locator(".form-status.success").waitFor();
      assert.equal(payloads.length, index + 1);
      assert.equal(payloads[index].name, "Nguyen Van An");
      assert.equal(payloads[index].interest, "Hỗ trợ kỹ thuật");
      assert.equal(payloads[index].consent, true);
      assert.equal(payloads[index].website, "");
      assert.ok(!Object.hasOwn(payloads[index], "region"));
      assert.match(await form.locator(".form-status").textContent(), /test-contact-id/);
      assert.equal(await form.locator('[name="lastName"]').inputValue(), "");
      assert.equal(await form.locator('[name="interest"]').inputValue(), "Hỗ trợ kỹ thuật");
      assert.equal(await form.locator('[name="consent"]').isChecked(), false);
      assert.equal(await form.locator('[type="submit"]').isEnabled(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.locator(".contact-info-support").click();
      await page.waitForURL("**/support");
      await page.goBack({ waitUntil: "networkidle" });
      assert.equal(await page.locator('form[data-api="contact"]').count(), 1);
      assert.equal(await page.locator('.contact-worldmap, .contact-region-section, [name="region"]').count(), 0);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test("Contact remains readable without JavaScript or region controls on small mobile screens", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const response = await page.goto(`${process.env.TEST_BASE_URL}/contact?interest=CMMS&region=Việt%20Nam`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("main h1").textContent(), "Liên hệ");
    assert.equal(await page.locator('[name="interest"]').inputValue(), "CMMS");
    assert.equal(await page.locator('.contact-worldmap, .contact-region-section, [name="region"]').count(), 0);
    assert.equal(await page.locator('.contact-details a[href^="tel:"]').getAttribute("href"), companyContact.phoneHref);
    assert.equal(await page.locator('form[data-api="contact"]').isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
  } finally {
    await browser.close();
  }
});
