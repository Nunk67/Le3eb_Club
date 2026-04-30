# Changelog

Notable product-facing and governance changes. **Canonical numeric SemVer** is `version-control/version`; keep `package.json` `version` in sync. Milestone ↔ version mapping and bump discipline: [`.cursor/rules/version-control.md`](../.cursor/rules/version-control.md). Changelog entries should describe push-bound changes only.

## [Unreleased]

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

- **M0 harness closure**: `.cursor/rules/validator-full-system-gate-matrix.md` and `validator-system.md` for full-system static gate checks.
- **`version-control/scripts/verify-version.mjs`** — asserts `version-control/version` matches `package.json` (also runs at start of `validate:gate`).
- **[`.cursor/commands/implementation-status.md`](../.cursor/commands/implementation-status.md)** (code vs milestones audit) and **[`.cursor/rules/development-principles.md`](../.cursor/rules/development-principles.md)**.
- **Global principles** ([`milestones.md`](../.cursor/commands/milestones.md)): *Shallow surfaces* — minimize dependency graphs, interface stacks, component nesting, and indirect call depth.

### Changed

- Restored governance sources under **`.cursor/commands/*.md`** + **`.cursor/rules/*.md`** (policy-cost, companion-level, validators) so `validate:policy` / `validate:alg` and full-system CI gates pass.
- **Single source for versioning**: narrative points to [`.cursor/rules/version-control.md`](../.cursor/rules/version-control.md).
- **Blueprint location**: canonical architecture context is [`.cursor/agents/system-architecture-agent.md`](../.cursor/agents/system-architecture-agent.md).
- [`.cursor/rules/version-control.md`](../.cursor/rules/version-control.md) bump checklist: includes **`verify:version`** and auto-bump workflow.
- Context log timestamp convention uses local machine time (`### [YYYY-MM-DD HH:MM:SS LOCAL]`) as documented in `context-control.md`.
- **Earlier in 0.1.0 cycle (2026-04-25)**: product SemVer aligned to **`0.1.0`** / **M0** **`v0.1.0`**; `.gitignore` for context log basename; root cleanup (`find_*.js`, `metadata.json`).

### Fixed

- Full-system CI gate could fail when validator markdown under `.cursor/rules/` was missing.
