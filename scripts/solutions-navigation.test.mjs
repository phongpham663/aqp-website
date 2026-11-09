import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { createServer } from "vite";

let vite;
let header;
let allSolutions;
let completedSolutions;
const slugs = ["gates-access", "event-security", "construction-site-security", "seaports-terminals", "oil-gas", "national-borders", "critical-sites", "store-analytics", "factory-intelligence"];

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const data = await vite.ssrLoadModule("/src/data.js");
  allSolutions = data.solutions;
  completedSolutions = data.completedSolutions;
  const { homeHeader } = await vite.ssrLoadModule("/src/home.js");
  header = homeHeader({ icon: () => "", logo: () => "AQPTech" });
});

after(async () => { await vite?.close(); });

test("Solutions navigation publishes only the nine completed solution pages in order", () => {
  assert.deepEqual(completedSolutions.map((solution) => solution.slug), slugs);
  const links = [...header.matchAll(/href="\/solutions\/([^"]+)"/g)];
  assert.deepEqual(links.map((match) => match[1]), slugs);
  assert.ok(header.includes('href="/solutions"'));
  for (const [slug, label] of [
    ["gates-access", "Cổng & kiểm soát ra vào"],
    ["event-security", "An ninh sự kiện"],
    ["construction-site-security", "An ninh công trường"],
    ["store-analytics", "Store Analytics - Phân tích cửa hàng"],
    ["factory-intelligence", "Factory Intelligence - Nhà máy thông minh"],
  ]) assert.ok(header.includes(`href="/solutions/${slug}">${label}</a>`));
});

test("Draft solutions remain available for development but are absent from the menu", () => {
  const drafts = allSolutions.filter((solution) => !solution.completed);
  assert.deepEqual(drafts.map((solution) => solution.slug), ["data-centers", "industrial", "smart-cities", "logistics", "retail", "education"]);
  for (const draft of drafts) assert.ok(!header.includes(`href="/solutions/${draft.slug}"`));
  assert.equal(allSolutions.length, 15);
});
