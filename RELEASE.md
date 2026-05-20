# Release checklist

1. `pnpm validate` and `pnpm test`
2. `pnpm build`
3. Deploy canary (10% → 50% → 100%)
4. `pnpm test:smoke` against production URL
5. Monitor `/metrics` and Sentry for 30 minutes
