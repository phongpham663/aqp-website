import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chmod, mkdir, mkdtemp, readFile, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { NextRequest } from "next/server.js";
import { createSubmissionHandler } from "../src/server/submissions.js";

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
const contactMessage =
  "Yêu cầu của bạn đã được lưu trong hệ thống AQPTech để đội ngũ xem xét. Chưa có email được gửi tự động.";
const newsletterMessage =
  "Đăng ký nhận tin của bạn đã được lưu trong hệ thống AQPTech. Chưa có email xác nhận được gửi tự động.";

async function withEnvironment(values, callback) {
  const previous = {};
  for (const [key, value] of Object.entries(values)) {
    previous[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function fixture(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), "aqp-submissions-"));
  const dataDir = join(directory, "data");
  t.after(() => rm(directory, { recursive: true, force: true }));
  const handle = await withEnvironment({ PUBLIC_ORIGIN: undefined }, () =>
    createSubmissionHandler({ dataDir, rateLimit: { max: 100 }, ...options }),
  );
  return { directory, dataDir, handle };
}

function makeRequest(path = "/api/contact", {
  method = "POST",
  body = contact,
  headers = {},
  base = "http://localhost:3000",
  Type = Request,
} = {}) {
  const streaming = body instanceof ReadableStream;
  return new Type(`${base}${path}`, {
    method,
    headers: { Host: "localhost:3000", "Content-Type": "application/json", ...headers },
    ...(!["GET", "HEAD"].includes(method)
      ? {
          body: streaming || typeof body === "string" ? body : JSON.stringify(body),
          ...(streaming ? { duplex: "half" } : {}),
        }
      : {}),
  });
}

test("Web submissions persist only validated fields with exact truthful messages", async (t) => {
  const { dataDir, handle } = await fixture(t);
  const response = await handle(makeRequest("/api/contact", {
    body: { ...contact, name: "  Nguyen Van An  ", email: "AN@example.com", region: "  Việt Nam  ", ignored: "not stored" },
  }));
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal(result.message, contactMessage);
  assert.match(result.id, /^[0-9a-f-]{36}$/);
  const record = JSON.parse((await readFile(join(dataDir, "requests.jsonl"), "utf8")).trim());
  assert.deepEqual(record, {
    id: result.id, createdAt: record.createdAt,
    name: contact.name, email: contact.email, company: contact.company,
    phone: contact.phone, interest: contact.interest, message: contact.message,
    consent: true, region: "Việt Nam",
  });
  assert.ok(!Number.isNaN(Date.parse(record.createdAt)));
  const newsletter = await handle(makeRequest("/api/newsletter", {
    body: { email: "NEWS@example.com", consent: true, firstName: " An ", lastName: " Nguyen ", ignored: true },
  }));
  assert.equal(newsletter.status, 201);
  assert.equal((await newsletter.json()).message, newsletterMessage);
  const subscription = JSON.parse(await readFile(join(dataDir, "newsletter.jsonl"), "utf8"));
  assert.deepEqual(Object.keys(subscription).sort(), ["consent", "createdAt", "email", "firstName", "id", "lastName"]);
  assert.equal(subscription.email, "news@example.com");
  assert.equal(subscription.firstName, "An");
  assert.equal(subscription.lastName, "Nguyen");
  assert.equal((await stat(dataDir)).mode & 0o777, 0o700);
  for (const file of ["requests.jsonl", "newsletter.jsonl"])
    assert.equal((await stat(join(dataDir, file))).mode & 0o777, 0o600);
});

test("existing records are appended, and existing permissions are made private", async (t) => {
  const { dataDir, handle } = await fixture(t);
  await mkdir(dataDir);
  const file = join(dataDir, "requests.jsonl");
  const oldRecord = `${JSON.stringify({ id: "previous-record" })}\n`;
  await writeFile(file, oldRecord);
  await chmod(dataDir, 0o755);
  await chmod(file, 0o644);
  assert.equal((await handle(makeRequest())).status, 201);
  const stored = await readFile(file, "utf8");
  assert.ok(stored.startsWith(oldRecord));
  assert.equal(stored.trim().split("\n").length, 2);
  assert.equal((await stat(dataDir)).mode & 0o777, 0o700);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
});

test("16 KB boundary is byte-aware with chunked Unicode and dishonest lengths", async (t) => {
  const { handle } = await fixture(t);
  const padding = 16 * 1024 - Buffer.byteLength(JSON.stringify({ ...contact, ignored: "" }));
  const boundary = JSON.stringify({ ...contact, ignored: "x".repeat(padding) });
  assert.equal(Buffer.byteLength(boundary), 16 * 1024);
  assert.equal((await handle(makeRequest("/api/contact", { body: boundary }))).status, 201);
  const unicode = Buffer.from(JSON.stringify({ ...contact, message: "ệ".repeat(5000), ignored: "ệ".repeat(1000) }));
  for (const bytes of [Buffer.from(`${boundary} `), unicode]) {
    let offset = 0;
    let cancelled = false;
    const body = new ReadableStream({
      pull(controller) {
        if (offset < bytes.length) {
          controller.enqueue(bytes.subarray(offset, offset + 101));
          offset += 101;
        }
      },
      cancel() { cancelled = true; },
    });
    const response = await handle(makeRequest("/api/contact", { body, headers: { "Content-Length": "1" } }));
    assert.equal(response.status, 413);
    assert.equal(cancelled, true);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  const bytes = Buffer.from(JSON.stringify({ ...contact, message: "ệ".repeat(100) }));
  let offset = 0;
  const validUnicode = new ReadableStream({
    pull(controller) {
      if (offset < bytes.length) {
        controller.enqueue(bytes.subarray(offset, offset + 1));
        offset += 1;
      } else controller.close();
    },
  });
  assert.equal((await handle(makeRequest("/api/contact", { body: validUnicode }))).status, 201);
});

test("JSON media types, identity encoding and object-only payloads are enforced", async (t) => {
  const { handle, dataDir } = await fixture(t);
  for (const type of ["text/plain", "application/jsonp", "application/json-extra", "application/problem+json", ""]) {
    assert.equal((await handle(makeRequest("/api/contact", { headers: { "Content-Type": type } }))).status, 415);
  }
  for (const encoding of ["gzip", "br", "identity, gzip", "IDENTITY"]) {
    assert.equal((await handle(makeRequest("/api/contact", { headers: { "Content-Encoding": encoding } }))).status, 415);
  }
  for (const body of ["{", "", "null", "[]", "true", '"text"'])
    assert.equal((await handle(makeRequest("/api/contact", { body }))).status, 400);
  await assert.rejects(readFile(join(dataDir, "requests.jsonl")), { code: "ENOENT" });
  assert.equal((await handle(makeRequest("/api/contact", {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Encoding": "identity" },
  }))).status, 201);
});

test("consent, honeypot and field errors cannot persist records", async (t) => {
  const { handle, dataDir } = await fixture(t);
  for (const invalid of [
    { consent: false }, { consent: "true" }, { website: "spam" }, { website: true },
    { name: "x".repeat(121) }, { email: "a@@example.com" }, { message: "short" },
    { company: {} }, { region: "bad\u0000" }, { phone: "x".repeat(41) },
  ]) {
    const response = await handle(makeRequest("/api/contact", { body: { ...contact, ...invalid } }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  }
  assert.equal((await handle(makeRequest("/api/newsletter", {
    body: { email: "an@example.com", consent: true, firstName: "x".repeat(61) },
  }))).status, 400);
  for (const file of ["requests.jsonl", "newsletter.jsonl"])
    await assert.rejects(readFile(join(dataDir, file)), { code: "ENOENT" });
});

test("development origin comes only from a safe explicit Host, never forwarded URL/headers", async (t) => {
  const { handle } = await fixture(t);
  assert.equal((await handle(makeRequest("/api/contact", {
    base: "https://attacker.example",
    headers: { Origin: "http://localhost:3000", "X-Forwarded-Host": "attacker.example", "X-Forwarded-Proto": "https" },
  }))).status, 201);
  for (const origin of ["https://attacker.example", "null", "not a URL", "http://localhost:3000/", "http://localhost:3000/path", "https://localhost:3000"]) {
    assert.equal((await handle(makeRequest("/api/contact", {
      base: "https://attacker.example",
      headers: { Origin: origin, "X-Forwarded-Host": "attacker.example", "X-Forwarded-Proto": "https" },
    }))).status, 403);
  }
  for (const host of ["", "localhost:3000/path", "user@localhost:3000", "localhost:3000?x=1", "localhost:3000#x", "localhost:3000, attacker.example", "local%68ost:3000"]) {
    assert.equal((await handle(makeRequest("/api/contact", { headers: { Origin: "http://localhost:3000", Host: host } }))).status, 403);
  }
  const missingHost = makeRequest("/api/contact", { headers: { Origin: "https://attacker.example" }, base: "https://attacker.example" });
  missingHost.headers.delete("host");
  assert.equal((await handle(missingHost)).status, 403);
  assert.equal((await handle(makeRequest("/api/contact", { headers: { Host: "[::1]:3000", Origin: "http://[::1]:3000" } }))).status, 201);
});

test("configuration validates PUBLIC_ORIGIN, rate limits and a private DATA_DIR", async (t) => {
  const { dataDir } = await fixture(t);
  for (const publicOrigin of ["", "not a URL", "null", "ftp://example.com", "https://example.com/", "https://example.com/path", "https://user@example.com", "https://example.com?x=1", "https://example.com#x"]) {
    assert.throws(() => createSubmissionHandler({ dataDir, publicOrigin }), /PUBLIC_ORIGIN/);
  }
  for (const key of ["max", "windowMs", "maxEntries"])
    for (const value of [0, -1, 1.5, Infinity, "10", Number.MAX_SAFE_INTEGER + 1])
      assert.throws(() => createSubmissionHandler({ dataDir, rateLimit: { [key]: value } }), /Rate-limit/);
  assert.throws(() => createSubmissionHandler({ dataDir: resolve("public", "submissions") }), /DATA_DIR/);
  const handle = createSubmissionHandler({ dataDir, publicOrigin: "https://aqptech.example" });
  assert.equal((await handle(makeRequest("/api/contact", { headers: { Origin: "https://aqptech.example" } }))).status, 201);
  assert.equal((await handle(makeRequest("/api/contact", {
    headers: { Origin: "https://attacker.example", "X-Forwarded-Host": "attacker.example", "X-Forwarded-Proto": "https" },
  }))).status, 403);
});

test("methods, health and private/unknown paths keep the API error contract", async (t) => {
  const { handle } = await fixture(t);
  const health = await handle(makeRequest("/api/health", { method: "GET" }));
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true });
  assert.equal(health.headers.get("content-security-policy"), null);
  for (const [key, value] of Object.entries({ "cache-control": "no-store", "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "strict-origin-when-cross-origin" }))
    assert.equal(health.headers.get(key), value);
  for (const path of ["/api/contact", "/api/newsletter", "/api/health"]) {
    for (const method of ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"]) {
      if (method === (path === "/api/health" ? "GET" : "POST")) continue;
      const response = await handle(makeRequest(path, { method }));
      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), path === "/api/health" ? "GET" : "POST");
      assert.equal(response.headers.get("cache-control"), "no-store");
      if (method === "HEAD") assert.equal(await response.text(), "");
      else assert.equal((await response.json()).ok, false);
    }
  }
  for (const path of ["/api", "/api/unknown", "/api/health/", "/api/requests.jsonl", "/data/requests.jsonl", "/api/%5ccontact", "/api/%00contact"])
    assert.equal((await handle(makeRequest(path, { method: "GET" }))).status, 404);
  assert.equal((await handle(makeRequest("/api/%zz", { method: "GET" }))).status, 400);
});

test("anonymous limits span contact/newsletter and ignore spoofed IPs", async (t) => {
  const { handle } = await fixture(t, { rateLimit: { max: 2, windowMs: 60_000, maxEntries: 2 } });
  assert.equal((await handle(makeRequest("/api/contact", { body: { ...contact, consent: false } }))).status, 400);
  assert.equal((await handle(makeRequest("/api/newsletter", { body: { email: contact.email, consent: true } }))).status, 201);
  const limited = await handle(makeRequest("/api/contact", { headers: { "X-Forwarded-For": "203.0.113.10", "X-Real-IP": "203.0.113.11", Host: "another.example" } }));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  assert.equal((await handle(makeRequest("/api/health", { method: "GET" }))).status, 200);
  assert.equal((await handle(makeRequest(), { remoteAddress: "127.0.0.1" })).status, 201);
});

test("socket-specific limits expire without affecting health", async (t) => {
  const { handle } = await fixture(t, { rateLimit: { max: 1, windowMs: 40, maxEntries: 2 } });
  assert.equal((await handle(makeRequest(), { remoteAddress: "127.0.0.1" })).status, 201);
  assert.equal((await handle(makeRequest(), { remoteAddress: "127.0.0.1" })).status, 429);
  assert.equal((await handle(makeRequest(), { remoteAddress: "127.0.0.2" })).status, 201);
  await delay(60);
  assert.equal((await handle(makeRequest(), { remoteAddress: "127.0.0.1" })).status, 201);
});

test("interrupted streams and persistence/symlink failures are generic and leak no records", async (t) => {
  const { handle, dataDir, directory } = await fixture(t);
  const broken = new ReadableStream({ start(controller) { controller.error(new Error("private socket detail")); } });
  const interrupted = await handle(makeRequest("/api/contact", { body: broken }));
  assert.equal(interrupted.status, 400);
  assert.ok(!(await interrupted.text()).includes("private socket detail"));
  const secret = join(directory, "private.txt");
  await writeFile(secret, "PRIVATE-SECRET");
  await mkdir(dataDir);
  await symlink(secret, join(dataDir, "requests.jsonl"));
  const response = await handle(makeRequest());
  assert.equal(response.status, 500);
  const text = await response.text();
  for (const privateValue of [dataDir, contact.email, "ELOOP", "PRIVATE-SECRET"])
    assert.ok(!text.includes(privateValue));
  assert.equal(await readFile(secret, "utf8"), "PRIVATE-SECRET");
  await rm(dataDir, { recursive: true });
  const outside = join(directory, "outside");
  await mkdir(outside);
  await symlink(outside, dataDir);
  assert.equal((await handle(makeRequest())).status, 500);
  await assert.rejects(readFile(join(outside, "requests.jsonl")), { code: "ENOENT" });
});

test("DATA_DIR defaults to cwd/data and keeps existing records, rather than a public or module path", async (t) => {
  const { directory, dataDir } = await fixture(t);
  await mkdir(dataDir);
  const previous = '{"id":"existing"}\n';
  await writeFile(join(dataDir, "requests.jsonl"), previous);
  const handle = await withEnvironment({ DATA_DIR: undefined, PUBLIC_ORIGIN: undefined }, () => {
    const cwd = process.cwd();
    try {
      process.chdir(directory);
      return createSubmissionHandler();
    } finally {
      process.chdir(cwd);
    }
  });
  assert.equal((await handle(makeRequest())).status, 201);
  assert.ok((await readFile(join(dataDir, "requests.jsonl"), "utf8")).startsWith(previous));
});

test("Next route executes shared logic directly for all exports with one anonymous env-configured bucket", async (t) => {
  const { dataDir } = await fixture(t);
  const route = await withEnvironment({ DATA_DIR: dataDir, PUBLIC_ORIGIN: undefined, API_RATE_MAX: "3", API_RATE_WINDOW_MS: "60000", API_RATE_MAX_ENTRIES: "2" }, () =>
    import(`../app/api/[[...path]]/route.js?test=${randomUUID()}`),
  );
  assert.equal(route.runtime, "nodejs");
  assert.equal(route.dynamic, "force-dynamic");
  assert.equal(route.revalidate, 0);
  const contactResponse = await route.POST(makeRequest("/api/contact", {
    Type: NextRequest, base: "https://attacker.example",
    headers: { Origin: "http://localhost:3000", "X-Forwarded-Host": "attacker.example", "X-Forwarded-Proto": "https" },
  }));
  assert.equal(contactResponse.status, 201);
  assert.equal((await contactResponse.json()).message, contactMessage);
  assert.equal((await route.POST(makeRequest("/api/contact", { Type: NextRequest, body: { ...contact, consent: false } }))).status, 400);
  const newsletter = await route.POST(makeRequest("/api/newsletter", { Type: NextRequest, body: { email: contact.email, consent: true } }));
  assert.equal(newsletter.status, 201);
  assert.equal((await newsletter.json()).message, newsletterMessage);
  const limited = await route.POST(makeRequest("/api/contact", { Type: NextRequest, headers: { "X-Forwarded-For": "203.0.113.10", "X-Real-IP": "203.0.113.11" } }), { remoteAddress: "203.0.113.12" });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  for (const method of ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"]) {
    const response = await route[method](makeRequest("/api/health", { Type: NextRequest, method }));
    assert.equal(response.status, method === "GET" ? 200 : 405);
    assert.equal(response.headers.get("cache-control"), "no-store");
    if (method === "HEAD") assert.equal(await response.text(), "");
  }
  const records = (await readFile(join(dataDir, "requests.jsonl"), "utf8")).trim().split("\n");
  assert.equal(records.length, 1);
  assert.equal(JSON.parse(records[0]).email, contact.email);
  assert.equal(JSON.parse(await readFile(join(dataDir, "newsletter.jsonl"), "utf8")).email, contact.email);
});

test("Next route rejects invalid PUBLIC_ORIGIN and API_RATE env configuration", async (t) => {
  const { dataDir } = await fixture(t);
  const defaults = { DATA_DIR: dataDir, PUBLIC_ORIGIN: undefined, API_RATE_MAX: undefined, API_RATE_WINDOW_MS: undefined, API_RATE_MAX_ENTRIES: undefined };
  for (const environment of [{ PUBLIC_ORIGIN: "https://example.com/path" }, { API_RATE_MAX: "" }, { API_RATE_WINDOW_MS: "NaN" }, { API_RATE_MAX_ENTRIES: "-1" }]) {
    await assert.rejects(withEnvironment({ ...defaults, ...environment }, () =>
      import(`../app/api/[[...path]]/route.js?test=${randomUUID()}`),
    ), /PUBLIC_ORIGIN|Rate-limit/);
  }
});
