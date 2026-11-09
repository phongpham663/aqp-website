import assert from "node:assert/strict";
import test from "node:test";
import { analyzePage, fetchResource, publicResource, watchtowerTarget } from "./collect-watchtower.mjs";

const source = "https://wt-security.com/en-gb/application/event-security";

test("Watchtower screenshot targets have separate output paths and isolated page scope", async () => {
  const event = watchtowerTarget();
  const construction = watchtowerTarget("construction-site-security");
  assert.equal(event.source, source);
  assert.equal(construction.source, "https://wt-security.com/en-gb/application/construction-site-security");
  assert.notEqual(event.output, construction.output);
  assert.equal(publicResource(construction.source, construction.source, construction.source), construction.source);
  assert.equal(publicResource(source, construction.source, construction.source), null);
  assert.equal(publicResource(construction.source), null);
  assert.equal(publicResource("https://evil.example/", "https://evil.example/", "https://evil.example/"), null);
  assert.throws(() => watchtowerTarget("../event-security"), /Use event-security/);
  assert.throws(() => watchtowerTarget("toString"), /Use event-security/);
  const resource = await fetchResource(construction.source, { pageSource: construction.source, request: async () => new Response("construction") });
  assert.equal(resource.bytes.toString(), "construction");
  await assert.rejects(fetchResource(construction.source, { pageSource: construction.source, request: async () => new Response(null, { status: 302, headers: { location: source } }) }), /Redirect outside/);
});

test("Watchtower collection is limited to the requested page and its public assets", () => {
  assert.equal(publicResource(source), source);
  assert.equal(publicResource("/_nuxt/site.js"), "https://wt-security.com/_nuxt/site.js");
  const image = "https://a.storyblok.com/f/236211/2700x1516/7e713b012c/eventsecurity-marathon.jpg";
  assert.equal(publicResource(image), image);
  assert.equal(publicResource("/api/solutionsData"), "https://wt-security.com/api/solutionsData");
  assert.equal(publicResource("/api/newsData"), "https://wt-security.com/api/newsData");
  assert.equal(publicResource("/api/solutionsData?locale=en-gb"), "https://wt-security.com/api/solutionsData?locale=en-gb");
  assert.equal(publicResource("/api/newsData?amount=2&locale=en-gb"), "https://wt-security.com/api/newsData?amount=2&locale=en-gb");
  assert.equal(publicResource("/api/newsData?token=private"), null);
  assert.equal(publicResource("/api/newsData?amount=100"), null);
  for (const url of ["https://portal.wt-security.com/", "/en-gb/contact", "/api/private.json", "https://a.storyblok.com/f/999999/private.jpg", "https://evil.example/image.jpg", "http://wt-security.com/image.jpg", "https://user:pass@wt-security.com/image.jpg", null, ""]) assert.equal(publicResource(url), null);
});

test("Watchtower downloads enforce robots, redirect, HTTP and byte limits", async () => {
  const resource = await fetchResource(source, { request: async () => new Response("public HTML", { headers: { "content-type": "text/html" } }) });
  assert.equal(resource.bytes.toString(), "public HTML");
  assert.equal(resource.contentType, "text/html");
  await assert.rejects(fetchResource(source, { maximum: 4, request: async () => new Response("12345") }), /Byte limit/);
  await assert.rejects(fetchResource(source, { request: async () => new Response("Forbidden", { status: 403 }) }), /HTTP 403/);
  await assert.rejects(fetchResource(source, { request: async () => new Response(null, { status: 302, headers: { location: "https://portal.wt-security.com/" } }) }), /Redirect outside/);
  let requested = false;
  await assert.rejects(fetchResource(source, { allowed: () => false, request: async () => { requested = true; return new Response(""); } }), /robots/);
  assert.equal(requested, false);
});

test("Watchtower analysis preserves evidence without claiming service verification", () => {
  const result = analyzePage({ url: source, title: "Event Security", description: "", headings: [{ tag: "H1", text: "Event security" }], paragraphs: ["Service description"], links: [{ text: "Request a custom quote", url: "/quote" }], forms: [], typography: [], colors: [], dimensions: { width: 1440 }, images: [{ src: "image.jpg", alt: "", naturalWidth: 2700 }], issues: [] });
  assert.equal(result.quality.h1Count, 1);
  assert.equal(result.quality.missingDescription, true);
  assert.equal(result.quality.emptyAltImages.length, 1);
  assert.equal(result.conversion.callsToAction.length, 1);
  assert.equal(result.conversion.formSubmissionTested, false);
  assert.equal(result.sourceClaimsNotIndependentlyVerified, true);
});
