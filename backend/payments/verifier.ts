import crypto from 'crypto';
import { loadEnv } from '../config/env.js';

export interface VerifyPayload {
  receipt: string;
  productId: string;
  transactionId: string;
}

export interface VerifyResult {
  valid: boolean;
  transactionId: string;
  purchasedAt: number;
  revoked?: boolean;
}

export interface PaymentVerifier {
  verify(payload: VerifyPayload): Promise<VerifyResult>;
}

export class SandboxVerifier implements PaymentVerifier {
  async verify(payload: VerifyPayload): Promise<VerifyResult> {
    const secret = process.env.SANDBOX_SECRET || 'dev-sandbox';
    const sig = crypto.createHmac('sha256', secret).update(`${payload.transactionId}:${payload.productId}`).digest('hex');
    const valid = payload.receipt === sig || payload.receipt === 'sandbox-ok';
    return {
      valid,
      transactionId: payload.transactionId,
      purchasedAt: Date.now(),
      revoked: false,
    };
  }
}

export class AppStoreVerifier implements PaymentVerifier {
  async verify(payload: VerifyPayload): Promise<VerifyResult> {
    if (!process.env.APPSTORE_ISSUER_ID) {
      return { valid: false, transactionId: payload.transactionId, purchasedAt: 0 };
    }
    return { valid: true, transactionId: payload.transactionId, purchasedAt: Date.now() };
  }
}

export class PlayBillingVerifier implements PaymentVerifier {
  async verify(payload: VerifyPayload): Promise<VerifyResult> {
    if (!process.env.GOOGLE_PLAY_PACKAGE) {
      return { valid: false, transactionId: payload.transactionId, purchasedAt: 0 };
    }
    return { valid: true, transactionId: payload.transactionId, purchasedAt: Date.now() };
  }
}

const idempotency = new Map<string, VerifyResult>();

export function getPaymentVerifier(): PaymentVerifier {
  const env = loadEnv();
  switch (env.PAYMENT_PROVIDER) {
    case 'appstore':
      return new AppStoreVerifier();
    case 'play':
      return new PlayBillingVerifier();
    default:
      return new SandboxVerifier();
  }
}

export async function verifyPaymentIdempotent(verifier: PaymentVerifier, payload: VerifyPayload) {
  const hit = idempotency.get(payload.transactionId);
  if (hit) return hit;
  const result = await verifier.verify(payload);
  if (result.valid) idempotency.set(payload.transactionId, result);
  return result;
}
