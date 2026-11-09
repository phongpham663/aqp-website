import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  assetKind,
  pageUrl,
  publicUrl,
  robotsPolicy,
  verifyCollection,
} from "./collect-magal.mjs";

test("collection is restricted to public HTTPS URLs on the source website", () => {
  assert.equal(
    publicUrl("/about/#team"),
    "https://www.magalsolutions.com/about/",
  );
  for (const url of [
    "https://evil.example/image.png",
    "http://www.magalsolutions.com/",
    "https://www.magalsolutions.com.evil.example/",
    "https://user:password@www.magalsolutions.com/",
  ])
    assert.equal(publicUrl(url), null);
  assert.equal(
    pageUrl("/resources/"),
    "https://www.magalsolutions.com/resources/",
  );
  for (const url of [
    "/es/about/",
    "/wp-admin/",
    "/wp-content/uploads/file.pdf",
    "/resources/?page=2",
  ])
    assert.equal(pageUrl(url), null);
});

test("robots policy preserves crawl delay and allow/disallow precedence", () => {
  const policy = robotsPolicy(
    "Crawl-delay: 10\nUser-agent: *\nDisallow: /private/\nAllow: /private/public/\nDisallow: /*.pdf$\nAllow: /public.pdf$\n",
  );
  assert.equal(policy.delayMs, 10000);
  assert.equal(policy.allowed("/about/"), true);
  assert.equal(policy.allowed("/private/secret"), false);
  assert.equal(policy.allowed("/private/public/example"), true);
  assert.equal(policy.allowed("/download.pdf"), false);
  assert.equal(policy.allowed("/public.pdf"), true);
  assert.equal(robotsPolicy("User-agent: *\nDisallow:\n").allowed("/"), true);
});

test("public resources are classified for images, documents, code, fonts and video", () => {
  assert.equal(
    assetKind("image/svg+xml", "https://www.magalsolutions.com/logo.svg"),
    "images",
  );
  assert.equal(
    assetKind("application/pdf", "https://www.magalsolutions.com/file.pdf"),
    "documents",
  );
  assert.equal(
    assetKind(
      "application/octet-stream",
      "https://www.magalsolutions.com/file.zip",
    ),
    "documents",
  );
  assert.equal(
    assetKind(
      "text/css; charset=utf-8",
      "https://www.magalsolutions.com/style.css",
    ),
    "styles",
  );
  assert.equal(
    assetKind("font/woff2", "https://www.magalsolutions.com/font.woff2"),
    "fonts",
  );
  assert.equal(
    assetKind("video/mp4", "https://www.magalsolutions.com/video.mp4"),
    "media",
  );
  assert.equal(
    assetKind("text/html", "https://www.magalsolutions.com/error"),
    null,
  );
});

test("verification checks persisted checksums and refuses out-of-directory files", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "magal-verification-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const bytes = Buffer.from("reference data");
  await writeFile(path.join(directory, "sample.txt"), bytes);
  const asset = {
    file: "sample.txt",
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    kind: "data",
  };
  const manifest = {
    pages: [],
    screenshots: [],
    downloaded: [asset],
    failures: [],
    skipped: [],
  };
  await writeFile(
    path.join(directory, "manifest.json"),
    JSON.stringify(manifest),
  );
  assert.equal((await verifyCollection(directory)).valid, true);
  await writeFile(path.join(directory, "sample.txt"), "changed");
  assert.equal((await verifyCollection(directory)).valid, false);
  manifest.downloaded = [{ ...asset, file: "../outside.txt" }];
  await writeFile(
    path.join(directory, "manifest.json"),
    JSON.stringify(manifest),
  );
  const result = await verifyCollection(directory);
  assert.equal(result.valid, false);
  assert.match(result.invalid[0].error, /escapes/);
  assert.equal(
    JSON.parse(
      await readFile(path.join(directory, "verification.json"), "utf8"),
    ).valid,
    false,
  );
});
