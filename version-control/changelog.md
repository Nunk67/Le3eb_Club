# Changelog

Notable product-facing and governance changes. **Canonical numeric SemVer** is `version-control/version`; keep `package.json` `version` in sync. Milestone ↔ version mapping and bump discipline: [`.cursor/rules/version-control.mdc`](../.cursor/rules/version-control.mdc). Changelog entries should describe push-bound changes only.

## [Unreleased]

### [2026-05-01 00:34:00 LOCAL] [0.5.0] Closed M4 transaction and wallet milestone with synchronized version and gate evidence.

- Promoted product SemVer to `0.5.0` in `version-control/version` and `package.json` to match milestone mapping for M4.
- Replaced the M4 audit stub with a closure record in `.cursor/commands/milestones.md` and updated M4 status to `Closed` in `.cursor/commands/implementation-status.md`.
- Re-validated closure evidence with `npm run verify:version` and `npm run validate:gate -- --stage=M4`.

### [2026-05-01 12:00:00 LOCAL] [0.4.0] Point governance links at `.cursor/rules/*.mdc` (merged rules + validator).

- Updated root `README.md`, `.cursor/README.md`, `version-control/changelog.md`, and `.cursor/commands/milestones.md` deliverable paths to match canonical `.mdc` rules and merged validator content.

### [2026-04-30 22:45:00 LOCAL] [0.4.0] Closed M3 policy/economic foundation and initialized audit closure records for M4-M10.

- Added M3 closure template and phase audit framework to `.cursor/commands/milestones.md`, including required per-phase gate/evidence workflow.
- Added inline `M3 closure record` in `.cursor/commands/milestones.md` and marked M3 `Closed` in `.cursor/commands/implementation-status.md` with stage-gate evidence.
- Initialized closure record stubs for M4-M10 under `.cursor/commands/` to ensure each remaining phase has a dedicated audit trail entry point.
- Promoted product SemVer to `0.4.0` in `version-control/version` and `package.json`.
- Re-validated with `npm run validate:gate -- --stage=M3` and `npm run validate:gate -- --profile=full-system`.

### [2026-04-30 22:03:00 LOCAL] [0.3.0] Closed M2 data/backend foundation with auditable evidence and green stage gate.

- Closed M2 with explicit evidence path set (data schema, migration, load/sanitize/persist flow, shared contracts) and updated milestone status accordingly.
- Promoted product SemVer to `0.3.0` for milestone-aligned release discipline (`version-control/version` and `package.json` synced).
- Re-validated closure with `npm run validate:gate -- --stage=M2` and confirmed policy/algorithm/lint checks all passed.

### [2026-04-30 21:33:16 LOCAL] [0.2.0] Completed M1 blueprint closure with explicit deliverables and evidence links.

- Added M1 closure template and evidence checklist to `.cursor/commands/milestones.md`.
- Added canonical architecture blueprint file at `.cursor/commands/architecture-blueprint.md`.
- Updated M1 status to `Closed` in `.cursor/commands/implementation-status.md` and aligned architecture agent reference.
- Re-validated stage gate with `npm run validate:gate -- --stage=M1`.

### [2026-04-30 19:55:46 LOCAL] [0.1.3] Unified changelog/context write rules with timestamped versioned titles.

- Clarified write policy: follow previous entry format, use one-sentence title, and include local timestamp + current SemVer for each Unreleased write.
- Aligned governance wording so gate pass semantics, SemVer source-of-truth, and local-time context logging remain consistent across docs.
- Preserved push-bound changelog scope: local-only/ignored path edits do not require changelog entries.
## [0.1.0] - 2026-04-29

### Added

- **M0 harness closure**: `.cursor/rules/validator-system.mdc` (full-system static gate checks; supersedes legacy split validator markdown files).
- **`version-control/scripts/verify-version.mjs`** — asserts `version-control/version` matches `package.json` (also runs at start of `validate:gate`).
- **[`.cursor/commands/implementation-status.md`](../.cursor/commands/implementation-status.md)** (code vs milestones audit) and **[`.cursor/rules/development-principles.mdc`](../.cursor/rules/development-principles.mdc)**.
- **Global principles** ([`milestones.md`](../.cursor/commands/milestones.md)): *Shallow surfaces* — minimize dependency graphs, interface stacks, component nesting, and indirect call depth.

### Changed

- Restored governance sources under **`.cursor/commands/*.md`** + **`.cursor/rules/*.mdc`** (policy-cost, companion-level, validators) so `validate:policy` / `validate:alg` and full-system CI gates pass.
- **Single source for versioning**: narrative points to [`.cursor/rules/version-control.mdc`](../.cursor/rules/version-control.mdc).
- **Blueprint location**: canonical architecture context is [`.cursor/agents/system-architecture-agent.md`](../.cursor/agents/system-architecture-agent.md).
- [`.cursor/rules/version-control.mdc`](../.cursor/rules/version-control.mdc) bump checklist: includes **`verify:version`** and auto-bump workflow.
- Context log timestamp convention uses local machine time (`### [YYYY-MM-DD HH:MM:SS LOCAL]`) as documented in `context-control.md`.
- **Earlier in 0.1.0 cycle (2026-04-25)**: product SemVer aligned to **`0.1.0`** / **M0** **`v0.1.0`**; `.gitignore` for context log basename; root cleanup (`find_*.js`, `metadata.json`).

### Fixed

- Full-system CI gate could fail when validator markdown under `.cursor/rules/` was missing.
