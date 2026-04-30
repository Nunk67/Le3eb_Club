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
  const milestonesPath = ".cursor/commands/milestones.md";
  const milestones = read(milestonesPath);

  for (const locale of ["ar", "zh-CN", "en", "fr", "ru", "tr"]) {
    mustInclude(milestones, locale, milestonesPath, failures);
  }

  for (const token of ["P6-1", "P6-2", "P6-3", "P6-4", "P6-5"]) {
    mustInclude(milestones, token, milestonesPath, failures);
  }

  mustInclude(milestones, "validate:i18n", milestonesPath, failures);
  mustInclude(milestones, "RTL", milestonesPath, failures);
  mustInclude(milestones, "error-code-first", milestonesPath, failures);

  if (failures.length > 0) {
    console.error("i18n gate failed:");
    for (const item of failures) {
      console.error(`- ${item}`);
    }
    process.exit(1);
  }

  console.log("i18n gate passed.");
}

main();
