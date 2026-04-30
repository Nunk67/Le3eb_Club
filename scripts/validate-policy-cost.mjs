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

function mustInclude(content, token, file, failures) {
  if (!content.includes(token)) {
    failures.push(`${file} missing token: ${token}`);
  }
}

function main() {
  const failures = [];

  const verificationPath = "version-control/governance/commands/validate-policy-cost.md";
  const rulesPath = "version-control/governance/rules/algorithm-rules.mdc";
  const systemValidatorPath = "version-control/governance/rules/validator-system.mdc";
  const milestonePath = "version-control/governance/commands/update-milestone.md";
  const snapshotPath = "version-control/governance/commands/snapshot-version.md";

  const verification = read(verificationPath);
  const rules = read(rulesPath);
  const systemValidator = read(systemValidatorPath);
  const milestone = read(milestonePath);
  const snapshot = read(snapshotPath);

  // POL baseline exists
  for (let i = 1; i <= 5; i += 1) {
    mustInclude(verification, `POL-0${i}`, verificationPath, failures);
  }
  mustInclude(
    verification,
    "must all pass before advancing to the next phase",
    verificationPath,
    failures
  );

  // Must be wired into gate/commands
  mustInclude(systemValidator, "POL-", systemValidatorPath, failures);
  mustInclude(milestone, "POL-", milestonePath, failures);
  mustInclude(snapshot, "POL-", snapshotPath, failures);

  // Must explicitly define exclusion of guild monthly rewards
  mustInclude(rules, "Explicitly excluded", rulesPath, failures);
  mustInclude(rules, "guild monthly bonus", rulesPath, failures);
  mustInclude(rules, "guild_month_bonus_rate", rulesPath, failures);

  // Core rate constants
  mustInclude(rules, "40%", rulesPath, failures);
  for (const rate of ["45%", "46%", "48%", "50%", "55%", "60%"]) {
    mustInclude(verification, rate, verificationPath, failures);
  }

  if (failures.length > 0) {
    console.error("Policy cost gate failed:");
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }

  console.log("Policy cost gate passed.");
}

main();
