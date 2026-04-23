# System Validator

## Checkpoints

- architecture matches current phase
- dependencies remain minimal and explicit
- contracts are consistent
- no invalid shortcuts were introduced
- companion level algorithm gate is satisfied (`ALG-01` ... `ALG-08` in `harness/algorithm/companion-level/verification.md`)
- policy cost algorithm gate is satisfied (`POL-01` ... `POL-05` in `harness/algorithm/policy-cost/verification.md`)
- settlement cycle behavior is validated end-to-end (week boundary, maintenance, publish, defer, replay)
- milestone/snapshot commands include algorithm verification evidence
- full-system gate matrix requirements are aligned with current stage (`harness/validators/full-system-gate-matrix.md`)

## Failure rule

If any checkpoint fails:

1. block progression
2. identify broken module
3. trigger corresponding skill or agent
4. rerun validation

Do not allow milestone completion or version snapshot when any `ALG-*` or `POL-*` check fails.
