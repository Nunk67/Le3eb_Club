# 陪玩等级算法映射清单

## 1. 使用方式

本文件用于回答三个问题：

- 每一部分用什么算法
- 每一部分依赖哪些数据
- 每一部分由哪些组件展示或消费

保持“能实现、好对齐、不过度扩展”。

## 2. 算法 -> 数据 -> 组件映射

## 2.1 等级映射

- 算法：按积分区间映射等级（1~6）
- 数据：
  - `current_points`
  - 等级区间配置
- 组件：
  - `CompanionLevelDashboard`
  - `TierTableModal`
  - `LevelBenefits`

## 2.2 周期归属与结算窗口

- 算法：
  - `event_time -> UTC+3 -> week_key`
  - 维护态与发布态控制可见分
- 数据：
  - `companion_weekly_window.week_key/status/maintenance_at/published_at`
  - `settlement_weekday`
- 组件：
  - `CompanionLevelDashboard`（显示已结算结果）
  - 建议新增 `SettlementStatusBanner`（显示维护/发布状态）

## 2.3 活跃项积分

- 算法：
  - 登录/发帖/打招呼按固定分与上限
  - 回复率档位映射
  - 接单率档位映射
- 数据：
  - `weeklyStats.logins/posts/greetings`
  - `reply_numerator/reply_denominator`
  - `accept_numerator/accept_denominator`
  - `online_sample_count`
- 组件：
  - `TaskCenter`
  - `MetricHelpModal`

## 2.4 服务项积分

- 算法：
  - 新用户/复购用户按人次计分并封顶
  - 评分按星级总和 x 档位计分
  - 礼物与总收入按比例换算
- 数据：
  - `weeklyStats.newUsersServed/repeatUsersServed/totalStars/giftIncome/totalIncome`
  - 评分改分事件（旧值冲销、新值入账）
- 组件：
  - `TaskCenter`
  - `IncomeReview`
  - `CustomerReview`

## 2.5 衰减与惩罚

- 算法：
  - 等级衰减率扣分
  - 连续无单惩罚 50/100/150/200
  - 升级周免衰减
  - `points<=0` 停止衰减和惩罚
- 数据：
  - `current_level/current_points`
  - `weeks_without_order`
  - `just_leveled_up_this_week`
- 组件：
  - `DecayExplainerModal`
  - `CompanionLevelDashboard`

## 3. 数据结构落地建议（最小）

- 周窗口：`WeeklyWindowDTO`
- 事件流水：`ScoreEventDTO`
- 周汇总：`WeeklyScoreDTO`
- 当前状态：`CompanionLevelStateDTO`
- 指标样本：`MetricSampleDTO`
- 结算配置：`SettlementConfigDTO`

## 4. 现有代码对应关系

可直接复用的现有文件：

- `src/companionConstants.ts`：等级阈值、衰减率与定价
- `src/types.ts`：`PlayerRanking` 与 `weeklyStats` 结构
- `src/components/CompanionCenter.tsx`：等级中心、任务中心、规则解释弹窗

建议统一口径的重点：

- 回复率/接单率使用统一单位（推荐 `0-1` 比率）
- 衰减逻辑只保留一套（按等级衰减率）
- 结算窗口状态纳入前端可见字段
