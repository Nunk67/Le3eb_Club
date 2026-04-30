# Full-System Gate Matrix (Rule)

Human-readable matrix for **full-system** profile checks (`pnpm run validate:gate -- --profile=full-system`). Automated scripts verify this file exists and contains the gate labels below.

## Domain gates

| Gate | Scope |
|------|--------|
| **Business Domain Gate** | User/companion/order/review/wallet flows in `backend/server.ts` + `client/` |
| **Admin Domain Gate** | Operator workbench + `/api` admin routes + audit trails |
| **Production Domain Gate** | Auth boundaries, session hygiene, persistence migrations — see `.cursor/harness/architecture.md` |

Technical scripts: `validate:policy`, `validate:alg`, `lint`, `build` (stage **M10**). Update this matrix when domain boundaries or CI expectations change.
