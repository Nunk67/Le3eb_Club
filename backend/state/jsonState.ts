import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ROLE_TEMPLATES,
  type PersistedState,
  type UserEntity,
} from '../domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'storage.json');
export const STORAGE_SCHEMA_VERSION = 11;

export const legacyHashPassword = (password: string, salt = crypto.randomBytes(16).toString('hex')) => {
  const digest = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${digest}`;
};

export const legacyVerifyPassword = (password: string, storedHash: string) => {
  const [salt, digest] = storedHash.split(':');
  if (!salt || !digest) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, 'hex');
  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
};

export const normalizeUserPassword = (user: UserEntity) => {
  if (!user.passwordHash && user.password) {
    user.passwordHash = legacyHashPassword(user.password);
  }
  delete user.password;
};

export const defaultState = (): PersistedState => ({
  schemaVersion: STORAGE_SCHEMA_VERSION,
  rechargeOrders: [],
  wallets: {},
  walletTransactions: [],
  diamondWallets: {},
  dailyRechargeLimits: {},
  users: [],
  sessions: {},
  companions: [],
  orders: [],
  reviews: [],
  riskEvents: [],
  auditLogs: [],
  withdrawalRequests: [],
  moderationReports: [],
  couponTemplates: [],
  couponGrants: [],
  deviceBans: [],
  exposureLogs: [],
  tickets: [],
});

export const sanitizePersistedState = (s: PersistedState) => {
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
  if (!Array.isArray((s as any).couponTemplates)) (s as any).couponTemplates = [];
  if (!Array.isArray((s as any).couponGrants)) (s as any).couponGrants = [];
  if (!Array.isArray((s as any).deviceBans)) (s as any).deviceBans = [];
  if (!Array.isArray((s as any).exposureLogs)) (s as any).exposureLogs = [];
  if (!Array.isArray((s as any).tickets)) (s as any).tickets = [];
  if (!s.sessions || typeof s.sessions !== 'object' || Array.isArray(s.sessions)) (s as any).sessions = {};
};

export const migrateState = (raw: unknown, isProduction = process.env.NODE_ENV === 'production'): PersistedState => {
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
    if (!isProduction && !adminExists && process.env.ALLOW_DEMO_SEED === 'true') {
      merged.users.push({
        id: 'admin_1',
        username: 'ops_admin',
        email: process.env.ADMIN_EMAIL || 'admin@le3eb.club',
        passwordHash: legacyHashPassword(process.env.ADMIN_PASSWORD || 'demo-seed-change-me'),
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
      if (!user.gender) user.gender = 'U';
      if (!user.accountStatus) user.accountStatus = 'ACTIVE';
      if (typeof user.followCount !== 'number') user.followCount = 0;
      if (!user.lastLoginAt) user.lastLoginAt = user.createdAt && user.createdAt > 0 ? user.createdAt : Date.now();
    });
    if (!Array.isArray(merged.companions)) {
      merged.companions = [];
    }
    merged.companions.forEach(row => {
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

  if (merged.schemaVersion < 9) {
    merged.users.forEach(normalizeUserPassword);
    merged.schemaVersion = 9;
  }

  if (merged.schemaVersion < 10) {
    for (const u of merged.users) {
      const bm = u.banModules as Record<string, boolean> | undefined;
      if (bm?.CHAT) {
        bm.PRIVATE_CHAT = true;
        bm.GROUP_CHAT = true;
        delete bm.CHAT;
      }
    }
    merged.schemaVersion = 10;
  }

  if (merged.schemaVersion < 11) {
    if (!Array.isArray((merged as PersistedState).couponTemplates)) (merged as PersistedState).couponTemplates = [];
    if (!Array.isArray((merged as PersistedState).couponGrants)) (merged as PersistedState).couponGrants = [];
    if (!Array.isArray((merged as PersistedState).deviceBans)) (merged as PersistedState).deviceBans = [];
    if (!Array.isArray((merged as PersistedState).exposureLogs)) (merged as PersistedState).exposureLogs = [];
    if (!Array.isArray((merged as PersistedState).tickets)) (merged as PersistedState).tickets = [];
    merged.schemaVersion = 11;
  }

  if (!isProduction && (!Array.isArray(merged.users) || merged.users.length === 0)) {
    merged.users = structuredClone(base.users);
  }

  merged.users.forEach(normalizeUserPassword);
  sanitizePersistedState(merged);
  merged.schemaVersion = STORAGE_SCHEMA_VERSION;
  return merged;
};

export const loadState = (): PersistedState => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const base = defaultState();
    saveState(base);
    return base;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateState(parsed);
    saveState(migrated);
    return migrated;
  } catch (error) {
    console.error('Failed to load storage.json, fallback to default state:', error);
    return defaultState();
  }
};

export const saveState = (state: PersistedState) => {
  sanitizePersistedState(state);
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      {
        ...state,
        schemaVersion: STORAGE_SCHEMA_VERSION,
      } satisfies PersistedState,
      null,
      2
    ),
    'utf-8'
  );
};
