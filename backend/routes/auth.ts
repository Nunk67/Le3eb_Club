import type express from 'express';
import { EmailCodeLoginBodySchema, EmailCodeSendBodySchema, LoginBodySchema, RegisterBodySchema } from '../../shared/schemas.js';
import { hashPassword as hashPasswordArgon, verifyPassword as verifyPasswordArgon } from '../auth/password.js';
import { issueRefreshToken, revokeRefreshToken, rotateRefreshToken, signAccessToken } from '../auth/tokens.js';
import {
  EMAIL_CODE_COOLDOWN_SEC,
  EMAIL_CODE_MAX_ATTEMPTS,
  EMAIL_CODE_TTL_SEC,
  generateEmailCode,
  hashEmailCode,
  localAuthRateLimiter,
  localMailSender,
  localVerificationCodeStore,
  normalizeAuthEmail,
  verifyEmailCode,
} from '../auth/emailCode.js';
import { zValidate } from '../middleware/validate.js';
import { normalizeUserPassword } from '../state/jsonState.js';
import type { AppContext } from '../app/context.js';
import { isDeviceBanned } from './ops.js';

export function registerAuthRoutes(app: express.Application, ctx: AppContext) {
  const getAuthMeta = (req: express.Request, deviceId?: string) => ({
    deviceId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const issueSessionForUser = async (user: (typeof ctx.users)[number]) => {
    const access = signAccessToken(user.id, user.role as 'USER' | 'PLAYER' | 'ADMIN');
    const refresh = await issueRefreshToken(user.id);
    const legacyToken = ctx.createToken();
    ctx.sessions[legacyToken] = { token: legacyToken, userId: user.id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
    ctx.persistState();
    return {
      token: access.token,
      refreshToken: refresh.refreshToken,
      legacyToken,
      user: ctx.toPublicUser(user),
    };
  };

  app.post('/api/auth/register', zValidate(RegisterBodySchema), async (req, res) => {
    const body = (req as express.Request & { validatedBody: { username: string; email: string; password: string; deviceId?: string } }).validatedBody;
    const email = normalizeAuthEmail(body.email);
    if (isDeviceBanned(ctx.deviceBans, body.deviceId)) {
      return ctx.sendError(res, 403, 'DEVICE_BANNED', 'Device is banned');
    }
    if (ctx.users.some(u => normalizeAuthEmail(u.email) === email)) {
      return ctx.sendError(res, 409, 'AUTH_EMAIL_EXISTS', 'Email already exists');
    }
    const user = {
      id: `user_${Math.random().toString(36).slice(2, 9)}`,
      username: body.username,
      email,
      passwordHash: await hashPasswordArgon(body.password),
      role: 'USER' as const,
      createdAt: Date.now(),
      gender: 'U' as const,
      accountStatus: 'ACTIVE' as const,
      followCount: 0,
      lastLoginAt: Date.now(),
      deviceId: body.deviceId
    };
    ctx.users.push(user);
    ctx.wallets[user.id] = { userId: user.id, balance: 0, lastUpdated: Date.now() };
    ctx.persistState();
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  });

  app.post('/api/auth/login', zValidate(LoginBodySchema), async (req, res) => {
    const body = (req as express.Request & { validatedBody: { email: string; password: string; deviceId?: string } }).validatedBody;
    const email = normalizeAuthEmail(body.email);
    if (isDeviceBanned(ctx.deviceBans, body.deviceId)) {
      return ctx.sendError(res, 403, 'DEVICE_BANNED', 'Device is banned');
    }
    const user = ctx.users.find(u => normalizeAuthEmail(u.email) === email);
    if (user && !user.passwordHash && user.password) {
      normalizeUserPassword(user);
      ctx.persistState();
    }
    if (!user || !user.passwordHash) {
      return ctx.sendError(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Invalid credentials');
    }
    const verified = await verifyPasswordArgon(body.password, user.passwordHash);
    if (!verified.valid) {
      return ctx.sendError(res, 401, 'AUTH_INVALID_CREDENTIALS', 'Invalid credentials');
    }
    if (verified.needsRehash) {
      user.passwordHash = await hashPasswordArgon(body.password);
    }
    if (body.deviceId) user.deviceId = body.deviceId;
    user.lastLoginAt = Date.now();
    ctx.persistState();
    res.json(await issueSessionForUser(user));
  });

  app.post('/api/auth/email-code/send', zValidate(EmailCodeSendBodySchema), async (req, res) => {
    const body = (req as express.Request & { validatedBody: { email: string; purpose: 'login' | 'register'; deviceId?: string } }).validatedBody;
    const email = normalizeAuthEmail(body.email);
    if (isDeviceBanned(ctx.deviceBans, body.deviceId)) {
      return ctx.sendError(res, 403, 'DEVICE_BANNED', 'Device is banned');
    }
    const limited = await localAuthRateLimiter.checkEmailCodeSend({
      email,
      purpose: body.purpose,
      meta: getAuthMeta(req, body.deviceId),
    });
    if ('retryAfterSec' in limited) {
      return ctx.sendError(res, 429, 'AUTH_EMAIL_CODE_COOLDOWN', 'Please wait before requesting another code', {
        retryAfterSec: limited.retryAfterSec,
      });
    }
    const code = generateEmailCode();
    await localVerificationCodeStore.create({
      email,
      purpose: body.purpose,
      codeHash: hashEmailCode(code),
      ttlSec: EMAIL_CODE_TTL_SEC,
      meta: getAuthMeta(req, body.deviceId),
    });
    await localMailSender.sendEmailCode({
      to: email,
      code,
      purpose: body.purpose,
      expiresInSec: EMAIL_CODE_TTL_SEC,
    });
    res.json({
      ok: true,
      purpose: body.purpose,
      expiresInSec: EMAIL_CODE_TTL_SEC,
      cooldownSec: EMAIL_CODE_COOLDOWN_SEC,
    });
  });

  app.post('/api/auth/email-code/login', zValidate(EmailCodeLoginBodySchema), async (req, res) => {
    const body = (req as express.Request & { validatedBody: { email: string; code: string; username?: string; deviceId?: string } }).validatedBody;
    const email = normalizeAuthEmail(body.email);
    if (isDeviceBanned(ctx.deviceBans, body.deviceId)) {
      return ctx.sendError(res, 403, 'DEVICE_BANNED', 'Device is banned');
    }
    const limited = await localAuthRateLimiter.checkLoginAttempt({
      email,
      provider: 'email_code',
      meta: getAuthMeta(req, body.deviceId),
    });
    if ('retryAfterSec' in limited) {
      return ctx.sendError(res, 429, 'AUTH_LOGIN_RATE_LIMITED', 'Too many login attempts', {
        retryAfterSec: limited.retryAfterSec,
      });
    }

    const record = await localVerificationCodeStore.findActive(email, 'login');
    if (!record || record.attempts >= EMAIL_CODE_MAX_ATTEMPTS) {
      return ctx.sendError(res, 401, 'AUTH_EMAIL_CODE_INVALID', 'Invalid or expired verification code');
    }
    const attempted = await localVerificationCodeStore.recordAttempt(record.id);
    if (!attempted || attempted.attempts > EMAIL_CODE_MAX_ATTEMPTS || !verifyEmailCode(body.code, attempted.codeHash)) {
      return ctx.sendError(res, 401, 'AUTH_EMAIL_CODE_INVALID', 'Invalid or expired verification code');
    }
    await localVerificationCodeStore.consume(attempted.id, Date.now());

    let user = ctx.users.find(u => normalizeAuthEmail(u.email) === email);
    const now = Date.now();
    if (!user) {
      const username = body.username?.trim() || `user_${Math.random().toString(36).slice(2, 8)}`;
      user = {
        id: `user_${Math.random().toString(36).slice(2, 9)}`,
        username,
        email,
        passwordHash: '',
        role: 'USER' as const,
        createdAt: now,
        gender: 'U' as const,
        accountStatus: 'ACTIVE' as const,
        followCount: 0,
        lastLoginAt: now,
        emailVerifiedAt: now,
        deviceId: body.deviceId,
      };
      ctx.users.push(user);
      ctx.wallets[user.id] = { userId: user.id, balance: 0, lastUpdated: now };
    } else {
      if (body.deviceId) user.deviceId = body.deviceId;
      user.lastLoginAt = now;
      user.emailVerifiedAt = user.emailVerifiedAt || now;
    }
    ctx.persistState();
    res.json(await issueSessionForUser(user));
  });

  app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = String(req.body?.refreshToken || '');
    const rotated = await rotateRefreshToken(refreshToken);
    if (!rotated) return ctx.sendError(res, 401, 'AUTH_REFRESH_INVALID', 'Invalid refresh token');
    const user = ctx.getUserById(rotated.userId);
    if (!user) return ctx.sendError(res, 401, 'AUTH_USER_NOT_FOUND', 'User not found');
    const access = signAccessToken(user.id, user.role as 'USER' | 'PLAYER' | 'ADMIN');
    res.json({ token: access.token, refreshToken: rotated.refreshToken });
  });

  app.post('/api/auth/logout', ctx.authMiddleware, async (req, res) => {
    const raw = req.headers.authorization || '';
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
    if (token && ctx.sessions[token]) {
      delete ctx.sessions[token];
      ctx.persistState();
    }
    const refreshToken = String(req.body?.refreshToken || '');
    if (refreshToken) await revokeRefreshToken(refreshToken);
    res.json({ ok: true });
  });

  app.get('/api/auth/session', ctx.authMiddleware, (req, res) => {
    const user = ctx.users.find(u => u.id === (req as any).authUserId);
    if (!user) {
      return ctx.sendError(res, 404, 'AUTH_USER_NOT_FOUND', 'User not found');
    }
    res.json(ctx.toPublicUser(user));
  });
}
