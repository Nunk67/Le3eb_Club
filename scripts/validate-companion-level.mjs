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
  const srcRoot = path.join(root, "src");
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
  walk(srcRoot);
  const serverTs = path.join(root, "server.ts");
  if (fs.existsSync(serverTs)) {
    paths.push("server.ts");
  }
  return paths;
}

function main() {
  const failures = [];

  const verificationPath = "harness/algorithm/companion-level/verification.md";
  const systemValidatorPath = "harness/validators/system-validator.md";
  const frontendValidatorPath = "harness/validators/frontend-validator.md";
  const securityValidatorPath = "harness/validators/security-validator.md";
  const updateMilestonePath = "harness/commands/update_milestone.md";
  const snapshotPath = "harness/commands/snapshot_version.md";
  const rulesPath = "harness/algorithm/companion-level/rules.md";
  const mappingPath = "harness/algorithm/companion-level/mapping.md";

  const verification = read(verificationPath);
  const systemValidator = read(systemValidatorPath);
  const frontendValidator = read(frontendValidatorPath);
  const securityValidator = read(securityValidatorPath);
  const updateMilestone = read(updateMilestonePath);
  const snapshot = read(snapshotPath);
  const rules = read(rulesPath);
  const mapping = read(mappingPath);

  // ALG gate baseline must exist and be complete.
  for (let i = 1; i <= 8; i += 1) {
    assertIncludes(verification, `ALG-0${i}`, verificationPath, failures);
  }
  assertIncludes(
    verification,
    "全部通过，方可进入下一阶段",
    verificationPath,
    failures
  );

  // Validators and feedback loop must explicitly gate ALG checks.
  assertIncludes(systemValidator, "ALG-", systemValidatorPath, failures);
  assertIncludes(frontendValidator, "ALG-", frontendValidatorPath, failures);
  assertIncludes(securityValidator, "algorithm gate", securityValidatorPath, failures);
  assertIncludes(updateMilestone, "ALG-", updateMilestonePath, failures);
  assertIncludes(snapshot, "ALG-", snapshotPath, failures);

  // Exposure weight must be removed from docs and implementation (scan repo sources, not legacy demo files).
  const forbiddenTokens = ["exposureBoost", "exposure", "热门位", "曝光权重"];
  for (const token of forbiddenTokens) {
    assertNotIncludes(rules, token, rulesPath, failures);
    assertNotIncludes(mapping, token, mappingPath, failures);
  }

  const implPaths = collectImplementationScanPaths();
  if (implPaths.length === 0) {
    failures.push("No implementation files found under src/ for companion-level scan");
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
