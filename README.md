# le3eb_club v0.8.0

面向「陪玩社区」全链路的工程化仓库：客户端、管理后台与单进程 API 同仓交付，数据落盘可复现。当前处于 **MVP 演进与运营能力补齐** 阶段。

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Validation & CI Gates](#validation--ci-gates)
- [System Delivery Gates](#system-delivery-gates)
- [Development Progress](#development-progress)
- [Data Persistence](#data-persistence)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)

## Overview

- **Frontend**：业务端与后台均为真实鉴权入口（`/`、`/admin`）；`/legacy` 仅保留迁移提示，不再加载演示态数据。
- **Backend**：`server.ts` 单进程 Express，REST API 与 Vite 中间件同端口（默认 `3000`）。
- **Build**：Vite 6。
- **Quality**：本地校验脚本 + `.cursor` 规则 + GitHub Actions 阶段门禁（`M6`）。

## Features

- **钱包与充值**：创建订单、模拟支付回调、人工审核、拒付与风控挂钩。
- **业务域**：注册/登录、陪玩申请、订单状态机、评价提交与展示。
- **管理后台（Workbench）**：中文界面、侧栏导航；陪玩/订单/评价/风控审核；财务对账摘要；审计日志与 CSV 导出；分页、筛选、排序与游标分页。
- **运营扩展（v0.8.0）**：用户列表与详情（资产调账、代金券、账号状态、资料）；提现与举报审核；数据报表（大盘、充值、订单、提现、陪玩统计、充值风控）；陪玩服务与定价 PATCH；本地存储 **schema v8** 与启动时结构净化，降低异常 JSON 导致的 500。
- **算法与成本门禁**：陪玩等级（`ALG`）、政策成本（`POL`，不含公会月奖励）。
- **阶段总控**：`M1..M6` 门禁编排；完整系统交付矩阵（业务域 / 后台域 / 生产域）。

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Frontend | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| Backend | Express 4 |

## Project Structure

```text
le3eb_club/
├── server.ts
├── vite.config.ts
├── package.json
├── .github/workflows/ci.yml
├── data/
│   └── storage.json          # 本地持久化（含 schemaVersion）
├── scripts/
│   ├── validate-companion-level.mjs
│   ├── validate-policy-cost.mjs
│   └── validate-gate.mjs
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── BusinessWorkbench.tsx
│   ├── AdminWorkbench.tsx
│   ├── LegacySunset.tsx
│   ├── services/
│   └── types.ts
└── .cursor/
    ├── README.md
    ├── algorithm/
    ├── commands/
    └── harness/
```

## Getting Started

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

默认在同一源 **`http://localhost:3000`** 提供页面与 `/api`，请勿单独用纯 Vite 端口访问业务页，否则易出现 API 返回 HTML 的跨源问题。若必须拆端口，请在 `.env` 中设置 `VITE_API_ORIGIN=http://localhost:3000`，并保持 API 进程监听 `3000`。

| 入口 | URL |
|------|-----|
| 业务端 | `http://localhost:3000/` |
| 管理后台 | `http://localhost:3000/admin`（默认 `admin@le3eb.club` / `admin123`） |
| 旧版演示提示 | `http://localhost:3000/legacy` |

## Validation & CI Gates

### Local Scripts

| Command | Purpose |
|---|---|
| `npm run validate:alg` | 陪玩等级算法门禁（`ALG`） |
| `npm run validate:policy` | 政策成本门禁（`POL`） |
| `npm run validate:gate -- --stage=M1..M6` | 阶段门禁编排 |
| `npm run validate:all` | `M6` 全量门禁入口 |
| `npm run lint` | TypeScript 检查（`tsc --noEmit`） |
| `npm run build` | 生产构建 |

### CI

工作流：`.github/workflows/ci.yml`  
主检查：`Stage Gate (M6)`，失败即阻断流水线。

## System Delivery Gates

完整交付需业务域、后台域、生产域门禁逐步通过：

- **业务域**：用户、陪玩、订单、评价、钱包与结算链路可闭环。
- **后台域**：审核、风控、财务、报表与操作留痕可闭环。
- **生产域**：鉴权、权限、持久化、审计与可运维性可闭环。

矩阵说明：`harness/validators/full-system-gate-matrix.md`（CI 可检出；本地 `.cursor` 下副本仅供编辑器使用）

## Development Progress

### Completed（节选）

- 陪玩等级算法门禁（`ALG-01..ALG-08`）与政策成本门禁（`POL-01..POL-05`）
- `.cursor` 索引与算法文档贯通；`validate:gate` 与 `M1..M6` 矩阵；CI 接入阶段门禁
- 管理后台一期至三期：鉴权、审核、风控、对账、审计、导出、排序与游标分页
- **v0.8.0**：运营向用户/提现/举报/报表 API 与 UI；存储 schema v8 与启动时数据净化

### In Progress

- 后端仍为单文件聚合，服务边界拆分待推进
- 完整系统交付矩阵的自动化验证与实现覆盖仍在对齐中

## Data Persistence

- 状态写入 **`data/storage.json`**（用户、陪玩、订单、评价、钱包、充值、会话、风控、审计、提现申请、举报等）。
- **`schemaVersion`** 在服务启动迁移时向前滚动；**v0.8.0** 对应 **v8**（用户扩展字段、陪玩 `services`、提现与举报集合等）。
- 重启进程后数据仍从文件恢复，便于本地长链路验证（非内存即失）。

## Known Limitations

- 鉴权与会话模型为本地演示级，非生产级多因素与设备绑定方案
- 持久化为 **JSON 文件**，非关系型数据库；高并发与审计合规需后续替换或外挂存储
- 支付与渠道为 **模拟链路**，未对接真实收单机构
- 部分业务模块仍以「API + 工作台」为主，用户端大盘 UI 仍在演进

## Roadmap

- 后端模块化（订单 / 陪玩 / 评价 / 风控 / 管理域拆分）
- 统一身份、角色与权限模型（用户 / 陪玩 / 运营）
- 持久化与迁移策略升级（数据库 + 迁移流水线）
- 端到端业务校验与数据一致性自动化
