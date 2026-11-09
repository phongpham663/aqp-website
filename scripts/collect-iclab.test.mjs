import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzePages,
  fetchPublicResource,
  imageType,
  imageUrl,
  publicPage,
} from "./collect-iclab.mjs";

test("ICLab capture excludes login, private pages and external origins", () => {
  assert.equal(
    publicPage("/platform"),
    "https://iclab.identifycapacity.com/platform",
  );
  assert.equal(
    publicPage("/solutions/industry"),
    "https://iclab.identifycapacity.com/solutions/industry",
  );
  for (const url of [
    "/auth",
    "/dashboard",
    "/account",
    "/platform?token=x",
    "https://evil.example/platform",
  ])
    assert.equal(publicPage(url), null);
  assert.equal(
    imageUrl("/__l5e/assets-v1/example/image.png#view"),
    "https://iclab.identifycapacity.com/__l5e/assets-v1/example/image.png",
  );
  for (const url of [
    "https://iclab.identifycapacity.com.evil.example/a.jpg",
    "http://iclab.identifycapacity.com/a.jpg",
    "https://user:pass@iclab.identifycapacity.com/a.jpg",
    null,
    "",
  ])
    assert.equal(imageUrl(url), null);
});

test("public downloads use native Response.ok and enforce HTTP, byte and redirect limits", async () => {
  const result = await fetchPublicResource("/robots.txt", {
    request: async () =>
      new Response("User-agent: *\nAllow: /", {
        headers: { "Content-Type": "text/plain" },
      }),
  });
  assert.match(result.bytes.toString(), /User-agent/);
  assert.equal(result.contentType, "text/plain");
  await assert.rejects(
    fetchPublicResource("/image.png", {
      request: async () => new Response("Forbidden", { status: 403 }),
    }),
    /HTTP 403/,
  );
  await assert.rejects(
    fetchPublicResource("/image.png", {
      maximum: 4,
      request: async () => new Response("12345"),
    }),
    /Byte limit/,
  );
  await assert.rejects(
    fetchPublicResource("/image.png", {
      request: async () =>
        new Response(null, {
          status: 302,
          headers: { Location: "https://outside.example/image.png" },
        }),
    }),
    /outside/,
  );
  let requested = false;
  await assert.rejects(
    fetchPublicResource("/image.png", {
      allowed: () => false,
      request: async () => {
        requested = true;
        return new Response("");
      },
    }),
    /robots/,
  );
  assert.equal(requested, false);
});

test("image validation identifies actual image bytes and rejects HTML error pages", () => {
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
  assert.equal(imageType(png), "png");
  assert.equal(imageType(Buffer.from([255, 216, 255, 0])), "jpg");
  assert.equal(
    imageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')),
    "svg",
  );
  assert.equal(
    imageType(Buffer.from("<!doctype html><title>Forbidden</title>")),
    null,
  );
  assert.equal(imageType(Buffer.from("")), null);
});

test("content analysis preserves evidence and distinguishes observations from unverified claims", () => {
  const fixture = {
    url: "https://iclab.identifycapacity.com/",
    title: "Shared title",
    description: "Shared description",
    headings: [{ tag: "H1", text: "AI-powered operations" }],
    paragraphs: ["Sample overview"],
    navigation: [],
    links: [{ text: "Contact Us", url: "mailto:contact@identifycapacity.com" }],
    forms: [],
    colors: [],
    typography: [],
    stylesheets: [],
    scripts: [],
    reactDetected: true,
    images: [{ alt: "" }],
    viewport: { width: 1440 },
    dimensions: { width: 1440 },
    issues: [],
  };
  const analysis = analyzePages([
    fixture,
    {
      ...fixture,
      url: "https://iclab.identifycapacity.com/solutions/energy",
      headings: [{ tag: "H1", text: "Energy" }],
    },
  ]);
  assert.equal(analysis.positioning.headline, "AI-powered operations");
  assert.equal(analysis.industryPages.length, 1);
  assert.equal(analysis.contentQuality.repeatedTitles[0].urls.length, 2);
  assert.equal(analysis.contentQuality.emptyAltImages.length, 2);
  assert.equal(analysis.conversion.formSubmissionTested, false);
  assert.equal(
    analysis.productArchitecture[1].claimNotIndependentlyVerified,
    true,
  );
});
