/**
 * Postgres migration is intentionally deferred until DATABASE_URL points to a real instance.
 * Run: STORAGE_BACKEND=postgres pnpm db:import-json
 */
import { loadEnv } from '../backend/config/env.js';

const env = loadEnv();
if (!env.DATABASE_URL) {
  console.error('migrate-json-to-pg: skipped (no DATABASE_URL). JSON storage remains active.');
  process.exit(0);
}
console.error('migrate-json-to-pg: DATABASE_URL is set but Prisma import is not enabled in this build.');
process.exit(1);
