import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { productRedirects } from "../src/route-redirects.js";
import { createSubmissionHandler } from "../src/server/submissions.js";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
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

function requestBody(request) {
  let cleanup;
  return new ReadableStream({
    start(controller) {
      const data = (chunk) => {
        controller.enqueue(chunk);
        request.pause();
      };
      const end = () => {
        cleanup();
        controller.close();
      };
      const error = () => {
        cleanup();
        controller.error(new Error("Interrupted request"));
      };
      cleanup = () => {
        request.off("data", data);
        request.off("end", end);
        request.off("error", error);
        request.off("aborted", error);
      };
      request.pause();
      request.on("data", data);
      request.on("end", end);
      request.on("error", error);
      request.on("aborted", error);
    },
    pull() {
      request.resume();
    },
    cancel() {
      // Drain, rather than destroy the socket, so a 413 can still be delivered.
      cleanup();
      request.resume();
    },
  });
}

// HTTP harness for contract tests. Website deployment uses Next.js.
export async function createAppServer({
  dev = false,
  staticRoot = resolve(projectRoot, "dist"),
  dataDir = process.env.DATA_DIR ?? resolve(process.cwd(), "data"),
  rateLimit = {},
  publicOrigin = process.env.PUBLIC_ORIGIN,
} = {}) {
  const handleSubmission = createSubmissionHandler({
    dataDir,
    publicOrigin,
    rateLimit,
  });
  const root = resolve(staticRoot);

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
        const headers = new Headers();
        for (let index = 0; index < request.rawHeaders.length; index += 2) {
          headers.append(request.rawHeaders[index], request.rawHeaders[index + 1]);
        }
        const webRequest = new Request(new URL(request.url, "http://localhost"), {
          method: request.method,
          headers,
          ...(!["GET", "HEAD"].includes(request.method)
            ? { body: requestBody(request), duplex: "half" }
            : {}),
        });
        const result = await handleSubmission(webRequest, {
          remoteAddress: request.socket.remoteAddress,
          protocol: request.socket.encrypted ? "https:" : "http:",
        });
        // This also drains rejected requests whose body was never read.
        if (webRequest.body && !webRequest.body.locked)
          await webRequest.body.cancel().catch(() => {});
        request.resume();
        response.writeHead(result.status, Object.fromEntries(result.headers));
        response.end(Buffer.from(await result.arrayBuffer()));
        return;
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
  return server;
}
