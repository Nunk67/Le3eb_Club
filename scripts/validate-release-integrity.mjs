import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distCandidates = [path.join(root, "dist"), path.join(root, "client", "dist")];
const distDir = distCandidates.find((dir) => fs.existsSync(dir));

function fail(message) {
  console.error(`[release-integrity] ${message}`);
  process.exit(1);
}

if (!distDir) {
  fail("missing dist directory (checked ./dist and ./client/dist); run build first.");
}

const indexHtml = path.join(distDir, "index.html");
const assetsDir = path.join(distDir, "assets");

if (!fs.existsSync(indexHtml)) {
  fail("missing dist/index.html");
}

if (!fs.existsSync(assetsDir)) {
  fail("missing dist/assets directory");
}

const assetFiles = fs.readdirSync(assetsDir);
const hasJs = assetFiles.some((name) => name.endsWith(".js"));
const hasCss = assetFiles.some((name) => name.endsWith(".css"));

if (!hasJs || !hasCss) {
  fail("dist/assets must contain both JS and CSS bundles.");
}

const html = fs.readFileSync(indexHtml, "utf8");
if (!html.includes("assets/")) {
  fail("dist/index.html does not reference dist/assets bundles.");
}

console.log("[release-integrity] passed.");
