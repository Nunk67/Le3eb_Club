# Repository layer

`IWalletRepo` / Prisma implementations are **deferred** until `DATABASE_URL` points to a real Postgres instance.

Runtime continues to use `backend/data/storage.json` (schema v11). Use `scripts/migrate-json-to-pg.ts` only after Postgres is provisioned.
