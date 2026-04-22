import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  RechargePackage, 
  RechargeOrder, 
  Wallet, 
  WalletTransaction 
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Database ---
  const RECHARGE_PACKAGES: RechargePackage[] = [
    { id: 'pkg_1', amount: 0.99, coins: 60 },
    { id: 'pkg_2', amount: 4.99, coins: 300, bonus: 15 },
    { id: 'pkg_3', amount: 9.99, coins: 600, bonus: 45 },
    { id: 'pkg_4', amount: 19.99, coins: 1200, bonus: 120 },
    { id: 'pkg_5', amount: 49.99, coins: 3000, bonus: 450 },
    { id: 'pkg_6', amount: 99.99, coins: 6000, bonus: 1200 },
  ];

  const rechargeOrders: RechargeOrder[] = [];
  const wallets: Record<string, Wallet> = {
    'user_1': { userId: 'user_1', balance: 120, lastUpdated: Date.now() }
  };
  const walletTransactions: WalletTransaction[] = [];

  // --- Risk Control State ---
  const dailyRechargeLimits: Record<string, { amount: number; lastReset: number }> = {};
  const MAX_DAILY_RECHARGE = 500; // USD

  // --- Helper Functions ---
  const getWallet = (userId: string): Wallet => {
    if (!wallets[userId]) {
      wallets[userId] = { userId, balance: 0, lastUpdated: Date.now() };
    }
    return wallets[userId];
  };

  const addCoins = (userId: string, amount: number, referenceId: string, description: string) => {
    const wallet = getWallet(userId);
    wallet.balance += amount;
    wallet.lastUpdated = Date.now();
    
    const transaction: WalletTransaction = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'RECHARGE',
      amount,
      balanceAfter: wallet.balance,
      referenceId,
      timestamp: Date.now(),
      description
    };
    walletTransactions.unshift(transaction);
    return transaction;
  };

  // --- API Routes ---

  // 1. Get Recharge Packages
  app.get('/api/recharge/packages', (req, res) => {
    res.json(RECHARGE_PACKAGES);
  });

  // 2. Create Recharge Order
  app.post('/api/recharge/create', (req, res) => {
    const { userId, packageId, paymentMethod } = req.body;
    const pkg = RECHARGE_PACKAGES.find(p => p.id === packageId);
    
    if (!pkg) return res.status(400).json({ error: 'Invalid package' });

    // Risk Control: Daily Limit Check
    const today = new Date().setHours(0, 0, 0, 0);
    if (!dailyRechargeLimits[userId] || dailyRechargeLimits[userId].lastReset !== today) {
      dailyRechargeLimits[userId] = { amount: 0, lastReset: today };
    }
    
    if (dailyRechargeLimits[userId].amount + pkg.amount > MAX_DAILY_RECHARGE) {
      return res.status(403).json({ 
        error: 'Daily recharge limit exceeded',
        riskFlag: true 
      });
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
    res.json(order);
  });

  // 3. Verify Payment (Simulated Callback / Webhook)
  app.post('/api/recharge/verify', (req, res) => {
    const { orderId, transactionId, status } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Idempotency: Already processed
    if (order.status === 'SUCCESS') {
      return res.json({ status: 'SUCCESS', alreadyProcessed: true });
    }

    order.transactionId = transactionId;
    
    if (status === 'SUCCESS') {
      // Risk Control: Suspicious behavior (e.g., too many orders in short time)
      const recentOrders = rechargeOrders.filter(o => 
        o.userId === order.userId && 
        o.status === 'SUCCESS' && 
        o.timestamp > Date.now() - 5 * 60 * 1000
      );
      
      if (recentOrders.length > 3) {
        order.status = 'PENDING'; // Hold for manual review
        order.riskFlag = true;
        order.riskReason = 'High frequency recharge';
        return res.json({ status: 'PENDING', message: 'Order held for review' });
      }

      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Recharge: ${order.amount} USD`);
      
      // Update daily limit
      const today = new Date().setHours(0, 0, 0, 0);
      if (dailyRechargeLimits[order.userId]) {
        dailyRechargeLimits[order.userId].amount += order.amount;
      }
      
      res.json({ status: 'SUCCESS', coins: order.coins });
    } else {
      order.status = 'FAILED';
      res.json({ status: 'FAILED' });
    }
  });

  // 4. Wallet Balance
  app.get('/api/wallet/balance', (req, res) => {
    const userId = req.query.userId as string;
    res.json(getWallet(userId));
  });

  // 5. Wallet Transactions
  app.get('/api/wallet/transactions', (req, res) => {
    const userId = req.query.userId as string;
    const txs = walletTransactions.filter(t => t.userId === userId);
    res.json(txs);
  });

  // 6. Admin: Manual Review / Credit
  app.post('/api/admin/recharge/manual', (req, res) => {
    const { orderId, adminId, action } = req.body;
    const order = rechargeOrders.find(o => o.id === orderId);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'PENDING') return res.status(400).json({ error: 'Order not in pending state' });

    if (action === 'APPROVE') {
      order.status = 'SUCCESS';
      addCoins(order.userId, order.coins, order.id, `Manual Credit by Admin ${adminId}`);
      res.json({ status: 'SUCCESS' });
    } else {
      order.status = 'FAILED';
      res.json({ status: 'FAILED' });
    }
  });

  // 7. Chargeback Handling
  app.post('/api/recharge/chargeback', (req, res) => {
    const { transactionId } = req.body;
    const order = rechargeOrders.find(o => o.transactionId === transactionId);

    if (!order || order.status !== 'SUCCESS') {
      return res.status(404).json({ error: 'Successful order with this transaction ID not found' });
    }

    order.status = 'REFUNDED';
    const wallet = getWallet(order.userId);
    
    // Deduct coins
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

    // Risk: Freeze account if balance becomes negative or too many chargebacks
    if (wallet.balance < 0) {
      // In a real app, set user.isFrozen = true
      console.log(`User ${order.userId} account frozen due to negative balance after chargeback`);
    }

    res.json({ status: 'REFUNDED', currentBalance: wallet.balance });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
