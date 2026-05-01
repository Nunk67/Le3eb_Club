import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  RechargePackage, 
  RechargeOrder, 
  Wallet, 
  WalletTransaction 
} from '../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'storage.json');
const STORAGE_SCHEMA_VERSION = 8;

type UserRole = 'USER' | 'PLAYER' | 'ADMIN';
type AccountStatus = 'ACTIVE' | 'FROZEN' | 'RISK_HOLD';
type BanModuleKey = 'ORDER' | 'ACCEPT_ORDER' | 'RECHARGE' | 'WITHDRAW' | 'CHAT' | 'POST';
type AdminPermission =
  | 'COMPANION_REVIEW'
  | 'ORDER_OPERATE'
  | 'REVIEW_MODERATE'
  | 'RISK_REVIEW'
  | 'FINANCE_RECON'
  | 'RECHARGE_MANUAL';
type AdminRoleTemplate = 'SUPER_ADMIN' | 'FINANCE_ADMIN' | 'RISK_ADMIN' | 'CONTENT_ADMIN';

const ROLE_TEMPLATES: Record<AdminRoleTemplate, AdminPermission[]> = {
  SUPER_ADMIN: ['COMPANION_REVIEW', 'ORDER_OPERATE', 'REVIEW_MODERATE', 'RISK_REVIEW', 'FINANCE_RECON', 'RECHARGE_MANUAL'],
  FINANCE_ADMIN: ['FINANCE_RECON', 'RECHARGE_MANUAL'],
  RISK_ADMIN: ['RISK_REVIEW', 'ORDER_OPERATE'],
  CONTENT_ADMIN: ['COMPANION_REVIEW', 'REVIEW_MODERATE']
};

type WithdrawalRequest = {
  id: string;
  userId: string;
  diamondAmount: number;
  feeUsd: number;
  payoutUsd: number;
  channel: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  adminNote?: string;
  orderRef?: string;
};

type ModerationReport = {
  id: string;
  reporterUserId: string;
  targetType: 'USER' | 'ORDER' | 'COMPANION';
  targetId: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: number;
  resolutionNote?: string;
};

type PersistedState = {
  schemaVersion: number;
  rechargeOrders: RechargeOrder[];
  wallets: Record<string, Wallet>;
  walletTransactions: WalletTransaction[];
  diamondWallets: Record<string, { userId: string; balance: number; lastUpdated: number }>;
  dailyRechargeLimits: Record<string, { amount: number; lastReset: number }>;
  users: Array<{
    id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    adminRoleTemplate?: AdminRoleTemplate;
    permissions?: AdminPermission[];
    createdAt: number;
    gender?: 'M' | 'F' | 'U';
    phone?: string;
    country?: string;
    lastLoginAt?: number;
    accountStatus?: AccountStatus;
    followCount?: number;
    deviceId?: string;
    deviceModel?: string;
    banModules?: Partial<Record<BanModuleKey, boolean>>;
  }>;
  sessions: Record<string, { token: string; userId: string; expiresAt: number }>;
  companions: Array<{
    id: string;
    userId: string;
    gameName: string;
    intro: string;
    hourlyRate: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    availability: 'ONLINE' | 'OFFLINE' | 'BUSY';
    createdAt: number;
    updatedAt: number;
    services?: Array<{ id: string; name: string; unitPrice: number; unit: string }>;
  }>;
  orders: Array<{
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
  }>;
  reviews: Array<{
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
  }>;
  riskEvents: Array<{
    id: string;
    type: 'HIGH_FREQUENCY_RECHARGE' | 'ORDER_DISPUTE' | 'NEGATIVE_BALANCE';
    relatedEntityId: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'RESOLVED';
    description: string;
    createdAt: number;
    resolvedAt?: number;
    resolvedBy?: string;
  }>;
  auditLogs: Array<{
    id: string;
    actorUserId: string;
    action: string;
    targetType:
      | 'companion'
      | 'order'
      | 'review'
      | 'risk'
      | 'finance'
      | 'recharge'
      | 'user'
      | 'withdrawal'
      | 'report';
    targetId: string;
    metadata?: Record<string, unknown>;
    timestamp: number;
    prevHash: string;
    hash: string;
  }>;
  withdrawalRequests: WithdrawalRequest[];
  moderationReports: ModerationReport[];
};

const defaultState = (): PersistedState => ({
  schemaVersion: STORAGE_SCHEMA_VERSION,
  rechargeOrders: [],
  wallets: {
    user_1: { userId: 'user_1', balance: 120, lastUpdated: Date.now() }
  },
  walletTransactions: [],
  diamondWallets: {},
  dailyRechargeLimits: {},
  users: [
    {
      id: 'user_1',
      username: 'demo_user',
      email: 'demo@le3eb.club',
      password: 'demo123',
      role: 'USER',
      createdAt: Date.now(),
      gender: 'U',
      accountStatus: 'ACTIVE',
      followCount: 0,
      lastLoginAt: Date.now()
    },
    {
      id: 'admin_1',
      username: 'ops_admin',
      email: 'admin@le3eb.club',
      password: 'admin123',
      role: 'ADMIN',
      adminRoleTemplate: 'SUPER_ADMIN',
      permissions: ['COMPANION_REVIEW', 'ORDER_OPERATE', 'REVIEW_MODERATE', 'RISK_REVIEW', 'FINANCE_RECON', 'RECHARGE_MANUAL'],
      createdAt: Date.now(),
      gender: 'U',
      accountStatus: 'ACTIVE',
      followCount: 0,
      lastLoginAt: Date.now()
    }
  ],
  sessions: {},
  companions: [],
  orders: [],
  reviews: [],
  riskEvents: [],
  auditLogs: [],
  withdrawalRequests: [],
  moderationReports: []
});

const migrateState = (raw: unknown): PersistedState => {
  const base = defaultState();
  const parsed = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const rawVersion = typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : 1;

  const merged: PersistedState = {
    ...base,
    ...parsed,
    schemaVersion: rawVersion
  } as PersistedState;

  // v1 -> v2: align missing timestamps in seed-like data.
  if (merged.schemaVersion < 2) {
    Object.values(merged.wallets).forEach(wallet => {
      if (!wallet.lastUpdated || wallet.lastUpdated <= 0) {
        wallet.lastUpdated = Date.now();
      }
    });
    merged.users.forEach(user => {
      if (!user.createdAt || user.createdAt <= 0) {
        user.createdAt = Date.now();
      }
    });
    merged.schemaVersion = 2;
  }

  // v2 -> v3: normalize mutable entities with updatedAt.
  if (merged.schemaVersion < 3) {
    merged.orders.forEach(order => {
      if (!order.updatedAt || order.updatedAt <= 0) {
        order.updatedAt = order.completedAt || order.startedAt || order.acceptedAt || order.createdAt || Date.now();
      }
    });
    merged.reviews.forEach(review => {
      if (!review.updatedAt || review.updatedAt <= 0) {
        review.updatedAt = review.createdAt || Date.now();
      }
    });
    merged.schemaVersion = 3;
  }

  // v3 -> v4: remove expired sessions during startup migration.
  if (merged.schemaVersion < 4) {
    Object.keys(merged.sessions).forEach(token => {
      const session = merged.sessions[token];
      if (!session || session.expiresAt <= Date.now()) {
        delete merged.sessions[token];
      }
    });
    merged.schemaVersion = 4;
  }

  // v4 -> v5: bootstrap admin domain state and permissions.
  if (merged.schemaVersion < 5) {
    const adminExists = merged.users.some(user => user.role === 'ADMIN');
    if (!adminExists) {
      merged.users.push({
        id: 'admin_1',
        username: 'ops_admin',
        email: 'admin@le3eb.club',
        password: 'admin123',
        role: 'ADMIN',
        permissions: ['COMPANION_REVIEW', 'ORDER_OPERATE', 'REVIEW_MODERATE', 'RISK_REVIEW', 'FINANCE_RECON', 'RECHARGE_MANUAL'],
        createdAt: Date.now()
      });
    }
    if (!Array.isArray((merged as any).riskEvents)) {
      (merged as any).riskEvents = [];
    }
    if (!Array.isArray((merged as any).auditLogs)) {
      (merged as any).auditLogs = [];
    }
    merged.users.forEach(user => {
      if (user.role === 'ADMIN' && (!user.permissions || user.permissions.length === 0)) {
        user.permissions = ['COMPANION_REVIEW', 'ORDER_OPERATE', 'REVIEW_MODERATE', 'RISK_REVIEW', 'FINANCE_RECON', 'RECHARGE_MANUAL'];
      }
    });
    merged.schemaVersion = 5;
  }

  // v5 -> v6: normalize admin role templates.
  if (merged.schemaVersion < 6) {
    merged.users.forEach(user => {
      if (user.role === 'ADMIN') {
        if (!user.adminRoleTemplate) {
          user.adminRoleTemplate = 'SUPER_ADMIN';
        }
        if (!user.permissions || user.permissions.length === 0) {
          user.permissions = ROLE_TEMPLATES[user.adminRoleTemplate];
        }
      }
    });
    merged.schemaVersion = 6;
  }

  if (merged.schemaVersion < 7) {
    // v6 -> v7 is backward compatible; no data transform required.
    merged.schemaVersion = 7;
  }

  if (merged.schemaVersion < 8) {
    if (!Array.isArray(merged.users)) {
      merged.users = [];
    }
    merged.users.forEach(user => {
      const u = user as (typeof merged.users)[number];
      if (!u.gender) u.gender = 'U';
      if (!u.accountStatus) u.accountStatus = 'ACTIVE';
      if (typeof u.followCount !== 'number') u.followCount = 0;
      if (!u.lastLoginAt) u.lastLoginAt = u.createdAt && u.createdAt > 0 ? u.createdAt : Date.now();
    });
    if (!Array.isArray(merged.companions)) {
      merged.companions = [];
    }
    merged.companions.forEach(c => {
      const row = c as (typeof merged.companions)[number];
      if (!row.services || row.services.length === 0) {
        row.services = [{ id: 'svc_default', name: `${row.gameName} 陪玩`, unitPrice: row.hourlyRate, unit: '小时' }];
      }
    });
    if (!Array.isArray((merged as any).withdrawalRequests)) {
      (merged as any).withdrawalRequests = [];
    }
    if (!Array.isArray((merged as any).moderationReports)) {
      (merged as any).moderationReports = [];
    }
    merged.schemaVersion = 8;
  }

  /** 若持久化文件里 users 被写成 [] 或损坏，避免后台「用户管理」全空 */
  if (!Array.isArray(merged.users) || merged.users.length === 0) {
    merged.users = structuredClone(base.users);
  }

  merged.schemaVersion = STORAGE_SCHEMA_VERSION;
  return merged;
};

const loadState = (): PersistedState => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const base = defaultState();
    fs.writeFileSync(DATA_FILE, JSON.stringify(base, null, 2), 'utf-8');
    return base;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateState(parsed);
    fs.writeFileSync(DATA_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
    return migrated;
  } catch (error) {
    console.error('Failed to load storage.json, fallback to default state:', error);
    return defaultState();
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Database ---
  const RECHARGE_PACKAGES: RechargePackage[] = [
    { id: 'pkg_1', amount: 0.99, coins: 60 },
    { id: 'pkg_2', amount: 4.99, coins: 300, bonus: 15 },
    { id: 'pkg_3', amount: 9.99, coins: 600, bonus: 45 },
    { id: 'pkg_4', amount: 19.99, coins: 1200, bonus: 120 },
    { id: 'pkg_5', amount: 49.99, coins: 3000, bonus: 450 },
    { id: 'pkg_6', amount: 99.99, coins: 6000, bonus: 1200 },
  ];

  const state = loadState();
  /** 防止 JSON 里显式 null 覆盖默认结构，导致 .find / .filter 抛错 → 管理端 500 */
  const sanitizePersistedState = (s: PersistedState) => {
    if (!Array.isArray(s.rechargeOrders)) (s as any).rechargeOrders = [];
    if (!Array.isArray(s.walletTransactions)) (s as any).walletTransactions = [];
    if (!s.wallets || typeof s.wallets !== 'object' || Array.isArray(s.wallets)) (s as any).wallets = {};
    if (!s.diamondWallets || typeof s.diamondWallets !== 'object' || Array.isArray(s.diamondWallets)) (s as any).diamondWallets = {};
    if (!s.dailyRechargeLimits || typeof s.dailyRechargeLimits !== 'object' || Array.isArray(s.dailyRechargeLimits)) {
      (s as any).dailyRechargeLimits = {};
    }
    if (!Array.isArray(s.users)) (s as any).users = [];
    if (!Array.isArray(s.companions)) (s as any).companions = [];
    if (!Array.isArray(s.orders)) (s as any).orders = [];
    if (!Array.isArray(s.reviews)) (s as any).reviews = [];
    if (!Array.isArray(s.riskEvents)) (s as any).riskEvents = [];
    if (!Array.isArray(s.auditLogs)) (s as any).auditLogs = [];
    if (!Array.isArray((s as any).withdrawalRequests)) (s as any).withdrawalRequests = [];
    if (!Array.isArray((s as any).moderationReports)) (s as any).moderationReports = [];
    if (!s.sessions || typeof s.sessions !== 'object' || Array.isArray(s.sessions)) (s as any).sessions = {};
  };
  sanitizePersistedState(state);

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
  const MODERATION_BLOCKLIST = ['诈骗', 'fraud', 'scam', '色情', 'porn'];
  const persistState = () => {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(
        {
          schemaVersion: STORAGE_SCHEMA_VERSION,
          rechargeOrders,
          wallets,
          walletTransactions,
          diamondWallets,
          dailyRechargeLimits,
          users,
          sessions,
          companions,
          orders,
          reviews,
          riskEvents,
          auditLogs,
          withdrawalRequests,
          moderationReports
        } satisfies PersistedState,
        null,
        2
      ),
      'utf-8'
    );
  };
  const ensureAdminSeed = () => {
    const existingAdmin = users.find(user => user.role === 'ADMIN');
    if (existingAdmin) {
      if (!existingAdmin.adminRoleTemplate) {
        existingAdmin.adminRoleTemplate = 'SUPER_ADMIN';
      }
      if (!existingAdmin.permissions || existingAdmin.permissions.length === 0) {
        existingAdmin.permissions = [...ROLE_TEMPLATES[existingAdmin.adminRoleTemplate]];
      }
      persistState();
      return;
    }
    users.push({
      id: 'admin_1',
      username: 'ops_admin',
      email: 'admin@le3eb.club',
      password: 'admin123',
      role: 'ADMIN',
      adminRoleTemplate: 'SUPER_ADMIN',
      permissions: [...ROLE_TEMPLATES.SUPER_ADMIN],
      createdAt: Date.now()
    });
    persistState();
    console.log('Admin seed user restored: admin@le3eb.club');
  };
  ensureAdminSeed();

  /** 至少保留一个可登录的非管理员账号，便于运营页有数据（与 defaultState 一致） */
  const ensureDemoBusinessUser = () => {
    const hasNonAdmin = users.some(u => u.role !== 'ADMIN');
    if (hasNonAdmin) return;
    const now = Date.now();
    users.push({
      id: 'user_1',
      username: 'demo_user',
      email: 'demo@le3eb.club',
      password: 'demo123',
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
    console.log('Demo user restored: demo@le3eb.club / demo123');
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
  const createToken = () => `sess_${Math.random().toString(36).slice(2, 12)}`;
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
  const authMiddleware: express.RequestHandler = (req, res, next) => {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
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

  // --- API Routes ---
  app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return sendError(res, 400, 'AUTH_REGISTER_FIELDS_REQUIRED', 'username/email/password required');
    }
    if (users.some(u => u.email === email)) {
      return sendError(res, 409, 'AUTH_EMAIL_EXISTS', 'Email already exists');
    }
    const user = {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      username,
      email,
      password,
      role: 'USER' as const,
      createdAt: Date.now(),
      gender: 'U' as const,
      accountStatus: 'ACTIVE' as const,
      followCount: 0,
      lastLoginAt: Date.now()
    };
    users.push(user);
    wallets[user.id] = { userId: user.id, balance: 0, lastUpdated: Date.now() };
    persistState();
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return sendError(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Invalid credentials');
    }
    user.lastLoginAt = Date.now();
    persistState();
    const token = createToken();
    sessions[token] = { token, userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
    persistState();
    res.json({ token, user: toPublicUser(user) });
  });

  app.get('/api/auth/session', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === (req as any).authUserId);
    if (!user) {
      return sendError(res, 404, 'AUTH_USER_NOT_FOUND', 'User not found');
    }
    res.json(toPublicUser(user));
  });

  app.post('/api/auth/logout', authMiddleware, (req, res) => {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
    if (token && sessions[token]) {
      delete sessions[token];
      persistState();
    }
    res.json({ ok: true });
  });

  app.post('/api/companions/apply', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const { gameName, intro, hourlyRate } = req.body || {};
    if (!gameName || !intro || typeof hourlyRate !== 'number') {
      return sendError(res, 400, 'COMPANION_APPLY_FIELDS_REQUIRED', 'gameName/intro/hourlyRate required');
    }
    const existing = companions.find(c => c.userId === userId);
    if (existing) {
      existing.gameName = gameName;
      existing.intro = intro;
      existing.hourlyRate = hourlyRate;
      existing.status = 'APPROVED';
      existing.updatedAt = Date.now();
      persistState();
      return res.json(existing);
    }
    const companion = {
      id: `cp_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      gameName,
      intro,
      hourlyRate,
      status: 'APPROVED' as const,
      availability: 'ONLINE' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    companions.push(companion);
    const user = users.find(u => u.id === userId);
    if (user) user.role = 'PLAYER';
    persistState();
    res.status(201).json(companion);
  });

  app.patch('/api/companions/:id/availability', authMiddleware, (req, res) => {
    const companion = companions.find(c => c.id === req.params.id);
    if (!companion) return sendError(res, 404, 'COMPANION_NOT_FOUND', 'Companion not found');
    if (companion.userId !== (req as any).authUserId) return sendError(res, 403, 'COMPANION_FORBIDDEN', 'Forbidden');
    const nextAvailability = req.body?.availability as 'ONLINE' | 'OFFLINE' | 'BUSY';
    if (!nextAvailability) return sendError(res, 400, 'COMPANION_AVAILABILITY_REQUIRED', 'availability required');
    companion.availability = nextAvailability;
    companion.updatedAt = Date.now();
    persistState();
    res.json(companion);
  });

  app.get('/api/companions', (req, res) => {
    const onlyAvailable = req.query.available === 'true';
    const list = companions.filter(c => c.status === 'APPROVED' && (!onlyAvailable || c.availability === 'ONLINE'));
    res.json(list);
  });

  app.get('/api/companions/rankings', (req, res) => {
    const limitRaw = Number(req.query.limit || 20);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.floor(limitRaw))) : 20;

    const rankingRows = companions
      .filter(c => c.status === 'APPROVED')
      .map(companion => {
        const companionOrders = orders.filter(o => o.companionId === companion.id);
        const completedOrders = companionOrders.filter(o => o.status === 'COMPLETED');
        const disputedOrders = companionOrders.filter(o => o.status === 'DISPUTED');
        const companionReviews = reviews.filter(r => r.companionId === companion.id && r.status === 'APPROVED');

        const completedOrderCount = completedOrders.length;
        const avgRating = companionReviews.length > 0
          ? companionReviews.reduce((sum, review) => sum + review.rating, 0) / companionReviews.length
          : 0;
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const totalOrderCount = companionOrders.length;
        const completionRate = totalOrderCount > 0 ? completedOrderCount / totalOrderCount : 0;

        const scoreBreakdown = {
          quality: Number((avgRating * 0.55).toFixed(4)),
          volume: Number((completedOrderCount * 0.25).toFixed(4)),
          fulfillment: Number((completionRate * 100 * 0.15).toFixed(4)),
          revenue: Number((totalRevenue * 0.0005).toFixed(4)),
          riskPenalty: Number((disputedOrders.length * 0.5).toFixed(4))
        };
        const poolTag = completedOrderCount >= 20
          ? 'HIGH_PERFORMING'
          : completedOrderCount >= 5
            ? 'STABLE'
            : 'NEW';

        // Composite score keeps ranking deterministic across low/high volume companions.
        const rankingScore = Number(
          (
            scoreBreakdown.quality +
            scoreBreakdown.volume +
            scoreBreakdown.fulfillment +
            scoreBreakdown.revenue -
            scoreBreakdown.riskPenalty
          ).toFixed(4)
        );

        return {
          companionId: companion.id,
          gameName: companion.gameName,
          hourlyRate: companion.hourlyRate,
          availability: companion.availability,
          avgRating: Number(avgRating.toFixed(2)),
          completedOrderCount,
          reviewCount: companionReviews.length,
          completionRate: Number(completionRate.toFixed(4)),
          totalRevenue,
          rankingScore,
          poolTag,
          scoreBreakdown
        };
      })
      .sort((a, b) => b.rankingScore - a.rankingScore || b.completedOrderCount - a.completedOrderCount || b.avgRating - a.avgRating);

    const ranked = rankingRows.slice(0, limit).map((row, index) => ({
      rank: index + 1,
      ...row
    }));

    res.json(ranked);
  });

  app.post('/api/orders', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const buyer = getUserById(userId);
    const ban = getBanError(buyer, 'ORDER');
    if (ban) return sendError(res, 403, 'ORDER_ACTION_BLOCKED', ban);
    const { companionId, serviceName, quantity } = req.body || {};
    const companion = companions.find(c => c.id === companionId && c.status === 'APPROVED');
    if (!companion) return sendError(res, 404, 'ORDER_COMPANION_NOT_FOUND', 'Companion not found');
    if (companion.availability !== 'ONLINE') return sendError(res, 409, 'ORDER_COMPANION_UNAVAILABLE', 'Companion unavailable');
    const qty = Number(quantity || 1);
    const totalPrice = companion.hourlyRate * qty;
    const userWallet = getWallet(userId);
    if (userWallet.balance < totalPrice) return sendError(res, 409, 'WALLET_INSUFFICIENT_BALANCE', 'Insufficient wallet balance');
    const order = {
      id: `ord_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      companionId,
      serviceName: serviceName || companion.gameName,
      quantity: qty,
      unitPrice: companion.hourlyRate,
      totalPrice,
      status: 'CREATED' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    orders.push(order);
    persistState();
    res.status(201).json(order);
  });

  app.get('/api/orders', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const list = orders.filter(
      o => o.userId === userId || (companion && o.companionId === companion.id)
    );
    res.json(list);
  });

  const updateOrderStatus = (
    orderId: string,
    allowedCurrent: Array<typeof orders[number]['status']>,
    nextStatus: typeof orders[number]['status'],
    actorUserId: string
  ) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { errorCode: 'ORDER_NOT_FOUND', errorMessage: 'Order not found', statusCode: 404 as const };
    const actorCompanion = companions.find(c => c.userId === actorUserId);
    const isCompanionOwner = actorCompanion?.id === order.companionId;
    const isUserOwner = order.userId === actorUserId;
    if (!isCompanionOwner && !isUserOwner) return { errorCode: 'ORDER_FORBIDDEN', errorMessage: 'Forbidden', statusCode: 403 as const };
    if (nextStatus === 'ACCEPTED' && isCompanionOwner) {
      const actorUser = getUserById(actorUserId);
      const ban = getBanError(actorUser, 'ACCEPT_ORDER');
      if (ban) return { errorCode: 'ORDER_ACTION_BLOCKED', errorMessage: ban, statusCode: 403 as const };
    }
    if (!allowedCurrent.includes(order.status)) {
      return {
        errorCode: 'ORDER_INVALID_TRANSITION',
        errorMessage: `Invalid transition from ${order.status}`,
        statusCode: 409 as const,
        details: { from: order.status, to: nextStatus }
      };
    }
    order.status = nextStatus;
    if (nextStatus === 'ACCEPTED') order.acceptedAt = Date.now();
    if (nextStatus === 'IN_SERVICE') order.startedAt = Date.now();
    if (nextStatus === 'COMPLETED') order.completedAt = Date.now();
    if (nextStatus === 'CANCELLED') order.cancelledAt = Date.now();
    order.updatedAt = Date.now();
    persistState();
    return { order };
  };

  app.post('/api/orders/:id/accept', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['CREATED'], 'ACCEPTED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/start', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['ACCEPTED'], 'IN_SERVICE', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/complete', authMiddleware, (req, res) => {
    const actorUserId = (req as any).authUserId as string;
    const result = updateOrderStatus(req.params.id, ['IN_SERVICE'], 'COMPLETED', actorUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    const order = result.order!;
    if (!order.settlementDone) {
      const wallet = getWallet(order.userId);
      wallet.balance -= order.totalPrice;
      wallet.lastUpdated = Date.now();
      walletTransactions.unshift({
        id: `tx_o_${Math.random().toString(36).slice(2, 9)}`,
        userId: order.userId,
        type: 'ORDER_PAY',
        amount: -order.totalPrice,
        balanceAfter: wallet.balance,
        referenceId: order.id,
        timestamp: Date.now(),
        description: `Order payment ${order.serviceName}`
      });
      const cp = companions.find(c => c.id === order.companionId);
      if (cp) addDiamonds(cp.userId, order.totalPrice, order.id, `Order income ${order.serviceName}`);
      order.settlementDone = true;
      persistState();
    }
    res.json(order);
  });

  app.post('/api/orders/:id/cancel', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['CREATED', 'ACCEPTED'], 'CANCELLED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/dispute', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['IN_SERVICE', 'COMPLETED'], 'DISPUTED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    result.order!.disputeReason = req.body?.reason || 'No reason provided';
    createRiskEvent('ORDER_DISPUTE', result.order!.id, 'MEDIUM', `Order dispute submitted: ${result.order!.disputeReason}`);
    persistState();
    res.json(result.order);
  });

  app.post('/api/reviews', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const { orderId, rating, content } = req.body || {};
    const order = orders.find(o => o.id === orderId);
    if (!order) return sendError(res, 404, 'ORDER_NOT_FOUND', 'Order not found');
    if (order.userId !== userId) return sendError(res, 403, 'REVIEW_BUYER_ONLY', 'Only buyer can review');
    if (order.status !== 'COMPLETED') return sendError(res, 409, 'REVIEW_ORDER_NOT_COMPLETED', 'Order not completed');
    if (reviews.some(r => r.orderId === orderId)) return sendError(res, 409, 'REVIEW_ALREADY_EXISTS', 'Review already exists');
    const lower = String(content || '').toLowerCase();
    const blocked = MODERATION_BLOCKLIST.find(keyword => lower.includes(keyword));
    const review = {
      id: `rev_${Math.random().toString(36).slice(2, 9)}`,
      orderId,
      userId,
      companionId: order.companionId,
      rating: Number(rating || 5),
      content: String(content || ''),
      status: blocked ? ('REJECTED' as const) : ('APPROVED' as const),
      moderationReason: blocked ? `Blocked keyword: ${blocked}` : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    reviews.unshift(review);
    persistState();
    res.status(201).json(review);
  });

  app.get('/api/reviews', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const list = reviews.filter(r => r.userId === userId || (companion && r.companionId === companion.id));
    res.json(list);
  });

  app.get('/api/dashboard/business', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const myOrders = orders.filter(
      o => o.userId === userId || (companion && o.companionId === companion.id)
    );
    const myReviews = reviews.filter(
      r => r.userId === userId || (companion && r.companionId === companion.id)
    );
    res.json({
      userId,
      role: users.find(u => u.id === userId)?.role || 'USER',
      wallet: getWallet(userId),
      diamondWallet: diamondWallets[userId] || { userId, balance: 0, lastUpdated: Date.now() },
      companion: companion || null,
      orderSummary: {
        total: myOrders.length,
        created: myOrders.filter(o => o.status === 'CREATED').length,
        inService: myOrders.filter(o => o.status === 'IN_SERVICE').length,
        completed: myOrders.filter(o => o.status === 'COMPLETED').length,
        disputed: myOrders.filter(o => o.status === 'DISPUTED').length
      },
      reviewSummary: {
        total: myReviews.length,
        approved: myReviews.filter(r => r.status === 'APPROVED').length,
        rejected: myReviews.filter(r => r.status === 'REJECTED').length
      }
    });
  });

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

  app.patch('/api/admin/companions/:id/operator', authMiddleware, requireAdmin('COMPANION_REVIEW'), (req, res) => {
    const companion = companions.find(item => item.id === req.params.id);
    if (!companion) return sendError(res, 404, 'COMPANION_NOT_FOUND', 'Companion not found');
    const hourlyRate = req.body?.hourlyRate;
    const services = req.body?.services as Array<{ id: string; name: string; unitPrice: number; unit: string }> | undefined;
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
    res.json({
      range: { start, end },
      totalRechargeUsd: rechargesOk.reduce((s, o) => s + o.amount, 0),
      rechargeUserCount: rechargeUserIds.size,
      orderPlacerCount: orderPlacers.size,
      completedOrderCount: completed.length,
      completedOrderCoins: completed.reduce((s, o) => s + o.totalPrice, 0),
      giftCoins: 0,
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

  // 1. Get Recharge Packages
  app.get('/api/recharge/packages', (req, res) => {
    res.json(RECHARGE_PACKAGES);
  });

  // 2. Create Recharge Order
  app.post('/api/recharge/create', authMiddleware, (req, res) => {
    const authUserId = (req as any).authUserId as string;
    const { userId: requestedUserId, packageId, paymentMethod } = req.body;
    const userId = authUserId;
    if (requestedUserId && requestedUserId !== authUserId) {
      return sendError(res, 403, 'RECHARGE_USER_MISMATCH', 'User mismatch');
    }
    const pkg = RECHARGE_PACKAGES.find(p => p.id === packageId);
    
    if (!pkg) return sendError(res, 400, 'RECHARGE_PACKAGE_INVALID', 'Invalid package');
    const ru = getUserById(userId);
    if (!ru) return sendError(res, 404, 'RECHARGE_USER_NOT_FOUND', 'User not found');
    const rban = getBanError(ru, 'RECHARGE');
    if (rban) return sendError(res, 403, 'RECHARGE_ACTION_BLOCKED', rban);

    // Risk Control: Daily Limit Check
    const today = new Date().setHours(0, 0, 0, 0);
    if (!dailyRechargeLimits[userId] || dailyRechargeLimits[userId].lastReset !== today) {
      dailyRechargeLimits[userId] = { amount: 0, lastReset: today };
      persistState();
    }
    
    if (dailyRechargeLimits[userId].amount + pkg.amount > MAX_DAILY_RECHARGE) {
      return sendError(res, 403, 'RECHARGE_DAILY_LIMIT_EXCEEDED', 'Daily recharge limit exceeded', { riskFlag: true });
    }

    const order: RechargeOrder = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      packageId,
      amount: pkg.amount,
      coins: pkg.coins + (pkg.bonus || 0),
      paymentMethod,
      status: 'PENDING',
      timestamp: Date.now()
    };

    rechargeOrders.push(order);
    persistState();
    res.json(order);
  });

  // 3. Verify Payment (Simulated Callback / Webhook)
  app.post('/api/recharge/verify', authMiddleware, (req, res) => {
    const authUserId = (req as any).authUserId as string;
    const { orderId, transactionId, status } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return sendError(res, 404, 'RECHARGE_ORDER_NOT_FOUND', 'Order not found');
    if (order.userId !== authUserId) return sendError(res, 403, 'RECHARGE_VERIFY_FORBIDDEN', 'Forbidden');
    
    // Idempotency: Already processed
    if (order.status === 'SUCCESS') {
      return res.json({ status: 'SUCCESS', alreadyProcessed: true });
    }

    order.transactionId = transactionId;
    
    if (status === 'SUCCESS') {
      // Risk Control: Suspicious behavior (e.g., too many orders in short time)
      const recentOrders = rechargeOrders.filter(o => 
        o.userId === order.userId && 
        o.status === 'SUCCESS' && 
        o.timestamp > Date.now() - 5 * 60 * 1000
      );
      
      if (recentOrders.length > 3) {
        order.status = 'PENDING'; // Hold for manual review
        order.riskFlag = true;
        order.riskReason = 'High frequency recharge';
        createRiskEvent('HIGH_FREQUENCY_RECHARGE', order.id, 'HIGH', 'Recharge held due to high frequency in short window');
        persistState();
        return res.json({ status: 'PENDING', message: 'Order held for review' });
      }

      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Recharge: ${order.amount} USD`);
      
      // Update daily limit
      const today = new Date().setHours(0, 0, 0, 0);
      if (dailyRechargeLimits[order.userId]) {
        dailyRechargeLimits[order.userId].amount += order.amount;
      }
      persistState();
      
      res.json({ status: 'SUCCESS', coins: order.coins });
    } else {
      order.status = 'FAILED';
      persistState();
      res.json({ status: 'FAILED' });
    }
  });

  // 4. Wallet Balance
  app.get('/api/wallet/balance', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    res.json(getWallet(userId));
  });

  // 5. Wallet Transactions
  app.get('/api/wallet/transactions', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const txs = walletTransactions.filter(t => t.userId === userId);
    res.json(txs);
  });

  app.post('/api/wallet/withdraw-requests', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const u = getUserById(userId);
    const ban = getBanError(u, 'WITHDRAW');
    if (ban) return sendError(res, 403, 'WITHDRAW_ACTION_BLOCKED', ban);
    const diamondAmount = Number(req.body?.diamondAmount || 0);
    const channel = String(req.body?.channel || 'BANK');
    if (!Number.isFinite(diamondAmount) || diamondAmount <= 0) {
      return sendError(res, 400, 'WITHDRAW_DIAMOND_REQUIRED', 'diamondAmount required');
    }
    const bal = diamondWallets[userId]?.balance ?? 0;
    if (bal < diamondAmount) return sendError(res, 400, 'WALLET_INSUFFICIENT_DIAMONDS', 'Insufficient diamonds');
    const feeUsd = Math.round(diamondAmount * 0.02 * 100) / 100;
    const payoutUsd = Math.max(0, Math.round((diamondAmount * 0.01 - feeUsd) * 100) / 100);
    const w: WithdrawalRequest = {
      id: `wd_${Math.random().toString(36).slice(2, 10)}`,
      userId,
      diamondAmount,
      feeUsd,
      payoutUsd,
      channel,
      status: 'PENDING',
      createdAt: Date.now(),
      orderRef: `WD-${Date.now()}`
    };
    withdrawalRequests.unshift(w);
    persistState();
    res.status(201).json(w);
  });

  app.post('/api/moderation/reports', authMiddleware, (req, res) => {
    const reporterUserId = (req as any).authUserId as string;
    const { targetType, targetId, reason } = req.body || {};
    if (!targetType || !targetId || !reason) {
      return sendError(res, 400, 'REPORT_FIELDS_REQUIRED', 'targetType, targetId, reason required');
    }
    if (!['USER', 'ORDER', 'COMPANION'].includes(targetType)) {
      return sendError(res, 400, 'REPORT_TARGET_TYPE_INVALID', 'Invalid targetType');
    }
    const rep: ModerationReport = {
      id: `rep_${Math.random().toString(36).slice(2, 10)}`,
      reporterUserId,
      targetType,
      targetId: String(targetId),
      reason: String(reason),
      status: 'PENDING',
      createdAt: Date.now()
    };
    moderationReports.unshift(rep);
    persistState();
    res.status(201).json(rep);
  });

  // 6. Admin: Manual Review / Credit
  app.post('/api/admin/recharge/manual', authMiddleware, requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const { orderId, action } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return sendError(res, 404, 'RECHARGE_ORDER_NOT_FOUND', 'Order not found');
    if (order.status !== 'PENDING') return sendError(res, 400, 'RECHARGE_ORDER_STATE_INVALID', 'Order not in pending state');

    if (action === 'APPROVE') {
      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Manual Credit by Admin ${(req as any).authUserId}`);
      appendAuditLog((req as any).authUserId, 'RECHARGE_APPROVE', 'recharge', order.id, { status: order.status });
      persistState();
      res.json({ status: 'SUCCESS' });
    } else {
      order.status = 'FAILED';
      appendAuditLog((req as any).authUserId, 'RECHARGE_REJECT', 'recharge', order.id, { status: order.status });
      persistState();
      res.json({ status: 'FAILED' });
    }
  });

  // 7. Chargeback Handling
  app.post('/api/recharge/chargeback', (req, res) => {
    const { transactionId } = req.body;
    const order = rechargeOrders.find(o => o.transactionId === transactionId);

    if (!order || order.status !== 'SUCCESS') {
      return sendError(res, 404, 'RECHARGE_SUCCESS_ORDER_NOT_FOUND', 'Successful order with this transaction ID not found');
    }

    order.status = 'REFUNDED';
    const wallet = getWallet(order.userId);
    
    // Deduct coins
    wallet.balance -= order.coins;
    wallet.lastUpdated = Date.now();
    
    walletTransactions.unshift({
      id: `tx_cb_${Math.random().toString(36).substr(2, 9)}`,
      userId: order.userId,
      type: 'REFUND',
      amount: -order.coins,
      balanceAfter: wallet.balance,
      referenceId: order.id,
      timestamp: Date.now(),
      description: `Chargeback for Transaction ${transactionId}`
    });
    persistState();

    // Risk: Freeze account if balance becomes negative or too many chargebacks
    if (wallet.balance < 0) {
      createRiskEvent('NEGATIVE_BALANCE', order.id, 'HIGH', `Negative wallet balance after chargeback: ${wallet.balance}`);
      console.log(`User ${order.userId} account frozen due to negative balance after chargeback`);
    }

    res.json({ status: 'REFUNDED', currentBalance: wallet.balance });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
