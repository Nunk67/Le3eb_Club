import { spawnSync } from "node:child_process";

const FORBIDDEN_PATTERNS = [/^\.cursor\//, /^version-control\/context-control\.md$/];

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  return { code: result.status ?? 1, stdout: (result.stdout || "").trim(), stderr: (result.stderr || "").trim() };
}

function getTrackingBranch() {
  const res = runGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  if (res.code !== 0) return null;
  return res.stdout;
}

function listOutgoingFiles(baseRef) {
  const range = `${baseRef}..HEAD`;
  const res = runGit(["diff", "--name-only", range]);
  if (res.code !== 0) {
    throw new Error(res.stderr || "failed to get outgoing files");
  }
  return res.stdout ? res.stdout.split(/\r?\n/).map((line) => line.trim().replace(/\\/g, "/")).filter(Boolean) : [];
}

function hasForbidden(path) {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(path));
}

function pushCurrentBranch() {
  const res = runGit(["push"]);
  if (res.code !== 0) {
    console.error(res.stderr || "git push failed");
    process.exit(res.code);
  }
  console.log(res.stdout || "git push succeeded");
}

function main() {
  const upstream = getTrackingBranch();
  if (!upstream) {
    console.error("[safe-push] current branch has no upstream. push with: git push -u origin HEAD");
    process.exit(1);
  }

  const outgoing = listOutgoingFiles(upstream);
  const forbidden = outgoing.filter(hasForbidden);
  if (forbidden.length > 0) {
    console.error("[safe-push] blocked: outgoing commits contain forbidden paths:");
    forbidden.forEach((file) => console.error(`- ${file}`));
    console.error("[safe-push] remove those files from commits before pushing.");
    process.exit(1);
  }

  pushCurrentBranch();
}

main();
