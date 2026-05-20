import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rankCompanions } from '../../../backend/algo/m6Exposure.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

describe('m6 golden files', () => {
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    it(file, () => {
      const raw = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
      const ranked = rankCompanions(raw.candidates, raw.ctx, raw.limit);
      expect(ranked.length).toBeGreaterThan(0);
      expect(ranked.every((r) => r.finalScore > 0)).toBe(true);
    });
  }
});
