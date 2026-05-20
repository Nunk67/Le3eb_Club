import { describe, expect, it } from 'vitest';
import { assertRateInLevelBand, levelFromHourlyRate } from '../../backend/policy/leveling.js';

describe('regression: companion pricing band', () => {
  it('rejects rate outside L1 band', () => {
    const level = levelFromHourlyRate(7);
    const band = assertRateInLevelBand(level, 99);
    expect(band.ok).toBe(false);
  });
});
