import { describe, expect, it } from 'vitest';
import { SandboxVerifier, verifyPaymentIdempotent } from '../../backend/payments/verifier.js';

describe('integration: sandbox payment', () => {
  it('accepts sandbox-ok receipt once', async () => {
    const verifier = new SandboxVerifier();
    const payload = { receipt: 'sandbox-ok', productId: 'pkg_1', transactionId: 'tx_test_1' };
    const a = await verifyPaymentIdempotent(verifier, payload);
    const b = await verifyPaymentIdempotent(verifier, payload);
    expect(a.valid).toBe(true);
    expect(b.valid).toBe(true);
    expect(a.transactionId).toBe(b.transactionId);
  });
});
