import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createRendererServer as createServer } from "./test-site.mjs";

let vite;
let html;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const { gatesAccessPage } = await vite.ssrLoadModule("/src/gates-access.js");
  html = gatesAccessPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
});

after(async () => {
  await vite?.close();
});

test("Gates & Access preserves all nine features and four benefits", () => {
  assert.match(html, /<h1 id="gates-access-title">Gates & Access<\/h1>/);
  const lists = [...html.matchAll(/<article id="gates-access-[\s\S]*?<ul>([\s\S]*?)<\/ul>/g)];
  assert.deepEqual(lists.map((match) => (match[1].match(/<li>/g) || []).length), [4, 5]);
  assert.equal((html.match(/<li><strong>/g) || []).length, 9);
  assert.equal((html.match(/<article class="industry-benefit">/g) || []).length, 4);
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("Gates & Access navigation and consultation remain valid without the original-solution link", () => {
  for (const id of ["gates-access-authentication", "gates-access-integration"]) {
    assert.ok(html.includes(`href="#${id}"`));
    assert.match(html, new RegExp(`<article id="${id}"[^>]*aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title"`));
  }
  assert.ok(html.includes(`/contact?interest=${encodeURIComponent("Gates & Access")}`));
  assert.doesNotMatch(html, /href="https:\/\/www\.magalsolutions\.com\/gates-access\/"/);
  assert.doesNotMatch(html, /industry-video-link|Xem brochure|\.pdf|youtube\.com/);
});

test("Gates & Access attributes Fortis X and qualifies building integration", () => {
  assert.ok(html.includes("Trong giải pháp tham khảo của Magal, ACS là một phần của nền tảng Fortis X C5I"));
  assert.ok(html.includes("logic liên động phải được thiết kế cùng yêu cầu thoát hiểm"));
  assert.ok(html.includes("HVAC"));
  assert.ok(html.includes("Anti-passback"));
  assert.ok(html.includes("mức độ tuân thủ cần được đánh giá"));
});
