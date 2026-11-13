import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createRendererServer as createServer } from "./test-site.mjs";

let vite;
let html;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true },
    appType: "custom",
  });
  const { veolinkPage } = await vite.ssrLoadModule("/src/veolink.js");
  html = veolinkPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
});

after(async () => {
  await vite?.close();
});

test("Veolink renders all reference features, benefits and integration groups", () => {
  assert.match(html, /<h1 id="veolink-title">Veolink<\/h1>/);
  const features = html.match(/<ol class="veolink-feature-list">([\s\S]*?)<\/ol>/)[1];
  const integrations = html.match(/<ul class="veolink-network-nodes">([\s\S]*?)<\/ul>/)[1];
  assert.equal((features.match(/<li>/g) || []).length, 9);
  assert.equal((integrations.match(/<li /g) || []).length, 12);
  assert.equal((html.match(/<article class="industry-benefit">/g) || []).length, 9);
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("Veolink section links have matching accessible sections", () => {
  for (const id of ["veolink-features", "veolink-benefits", "veolink-resources"]) {
    assert.ok(html.includes(`href="#${id}"`));
    assert.match(html, new RegExp(`<section id="${id}"[^>]*aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title"`));
  }
  assert.ok(html.includes('href="/contact?interest=Veolink"'));
  assert.ok(html.includes(encodeURIComponent("Hỗ trợ & góp ý Veolink")));
});

test("Fortis X video, reference notes and brochure block are removed while consultation remains", () => {
  assert.doesNotMatch(html, /industry-video-link|Xem video Fortis X|youtube\.com|youtu\.be/);
  assert.doesNotMatch(html, /Khám phá mô hình điều hành tích hợp C5I|Xem brochure Fortis X|Fortis-X-Brochure|brochureUrl/);
  const consultation = html.match(/<section id="veolink-resources"[\s\S]*?<\/section>/)[0];
  assert.match(consultation, /class="home-button" href="\/contact\?interest=Veolink"/);
  assert.doesNotMatch(consultation, /industry-resources|<h3>|\.pdf/);
  assert.doesNotMatch(html, /Tài liệu tham khảo gốc của Magal Solutions, bằng tiếng Anh|PDF tiếng Anh từ Magal|tham khảo từ Fortis X/);
  assert.ok(html.includes("Khả năng kết nối thực tế phụ thuộc giao thức, thiết bị"));
  assert.doesNotMatch(html, /Nội dung và hình ảnh tham khảo|không phải tài liệu sản phẩm Veolink đã được xác nhận/);
});
