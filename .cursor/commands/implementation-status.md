# Implementation status (migrated from harness)

| Mk | Theme | Status | Primary evidence in repo |
|----|--------|--------|---------------------------|
| **M0** | Governance & harness | **Closed** | `version-control/`, gate scripts, CI |
| **M1** | System blueprint | **Closed** | `.cursor/commands/architecture-blueprint.md`, `.cursor/agents/system-architecture-agent.md` |
| **M2** | Data & backend foundation | **Closed** | `.cursor/commands/data-backend-foundation.md`, `backend/server.ts` (schema/migration/load-sanitize-persist), `backend/data/storage.json` (`schemaVersion`), `shared/types.ts` |
| **M3** | 政策 | **Partial** | `scripts/validate-policy-cost.mjs` |
| **M4** | Transactions & wallet | **Partial** | order/wallet flows in `backend/server.ts` |
| **M5** | 陪玩等级 & settlement | **Partial** | `scripts/validate-companion-level.mjs` |
| **M6** | Exposure / ranking | **Not started / early** | TBD |
| **M7** | Client presentation | **Partial** | `client/`, `admin/`, `shared/` |
| **M8** | Admin operations depth | **Partial** | admin workbench + admin APIs |
| **M9** | Integration | **Partial** | monolith integration |
| **M10** | Release hardening | **Partial** | CI + stage gate |

Run `npm run validate:gate -- --stage=Mk` for stage checks and `npm run validate:all` for CI parity.
