# Implementation status (migrated from harness)

| Mk | Theme | Status | Primary evidence in repo |
|----|--------|--------|---------------------------|
| **M0** | Governance & harness | **Closed** | `version-control/`, gate scripts, CI |
| **M1** | System blueprint | **Closed** | `.cursor/commands/architecture-blueprint.md`, `.cursor/agents/system-architecture-agent.md` |
| **M2** | Data & backend foundation | **Closed** | `.cursor/commands/milestones.md` (`M2 closure record (inline)`), `backend/server.ts` (schema/migration/load-sanitize-persist), `backend/data/storage.json` (`schemaVersion`), `shared/types.ts` |
| **M3** | 政策 | **Closed** | `.cursor/commands/milestones.md` (`M3 closure record (inline)`), `scripts/validate-policy-cost.mjs`, `npm run validate:gate -- --stage=M3` |
| **M4** | Transactions & wallet | **Closed** | `.cursor/commands/milestones.md` (`M4 transaction and wallet closure record`), `backend/server.ts`, `shared/types.ts`, `client/services/businessApi.ts`, `npm run validate:gate -- --stage=M4` |
| **M5** | 陪玩等级 & settlement | **Partial** | `.cursor/commands/milestones.md` (`M5 companion level and settlement audit stub`), `scripts/validate-companion-level.mjs`, `npm run validate:gate -- --stage=M5` |
| **M6** | Exposure / ranking | **Not started / early** | `.cursor/commands/milestones.md` (`M6 exposure and ranking audit stub`), `npm run validate:gate -- --stage=M6` |
| **M7** | Client presentation | **Partial** | `.cursor/commands/milestones.md` (`M7 client integration audit stub`), `client/`, `admin/`, `shared/`, `npm run validate:gate -- --stage=M7` |
| **M8** | Admin operations depth | **Partial** | `.cursor/commands/milestones.md` (`M8 admin operations audit stub`), admin workbench + admin APIs, `npm run validate:gate -- --stage=M8` |
| **M9** | Integration | **Partial** | `.cursor/commands/milestones.md` (`M9 full-system integration audit stub`), monolith integration, `npm run validate:gate -- --stage=M9` |
| **M10** | Release hardening | **Partial** | `.cursor/commands/milestones.md` (`M10 release hardening audit stub`), CI + stage gate, `npm run validate:gate -- --stage=M10` |

Run `npm run validate:gate -- --stage=Mk` for stage checks and `npm run validate:all` for CI parity.
