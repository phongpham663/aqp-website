import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import { chmod, lstat, mkdir, open } from "node:fs/promises";
import { resolve, sep } from "node:path";

const bodyLimit = 16 * 1024;
const securityHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJson(request) {
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") ?? "",
    ) ||
    (request.headers.get("content-encoding") &&
      request.headers.get("content-encoding") !== "identity")
  ) {
    throw new RequestError(
      415,
      "Vui lòng gửi dữ liệu ở định dạng application/json.",
    );
  }
  if (Number(request.headers.get("content-length")) > bodyLimit) {
    throw new RequestError(413, "Dữ liệu gửi vượt quá giới hạn 16 KB.");
  }
  const chunks = [];
  let size = 0;
  const reader = request.body?.getReader();
  if (reader) {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > bodyLimit) {
          throw new RequestError(413, "Dữ liệu gửi vượt quá giới hạn 16 KB.");
        }
        chunks.push(Buffer.from(value));
      }
    } catch (error) {
      if (error instanceof RequestError) throw error;
      throw new RequestError(400, "Yêu cầu bị gián đoạn.");
    } finally {
      reader.releaseLock();
    }
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks, size).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Invalid object");
    return value;
  } catch {
    throw new RequestError(400, "Dữ liệu JSON không hợp lệ.");
  }
}

function validateSubmission(body, contact) {
  if (
    body.website !== undefined &&
    (typeof body.website !== "string" ||
      body.website.length > 200 ||
      body.website.trim())
  ) {
    throw new RequestError(400, "Không thể tiếp nhận yêu cầu này.");
  }
  if (body.consent !== true) {
    throw new RequestError(
      400,
      "Vui lòng đồng ý với việc xử lý thông tin trước khi gửi.",
    );
  }
  function field(key, maximum, minimum = 0) {
    const value = body[key] === undefined && minimum === 0 ? "" : body[key];
    const controls =
      key === "message"
        ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/
        : /[\x00-\x1f\x7f]/;
    if (
      typeof value !== "string" ||
      value.length > maximum ||
      value.trim().length < minimum ||
      controls.test(value)
    ) {
      throw new RequestError(400, `Thông tin ${key} không hợp lệ.`);
    }
    return value.trim();
  }
  const email = field("email", 254, 1).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestError(400, "Địa chỉ email không hợp lệ.");
  }
  if (!contact) {
    const firstName = field("firstName", 60);
    const lastName = field("lastName", 60);
    return {
      email,
      consent: true,
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    };
  }
  const region = field("region", 120);
  return {
    name: field("name", 120, 1),
    email,
    company: field("company", 200),
    phone: field("phone", 40),
    interest: field("interest", 200),
    message: field("message", 5000, 10),
    consent: true,
    ...(region ? { region } : {}),
  };
}

export function createSubmissionHandler({
  dataDir = process.env.DATA_DIR ?? resolve(process.cwd(), "data"),
  publicOrigin = process.env.PUBLIC_ORIGIN,
  rateLimit = {},
} = {}) {
  if (publicOrigin !== undefined) {
    let url;
    try {
      url = new URL(publicOrigin);
    } catch {
      throw new TypeError(
        "PUBLIC_ORIGIN must be an HTTP(S) origin without a path.",
      );
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== publicOrigin
    ) {
      throw new TypeError(
        "PUBLIC_ORIGIN must be an HTTP(S) origin without a path.",
      );
    }
  }
  const directory = resolve(/* turbopackIgnore: true */ dataDir);
  const publicRoot = resolve(process.cwd(), "public");
  if (directory === publicRoot || directory.startsWith(`${publicRoot}${sep}`)) {
    throw new TypeError("DATA_DIR must be outside the public directory.");
  }
  const maximum = rateLimit.max ?? 10;
  const windowMs = rateLimit.windowMs ?? 60_000;
  const maxEntries = rateLimit.maxEntries ?? 10_000;
  if (
    ![maximum, windowMs, maxEntries].every(
      (value) => Number.isSafeInteger(value) && value > 0,
    )
  ) {
    throw new TypeError("Rate-limit options must be positive integers.");
  }
  const clients = new Map();

  // Only the Node HTTP adapter supplies a real socket address/protocol. Next
  // has no trusted client IP contract, so all its submissions share one bucket.
  return async function handleSubmission(
    request,
    { remoteAddress, protocol = "http:" } = {},
  ) {
    const headers = { ...securityHeaders };
    function json(status, value) {
      return new Response(
        request.method === "HEAD" ? null : JSON.stringify(value),
        { status, headers },
      );
    }
    try {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(request.url).pathname);
      } catch {
        throw new RequestError(400, "Đường dẫn không hợp lệ.");
      }
      if (/[\\\x00-\x1f\x7f]/.test(pathname)) {
        throw new RequestError(404, "Không tìm thấy trang.");
      }
      const originHeader = request.headers.get("origin");
      if (originHeader !== null) {
        let expected = publicOrigin;
        let origin;
        try {
          origin = new URL(originHeader).origin;
          if (!expected) {
            const host = request.headers.get("host");
            // Never derive this from Next's URL or forwarded host/protocol.
            if (
              !host ||
              /[\s\\/@?#%]/.test(host) ||
              !["http:", "https:"].includes(protocol)
            )
              throw new Error("Invalid Host");
            const url = new URL(`${protocol}//${host}`);
            if (!url.host || url.username || url.password || url.pathname !== "/")
              throw new Error("Invalid Host");
            expected = url.origin;
          }
        } catch {
          throw new RequestError(403, "Nguồn gửi yêu cầu không được phép.");
        }
        if (origin !== originHeader || origin !== expected) {
          throw new RequestError(403, "Nguồn gửi yêu cầu không được phép.");
        }
      }
      const contact = pathname === "/api/contact";
      const newsletter = pathname === "/api/newsletter";
      const health = pathname === "/api/health";
      if (!contact && !newsletter && !health)
        throw new RequestError(404, "Không tìm thấy API.");
      const method = health ? "GET" : "POST";
      if (request.method !== method) {
        headers.Allow = method;
        throw new RequestError(405, "Phương thức không được hỗ trợ.");
      }
      if (health) return json(200, { ok: true });

      const now = Date.now();
      for (const [client, entry] of clients) {
        if (now - entry.start >= windowMs) clients.delete(client);
      }
      const client = remoteAddress ?? "anonymous";
      let entry = clients.get(client);
      if (!entry) {
        if (clients.size >= maxEntries)
          clients.delete(clients.keys().next().value);
        entry = { start: now, count: 0 };
        clients.set(client, entry);
      }
      if (entry.count >= maximum) {
        headers["Retry-After"] = String(
          Math.max(1, Math.ceil((entry.start + windowMs - now) / 1000)),
        );
        throw new RequestError(
          429,
          "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
        );
      }
      entry.count += 1;

      const value = validateSubmission(await readJson(request), contact);
      const record = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...value,
      };
      await mkdir(directory, { recursive: true, mode: 0o700 });
      if (!(await lstat(directory)).isDirectory())
        throw new Error("Invalid data directory");
      await chmod(directory, 0o700);
      const file = await open(/* turbopackIgnore: true */
        resolve(directory, contact ? "requests.jsonl" : "newsletter.jsonl"),
        constants.O_WRONLY |
          constants.O_APPEND |
          constants.O_CREAT |
          constants.O_NOFOLLOW,
        0o600,
      );
      try {
        if (!(await file.stat()).isFile()) throw new Error("Invalid data file");
        await file.chmod(0o600);
        await file.appendFile(`${JSON.stringify(record)}\n`, "utf8");
      } finally {
        await file.close();
      }
      return json(201, {
        ok: true,
        id: record.id,
        message: contact
          ? "Yêu cầu của bạn đã được lưu trong hệ thống AQPTech để đội ngũ xem xét. Chưa có email được gửi tự động."
          : "Đăng ký nhận tin của bạn đã được lưu trong hệ thống AQPTech. Chưa có email xác nhận được gửi tự động.",
      });
    } catch (error) {
      // Do not wait for an attacker to finish uploading before responding.
      if (request.body && !request.body.locked)
        void request.body.cancel().catch(() => {});
      return json(error instanceof RequestError ? error.status : 500, {
        ok: false,
        message:
          error instanceof RequestError
            ? error.message
            : "Hệ thống chưa thể tiếp nhận yêu cầu. Vui lòng thử lại sau.",
      });
    }
  };
}
