import assert from "node:assert/strict";
import { test } from "node:test";
import { publicPage, sitemapLocations } from "./collect-opretail.mjs";

test("OP Retail capture accepts canonical public pages, not private or external routes", () => {
  assert.equal(publicPage("/solutions/people-counting/#overview"), "https://www.opretail.com/solutions/people-counting");
  assert.equal(publicPage("https://opretail.com/products/"), "https://www.opretail.com/products");
  for (const url of ["/login", "/lo%67in", "/account/settings", "/admin", "/auth/callback", "/api/users", "/_nuxt/app.js", "/resources/download?token=private", "/files/data.pdf", "https://blog.opretail.com/", "https://docs.open.opretail.com/", "https://www.opretail.com:8443/", "https://user:password@www.opretail.com/", "http://www.opretail.com/", "javascript:alert(1)"]) assert.equal(publicPage(url), null, url);
});

test("OP Retail sitemap discovery handles page/index locations and XML entities", () => {
  assert.deepEqual(sitemapLocations('<urlset><url><loc>https://www.opretail.com/</loc></url><url><loc> https://www.opretail.com/a?x=1&amp;y=2 </loc></url></urlset>'), ["https://www.opretail.com/", "https://www.opretail.com/a?x=1&y=2"]);
  assert.deepEqual(sitemapLocations('<sitemapindex><sitemap><loc>https://www.opretail.com/pages.xml</loc></sitemap></sitemapindex>'), ["https://www.opretail.com/pages.xml"]);
  assert.deepEqual(sitemapLocations(""), []);
});
