import { request as httpRequest } from "node:http";

// Existing template assertions load native ESM; browser requests use the real Next test app.
export async function createRendererServer() {
  return {
    ssrLoadModule(path) { return import(new URL(`..${path}`, import.meta.url)); },
    async close() {},
    middlewares(request, response, next) {
      if (!process.env.TEST_BASE_URL) return next?.(new Error("Run browser tests with npm test or TEST_BASE_URL."));
      const target = new URL(request.url, process.env.TEST_BASE_URL);
      const outgoing = httpRequest(target, { method: request.method, headers: request.headers }, (incoming) => {
        response.writeHead(incoming.statusCode, incoming.headers);
        incoming.pipe(response);
      });
      outgoing.on("error", () => { if (!response.headersSent) response.writeHead(502); response.end("Next test server unavailable."); });
      request.pipe(outgoing);
    },
  };
}
