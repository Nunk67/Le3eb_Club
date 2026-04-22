---
name: versioning-snapshot-control
description: Creates traceable version snapshots with changed files, validation results, and rollback notes. Use when recording meaningful implementation changes, preparing checkpoints, or planning rollback-safe releases, including requests like 版本快照, 变更记录, or 回滚方案.
---

# Versioning and Snapshot Control

## Goal
Create traceable snapshots for architecture and implementation changes.

## Responsibilities
- assign version identifiers
- describe changed files
- record validation results
- record rollback notes
- maintain stable checkpoints

## Output
- snapshot record
- version tag suggestion
- rollback guidance

## Rule
Every meaningful change should be attributable to a version.
