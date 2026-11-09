import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { appendFile, mkdir, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { productRedirects } from "../src/route-redirects.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const bodyLimit = 16 * 1024;
const frontendRoute =
  /^\/(?:about|(?:solutions|products|services|insights)(?:\/[a-zA-Z0-9_-]+)?|contact|support|privacy|terms)\/?$/;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
};

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

function privatePath(pathname, dev) {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.some((segment, index) => {
      // Vite's dependency cache is public in development; other dotfiles are not.
      const viteCache =
        dev &&
        index === 1 &&
        segments[0] === "node_modules" &&
        segment === ".vite";
      return (
        (segment.startsWith(".") && !viteCache) ||
        (/^(?:scripts|data|dist)$/i.test(segment) &&
          !(dev && segments[0] === "node_modules")) ||
        (!dev && /^(?:src|node_modules)$/i.test(segment)) ||
        /^(?:package(?:-lock)?\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?|kilo\.json|(?:vite|vitest)\.config\..*|(?:analysis|manifest|screenshots|verification)\.json|.*metadata.*\.json)$/i.test(
          segment,
        ) ||
        /\.(?:jsonl|map|env)$/i.test(segment)
      );
    }) || segments.includes("@fs")
  );
}

function readJson(request) {
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers["content-type"] ?? "",
    ) ||
    (request.headers["content-encoding"] &&
      request.headers["content-encoding"] !== "identity")
  ) {
    throw new RequestError(
      415,
      "Vui lòng gửi dữ liệu ở định dạng application/json.",
    );
  }
  if (Number(request.headers["content-length"]) > bodyLimit) {
    throw new RequestError(413, "Dữ liệu gửi vượt quá giới hạn 16 KB.");
  }
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    let rejected = false;
    request.on("data", (chunk) => {
      if (rejected) return;
      size += chunk.length;
      if (size > bodyLimit) {
        rejected = true;
        chunks.length = 0;
        reject(new RequestError(413, "Dữ liệu gửi vượt quá giới hạn 16 KB."));
      } else {
        chunks.push(chunk);
      }
    });
    request.on("end", () => {
      if (rejected) return;
      try {
        const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (!value || typeof value !== "object" || Array.isArray(value))
          throw new Error("Invalid object");
        resolveBody(value);
      } catch {
        reject(new RequestError(400, "Dữ liệu JSON không hợp lệ."));
      }
    });
    request.on("error", reject);
    request.on("aborted", () =>
      reject(new RequestError(400, "Yêu cầu bị gián đoạn.")),
    );
  });
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

export async function createAppServer({
  dev = true,
  staticRoot = resolve(projectRoot, "dist"),
  dataDir = resolve(projectRoot, "data"),
  rateLimit = {},
  publicOrigin,
} = {}) {
  if (publicOrigin !== undefined) {
    const url = new URL(publicOrigin);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== publicOrigin
    ) {
      throw new TypeError(
        "PUBLIC_ORIGIN must be an HTTP(S) origin without a path.",
      );
    }
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
  const root = resolve(staticRoot);
  const vite = dev
    ? await (
        await import("vite")
      ).createServer({
        root: projectRoot,
        appType: "spa",
        server: {
          middlewareMode: true,
          watch: {
            // Reference HTML is collector output, not application source.
            ignored: ["**/assets/*/pages/**", "**/assets/*/screenshots/**"],
          },
          fs: {
            deny: [
              "**/.*",
              "**/.env.*",
              "**/*.{crt,pem}",
              "**/.git/**",
              "**/scripts/**",
              "**/data/**",
              "**/*.jsonl",
              "**/*.map",
              "**/{analysis,manifest,screenshots,verification}.json",
              "**/*metadata*.json",
              "**/package{,-lock}.json",
            ],
          },
        },
      })
    : null;

  function limit(request, response) {
    const now = Date.now();
    for (const [ip, entry] of clients) {
      if (now - entry.start >= windowMs) clients.delete(ip);
    }
    // Never trust X-Forwarded-For without an explicitly configured trusted proxy.
    const ip = request.socket.remoteAddress ?? "unknown";
    let entry = clients.get(ip);
    if (!entry) {
      if (clients.size >= maxEntries)
        clients.delete(clients.keys().next().value);
      entry = { start: now, count: 0 };
      clients.set(ip, entry);
    }
    if (entry.count >= maximum) {
      response.setHeader(
        "Retry-After",
        String(Math.max(1, Math.ceil((entry.start + windowMs - now) / 1000))),
      );
      throw new RequestError(
        429,
        "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
      );
    }
    entry.count += 1;
  }

  async function serveFile(pathname, request, response) {
    const candidate = resolve(root, `.${pathname}`);
    function inside(base, target) {
      const path = relative(base, target);
      return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
    }
    if (!inside(root, candidate)) return false;
    let file;
    let information;
    try {
      const canonicalRoot = await realpath(root);
      file = await realpath(candidate);
      if (!inside(canonicalRoot, file)) return false;
      if (
        privatePath(
          `/${relative(canonicalRoot, file).split(sep).join("/")}`,
          false,
        )
      )
        return false;
      information = await stat(file);
    } catch (error) {
      if (["ENOENT", "ENOTDIR", "ELOOP"].includes(error.code)) return false;
      throw error;
    }
    if (!information.isFile()) return false;
    response.setHeader(
      "Content-Type",
      mimeTypes[extname(file).toLowerCase()] ?? "application/octet-stream",
    );
    response.setHeader("Content-Length", information.size);
    response.setHeader(
      "Cache-Control",
      extname(file) === ".html" ? "no-cache" : "public, max-age=3600",
    );
    if (request.method === "HEAD") response.end();
    else await pipeline(createReadStream(file), response);
    return true;
  }

  const server = createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    const rawPath = (request.url ?? "/").split("?")[0];
    const api = rawPath === "/api" || rawPath.startsWith("/api/");
    if (api) response.setHeader("Cache-Control", "no-store");
    try {
      let pathname;
      try {
        pathname = decodeURIComponent(rawPath);
      } catch {
        throw new RequestError(400, "Đường dẫn không hợp lệ.");
      }
      if (
        !pathname.startsWith("/") ||
        /[\\\x00-\x1f\x7f]/.test(pathname) ||
        privatePath(pathname, dev)
      ) {
        throw new RequestError(404, "Không tìm thấy trang.");
      }
      if (pathname === "/api" || pathname.startsWith("/api/")) {
        response.setHeader("Cache-Control", "no-store");
        if (request.headers.origin !== undefined) {
          const protocol = request.socket.encrypted ? "https" : "http";
          const expected =
            publicOrigin ?? `${protocol}://${request.headers.host}`;
          let origin;
          try {
            origin = new URL(request.headers.origin).origin;
          } catch {
            throw new RequestError(403, "Nguồn gửi yêu cầu không được phép.");
          }
          if (origin !== request.headers.origin || origin !== expected) {
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
          response.setHeader("Allow", method);
          throw new RequestError(405, "Phương thức không được hỗ trợ.");
        }
        if (health) return sendJson(response, 200, { ok: true });
        limit(request, response);
        const value = validateSubmission(await readJson(request), contact);
        const record = {
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          ...value,
        };
        await mkdir(dataDir, { recursive: true, mode: 0o700 });
        await appendFile(
          resolve(dataDir, contact ? "requests.jsonl" : "newsletter.jsonl"),
          `${JSON.stringify(record)}\n`,
          { mode: 0o600 },
        );
        return sendJson(response, 201, {
          ok: true,
          id: record.id,
          message: contact
            ? "Yêu cầu của bạn đã được lưu trong hệ thống AQPTech để đội ngũ xem xét. Chưa có email được gửi tự động."
            : "Đăng ký nhận tin của bạn đã được lưu trong hệ thống AQPTech. Chưa có email xác nhận được gửi tự động.",
        });
      }
      if (!["GET", "HEAD"].includes(request.method)) {
        response.setHeader("Allow", "GET, HEAD");
        throw new RequestError(405, "Phương thức không được hỗ trợ.");
      }
      const redirectedPath = productRedirects.get(pathname.replace(/\/+$/, ""));
      if (redirectedPath) {
        const query = new URL(request.url, "http://localhost").search;
        response.writeHead(308, { Location: `${redirectedPath}${query}`, "Cache-Control": "no-cache" });
        response.end();
        return;
      }
      if (vite) {
        vite.middlewares(request, response, () => {
          response.writeHead(404, {
            "Content-Type": "text/plain; charset=utf-8",
          });
          response.end("Không tìm thấy trang.");
        });
        return;
      }
      if (await serveFile(pathname, request, response)) return;
      if (
        (pathname === "/" || frontendRoute.test(pathname)) &&
        (await serveFile("/index.html", request, response))
      )
        return;
      throw new RequestError(404, "Không tìm thấy trang.");
    } catch (error) {
      request.resume();
      if (response.headersSent || response.destroyed) {
        if (!response.destroyed) response.destroy();
        return;
      }
      response.removeHeader("Content-Length");
      response.setHeader("Cache-Control", "no-store");
      sendJson(response, error instanceof RequestError ? error.status : 500, {
        ok: false,
        message:
          error instanceof RequestError
            ? error.message
            : "Hệ thống chưa thể tiếp nhận yêu cầu. Vui lòng thử lại sau.",
      });
    }
  });
  server.on("close", () => {
    clients.clear();
    if (vite)
      void vite.close().catch(() => console.error("Unable to close Vite."));
  });
  return server;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    const port = Number(process.env.PORT ?? 5173);
    if (!Number.isInteger(port) || port < 0 || port > 65535)
      throw new Error("PORT must be an integer between 0 and 65535.");
    const host = process.env.HOST ?? "127.0.0.1";
    const server = await createAppServer({
      dev: !process.argv.includes("--production"),
      publicOrigin: process.env.PUBLIC_ORIGIN,
    });
    await new Promise((resolveListen, reject) => {
      server.once("error", reject);
      server.listen(port, host, resolveListen);
    }).catch((error) => {
      server.close();
      throw error;
    });
    console.log(
      `AQPTech server listening at http://${host}:${server.address().port}`,
    );
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.once(signal, () => {
        server.close();
        server.closeIdleConnections();
      });
    }
    server.on("error", (error) => {
      console.error(`HTTP server error: ${error.message}`);
      process.exitCode = 1;
      server.close();
    });
  } catch (error) {
    console.error(`Unable to start AQPTech server: ${error.message}`);
    process.exitCode = 1;
  }
}
