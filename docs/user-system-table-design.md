# 用户系统库表设计记录

## 背景

本文记录用户系统相关的数据库表规划，先确定表边界和职责，不在当前阶段实现迁移、Prisma schema 或运行时代码。

参考 PRD：

- https://my.feishu.cn/wiki/UvWmweEiyihp5LkBUOAcDZfBnYc

## 当前设计假设

- 一个用户只能绑定一个邮箱，一个邮箱只能属于一个用户。
- 用户账号主体只有一套，玩家身份和陪玩身份共享同一个 `user_id`。
- 经济系统绑定 `user_id`，不按玩家/陪玩拆钱包。
- 默认注册身份暂按“玩家”处理，申请并审核通过后增加“陪玩”身份。
- 如果产品最终确认“默认注册即陪玩”，表结构不需要调整，只需要调整注册时写入的默认身份记录。
- 验证码短期态优先放 Redis；数据库只需要保留必要审计或发送记录，不把 Redis TTL 数据强行建成核心业务表。

## 表清单

### 账号与身份

| 表名 | 职责 |
| --- | --- |
| `users` | 用户主表。承载内部用户 ID、UID、邮箱、昵称、账号状态等账号级信息。 |
| `user_auth_identities` | 登录身份表。承载邮箱密码、邮箱验证码、未来第三方登录等认证方式。 |
| `user_profiles` | 用户基础资料。承载头像、性别、地区等个人主页基础展示字段。 |
| `user_identities` | 用户身份表。记录玩家、陪玩等身份及状态。 |
| `user_sessions` | 登录会话表。承载 refresh token、登录设备、过期与吊销状态。 |
| `user_devices` | 用户设备表。记录设备 ID、设备型号、首次/最近登录信息，用于风控和登录状态扩展。 |

### 陪玩相关

| 表名 | 职责 |
| --- | --- |
| `companion_applications` | 陪玩申请与审核记录。记录申请资料快照、审核状态、审核人和审核意见。 |
| `companion_profiles` | 陪玩身份资料。承载陪玩简介、在线状态、服务展示状态、评分和接单统计等。 |
| `user_game_account_cards` | 游戏账号卡片。记录用户绑定的游戏 ID、段位、平台、服务器、风格、截图等展示信息。 |

### 用户关系

| 表名 | 职责 |
| --- | --- |
| `user_follows` | 关注关系表。记录 A 关注 B 的单向关系。 |
| `user_blocks` | 拉黑关系表。记录 A 拉黑 B 的单向关系。 |
| `user_social_stats` | 社交计数表。记录关注数、粉丝数、互关数、拉黑数、帖子数等可实时展示计数。 |

### 经济系统

| 表名 | 职责 |
| --- | --- |
| `wallet_accounts` | 用户钱包账户。按用户和资产类型记录余额与冻结余额。 |
| `wallet_transactions` | 钱包流水。记录充值、下单扣款、订单结算、提现、人工调整等资金变更。 |

### 审核与风控预留

| 表名 | 职责 |
| --- | --- |
| `content_review_records` | 内容审核记录。预留给头像、游戏卡片截图、相册、帖子等内容安全审核。 |
| `user_risk_events` | 用户风控事件。记录高频操作、异常支付、异常提现、纠纷等风控事件。 |
| `user_module_bans` | 用户模块封禁。记录下单、接单、充值、提现、私聊、发帖等模块级禁用状态。 |

### 后台与审计

| 表名 | 职责 |
| --- | --- |
| `admin_role_templates` | 后台角色模板。记录运营、财务、风控、内容等后台角色模板。 |
| `admin_permissions` | 后台权限定义。记录后台可授权的权限点。 |
| `admin_audit_logs` | 后台操作审计。记录管理员对用户、订单、财务、审核、风控等对象的操作。 |

## 第一期建议落地范围

第一期建议优先落地以下表，覆盖邮箱注册登录、身份切换、陪玩申请、关系链和共享钱包：

| 表名 | 是否第一期 |
| --- | --- |
| `users` | 是 |
| `user_auth_identities` | 是 |
| `user_profiles` | 是 |
| `user_identities` | 是 |
| `user_sessions` | 是 |
| `user_devices` | 是 |
| `companion_applications` | 是 |
| `companion_profiles` | 是 |
| `user_game_account_cards` | 是 |
| `user_follows` | 是 |
| `user_blocks` | 是 |
| `user_social_stats` | 是 |
| `wallet_accounts` | 是 |
| `wallet_transactions` | 是 |
| `admin_audit_logs` | 是 |
| `content_review_records` | 预留 |
| `user_risk_events` | 预留 |
| `user_module_bans` | 预留 |
| `admin_role_templates` | 预留 |
| `admin_permissions` | 预留 |

## 后续待细化

- 每张表字段、类型、默认值、枚举值。
- 主键、唯一约束、普通索引和复合索引。
- 表之间的外键关系是否强约束。
- UID 生成策略和靓号规避策略。
- 昵称唯一性、字符校验和历史昵称是否需要保留。
- 陪玩申请资料快照的 JSON 结构。
- 钱包资产类型、冻结余额模型和幂等流水规则。
- 用户关系变更时社交计数的事务更新规则。
- 拉黑时关注关系清理和消息/主页/搜索屏蔽规则。
- 验证码、登录限流和短期态在 Redis 中的 key 设计。
