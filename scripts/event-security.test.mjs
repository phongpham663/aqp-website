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
  const { eventSecurityPage } = await vite.ssrLoadModule("/src/event-security.js");
  html = eventSecurityPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
});

after(async () => {
  await vite?.close();
});

test("Event Security renders the source-inspired workflow and eight practical AI cases", () => {
  assert.match(html, /<h1 id="event-security-title">Event Security<\/h1>/);
  const steps = html.match(/<ol class="event-workflow-steps">([\s\S]*?)<\/ol>/)[1];
  assert.equal((steps.match(/<li>/g) || []).length, 4);
  const cases = [...html.matchAll(/<article id="event-ai-([^"]+)"[\s\S]*?<\/article>/g)];
  assert.deepEqual(cases.map((match) => match[1]), ["crowd-density", "queue-monitoring", "restricted-zones", "exit-obstruction", "stationary-objects", "possible-fall", "vehicle-pedestrian", "heat-smoke"]);
  for (const [index, match] of cases.entries()) {
    assert.ok(match[0].includes(`<span>AI / ${String(index + 1).padStart(2, "0")}</span>`));
    for (const label of ["Dữ liệu đầu vào", "Tín hiệu cảnh báo", "Con người xử lý", "Giới hạn cần lưu ý"]) assert.ok(match[0].includes(`<dt>${label}</dt>`));
    assert.ok(match[0].includes("<details><summary>"));
    assert.ok(match[0].includes(encodeURIComponent("Event Security - AI:")));
  }
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("Event Security navigation and consultation have accessible targets", () => {
  for (const id of ["event-workflow", "event-ai", "event-infrastructure", "event-consultation"]) {
    assert.ok(html.includes(`href="#${id}"`));
    assert.match(html, new RegExp(`<section id="${id}"[^>]*aria-labelledby="${id}-title"`));
    assert.ok(html.includes(`id="${id}-title"`));
  }
  assert.ok(html.includes('href="/contact?interest=Event%20Security"'));
  assert.ok(html.includes(encodeURIComponent("Event Security - Tư vấn ứng dụng AI")));
  for (const slug of ["ip-video", "networking", "edge-industrial", "ai-computing", "storage"]) assert.ok(html.includes(`href="/products/${slug}"`));
  for (const href of ["/products/veolink", "/products/intelligent-video-analytics", "/solutions/gates-access"]) assert.ok(html.includes(`href="${href}"`));
});

test("Event Security separates proposed AI from source claims and preserves safeguards", () => {
  assert.ok(html.includes("không phải danh sách tính năng Watchtower đã xác nhận"));
  assert.ok(html.includes("không nhận diện khuôn mặt"));
  assert.ok(html.includes("Video gốc vẫn có thể là dữ liệu cá nhân"));
  assert.ok(html.includes("không cam kết dự đoán chen lấn hoặc giẫm đạp"));
  assert.ok(html.includes("Không xác định chất nổ"));
  assert.ok(html.includes("Không thay thế hệ thống báo cháy được chứng nhận"));
  assert.ok(html.includes("không phải nhân sự hoặc công trình của AQPTech"));
  assert.match(html, /href="https:\/\/wt-security\.com\/en-gb\/application\/event-security" target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /<form|salesforce|\.pdf|Watchtower Solar/);
});
