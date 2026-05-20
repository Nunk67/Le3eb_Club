import type { LevelId } from '../policy/leveling.js';

export type PoolKey = 'FEATURED' | 'NORMAL' | 'NEWCOMER' | 'SUBGAME';

export interface CompanionRankCandidate {
  companionId: string;
  level: LevelId;
  impressions24h: number;
  clicks24h: number;
  completedOrders30d: number;
  avgRating: number;
  activityScore: number;
  orderRecencyHours: number;
  country?: string;
  isMena?: boolean;
  availability: 'ONLINE' | 'OFFLINE' | 'BUSY';
}

export interface RankingContext {
  viewerCountry?: string;
  viewerIsMena?: boolean;
  weights: { wOrder: number; wRating: number; wActive: number; wBizGlobal: number };
  nowSeed?: number;
  jitterAmplitude?: number;
}

export interface RankedItem {
  companionId: string;
  pool: PoolKey;
  rank: number;
  finalScore: number;
  breakdown: Record<string, number>;
  forcedNewcomerSlot: boolean;
}

function classify(level: LevelId): PoolKey {
  if (level >= 5) return 'FEATURED';
  if (level >= 2) return 'NORMAL';
  return 'NEWCOMER';
}

function bayesian(n: number, d: number, prior: number, w: number) {
  return (n + prior * w) / (d + w);
}

function jitter(id: string, seed: number) {
  let h = seed >>> 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return ((h >>> 0) % 10000) / 5000 - 1;
}

export function scoreSingle(c: CompanionRankCandidate, ctx: RankingContext) {
  const exposureFactor = 1 / (1 + Math.log1p(Math.max(0, c.impressions24h)));
  const lf = c.level >= 6 ? 1.25 : c.level >= 5 ? 1.15 : c.level >= 4 ? 1.05 : c.level >= 3 ? 0.95 : c.level >= 2 ? 0.8 : 0.6;
  const ctr = bayesian(c.clicks24h, c.impressions24h, 0.05, 30);
  const cvr = bayesian(c.completedOrders30d, Math.max(c.clicks24h, 1), 0.03, 5);
  const region = ctx.viewerCountry && c.country && ctx.viewerCountry === c.country ? 1 : ctx.viewerIsMena && c.isMena ? 0.5 : 0;
  const personalization = ctr * 0.4 + cvr * 0.4 + region * 0.2;
  const seed = ctx.nowSeed ?? 0;
  const jitterFactor = 1 + jitter(c.companionId, seed) * (ctx.jitterAmplitude ?? 0.05);
  const orderRecency = 1 / (1 + Math.log1p(c.orderRecencyHours));
  const business = ctx.weights.wOrder * orderRecency + ctx.weights.wRating * (c.avgRating / 5) + ctx.weights.wActive * Math.min(1, c.activityScore / 150);
  const finalScore = exposureFactor * lf * personalization * jitterFactor + business * ctx.weights.wBizGlobal;
  return { finalScore: Number(finalScore.toFixed(6)), breakdown: { exposureFactor, lf, personalization, jitterFactor, business } };
}

export function rankCompanions(candidates: CompanionRankCandidate[], ctx: RankingContext, limit: number): RankedItem[] {
  const caps = { featured: 8, normal: 15, newcomer: 3 };
  const online = candidates.filter(c => c.availability !== 'OFFLINE');
  const featured: RankedItem[] = [];
  const normal: RankedItem[] = [];
  const newcomer: RankedItem[] = [];
  for (const c of online) {
    const pool = classify(c.level);
    const cap = pool === 'FEATURED' ? caps.featured : pool === 'NORMAL' ? caps.normal : caps.newcomer;
    if (c.impressions24h >= cap) continue;
    const scored = scoreSingle(c, ctx);
    const item = { companionId: c.companionId, pool, rank: 0, finalScore: scored.finalScore, breakdown: scored.breakdown, forcedNewcomerSlot: false };
    if (pool === 'FEATURED') featured.push(item);
    else if (pool === 'NORMAL') normal.push(item);
    else newcomer.push(item);
  }
  const sort = (a: RankedItem, b: RankedItem) => b.finalScore - a.finalScore;
  featured.sort(sort);
  normal.sort(sort);
  newcomer.sort(sort);
  const total = Math.min(limit, featured.length + normal.length + newcomer.length);
  const fN = Math.round(total * 0.35);
  const nN = Math.round(total * 0.45);
  const list = [...featured.slice(0, fN), ...normal.slice(0, nN), ...newcomer.slice(0, Math.max(0, total - fN - nN))];
  list.forEach((r, i) => { r.rank = i + 1; });
  return list.slice(0, total);
}
