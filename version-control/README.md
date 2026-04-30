# Version control bundle

All version and gate governance for this repository live under this directory.

| Path | Role |
|------|------|
| `version` | Canonical numeric SemVer (must match `package.json` `version`) |
| `changelog.md` | Product/governance changelog (push-bound entries) |
| `governance/commands/` | Milestones, policy/ALG command specs, implementation status |
| `governance/rules/` | Machine- and human-readable rules consumed by `validate:gate` and companion scripts |
| `scripts/` | `verify-version`, `auto-version-bump`, `safe-push` |
| `hooks/after-file-edit-version-sync.mjs` | Optional Cursor hook target (see local `.cursor/hooks.json` if used) |

Gate scripts in `scripts/` at repo root read paths under `version-control/governance/`. CI runs `pnpm run validate:gate -- --profile=full-system` after `verify:version`.
