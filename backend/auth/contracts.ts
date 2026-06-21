import type { AdminPermission, UserRole } from '../domain/types.js';

export type AuthProvider = 'password' | 'email_code';
export type EmailCodePurpose = 'login' | 'register';

export type AuthRequestMeta = {
  deviceId?: string;
  ip?: string;
  userAgent?: string;
};

export type AuthUserRecord = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  passwordHash?: string | null;
  emailVerifiedAt?: number;
  accountStatus?: 'ACTIVE' | 'FROZEN' | 'RISK_HOLD';
  permissions?: AdminPermission[];
  adminRoleTemplate?: string;
};

export type PublicAuthUser = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  adminRoleTemplate?: string;
  permissions: AdminPermission[];
};

export type AuthSessionResult = {
  token: string;
  refreshToken: string;
  legacyToken?: string;
  user: PublicAuthUser;
};

export type PasswordLoginInput = {
  email: string;
  password: string;
  meta?: AuthRequestMeta;
};

export type PasswordRegisterInput = {
  username: string;
  email: string;
  password: string;
  meta?: AuthRequestMeta;
};

export type SendEmailCodeInput = {
  email: string;
  purpose: EmailCodePurpose;
  meta?: AuthRequestMeta;
};

export type EmailCodeLoginInput = {
  email: string;
  code: string;
  username?: string;
  meta?: AuthRequestMeta;
};

export type CreateUserInput = {
  username: string;
  email: string;
  passwordHash?: string | null;
  emailVerifiedAt?: number;
  meta?: AuthRequestMeta;
};

export interface AuthUserStore {
  findById(userId: string): Promise<AuthUserRecord | null>;
  findByEmail(email: string): Promise<AuthUserRecord | null>;
  createUser(input: CreateUserInput): Promise<AuthUserRecord>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
  markEmailVerified(userId: string, verifiedAt: number): Promise<void>;
  recordLogin(userId: string, meta?: AuthRequestMeta): Promise<void>;
}

export type VerificationCodeRecord = {
  id: string;
  email: string;
  purpose: EmailCodePurpose;
  codeHash: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
  consumedAt?: number;
  meta?: AuthRequestMeta;
};

export type CreateVerificationCodeInput = {
  email: string;
  purpose: EmailCodePurpose;
  codeHash: string;
  ttlSec: number;
  meta?: AuthRequestMeta;
};

export interface VerificationCodeStore {
  create(input: CreateVerificationCodeInput): Promise<VerificationCodeRecord>;
  findActive(email: string, purpose: EmailCodePurpose): Promise<VerificationCodeRecord | null>;
  recordAttempt(id: string): Promise<VerificationCodeRecord | null>;
  consume(id: string, consumedAt: number): Promise<void>;
}

export interface AuthRateLimiter {
  checkEmailCodeSend(input: SendEmailCodeInput): Promise<{ allowed: true } | { allowed: false; retryAfterSec: number }>;
  checkLoginAttempt(input: { email: string; provider: AuthProvider; meta?: AuthRequestMeta }): Promise<{ allowed: true } | { allowed: false; retryAfterSec: number }>;
}

export interface MailSender {
  sendEmailCode(input: {
    to: string;
    code: string;
    purpose: EmailCodePurpose;
    expiresInSec: number;
  }): Promise<void>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, storedHash: string): Promise<{ valid: boolean; needsRehash: boolean }>;
}

export interface TokenIssuer {
  issueForUser(user: AuthUserRecord): Promise<AuthSessionResult>;
  refresh(refreshToken: string): Promise<{ token: string; refreshToken: string } | null>;
  revoke(refreshToken: string): Promise<void>;
}

export type AuthServiceDeps = {
  users: AuthUserStore;
  verificationCodes: VerificationCodeStore;
  rateLimiter: AuthRateLimiter;
  mailSender: MailSender;
  passwordHasher: PasswordHasher;
  tokenIssuer: TokenIssuer;
};
