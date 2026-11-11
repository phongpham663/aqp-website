import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createRendererServer as createServer } from "./test-site.mjs";

let vite;
let html;
let seaportsHtml;
let sharedPages;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const { videoAnalyticsPage } = await vite.ssrLoadModule("/src/video-analytics.js");
  const { seaportsPage } = await vite.ssrLoadModule("/src/seaports.js");
  const icon = (name) => `<i data-lucide="${name}"></i>`;
  html = videoAnalyticsPage({ icon });
  seaportsHtml = seaportsPage({ icon });
  sharedPages = [html, seaportsHtml];
  for (const [path, name] of [["/src/oil-gas.js", "oilGasPage"], ["/src/national-borders.js", "nationalBordersPage"], ["/src/critical-sites.js", "criticalSitesPage"], ["/src/gates-access.js", "gatesAccessPage"]]) {
    const module = await vite.ssrLoadModule(path);
    sharedPages.push(module[name]({ icon }));
  }
});

after(async () => {
  await vite?.close();
});

test("Intelligent Video Analytics preserves all reference capability points and benefits", () => {
  assert.match(html, /<h1 id="intelligent-video-analytics-title">Intelligent Video Analytics<\/h1>/);
  const lists = [...html.matchAll(/<article id="iva-[\s\S]*?<ul>([\s\S]*?)<\/ul>/g)];
  assert.deepEqual(lists.map((match) => (match[1].match(/<li>/g) || []).length), [5, 2, 3]);
  assert.equal((html.match(/<article class="industry-benefit">/g) || []).length, 7);
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("IVA section navigation and consultation links have valid targets", () => {
  for (const id of ["iva-safety-environment", "iva-security", "iva-operational-efficiency"]) {
    assert.ok(html.includes(`href="#${id}"`));
    assert.match(html, new RegExp(`<article id="${id}"[^>]*aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title"`));
  }
  assert.ok(html.includes(`/contact?interest=${encodeURIComponent("Intelligent Video Analytics")}`));
  assert.ok(html.includes("không thay thế hoàn toàn giám sát của con người"));
  assert.ok(html.includes("không thay thế đánh giá y tế"));
});

test("IVA retains consultation without the removed original-solution link", () => {
  assert.doesNotMatch(html, /href="https:\/\/www\.magalsolutions\.com\/intelligent-video-analytics\/"/);
  assert.doesNotMatch(html, /industry-video-link|Xem brochure|\.pdf|youtube\.com/);
  assert.ok(html.includes("Nội dung tham khảo từ giải pháp Intelligent Video Analytics của Magal"));
});

test("All six shared solution pages omit the removed Magal source link and language note", () => {
  assert.equal(sharedPages.length, 6);
  for (const rendered of sharedPages) {
    assert.doesNotMatch(rendered, /Xem giải pháp gốc của Magal|Tài liệu gốc bằng tiếng Anh từ Magal Solutions/);
    const resources = rendered.match(/<div class="industry-resources">([\s\S]*?)<\/section>/)[1];
    assert.match(resources, /<h3>[^<]+<\/h3>/);
    assert.match(resources, /class="home-button" href="\/contact\?interest=/);
  }
});

test("Shared solution renderer preserves existing video and brochure links", () => {
  assert.match(seaportsHtml, /href="https:\/\/www\.youtube\.com\/watch\?v=dUytsxdoidc" target="_blank" rel="noopener noreferrer"/);
  assert.match(seaportsHtml, /href="https:\/\/www\.magalsolutions\.com\/wp-content\/uploads\/Seaport-brochure-1\.pdf" target="_blank" rel="noopener noreferrer"/);
  assert.ok(seaportsHtml.includes("Xem brochure Magal"));
});
