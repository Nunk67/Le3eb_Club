import cron from 'node-cron';
import { loadEnv } from '../config/env.js';
import { getCache } from '../cache/redis.js';
import { logger } from '../logging/logger.js';
import { computeWeekly, type PlayerRankingSnapshot, type WeeklyStatsInput } from '../algo/m5LevelEngine.js';

export type SettlementRunner = (weekKey: string, statsByUser: Map<string, WeeklyStatsInput>) => Promise<void>;

export function startSettlementCron(run: SettlementRunner) {
  const env = loadEnv();
  if (env.SETTLEMENT_CRON_DISABLED === 'true') {
    logger.info('settlement_cron_disabled');
    return;
  }
  const tz = env.SETTLEMENT_TZ;
  cron.schedule('0 4 * * 1', async () => {
    const weekKey = new Date().toISOString().slice(0, 10);
    const lockKey = `settlement_lock:${weekKey}`;
    const acquired = await getCache().setnx(lockKey, 3600, '1');
    if (!acquired) {
      logger.warn({ weekKey }, 'settlement_lock_busy');
      return;
    }
    try {
      await run(weekKey, new Map());
      logger.info({ weekKey }, 'settlement_done');
    } catch (err) {
      logger.error({ err, weekKey }, 'settlement_failed');
    }
  }, { timezone: tz });
}

export { computeWeekly, type PlayerRankingSnapshot, type WeeklyStatsInput };
