import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let html;

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const { professionalServicesPage } = await vite.ssrLoadModule("/src/professional-services.js");
  html = professionalServicesPage({ icon: (name) => `<i data-lucide="${name}"></i>` });
});

after(async () => {
  await vite?.close();
});

test("Professional Services preserves all seven Magal lifecycle stages and 31 activities", () => {
  assert.match(html, /<h1 id="professional-services-title">Professional Services<\/h1>/);
  const stages = [...html.matchAll(/<li id="ps-stage-([^"]+)"([\s\S]*?)(?=<li id="ps-stage-|<\/ol>)/g)];
  assert.deepEqual(stages.map((match) => match[1]), ["planning", "engineering", "procurement", "implementation", "handover", "maintenance", "upgrades"]);
  const labels = [
    "Consultation, Assessment & Planning",
    "Engineering & System Design",
    "Procurement & System Integration",
    "Installation, Implementation & Commissioning",
    "Handover, Training & Knowledge Transfer",
    "Maintenance, Support & Lifecycle Management",
    "Future-Proofing & System Upgrades",
  ];
  const counts = [5, 6, 3, 5, 4, 4, 4];
  stages.forEach((stage, index) => {
    assert.ok(stage[0].includes(labels[index]));
    assert.ok(stage[0].includes(`aria-labelledby="ps-stage-${stage[1]}-title"`));
    assert.ok(stage[0].includes(`id="ps-stage-${stage[1]}-title"`));
    assert.ok(stage[0].includes(`<span class="ps-stage-number" aria-hidden="true">0${index + 1}</span>`));
    const checklist = stage[0].match(/<ul class="ps-stage-checks" role="list">([\s\S]*?)<\/ul>/)[1];
    assert.equal((checklist.match(/<li>/g) || []).length, counts[index]);
    assert.ok(stage[0].includes("ĐẦU RA ĐỀ XUẤT"));
  });
  assert.ok(html.includes("CONOPS"));
  assert.ok(html.includes("(SAT)"));
  assert.ok(html.includes("SOP"));
  assert.doesNotMatch(html, /undefined|NaN/);
});

test("Professional Services links to accessible stages, consultation and existing services", () => {
  for (const id of ["planning", "engineering", "procurement", "implementation", "handover", "maintenance", "upgrades"]) {
    assert.ok(html.includes(`href="#ps-stage-${id}" data-ps-stage-link`));
  }
  assert.match(html, /<section id="ps-lifecycle"[^>]*aria-labelledby="ps-lifecycle-title"/);
  assert.ok(html.includes('href="#ps-lifecycle"'));
  assert.equal((html.match(/aria-current="step"/g) || []).length, 1);
  assert.ok(html.includes('<ol class="ps-stages" role="list">'));
  assert.equal((html.match(/class="ps-stage-checks" role="list"/g) || []).length, 7);
  assert.ok(html.includes(encodeURIComponent("Professional Services - Tư vấn vòng đời dự án")));
  for (const slug of ["oem", "integration", "lifecycle"]) assert.ok(html.includes(`href="/services/${slug}"`));
  assert.ok(html.includes('href="/support"'));
});

test("Professional Services attributes reference content and qualifies service commitments", () => {
  assert.match(html, /href="https:\/\/www\.magalsolutions\.com\/our-professional-services\/" target="_blank" rel="noopener noreferrer"/);
  assert.ok(html.includes("không phải ảnh công trình hoặc nhân sự của AQPTech"));
  assert.ok(html.includes("không hàm ý quan hệ đối tác hay chứng nhận"));
  assert.ok(html.includes("Hỗ trợ kỹ thuật 24/7 theo SLA đã được xác nhận"));
  assert.ok(html.includes("các đầu ra là đề xuất"));
  assert.ok(html.includes("đơn vị thực hiện phù hợp"));
  assert.match(html, /width="939" height="969" fetchpriority="high"/);
  assert.doesNotMatch(html, /<form|<iframe|\.pdf|opacity:0|visibility:hidden/);
});
