import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";
import { createRendererServer as createServer } from "./test-site.mjs";

let vite;
let html;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const { constructionSecurityPage } = await vite.ssrLoadModule("/src/construction-security.js");
  html = constructionSecurityPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
});
after(async () => { await vite?.close(); });

test("Construction security renders four features, nine source solutions and four FAQs", () => {
  assert.match(html, /<h1 id="construction-security-title">An ninh công trường<\/h1>/);
  const features = html.match(/<ul class="cs-feature-list" role="list">([\s\S]*?)<\/ul>/)[1];
  assert.equal((features.match(/<li>/g) || []).length, 4);
  const systems = [...html.matchAll(/<details class="cs-system" id="cs-system-([^"]+)"/g)];
  assert.deepEqual(systems.map((match) => match[1]), ["360", "ai", "mast", "celsius", "solar", "box", "alarmkit", "thermal", "plan"]);
  assert.equal((html.match(/<details id="cs-faq-/g) || []).length, 4);
  const names = [...html.matchAll(/<strong class="cs-system-name">([^<]+)<\/strong>/g)].map((match) => match[1]);
  assert.deepEqual(names, ["Camera cơ động 360 độ", "Giám sát tích hợp AI", "Cột camera cơ động", "Giám sát biến đổi nhiệt", "Giám sát dùng năng lượng mặt trời", "Thiết bị giám sát nhỏ gọn", "Bộ báo động không dây", "Giám sát chu vi bằng ảnh nhiệt", "Khảo sát & lập phương án an ninh"]);
  assert.doesNotMatch(html.replace(/\bsrc="[^"]*"/g, ""), /watch\s*tower/i);
  assert.doesNotMatch(html, /undefined|NaN|opacity:0|visibility:hidden/);
});

test("Construction security navigation, related pages and disclosures retain accessible targets", () => {
  for (const id of ["approach", "systems", "consultation", "faq"]) {
    assert.ok(html.includes(`href="#cs-${id}"`));
    assert.match(html, new RegExp(`<section id="cs-${id}"[^>]*aria-labelledby="cs-${id}-title"`));
    assert.ok(html.includes(`id="cs-${id}-title"`));
  }
  for (const href of ["/products/intelligent-video-analytics", "/solutions/gates-access", "/products/veolink"]) assert.ok(html.includes(`href="${href}"`));
  assert.ok(html.includes(encodeURIComponent("An ninh công trường")));
  assert.ok(html.includes(encodeURIComponent("An ninh công trường - Camera cơ động 360 độ")));
  assert.ok(html.includes(encodeURIComponent("An ninh công trường - Giám sát dùng năng lượng mặt trời")));
  assert.match(html, /href="https:\/\/wt-security\.com\/en-gb\/application\/construction-site-security" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /width="1920" height="1280" fetchpriority="high"/);
});

test("Construction enquiry uses the existing consent-based AQP contact contract", () => {
  const form = html.match(/<form class="cs-quote-form" data-api="contact">([\s\S]*?)<\/form>/)[1];
  for (const field of ["firstName", "lastName", "company", "email", "phone", "message", "interest", "consent", "website"]) assert.ok(form.includes(`name="${field}"`));
  assert.match(form, /name="consent" type="checkbox" required/);
  assert.match(form, /name="message"[^>]*minlength="10" maxlength="5000" required/);
  assert.ok(form.includes('type="hidden" name="interest" value="An ninh công trường"'));
  assert.ok(form.includes('href="/privacy"'));
  assert.ok(form.includes('role="status" aria-live="polite"'));
  assert.ok(form.includes("không phải xác nhận báo giá"));
  assert.doesNotMatch(form, /action=|storyblok|watchtower|salesforce|iframe/i);
});

test("Construction security corrects Solar source copy and qualifies provider claims", () => {
  const solar = html.match(/id="cs-system-solar"([\s\S]*?)<\/details>/)[1];
  assert.ok(solar.includes("tấm pin năng lượng mặt trời"));
  assert.doesNotMatch(solar, /Giám sát chu vi bằng ảnh nhiệt|254,800|22,500/);
  assert.ok(html.includes("không phải danh mục sản phẩm AQPTech đã xác nhận phân phối"));
  assert.ok(html.includes("không mặc định do AQPTech cung cấp"));
  assert.ok(html.includes("không thay thế hệ thống báo cháy được chứng nhận"));
  assert.ok(html.includes("Quyền lợi bảo hiểm phải đối chiếu hợp đồng cụ thể"));
  assert.ok(html.includes("4G/5G"));
  assert.doesNotMatch(html, /Nội dung và hình ảnh dùng làm tư liệu tham khảo|Hình ảnh không phải công trình hay nhân sự AQPTech/);
  assert.doesNotMatch(html, /impenetrable|NDAA|NSI Gold|254,800|22,500|\.pdf|<iframe/);
});

test("Construction consultation uses the supplied illustration with its real dimensions", async () => {
  const story = html.match(/<div class="cs-story cs-story-reverse">([\s\S]*?)<\/figure>/)[1];
  assert.match(story, /src="\/assets\/watchtower\/construction-site-security\/images\/image\.png"/);
  assert.match(story, /alt="Nhân sự ghi chép khảo sát bên trạm an ninh công trường màu đỏ và trắng"/);
  assert.match(story, /width="1535" height="1024" loading="lazy"/);
  assert.doesNotMatch(story, /watchtower-site-consultation\.webp/);
  await access(new URL("../assets/watchtower/construction-site-security/images/image.png", import.meta.url));
});

test("The new construction consultation illustration loads without cropping on desktop and mobile", { skip: !process.env.TEST_BASE_URL }, async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`${process.env.TEST_BASE_URL}/solutions/construction-site-security`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      const image = page.locator(".cs-story-reverse .cs-media img");
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
      assert.equal(await image.isVisible(), true);
      assert.ok(await image.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return element.naturalWidth === 1535 && element.naturalHeight === 1024 && Math.abs(bounds.width / bounds.height - 1535 / 1024) < 0.01;
      }));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
