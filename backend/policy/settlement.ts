export const SETTLEMENT_POLICY = Object.freeze({
  TIMEZONE: process.env.SETTLEMENT_TZ || 'Asia/Riyadh',
  WEEKDAY: Number(process.env.SETTLEMENT_WEEKDAY ?? 1),
  HOUR: Number(process.env.SETTLEMENT_HOUR ?? 4),
  MINUTE: Number(process.env.SETTLEMENT_MINUTE ?? 0),
  WEEKLY_POINTS_CAP: 150,
  CONSECUTIVE_L1_WEEKS_TO_SUSPEND: 4,
  SUSPENSION_COOLDOWN_WEEKS: 4,
});

export const POINT_WEIGHTS = Object.freeze({
  login: { perUnit: 1.0, cap: 7 },
  post: { perUnit: 1.0, cap: 10 },
  greeting: { perUnit: 0.5, cap: 15 },
  responseRate: { perUnit: 0.2, cap: 20 },
  acceptanceRate: { perUnit: 0.2, cap: 20 },
  newUsersServed: { perUnit: 1.5, cap: 30 },
  repeatUsersServed: { perUnit: 0.8, cap: 16 },
  rating: { perUnit: 4.0, cap: 20 },
  giftIncomeUsd: { perUnit: 0.2, cap: 20 },
  totalIncomeUsd: { perUnit: 0.15, cap: 15 },
});

export const PENALTY_RULES = Object.freeze({
  lowResponseRate: { thresholdPct: 30, penalty: 50 },
  lowAcceptanceRate: { thresholdPct: 20, penalty: 100 },
  badReviewCount: { threshold: 2, penalty: 150 },
  violationCount: { threshold: 1, penalty: 200 },
});
