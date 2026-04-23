import { FormEvent, useEffect, useMemo, useState } from 'react';
import { businessApi, BusinessOrder, CompanionProfile, BusinessReview } from './services/businessApi';

function tokenStoreKey() {
  return 'business_workbench_token';
}

export default function BusinessWorkbench() {
  const [email, setEmail] = useState('demo@le3eb.club');
  const [password, setPassword] = useState('demo123');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready');
  const [sessionUser, setSessionUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [companions, setCompanions] = useState<CompanionProfile[]>([]);
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [selectedCompanionId, setSelectedCompanionId] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');

  const completedOrders = useMemo(() => orders.filter(o => o.status === 'COMPLETED'), [orders]);

  const refreshAll = async (authToken: string) => {
    const [user, companionList, orderList, reviewList] = await Promise.all([
      businessApi.getSession(authToken),
      businessApi.listCompanions(authToken),
      businessApi.listOrders(authToken),
      businessApi.listReviews(authToken)
    ]);
    setSessionUser(user);
    setCompanions(companionList);
    setOrders(orderList);
    setReviews(reviewList);
  };

  useEffect(() => {
    const saved = localStorage.getItem(tokenStoreKey());
    if (saved) {
      setToken(saved);
      refreshAll(saved).catch(() => {
        localStorage.removeItem(tokenStoreKey());
        setToken(null);
      });
    }
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('Logging in...');
    try {
      const session = await businessApi.login(email, password);
      setToken(session.token);
      localStorage.setItem(tokenStoreKey(), session.token);
      try {
        await refreshAll(session.token);
        setStatus('Logged in');
      } catch (loadErr) {
        setStatus(`Signed in; data refresh failed: ${(loadErr as Error).message}`);
      }
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    setStatus(label);
    try {
      await fn();
      setStatus(`${label} done`);
      if (token) {
        await refreshAll(token);
      }
    } catch (error) {
      setStatus((error as Error).message);
    }
  };
  const onLogout = async () => {
    if (token) {
      try {
        await businessApi.logout(token);
      } catch {
        // Ignore network/session errors for client-side logout.
      }
    }
    localStorage.removeItem(tokenStoreKey());
    setToken(null);
    setSessionUser(null);
    setCompanions([]);
    setOrders([]);
    setReviews([]);
    setStatus('Logged out');
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-[#0f071a] text-white p-6">
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
          <h1 className="text-3xl font-black">Client Portal</h1>
          <p className="text-sm text-gray-400">使用真实业务链路登录，不再走演示态数据页面。</p>
          <form onSubmit={onLogin} className="grid gap-3">
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
            <button className="bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold" type="submit">Login</button>
          </form>
          <p className="text-xs text-purple-300">{status}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f071a] text-white p-6 space-y-5">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-wrap gap-3 justify-between items-center backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-black">Client Portal</h1>
            <p className="text-xs text-gray-400">用户: {sessionUser?.username} ({sessionUser?.role}) | {status}</p>
          </div>
          <div className="flex gap-2">
            <a href="/legacy" className="px-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-gray-300">Legacy Demo</a>
            <button onClick={onLogout} className="px-4 py-2 text-xs rounded-xl bg-red-500/20 border border-red-500/30 text-red-300">Logout</button>
          </div>
        </div>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
        <h3>Companion Lifecycle</h3>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-2 rounded-xl bg-purple-600 text-xs font-bold" onClick={() => run('Apply companion', () => businessApi.applyCompanion(token, 'League of Legends', 'Focused and stable', 30).then(() => undefined))}>
            Apply Companion
          </button>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs" onClick={() => run('Refresh companions', () => refreshAll(token))}>Refresh</button>
        </div>
        <ul className="text-xs text-gray-300 mt-3 space-y-1">
          {companions.map(c => (
            <li key={c.id}>
              {c.id} - {c.gameName} - {c.availability} - {c.hourlyRate}
              <button className="ml-2 px-2 py-1 rounded-lg bg-white/10" onClick={() => setSelectedCompanionId(c.id)}>Select</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
        <h3>Order Lifecycle</h3>
        <p className="text-xs text-gray-400">Selected companion: {selectedCompanionId || 'none'}</p>
        <div className="flex gap-2 flex-wrap">
          <button
            className="px-3 py-2 rounded-xl bg-purple-600 text-xs font-bold"
            onClick={() =>
              run('Create order', async () => {
                if (!selectedCompanionId) throw new Error('Select a companion first');
                await businessApi.createOrder(token, selectedCompanionId, 'Ranked Duo', 1);
              })
            }
          >
            Create
          </button>
        </div>
        <ul className="text-xs text-gray-300 mt-3 space-y-1">
          {orders.map(o => (
            <li key={o.id} className="space-x-1">
              {o.id} - {o.status} - {o.totalPrice}
              <button className="ml-2 px-2 py-1 rounded-lg bg-white/10" onClick={() => run('Accept order', () => businessApi.updateOrder(token, o.id, 'accept').then(() => undefined))}>Accept</button>
              <button className="px-2 py-1 rounded-lg bg-white/10" onClick={() => run('Start order', () => businessApi.updateOrder(token, o.id, 'start').then(() => undefined))}>Start</button>
              <button className="px-2 py-1 rounded-lg bg-white/10" onClick={() => run('Complete order', () => businessApi.updateOrder(token, o.id, 'complete').then(() => undefined))}>Complete</button>
              <button className="px-2 py-1 rounded-lg bg-white/10" onClick={() => setReviewOrderId(o.id)}>Review target</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
        <h3>Review Lifecycle</h3>
        <p className="text-xs text-gray-400">Review order: {reviewOrderId || completedOrders[0]?.id || 'none'}</p>
        <button
          className="px-3 py-2 rounded-xl bg-purple-600 text-xs font-bold"
          onClick={() =>
            run('Submit review', async () => {
              const orderId = reviewOrderId || completedOrders[0]?.id;
              if (!orderId) throw new Error('No completed order to review');
              await businessApi.createReview(token, orderId, 5, 'Great service and smooth communication');
            })
          }
        >
          Submit Review
        </button>
        <ul className="text-xs text-gray-300 mt-3 space-y-1">
          {reviews.map(r => (
            <li key={r.id}>
              {r.orderId} - {r.rating}⭐ - {r.status}
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
