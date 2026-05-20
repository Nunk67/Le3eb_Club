import { LEVEL_TIERS, levelFromScore, POINT_WEIGHTS, PENALTY_RULES, SETTLEMENT_POLICY, type LevelId } from '../policy/index.js';

export interface WeeklyStatsInput {
  loginDays: number;
  posts: number;
  greetings: number;
  responseRatePct: number;
  acceptanceRatePct: number;
  newUsersServed: number;
  repeatUsersServed: number;
  ratingAvg: number;
  giftIncomeUsd: number;
  totalIncomeUsd: number;
  badReviewCount: number;
  violationCount: number;
}

export interface PlayerRankingSnapshot {
  level: LevelId;
  score: number;
  consecutiveL1Weeks: number;
  noOrderWeeks: number;
  suspended: boolean;
  justLeveledUpLastWeek: boolean;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));
}

function applyPoint(perUnit: number, cap: number, raw: number) {
  return Math.min(cap, Math.max(0, raw) * perUnit);
}

export function computePointsBreakdown(stats: WeeklyStatsInput) {
  return {
    login: applyPoint(POINT_WEIGHTS.login.perUnit, POINT_WEIGHTS.login.cap, clamp(stats.loginDays, 0, 7)),
    post: applyPoint(POINT_WEIGHTS.post.perUnit, POINT_WEIGHTS.post.cap, clamp(stats.posts, 0, 50)),
    greeting: applyPoint(POINT_WEIGHTS.greeting.perUnit, POINT_WEIGHTS.greeting.cap, clamp(stats.greetings, 0, 200)),
    responseRate: applyPoint(POINT_WEIGHTS.responseRate.perUnit, POINT_WEIGHTS.responseRate.cap, clamp(stats.responseRatePct, 0, 100)),
    acceptanceRate: applyPoint(POINT_WEIGHTS.acceptanceRate.perUnit, POINT_WEIGHTS.acceptanceRate.cap, clamp(stats.acceptanceRatePct, 0, 100)),
    newUsersServed: applyPoint(POINT_WEIGHTS.newUsersServed.perUnit, POINT_WEIGHTS.newUsersServed.cap, clamp(stats.newUsersServed, 0, 200)),
    repeatUsersServed: applyPoint(POINT_WEIGHTS.repeatUsersServed.perUnit, POINT_WEIGHTS.repeatUsersServed.cap, clamp(stats.repeatUsersServed, 0, 200)),
    rating: applyPoint(POINT_WEIGHTS.rating.perUnit, POINT_WEIGHTS.rating.cap, clamp(stats.ratingAvg, 0, 5)),
    giftIncome: applyPoint(POINT_WEIGHTS.giftIncomeUsd.perUnit, POINT_WEIGHTS.giftIncomeUsd.cap, clamp(stats.giftIncomeUsd, 0, 10000)),
    totalIncome: applyPoint(POINT_WEIGHTS.totalIncomeUsd.perUnit, POINT_WEIGHTS.totalIncomeUsd.cap, clamp(stats.totalIncomeUsd, 0, 10000)),
  };
}

export function computePenalty(stats: WeeklyStatsInput) {
  let p = 0;
  if (stats.responseRatePct < PENALTY_RULES.lowResponseRate.thresholdPct) p += PENALTY_RULES.lowResponseRate.penalty;
  if (stats.acceptanceRatePct < PENALTY_RULES.lowAcceptanceRate.thresholdPct) p += PENALTY_RULES.lowAcceptanceRate.penalty;
  if (stats.badReviewCount >= PENALTY_RULES.badReviewCount.threshold) p += PENALTY_RULES.badReviewCount.penalty;
  if (stats.violationCount >= PENALTY_RULES.violationCount.threshold) p += PENALTY_RULES.violationCount.penalty * stats.violationCount;
  return p;
}

export function computeWeekly(prev: PlayerRankingSnapshot, stats: WeeklyStatsInput) {
  const breakdown = computePointsBreakdown(stats);
  const rawActivity = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const activityScore = Math.min(SETTLEMENT_POLICY.WEEKLY_POINTS_CAP, Math.round(rawActivity * 100) / 100);
  const penaltyPoints = computePenalty(stats);
  const decayApplicable = prev.score > 0 && !prev.justLeveledUpLastWeek;
  const decayPoints = decayApplicable ? Math.round(prev.score * LEVEL_TIERS[prev.level - 1].decayPct * 100) / 100 : 0;
  const scoreDelta = Math.round((activityScore - penaltyPoints - decayPoints) * 100) / 100;
  const newScore = Math.max(0, Math.round((prev.score + scoreDelta) * 100) / 100);
  const newLevel = levelFromScore(newScore);
  const leveledUp = newLevel > prev.level;
  const weeklyBonusDiamonds = leveledUp ? LEVEL_TIERS[newLevel - 1].weeklyBonusDiamonds : 0;
  const newConsecutiveL1Weeks = newLevel === 1 ? prev.consecutiveL1Weeks + 1 : 0;
  let suspended = prev.suspended;
  let suspensionWeeks = 0;
  if (newConsecutiveL1Weeks >= SETTLEMENT_POLICY.CONSECUTIVE_L1_WEEKS_TO_SUSPEND) {
    suspended = true;
    suspensionWeeks = SETTLEMENT_POLICY.SUSPENSION_COOLDOWN_WEEKS;
  }
  return {
    pointsBreakdown: breakdown,
    activityScore,
    penaltyPoints,
    decayPoints,
    scoreDelta,
    newScore,
    newLevel,
    leveledUp,
    weeklyBonusDiamonds,
    newConsecutiveL1Weeks,
    suspended,
    suspensionWeeks,
  };
}
