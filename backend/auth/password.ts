import argon2 from 'argon2';
import crypto from 'crypto';

const ARGON2_OPTS = { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 } as const;

export async function hashPassword(password: string): Promise<string> {
  if (!password) throw new Error('password required');
  return argon2.hash(password, ARGON2_OPTS);
}

export async function verifyPassword(password: string, stored: string): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (!stored) return { valid: false, needsRehash: false };
  if (stored.startsWith('$argon2')) {
    try {
      const valid = await argon2.verify(stored, password);
      const needsRehash = valid && argon2.needsRehash(stored, ARGON2_OPTS);
      return { valid, needsRehash };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }
  if (stored.includes(':')) {
    const [saltHex, digestHex] = stored.split(':');
    try {
      const candidate = crypto.scryptSync(password, saltHex, 64);
      const expected = Buffer.from(digestHex, 'hex');
      if (expected.length !== candidate.length) return { valid: false, needsRehash: false };
      return { valid: crypto.timingSafeEqual(expected, candidate), needsRehash: true };
    } catch {
      return { valid: false, needsRehash: false };
    }
  }
  return { valid: false, needsRehash: false };
}
