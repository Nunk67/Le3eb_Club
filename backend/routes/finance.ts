import type express from 'express';
import type { RechargeOrder } from '../../shared/types.js';
import type { AppContext } from '../app/context.js';
import { getPaymentVerifier, verifyPaymentIdempotent } from '../payments/verifier.js';
import { computeWithdraw } from '../policy/index.js';
import type { ModerationReport, WithdrawalRequest } from '../domain/types.js';

export function registerFinanceRoutes(app: express.Application, ctx: AppContext) {
  const {
    authMiddleware,
    requireAdmin,
    rechargePackages,
    rechargeOrders,
    dailyRechargeLimits,
    maxDailyRecharge,
    walletTransactions,
    diamondWallets,
    withdrawalRequests,
    moderationReports,
    persistState,
    sendError,
    getUserById,
    getBanError,
    getWallet,
    addCoins,
    adjustDiamondDelta,
    appendAuditLog,
    createRiskEvent,
  } = ctx;

  app.get('/api/recharge/packages', (_req, res) => {
    res.json(rechargePackages);
  });

  app.post('/api/recharge/create', authMiddleware, (req, res) => {
    const authUserId = (req as any).authUserId as string;
    const { userId: requestedUserId, packageId, paymentMethod } = req.body;
    const userId = authUserId;
    if (requestedUserId && requestedUserId !== authUserId) {
      return sendError(res, 403, 'RECHARGE_USER_MISMATCH', 'User mismatch');
    }
    const pkg = rechargePackages.find(p => p.id === packageId);

    if (!pkg) return sendError(res, 400, 'RECHARGE_PACKAGE_INVALID', 'Invalid package');
    const ru = getUserById(userId);
    if (!ru) return sendError(res, 404, 'RECHARGE_USER_NOT_FOUND', 'User not found');
    const rban = getBanError(ru, 'RECHARGE');
    if (rban) return sendError(res, 403, 'RECHARGE_ACTION_BLOCKED', rban);

    const today = new Date().setHours(0, 0, 0, 0);
    if (!dailyRechargeLimits[userId] || dailyRechargeLimits[userId].lastReset !== today) {
      dailyRechargeLimits[userId] = { amount: 0, lastReset: today };
      persistState();
    }

    if (dailyRechargeLimits[userId].amount + pkg.amount > maxDailyRecharge) {
      return sendError(res, 403, 'RECHARGE_DAILY_LIMIT_EXCEEDED', 'Daily recharge limit exceeded', { riskFlag: true });
    }

    const order: RechargeOrder = {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      packageId,
      amount: pkg.amount,
      coins: pkg.coins + (pkg.bonus || 0),
      paymentMethod,
      status: 'PENDING',
      timestamp: Date.now()
    };

    rechargeOrders.push(order);
    persistState();
    res.json(order);
  });

  app.post('/api/recharge/verify', authMiddleware, async (req, res) => {
    const authUserId = (req as any).authUserId as string;
    const { orderId, transactionId, status } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return sendError(res, 404, 'RECHARGE_ORDER_NOT_FOUND', 'Order not found');
    if (order.userId !== authUserId) return sendError(res, 403, 'RECHARGE_VERIFY_FORBIDDEN', 'Forbidden');

    if (order.status === 'SUCCESS') {
      return res.json({ status: 'SUCCESS', alreadyProcessed: true });
    }

    order.transactionId = transactionId;

    if (status === 'SUCCESS') {
      const verifier = getPaymentVerifier();
      const receipt = String(req.body?.receipt || 'sandbox-ok');
      const verified = await verifyPaymentIdempotent(verifier, {
        receipt,
        productId: order.packageId,
        transactionId: String(transactionId || order.id),
      });
      if (!verified.valid) {
        return sendError(res, 402, 'PAYMENT_NOT_VERIFIED', 'Payment verification failed');
      }
      const recentOrders = rechargeOrders.filter(o =>
        o.userId === order.userId &&
        o.status === 'SUCCESS' &&
        o.timestamp > Date.now() - 5 * 60 * 1000
      );

      if (recentOrders.length > 3) {
        order.status = 'PENDING';
        order.riskFlag = true;
        order.riskReason = 'High frequency recharge';
        createRiskEvent('HIGH_FREQUENCY_RECHARGE', order.id, 'HIGH', 'Recharge held due to high frequency in short window');
        persistState();
        return res.json({ status: 'PENDING', message: 'Order held for review' });
      }

      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Recharge: ${order.amount} USD`);

      const today = new Date().setHours(0, 0, 0, 0);
      if (dailyRechargeLimits[order.userId]) {
        dailyRechargeLimits[order.userId].amount += order.amount;
      }
      persistState();

      res.json({ status: 'SUCCESS', coins: order.coins });
    } else {
      order.status = 'FAILED';
      persistState();
      res.json({ status: 'FAILED' });
    }
  });

  app.get('/api/wallet/balance', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    res.json(getWallet(userId));
  });

  app.get('/api/wallet/transactions', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const txs = walletTransactions.filter(t => t.userId === userId);
    res.json(txs);
  });

  app.post('/api/wallet/withdraw-requests', authMiddleware, (req, res) => {
    const userId = (req as any).authUserId as string;
    const u = getUserById(userId);
    const ban = getBanError(u, 'WITHDRAW');
    if (ban) return sendError(res, 403, 'WITHDRAW_ACTION_BLOCKED', ban);
    const diamondAmount = Number(req.body?.diamondAmount || 0);
    const channel = String(req.body?.channel || 'BANK');
    if (!Number.isFinite(diamondAmount) || diamondAmount <= 0) {
      return sendError(res, 400, 'WITHDRAW_DIAMOND_REQUIRED', 'diamondAmount required');
    }
    const bal = diamondWallets[userId]?.balance ?? 0;
    if (bal < diamondAmount) return sendError(res, 400, 'WALLET_INSUFFICIENT_DIAMONDS', 'Insufficient diamonds');
    const quote = computeWithdraw(diamondAmount);
    if (!quote.withinLimits) {
      return sendError(res, 400, quote.reason || 'WITHDRAW_INVALID', 'Withdraw amount out of limits');
    }
    const feeUsd = quote.feeUsd;
    const payoutUsd = quote.payoutUsd;
    const w: WithdrawalRequest = {
      id: `wd_${Math.random().toString(36).slice(2, 10)}`,
      userId,
      diamondAmount,
      feeUsd,
      payoutUsd,
      channel,
      status: 'PENDING',
      createdAt: Date.now(),
      orderRef: `WD-${Date.now()}`
    };
    withdrawalRequests.unshift(w);
    persistState();
    res.status(201).json(w);
  });

  app.post('/api/moderation/reports', authMiddleware, (req, res) => {
    const reporterUserId = (req as any).authUserId as string;
    const { targetType, targetId, reason } = req.body || {};
    if (!targetType || !targetId || !reason) {
      return sendError(res, 400, 'REPORT_FIELDS_REQUIRED', 'targetType, targetId, reason required');
    }
    if (!['USER', 'ORDER', 'COMPANION'].includes(targetType)) {
      return sendError(res, 400, 'REPORT_TARGET_TYPE_INVALID', 'Invalid targetType');
    }
    const rep: ModerationReport = {
      id: `rep_${Math.random().toString(36).slice(2, 10)}`,
      reporterUserId,
      targetType,
      targetId: String(targetId),
      reason: String(reason),
      status: 'PENDING',
      createdAt: Date.now()
    };
    moderationReports.unshift(rep);
    persistState();
    res.status(201).json(rep);
  });

  app.post('/api/admin/recharge/manual', authMiddleware, requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const { orderId, action } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return sendError(res, 404, 'RECHARGE_ORDER_NOT_FOUND', 'Order not found');
    if (order.status !== 'PENDING') return sendError(res, 400, 'RECHARGE_ORDER_STATE_INVALID', 'Order not in pending state');

    if (action === 'APPROVE') {
      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Manual Credit by Admin ${(req as any).authUserId}`);
      appendAuditLog((req as any).authUserId, 'RECHARGE_APPROVE', 'recharge', order.id, { status: order.status });
      persistState();
      res.json({ status: 'SUCCESS' });
    } else {
      order.status = 'FAILED';
      appendAuditLog((req as any).authUserId, 'RECHARGE_REJECT', 'recharge', order.id, { status: order.status });
      persistState();
      res.json({ status: 'FAILED' });
    }
  });

  app.post('/api/recharge/chargeback', authMiddleware, requireAdmin('RECHARGE_MANUAL'), (req, res) => {
    const { transactionId } = req.body;
    const order = rechargeOrders.find(o => o.transactionId === transactionId);

    if (!order || order.status !== 'SUCCESS') {
      return sendError(res, 404, 'RECHARGE_SUCCESS_ORDER_NOT_FOUND', 'Successful order with this transaction ID not found');
    }

    order.status = 'REFUNDED';
    const wallet = getWallet(order.userId);

    wallet.balance -= order.coins;
    wallet.lastUpdated = Date.now();

    walletTransactions.unshift({
      id: `tx_cb_${Math.random().toString(36).substr(2, 9)}`,
      userId: order.userId,
      type: 'REFUND',
      amount: -order.coins,
      balanceAfter: wallet.balance,
      referenceId: order.id,
      timestamp: Date.now(),
      description: `Chargeback for Transaction ${transactionId}`
    });
    appendAuditLog((req as any).authUserId, 'RECHARGE_CHARGEBACK', 'recharge', order.id, { transactionId });
    persistState();

    if (wallet.balance < 0) {
      createRiskEvent('NEGATIVE_BALANCE', order.id, 'HIGH', `Negative wallet balance after chargeback: ${wallet.balance}`);
      console.log(`User ${order.userId} account frozen due to negative balance after chargeback`);
    }

    res.json({ status: 'REFUNDED', currentBalance: wallet.balance });
  });
}
