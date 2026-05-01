import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FULL_CHECKS = ["validate:policy", "validate:alg", "validate:i18n", "lint", "build"];
const M10_CHECKS = [...FULL_CHECKS, "validate:release-integrity"];

/** Progressive gates: M0–M2 lighter; M3+ adds lint; M5+ adds build; M7+ enforces i18n governance; all converge by M10. */
const STAGE_CHECKS = {
  M0: ["validate:policy", "validate:alg"],
  M1: ["validate:policy", "validate:alg"],
  M2: ["validate:policy", "validate:alg", "lint"],
  M3: ["validate:policy", "validate:alg", "lint"],
  M4: ["validate:policy", "validate:alg", "lint"],
  M5: ["validate:policy", "validate:alg", "lint", "build"],
  M6: ["validate:policy", "validate:alg", "lint", "build"],
  M7: FULL_CHECKS,
  M8: FULL_CHECKS,
  M9: FULL_CHECKS,
  M10: M10_CHECKS,
};

const PROFILE_TO_STAGE = {
  default: "M10",
  "full-system": "M10",
};

function parseStage(argv) {
  const arg = argv.find((x) => x.startsWith("--stage="));
  if (!arg) return null;
  const value = arg.split("=")[1]?.toUpperCase();
  if (!value || !(value in STAGE_CHECKS)) {
    throw new Error(`Invalid stage: ${value}. Use M0..M10`);
  }
  return value;
}

function parseProfile(argv) {
  const arg = argv.find((x) => x.startsWith("--profile="));
  if (!arg) return "default";
  const value = arg.split("=")[1]?.toLowerCase();
  if (!value || !(value in PROFILE_TO_STAGE)) {
    throw new Error(`Invalid profile: ${value}. Use default|full-system`);
  }
  return value;
}

function runStaticChecksForProfile(profile) {
  if (profile !== "full-system") return;
  const root = process.cwd();
  const checks = [
    {
      file: "version-control/governance/rules/validator-system.mdc",
      mustInclude: [
        "full-system gate matrix requirements are aligned with current stage",
        "Business Domain Gate",
        "Admin Domain Gate",
        "Production Domain Gate",
      ],
    },
  ];
  const failures = [];

  for (const check of checks) {
    const abs = path.join(root, check.file);
    if (!fs.existsSync(abs)) {
      failures.push(`missing file: ${check.file}`);
      continue;
    }
    const text = fs.readFileSync(abs, "utf8");
    for (const token of check.mustInclude) {
      if (!text.includes(token)) {
        failures.push(`${check.file} missing token: ${token}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("[gate] full-system static checks failed:");
    for (const f of failures) {
      console.error(`[gate] - ${f}`);
    }
    process.exit(1);
  }
}

function runNpmScript(name) {
  const npmExecPath = process.env.npm_execpath;
  if (!npmExecPath) {
    throw new Error("npm_execpath is not available in environment");
  }
  const result = spawnSync(process.execPath, [npmExecPath, "run", name], {
    stdio: "inherit",
    env: process.env,
  });
  return result.status ?? 1;
}

function main() {
  const argv = process.argv.slice(2);
  console.log("[gate] running verify:version");
  const verifyCode = runNpmScript("verify:version");
  if (verifyCode !== 0) {
    console.error(`[gate] failed: verify:version (exit ${verifyCode})`);
    process.exit(verifyCode);
  }
  const profile = parseProfile(argv);
  const explicitStage = parseStage(argv);
  const stage = explicitStage ?? PROFILE_TO_STAGE[profile];
  const checks = STAGE_CHECKS[stage];
  if (!explicitStage) {
    console.warn(
      `[gate] no --stage provided; resolved by profile=${profile} -> stage=${stage}.`,
    );
    console.warn(
      "[gate] note: gate pass means validation checks passed, not milestone closure.",
    );
  }
  runStaticChecksForProfile(profile);
  console.log(`[gate] profile=${profile}`);
  console.log(`[gate] stage=${stage}`);
  console.log(`[gate] checks=${checks.join(", ")}`);

  for (const script of checks) {
    console.log(`[gate] running ${script}`);
    const code = runNpmScript(script);
    if (code !== 0) {
      console.error(`[gate] failed: ${script} (exit ${code})`);
      process.exit(code);
    }
  }

  console.log(
    `[gate] passed checks for stage ${stage} (validation only; milestone status is managed separately).`,
  );
}

main();
