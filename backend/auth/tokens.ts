import crypto from 'crypto';
import jwt, { type Secret } from 'jsonwebtoken';
import { loadEnv, resolveJwtSecret } from '../config/env.js';
import { getCache } from '../cache/redis.js';

const env = loadEnv();
const SECRET: Secret = resolveJwtSecret(env);

export type Role = 'USER' | 'PLAYER' | 'ADMIN';

export interface AccessPayload {
  sub: string;
  role: Role;
  jti: string;
}

export function signAccessToken(userId: string, role: Role) {
  const jti = crypto.randomBytes(12).toString('hex');
  const token = jwt.sign({ sub: userId, role, jti } satisfies AccessPayload, SECRET, { expiresIn: env.JWT_ACCESS_TTL_SEC });
  return { token, jti, expiresAt: Date.now() + env.JWT_ACCESS_TTL_SEC * 1000 };
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const payload = jwt.verify(token, SECRET) as AccessPayload;
    if (await getCache().get(`revoked:${payload.jti}`)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function revokeAccessToken(jti: string) {
  await getCache().setex(`revoked:${jti}`, env.JWT_ACCESS_TTL_SEC, '1');
}

export async function issueRefreshToken(userId: string) {
  const refreshToken = crypto.randomBytes(32).toString('base64url');
  await getCache().setex(`rt:${refreshToken}`, env.JWT_REFRESH_TTL_SEC, userId);
  return { refreshToken, expiresAt: Date.now() + env.JWT_REFRESH_TTL_SEC * 1000 };
}

export async function rotateRefreshToken(token: string) {
  const userId = await getCache().get(`rt:${token}`);
  if (!userId) return null;
  await getCache().del(`rt:${token}`);
  const issued = await issueRefreshToken(userId);
  return { userId, ...issued };
}

export async function revokeRefreshToken(token: string) {
  await getCache().del(`rt:${token}`);
}
