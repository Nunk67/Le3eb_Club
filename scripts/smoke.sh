#!/usr/bin/env sh
set -eu
BASE="${SMOKE_BASE_URL:-http://127.0.0.1:3000}"
START=$(date +%s)
fail=0

check() {
  path="$1"
  expect="${2:-200}"
  code=$(curl -fsS -o /tmp/smoke_body.json -w "%{http_code}" "$BASE$path" || echo "000")
  if [ "$code" != "$expect" ]; then
    echo "FAIL $path => $code"
    fail=$((fail + 1))
  else
    echo "ok $path"
  fi
}

check /healthz 200
check /ready 200
check /metrics 200
check /api/recharge/packages 200
check /api/companions/rankings?limit=3 200

END=$(date +%s)
DUR=$((END - START))
echo "smoke duration ${DUR}s"
if [ "$DUR" -gt 30 ]; then
  echo "WARN smoke exceeded 30s"
fi
exit "$fail"
