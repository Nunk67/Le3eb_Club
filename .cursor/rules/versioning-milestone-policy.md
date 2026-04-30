# Versioning & Milestone Policy (Rule)

Canonical long-form policy: `.cursor/harness/version-control.md`.

Operational rule summary:

1. Keep one numeric SemVer across:
   - `version-control/version`
   - `package.json` version
   - `version-control/changelog.md` release sections
2. Milestone mapping:
   - M0 `0.1.0` ... M10 `1.0.0`
3. Do not skip milestone-derived versions.
4. `verify:version` and stage gates must pass before milestone closure.
5. Automatic bump workflow uses `npm run version:auto` with milestone baseline + PATCH policy.
