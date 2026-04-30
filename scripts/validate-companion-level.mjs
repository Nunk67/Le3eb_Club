import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing required file: ${relPath}`);
  }
  return fs.readFileSync(abs, "utf8");
}

function assertIncludes(content, token, file, failures) {
  if (!content.includes(token)) {
    failures.push(`${file} missing token: ${token}`);
  }
}

function assertNotIncludes(content, token, file, failures) {
  if (content.toLowerCase().includes(token.toLowerCase())) {
    failures.push(`${file} still contains forbidden token: ${token}`);
  }
}

/** Collect implementation sources for companion-level exposure checks (no fixed demo paths). */
function collectImplementationScanPaths() {
  const paths = [];
  const roots = ["client", "admin", "shared", "backend"];
  const walk = (dirAbs) => {
    if (!fs.existsSync(dirAbs)) return;
    for (const name of fs.readdirSync(dirAbs)) {
      if (name === "node_modules") continue;
      const full = path.join(dirAbs, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (/\.(ts|tsx|js|mjs)$/i.test(name)) {
        paths.push(path.relative(root, full).replace(/\\/g, "/"));
      }
    }
  };
  for (const rel of roots) {
    walk(path.join(root, rel));
  }
  return paths;
}

function main() {
  const failures = [];

  const verificationPath = "version-control/governance/commands/validate-companion-level.md";
  const systemValidatorPath = "version-control/governance/rules/validator-system.mdc";
  const updateMilestonePath = "version-control/governance/commands/update-milestone.md";
  const snapshotPath = "version-control/governance/commands/snapshot-version.md";
  const rulesPath = "version-control/governance/rules/algorithm-rules.mdc";

  const verification = read(verificationPath);
  const systemValidator = read(systemValidatorPath);
  const updateMilestone = read(updateMilestonePath);
  const snapshot = read(snapshotPath);
  const rules = read(rulesPath);

  // ALG gate baseline must exist and be complete.
  for (let i = 1; i <= 8; i += 1) {
    assertIncludes(verification, `ALG-0${i}`, verificationPath, failures);
  }
  assertIncludes(
    verification,
    "must all pass before advancing to the next phase",
    verificationPath,
    failures
  );

  // Validators and feedback loop must explicitly gate ALG checks.
  assertIncludes(systemValidator, "ALG-", systemValidatorPath, failures);
  assertIncludes(systemValidator, "algorithm gate", systemValidatorPath, failures);
  assertIncludes(updateMilestone, "ALG-", updateMilestonePath, failures);
  assertIncludes(snapshot, "ALG-", snapshotPath, failures);

  // Exposure weight must be removed from docs and implementation (scan repo sources, not legacy demo files).
  const forbiddenTokens = ["exposureBoost", "exposure", "热门位", "曝光权重"];
  for (const token of forbiddenTokens) {
    assertNotIncludes(rules, token, rulesPath, failures);
  }

  const implPaths = collectImplementationScanPaths();
  if (implPaths.length === 0) {
    failures.push("No implementation files found under client/admin/shared/backend for companion-level scan");
  }
  for (const rel of implPaths) {
    const content = read(rel);
    for (const token of forbiddenTokens) {
      assertNotIncludes(content, token, rel, failures);
    }
  }

  if (failures.length > 0) {
    console.error("Companion-level algorithm gate failed:");
    for (const item of failures) {
      console.error(`- ${item}`);
    }
    process.exit(1);
  }

  console.log("Companion-level algorithm gate passed.");
}

main();
