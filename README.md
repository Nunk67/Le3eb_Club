# le3eb_club

## 愿景与定位

le3eb_club 致力于打造一个稳定、健康、可持续的游戏陪伴社区，围绕玩家真实的社交与组队需求，提供可信赖的匹配、履约与治理体验。

项目采用同仓一体化交付模式，将业务端、管理端与 API 放在同一工程中，保证产品能力与系统实现持续对齐。

## 核心功能

- **玩家侧能力**：注册登录、陪玩申请与资料管理、订单状态流转、评价闭环。
- **交易与钱包能力**：订单创建、支付回调模拟、人工审核与拒付、资金相关链路管理。
- **管理后台能力**：陪玩/订单/评价/风控审核与查询，财务对账摘要，审计导出，列表筛选/排序/分页。
- **运营能力**：用户与资产管理、提现与举报审核、多维报表、陪玩服务与定价调整。
- **数据持久化能力**：本地 JSON 存储，支持启动时迁移与异常数据净化。

## 项目架构

### 技术栈

| Layer | Tech |
|---|---|
| Runtime | Node.js |
| Frontend | React 19 + TypeScript 5.8 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |
| Backend | Express 4 |

### 目录结构

```text
le3eb_club/
├── backend/
│   ├── server.ts
│   └── data/
│       └── storage.json
├── client/
├── admin/
├── shared/
├── vite.config.ts
├── package.json
└── README.md
```

### 架构说明

- **同仓、单进程运行**：`npm run dev` 启动 `backend/server.ts`，统一提供页面与 API。
- **前后端分层**：`client/` 为用户端，`admin/` 为管理端，`backend/` 为服务端。
- **共享契约层**：`shared/` 提供跨端类型与 API 调用工具，减少重复定义。
- **本地持久化层**：`backend/data/storage.json` 作为默认数据存储。

## 快速开始

### 依赖

- Node.js 22+（推荐）
- npm 或 pnpm

### 安装与启动

```bash
npm install
npm run dev
```

### 默认访问地址

- 业务端：`http://localhost:3000/`
- 管理后台：`http://localhost:3000/admin`
