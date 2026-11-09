import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createServer } from "vite";

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
    await page.locator('[data-region-choice="vietnam"]').click();
    assert.equal(await page.locator("#contact-region").inputValue(), "Việt Nam");
    for (const path of ["/", "/contact", "/products", "/support"]) {
      await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
      const footer = page.locator("footer");
      assert.equal(await footer.locator(".footer-info").count(), 1);
      assert.equal(await footer.locator('a[href="mailto:contact@aqptech.vn"]').count(), 1);
      assert.equal(await footer.locator('a[href="tel:+84378053305"]').count(), 1);
      await footer.locator(".footer-info").scrollIntoViewIfNeeded();
      const images = await footer.locator(".footer-logo img").all();
      assert.equal(images.length, 3);
      for (const image of images) {
        await image.evaluate((element) => element.decode());
        assert.equal(await image.isVisible(), true);
        assert.equal(await image.evaluate((element) => element.naturalWidth === Number(element.getAttribute("width")) && element.naturalHeight === Number(element.getAttribute("height"))), true);
      }
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
