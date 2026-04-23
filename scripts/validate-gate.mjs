import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const STAGE_CHECKS = {
  M1: ["validate:policy"],
  M2: ["validate:policy"],
  M3: ["validate:policy"],
  M4: ["validate:alg"],
  M5: ["validate:alg", "validate:policy"],
  M6: ["validate:alg", "validate:policy", "lint", "build"],
};

const PROFILE_TO_STAGE = {
  default: "M6",
  "full-system": "M6",
};

function parseStage(argv) {
  const arg = argv.find((x) => x.startsWith("--stage="));
  if (!arg) return null;
  const value = arg.split("=")[1]?.toUpperCase();
  if (!value || !(value in STAGE_CHECKS)) {
    throw new Error(`Invalid stage: ${value}. Use M1..M6`);
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
      file: "harness/validators/full-system-gate-matrix.md",
      mustInclude: ["Business Domain Gate", "Admin Domain Gate", "Production Domain Gate"],
    },
    {
      file: "harness/validators/system-validator.md",
      mustInclude: ["full-system gate matrix requirements are aligned with current stage"],
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
  const profile = parseProfile(argv);
  const explicitStage = parseStage(argv);
  const stage = explicitStage ?? PROFILE_TO_STAGE[profile];
  const checks = STAGE_CHECKS[stage];
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

  console.log(`[gate] passed stage ${stage}`);
}

main();
