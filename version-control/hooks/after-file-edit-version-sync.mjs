#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function shouldSkip(payload) {
  const text = JSON.stringify(payload || {});
  return (
    text.includes("version-control/version") ||
    text.includes("version-control/context-control.md") ||
    text.includes("package.json") ||
    text.includes("version-control/.state/version-auto-state.json")
  );
}

function run() {
  const payload = readInput();
  if (shouldSkip(payload)) {
    process.stdout.write("{}\n");
    return;
  }

  const result = spawnSync("npm", ["run", "version:auto"], {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) process.stderr.write("[hook] version:auto failed\n");
  process.stdout.write("{}\n");
}

run();
