# Changelog

Notable product-facing and governance changes. **Canonical numeric SemVer** is `version-control/version`; keep `package.json` `version` in sync. Milestone ↔ version mapping and bump discipline: [`version-control/governance/rules/version-control.mdc`](governance/rules/version-control.mdc). Changelog entries should describe push-bound changes only.

## [Unreleased]

### [2026-05-01 02:06:00 LOCAL] [0.6.0] Closed M5 companion-level settlement milestone with gate-backed evidence.

- Promoted product SemVer to `0.6.0` in `version-control/version` and `package.json` to match M5 mapping.
- Upgraded M5 from audit stub to closure record in `version-control/governance/commands/milestones.md` and marked M5 `Closed` in `version-control/governance/commands/implementation-status.md`.
- Re-validated closure evidence with `npm run verify:version` and `npm run validate:gate -- --stage=M5`.

### [2026-05-01 14:30:00 LOCAL] [0.5.1] README SemVer banner and changelog link consistency.

- Root `README.md`: title block uses numeric **0.5.1**; clarify storage `schemaVersion` vs product SemVer; milestone/version mapping points at `version-control/governance/`.
- `version-control/changelog.md`: `[0.1.0]` historical links use repo-relative `governance/...` targets; blueprint pointer uses `architecture-blueprint.md` instead of ignored `.cursor/agents/`.

### [2026-05-01 13:20:00 LOCAL] [0.5.1] Centralize gate governance under `version-control/governance` and ignore `.cursor` in Git.

- Moved command + rule sources from `governance/` to `version-control/governance/{commands,rules}/`; updated `scripts/validate-*.mjs` and `version-control/scripts/auto-version-bump.mjs` to read the new paths.
- Simplified `.gitignore` (entire `.cursor/` ignored) and CI workflow (always run full-system gate on code changes); added `version-control/README.md` as the bundle index.
- Repaired mojibake in policy/ALG command specs (`through` wording) so token checks stay ASCII-stable.

### [2026-05-01 00:34:00 LOCAL] [0.5.0] Closed M4 transaction and wallet milestone with synchronized version and gate evidence.

- Promoted product SemVer to `0.5.0` in `version-control/version` and `package.json` to match milestone mapping for M4.
- Replaced the M4 audit stub with a closure record in `version-control/governance/commands/milestones.md` and updated M4 status to `Closed` in `version-control/governance/commands/implementation-status.md`.
- Re-validated closure evidence with `npm run verify:version` and `npm run validate:gate -- --stage=M4`.

### [2026-05-01 12:00:00 LOCAL] [0.4.0] Point governance links at `version-control/governance/rules/*.mdc` (merged rules + validator).

- Updated root `README.md`, `.cursor/README.md`, `version-control/changelog.md`, and `version-control/governance/commands/milestones.md` deliverable paths to match canonical `.mdc` rules and merged validator content.

### [2026-04-30 22:45:00 LOCAL] [0.4.0] Closed M3 policy/economic foundation and initialized audit closure records for M4-M10.

- Added M3 closure template and phase audit framework to `version-control/governance/commands/milestones.md`, including required per-phase gate/evidence workflow.
- Added inline `M3 closure record` in `version-control/governance/commands/milestones.md` and marked M3 `Closed` in `version-control/governance/commands/implementation-status.md` with stage-gate evidence.
- Initialized closure record stubs for M4-M10 under `version-control/governance/commands/` to ensure each remaining phase has a dedicated audit trail entry point.
- Promoted product SemVer to `0.4.0` in `version-control/version` and `package.json`.
- Re-validated with `npm run validate:gate -- --stage=M3` and `npm run validate:gate -- --profile=full-system`.

### [2026-04-30 22:03:00 LOCAL] [0.3.0] Closed M2 data/backend foundation with auditable evidence and green stage gate.

- Closed M2 with explicit evidence path set (data schema, migration, load/sanitize/persist flow, shared contracts) and updated milestone status accordingly.
- Promoted product SemVer to `0.3.0` for milestone-aligned release discipline (`version-control/version` and `package.json` synced).
- Re-validated closure with `npm run validate:gate -- --stage=M2` and confirmed policy/algorithm/lint checks all passed.

### [2026-04-30 21:33:16 LOCAL] [0.2.0] Completed M1 blueprint closure with explicit deliverables and evidence links.

- Added M1 closure template and evidence checklist to `version-control/governance/commands/milestones.md`.
- Added canonical architecture blueprint file at `version-control/governance/commands/architecture-blueprint.md`.
- Updated M1 status to `Closed` in `version-control/governance/commands/implementation-status.md` and aligned architecture agent reference.
- Re-validated stage gate with `npm run validate:gate -- --stage=M1`.

### [2026-04-30 19:55:46 LOCAL] [0.1.3] Unified changelog/context write rules with timestamped versioned titles.

- Clarified write policy: follow previous entry format, use one-sentence title, and include local timestamp + current SemVer for each Unreleased write.
- Aligned governance wording so gate pass semantics, SemVer source-of-truth, and local-time context logging remain consistent across docs.
- Preserved push-bound changelog scope: local-only/ignored path edits do not require changelog entries.
## [0.1.0] - 2026-04-29

### Added

- **M0 harness closure**: `version-control/governance/rules/validator-system.mdc` (full-system static gate checks; supersedes legacy split validator markdown files).
- **`version-control/scripts/verify-version.mjs`** — asserts `version-control/version` matches `package.json` (also runs at start of `validate:gate`).
- **[`implementation-status.md`](governance/commands/implementation-status.md)** (code vs milestones audit) and **[`development-principles.mdc`](governance/rules/development-principles.mdc)**.
- **Global principles** ([`milestones.md`](governance/commands/milestones.md)): *Shallow surfaces* — minimize dependency graphs, interface stacks, component nesting, and indirect call depth.

### Changed

- Restored governance sources under **`version-control/governance/commands/*.md`** + **`version-control/governance/rules/*.mdc`** (policy-cost, companion-level, validators) so `validate:policy` / `validate:alg` and full-system CI gates pass.
- **Single source for versioning**: narrative points to [`version-control.mdc`](governance/rules/version-control.mdc).
- **Blueprint location**: canonical architecture blueprint is [`architecture-blueprint.md`](governance/commands/architecture-blueprint.md).
- [`version-control.mdc`](governance/rules/version-control.mdc) bump checklist: includes **`verify:version`** and auto-bump workflow.
- Context log timestamp convention uses local machine time (`### [YYYY-MM-DD HH:MM:SS LOCAL]`) as documented in `context-control.md`.
- **Earlier in 0.1.0 cycle (2026-04-25)**: product SemVer aligned to **`0.1.0`** / **M0** **`v0.1.0`**; `.gitignore` for context log basename; root cleanup (`find_*.js`, `metadata.json`).

### Fixed

- Full-system CI gate could fail when validator markdown under `version-control/governance/rules/` was missing.
