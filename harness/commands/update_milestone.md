# Command: update_milestone

## Purpose
Advance or update milestone state.

## Required content

- milestone name
- status
- acceptance criteria
- blockers
- next action
- related version tag
- companion algorithm verification result (`ALG-01` ... `ALG-08`)
- policy cost verification result (`POL-01` ... `POL-05`)
- validation evidence location (report/log path)

## Rule

No milestone may be marked complete unless validators passed.
No milestone may be marked complete when any `ALG-*` or `POL-*` check is missing or failed.
