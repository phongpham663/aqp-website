import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { collect, publicPage as sharedPublicPage } from "./collect-opretail.mjs";
import { verifyCollection } from "./collect-magal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://auk.industries";

export const publicPage = (raw, base = origin) => sharedPublicPage(raw, base, origin);

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (!args.every((argument) => ["all", "verify"].includes(argument) || /^--max-pages=\d+$/.test(argument) || argument.startsWith("--output="))) throw new Error("Use all or verify, --max-pages=N and --output=assets/directory");
    const output = path.resolve(root, args.find((argument) => argument.startsWith("--output="))?.slice(9) || "assets/auk");
    if (args.includes("verify")) {
      const result = await verifyCollection(output);
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else await collect({ source: origin, output, sitemapPath: "/sitemap-index.xml", maxPages: Number(args.find((argument) => argument.startsWith("--max-pages="))?.split("=")[1] || 200) });
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
