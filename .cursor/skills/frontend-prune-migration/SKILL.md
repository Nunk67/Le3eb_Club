---
name: frontend-prune-migration
description: Preserves useful frontend logic and removes demo-only flows during migration. Use when pruning client code, replacing fake business behavior, or planning frontend migration with safe replacement paths, including requests like 精简前端, 移除模拟逻辑, or 前端迁移.
---

# Frontend Prune and Migration

## Goal
Preserve only useful client code and remove simulation-only implementation.

## Keep
- interaction logic
- styles
- components
- data types
- reusable UI behavior

## Remove or replace
- fake business flows
- demo-only mock data
- artificial success responses
- placeholder logic used only for demonstration

## Output
- retained code map
- removal map
- migration plan

## Rule
Do not delete behavior until a replacement path exists.
