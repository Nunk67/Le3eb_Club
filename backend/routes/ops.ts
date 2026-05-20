import type express from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { zValidate } from '../middleware/validate.js';
import { getPaymentVerifier, verifyPaymentIdempotent } from '../payments/verifier.js';
import { manualPayoutMarkPaid } from '../payments/payout.js';

export type CouponTemplate = {
  id: string;
  name: string;
  type: 'FIXED' | 'PERCENT';
  value: number;
  minSpend: number;
  validityDays: number;
  maxIssue: number;
  scope: 'ALL' | 'GAME' | 'COMPANION';
  createdAt: number;
};

export type CouponGrant = {
  id: string;
  templateId: string;
  userId: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  issuedAt: number;
  expiresAt: number;
  usedAt?: number;
  orderId?: string;
};

export type DeviceBan = {
  deviceId: string;
  reason: string;
  createdAt: number;
  createdBy: string;
};

export type ExposureLog = {
  id: string;
  companionId: string;
  viewerId?: string;
  eventType: 'impression' | 'click' | 'detail';
  createdAt: number;
};

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  body: string;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
  assignee?: string;
  createdAt: number;
  resolvedAt?: number;
  responses: Array<{ authorId: string; body: string; createdAt: number }>;
};

const TicketCreateSchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

const CouponTemplateSchema = z.object({
  name: z.string().min(1).max(80),
  type: z.enum(['FIXED', 'PERCENT']),
  value: z.number().positive(),
  minSpend: z.number().nonnegative().default(0),
  validityDays: z.number().int().positive().max(365),
  maxIssue: z.number().int().positive().max(1_000_000),
  scope: z.enum(['ALL', 'GAME', 'COMPANION']).default('ALL'),
});

type OpsCtx = {
  sendError: (
    res: express.Response,
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) => unknown;
  authMiddleware: express.RequestHandler;
  requireAdmin: (permission?: string) => express.RequestHandler;
  getUserById: (id: string) => { id: string; role?: string } | undefined;
  couponTemplates: CouponTemplate[];
  couponGrants: CouponGrant[];
  deviceBans: DeviceBan[];
  exposureLogs: ExposureLog[];
  tickets: SupportTicket[];
  walletTransactions: Array<{ type: string; amount: number; timestamp: number; userId?: string }>;
  persistState: () => void;
  appendAuditLog: (
    actorUserId: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: Record<string, unknown>
  ) => void;
};

export function isDeviceBanned(deviceBans: DeviceBan[], deviceId?: string) {
  if (!deviceId) return false;
  return deviceBans.some(b => b.deviceId === deviceId);
}

export function registerOpsRoutes(app: express.Application, ctx: OpsCtx) {
  const checkDevice = (deviceId: string | undefined, res: express.Response) => {
    if (isDeviceBanned(ctx.deviceBans, deviceId)) {
      ctx.sendError(res, 403, 'DEVICE_BANNED', 'Device is banned');
      return true;
    }
    return false;
  };

  app.get('/api/admin/coupon-templates', ctx.authMiddleware, ctx.requireAdmin('RECHARGE_MANUAL'), (_req, res) => {
    res.json(ctx.couponTemplates);
  });

  app.post('/api/admin/coupon-templates', ctx.authMiddleware, ctx.requireAdmin('RECHARGE_MANUAL'), zValidate(CouponTemplateSchema), (req, res) => {
    const body = (req as express.Request & { validatedBody: z.infer<typeof CouponTemplateSchema> }).validatedBody;
    const tpl: CouponTemplate = {
      id: `ct_${crypto.randomBytes(4).toString('hex')}`,
      name: body.name,
      type: body.type,
      value: body.value,
      minSpend: body.minSpend,
      validityDays: body.validityDays,
      maxIssue: body.maxIssue,
      scope: body.scope,
      createdAt: Date.now(),
    };
    ctx.couponTemplates.push(tpl);
    ctx.persistState();
    res.status(201).json(tpl);
  });

  app.post('/api/admin/coupon-grants', ctx.authMiddleware, ctx.requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const templateId = String(req.body?.templateId || '');
    const userId = String(req.body?.userId || '');
    const tpl = ctx.couponTemplates.find(t => t.id === templateId);
    if (!tpl) return ctx.sendError(res, 404, 'COUPON_TEMPLATE_NOT_FOUND', 'Template not found');
    if (!ctx.getUserById(userId)) return ctx.sendError(res, 404, 'USER_NOT_FOUND', 'User not found');
    const issued = ctx.couponGrants.filter(g => g.templateId === templateId).length;
    if (issued >= tpl.maxIssue) return ctx.sendError(res, 409, 'COUPON_MAX_ISSUE', 'Max issue reached');
    const grant: CouponGrant = {
      id: `cg_${crypto.randomBytes(4).toString('hex')}`,
      templateId,
      userId,
      status: 'ACTIVE',
      issuedAt: Date.now(),
      expiresAt: Date.now() + tpl.validityDays * 86400000,
    };
    ctx.couponGrants.push(grant);
    ctx.persistState();
    res.status(201).json(grant);
  });

  app.get('/api/admin/device-bans', ctx.authMiddleware, ctx.requireAdmin('RISK_REVIEW'), (_req, res) => {
    res.json(ctx.deviceBans);
  });

  app.post('/api/admin/device-bans', ctx.authMiddleware, ctx.requireAdmin('RISK_REVIEW'), (req, res) => {
    const deviceId = String(req.body?.deviceId || '');
    if (!deviceId) return ctx.sendError(res, 400, 'DEVICE_ID_REQUIRED', 'deviceId required');
    if (ctx.deviceBans.some(b => b.deviceId === deviceId)) {
      return ctx.sendError(res, 409, 'DEVICE_ALREADY_BANNED', 'Already banned');
    }
    const ban: DeviceBan = {
      deviceId,
      reason: String(req.body?.reason || 'admin ban'),
      createdAt: Date.now(),
      createdBy: (req as express.Request & { authUserId?: string }).authUserId || 'admin',
    };
    ctx.deviceBans.push(ban);
    ctx.appendAuditLog(ban.createdBy, 'DEVICE_BAN', 'user', deviceId, { reason: ban.reason });
    ctx.persistState();
    res.status(201).json(ban);
  });

  app.post('/api/tickets', ctx.authMiddleware, zValidate(TicketCreateSchema), (req, res) => {
    const userId = (req as express.Request & { authUserId?: string }).authUserId!;
    const body = (req as express.Request & { validatedBody: z.infer<typeof TicketCreateSchema> }).validatedBody;
    const ticket: SupportTicket = {
      id: `tk_${crypto.randomBytes(4).toString('hex')}`,
      userId,
      subject: body.subject,
      body: body.body,
      status: 'OPEN',
      createdAt: Date.now(),
      responses: [],
    };
    ctx.tickets.push(ticket);
    ctx.persistState();
    res.status(201).json(ticket);
  });

  app.get('/api/tickets', ctx.authMiddleware, (req, res) => {
    const userId = (req as express.Request & { authUserId?: string }).authUserId!;
    const user = ctx.getUserById(userId);
    if (user?.role === 'ADMIN') {
      return res.json(ctx.tickets);
    }
    res.json(ctx.tickets.filter(t => t.userId === userId));
  });

  app.get('/api/admin/tickets', ctx.authMiddleware, ctx.requireAdmin(), (_req, res) => {
    res.json(ctx.tickets);
  });

  app.post('/api/admin/tickets/:id/assign', ctx.authMiddleware, ctx.requireAdmin(), (req, res) => {
    const ticket = ctx.tickets.find(t => t.id === req.params.id);
    if (!ticket) return ctx.sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    ticket.status = 'ASSIGNED';
    ticket.assignee = String(req.body?.assignee || (req as express.Request & { authUserId?: string }).authUserId);
    ctx.persistState();
    res.json(ticket);
  });

  app.post('/api/admin/tickets/:id/resolve', ctx.authMiddleware, ctx.requireAdmin(), (req, res) => {
    const ticket = ctx.tickets.find(t => t.id === req.params.id);
    if (!ticket) return ctx.sendError(res, 404, 'TICKET_NOT_FOUND', 'Ticket not found');
    ticket.status = 'RESOLVED';
    ticket.resolvedAt = Date.now();
    const note = String(req.body?.note || '');
    if (note) {
      ticket.responses.push({
        authorId: (req as express.Request & { authUserId?: string }).authUserId || 'admin',
        body: note,
        createdAt: Date.now(),
      });
    }
    ctx.persistState();
    res.json(ticket);
  });

  return { checkDevice, getPaymentVerifier, verifyPaymentIdempotent, manualPayoutMarkPaid };
}

export function aggregateDashboardMetrics(
  exposureLogs: ExposureLog[],
  walletTransactions: OpsCtx['walletTransactions'],
  users: Array<{ id: string; createdAt: number; lastLoginAt?: number }>,
  start: number,
  end: number
) {
  const inRangeExposure = exposureLogs.filter(e => e.createdAt >= start && e.createdAt <= end);
  const impressions = inRangeExposure.filter(e => e.eventType === 'impression').length;
  const clicks = inRangeExposure.filter(e => e.eventType === 'click').length;
  const visitors = new Set(inRangeExposure.map(e => e.viewerId).filter(Boolean)).size;
  const giftCoins = walletTransactions
    .filter(t => t.timestamp >= start && t.timestamp <= end && t.type === 'GIFT_PAY')
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const completedClicks = inRangeExposure.filter(e => e.eventType === 'detail').length;
  const cvr = clicks > 0 ? completedClicks / clicks : 0;
  const cohort = users.filter(u => u.createdAt >= start - 7 * 86400000 && u.createdAt <= end);
  const day1 = cohort.filter(u => u.lastLoginAt && u.lastLoginAt - u.createdAt <= 86400000).length;
  const day7 = cohort.filter(u => u.lastLoginAt && u.lastLoginAt - u.createdAt <= 7 * 86400000).length;
  return {
    giftCoins,
    visitors,
    ctr: Number(ctr.toFixed(4)),
    cvr: Number(cvr.toFixed(4)),
    day1Retention: cohort.length ? Number((day1 / cohort.length).toFixed(4)) : 0,
    day7Retention: cohort.length ? Number((day7 / cohort.length).toFixed(4)) : 0,
  };
}
