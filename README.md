# le3eb_club

## 愿景与定位

le3eb_club 致力于打造一个稳定、健康、可持续的游戏陪伴社区，围绕玩家真实的社交与组队需求，提供可信赖的匹配、履约与治理体验。

项目采用同仓一体化交付模式，将业务端、管理端与 API 放在同一工程中，保证产品能力与系统实现持续对齐。

## 核心功能

- **玩家侧能力**：注册登录、陪玩申请与资料管理、订单状态流转、评价闭环。
- **交易与钱包能力**：订单创建、支付回调模拟、人工审核与拒付、资金相关链路管理。
- **管理后台能力**：陪玩/订单/评价/风控审核与查询，财务对账摘要，审计导出，列表筛选/排序/分页。
- **运营能力**：用户与资产管理、提现与举报审核、多维报表、陪玩服务与定价调整。
- **数据持久化能力**：本地 JSON 存储（schema v11），支持启动时迁移与异常数据净化；Postgres/Prisma 迁移脚本已预留，需配置真实 `DATABASE_URL` 后启用。
- **支付校验**：开发环境使用 `sandbox` 验单；App Store / Google Play 真实 HTTP 与生产 S3 需凭据到位后再接。

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
|admin/
|app\applet/
├── backend/
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

## 生产准备说明

- 生产启动前先执行 `npm run build`，再以 `NODE_ENV=production` 启动 `npm run dev` 对应的服务入口。
- 服务端读取 `PORT` 环境变量；未设置时默认 `3000`。
- 首次生产启动若没有管理员账号，需要设置 `ADMIN_EMAIL` 与 `ADMIN_PASSWORD` 进行一次性管理员引导。
- 默认仓库数据不包含可登录演示账号；本地开发可通过默认开发种子快速验证，生产环境不要启用 `ALLOW_DEMO_SEED`。
- `backend/data/storage.json` 适合单机预备上线和验收，不适合作为长期多实例生产数据库；正式放量前应迁移到托管数据库并配置备份。

### 上线前检查

```bash
npm run lint
npm run build
```
