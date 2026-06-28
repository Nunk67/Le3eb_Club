import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {
  RechargePackage,
  RechargeOrder,
  Wallet,
  WalletTransaction
} from '../shared/types.js';
import { loadEnv } from './config/env.js';
import { logger } from './logging/logger.js';
import { assertRateInLevelBand, validateLevelingConfig } from './policy/index.js';
import { levelFromHourlyRate } from './policy/leveling.js';
import { hashPassword as hashPasswordArgon } from './auth/password.js';
import { verifyAccessToken } from './auth/tokens.js';
import { getCache } from './cache/redis.js';
import { metricsMiddleware, register as metricsRegister, withdrawPendingCount } from './observability/metrics.js';
import { zValidate } from './middleware/validate.js';
import { AdminOperatorPatchSchema } from '../shared/schemas.js';
import { resolveObjectStore } from './storage/objectStore.js';
import { startSettlementCron } from './jobs/settlementCron.js';
import {
  registerOpsRoutes,
  aggregateDashboardMetrics,
  type CouponTemplate,
  type CouponGrant,
  type DeviceBan,
  type ExposureLog,
  type SupportTicket,
} from './routes/ops.js';
import { initSentry } from './observability/sentry.js';
import {
  ROLE_TEMPLATES,
  type AccountStatus,
  type AdminPermission,
  type AdminRoleTemplate,
  type BanModuleKey,
  type ModerationReport,
  type PersistedState,
  type WithdrawalRequest,
  type UserRole,
} from './domain/types.js';
import type { AppContext } from './app/context.js';
import { legacyHashPassword as hashPassword, loadState, normalizeUserPassword, saveState } from './state/jsonState.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerBusinessRoutes } from './routes/business.js';
import { registerFinanceRoutes } from './routes/finance.js';
import { registerUploadRoutes } from './routes/uploads.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

async function startServer() {
  const env = loadEnv();
  await initSentry();
  validateLevelingConfig();
  const app = express();
  const PORT = env.PORT;
  let shuttingDown = false;
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: env.NODE_ENV === 'production' }));
  const allowlist = (process.env.CORS_ALLOWLIST || 'http://localhost:3000,http://localhost:5173').split(',').map(s => s.trim());
  app.use(cors({ origin: allowlist, credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, max: 600, skip: req => ['/healthz', '/ready', '/metrics'].includes(req.path) }));
  app.use(metricsMiddleware());
  app.use(express.json({ limit: '1mb' }));
  app.get('/healthz', (_req, res) => res.json({ ok: true, t: Date.now() }));
  app.get('/ready', async (_req, res) => {
    if (shuttingDown) return res.status(503).json({ ok: false, shuttingDown: true });
    try {
      await getCache().ping();
      const store = resolveObjectStore();
      const s3ok = await store.ping();
      res.json({ ok: true, redis: true, s3: s3ok, pg: Boolean(env.DATABASE_URL) });
    } catch {
      res.status(503).json({ ok: false });
    }
  });
  app.get('/metrics', async (_req, res) => {
    res.setHeader('Content-Type', metricsRegister.contentType);
    res.end(await metricsRegister.metrics());
  });

  // --- Runtime data ---
  const RECHARGE_PACKAGES: RechargePackage[] = [
    { id: 'pkg_1', amount: 0.99, coins: 60 },
    { id: 'pkg_2', amount: 4.99, coins: 300, bonus: 15 },
    { id: 'pkg_3', amount: 9.99, coins: 600, bonus: 45 },
    { id: 'pkg_4', amount: 19.99, coins: 1200, bonus: 120 },
    { id: 'pkg_5', amount: 49.99, coins: 3000, bonus: 450 },
    { id: 'pkg_6', amount: 99.99, coins: 6000, bonus: 1200 },
  ];

  const state = loadState();

  const rechargeOrders: RechargeOrder[] = state.rechargeOrders;
  const wallets: Record<string, Wallet> = state.wallets;
  const walletTransactions: WalletTransaction[] = state.walletTransactions;
  const diamondWallets: Record<string, { userId: string; balance: number; lastUpdated: number }> = state.diamondWallets;

  // --- Risk Control State ---
  const dailyRechargeLimits: Record<string, { amount: number; lastReset: number }> = state.dailyRechargeLimits;
  const MAX_DAILY_RECHARGE = 500; // USD
  const users = state.users;
  const sessions: Record<string, { token: string; userId: string; expiresAt: number }> = state.sessions;
  const companions = state.companions;
  const exposureImpressions24h = new Map<string, number>();
  const exposureClicks24h = new Map<string, number>();
  const couponTemplates: CouponTemplate[] = state.couponTemplates;
  const couponGrants: CouponGrant[] = state.couponGrants;
  const deviceBans: DeviceBan[] = state.deviceBans;
  const exposureLogs: ExposureLog[] = state.exposureLogs;
  const tickets: SupportTicket[] = state.tickets;
  const orders: Array<{
    id: string;
    userId: string;
    companionId: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: 'CREATED' | 'ACCEPTED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
    createdAt: number;
    acceptedAt?: number;
    startedAt?: number;
    completedAt?: number;
    cancelledAt?: number;
    disputeReason?: string;
    settlementDone?: boolean;
    updatedAt?: number;
  }> = state.orders;
  const reviews: Array<{
    id: string;
    orderId: string;
    userId: string;
    companionId: string;
    rating: number;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    moderationReason?: string;
    createdAt: number;
    updatedAt?: number;
  }> = state.reviews;
  const riskEvents: Array<{
    id: string;
    type: 'HIGH_FREQUENCY_RECHARGE' | 'ORDER_DISPUTE' | 'NEGATIVE_BALANCE';
    relatedEntityId: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'RESOLVED';
    description: string;
    createdAt: number;
    resolvedAt?: number;
    resolvedBy?: string;
  }> = state.riskEvents || [];
  const auditLogs = state.auditLogs || [];
  const withdrawalRequests: WithdrawalRequest[] = state.withdrawalRequests || [];
  const moderationReports: ModerationReport[] = state.moderationReports || [];
  const persistState = () => saveState(state);
  const pruneProductionSeedAccounts = () => {
    if (!IS_PRODUCTION || process.env.ALLOW_DEMO_SEED === 'true') return;
    const before = users.length;
    for (let i = users.length - 1; i >= 0; i -= 1) {
      const user = users[i];
      const isDefaultDemo = user.id === 'user_1' && user.email === 'demo@le3eb.club';
      const isDefaultAdmin = user.id === 'admin_1' && user.email === 'admin@le3eb.club';
      if (isDefaultDemo || isDefaultAdmin) {
        users.splice(i, 1);
        delete wallets[user.id];
        delete diamondWallets[user.id];
      }
    }
    if (users.length !== before) {
      persistState();
    }
  };
  pruneProductionSeedAccounts();

  const ensureAdminSeed = async () => {
    const existingAdmin = users.find(user => user.role === 'ADMIN');
    if (existingAdmin) {
      normalizeUserPassword(existingAdmin);
      if (!existingAdmin.adminRoleTemplate) {
        existingAdmin.adminRoleTemplate = 'SUPER_ADMIN';
      }
      if (!existingAdmin.permissions || existingAdmin.permissions.length === 0) {
        existingAdmin.permissions = [...ROLE_TEMPLATES[existingAdmin.adminRoleTemplate]];
      }
      persistState();
      return;
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (IS_PRODUCTION && (!adminEmail || !adminPassword)) {
      logger.warn('admin_seed_skipped_set_ADMIN_EMAIL_and_ADMIN_PASSWORD');
      return;
    }
    if (!adminEmail || !adminPassword) {
      logger.warn('admin_seed_skipped_missing_env');
      return;
    }
    const now = Date.now();
    users.push({
      id: 'admin_1',
      username: 'ops_admin',
      email: adminEmail || 'admin@le3eb.club',
      passwordHash: await hashPasswordArgon(adminPassword),
      role: 'ADMIN',
      adminRoleTemplate: 'SUPER_ADMIN',
      permissions: [...ROLE_TEMPLATES.SUPER_ADMIN],
      createdAt: now,
      gender: 'U',
      accountStatus: 'ACTIVE',
      followCount: 0,
      lastLoginAt: now
    });
    persistState();
    console.log(`Admin seed user restored: ${adminEmail || 'admin@le3eb.club'}`);
  };
  await ensureAdminSeed();

  /** Keep local development usable without shipping demo credentials to production. */
  const ensureDemoBusinessUser = () => {
    if (IS_PRODUCTION || process.env.ALLOW_DEMO_SEED === 'false') return;
    const hasNonAdmin = users.some(u => u.role !== 'ADMIN');
    if (hasNonAdmin) return;
    const now = Date.now();
    users.push({
      id: 'user_1',
      username: 'demo_user',
      email: 'demo@le3eb.club',
      passwordHash: hashPassword('demo123'),
      role: 'USER',
      createdAt: now,
      gender: 'U',
      accountStatus: 'ACTIVE',
      followCount: 0,
      lastLoginAt: now
    });
    if (!wallets.user_1) {
      wallets.user_1 = { userId: 'user_1', balance: 120, lastUpdated: now };
    }
    persistState();
    console.log('Demo user restored for local development.');
  };
  ensureDemoBusinessUser();

  const pruneExpiredSessions = () => {
    let removed = 0;
    Object.keys(sessions).forEach(token => {
      const session = sessions[token];
      if (!session || session.expiresAt <= Date.now()) {
        delete sessions[token];
        removed += 1;
      }
    });
    if (removed > 0) {
      persistState();
      console.log(`Pruned ${removed} expired sessions on startup.`);
    }
  };
  pruneExpiredSessions();

  // --- Helper Functions ---
  const getWallet = (userId: string): Wallet => {
    if (!wallets[userId]) {
      wallets[userId] = { userId, balance: 0, lastUpdated: Date.now() };
      persistState();
    }
    return wallets[userId];
  };

  const addCoins = (userId: string, amount: number, referenceId: string, description: string) => {
    const wallet = getWallet(userId);
    wallet.balance += amount;
    wallet.lastUpdated = Date.now();
    
    const transaction: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'RECHARGE',
      amount,
      balanceAfter: wallet.balance,
      referenceId,
      timestamp: Date.now(),
      description
    };
    walletTransactions.unshift(transaction);
    persistState();
    return transaction;
  };
  const addDiamonds = (userId: string, amount: number, referenceId: string, description: string) => {
    if (!diamondWallets[userId]) {
      diamondWallets[userId] = { userId, balance: 0, lastUpdated: Date.now() };
    }
    diamondWallets[userId].balance += amount;
    diamondWallets[userId].lastUpdated = Date.now();
    walletTransactions.unshift({
      id: `tx_d_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      type: 'INCOME',
      amount,
      balanceAfter: diamondWallets[userId].balance,
      referenceId,
      timestamp: Date.now(),
      description
    });
    persistState();
  };
  const createToken = () => `sess_${crypto.randomBytes(32).toString('hex')}`;
  const getUserById = (userId: string) => users.find(user => user.id === userId);
  const toPublicUser = (user: { id: string; username: string; email: string; role: UserRole; adminRoleTemplate?: AdminRoleTemplate; permissions?: AdminPermission[] } | undefined) =>
    user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          adminRoleTemplate: user.adminRoleTemplate,
          permissions: user.permissions || []
        }
      : null;

  const getBanError = (user: (typeof users)[number] | undefined, module: BanModuleKey): string | null => {
    if (!user) return '用户不存在';
    if (user.accountStatus === 'FROZEN') return '账号已冻结';
    if (user.accountStatus === 'RISK_HOLD' && (module === 'RECHARGE' || module === 'WITHDRAW')) return '账号风控中，暂不可充值/提现';
    if (user.banModules?.[module]) return '该能力已被封禁';
    return null;
  };

  const lifetimeRechargeUsdForUser = (userId: string) =>
    (Array.isArray(rechargeOrders) ? rechargeOrders : [])
      .filter(o => o.userId === userId && o.status === 'SUCCESS')
      .reduce((s, o) => s + o.amount, 0);

  const adjustCoinsDelta = (userId: string, delta: number, referenceId: string, description: string) => {
    const wallet = getWallet(userId);
    const next = wallet.balance + delta;
    if (next < 0) return { ok: false as const, error: '金币余额不足' };
    wallet.balance = next;
    wallet.lastUpdated = Date.now();
    walletTransactions.unshift({
      id: `tx_${Math.random().toString(36).slice(2, 11)}`,
      userId,
      type: 'ADMIN_ADJUST',
      amount: delta,
      balanceAfter: next,
      referenceId,
      timestamp: Date.now(),
      description
    });
    persistState();
    return { ok: true as const };
  };

  const adjustDiamondDelta = (userId: string, delta: number, referenceId: string, description: string) => {
    if (!diamondWallets[userId]) {
      diamondWallets[userId] = { userId, balance: 0, lastUpdated: Date.now() };
    }
    const next = diamondWallets[userId].balance + delta;
    if (next < 0) return { ok: false as const, error: '钻石余额不足' };
    diamondWallets[userId].balance = next;
    diamondWallets[userId].lastUpdated = Date.now();
    walletTransactions.unshift({
      id: `tx_d_${Math.random().toString(36).slice(2, 11)}`,
      userId,
      type: delta >= 0 ? 'INCOME' : 'WITHDRAW',
      amount: delta,
      balanceAfter: next,
      referenceId,
      timestamp: Date.now(),
      description
    });
    persistState();
    return { ok: true as const };
  };

  const parsePage = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
  };
  const parseSortDir = (value: unknown) => (String(value || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc');
  const sortByKey = <T extends Record<string, unknown>>(items: T[], key: keyof T, dir: 'asc' | 'desc') => {
    const sign = dir === 'asc' ? 1 : -1;
    return [...items].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;
      return String(av ?? '').localeCompare(String(bv ?? '')) * sign;
    });
  };
  const paginate = <T,>(source: T[], pageRaw: unknown, pageSizeRaw: unknown) => {
    const page = parsePage(pageRaw, 1);
    const pageSize = Math.min(parsePage(pageSizeRaw, 20), 100);
    const start = (page - 1) * pageSize;
    const items = source.slice(start, start + pageSize);
    return {
      page,
      pageSize,
      total: source.length,
      items
    };
  };
  const cursorPaginate = <T extends { id: string },>(
    source: T[],
    pageRaw: unknown,
    pageSizeRaw: unknown,
    cursorRaw: unknown
  ) => {
    const page = parsePage(pageRaw, 1);
    const pageSize = Math.min(parsePage(pageSizeRaw, 20), 100);
    const cursor = String(cursorRaw || '');
    if (!cursor) {
      const start = (page - 1) * pageSize;
      const items = source.slice(start, start + pageSize);
      const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
      return { page, pageSize, total: source.length, items, nextCursor, mode: 'page' as const };
    }
    const cursorIndex = source.findIndex(item => item.id === cursor);
    const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const items = source.slice(start, start + pageSize);
    const nextCursor = items.length > 0 ? items[items.length - 1].id : null;
    return { page: 1, pageSize, total: source.length, items, nextCursor, mode: 'cursor' as const };
  };
  const appendAuditLog = (
    actorUserId: string,
    action: string,
    targetType: PersistedState['auditLogs'][number]['targetType'],
    targetId: string,
    metadata?: Record<string, unknown>
  ) => {
    const prevHash = auditLogs[0]?.hash || 'GENESIS';
    const timestamp = Date.now();
    const payload = `${prevHash}:${actorUserId}:${action}:${targetType}:${targetId}:${timestamp}:${JSON.stringify(metadata || {})}`;
    const hash = crypto.createHash('sha256').update(payload).digest('hex');
    auditLogs.unshift({
      id: `audit_${Math.random().toString(36).slice(2, 9)}`,
      actorUserId,
      action,
      targetType,
      targetId,
      metadata,
      timestamp,
      prevHash,
      hash
    });
  };
  const createRiskEvent = (
    type: 'HIGH_FREQUENCY_RECHARGE' | 'ORDER_DISPUTE' | 'NEGATIVE_BALANCE',
    relatedEntityId: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH',
    description: string
  ) => {
    riskEvents.unshift({
      id: `risk_${Math.random().toString(36).slice(2, 9)}`,
      type,
      relatedEntityId,
      severity,
      status: 'OPEN',
      description,
      createdAt: Date.now()
    });
  };
  const sendError = (
    res: express.Response,
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) => {
    return res.status(status).json({
      error: { code, message, ...(details ? { details } : {}) },
      legacyError: message
    });
  };
  const authMiddleware: express.RequestHandler = async (req, res, next) => {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
    if (token.includes('.')) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        (req as any).authUserId = payload.sub;
        (req as any).authUser = getUserById(payload.sub) || null;
        return next();
      }
    }
    const session = sessions[token];
    if (!session || session.expiresAt < Date.now()) {
      return sendError(res, 401, 'AUTH_UNAUTHORIZED', 'Unauthorized');
    }
    (req as any).authUserId = session.userId;
    (req as any).authUser = getUserById(session.userId) || null;
    next();
  };
  const requireAdmin = (permission?: AdminPermission): express.RequestHandler => {
    return (req, res, next) => {
      const user = (req as any).authUser as { role?: UserRole; permissions?: AdminPermission[]; id?: string } | null;
      if (!user || user.role !== 'ADMIN') {
        return sendError(res, 403, 'AUTH_ADMIN_ONLY', 'Admin only');
      }
      if (permission && !(user.permissions || []).includes(permission)) {
        return sendError(res, 403, 'AUTH_PERMISSION_DENIED', `Permission denied: ${permission}`, { permission });
      }
      next();
    };
  };

  const appContext: AppContext = {
    rechargePackages: RECHARGE_PACKAGES,
    rechargeOrders,
    wallets,
    walletTransactions,
    diamondWallets,
    dailyRechargeLimits,
    maxDailyRecharge: MAX_DAILY_RECHARGE,
    users,
    sessions,
    companions,
    orders,
    reviews,
    riskEvents,
    auditLogs,
    withdrawalRequests,
    moderationReports,
    couponTemplates,
    couponGrants,
    deviceBans,
    exposureLogs,
    tickets,
    exposureImpressions24h,
    exposureClicks24h,
    persistState,
    authMiddleware,
    requireAdmin,
    sendError,
    createToken,
    getUserById,
    toPublicUser,
    getWallet,
    addCoins,
    addDiamonds,
    getBanError,
    lifetimeRechargeUsdForUser,
    adjustCoinsDelta,
    adjustDiamondDelta,
    appendAuditLog,
    createRiskEvent,
  };

  registerAuthRoutes(app, appContext);
  registerBusinessRoutes(app, appContext);

  const enrichOrder = (o: (typeof orders)[number]) => {
    const buyer = users.find(u => u.id === o.userId);
    const cp = companions.find(c => c.id === o.companionId);
    const cpUser = cp ? users.find(u => u.id === cp.userId) : undefined;
    return {
      ...o,
      buyerUsername: buyer?.username,
      companionGameName: cp?.gameName,
      companionUsername: cpUser?.username
    };
  };

  const publicUserFields = (u: (typeof users)[number]) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    gender: u.gender ?? 'U',
    phone: u.phone || '',
    country: u.country || '',
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt ?? u.createdAt,
    accountStatus: u.accountStatus ?? 'ACTIVE',
    followCount: u.followCount ?? 0,
    deviceId: u.deviceId || '',
    deviceModel: u.deviceModel || '',
    banModules: u.banModules || {}
  });

  // --- Admin Domain API ---
  app.get('/api/admin/dashboard', authMiddleware, requireAdmin(), (req, res) => {
    const openRisks = riskEvents.filter(event => event.status === 'OPEN');
    const unresolvedDisputes = orders.filter(order => order.status === 'DISPUTED');
    const rechargePending = rechargeOrders.filter(order => order.status === 'PENDING');
    res.json({
      me: toPublicUser((req as any).authUser),
      metrics: {
        companionsPending: companions.filter(c => c.status === 'PENDING').length,
        ordersDisputed: unresolvedDisputes.length,
        reviewsRejected: reviews.filter(review => review.status === 'REJECTED').length,
        openRiskEvents: openRisks.length,
        rechargePending: rechargePending.length
      },
      latestAuditLogs: auditLogs.slice(0, 30)
    });
  });

  app.get('/api/admin/role-templates', authMiddleware, requireAdmin(), (req, res) => {
    res.json(ROLE_TEMPLATES);
  });

  app.post('/api/admin/users/:id/role-template', authMiddleware, requireAdmin(), (req, res) => {
    const user = users.find(item => item.id === req.params.id);
    if (!user) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    if (user.role !== 'ADMIN') return sendError(res, 400, 'ADMIN_TARGET_NOT_ADMIN', 'Target user is not admin');
    const roleTemplate = req.body?.roleTemplate as AdminRoleTemplate;
    if (!roleTemplate || !ROLE_TEMPLATES[roleTemplate]) {
      return sendError(res, 400, 'ADMIN_ROLE_TEMPLATE_INVALID', 'Invalid roleTemplate');
    }
    user.adminRoleTemplate = roleTemplate;
    user.permissions = [...ROLE_TEMPLATES[roleTemplate]];
    appendAuditLog((req as any).authUserId, 'ADMIN_ROLE_TEMPLATE_UPDATE', 'finance', user.id, { roleTemplate });
    persistState();
    res.json(toPublicUser(user));
  });

  app.get('/api/admin/companions', authMiddleware, requireAdmin('COMPANION_REVIEW'), (req, res) => {
    const q = String(req.query.q || '').toLowerCase();
    const status = String(req.query.status || '');
    const sortBy = String(req.query.sortBy || 'updatedAt') as 'updatedAt' | 'createdAt' | 'hourlyRate' | 'status' | 'id';
    const sortDir = parseSortDir(req.query.sortDir);
    const filtered = companions.filter(item => {
      const matchQ = !q || item.id.toLowerCase().includes(q) || item.gameName.toLowerCase().includes(q);
      const matchStatus = !status || item.status === status;
      return matchQ && matchStatus;
    });
    const sorted = sortByKey(filtered, sortBy, sortDir);
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/companions/:id/review', authMiddleware, requireAdmin('COMPANION_REVIEW'), (req, res) => {
    const companion = companions.find(item => item.id === req.params.id);
    if (!companion) return sendError(res, 404, 'COMPANION_NOT_FOUND', 'Companion not found');
    const action = req.body?.action as 'APPROVE' | 'REJECT';
    if (!action) return sendError(res, 400, 'ADMIN_ACTION_REQUIRED', 'action required');
    companion.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    companion.updatedAt = Date.now();
    appendAuditLog((req as any).authUserId, `COMPANION_${action}`, 'companion', companion.id, { status: companion.status });
    persistState();
    res.json(companion);
  });

  app.patch('/api/admin/companions/:id/operator', authMiddleware, requireAdmin('COMPANION_REVIEW'), zValidate(AdminOperatorPatchSchema), (req, res) => {
    const companion = companions.find(item => item.id === req.params.id);
    if (!companion) return sendError(res, 404, 'COMPANION_NOT_FOUND', 'Companion not found');
    const body = (req as express.Request & { validatedBody: { hourlyRate?: number; services?: Array<{ id: string; name: string; unitPrice: number; unit: string }> } }).validatedBody;
    const hourlyRate = body.hourlyRate;
    const services = body.services;
    const nextRate = typeof hourlyRate === 'number' && hourlyRate > 0
      ? hourlyRate
      : Array.isArray(services) && services.length > 0
        ? services[0].unitPrice
        : companion.hourlyRate;
    const level = levelFromHourlyRate(nextRate);
    const band = assertRateInLevelBand(level, nextRate);
    if (!band.ok) {
      return sendError(res, 422, 'PRICE_OUT_OF_LEVEL_BAND', 'hourlyRate out of level band', { band: band.band, level });
    }
    if (typeof hourlyRate === 'number' && hourlyRate > 0) {
      companion.hourlyRate = hourlyRate;
    }
    if (Array.isArray(services) && services.length > 0) {
      companion.services = services;
      companion.hourlyRate = services[0].unitPrice;
    }
    companion.updatedAt = Date.now();
    appendAuditLog((req as any).authUserId, 'COMPANION_OPERATOR_UPDATE', 'companion', companion.id, {
      hourlyRate: companion.hourlyRate,
      services: companion.services
    });
    persistState();
    res.json(companion);
  });

  app.get('/api/admin/orders', authMiddleware, requireAdmin('ORDER_OPERATE'), (req, res) => {
    const q = String(req.query.q || '').toLowerCase();
    const status = String(req.query.status || '');
    const sortBy = String(req.query.sortBy || 'updatedAt') as 'updatedAt' | 'createdAt' | 'totalPrice' | 'status' | 'id';
    const sortDir = parseSortDir(req.query.sortDir);
    const filtered = orders.filter(item => {
      const matchQ = !q || item.id.toLowerCase().includes(q) || item.serviceName.toLowerCase().includes(q);
      const matchStatus = !status || item.status === status;
      return matchQ && matchStatus;
    });
    const sorted = sortByKey(filtered, sortBy, sortDir);
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/orders/:id/action', authMiddleware, requireAdmin('ORDER_OPERATE'), (req, res) => {
    const order = orders.find(item => item.id === req.params.id);
    if (!order) return sendError(res, 404, 'ORDER_NOT_FOUND', 'Order not found');
    const action = req.body?.action as 'FORCE_CANCEL' | 'RESOLVE_DISPUTE';
    if (!action) return sendError(res, 400, 'ADMIN_ACTION_REQUIRED', 'action required');
    if (action === 'FORCE_CANCEL') {
      order.status = 'CANCELLED';
      order.cancelledAt = Date.now();
      order.updatedAt = Date.now();
    } else {
      order.status = 'COMPLETED';
      order.updatedAt = Date.now();
      const relatedOpenRisk = riskEvents.find(event => event.relatedEntityId === order.id && event.status === 'OPEN');
      if (relatedOpenRisk) {
        relatedOpenRisk.status = 'RESOLVED';
        relatedOpenRisk.resolvedAt = Date.now();
        relatedOpenRisk.resolvedBy = (req as any).authUserId;
      }
    }
    appendAuditLog((req as any).authUserId, `ORDER_${action}`, 'order', order.id, { status: order.status });
    persistState();
    res.json(order);
  });

  app.get('/api/admin/reviews', authMiddleware, requireAdmin('REVIEW_MODERATE'), (req, res) => {
    const q = String(req.query.q || '').toLowerCase();
    const status = String(req.query.status || '');
    const sortBy = String(req.query.sortBy || 'updatedAt') as 'updatedAt' | 'createdAt' | 'rating' | 'status' | 'id';
    const sortDir = parseSortDir(req.query.sortDir);
    const filtered = reviews.filter(item => {
      const matchQ = !q || item.id.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
      const matchStatus = !status || item.status === status;
      return matchQ && matchStatus;
    });
    const sorted = sortByKey(filtered, sortBy, sortDir);
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/reviews/:id/moderate', authMiddleware, requireAdmin('REVIEW_MODERATE'), (req, res) => {
    const review = reviews.find(item => item.id === req.params.id);
    if (!review) return sendError(res, 404, 'REVIEW_NOT_FOUND', 'Review not found');
    const action = req.body?.action as 'APPROVE' | 'REJECT';
    if (!action) return sendError(res, 400, 'ADMIN_ACTION_REQUIRED', 'action required');
    review.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    review.updatedAt = Date.now();
    review.moderationReason = req.body?.reason || review.moderationReason;
    appendAuditLog((req as any).authUserId, `REVIEW_${action}`, 'review', review.id, { reason: review.moderationReason });
    persistState();
    res.json(review);
  });

  app.get('/api/admin/risk-events', authMiddleware, requireAdmin('RISK_REVIEW'), (req, res) => {
    const status = String(req.query.status || '');
    const severity = String(req.query.severity || '');
    const sortBy = String(req.query.sortBy || 'createdAt') as 'createdAt' | 'resolvedAt' | 'severity' | 'status' | 'id';
    const sortDir = parseSortDir(req.query.sortDir);
    const filtered = riskEvents.filter(item => {
      const matchStatus = !status || item.status === status;
      const matchSeverity = !severity || item.severity === severity;
      return matchStatus && matchSeverity;
    });
    const sorted = sortByKey(filtered, sortBy, sortDir);
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/risk-events/:id/resolve', authMiddleware, requireAdmin('RISK_REVIEW'), (req, res) => {
    const event = riskEvents.find(item => item.id === req.params.id);
    if (!event) return sendError(res, 404, 'RISK_EVENT_NOT_FOUND', 'Risk event not found');
    event.status = 'RESOLVED';
    event.resolvedAt = Date.now();
    event.resolvedBy = (req as any).authUserId;
    appendAuditLog((req as any).authUserId, 'RISK_RESOLVE', 'risk', event.id, { type: event.type });
    persistState();
    res.json(event);
  });

  app.get('/api/admin/finance/reconciliation', authMiddleware, requireAdmin('FINANCE_RECON'), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const txRecords = walletTransactions.filter(tx => tx.timestamp >= start && tx.timestamp <= end);
    const completedOrders = orders.filter(order => order.status === 'COMPLETED' && (order.completedAt || 0) >= start && (order.completedAt || 0) <= end);
    const successfulRecharges = rechargeOrders.filter(order => order.status === 'SUCCESS' && order.timestamp >= start && order.timestamp <= end);
    const totalRechargeUsd = successfulRecharges.reduce((sum, order) => sum + order.amount, 0);
    const totalOrderCoins = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalRefundCoins = txRecords.filter(tx => tx.type === 'REFUND').reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const totalIncomeCoins = txRecords.filter(tx => tx.type === 'INCOME').reduce((sum, tx) => sum + tx.amount, 0);
    res.json({
      range: { start, end },
      summary: {
        totalRechargeUsd,
        totalOrderCoins,
        totalRefundCoins,
        totalIncomeCoins
      },
      records: txRecords.slice(0, 300)
    });
  });

  app.get('/api/admin/audit-logs', authMiddleware, requireAdmin(), (req, res) => {
    const action = String(req.query.action || '');
    const actorUserId = String(req.query.actorUserId || '');
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const sortBy = String(req.query.sortBy || 'timestamp') as 'timestamp' | 'action' | 'actorUserId' | 'targetType' | 'id';
    const sortDir = parseSortDir(req.query.sortDir);
    const filtered = auditLogs.filter(log => {
      const matchAction = !action || log.action === action;
      const matchActor = !actorUserId || log.actorUserId === actorUserId;
      const matchTime = log.timestamp >= start && log.timestamp <= end;
      return matchAction && matchActor && matchTime;
    });
    const sorted = sortByKey(filtered, sortBy, sortDir);
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.get('/api/admin/audit-logs/report', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const scoped = auditLogs.filter(log => log.timestamp >= start && log.timestamp <= end);
    const actorMap: Record<string, { actorUserId: string; actionCount: number; lastActionAt: number; actionTypes: Record<string, number> }> = {};
    scoped.forEach(log => {
      if (!actorMap[log.actorUserId]) {
        actorMap[log.actorUserId] = { actorUserId: log.actorUserId, actionCount: 0, lastActionAt: 0, actionTypes: {} };
      }
      const row = actorMap[log.actorUserId];
      row.actionCount += 1;
      row.lastActionAt = Math.max(row.lastActionAt, log.timestamp);
      row.actionTypes[log.action] = (row.actionTypes[log.action] || 0) + 1;
    });
    res.json({
      range: { start, end },
      totalLogs: scoped.length,
      actors: Object.values(actorMap).sort((a, b) => b.actionCount - a.actionCount)
    });
  });

  app.get('/api/admin/audit-logs/export', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const filtered = auditLogs.filter(log => log.timestamp >= start && log.timestamp <= end);
    const rows = [
      'id,actorUserId,action,targetType,targetId,timestamp,prevHash,hash',
      ...filtered.map(log =>
        [log.id, log.actorUserId, log.action, log.targetType, log.targetId, log.timestamp, log.prevHash, log.hash]
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
    res.send(rows.join('\n'));
  });

  const reportTime = (o: (typeof orders)[number]) => o.completedAt || o.updatedAt || o.createdAt;

  app.get('/api/admin/operations/users', authMiddleware, requireAdmin(), (req, res) => {
    try {
      const q = String(req.query.q || '').toLowerCase();
      const status = String(req.query.status || '');
      const filtered = users.filter(u => {
        const st = u.accountStatus || 'ACTIVE';
        const matchQ =
          !q ||
          u.id.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        const matchStatus = !status || st === status;
        return matchQ && matchStatus;
      });
      const sortDir = parseSortDir(req.query.sortDir);
      const sorted = sortByKey(filtered, 'createdAt', sortDir);
      const pageItems = sorted.map(u => ({
        ...publicUserFields(u),
        coins: getWallet(u.id).balance,
        diamonds: diamondWallets?.[u.id]?.balance ?? 0,
        lifetimeRechargeUsd: lifetimeRechargeUsdForUser(u.id),
        isCompanion: !!companions.find(c => c.userId === u.id && c.status === 'APPROVED')
      }));
      res.json(cursorPaginate(pageItems, req.query.page, req.query.pageSize, req.query.cursor));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[admin/operations/users]', err);
      res.status(500).json({ error: { code: 'ADMIN_OPERATIONS_USERS_FAILED', message }, legacyError: message });
    }
  });

  app.get('/api/admin/operations/users/:id', authMiddleware, requireAdmin(), (req, res) => {
    const u = users.find(x => x.id === req.params.id);
    if (!u) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    const cp = companions.find(c => c.userId === u.id);
    const ordersAsBuyer = orders.filter(o => o.userId === u.id).map(enrichOrder);
    const ordersAsCompanion = cp ? orders.filter(o => o.companionId === cp.id).map(enrichOrder) : [];
    const txs = walletTransactions.filter(t => t.userId === u.id).slice(0, 200);
    const recharges = rechargeOrders.filter(r => r.userId === u.id).slice(0, 150);
    res.json({
      user: publicUserFields(u),
      wallet: getWallet(u.id),
      diamondWallet: diamondWallets[u.id] || { userId: u.id, balance: 0, lastUpdated: Date.now() },
      lifetimeRechargeUsd: lifetimeRechargeUsdForUser(u.id),
      companion: cp || null,
      ordersAsBuyer,
      ordersAsCompanion,
      transactions: txs,
      recharges
    });
  });

  app.post('/api/admin/operations/users/:id/wallet-adjust', authMiddleware, requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const u = users.find(x => x.id === req.params.id);
    if (!u) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    const coinDelta = Number(req.body?.coinDelta || 0);
    const diamondDelta = Number(req.body?.diamondDelta || 0);
    const reason = String(req.body?.reason || '').trim();
    if (!reason) return sendError(res, 400, 'ADMIN_REASON_REQUIRED', 'reason required');
    if (coinDelta === 0 && diamondDelta === 0) return sendError(res, 400, 'ADMIN_WALLET_DELTA_REQUIRED', 'coinDelta or diamondDelta required');
    if (coinDelta !== 0) {
      const r = adjustCoinsDelta(u.id, coinDelta, `adm_${Date.now()}`, `[后台调账] ${reason}`);
      if (!r.ok) return sendError(res, 400, 'WALLET_ADJUST_FAILED', r.error);
    }
    if (diamondDelta !== 0) {
      const r = adjustDiamondDelta(u.id, diamondDelta, `adm_d_${Date.now()}`, `[后台调账-钻石] ${reason}`);
      if (!r.ok) return sendError(res, 400, 'WALLET_ADJUST_FAILED', r.error);
    }
    appendAuditLog((req as any).authUserId, 'USER_WALLET_ADJUST', 'user', u.id, { coinDelta, diamondDelta, reason });
    persistState();
    res.json({ ok: true, wallet: getWallet(u.id), diamondWallet: diamondWallets[u.id] || { userId: u.id, balance: 0, lastUpdated: Date.now() } });
  });

  app.post('/api/admin/operations/users/:id/voucher', authMiddleware, requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const u = users.find(x => x.id === req.params.id);
    if (!u) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    const coins = Number(req.body?.coins || 0);
    const code = String(req.body?.code || 'MANUAL');
    if (!Number.isFinite(coins) || coins <= 0) return sendError(res, 400, 'ADMIN_VOUCHER_COINS_INVALID', 'coins must be positive');
    const ref = `voucher_${Date.now()}`;
    const r = adjustCoinsDelta(u.id, coins, ref, `[代金券] ${code}`);
    if (!r.ok) return sendError(res, 400, 'ADMIN_VOUCHER_GRANT_FAILED', r.error);
    appendAuditLog((req as any).authUserId, 'USER_VOUCHER_GRANT', 'user', u.id, { coins, code });
    persistState();
    res.json({ ok: true, wallet: getWallet(u.id) });
  });

  app.post('/api/admin/operations/users/:id/account-status', authMiddleware, requireAdmin(), (req, res) => {
    const u = users.find(x => x.id === req.params.id);
    if (!u) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    if (u.role === 'ADMIN') return sendError(res, 400, 'ADMIN_ACCOUNT_STATUS_FORBIDDEN', 'Cannot change admin account here');
    const nextStatus = req.body?.accountStatus as AccountStatus | undefined;
    if (!nextStatus || !['ACTIVE', 'FROZEN', 'RISK_HOLD'].includes(nextStatus)) {
      return sendError(res, 400, 'ADMIN_ACCOUNT_STATUS_INVALID', 'Invalid accountStatus');
    }
    u.accountStatus = nextStatus;
    if (req.body?.banModules && typeof req.body.banModules === 'object') {
      u.banModules = req.body.banModules as (typeof u)['banModules'];
    }
    appendAuditLog((req as any).authUserId, 'USER_ACCOUNT_STATUS', 'user', u.id, {
      accountStatus: u.accountStatus,
      banModules: u.banModules
    });
    persistState();
    res.json(publicUserFields(u));
  });

  app.post('/api/admin/operations/users/:id/profile', authMiddleware, requireAdmin(), (req, res) => {
    const u = users.find(x => x.id === req.params.id);
    if (!u) return sendError(res, 404, 'ADMIN_USER_NOT_FOUND', 'User not found');
    if (u.role === 'ADMIN') return sendError(res, 400, 'ADMIN_PROFILE_EDIT_FORBIDDEN', 'Cannot edit admin profile here');
    const { username, gender, phone, country } = req.body || {};
    if (typeof username === 'string' && username.trim()) {
      if (users.some(x => x.id !== u.id && x.username === username.trim())) {
        return sendError(res, 409, 'ADMIN_USERNAME_TAKEN', 'Username taken');
      }
      u.username = username.trim();
    }
    if (gender === 'M' || gender === 'F' || gender === 'U') u.gender = gender;
    if (typeof phone === 'string') u.phone = phone;
    if (typeof country === 'string') u.country = country;
    appendAuditLog((req as any).authUserId, 'USER_PROFILE_UPDATE', 'user', u.id, { username: u.username, gender: u.gender });
    persistState();
    res.json(publicUserFields(u));
  });

  app.get('/api/admin/operations/withdrawals', authMiddleware, requireAdmin('FINANCE_RECON'), (req, res) => {
    const status = String(req.query.status || '');
    const filtered = withdrawalRequests.filter(w => !status || w.status === status);
    const sorted = sortByKey(filtered, 'createdAt', 'desc');
    const enriched = sorted.map(w => ({
      ...w,
      username: users.find(u => u.id === w.userId)?.username
    }));
    res.json(cursorPaginate(enriched, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/operations/withdrawals/:id/review', authMiddleware, requireAdmin('FINANCE_RECON'), (req, res) => {
    const w = withdrawalRequests.find(x => x.id === req.params.id);
    if (!w) return sendError(res, 404, 'WITHDRAWAL_NOT_FOUND', 'Withdrawal not found');
    if (w.status !== 'PENDING') return sendError(res, 400, 'WITHDRAWAL_NOT_PENDING', 'Not pending');
    const decision = req.body?.decision as 'APPROVE' | 'REJECT';
    if (!decision || !['APPROVE', 'REJECT'].includes(decision)) return sendError(res, 400, 'WITHDRAWAL_DECISION_REQUIRED', 'decision APPROVE|REJECT required');
    const note = String(req.body?.note || '');
    if (decision === 'APPROVE') {
      const bal = diamondWallets[w.userId]?.balance ?? 0;
      if (bal < w.diamondAmount) return sendError(res, 400, 'WALLET_INSUFFICIENT_DIAMONDS', 'Insufficient diamond balance');
      const r = adjustDiamondDelta(w.userId, -w.diamondAmount, w.id, `提现通过 ${w.id}`);
      if (!r.ok) return sendError(res, 400, 'WITHDRAWAL_REVIEW_FAILED', r.error);
      w.status = 'APPROVED';
    } else {
      w.status = 'REJECTED';
    }
    w.reviewedAt = Date.now();
    w.reviewedBy = (req as any).authUserId;
    w.adminNote = note;
    appendAuditLog((req as any).authUserId, `WITHDRAW_${decision}`, 'withdrawal', w.id, { status: w.status, note });
    persistState();
    res.json(w);
  });

  app.get('/api/admin/operations/reports', authMiddleware, requireAdmin('REVIEW_MODERATE'), (req, res) => {
    const status = String(req.query.status || '');
    const filtered = moderationReports.filter(r => !status || r.status === status);
    const sorted = sortByKey(filtered, 'createdAt', 'desc');
    const enriched = sorted.map(r => ({
      ...r,
      reporterUsername: users.find(u => u.id === r.reporterUserId)?.username
    }));
    res.json(cursorPaginate(enriched, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.post('/api/admin/operations/reports/:id/resolve', authMiddleware, requireAdmin('REVIEW_MODERATE'), (req, res) => {
    const r = moderationReports.find(x => x.id === req.params.id);
    if (!r) return sendError(res, 404, 'REPORT_NOT_FOUND', 'Report not found');
    const status = req.body?.status as 'RESOLVED' | 'DISMISSED';
    if (!status || !['RESOLVED', 'DISMISSED'].includes(status)) return sendError(res, 400, 'REPORT_STATUS_INVALID', 'status RESOLVED|DISMISSED required');
    r.status = status;
    r.resolutionNote = String(req.body?.note || '');
    appendAuditLog((req as any).authUserId, 'REPORT_RESOLVE', 'report', r.id, { status: r.status });
    persistState();
    res.json(r);
  });

  app.get('/api/admin/reports/overview', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || Date.now() - 30 * 86400000);
    const end = Number(req.query.end || Date.now());
    const rechargesOk = rechargeOrders.filter(o => o.status === 'SUCCESS' && o.timestamp >= start && o.timestamp <= end);
    const rechargeUserIds = new Set(rechargesOk.map(o => o.userId));
    const orderPlacers = new Set(
      orders.filter(o => o.createdAt >= start && o.createdAt <= end).map(o => o.userId)
    );
    const completed = orders.filter(o => o.status === 'COMPLETED' && reportTime(o) >= start && reportTime(o) <= end);
    const platformCoins = Object.values(wallets).reduce((s, w) => s + w.balance, 0);
    const platformDiamonds = Object.values(diamondWallets).reduce((s, w) => s + w.balance, 0);
    const diamondIncome = walletTransactions
      .filter(t => t.timestamp >= start && t.timestamp <= end && t.type === 'INCOME' && typeof t.amount === 'number' && t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const metrics = aggregateDashboardMetrics(exposureLogs, walletTransactions, users, start, end);
    res.json({
      range: { start, end },
      totalRechargeUsd: rechargesOk.reduce((s, o) => s + o.amount, 0),
      rechargeUserCount: rechargeUserIds.size,
      orderPlacerCount: orderPlacers.size,
      completedOrderCount: completed.length,
      completedOrderCoins: completed.reduce((s, o) => s + o.totalPrice, 0),
      giftCoins: metrics.giftCoins,
      visitors: metrics.visitors,
      ctr: metrics.ctr,
      cvr: metrics.cvr,
      day1Retention: metrics.day1Retention,
      day7Retention: metrics.day7Retention,
      diamondIncomeApprox: diamondIncome,
      platformCoins,
      platformDiamonds
    });
  });

  app.get('/api/admin/reports/recharges', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const userId = String(req.query.userId || '');
    const filtered = rechargeOrders.filter(
      o => o.timestamp >= start && o.timestamp <= end && (!userId || o.userId === userId)
    );
    const enriched = filtered.map(o => ({
      ...o,
      username: users.find(u => u.id === o.userId)?.username
    }));
    const sorted = sortByKey(enriched, 'timestamp', 'desc');
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.get('/api/admin/reports/orders', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const filtered = orders.filter(o => {
      const ts = reportTime(o);
      return ts >= start && ts <= end;
    });
    const enriched = filtered.map(enrichOrder);
    const sorted = sortByKey(enriched, 'updatedAt', 'desc');
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.get('/api/admin/reports/withdrawals', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const filtered = withdrawalRequests.filter(w => w.createdAt >= start && w.createdAt <= end);
    const enriched = filtered.map(w => ({
      ...w,
      username: users.find(u => u.id === w.userId)?.username
    }));
    const sorted = sortByKey(enriched, 'createdAt', 'desc');
    res.json(cursorPaginate(sorted, req.query.page, req.query.pageSize, req.query.cursor));
  });

  app.get('/api/admin/reports/companions', authMiddleware, requireAdmin(), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const rows = companions
      .filter(c => c.status === 'APPROVED')
      .map(c => {
        const related = orders.filter(o => o.companionId === c.id);
        const completed = related.filter(o => o.status === 'COMPLETED' && reportTime(o) >= start && reportTime(o) <= end);
        const disputed = related.filter(o => o.status === 'DISPUTED' && reportTime(o) >= start && reportTime(o) <= end);
        const revs = reviews.filter(r => r.companionId === c.id && r.status === 'APPROVED');
        const avg = revs.length ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0;
        const u = users.find(x => x.id === c.userId);
        return {
          companionId: c.id,
          userId: c.userId,
          username: u?.username,
          gameName: c.gameName,
          serviceCount: (c.services && c.services.length) || 1,
          completedOrders: completed.length,
          disputedOrders: disputed.length,
          ratingAvg: Math.round(avg * 100) / 100,
          ratingCount: revs.length,
          orderIncomeCoins: completed.reduce((s, o) => s + o.totalPrice, 0),
          giftIncomeCoins: 0,
          visitors: u?.followCount ?? 0
        };
      });
    res.json({ range: { start, end }, items: rows });
  });

  app.get('/api/admin/reports/recharge-risk', authMiddleware, requireAdmin('RISK_REVIEW'), (req, res) => {
    const start = Number(req.query.start || 0);
    const end = Number(req.query.end || Date.now());
    const scoped = riskEvents.filter(
      e => e.type === 'HIGH_FREQUENCY_RECHARGE' && e.createdAt >= start && e.createdAt <= end
    );
    const items = scoped.map(e => {
      const ro = rechargeOrders.find(o => o.id === e.relatedEntityId);
      const u = ro ? users.find(x => x.id === ro.userId) : undefined;
      const lifetime = ro ? lifetimeRechargeUsdForUser(ro.userId) : 0;
      return {
        riskEvent: e,
        recharge: ro || null,
        username: u?.username,
        lifetimeRechargeUsd: lifetime,
        triggerReason: ro?.riskReason || e.description
      };
    });
    res.json({ range: { start, end }, items });
  });

  registerFinanceRoutes(app, appContext);

  registerOpsRoutes(app, {
    sendError,
    authMiddleware,
    requireAdmin,
    getUserById,
    couponTemplates,
    couponGrants,
    deviceBans,
    exposureLogs,
    tickets,
    walletTransactions,
    persistState,
    appendAuditLog,
  });

  registerUploadRoutes(app, appContext);

  startSettlementCron(async weekKey => {
    logger.info({ weekKey }, 'settlement_cron_tick');
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distCandidates = [path.join(process.cwd(), 'dist'), path.join(process.cwd(), 'client', 'dist')];
    const distPath = distCandidates.find(candidate => fs.existsSync(path.join(candidate, 'index.html')));
    if (!distPath) {
      throw new Error('Production build not found. Run npm run build before starting NODE_ENV=production.');
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info({ port: PORT }, 'server_started');
  });

  const gracefulShutdown = (signal: string) => {
    logger.info({ signal }, 'shutdown_started');
    shuttingDown = true;
    server.close(() => {
      logger.info('shutdown_complete');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 30_000).unref();
  };
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
