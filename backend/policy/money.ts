import { Decimal } from 'decimal.js';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export const MONEY_POLICY = Object.freeze({
  COINS_PER_USD: 25,
  DIAMONDS_PER_USD: 25,
  WITHDRAW_FEE_RATE: 0.05,
  MIN_WITHDRAW_DIAMONDS: 250,
  MAX_WITHDRAW_DIAMONDS: 250_000,
  MAX_DAILY_RECHARGE_USD: 500,
  RECHARGE_PACKAGE_TOLERANCE: 0.01,
});

export function round2(value: Decimal.Value): number {
  return Number(new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP));
}

export function computeWithdraw(diamondAmount: number) {
  const gross = new Decimal(diamondAmount).div(MONEY_POLICY.DIAMONDS_PER_USD);
  const fee = gross.times(MONEY_POLICY.WITHDRAW_FEE_RATE);
  const payout = gross.minus(fee);
  const grossUsd = round2(gross);
  const feeUsd = round2(fee);
  const payoutUsd = round2(payout);
  let withinLimits = true;
  let reason: string | undefined;
  if (!Number.isFinite(diamondAmount) || diamondAmount <= 0) {
    withinLimits = false;
    reason = 'WITHDRAW_AMOUNT_INVALID';
  } else if (diamondAmount < MONEY_POLICY.MIN_WITHDRAW_DIAMONDS) {
    withinLimits = false;
    reason = 'WITHDRAW_BELOW_MIN';
  } else if (diamondAmount > MONEY_POLICY.MAX_WITHDRAW_DIAMONDS) {
    withinLimits = false;
    reason = 'WITHDRAW_ABOVE_MAX';
  }
  return { diamondAmount, grossUsd, feeUsd, payoutUsd, withinLimits, reason };
}

export function validateRechargePackage(pkg: { id: string; amount: number; coins: number; bonus?: number }) {
  const expectedCoins = pkg.amount * MONEY_POLICY.COINS_PER_USD;
  const actualCoins = pkg.coins + (pkg.bonus ?? 0);
  const deviation = expectedCoins === 0 ? 0 : Math.abs(actualCoins - expectedCoins) / expectedCoins;
  if (deviation > MONEY_POLICY.RECHARGE_PACKAGE_TOLERANCE * 30) {
    return { ok: false as const, expectedCoins, actualCoins, deviation, reason: `package ${pkg.id} deviation` };
  }
  return { ok: true as const, expectedCoins, actualCoins, deviation };
}
