import test from "node:test";
import assert from "node:assert/strict";
import { request } from "node:http";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  symlink,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { createAppServer } from "./server.mjs";

const contact = {
  name: "Nguyen Van An",
  email: "an@example.com",
  company: "AQP Customer",
  phone: "0901234567",
  interest: "Enterprise infrastructure",
  message: "Please advise on infrastructure for our business.",
  consent: true,
  website: "",
};

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), "aqp-server-"));
  const staticRoot = join(directory, "dist");
  const dataDir = join(directory, "data");
  await mkdir(staticRoot);
  await writeFile(
    join(staticRoot, "index.html"),
    "<!doctype html><title>AQPTech</title><main>SPA</main>",
  );
  const server = await createAppServer({
    dev: false,
    staticRoot,
    dataDir,
    ...options,
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
      server.closeAllConnections();
    });
    await rm(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  async function send(
    path,
    { method = "GET", body, headers = {}, chunked = false } = {},
  ) {
    const payload =
      typeof body === "string"
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body);
    return new Promise((resolveResponse, reject) => {
      const outgoing = request(
        {
          hostname: "127.0.0.1",
          port: server.address().port,
          path,
          method,
          headers: {
            ...(payload === undefined
              ? {}
              : { "Content-Type": "application/json" }),
            ...(payload === undefined || chunked
              ? {}
              : { "Content-Length": Buffer.byteLength(payload) }),
            ...headers,
          },
        },
        (incoming) => {
          const chunks = [];
          incoming.on("data", (chunk) => chunks.push(chunk));
          incoming.on("error", reject);
          incoming.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            resolveResponse({
              status: incoming.statusCode,
              headers: incoming.headers,
              text,
              json:
                text &&
                incoming.headers["content-type"]?.startsWith("application/json")
                  ? JSON.parse(text)
                  : undefined,
            });
          });
        },
      );
      outgoing.on("error", reject);
      if (payload !== undefined) outgoing.write(payload);
      outgoing.end();
    });
  }
  return { directory, staticRoot, dataDir, base, send };
}

test("contact records store an optional deployment region and validate it", async (t) => {
  const { send, dataDir } = await fixture(t);
  const result = await send("/api/contact", {
    method: "POST",
    body: { ...contact, region: "  Việt Nam  " },
  });
  assert.equal(result.status, 201);
  const record = JSON.parse(
    (await readFile(join(dataDir, "requests.jsonl"), "utf8")).trim(),
  );
  assert.equal(record.region, "Việt Nam");
  for (const region of ["x".repeat(121), {}, "bad\u0000"])
    assert.equal(
      (
        await send("/api/contact", {
          method: "POST",
          body: { ...contact, region },
        })
      ).status,
      400,
    );
});

test("valid contact and newsletter submissions persist sanitized JSONL records", async (t) => {
  const { send, base, dataDir } = await fixture(t);
  const first = await send("/api/contact", {
    method: "POST",
    body: {
      ...contact,
      name: "  Nguyen Van An  ",
      email: "AN@example.com",
      ignored: "not stored",
    },
    headers: {
      Origin: base,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  assert.equal(first.status, 201);
  assert.equal(first.json.ok, true);
  assert.match(first.json.id, /^[0-9a-f-]{36}$/);
  assert.match(first.json.message, /đã được lưu/);
  assert.match(first.json.message, /Chưa có email/);
  assert.equal(first.headers["cache-control"], "no-store");
  const second = await send("/api/contact", { method: "POST", body: contact });
  assert.equal(second.status, 201);
  assert.notEqual(first.json.id, second.json.id);
  const records = (await readFile(join(dataDir, "requests.jsonl"), "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse);
  assert.equal(records.length, 2);
  assert.equal(records[0].id, first.json.id);
  assert.equal(records[0].name, contact.name);
  assert.equal(records[0].email, contact.email);
  assert.equal(records[0].consent, true);
  assert.equal(records[0].message, contact.message);
  assert.equal(records[0].company, contact.company);
  assert.equal(records[0].phone, contact.phone);
  assert.equal(records[0].interest, contact.interest);
  assert.ok(!Number.isNaN(Date.parse(records[0].createdAt)));
  assert.equal("website" in records[0], false);
  assert.equal("ignored" in records[0], false);
  const newsletter = await send("/api/newsletter", {
    method: "POST",
    body: { email: "NEWS@example.com", consent: true },
  });
  assert.equal(newsletter.status, 201);
  assert.match(newsletter.json.message, /Chưa có email/);
  const subscription = JSON.parse(
    await readFile(join(dataDir, "newsletter.jsonl"), "utf8"),
  );
  assert.equal(subscription.email, "news@example.com");
  assert.equal(subscription.id, newsletter.json.id);
  assert.equal(subscription.consent, true);
  assert.deepEqual(Object.keys(subscription).sort(), [
    "consent",
    "createdAt",
    "email",
    "id",
  ]);
});

test("explicit public origin supports HTTPS reverse proxies without trusting forwarded headers", async (t) => {
  const { send } = await fixture(t, {
    publicOrigin: "https://aqptech.example",
  });
  const accepted = await send("/api/contact", {
    method: "POST",
    body: contact,
    headers: { Origin: "https://aqptech.example" },
  });
  assert.equal(accepted.status, 201);
  const rejected = await send("/api/contact", {
    method: "POST",
    body: contact,
    headers: {
      Origin: "https://untrusted.example",
      "X-Forwarded-Host": "untrusted.example",
      "X-Forwarded-Proto": "https",
    },
  });
  assert.equal(rejected.status, 403);
  await assert.rejects(
    createAppServer({
      dev: false,
      publicOrigin: "https://aqptech.example/path",
    }),
    /PUBLIC_ORIGIN/,
  );
});

test("newsletter stores optional names and rejects invalid name fields", async (t) => {
  const { send, dataDir } = await fixture(t);
  const submission = {
    email: "named@example.com",
    consent: true,
    firstName: "  An  ",
    lastName: "  Nguyen  ",
  };
  assert.equal(
    (await send("/api/newsletter", { method: "POST", body: submission }))
      .status,
    201,
  );
  const record = JSON.parse(
    (await readFile(join(dataDir, "newsletter.jsonl"), "utf8")).trim(),
  );
  assert.equal(record.firstName, "An");
  assert.equal(record.lastName, "Nguyen");
  for (const invalid of [
    { firstName: "x".repeat(61) },
    { lastName: "x".repeat(61) },
    { firstName: {} },
    { lastName: "bad\u0000" },
  ]) {
    assert.equal(
      (
        await send("/api/newsletter", {
          method: "POST",
          body: { ...submission, ...invalid },
        })
      ).status,
      400,
    );
  }
  assert.equal(
    (await readFile(join(dataDir, "newsletter.jsonl"), "utf8"))
      .trim()
      .split("\n").length,
    1,
  );
});

test("invalid fields, consent and honeypots are rejected without persistence", async (t) => {
  const { send, dataDir } = await fixture(t, { rateLimit: { max: 100 } });
  const invalid = [
    { name: "" },
    { name: undefined },
    { name: "x".repeat(121) },
    { name: 42 },
    { email: "invalid" },
    { email: "a@@example.com" },
    { email: "a b@example.com" },
    { email: "x".repeat(255) },
    { message: "short" },
    { message: " ".repeat(20) },
    { message: "x".repeat(5001) },
    { message: undefined },
    { consent: false },
    { consent: "true" },
    { consent: undefined },
    { website: "spam.example" },
    { website: true },
    { website: " ".repeat(201) },
    { company: "x".repeat(201) },
    { phone: "x".repeat(41) },
    { interest: "x".repeat(201) },
    { company: {} },
    { name: "An\u0000" },
  ];
  for (const change of invalid) {
    const result = await send("/api/contact", {
      method: "POST",
      body: { ...contact, ...change },
    });
    assert.equal(result.status, 400, JSON.stringify(change));
    assert.equal(result.json.ok, false);
    assert.equal(result.headers["cache-control"], "no-store");
  }
  for (const body of [
    { email: "invalid", consent: true },
    { email: "a@example.com", consent: false },
    { email: "a@example.com", consent: true, website: "spam" },
  ]) {
    assert.equal(
      (await send("/api/newsletter", { method: "POST", body })).status,
      400,
    );
  }
  await assert.rejects(readFile(join(dataDir, "requests.jsonl")), {
    code: "ENOENT",
  });
  await assert.rejects(readFile(join(dataDir, "newsletter.jsonl")), {
    code: "ENOENT",
  });
});

test("JSON format, media types and the 16 KB limit are enforced, including chunked bodies", async (t) => {
  const { send } = await fixture(t, { rateLimit: { max: 100 } });
  for (const body of ["{", "", "null", "[]", "true", '"text"']) {
    assert.equal(
      (await send("/api/contact", { method: "POST", body })).status,
      400,
    );
  }
  for (const type of [
    "text/plain",
    "application/x-www-form-urlencoded",
    "application/jsonp",
    "",
  ]) {
    assert.equal(
      (
        await send("/api/contact", {
          method: "POST",
          body: contact,
          headers: { "Content-Type": type },
        })
      ).status,
      415,
    );
  }
  assert.equal(
    (
      await send("/api/contact", {
        method: "POST",
        body: contact,
        headers: { "Content-Encoding": "gzip" },
      })
    ).status,
    415,
  );
  const oversized = JSON.stringify({
    ...contact,
    ignored: "x".repeat(16 * 1024),
  });
  assert.equal(
    (await send("/api/contact", { method: "POST", body: oversized })).status,
    413,
  );
  assert.equal(
    (
      await send("/api/contact", {
        method: "POST",
        body: oversized,
        chunked: true,
      })
    ).status,
    413,
  );
  const unicode = JSON.stringify({
    ...contact,
    message: "ệ".repeat(5000),
    ignored: "ệ".repeat(1000),
  });
  assert.equal(
    (await send("/api/contact", { method: "POST", body: unicode })).status,
    413,
  );
  const padding =
    16 * 1024 - Buffer.byteLength(JSON.stringify({ ...contact, ignored: "" }));
  const boundary = JSON.stringify({ ...contact, ignored: "x".repeat(padding) });
  assert.equal(Buffer.byteLength(boundary), 16 * 1024);
  assert.equal(
    (await send("/api/contact", { method: "POST", body: boundary })).status,
    201,
  );
  assert.equal(
    (await send("/api/contact", { method: "POST", body: `${boundary} ` }))
      .status,
    413,
  );
  assert.equal(
    (await send("/api/contact", { method: "POST", body: contact })).status,
    201,
  );
});

test("same-origin enforcement, method handling, health and unknown APIs", async (t) => {
  const { send, base } = await fixture(t);
  for (const origin of [
    "https://attacker.example",
    "null",
    "not a URL",
    `${base}/path`,
    `${base}/`,
    base.replace("http:", "https:"),
  ]) {
    assert.equal(
      (
        await send("/api/contact", {
          method: "POST",
          body: contact,
          headers: { Origin: origin },
        })
      ).status,
      403,
    );
  }
  assert.equal(
    (
      await send("/api/contact", {
        method: "POST",
        body: contact,
        headers: { Origin: base },
      })
    ).status,
    201,
  );
  for (const [path, method, allow] of [
    ["/api/contact", "GET", "POST"],
    ["/api/newsletter", "PUT", "POST"],
    ["/api/contact", "OPTIONS", "POST"],
    ["/api/health", "POST", "GET"],
    ["/", "POST", "GET, HEAD"],
  ]) {
    const result = await send(path, { method });
    assert.equal(result.status, 405);
    assert.equal(result.headers.allow, allow);
  }
  const health = await send("/api/health");
  assert.equal(health.status, 200);
  assert.deepEqual(health.json, { ok: true });
  assert.equal(health.headers["cache-control"], "no-store");
  assert.equal(health.headers["x-content-type-options"], "nosniff");
  assert.equal(health.headers["x-frame-options"], "DENY");
  assert.equal(
    health.headers["referrer-policy"],
    "strict-origin-when-cross-origin",
  );
  assert.equal(health.headers["content-security-policy"], undefined);
  for (const path of [
    "/api",
    "/api/unknown",
    "/api/health/",
    "/api/requests.jsonl",
  ]) {
    const result = await send(path);
    assert.equal(result.status, 404);
    assert.equal(result.json.ok, false);
    assert.equal(result.headers["cache-control"], "no-store");
  }
});

test("rate limits are shared across submissions and ignore spoofed forwarding headers", async (t) => {
  const { send } = await fixture(t, {
    rateLimit: { max: 2, windowMs: 60_000, maxEntries: 2 },
  });
  assert.equal(
    (
      await send("/api/contact", {
        method: "POST",
        body: { ...contact, consent: false },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await send("/api/newsletter", {
        method: "POST",
        body: { email: contact.email, consent: true },
      })
    ).status,
    201,
  );
  const limited = await send("/api/contact", {
    method: "POST",
    body: contact,
    headers: { "X-Forwarded-For": "203.0.113.10" },
  });
  assert.equal(limited.status, 429);
  assert.equal(limited.json.ok, false);
  assert.ok(Number(limited.headers["retry-after"]) > 0);
  assert.equal((await send("/api/health")).status, 200);
});

test("expired rate-limit entries are cleaned up", async (t) => {
  const { send } = await fixture(t, {
    rateLimit: { max: 1, windowMs: 40, maxEntries: 1 },
  });
  assert.equal(
    (await send("/api/contact", { method: "POST", body: contact })).status,
    201,
  );
  assert.equal(
    (await send("/api/contact", { method: "POST", body: contact })).status,
    429,
  );
  await delay(60);
  assert.equal(
    (await send("/api/contact", { method: "POST", body: contact })).status,
    201,
  );
});

test("production serves static assets, HEAD and only known SPA routes", async (t) => {
  const { send, staticRoot } = await fixture(t);
  await mkdir(join(staticRoot, "assets"));
  await writeFile(
    join(staticRoot, "assets", "app.js"),
    'console.log("AQPTech");',
  );
  await writeFile(join(staticRoot, "assets", "styles.css"), "body{color:#123}");
  const script = await send("/assets/app.js?v=1");
  assert.equal(script.status, 200);
  assert.match(script.headers["content-type"], /text\/javascript/);
  assert.equal(script.text, 'console.log("AQPTech");');
  assert.equal(script.headers["x-content-type-options"], "nosniff");
  const head = await send("/assets/styles.css", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.text, "");
  assert.ok(Number(head.headers["content-length"]) > 0);
  await writeFile(join(staticRoot, "assets", "brochure.pdf"), "%PDF-1.7");
  const brochure = await send("/assets/brochure.pdf");
  assert.equal(brochure.status, 200);
  assert.equal(brochure.headers["content-type"], "application/pdf");
  assert.equal(brochure.text, "%PDF-1.7");
  for (const route of [
    "/",
    "/about",
    "/solutions",
    "/solutions/seaports-terminals",
    "/solutions/oil-gas",
    "/solutions/national-borders",
    "/solutions/critical-sites",
    "/solutions/enterprise-ai",
    "/products",
    "/products/server-1",
    "/services",
    "/services/integration",
    "/insights",
    "/insights/edge-computing",
    "/contact",
    "/support",
    "/privacy",
    "/terms",
    "/about/",
    "/contact?source=nav",
  ]) {
    const result = await send(route);
    assert.equal(result.status, 200, route);
    assert.match(result.text, /<main>SPA<\/main>/);
    assert.match(result.headers["content-type"], /text\/html/);
    assert.equal(result.headers["cache-control"], "no-cache");
  }
  for (const path of [
    "/unknown",
    "/assets/missing.js",
    "/solutions/a/b",
    "/products/missing.png",
    "/assets/",
  ]) {
    assert.equal((await send(path)).status, 404, path);
  }
  await rm(join(staticRoot, "index.html"));
  assert.equal((await send("/about")).status, 404);
});

test("private paths, traversal and symlinks never expose files or submitted data", async (t) => {
  const { send, staticRoot, directory } = await fixture(t);
  await writeFile(join(directory, "secret.txt"), "PRIVATE-SECRET");
  await writeFile(join(staticRoot, ".env"), "PRIVATE-SECRET");
  await writeFile(join(staticRoot, "package.json"), "PRIVATE-SECRET");
  await writeFile(join(staticRoot, "app.js.map"), "PRIVATE-SECRET");
  await writeFile(join(staticRoot, "source-metadata.json"), "PRIVATE-SECRET");
  await mkdir(join(staticRoot, "assets"));
  for (const name of ["analysis", "manifest", "screenshots", "verification"]) {
    await writeFile(
      join(staticRoot, "assets", `${name}.json`),
      "PRIVATE-SECRET",
    );
  }
  for (const name of ["scripts", "data", "src"]) {
    await mkdir(join(staticRoot, name));
    await writeFile(join(staticRoot, name, "secret.txt"), "PRIVATE-SECRET");
  }
  await symlink(join(directory, "secret.txt"), join(staticRoot, "linked.txt"));
  await symlink(directory, join(staticRoot, "outside"));
  await symlink(join(staticRoot, ".env"), join(staticRoot, "aliased-env.txt"));
  await symlink(
    join(staticRoot, "data", "secret.txt"),
    join(staticRoot, "aliased-data.txt"),
  );
  await symlink(
    join(staticRoot, "assets", "manifest.json"),
    join(staticRoot, "aliased-metadata.txt"),
  );
  assert.equal(
    (await send("/api/contact", { method: "POST", body: contact })).status,
    201,
  );
  for (const path of [
    "/.env",
    "/%2eenv",
    "/.git/config",
    "/.kilo/agent-manager.json",
    "/package.json",
    "/app.js.map",
    "/source-metadata.json",
    "/scripts/server.mjs",
    "/scripts/secret.txt",
    "/data/requests.jsonl",
    "/data/secret.txt",
    "/src/secret.txt",
    "/requests.jsonl",
    "/linked.txt",
    "/outside/secret.txt",
    "/aliased-env.txt",
    "/aliased-data.txt",
    "/aliased-metadata.txt",
    "/assets/analysis.json",
    "/assets/manifest.json",
    "/assets/screenshots.json",
    "/assets/verification.json",
    "/../secret.txt",
    "/%2e%2e/secret.txt",
    "/assets/%2e%2e/%2e%2e/secret.txt",
    "/..%2fsecret.txt",
    "/%252e%252e/secret.txt",
    "/%5c..%5csecret.txt",
    "/%00secret.txt",
    "/@fs/secret.txt",
    "/dist/index.html",
  ]) {
    const result = await send(path);
    assert.equal(result.status, 404, path);
    assert.ok(!result.text.includes("PRIVATE-SECRET"), path);
    assert.ok(!result.text.includes(contact.email), path);
  }
  assert.equal((await send("/%zz")).status, 400);
  await rm(join(staticRoot, "index.html"));
  await symlink(join(directory, "secret.txt"), join(staticRoot, "index.html"));
  assert.equal((await send("/about")).status, 404);
});

test("persistence failure returns a generic 500 without internal paths or payloads", async (t) => {
  const { send, dataDir } = await fixture(t);
  await writeFile(dataDir, "not a directory");
  const result = await send("/api/contact", { method: "POST", body: contact });
  assert.equal(result.status, 500);
  assert.equal(result.json.ok, false);
  assert.equal(result.headers["cache-control"], "no-store");
  assert.ok(!result.text.includes(dataDir));
  assert.ok(!result.text.includes("ENOTDIR"));
  assert.ok(!result.text.includes(contact.email));
});
