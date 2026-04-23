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
- companion algorithm gate result (`ALG-01` ... `ALG-08`)
- policy cost gate result (`POL-01` ... `POL-05`)
- failed check fallback note (what is blocked and why)

## Rule

Do not create a snapshot without a clear change summary.
Do not create a snapshot when any required `ALG-*` or `POL-*` verification is missing or failed.
