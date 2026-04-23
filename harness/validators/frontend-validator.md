# Frontend Validator

## Checkpoints

- preserve styles, components, interaction logic, and types
- remove demo-only flow where appropriate
- all service calls match contracts
- no unsafe mock business behavior remains
- companion scoring UI matches algorithm rules (`ALG-01` ... `ALG-08`)
- reply/accept rate unit is consistent across UI and logic (single ratio convention)
- no exposure-weight UI or field remains in active implementation

## Failure rule

If a check fails, stop the pipeline and correct the UI layer first.
Any mismatch against `ALG-*` blocks milestone completion and snapshot creation.
