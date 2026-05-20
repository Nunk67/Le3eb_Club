import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeWeekly } from '../../../backend/algo/m5LevelEngine.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

describe('m5 golden files', () => {
  for (const file of readdirSync(dir).filter(f => f.endsWith('.json'))) {
    it(file, () => {
      const raw = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
      const result = computeWeekly(raw.prev, raw.stats);
      expect(result.newScore).toBeGreaterThanOrEqual(raw.expected.scoreMin ?? 0);
    });
  }
});
