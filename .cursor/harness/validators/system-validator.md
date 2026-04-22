# System Validator

## Checkpoints

- architecture matches current phase
- dependencies remain minimal and explicit
- contracts are consistent
- no invalid shortcuts were introduced

## Failure rule

If any checkpoint fails:

1. block progression
2. identify broken module
3. trigger corresponding skill or agent
4. rerun validation
