# Implementation status (migrated from harness)

| Mk | Theme | Status | Primary evidence in repo |
|----|--------|--------|---------------------------|
| **M0** | Governance & harness | **Closed** | `version-control/`, gate scripts, CI |
| **M1** | System blueprint | **Closed** | `version-control/governance/commands/architecture-blueprint.md` |
| **M2** | Data & backend foundation | **Closed** | `version-control/governance/commands/milestones.md` (`M2 closure record (inline)`), `backend/server.ts` (schema/migration/load-sanitize-persist), `backend/data/storage.json` (`schemaVersion`), `shared/types.ts` |
| **M3** | 政策 | **Closed** | `version-control/governance/commands/milestones.md` (`M3 closure record (inline)`), `scripts/validate-policy-cost.mjs`, `npm run validate:gate -- --stage=M3` |
| **M4** | Transactions & wallet | **Closed** | `version-control/governance/commands/milestones.md` (`M4 transaction and wallet closure record`), `backend/server.ts`, `shared/types.ts`, `client/services/businessApi.ts`, `npm run validate:gate -- --stage=M4` |
| **M5** | 陪玩等级 & settlement | **Closed** | `version-control/governance/commands/milestones.md` (`M5 companion level and settlement closure record`), `scripts/validate-companion-level.mjs`, `version-control/governance/commands/validate-companion-level.md`, `version-control/governance/rules/algorithm-rules.mdc`, `npm run validate:gate -- --stage=M5` |
| **M6** | Exposure / ranking | **Closed** | `version-control/governance/commands/milestones.md` (`M6 exposure and ranking closure record`), `backend/server.ts` (`/api/companions/rankings`), `client/services/businessApi.ts` (`listCompanionRankings`), `client/App.tsx` (ranking UI), `npm run validate:gate -- --stage=M6` |
| **M7** | Client presentation | **Partial** | `version-control/governance/commands/milestones.md` (`M7 client integration audit stub`), `client/i18n/`, `client/main.tsx`, `client/App.tsx` (phase-A + key surfaces), `admin/AdminWorkbench.tsx` (M8 prep anchor only), `npm run validate:gate -- --stage=M7`. Remaining client copy work is tracked under M8 (`P6-2b`). |
| **M8** | Admin operations depth | **Partial** | `version-control/governance/commands/milestones.md` (`M8 admin operations audit stub`), admin workbench + admin APIs, **M8 carryover** client i18n completion (`P6-2b`), admin i18n (`P6-3`), `P6-4` error-code migration, `npm run validate:gate -- --stage=M8` |
| **M9** | Integration | **Partial** | `version-control/governance/commands/milestones.md` (`M9 full-system integration audit stub`), monolith integration, `npm run validate:gate -- --stage=M9` |
| **M10** | Release hardening | **Partial** | `version-control/governance/commands/milestones.md` (`M10 release hardening audit stub`), CI + stage gate, `npm run validate:gate -- --stage=M10` |

Run `npm run validate:gate -- --stage=Mk` for stage checks and `npm run validate:all` for CI parity.
