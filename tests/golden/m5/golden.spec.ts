import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeWeekly } from '../../../backend/algo/m5LevelEngine.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

describe('m5 golden', () => {
  it('week-normal.json', () => {
    const raw = JSON.parse(readFileSync(path.join(dir, 'week-normal.json'), 'utf8'));
    const result = computeWeekly(raw.prev, raw.stats);
    expect(result.activityScore).toBeGreaterThanOrEqual(raw.expected.activityScoreMin);
    expect(result.penaltyPoints).toBe(raw.expected.penaltyPoints);
  });
});
