# Changelog

Notable product-facing and governance changes. **Canonical numeric SemVer** is `version-control/version`; keep `package.json` `version` in sync. Milestone -> version mapping and bump discipline: [`version-control/governance/rules/version-control.mdc`](governance/rules/version-control.mdc). Changelog entries should describe push-bound changes only. After each version iteration, append newly added changes under `Unreleased` using the existing entry format.

## [Unreleased]

### [2026-05-02 00:45:00 LOCAL] [0.8.1] M8 wrap-up: backend error-code closure, admin operation-label i18n, and client edge-copy keying.

- Completed remaining legacy backend error-string migration in `backend/server.ts` by routing companion/review/admin operation branches to `sendError(...)` with stable `error.code` values.
- Finalized `admin/AdminWorkbench.tsx` operation labels and status fallbacks through i18n keys; added `admin.ops.*` dictionary entries in `client/i18n/messages.ts`.
- Keyed additional user-visible edge copy in `client/App.tsx` (`follow/following`, profile `ID` prefix, followers/following labels, and no-posts state) using existing message keys.
- Re-validated with `npm run lint`, `npm run validate:i18n`, and `npm run validate:gate -- M8` (all passed on `react-example@0.8.1`).

### [2026-05-02 00:10:00 LOCAL] [0.8.1] M8 round-2: IM/community i18n, admin status-key mapping, and recharge/admin error-code expansion.

- Extended `client/i18n/messages.ts` with `search.*`, `community.*`, `category.*`, `im.*`, and `contacts.*` keys; localized IM/community/contact/search surfaces in `client/App.tsx` via `t(...)`.
- Unified `admin/AdminWorkbench.tsx` status feedback by mapping operation labels and key status branches to `admin.status.*` dictionary keys, including run-complete template output.
- Expanded `backend/server.ts` error-code-first adoption across recharge/wallet/admin operation routes (`sendError` with `error.code/message/details` + `legacyError`) while keeping `shared/apiClient.ts` compatibility parser intact.
- Re-validated with `npm run lint`, `npm run validate:i18n`, and `npm run validate:gate -- --stage=M8` (all passed on `react-example@0.8.1`).

### [2026-05-01 23:35:00 LOCAL] [0.8.1] M8 round-1 baseline: client/auth shell i18n, admin shell i18n, and auth/order error-code compatibility.

- Extended `client/i18n/messages.ts` with `home.*`, `auth.*`, and `admin.*` keys; migrated client HOME high-visibility labels and auth flow text in `client/App.tsx` to `t(...)`.
- Wired `admin/AdminWorkbench.tsx` to `useI18n` and localized login/nav shell surfaces (login card, sidebar nav labels, header shell actions/status copy) without changing admin business operations logic.
- Added backend error helper in `backend/server.ts` and migrated auth/order critical error paths to `error: { code, message, details? }` with `legacyError`; updated `shared/apiClient.ts` to parse `error.code -> error.message -> legacy/top-level fallbacks`.
- Re-validated with `npm run lint`, `npm run validate:i18n`, and `npm run validate:gate -- --stage=M8` (all passed on `react-example@0.8.1`).

### [2026-05-01 15:05:00 LOCAL] [0.8.0] Restart M7 with client phase-A i18n foundation and gate-backed evidence refresh.

- Promoted product SemVer to `0.8.0` in `version-control/version` and `package.json` to align with M7 mapping.
- Added `client/i18n/` foundation (`I18nProvider`, locale normalization, message dictionaries for `ar`/`zh-CN`/`en`/`fr`/`ru`/`tr`) and wired app shell through `client/main.tsx`.
- Updated `client/App.tsx` key surfaces for M7 phase-A (language switch settings, ranking card labels/messages) and enabled Arabic RTL via provider-managed document direction.
- Refreshed M7 governance evidence in `version-control/governance/commands/milestones.md` and `version-control/governance/commands/implementation-status.md`; `npm run validate:gate -- --stage=M7` passed.

### [2026-05-01 16:00:00 LOCAL] [0.8.0] Client M7 phase-A: bottom nav labels, apply wizard, and order confirm i18n.

- Extended `client/i18n/messages.ts` with `nav.*`, `apply.*`, and `order.*` keys (Arabic overrides where needed); bottom navigation shows icon plus short translated label.
- Localized apply flow copy (pending screen, steps 1–4, promo limit row, category/details, footers) and order confirmation (totals, price summary, coupon modal, Pay & Start) in `client/App.tsx` via `t(...)`.
- Kept product version at `0.8.0`; `client/constants.ts` `PRODUCT_SEMVER` remains aligned with `version-control/version`.

### [2026-05-01 17:00:00 LOCAL] [0.8.0] Governance: move remaining client i18n follow-up from M7 to M8.

- Added `P6-2b / M8` (HOME, auth, apply promotion labels, IM/community, optional FR/TR polish) to the i18n phase plan; M7 stub notes now defer that backlog to M8 alongside `P6-3`/`P6-4`.
- Expanded M8 audit stub primary evidence and notes; refreshed M7/M8 rows in `version-control/governance/commands/implementation-status.md`.

### [2026-05-01 03:20:00 LOCAL] [0.7.0] Close M6 exposure/ranking with explainable API and business-facing ranking UI.

- Promoted product SemVer to `0.7.0` in `version-control/version` and `package.json` to match the M6 milestone mapping.
- Completed M6 ranking delivery across backend + client: explainable ranking API (`poolTag`, `scoreBreakdown`), ranking contract updates, and ME-page Top10 ranking UI with sort toggles and formula/breakdown display.
- Updated M6 governance closure records in `version-control/governance/commands/milestones.md` and `version-control/governance/commands/implementation-status.md`, then re-validated with `npm run validate:gate -- --stage=M6`.

### [2026-05-01 03:12:00 LOCAL] [0.6.1] Advance M6 ranking baseline with explainable score fields.

- Upgraded `GET /api/companions/rankings` to return exposure/ranking evidence fields (`poolTag`, `scoreBreakdown`) alongside the composite score.
- Updated `client/services/businessApi.ts` ranking contract to include explainable ranking payload types for next-step client presentation.
- Refreshed M6 governance evidence in `version-control/governance/commands/milestones.md` with a passed stage-gate snapshot.

### [2026-05-01 02:50:00 LOCAL] [0.6.1] Shift exposure terminology from forbidden to planned M6 development.

- Updated `scripts/validate-companion-level.mjs` to stop blocking exposure-related vocabulary in M5 gate checks while keeping ALG baseline checks intact.
- Updated `version-control/governance/rules/algorithm-rules.mdc` and `version-control/governance/commands/validate-companion-level.md` to state that exposure pool/weight belongs to M6 governed implementation scope.
- Added explicit M6 exposure pool + ranking development plan to `version-control/governance/commands/milestones.md` with closure acceptance criteria.

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
- **`version-control/scripts/verify-version.mjs`** ??asserts `version-control/version` matches `package.json` (also runs at start of `validate:gate`).
- **[`implementation-status.md`](governance/commands/implementation-status.md)** (code vs milestones audit) and **[`development-principles.mdc`](governance/rules/development-principles.mdc)**.
- **Global principles** ([`milestones.md`](governance/commands/milestones.md)): *Shallow surfaces* ??minimize dependency graphs, interface stacks, component nesting, and indirect call depth.

### Changed

- Restored governance sources under **`version-control/governance/commands/*.md`** + **`version-control/governance/rules/*.mdc`** (policy-cost, companion-level, validators) so `validate:policy` / `validate:alg` and full-system CI gates pass.
- **Single source for versioning**: narrative points to [`version-control.mdc`](governance/rules/version-control.mdc).
- **Blueprint location**: canonical architecture blueprint is [`architecture-blueprint.md`](governance/commands/architecture-blueprint.md).
- [`version-control.mdc`](governance/rules/version-control.mdc) bump checklist: includes **`verify:version`** and auto-bump workflow.
- Context log timestamp convention uses local machine time (`### [YYYY-MM-DD HH:MM:SS LOCAL]`) as documented in `context-control.md`.
- **Earlier in 0.1.0 cycle (2026-04-25)**: product SemVer aligned to **`0.1.0`** / **M0** **`v0.1.0`**; `.gitignore` for context log basename; root cleanup (`find_*.js`, `metadata.json`).

### Fixed

- Full-system CI gate could fail when validator markdown under `version-control/governance/rules/` was missing.
