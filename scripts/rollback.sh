#!/usr/bin/env sh
set -eu
PREV="${1:?usage: rollback.sh <previous-version>}"
echo "rollback to le3eb:${PREV}"
docker tag "le3eb:${PREV}" le3eb:current
echo "tagged le3eb:current; restart compose stack on target host"
sh scripts/smoke.sh
