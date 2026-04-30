# le3eb_club

当前版本（数字语义化版本号）以 `version-control/version` 为唯一来源。

我们致力于打造**稳定、健康、可持续**的优质陪伴社区：围绕玩家真实的社交与组队需求，沉淀可信赖的匹配、履约与治理体验，让不同风格的玩家都能在社区里找到**契合、专业、有边界感**的伙伴，并形成长期可运营的游戏社区生态。

本仓库是这一目标的**同仓工程载体**：业务端、管理端与 API 一体交付，便于在迭代中保持产品、规则与实现同步演进。当前仍处于 **能力持续补齐、向完整社区系统过渡** 的阶段。

## Table of Contents

- [愿景与定位](#愿景与定位)
- [主要能力](#主要能力)
- [技术栈](#技术栈)
- [仓库结构](#仓库结构)
- [快速开始](#快速开始)
- [校验与 CI](#校验与-ci)
- [系统交付目标](#系统交付目标)
- [开发进展](#开发进展)
- [数据持久化](#数据持久化)
- [已知限制](#已知限制)
- [路线图](#路线图)

## 愿景与定位

- **稳定**：关键链路（身份、订单、资金与审核）可预期、可回放、可排障；默认开发流程配套自动化门禁，减少「口头对齐、线上翻车」。
- **健康**：重视履约质量、评价与风控工作台，倾向把争议与风险留在可运营、可审计的流程里，而不是依赖单次人情或口头承诺。
- **可持续**：在单仓内保留清晰的演进路径（从 MVP 到模块化后端、再到更完整的生产形态），使社区规则、成本与等级等运营口径可以随版本迭代而**有文档、有校验、有记录**。

技术实现上，默认以 **Node + React + Express** 单机交付本地与演示环境；与运营策略、测算表、线下协作流程相关的内容**不在本 README 展开**，在仓库内仅体现为：**规则可被校验、行为与文档不易漂移**。

## 主要能力

- **玩家侧**：注册与登录、陪玩申请与资料、订单状态与评价等围绕「找伙伴、下订单、完成服务」的闭环能力。
- **钱包与充值**：订单创建、支付回调模拟、人工审核与拒付、与风控摘要联动，支撑对账与运营决策。
- **管理后台（Workbench）**：中文工作台；陪玩/订单/评价/风控等审核与查询；财务对账摘要；审计留痕与导出；列表筛选、排序与分页体验。
- **运营向能力（当前对外 SemVer 以 `version-control/version` 为准）**：用户列表与详情、资产与代金券、账号状态与资料维护；提现与举报审核；数据报表（大盘、充值、订单、提现、陪玩与风控视角）；陪玩服务与定价调整等 PATCH 能力。
- **本地持久化**：结构化 JSON 存储，启动时按版本迁移并净化异常数据，降低因脏数据导致的不可用。
- **质量与规则对齐（工程效果）**：关键运营规则（如陪玩等级、政策成本口径）在仓库中有**可追溯的说明**，并通过脚本与 CI 做**一致性校验**，避免实现与文档长期分叉。（具体命令见下文「校验与 CI」。）

## 技术栈

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Frontend | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| Backend | Express 4 |

## 仓库结构

**同仓、单进程**：`npm run dev` 启动 `backend/server.ts`（Express + 开发态 Vite 中间件）；前端以 Vite **`client/`** 为根；**`admin/`** 为运营后台源码（由 `client/main.tsx` 按路径挂载）；**`shared/`** 放跨端类型与 `apiClient`；**`backend/data/`** 为唯一本地数据源。

```text
le3eb_club/
├── backend/
│   ├── server.ts             # API、持久化、Vite 中间件（生产态读根目录 dist/）
│   └── data/
│       └── storage.json      # 本地 JSON 存储（含 schemaVersion）
├── client/                   # 用户端 SPA（Vite root；入口 index.html + main.tsx）
├── admin/                    # 运营后台（AdminWorkbench + admin API 封装）
├── shared/                   # 共享类型与 HTTP 小工具（被 client / admin / backend 引用）
├── version-control/          # 版本治理中心（version/changelog/context-control、hooks、脚本）
├── vite.config.ts
├── package.json
├── README.md                 # 本文件：产品说明与上手指南
```

跨目录引用在构建侧通过 **`@shared/*`**（见 `vite.config.ts` / `tsconfig.json`），避免深层相对路径。除本 README 外，**《开发手册》**与源码同仓维护，汇总规则口径、算法说明、阶段门禁与协作约定；日常以本页作产品入口，以手册作研发与验收入口，不再单独维护 `docs/` 目录。

## 快速开始

### Prerequisites

- Node.js 22+（推荐）
- npm 或 pnpm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

默认在同一源 **`http://localhost:3000`** 提供页面与 `/api`。请勿单独用纯 Vite 端口访问业务页，否则易出现 API 返回 HTML 的跨源问题。若必须拆端口，请在 `.env` 中设置 `VITE_API_ORIGIN=http://localhost:3000`，并保持 API 进程监听 `3000`。

| 入口 | URL |
|------|-----|
| 业务端 | `http://localhost:3000/` |
| 管理后台 | `http://localhost:3000/admin`（默认 `admin@le3eb.club` / `admin123`） |
| 旧版演示提示 | `http://localhost:3000/legacy` |

## 校验与 CI

**效果**：在合并与发布前自动跑类型检查、生产构建，并对关键规则文档做门禁校验。阶段划分与验收条目以《开发手册》为准，本 README 只保留常用命令。

常用本地命令：

| Command | Purpose |
|---|---|
| `npm run validate:all` | 推荐的一键门禁（与 CI 默认 profile 对齐） |
| `npm run validate:gate -- --stage=M0..M10` | 按阶段拆分跑门禁（推荐显式传 `--stage`，避免语义误读） |
| `npm run validate:i18n` | 多语言架构门禁（校验 milestones 中 i18n 分阶段目标与关键约束） |
| `npm run version:auto` | 按里程碑基线 + PATCH 规则自动同步 `version-control/version` 与 `package.json` |
| `npm run verify:version` | 校验 `version-control/version` 与 `package.json` 一致（`validate:gate` 入口已自动执行） |
| `npm run push:safe` | 安全推送：阻止包含 `.cursor/**` 与 `version-control/context-control.md` 的提交被推送 |
| `npm run lint` | TypeScript 检查（`tsc --noEmit`） |
| `npm run build` | 生产构建 |

CI 工作流：`.github/workflows/ci.yml`（主步骤为 **Stage Gate (Full System)**，失败即阻断）。

## 版本与记录流程

- 数字语义化版本号唯一来源：`version-control/version`（`MAJOR.MINOR.PATCH`）。
- `package.json` 的 `version` 必须与 `version-control/version` 一致（可用 `npm run verify:version` 校验）。
- `version-control/changelog.md` 仅记录会推送到 GitHub 的改动。
- 对不会推送到 GitHub 的本地文件改动（如 `.cursor/**`、`version-control/context-control.md`）无需写入 changelog。
- `version-control/context-control.md` 采用本机时间戳：`### [YYYY-MM-DD HH:MM:SS LOCAL]`。

## 系统交付目标

从「能跑的 MVP」走向「可长期运营的社区系统」，交付上按三域目标对齐（**此处只写效果，不展开验收细则**）：

- **业务域**：用户、陪玩、订单、评价、钱包与结算等主链路可闭环、状态可解释。
- **后台域**：审核、风控、财务与报表等运营动作可执行、可留痕、可复盘。
- **生产域**：鉴权与权限边界清晰，关键写操作可审计、可回滚、可观测——在到达该形态前，本仓库仍以**渐进增强**为主。

## 开发进展

### Completed（节选）

- 业务端与管理端真实鉴权入口；旧演示路径收敛为迁移提示。
- 管理后台多期能力：审核、风控、对账、审计、导出、排序与游标分页等。
- **运营向能力**：用户/提现/举报/报表等运营向 API 与 UI；本地存储 schema 升级与启动时数据净化。
- **M2 数据与后端基础闭环**：持久化 schema + 启动迁移与净化链路 + `M2` 阶段门禁（policy/alg/lint）打通并验证通过。
- **M4 交易与钱包闭环**：订单与钱包主链路证据完成归档，`M4` 阶段门禁（policy/alg/lint）验证通过并纳入里程碑闭环记录。
- 工程侧：规则文档与自动化门禁贯通，CI 接入阶段门禁；配套《开发手册》便于对齐口径。

### In Progress

- 后端从单文件形态向清晰服务边界演进。
- 完整社区系统在「业务 / 后台 / 生产」三域上的自动化覆盖与实现深度仍在对齐。

## 数据持久化

- 状态写入 **`backend/data/storage.json`**（用户、陪玩、订单、评价、钱包、会话、风控、审计、提现与举报等聚合存储）。
- **`schemaVersion`** 在启动时向前迁移；产品 SemVer 以 `version-control/version` 与 `package.json` 对齐为准，与里程碑映射遵循 `.cursor/rules/version-control.mdc`。
- 重启进程后数据从文件恢复，便于本地长链路验证（非纯内存即失）。

## 已知限制

- 鉴权与会话为**开发与演示向**实现，不等同于生产级多因素与设备绑定方案。
- 持久化为 **JSON 文件**，非关系型数据库；规模与合规需求上升时需替换或外挂存储。
- 支付与渠道为 **模拟链路**，未对接真实收单机构。
- 部分能力仍以「API + 工作台」为主，玩家端大盘与发现体验仍在迭代。

## 路线图

- 后端模块化（订单 / 陪玩 / 评价 / 风控 / 管理域拆分）。
- 统一身份、角色与权限模型（用户 / 陪玩 / 运营）。
- 持久化与迁移策略升级（数据库 + 迁移流水线）。
- 端到端业务校验与数据一致性自动化增强。
