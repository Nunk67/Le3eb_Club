import type express from 'express';
import { CompanionApplySchema, CreateOrderSchema, ExposureBatchSchema } from '../../shared/schemas.js';
import { rankCompanions } from '../algo/m6Exposure.js';
import type { AppContext } from '../app/context.js';
import { zValidate } from '../middleware/validate.js';
import { assertRateInLevelBand } from '../policy/index.js';
import { levelFromHourlyRate } from '../policy/leveling.js';
import type { CouponGrant } from './ops.js';

const MODERATION_BLOCKLIST = ['诈骗', 'fraud', 'scam', '色情', 'porn'];

export function registerBusinessRoutes(app: express.Application, ctx: AppContext) {
  const {
    authMiddleware,
    companions,
    orders,
    reviews,
    users,
    exposureImpressions24h,
    exposureClicks24h,
    exposureLogs,
    couponTemplates,
    couponGrants,
    diamondWallets,
    persistState,
    sendError,
    getWallet,
    getUserById,
    getBanError,
    addDiamonds,
    createRiskEvent,
  } = ctx;

  app.post('/api/companions/apply', authMiddleware, zValidate(CompanionApplySchema), (req, res) => {
    const userId = (req as any).authUserId as string;
    const { gameName, intro, hourlyRate } = (req as express.Request & { validatedBody: { gameName: string; intro: string; hourlyRate: number } }).validatedBody;
    const level = levelFromHourlyRate(hourlyRate);
    const band = assertRateInLevelBand(level, hourlyRate);
    if (!band.ok) {
      return sendError(res, 422, 'PRICE_OUT_OF_LEVEL_BAND', 'hourlyRate out of level band', { band: band.band, level });
    }
    const existing = companions.find(c => c.userId === userId);
    if (existing) {
      existing.gameName = gameName;
      existing.intro = intro;
      existing.hourlyRate = hourlyRate;
      existing.status = 'APPROVED';
      existing.updatedAt = Date.now();
      persistState();
      return res.json(existing);
    }
    const companion = {
      id: `cp_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      gameName,
      intro,
      hourlyRate,
      status: 'APPROVED' as const,
      availability: 'ONLINE' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    companions.push(companion);
    const user = users.find(u => u.id === userId);
    if (user) user.role = 'PLAYER';
    persistState();
    res.status(201).json(companion);
  });

  app.patch('/api/companions/:id/availability', authMiddleware, (req, res) => {
    const companion = companions.find(c => c.id === req.params.id);
    if (!companion) return sendError(res, 404, 'COMPANION_NOT_FOUND', 'Companion not found');
    if (companion.userId !== (req as any).authUserId) return sendError(res, 403, 'COMPANION_FORBIDDEN', 'Forbidden');
    const nextAvailability = req.body?.availability as 'ONLINE' | 'OFFLINE' | 'BUSY';
    if (!nextAvailability) return sendError(res, 400, 'COMPANION_AVAILABILITY_REQUIRED', 'availability required');
    companion.availability = nextAvailability;
    companion.updatedAt = Date.now();
    persistState();
    res.json(companion);
  });

  app.get('/api/companions', (req, res) => {
    const onlyAvailable = req.query.available === 'true';
    const list = companions.filter(c => c.status === 'APPROVED' && (!onlyAvailable || c.availability === 'ONLINE'));
    res.json(list);
  });

  app.get('/api/companions/rankings', (req, res) => {
    const limitRaw = Number(req.query.limit || 20);
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(100, Math.floor(limitRaw))) : 20;
    const rankContext = {
      viewerCountry: String(req.query.country || ''),
      weights: { wOrder: 0.4, wRating: 0.35, wActive: 0.25, wBizGlobal: 0.15 },
      nowSeed: Math.floor(Date.now() / 3_600_000),
    };
    const candidates = companions
      .filter(c => c.status === 'APPROVED')
      .map(companion => {
        const companionOrders = orders.filter(o => o.companionId === companion.id);
        const completedOrders = companionOrders.filter(o => o.status === 'COMPLETED');
        const companionReviews = reviews.filter(r => r.companionId === companion.id && r.status === 'APPROVED');
        const completedOrderCount = completedOrders.length;
        const avgRating = companionReviews.length > 0
          ? companionReviews.reduce((sum, review) => sum + review.rating, 0) / companionReviews.length
          : 0;
        const lastCompleted = completedOrders.reduce((max, o) => Math.max(max, o.completedAt || 0), 0);
        const orderRecencyHours = lastCompleted ? (Date.now() - lastCompleted) / 3_600_000 : 9999;
        return {
          companionId: companion.id,
          level: levelFromHourlyRate(companion.hourlyRate),
          impressions24h: exposureImpressions24h.get(companion.id) || 0,
          clicks24h: exposureClicks24h.get(companion.id) || 0,
          completedOrders30d: completedOrderCount,
          avgRating,
          activityScore: Math.min(150, completedOrderCount * 3),
          orderRecencyHours,
          availability: companion.availability,
          _companion: companion,
          _completedOrderCount: completedOrderCount,
          _companionReviews: companionReviews,
          _companionOrders: companionOrders,
        };
      });
    const rankedCore = rankCompanions(
      candidates.map(({ _companion, _completedOrderCount, _companionReviews, _companionOrders, ...c }) => c),
      rankContext,
      limit
    );
    const ranked = rankedCore.map(row => {
      const src = candidates.find(c => c.companionId === row.companionId)!;
      const companion = src._companion;
      const completedOrderCount = src._completedOrderCount;
      const companionReviews = src._companionReviews;
      const totalOrderCount = src._companionOrders.length;
      const completionRate = totalOrderCount > 0 ? completedOrderCount / totalOrderCount : 0;
      const totalRevenue = src._companionOrders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      const disputed = src._companionOrders.filter(o => o.status === 'DISPUTED').length;
      const avgRating = companionReviews.length > 0
        ? companionReviews.reduce((sum, review) => sum + review.rating, 0) / companionReviews.length
        : 0;
      const poolTag = row.pool === 'FEATURED' ? 'HIGH_PERFORMING' as const : row.pool === 'NORMAL' ? 'STABLE' as const : 'NEW' as const;
      return {
        rank: row.rank,
        companionId: companion.id,
        gameName: companion.gameName,
        hourlyRate: companion.hourlyRate,
        availability: companion.availability,
        avgRating: Number(avgRating.toFixed(2)),
        completedOrderCount,
        reviewCount: companionReviews.length,
        completionRate: Number(completionRate.toFixed(4)),
        totalRevenue,
        rankingScore: row.finalScore,
        poolTag,
        scoreBreakdown: {
          quality: Number((row.breakdown.lf || 0).toFixed(4)),
          volume: Number((row.breakdown.business || 0).toFixed(4)),
          fulfillment: Number((row.breakdown.personalization || 0).toFixed(4)),
          revenue: Number((row.breakdown.exposureFactor || 0).toFixed(4)),
          riskPenalty: Number((disputed * 0.5).toFixed(4)),
        },
      };
    });
    res.json(ranked);
  });

  app.post('/api/exposure/batch', (req, res) => {
    const parsed = ExposureBatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, 'INPUT_INVALID', 'Invalid exposure batch');
    }
    const viewerId = (req.headers['x-viewer-id'] as string) || undefined;
    for (const ev of parsed.data.events) {
      if (ev.type === 'impression') {
        exposureImpressions24h.set(ev.companionId, (exposureImpressions24h.get(ev.companionId) || 0) + 1);
      } else if (ev.type === 'click') {
        exposureClicks24h.set(ev.companionId, (exposureClicks24h.get(ev.companionId) || 0) + 1);
      }
      exposureLogs.push({
        id: `exp_${Math.random().toString(36).slice(2, 9)}`,
        companionId: ev.companionId,
        viewerId,
        eventType: ev.type,
        createdAt: ev.ts || Date.now(),
      });
    }
    if (parsed.data.events.length > 0) persistState();
    res.json({ ok: true, accepted: parsed.data.events.length });
  });

  app.post('/api/orders', authMiddleware, zValidate(CreateOrderSchema), (req, res) => {
    const userId = (req as any).authUserId as string;
    const buyer = getUserById(userId);
    const ban = getBanError(buyer, 'ORDER');
    if (ban) return sendError(res, 403, 'ORDER_ACTION_BLOCKED', ban);
    const body = (req as express.Request & { validatedBody: { companionId: string; serviceName?: string; quantity: number; couponGrantId?: string } }).validatedBody;
    const companion = companions.find(c => c.id === body.companionId && c.status === 'APPROVED');
    if (!companion) return sendError(res, 404, 'ORDER_COMPANION_NOT_FOUND', 'Companion not found');
    if (companion.availability !== 'ONLINE') return sendError(res, 409, 'ORDER_COMPANION_UNAVAILABLE', 'Companion unavailable');
    const level = levelFromHourlyRate(companion.hourlyRate);
    const priceBand = assertRateInLevelBand(level, companion.hourlyRate);
    if (!priceBand.ok) {
      return sendError(res, 422, 'PRICE_OUT_OF_LEVEL_BAND', 'Companion price out of level band', { band: priceBand.band });
    }
    const qty = body.quantity;
    let totalPrice = companion.hourlyRate * qty;
    let couponGrant: CouponGrant | undefined;
    if (body.couponGrantId) {
      couponGrant = couponGrants.find(g => g.id === body.couponGrantId && g.userId === userId);
      if (!couponGrant || couponGrant.status !== 'ACTIVE' || couponGrant.expiresAt < Date.now()) {
        return sendError(res, 400, 'COUPON_INVALID', 'Coupon grant invalid');
      }
      const tpl = couponTemplates.find(t => t.id === couponGrant!.templateId);
      if (!tpl) return sendError(res, 400, 'COUPON_TEMPLATE_MISSING', 'Coupon template missing');
      if (totalPrice < tpl.minSpend) return sendError(res, 400, 'COUPON_MIN_SPEND', 'Order below coupon minimum');
      const discount = tpl.type === 'FIXED' ? tpl.value : Math.min(totalPrice, totalPrice * (tpl.value / 100));
      totalPrice = Math.max(0, Math.round((totalPrice - discount) * 100) / 100);
    }
    const userWallet = getWallet(userId);
    if (userWallet.balance < totalPrice) return sendError(res, 409, 'WALLET_INSUFFICIENT_BALANCE', 'Insufficient wallet balance');
    const order = {
      id: `ord_${Math.random().toString(36).slice(2, 9)}`,
      userId,
      companionId: body.companionId,
      serviceName: body.serviceName || companion.gameName,
      quantity: qty,
      unitPrice: companion.hourlyRate,
      totalPrice,
      status: 'CREATED' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    orders.push(order);
    if (couponGrant) {
      couponGrant.status = 'USED';
      couponGrant.usedAt = Date.now();
      couponGrant.orderId = order.id;
    }
    persistState();
    res.status(201).json(order);
  });

  app.get('/api/orders', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const list = orders.filter(
      o => o.userId === userId || (companion && o.companionId === companion.id)
    );
    res.json(list);
  });

  const updateOrderStatus = (
    orderId: string,
    allowedCurrent: Array<typeof orders[number]['status']>,
    nextStatus: typeof orders[number]['status'],
    actorUserId: string
  ) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { errorCode: 'ORDER_NOT_FOUND', errorMessage: 'Order not found', statusCode: 404 as const };
    const actorCompanion = companions.find(c => c.userId === actorUserId);
    const isCompanionOwner = actorCompanion?.id === order.companionId;
    const isUserOwner = order.userId === actorUserId;
    if (!isCompanionOwner && !isUserOwner) return { errorCode: 'ORDER_FORBIDDEN', errorMessage: 'Forbidden', statusCode: 403 as const };
    if (nextStatus === 'ACCEPTED' && isCompanionOwner) {
      const actorUser = getUserById(actorUserId);
      const ban = getBanError(actorUser, 'ACCEPT_ORDER');
      if (ban) return { errorCode: 'ORDER_ACTION_BLOCKED', errorMessage: ban, statusCode: 403 as const };
    }
    if (!allowedCurrent.includes(order.status)) {
      return {
        errorCode: 'ORDER_INVALID_TRANSITION',
        errorMessage: `Invalid transition from ${order.status}`,
        statusCode: 409 as const,
        details: { from: order.status, to: nextStatus }
      };
    }
    order.status = nextStatus;
    if (nextStatus === 'ACCEPTED') order.acceptedAt = Date.now();
    if (nextStatus === 'IN_SERVICE') order.startedAt = Date.now();
    if (nextStatus === 'COMPLETED') order.completedAt = Date.now();
    if (nextStatus === 'CANCELLED') order.cancelledAt = Date.now();
    order.updatedAt = Date.now();
    persistState();
    return { order };
  };

  app.post('/api/orders/:id/accept', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['CREATED'], 'ACCEPTED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/start', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['ACCEPTED'], 'IN_SERVICE', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/complete', authMiddleware, (req, res) => {
    const actorUserId = (req as any).authUserId as string;
    const result = updateOrderStatus(req.params.id, ['IN_SERVICE'], 'COMPLETED', actorUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    const order = result.order!;
    if (!order.settlementDone) {
      const wallet = getWallet(order.userId);
      wallet.balance -= order.totalPrice;
      wallet.lastUpdated = Date.now();
      ctx.walletTransactions.unshift({
        id: `tx_o_${Math.random().toString(36).slice(2, 9)}`,
        userId: order.userId,
        type: 'ORDER_PAY',
        amount: -order.totalPrice,
        balanceAfter: wallet.balance,
        referenceId: order.id,
        timestamp: Date.now(),
        description: `Order payment ${order.serviceName}`
      });
      const cp = companions.find(c => c.id === order.companionId);
      if (cp) addDiamonds(cp.userId, order.totalPrice, order.id, `Order income ${order.serviceName}`);
      order.settlementDone = true;
      persistState();
    }
    res.json(order);
  });

  app.post('/api/orders/:id/cancel', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['CREATED', 'ACCEPTED'], 'CANCELLED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    res.json(result.order);
  });

  app.post('/api/orders/:id/dispute', authMiddleware, (req, res) => {
    const result = updateOrderStatus(req.params.id, ['IN_SERVICE', 'COMPLETED'], 'DISPUTED', (req as any).authUserId);
    if ('errorCode' in result) return sendError(res, result.statusCode, result.errorCode, result.errorMessage, result.details);
    result.order!.disputeReason = req.body?.reason || 'No reason provided';
    createRiskEvent('ORDER_DISPUTE', result.order!.id, 'MEDIUM', `Order dispute submitted: ${result.order!.disputeReason}`);
    persistState();
    res.json(result.order);
  });

  app.post('/api/reviews', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const { orderId, rating, content } = req.body || {};
    const order = orders.find(o => o.id === orderId);
    if (!order) return sendError(res, 404, 'ORDER_NOT_FOUND', 'Order not found');
    if (order.userId !== userId) return sendError(res, 403, 'REVIEW_BUYER_ONLY', 'Only buyer can review');
    if (order.status !== 'COMPLETED') return sendError(res, 409, 'REVIEW_ORDER_NOT_COMPLETED', 'Order not completed');
    if (reviews.some(r => r.orderId === orderId)) return sendError(res, 409, 'REVIEW_ALREADY_EXISTS', 'Review already exists');
    const lower = String(content || '').toLowerCase();
    const blocked = MODERATION_BLOCKLIST.find(keyword => lower.includes(keyword));
    const review = {
      id: `rev_${Math.random().toString(36).slice(2, 9)}`,
      orderId,
      userId,
      companionId: order.companionId,
      rating: Number(rating || 5),
      content: String(content || ''),
      status: blocked ? ('REJECTED' as const) : ('APPROVED' as const),
      moderationReason: blocked ? `Blocked keyword: ${blocked}` : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    reviews.unshift(review);
    persistState();
    res.status(201).json(review);
  });

  app.get('/api/reviews', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const list = reviews.filter(r => r.userId === userId || (companion && r.companionId === companion.id));
    res.json(list);
  });

  app.get('/api/dashboard/business', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const companion = companions.find(c => c.userId === userId);
    const myOrders = orders.filter(
      o => o.userId === userId || (companion && o.companionId === companion.id)
    );
    const myReviews = reviews.filter(
      r => r.userId === userId || (companion && r.companionId === companion.id)
    );
    res.json({
      userId,
      role: users.find(u => u.id === userId)?.role || 'USER',
      wallet: getWallet(userId),
      diamondWallet: diamondWallets[userId] || { userId, balance: 0, lastUpdated: Date.now() },
      companion: companion || null,
      orderSummary: {
        total: myOrders.length,
        created: myOrders.filter(o => o.status === 'CREATED').length,
        inService: myOrders.filter(o => o.status === 'IN_SERVICE').length,
        completed: myOrders.filter(o => o.status === 'COMPLETED').length,
        disputed: myOrders.filter(o => o.status === 'DISPUTED').length
      },
      reviewSummary: {
        total: myReviews.length,
        approved: myReviews.filter(r => r.status === 'APPROVED').length,
        rejected: myReviews.filter(r => r.status === 'REJECTED').length
      }
    });
  });
}
