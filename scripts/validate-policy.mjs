const COINS_PER_USD = 25;
const DIAMONDS_PER_USD = 25;
const FEE = 0.05;

function round2(n) {
  return Math.round(n * 100) / 100;
}

function computeWithdraw(diamonds) {
  const gross = diamonds / DIAMONDS_PER_USD;
  const fee = round2(gross * FEE);
  const payout = round2(gross - fee);
  return { grossUsd: round2(gross), feeUsd: fee, payoutUsd: payout };
}

let failed = 0;

const w = computeWithdraw(1000);
if (w.payoutUsd !== 38 || w.grossUsd !== 40 || w.feeUsd !== 2) {
  console.error('withdraw anchor failed', w);
  failed++;
}

const pkg = { amount: 1.99, coins: 49, bonus: 1 };
const expected = pkg.amount * COINS_PER_USD;
const actual = pkg.coins + pkg.bonus;
if (Math.abs(actual - expected) / expected > 0.01) {
  console.error('recharge package drift', { expected, actual });
  failed++;
}

const tiers = [
  [5, 9], [8, 14], [12, 19], [17, 26], [24, 35], [30, 60],
];
for (const [min, max] of tiers) {
  if (min >= max) {
    console.error('level band invalid', min, max);
    failed++;
  }
}

if (failed) process.exit(1);
console.log('validate-policy: ok');
