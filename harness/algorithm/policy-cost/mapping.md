# 政策成本测算映射清单（不含公会月奖励）

## 1. 算法

- 输入：`base_cost_rate`、`weekly_bonus_rate`
- 输出：`total_cost_rate`
- 公式：`total_cost_rate = base_cost_rate + weekly_bonus_rate`

## 2. 数据字段

- `base_cost_rate`：固定 `40%`
- `weekly_bonus_rate`：档位集合 `{5,6,8,10,15,20}%`
- `total_cost_rate`：计算结果

## 3. 禁用字段

以下字段若出现，必须在本算法中忽略：

- `guild_month_bonus_rate`
- `guild_month_share_rate`
- 任何公会维度奖励参数

## 4. 验证映射

- 门禁文档：`harness/algorithm/policy-cost/verification.md`
- 门禁条目：`POL-01` 到 `POL-05`

## 5. 实施建议

- 在成本测算脚本或报表层仅保留两参数计算（基础 + 周奖励）。
- 若上游数据包含公会字段，需在转换层显式剔除再入算。
