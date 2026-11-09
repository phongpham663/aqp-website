import assert from "node:assert/strict";
import { test } from "node:test";
import { publicPage } from "./collect-auk.mjs";
import { collect, publicPage as opRetailPage } from "./collect-opretail.mjs";

test("Auk collection canonicalizes only its own public host and preserves OP Retail scope", () => {
  assert.equal(publicPage("/solutions/predictive-maintenance/#details"), "https://auk.industries/solutions/predictive-maintenance");
  assert.equal(publicPage("https://www.auk.industries/how-it-works/"), "https://auk.industries/how-it-works");
  assert.equal(publicPage("/blog/what-is-oee-and-how-to-get-started/"), "https://auk.industries/blog/what-is-oee-and-how-to-get-started");
  assert.equal(opRetailPage("https://auk.industries/"), null);
  assert.equal(publicPage("https://www.opretail.com/"), null);
});

test("Auk collection excludes its operations portal, login/admin endpoints and downloads", () => {
  for (const url of ["https://ops.auk.industries/login", "/login", "/wp-admin/", "/wp-login.php", "/wp-json/", "/account/", "/book-a-demo/?token=private", "/manual.pdf", "https://user:password@auk.industries/", "http://auk.industries/"]) assert.equal(publicPage(url), null, url);
  assert.equal(publicPage("/book-a-demo/"), "https://auk.industries/book-a-demo");
});

test("Shared collection validates source and limits before creating output or making requests", async () => {
  await assert.rejects(collect({ maxPages: 0 }), /max-pages/);
  await assert.rejects(collect({ source: "http://auk.industries" }), /HTTPS origin/);
  await assert.rejects(collect({ source: "https://auk.industries" }), /separate output/);
});
