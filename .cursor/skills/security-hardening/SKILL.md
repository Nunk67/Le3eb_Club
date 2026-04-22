---
name: security-hardening
description: Reviews and hardens flows touching transactions, identity, and permissions by enforcing backend authority and authenticated writes. Use when implementing sensitive features, reducing client trust, or documenting remediation steps, including requests like 安全加固, 权限校验, or 敏感流程审计.
---

# Security Hardening

## Goal
Protect transaction and account flows.

## Responsibilities
- enforce backend authority
- reduce sensitive client state
- identify insecure persistence
- ensure authenticated write paths
- review transaction boundaries

## Output
- security checklist
- risk list
- hardening recommendations
- remediation notes

## Rule
If a feature touches money, identity, or permissions, security comes first.
