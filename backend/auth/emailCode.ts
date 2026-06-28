import crypto from 'crypto';
import { logger } from '../logging/logger.js';
import type {
  AuthRateLimiter,
  CreateVerificationCodeInput,
  EmailCodePurpose,
  MailSender,
  SendEmailCodeInput,
  VerificationCodeRecord,
  VerificationCodeStore,
} from './contracts.js';

export const EMAIL_CODE_TTL_SEC = 5 * 60;
export const EMAIL_CODE_COOLDOWN_SEC = 60;
export const EMAIL_CODE_MAX_ATTEMPTS = 5;

export function normalizeAuthEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateEmailCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

export function hashEmailCode(code: string, salt = crypto.randomBytes(16).toString('hex')) {
  const digest = crypto.createHash('sha256').update(`${salt}:${code}`).digest('hex');
  return `${salt}:${digest}`;
}

export function verifyEmailCode(code: string, storedHash: string) {
  const [salt, expectedDigest] = storedHash.split(':');
  if (!salt || !expectedDigest) return false;
  const candidate = crypto.createHash('sha256').update(`${salt}:${code}`).digest();
  const expected = Buffer.from(expectedDigest, 'hex');
  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}

function codeKey(email: string, purpose: EmailCodePurpose) {
  return `${purpose}:${normalizeAuthEmail(email)}`;
}

export class InMemoryVerificationCodeStore implements VerificationCodeStore {
  private records = new Map<string, VerificationCodeRecord>();

  async create(input: CreateVerificationCodeInput): Promise<VerificationCodeRecord> {
    this.pruneExpired();
    const email = normalizeAuthEmail(input.email);
    const now = Date.now();
    const record: VerificationCodeRecord = {
      id: `vc_${crypto.randomBytes(8).toString('hex')}`,
      email,
      purpose: input.purpose,
      codeHash: input.codeHash,
      expiresAt: now + input.ttlSec * 1000,
      sentAt: now,
      attempts: 0,
      meta: input.meta,
    };
    this.records.set(codeKey(email, input.purpose), record);
    return record;
  }

  async findActive(email: string, purpose: EmailCodePurpose): Promise<VerificationCodeRecord | null> {
    this.pruneExpired();
    const record = this.records.get(codeKey(email, purpose));
    if (!record || record.consumedAt || record.expiresAt <= Date.now()) return null;
    return record;
  }

  async recordAttempt(id: string): Promise<VerificationCodeRecord | null> {
    this.pruneExpired();
    const record = [...this.records.values()].find(item => item.id === id);
    if (!record || record.consumedAt || record.expiresAt <= Date.now()) return null;
    record.attempts += 1;
    return record;
  }

  async consume(id: string, consumedAt: number): Promise<void> {
    const record = [...this.records.values()].find(item => item.id === id);
    if (record) record.consumedAt = consumedAt;
  }

  private pruneExpired() {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (record.expiresAt <= now || record.consumedAt) {
        this.records.delete(key);
      }
    }
  }
}

export class InMemoryAuthRateLimiter implements AuthRateLimiter {
  private sentAtByEmail = new Map<string, number>();

  async checkEmailCodeSend(input: SendEmailCodeInput) {
    const key = codeKey(input.email, input.purpose);
    const now = Date.now();
    const lastSentAt = this.sentAtByEmail.get(key) || 0;
    const retryAfterMs = lastSentAt + EMAIL_CODE_COOLDOWN_SEC * 1000 - now;
    if (retryAfterMs > 0) {
      return { allowed: false as const, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
    }
    this.sentAtByEmail.set(key, now);
    return { allowed: true as const };
  }

  async checkLoginAttempt(
    _input: Parameters<AuthRateLimiter['checkLoginAttempt']>[0]
  ): Promise<{ allowed: true } | { allowed: false; retryAfterSec: number }> {
    return { allowed: true as const };
  }
}

export class ConsoleMailSender implements MailSender {
  async sendEmailCode(input: { to: string; code: string; purpose: EmailCodePurpose; expiresInSec: number }) {
    logger.info(
      {
        to: input.to,
        purpose: input.purpose,
        code: input.code,
        expiresInSec: input.expiresInSec,
      },
      'auth_email_code'
    );
  }
}

export const localVerificationCodeStore = new InMemoryVerificationCodeStore();
export const localAuthRateLimiter = new InMemoryAuthRateLimiter();
export const localMailSender = new ConsoleMailSender();
