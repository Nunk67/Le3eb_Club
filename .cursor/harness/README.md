# Harness 工作手册（开发调用索引）

本目录从 `la3eb_cursor_harness_bundle` 整理：上下文控制、验证闭环、里程碑与版本策略的**权威说明副本**。与仓库根目录的 `context-control.md`（运行中 append-only 日志）分工如下。

下文并入 bundle 根目录 `README.md` 的全局说明，并把其中目录名**映射到本仓库**（避免在 `le3eb_club` 里再找不存在的 `subagents/` 等路径）。

## Bundle 结构 → 本仓库路径

| Bundle 目录 | 在本项目中的位置 |
|-------------|------------------|
| `rules/`（硬约束） | `.cursor/rules/*.mdc` |
| `skills/`（可复用能力） | `.cursor/skills/<name>/SKILL.md` |
| `subagents/`（角色执行体） | `.cursor/agents/*.md` |
| `commands/`（有序工作流） | `.cursor/commands/*.md` |
| `validators/`（反馈闭环检查） | `.cursor/harness/validators/*.md` |
| `context-control/`（压缩与摘要规范） | `.cursor/harness/context/*` + 根目录 `context-control.md` |

## 推荐加载顺序（来自 bundle README）

1. 先理解 **rules**（全局与域规则）。
2. 再按需启用 **skills**（具体能力包）。
3. 复杂任务可委派 **agents**（原 bundle 的 subagents）。
4. 大步骤走 **commands** 里的流程。
5. 每个阶段结束前对照 **validators**。
6. 每完成一个阶段或上下文膨胀时，做 **context** 压缩并追加根目录 `context-control.md`。
7. 里程碑与版本：配合 `milestones.md`、`version-control.md` 及对应 **commands/skills**（见下节）。

## 核心运行原则（bundle README）

系统演进只通过这些手段叠加，而不是随意大改：

- constraints（规则）
- capabilities（技能）
- dedicated agents（专职 agent 说明）
- ordered commands（命令工作流）
- validation（验证器）
- context compression（上下文压缩 + 持久日志）
- version snapshots（版本快照）
- milestone tracking（里程碑）

## 分工

| 用途 | 位置 |
|------|------|
| 运行中的项目记忆日志（只追加） | 仓库根目录 `context-control.md` |
| 日志条目格式模板、何时写、写什么 | `.cursor/harness/context/entry-template.md`、`context-manager.md` |
| 里程碑阶段模型 | `.cursor/harness/milestones.md` |
| 语义化版本与快照/回滚策略 | `.cursor/harness/version-control.md` |
| 各域验证检查点与失败处理 | `.cursor/harness/validators/*.md` |

## 反馈闭环（建议顺序）

1. **验证**：按当前任务域查阅 `validators/`，失败则停止推进并按文内「Failure rule」处理。
2. **上下文**：大阶段/里程碑/子系统切换前后，按 `context-manager.md` 向根目录 `context-control.md` 追加条目；临时推理用技能 `.cursor/skills/context-compression/SKILL.md` 压缩出持久要点再写入日志。
3. **里程碑与版本**：阶段验收与快照要求见 `milestones.md`、`version-control.md`；与 Cursor 命令 `.cursor/commands/update_milestone.md`、`.cursor/commands/snapshot_version.md` 及技能 `milestone-tracking`、`versioning-snapshot-control` 配合使用。

## Cursor 中的调用方式

- **自动规则**：`.cursor/rules/06-context-control-rules.mdc`、`07-version-milestone-rules.mdc`（`alwaysApply: true`）约束行为；其中已指向本目录作为扩展参考。
- **按需技能**：里程碑与版本快照见 `.cursor/skills/milestone-tracking/SKILL.md`、`.cursor/skills/versioning-snapshot-control/SKILL.md`。
- **人工查阅**：不确定检查清单或快照字段时，直接打开上表对应文件。
