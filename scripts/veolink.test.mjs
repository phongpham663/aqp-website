import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createServer } from "vite";

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

test("Fortis X resources remain attributed and safely open in a new tab", () => {
  assert.match(html, /href="https:\/\/www\.youtube\.com\/watch\?v=80EWEtl7aCA" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="[^"]*Fortis-X-Brochure[^"?]*\.pdf" target="_blank" rel="noopener noreferrer"/);
  assert.ok(html.includes("Xem brochure Fortis X"));
  assert.doesNotMatch(html, /Tài liệu tham khảo gốc của Magal Solutions, bằng tiếng Anh|PDF tiếng Anh từ Magal/);
  assert.ok(html.includes("Magal Solutions"));
  assert.ok(html.includes("không phải tài liệu sản phẩm Veolink đã được xác nhận"));
});
