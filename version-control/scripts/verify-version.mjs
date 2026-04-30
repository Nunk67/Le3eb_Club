import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "..");
const semver = /^\d+\.\d+\.\d+$/;

function readVersionFile() {
  const file = path.join(root, "version-control", "version");
  if (!fs.existsSync(file)) {
    console.error("[verify-version] missing", file);
    process.exit(1);
  }
  return fs.readFileSync(file, "utf8").trim();
}

function readPackageVersion() {
  const file = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  return String(pkg.version ?? "").trim();
}

const versionFromFile = readVersionFile();
const versionFromPkg = readPackageVersion();

if (!semver.test(versionFromFile)) {
  console.error(`[verify-version] version-control/version must be MAJOR.MINOR.PATCH, got: ${versionFromFile}`);
  process.exit(1);
}

if (versionFromFile !== versionFromPkg) {
  console.error(`[verify-version] mismatch: version-control/version=${versionFromFile} package.json=${versionFromPkg}`);
  process.exit(1);
}

console.log(`[verify-version] ok ${versionFromFile}`);
