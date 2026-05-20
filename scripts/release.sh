#!/usr/bin/env sh
set -eu
VERSION="${1:?usage: release.sh <version>}"
echo "release $VERSION (local/staging — configure registry + SSH for production)"
git tag "$VERSION"
docker build -t "le3eb:${VERSION}" .
echo "built le3eb:${VERSION}; run scripts/smoke.sh after deploy"
