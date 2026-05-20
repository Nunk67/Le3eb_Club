export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

export interface LevelTier {
  level: LevelId;
  label: string;
  scoreMin: number;
  scoreMax: number;
  decayPct: number;
  weeklyBonusDiamonds: number;
  minRateUsd: number;
  maxRateUsd: number;
}

export const LEVEL_TIERS: ReadonlyArray<LevelTier> = [
  { level: 1, label: 'L1', scoreMin: 0, scoreMax: 99, decayPct: 0.02, weeklyBonusDiamonds: 0, minRateUsd: 5, maxRateUsd: 9 },
  { level: 2, label: 'L2', scoreMin: 100, scoreMax: 299, decayPct: 0.04, weeklyBonusDiamonds: 0, minRateUsd: 8, maxRateUsd: 14 },
  { level: 3, label: 'L3', scoreMin: 300, scoreMax: 699, decayPct: 0.05, weeklyBonusDiamonds: 0, minRateUsd: 12, maxRateUsd: 19 },
  { level: 4, label: 'L4', scoreMin: 700, scoreMax: 1499, decayPct: 0.06, weeklyBonusDiamonds: 50, minRateUsd: 17, maxRateUsd: 26 },
  { level: 5, label: 'L5', scoreMin: 1500, scoreMax: 2999, decayPct: 0.07, weeklyBonusDiamonds: 100, minRateUsd: 24, maxRateUsd: 35 },
  { level: 6, label: 'L6', scoreMin: 3000, scoreMax: Number.POSITIVE_INFINITY, decayPct: 0.08, weeklyBonusDiamonds: 200, minRateUsd: 30, maxRateUsd: 60 },
];

export function levelFromScore(score: number): LevelId {
  for (const t of LEVEL_TIERS) {
    if (score >= t.scoreMin && score <= t.scoreMax) return t.level;
  }
  return 1;
}

export function tierOf(level: LevelId): LevelTier {
  const t = LEVEL_TIERS.find(x => x.level === level);
  if (!t) throw new Error(`Unknown level ${level}`);
  return t;
}

export function assertRateInLevelBand(level: LevelId, hourlyRateUsd: number) {
  const tier = tierOf(level);
  const band = { min: tier.minRateUsd, max: tier.maxRateUsd };
  if (!Number.isFinite(hourlyRateUsd) || hourlyRateUsd <= 0) return { ok: false, reason: 'PRICE_INVALID', band };
  if (hourlyRateUsd < tier.minRateUsd || hourlyRateUsd > tier.maxRateUsd) return { ok: false, reason: 'PRICE_OUT_OF_LEVEL_BAND', band };
  return { ok: true, band };
}

export function levelFromHourlyRate(hourlyRateUsd: number): LevelId {
  for (const t of LEVEL_TIERS) {
    if (hourlyRateUsd >= t.minRateUsd && hourlyRateUsd <= t.maxRateUsd) return t.level;
  }
  return 1;
}

export function validateLevelingConfig() {
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    const t = LEVEL_TIERS[i];
    if (t.minRateUsd >= t.maxRateUsd) throw new Error(`L${t.level} rate band invalid`);
    if (i > 0 && t.scoreMin !== LEVEL_TIERS[i - 1].scoreMax + 1) throw new Error(`L${t.level} score gap`);
  }
}
