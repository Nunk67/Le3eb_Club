# Architecture Blueprint (M1)

## Runtime and delivery

- Backend runtime: Node.js + Express monolith in `backend/server.ts`
- Frontend runtime: Vite + React (player `client/`, admin `admin/`)
- Shared contract layer: `shared/` (types + api helpers)
- Local persistence: `backend/data/storage.json` with schema migration on startup

## Module boundaries

- **auth**: register/login/session/logout and token session lifecycle
- **user**: profile/account state and user-facing aggregates
- **companion**: companion application, availability, service metadata
- **order**: order creation and state transitions
- **review**: review create/list/moderation paths
- **admin**: RBAC-protected operations, reports, audits, finance/risk views

## Data model (high-level)

- Single persisted state document keyed by `schemaVersion`
- Core collections: users, sessions, companions, orders, reviews
- Financial collections: wallets, walletTransactions, rechargeOrders, withdrawalRequests
- Governance collections: riskEvents, auditLogs, moderationReports

## Order state model

- Lifecycle: `CREATED -> ACCEPTED -> IN_SERVICE -> COMPLETED`
- Alternate terminal/exception states: `CANCELLED`, `DISPUTED`
- Transition validation and side-effects are server-authoritative

## RBAC model

- Roles: `USER`, `PLAYER`, `ADMIN`
- Admin templates: `SUPER_ADMIN`, `FINANCE_ADMIN`, `RISK_ADMIN`, `CONTENT_ADMIN`
- Permission-gated admin routes enforce write boundaries

## API conventions

- JSON over HTTP under `/api/*`
- Auth-required routes use bearer token middleware
- Admin mutation routes require explicit permission checks
- Validation gates verify policy/algorithm/version alignment before promotion
