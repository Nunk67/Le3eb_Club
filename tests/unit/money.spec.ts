import { describe, expect, it } from 'vitest';
import { computeWithdraw, MONEY_POLICY } from '../../backend/policy/money.js';

describe('computeWithdraw', () => {
  it('1000 diamonds => gross 40 fee 2 payout 38', () => {
    const q = computeWithdraw(1000);
    expect(q.grossUsd).toBe(40);
    expect(q.feeUsd).toBe(2);
    expect(q.payoutUsd).toBe(38);
    expect(q.withinLimits).toBe(true);
  });

  it('rejects below min', () => {
    const q = computeWithdraw(MONEY_POLICY.MIN_WITHDRAW_DIAMONDS - 1);
    expect(q.withinLimits).toBe(false);
  });
});
