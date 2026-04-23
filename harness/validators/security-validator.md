# Security Validator

## Checkpoints

- sensitive flow is backend-authoritative
- transaction logic is not trusted on the client
- sensitive data is not exposed unnecessarily
- writes are validated
- auth and permissions are enforced
- settlement write/rebuild operations are traceable and auditable
- score event replay and recalculation keep idempotency keys and rollback path
- no privileged bypass for algorithm-gated release progression

## Failure rule

Security failures must be resolved before any release or milestone completion.
Any auditability/idempotency failure in settlement flow blocks the algorithm gate.
