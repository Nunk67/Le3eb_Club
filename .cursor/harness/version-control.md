# Version Control Policy

## Purpose

Keep the project stable while allowing controlled evolution.

## Versioning rule

Use semantic versioning for the harness and milestone snapshots:

- `v0.x` — architecture still changing
- `v1.x` — core structure stabilized
- patch changes for non-breaking refinements

## Snapshot policy

Create a version snapshot after:

- completing a major command
- finishing a milestone
- changing architecture rules
- changing security policy
- changing context-control format

## Snapshot record format

Each snapshot must include:

- version number
- timestamp
- changed files
- why it changed
- risk assessment
- rollback note

## Rollback rule

If validation fails after a snapshot:

1. revert the last snapshot
2. restore the last stable milestone
3. re-run validators
4. update context-control.md
