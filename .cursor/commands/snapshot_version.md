# Command: snapshot_version

## Purpose
Create a version checkpoint.

## Required record

- version tag
- timestamp
- modified files
- reason for change
- validation result
- rollback note

## Rule

Do not create a snapshot without a clear change summary.
