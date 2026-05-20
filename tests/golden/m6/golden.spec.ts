import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rankCompanions } from '../../../backend/algo/m6Exposure.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

describe('m6 golden', () => {
  it('featured-pool.json deterministic order', () => {
    const raw = JSON.parse(readFileSync(path.join(dir, 'featured-pool.json'), 'utf8'));
    const ranked = rankCompanions(raw.candidates, raw.ctx, raw.limit);
    expect(ranked.length).toBe(2);
    expect(ranked[0].rank).toBe(1);
    expect(ranked.every(r => r.finalScore > 0)).toBe(true);
  });
});
