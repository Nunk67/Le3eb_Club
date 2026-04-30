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
  read(rulesPath);

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

  // Exposure pool / exposure weight belongs to M6 development scope and is not blocked in M5 gate.

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