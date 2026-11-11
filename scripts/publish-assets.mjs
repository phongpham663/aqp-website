import { copyFile, lstat, mkdir, readdir, readFile, realpath, rm } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = await realpath(resolve(root, "assets"));
const output = resolve(root, "public/assets");
const types = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".pdf"]);
const urls = new Set();

function inside(base, target) {
  const path = relative(base, target);
  return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await scan(path);
    else if (/\.(?:js|jsx)$/.test(entry.name)) {
      const text = await readFile(path, "utf8");
      for (const match of text.matchAll(/["'](\/assets\/[^"'?#]+)["']/g)) {
        const url = match[1];
        if (!types.has(extname(url).toLowerCase()) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(url) || url.includes("\\")) throw new Error(`Unsupported public asset: ${url}`);
        urls.add(url);
      }
    }
  }
}
await scan(resolve(root, "src"));
// This directory contains generated, allowlisted media only, never source archives.
try {
  if ((await lstat(output)).isSymbolicLink()) throw new Error("Public assets directory must not be a symlink.");
} catch (error) { if (error.code !== "ENOENT") throw error; }
await rm(output, { recursive: true, force: true });
for (const url of urls) {
  const source = await realpath(resolve(root, `.${url}`));
  if (!inside(sourceRoot, source)) throw new Error(`Asset escapes source directory: ${url}`);
  const target = resolve(root, "public", `.${url}`);
  if (!inside(output, target)) throw new Error(`Asset escapes public directory: ${url}`);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}
console.log(`Published ${urls.size} referenced images and PDFs for Next.js.`);
