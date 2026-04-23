# Full System Gate Matrix

## Purpose

Define delivery gates for building a complete companion community system, not only an algorithm-validated MVP.

## Domain Gates

### 1) Business Domain Gate

Required capabilities:

- user registration/login/session lifecycle
- companion onboarding/review/availability lifecycle
- order lifecycle (create/accept/in_service/complete/cancel/dispute)
- review lifecycle and moderation flow
- wallet/recharge/settlement consistency

Blocking condition:

- any core lifecycle cannot run end-to-end with consistent state transitions

### 2) Admin Domain Gate

Required capabilities:

- admin auth and permission boundaries
- companion/order/review operations with audit trail
- risk events review workflow
- finance records query and reconciliation views
- immutable operation logs for critical actions

Blocking condition:

- admin can execute critical write actions without role checks or audit records

### 3) Production Domain Gate

Required capabilities:

- persistent storage (no volatile-only business state)
- auth/permission enforcement for all sensitive writes
- replay-safe/idempotent critical flows
- rollback and recovery path for release failures
- observability baseline (error logs + key flow metrics)

Blocking condition:

- release has no rollback strategy or sensitive flows bypass backend authority

## Stage Mapping (Reference)

| Stage | Minimum gate target |
|---|---|
| M1-M2 | partial Business gate readiness |
| M3-M4 | Business gate + partial Admin gate |
| M5 | Business gate + Admin gate |
| M6 | Business gate + Admin gate + Production gate |

## Rule

A stage is complete only when all required gates for that stage pass.
