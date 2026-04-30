import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const versionFile = path.join(root, "version-control", "version");
const packageFile = path.join(root, "package.json");
const implStatusFile = path.join(root, ".cursor", "commands", "implementation-status.md");
const stateFile = path.join(root, "version-control", ".state", "version-auto-state.json");

const MILESTONE_TO_VERSION = {
  M0: "0.1.0",
  M1: "0.2.0",
  M2: "0.3.0",
  M3: "0.4.0",
  M4: "0.5.0",
  M5: "0.6.0",
  M6: "0.7.0",
  M7: "0.8.0",
  M8: "0.9.0",
  M9: "0.10.0",
  M10: "1.0.0",
};

const IGNORED_PATHS = new Set([
  "version-control/version",
  "version-control/changelog.md",
  "version-control/context-control.md",
  "version-control/.state/version-auto-state.json",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  ".cursor/hooks.json",
]);

function readFileSafe(absPath) {
  if (!fs.existsSync(absPath)) return "";
  return fs.readFileSync(absPath, "utf8");
}

function parseVersion(v) {
  const match = String(v).trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Invalid SemVer: ${v}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersion(a, b) {
  const av = parseVersion(a);
  const bv = parseVersion(b);
  for (let i = 0; i < 3; i += 1) {
    if (av[i] > bv[i]) return 1;
    if (av[i] < bv[i]) return -1;
  }
  return 0;
}

function bumpPatch(v) {
  const [major, minor, patch] = parseVersion(v);
  return `${major}.${minor}.${patch + 1}`;
}

function runGit(args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return { ok: result.status === 0, stdout: (result.stdout || "").trim() };
}

function getHead() {
  const res = runGit(["rev-parse", "HEAD"]);
  return res.ok ? res.stdout : "NO_GIT_HEAD";
}

function getChangedFiles() {
  const staged = runGit(["diff", "--name-only", "--cached"]);
  const unstaged = runGit(["diff", "--name-only"]);
  const files = new Set();
  for (const line of `${staged.stdout}\n${unstaged.stdout}`.split(/\r?\n/)) {
    const rel = line.trim().replace(/\\/g, "/");
    if (rel) files.add(rel);
  }
  return [...files];
}

function getHighestClosedMilestone() {
  const content = readFileSafe(implStatusFile);
  let best = "M0";
  for (const milestone of Object.keys(MILESTONE_TO_VERSION)) {
    const re = new RegExp(`\\|\\s*\\*\\*${milestone}\\*\\*\\s*\\|[^\\n]*\\|\\s*\\*\\*Closed\\*\\*`, "i");
    if (re.test(content)) best = milestone;
  }
  return best;
}

function updatePackageVersion(nextVersion) {
  const parsed = JSON.parse(readFileSafe(packageFile));
  parsed.version = nextVersion;
  fs.writeFileSync(packageFile, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

function main() {
  if (!fs.existsSync(versionFile) || !fs.existsSync(packageFile)) {
    console.log("[version:auto] skip: version files not found");
    return;
  }

  const changedFiles = getChangedFiles();
  const hasMeaningfulChange = changedFiles.some((file) => !IGNORED_PATHS.has(file));
  if (!hasMeaningfulChange) {
    console.log("[version:auto] skip: no meaningful change");
    return;
  }

  const current = readFileSafe(versionFile).trim();
  const highestClosed = getHighestClosedMilestone();
  const baseline = MILESTONE_TO_VERSION[highestClosed] || "0.1.0";
  const head = getHead();

  let state = { lastBumpedHead: "", lastVersion: "" };
  if (fs.existsSync(stateFile)) {
    try {
      state = JSON.parse(readFileSafe(stateFile));
    } catch {
      state = { lastBumpedHead: "", lastVersion: "" };
    }
  }

  let nextVersion = current;
  if (compareVersion(current, baseline) < 0) nextVersion = baseline;
  else if (state.lastBumpedHead !== head) nextVersion = bumpPatch(current);

  if (nextVersion === current) {
    console.log(`[version:auto] no-op: ${current}`);
    return;
  }

  fs.writeFileSync(versionFile, `${nextVersion}\n`, "utf8");
  updatePackageVersion(nextVersion);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, `${JSON.stringify({ lastBumpedHead: head, lastVersion: nextVersion }, null, 2)}\n`, "utf8");
  console.log(`[version:auto] bumped ${current} -> ${nextVersion} (baseline ${baseline}, closed ${highestClosed})`);
}

main();
