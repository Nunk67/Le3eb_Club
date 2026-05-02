# Milestone plan (migrated from harness)

## Goal

Build a convergent, verifiable, and scalable system through strictly ordered milestones.

## Execution rule

`M0 -> M1 -> M2 -> M3 -> M4 -> M5 -> M6 -> M7 -> M8 -> M9 -> M10`

No parallel progression across milestones unless the current milestone is validated and recorded.

## Harness tags / version mapping

| Milestone | Tag | Product version |
|-----------|-----|-----------------|
| M0 | `v0.1.0` | `0.1.0` |
| M1 | `v0.2.0` | `0.2.0` |
| M2 | `v0.3.0` | `0.3.0` |
| M3 | `v0.4.0` | `0.4.0` |
| M4 | `v0.5.0` | `0.5.0` |
| M5 | `v0.6.0` | `0.6.0` |
| M6 | `v0.7.0` | `0.7.0` |
| M7 | `v0.8.0` | `0.8.0` |
| M8 | `v0.9.0` | `0.9.0` |
| M9 | `v0.10.0` | `0.10.0` |
| M10 | `v1.0.0` | `1.0.0` |

## Milestone focus summary

- **M0** governance and gates
- **M1** architecture blueprint
- **M2** data/backend foundation
- **M3** policy/economic rules
- **M4** transaction + wallet closure
- **M5** companion level settlement
- **M6** exposure/ranking system
- **M7** client-facing integration
- **M8** admin operations system
- **M9** full-system integration and doc gates
- **M10** release hardening

## M1 closure template (System blueprint)

### Objective

Define the complete system architecture before feature expansion and keep boundaries auditable.

### Scope

- System runtime and delivery model
- Module boundaries (auth/user/companion/order/review/admin)
- High-level data model
- Core order state model
- RBAC model and API conventions

### Deliverables

- Architecture blueprint: `version-control/governance/commands/architecture-blueprint.md`
- Boundary evidence in code paths:
  - `backend/server.ts`
  - `client/main.tsx`
  - `admin/AdminWorkbench.tsx`
  - `shared/`
- M1 status row updated in `version-control/governance/commands/implementation-status.md`

### Acceptance criteria

- Core flows and boundaries are explicitly documented
- Runtime/data/API conventions are internally consistent
- M1 gate command passes:
  - `npm run validate:gate -- --stage=M1`

### Evidence checklist

- [ ] Architecture blueprint exists and is current
- [ ] Module boundary section names match implemented domains
- [ ] M1 status row reflects current closure decision
- [ ] Stage gate output for `--stage=M1` is green

## M2 closure template (Data and backend foundation)

### Objective

Establish persistent data foundations and backend runtime invariants so higher-stage features can build on stable storage, migration, and validation behavior.

### Scope

- Persisted state model and schema version ownership
- Startup data load, migration, sanitize, and fallback behavior
- Backend runtime baseline for core domain APIs and auth/session state
- Shared contract usage between backend and clients

### Deliverables

- Data/backend evidence in code paths:
  - this file (`M2 closure record (inline)`)
  - `backend/server.ts`
  - `backend/data/storage.json`
  - `shared/types.ts`
  - `shared/apiClient.ts`
- Stage gate proof:
  - `npm run validate:gate -- --stage=M2`
- M2 status row updated in `version-control/governance/commands/implementation-status.md`

### Acceptance criteria

- Storage schema versioning is explicit and migration flow is deterministic
- Runtime load/sanitize/persist behavior is implemented and auditable
- Backend foundation remains type-safe under `tsc --noEmit`
- M2 gate command passes:
  - `npm run validate:gate -- --stage=M2`

### Evidence checklist

- [ ] `backend/data/storage.json` contains `schemaVersion`
- [ ] `backend/server.ts` defines schema baseline and migration path
- [ ] State load + sanitize + persist flow is implemented
- [ ] M2 status row reflects current closure decision
- [ ] Stage gate output for `--stage=M2` is green

### M2 closure record (inline)

- **Target**: `M2` (`0.3.0`)
- **Scope closure**:
  - Persistent storage uses `backend/data/storage.json` with explicit `schemaVersion`.
  - Startup pipeline in `backend/server.ts` covers load -> migrate -> sanitize -> persist fallback.
  - Backend baseline APIs and auth/session state run in the monolith runtime.
  - Shared contracts are centralized in `shared/types.ts`.
- **Validation result**:
  - Command: `npm run validate:gate -- --stage=M2`
  - Result: `passed`
- **Closure decision**:
  - `M2` is considered **Closed** with current evidence and validation output.

## M3 closure template (Policy and economic rules)

### Objective

Establish auditable policy/economic rule governance and ensure rule definitions, validation scripts, and runtime evidence remain consistent before transaction-level closure stages.

### Scope

- Policy cost definition and mapping governance
- Algorithm-policy validation integration in stage gate
- Cross-doc consistency between rules, commands, and system validators
- Runtime evidence anchors for economic behavior paths

### Deliverables

- Policy/economic closure record:
  - this file (`M3 closure record (inline)`)
- Policy/algorithm governance evidence:
  - `scripts/validate-policy-cost.mjs`
  - `version-control/governance/commands/validate-policy-cost.md`
  - `version-control/governance/rules/algorithm-rules.mdc` (policy-cost sections; replaces legacy split policy-cost rule files)
- Runtime evidence anchors:
  - `backend/server.ts`
- Stage gate proof:
  - `npm run validate:gate -- --stage=M3`
- M3 status row updated in `version-control/governance/commands/implementation-status.md`

### Acceptance criteria

- Policy rules and mappings are explicit and internally consistent
- Validation scripts and governance docs stay in sync
- M3 stage checks pass with no type errors
- M3 gate command passes:
  - `npm run validate:gate -- --stage=M3`

### Evidence checklist

- [ ] this file includes an up-to-date `M3 closure record (inline)` section
- [ ] policy-cost validator and policy rule/mapping docs are mutually consistent
- [ ] runtime economic behavior anchors are documented
- [ ] M3 status row reflects closure decision
- [ ] stage gate output for `--stage=M3` is green

### M3 closure record (inline)

- **Target**: `M3` (`0.4.0`)
- **Scope closure**:
  - Policy-cost rules and mapping artifacts are defined and versioned in `version-control/governance/rules/`.
  - Policy governance validation is active in `scripts/validate-policy-cost.mjs`.
  - Stage gate integrates policy checks before higher stages.
  - Runtime economic behavior anchor paths are documented.
- **Validation result**:
  - Command: `npm run validate:gate -- --stage=M3`
  - Result: `passed`
- **Closure decision**:
  - `M3` is considered **Closed** with governance evidence and stage gate output.

## Phase audit framework (M4-M10)

Use this structure for every remaining milestone closure record under `version-control/governance/commands/`:

- **Current status**: `Not started` / `Partial` / `Closed`
- **Primary evidence**: code paths + rule/command docs + scripts
- **Gate proof**: required gate command and latest result
- **Closure decision**: go/no-go with risk notes

Required per-phase closure steps:

1. implement or update target phase capabilities
2. run `npm run verify:version`
3. run `npm run validate:gate -- --stage=Mk`
4. update phase closure section in this file (`M4-M10 audit stubs`)
5. update `version-control/governance/commands/implementation-status.md`
6. update `version-control/changelog.md`
7. append audit summary to `version-control/context-control.md`

## M4-M10 audit stubs (inline)

### M4 transaction and wallet closure record

- **Milestone**: `M4` (`0.5.0`)
- **Current status**: `Closed`
- **Primary evidence**:
  - `backend/server.ts` (order/wallet flows)
  - `shared/types.ts` (transaction and wallet contracts)
  - `client/services/businessApi.ts`
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M4`
  - Latest result: `passed`
- **Closure decision**:
  - Decision: `Closed`
  - Risks/notes: M4 closure is limited to transaction and wallet baseline in current monolith scope; deeper finance governance remains tracked in M8+ admin depth.

### M5 companion level and settlement closure record

- **Milestone**: `M5` (`0.6.0`)
- **Current status**: `Closed`
- **Primary evidence**:
  - `scripts/validate-companion-level.mjs`
  - `version-control/governance/commands/validate-companion-level.md`
  - `version-control/governance/rules/algorithm-rules.mdc` (companion-level sections; replaces legacy split companion-level rule files)
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M5`
  - Latest result: `passed`
- **Closure decision**:
  - Decision: `Closed`
  - Risks/notes: M5 closure confirms governance and gate integrity for companion-level settlement; ranking/exposure expansion remains in M6 scope.

### M6 exposure and ranking closure record

- **Milestone**: `M6` (`0.7.0`)
- **Current status**: `Closed`
- **Primary evidence**:
  - `backend/server.ts` (`/api/companions/rankings` composite ranking endpoint with `scoreBreakdown` + `poolTag`)
  - `client/services/businessApi.ts` (`listCompanionRankings` API method + ranking contract)
  - `client/App.tsx` (ME page ranking card, sort toggles, Top10 modal, score formula + breakdown display)
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M6`
  - Latest result: `passed`
- **Closure decision**:
  - Decision: `Closed`
  - Risks/notes: M6 closure covers business-facing ranking delivery and explainable scoring; deeper admin inspection and cross-domain ranking governance continue in M8+.

### M7 client integration audit stub

- **Milestone**: `M7` (`0.8.0`)
- **Current status**: `Partial`
- **Primary evidence**:
  - `client/i18n/` (`I18nProvider.tsx`, `locale.ts`, `messages.ts`)
  - `client/main.tsx` (`I18nProvider` app-shell wrapper)
  - `client/App.tsx` (M7 phase-A language switch, ranking card i18n, Arabic RTL via provider `dir`)
  - `admin/AdminWorkbench.tsx` (M8 admin-localization prep anchor only; not counted as M7 closure)
  - `shared/`
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M7`
  - Latest result: `passed` (`react-example@0.8.0`)
- **Closure decision**:
  - Decision: `Not closed`
  - Risks/notes: M7 covers client phase-A foundation and the key-surface i18n delivered under `0.8.0` (settings, ranking, ME-adjacent copy, bottom nav labels, apply wizard, order confirm). **All remaining client-visible copy and polish previously tracked as M7 follow-up**—HOME feed headings, auth flows, apply promotion type labels, IM/community strings, and optional FR/TR dictionary polish—are **explicitly deferred to M8** (`P6-2b` backlog) so M7 closure can be decided on foundation + delivered surfaces only. Admin localization remains `P6-3 / M8` only.

### M8 admin operations audit stub

- **Milestone**: `M8` (`0.9.0`)
- **Current status**: `Partial`
- **Primary evidence**:
  - `admin/AdminWorkbench.tsx`
  - `admin/services/adminApi.ts`
  - `backend/server.ts` (admin operation paths)
  - `client/App.tsx` + `client/i18n/messages.ts` (**M8 carryover**: complete remaining client dictionary keys and screens listed under `P6-2b` in the i18n rollout below)
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M8`
  - Latest result: `passed` (`react-example@0.8.1`)
- **Closure decision**:
  - Decision: `Not closed`
  - Risks/notes: M8 scope includes admin operations depth **and** deferred client i18n completion (`P6-2b`) plus admin localization (`P6-3`) and backend error-code-first migration (`P6-4`) per phase plan. **Wrap-up update completed**: remaining companion/review/admin legacy backend error-string responses were moved to `sendError(...)`; admin run-operation labels and error fallbacks are key-based (`admin.ops.*`, `admin.status.*`); additional client edge-copy around profile follow/ID/follower text and no-post state is now dictionary-driven. Production-readiness pass removed prefilled admin credentials and added empty-state polish for core admin tables. Remaining M8 gaps are broader admin table/forms full-surface localization and optional non-critical client copy polish.

### M9 full-system integration audit stub

- **Milestone**: `M9` (`0.10.0`)
- **Current status**: `Partial`
- **Primary evidence**:
  - `backend/server.ts` (system integration runtime; business wallet/recharge auth-boundary parity for `/api/recharge/create`, `/api/recharge/verify`, `/api/wallet/balance`, `/api/wallet/transactions`)
  - `client/services/businessApi.ts` (shared request boundary expanded with typed wallet/recharge methods)
  - `client/App.tsx` (wallet/recharge flow switched from ad-hoc fetch to token-based `businessApi` paths)
  - `version-control/governance/rules/validator-system.mdc` (full-system gate matrix and validator policy; replaces legacy split validator markdown files)
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M9`
  - Latest result: `passed` (`react-example@0.8.1`)
- **Closure decision**:
  - Decision: `Not closed`
  - Risks/notes: M9 kickoff round-1 baseline is established with a green gate snapshot and first integration hardening pass completed (business auth boundary consistency on wallet/recharge). Production-readiness pass added business withdrawal request integration and admin-only chargeback handling. Remaining integration gaps focus on deeper cross-domain scenario evidence beyond static gate checks.

### M10 release hardening audit stub

- **Milestone**: `M10` (`1.0.0`)
- **Current status**: `Partial`
- **Primary evidence**:
  - `.github/workflows/ci.yml` (full-system CI gate + release-integrity parity step)
  - `scripts/validate-gate.mjs` (M10 stage gate orchestration includes `validate:release-integrity`)
  - `scripts/validate-release-integrity.mjs` (build artifact integrity assertions for `dist/`)
  - `version-control/scripts/verify-version.mjs` (version consistency guardrail)
  - `version-control/version` + `package.json` + `client/constants.ts` (SemVer unified at `1.0.0`)
  - `version-control/changelog.md` + `version-control/governance/commands/implementation-status.md` (closure evidence trace)
  - `.env.example` + `README.md` (production bootstrap, port, seed, and storage limitations)
- **Gate proof**:
  - Required command: `npm run validate:gate -- --stage=M10`
  - Latest result: `passed` (`react-example@1.0.0`)
- **Closure decision**:
  - Decision: `Not closed`
  - Risks/notes: M10 hardening baseline and release-version verification are complete. Production-readiness pass addressed template branding, stale lockfile duplication, password-hash migration, production seed pruning, env-driven admin bootstrap, production static path discovery, and chargeback authorization. Final closure remains deferred until verification rerun and predecessor milestones (`M7`/`M8`/`M9`) are reconciled to satisfy the strict sequential milestone rule.

## i18n rollout (phase plan)

- **P6-1 / M7** phase-A: `ar / zh-CN / en / fr / ru / tr`, locale switch
- **P6-2 / M7** phase-A+: RTL readiness and Arabic layout usability (foundation + high-traffic surfaces delivered under M7; **no further M7-only i18n expansion required** for gate purposes unless product reopens M7 scope)
- **P6-2b / M8** client completion: HOME/auth/apply-promotion/IM-community strings and non-`ar` locale polish (e.g. FR/TR accents), using the same `MessageKey` + `t()` pattern
- **P6-3 / M8** phase-B: admin localization
- **P6-4 / M8** phase-B: backend error-code-first migration
- **P6-5 / M9-M10** phase-C: `validate:i18n` in integration/release gates

## Product backlog anchor IDs

- **P1** policy foundation (M3)
- **P2** wallet/order closure (M4)
- **P3** companion level (M5)
- **P4** exposure ranking (M6)
- **P5** admin operations (M8)
- **P6** multilingual architecture rollout (M7–M10)

## Validation checklist

- Policy numbers match policy doc
- Level thresholds and decay match companion-level doc
- Ranking rules match exposure doc
- Admin capabilities match ops doc
- `npm run validate:gate -- --stage=M*` passes for claimed stage
