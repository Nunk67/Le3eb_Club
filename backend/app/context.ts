import type express from 'express';
import type { RechargePackage, Wallet, WalletTransaction } from '../../shared/types.js';
import type { CouponGrant, CouponTemplate, DeviceBan, ExposureLog, SupportTicket } from '../routes/ops.js';
import type {
  AdminPermission,
  BanModuleKey,
  PersistedState,
  UserEntity,
  UserRole,
} from '../domain/types.js';

export type SendError = (
  res: express.Response,
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
) => unknown;

export type AppContext = {
  rechargePackages: RechargePackage[];
  rechargeOrders: PersistedState['rechargeOrders'];
  wallets: PersistedState['wallets'];
  walletTransactions: WalletTransaction[];
  diamondWallets: PersistedState['diamondWallets'];
  dailyRechargeLimits: PersistedState['dailyRechargeLimits'];
  maxDailyRecharge: number;
  users: PersistedState['users'];
  sessions: PersistedState['sessions'];
  companions: PersistedState['companions'];
  orders: PersistedState['orders'];
  reviews: PersistedState['reviews'];
  riskEvents: PersistedState['riskEvents'];
  auditLogs: PersistedState['auditLogs'];
  withdrawalRequests: PersistedState['withdrawalRequests'];
  moderationReports: PersistedState['moderationReports'];
  couponTemplates: CouponTemplate[];
  couponGrants: CouponGrant[];
  deviceBans: DeviceBan[];
  exposureLogs: ExposureLog[];
  tickets: SupportTicket[];
  exposureImpressions24h: Map<string, number>;
  exposureClicks24h: Map<string, number>;
  persistState: () => void;
  authMiddleware: express.RequestHandler;
  requireAdmin: (permission?: AdminPermission) => express.RequestHandler;
  sendError: SendError;
  createToken: () => string;
  getUserById: (userId: string) => UserEntity | undefined;
  toPublicUser: (
    user:
      | { id: string; username: string; email: string; role: UserRole; adminRoleTemplate?: string; permissions?: AdminPermission[] }
      | undefined
  ) => {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    adminRoleTemplate?: string;
    permissions: AdminPermission[];
  } | null;
  getWallet: (userId: string) => Wallet;
  addCoins: (userId: string, amount: number, referenceId: string, description: string) => WalletTransaction;
  addDiamonds: (userId: string, amount: number, referenceId: string, description: string) => void;
  getBanError: (user: UserEntity | undefined, module: BanModuleKey) => string | null;
  lifetimeRechargeUsdForUser: (userId: string) => number;
  adjustCoinsDelta: (
    userId: string,
    delta: number,
    referenceId: string,
    description: string
  ) => { ok: true } | { ok: false; error: string };
  adjustDiamondDelta: (
    userId: string,
    delta: number,
    referenceId: string,
    description: string
  ) => { ok: true } | { ok: false; error: string };
  appendAuditLog: (
    actorUserId: string,
    action: string,
    targetType: PersistedState['auditLogs'][number]['targetType'],
    targetId: string,
    metadata?: Record<string, unknown>
  ) => void;
  createRiskEvent: (
    type: PersistedState['riskEvents'][number]['type'],
    relatedEntityId: string,
    severity: PersistedState['riskEvents'][number]['severity'],
    description: string
  ) => void;
};
