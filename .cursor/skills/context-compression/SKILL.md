---
name: context-compression
description: Compresses working context while preserving architecture decisions, interfaces, phase status, and unresolved risks. Use when context becomes long, switching subsystems, or preparing summary notes for context-control logs, including requests like 压缩上下文, 总结进度, or 记录阶段状态.
---

# Context Compression

## Goal
Reduce active context length without losing project continuity.

## Process
1. keep architecture decisions
2. keep current phase status
3. keep interfaces and contracts
4. keep unresolved risks
5. discard temporary reasoning and repetition

## Output
A short structured summary suitable for `context-control.md`.
