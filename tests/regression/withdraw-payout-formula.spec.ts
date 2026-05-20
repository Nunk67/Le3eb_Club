import { describe, expect, it } from 'vitest';
import { computeWithdraw } from '../../backend/policy/money.js';

describe('regression: withdraw payout', () => {
  it('must not return $0 for 1000 diamonds (historical bug)', () => {
    const { payoutUsd } = computeWithdraw(1000);
    expect(payoutUsd).toBe(38);
    expect(payoutUsd).toBeGreaterThan(0);
  });
});
