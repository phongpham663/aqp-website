import { createServer } from "node:http";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import next from "next";

const directory = await mkdtemp(join(tmpdir(), "aqp-next-tests-"));
process.env.DATA_DIR = join(directory, "data");
process.env.API_RATE_MAX = "1000";
delete process.env.PUBLIC_ORIGIN;
// Derive the rewrite origin from requests instead of configuring an ephemeral port as zero.
const app = next({ dev: false });
let server;
try {
  await app.prepare();
  server = createServer(app.getRequestHandler());
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const files = (await readdir("scripts")).filter((name) => name.endsWith(".test.mjs")).map((name) => join("scripts", name));
  const child = spawn(process.execPath, ["--test", "--test-concurrency=1", ...files], {
    stdio: "inherit",
    env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${server.address().port}` },
  });
  const code = await new Promise((resolve, reject) => { child.once("error", reject); child.once("exit", resolve); });
  process.exitCode = code ?? 1;
} finally {
  server?.closeAllConnections();
  if (server) await new Promise((resolve) => server.close(resolve));
  await app.close();
  await rm(directory, { recursive: true, force: true });
}
