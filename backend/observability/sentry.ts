import { loadEnv } from '../config/env.js';
import { logger } from '../logging/logger.js';

let inited = false;

export async function initSentry() {
  if (inited) return;
  const env = loadEnv();
  if (!env.SENTRY_DSN) return;
  try {
    const Sentry = await import('@sentry/node');
    Sentry.init({ dsn: env.SENTRY_DSN, environment: env.NODE_ENV });
    inited = true;
    logger.info('sentry_initialized');
  } catch (err) {
    logger.warn({ err }, 'sentry_init_skipped');
  }
}
