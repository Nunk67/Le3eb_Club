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

- Architecture blueprint: `.cursor/commands/architecture-blueprint.md`
- Boundary evidence in code paths:
  - `backend/server.ts`
  - `client/main.tsx`
  - `admin/AdminWorkbench.tsx`
  - `shared/`
- M1 status row updated in `.cursor/commands/implementation-status.md`

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
  - `.cursor/commands/data-backend-foundation.md`
  - `backend/server.ts`
  - `backend/data/storage.json`
  - `shared/types.ts`
  - `shared/apiClient.ts`
- Stage gate proof:
  - `npm run validate:gate -- --stage=M2`
- M2 status row updated in `.cursor/commands/implementation-status.md`

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

## i18n rollout (phase plan)

- **P6-1 / M7** phase-A: `ar / zh-CN / en / fr / ru / tr`, locale switch
- **P6-2 / M7** phase-A+: RTL readiness and Arabic layout usability
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
