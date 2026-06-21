import type { RechargeOrder, Wallet, WalletTransaction } from '../../shared/types.js';
import type { CouponGrant, CouponTemplate, DeviceBan, ExposureLog, SupportTicket } from '../routes/ops.js';

export type UserRole = 'USER' | 'PLAYER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'RISK_HOLD';
export type BanModuleKey = 'ORDER' | 'ACCEPT_ORDER' | 'RECHARGE' | 'WITHDRAW' | 'PRIVATE_CHAT' | 'GROUP_CHAT' | 'POST';
export type AdminPermission =
  | 'COMPANION_REVIEW'
  | 'ORDER_OPERATE'
  | 'REVIEW_MODERATE'
  | 'RISK_REVIEW'
  | 'FINANCE_RECON'
  | 'RECHARGE_MANUAL';
export type AdminRoleTemplate = 'SUPER_ADMIN' | 'FINANCE_ADMIN' | 'RISK_ADMIN' | 'CONTENT_ADMIN';

export const ROLE_TEMPLATES: Record<AdminRoleTemplate, AdminPermission[]> = {
  SUPER_ADMIN: ['COMPANION_REVIEW', 'ORDER_OPERATE', 'REVIEW_MODERATE', 'RISK_REVIEW', 'FINANCE_RECON', 'RECHARGE_MANUAL'],
  FINANCE_ADMIN: ['FINANCE_RECON', 'RECHARGE_MANUAL'],
  RISK_ADMIN: ['RISK_REVIEW', 'ORDER_OPERATE'],
  CONTENT_ADMIN: ['COMPANION_REVIEW', 'REVIEW_MODERATE']
};

export type WithdrawalRequest = {
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

export type ModerationReport = {
  id: string;
  reporterUserId: string;
  targetType: 'USER' | 'ORDER' | 'COMPANION';
  targetId: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: number;
  resolutionNote?: string;
};

export type PersistedState = {
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
    passwordHash: string;
    password?: string;
    role: UserRole;
    adminRoleTemplate?: AdminRoleTemplate;
    permissions?: AdminPermission[];
    createdAt: number;
    gender?: 'M' | 'F' | 'U';
    phone?: string;
    country?: string;
    emailVerifiedAt?: number;
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
  couponTemplates: CouponTemplate[];
  couponGrants: CouponGrant[];
  deviceBans: DeviceBan[];
  exposureLogs: ExposureLog[];
  tickets: SupportTicket[];
};

export type UserEntity = PersistedState['users'][number];
export type CompanionEntity = PersistedState['companions'][number];
export type OrderEntity = PersistedState['orders'][number];
export type ReviewEntity = PersistedState['reviews'][number];
export type RiskEventEntity = PersistedState['riskEvents'][number];
export type AuditLogEntity = PersistedState['auditLogs'][number];
