# LE3EB Club Runbook

## Health

- Liveness: `GET /healthz`
- Readiness: `GET /ready` (Postgres + Redis + S3 when configured)
- Metrics: `GET /metrics`

## Alerts (suggested)

- Recharge failure rate > 5% / 5min
- HTTP 5xx > 1% / 5min
- Withdraw pending > 30min
- DB replication lag > 10s
- `/ready` fails 3 times in a row

## Settlement

- Cron: Monday 04:00 `Asia/Riyadh`
- Lock key: `settlement_lock:<isoWeek>`

## Rollback

Use `scripts/rollback.sh` after a failed deploy; restore previous image tag and run smoke.
