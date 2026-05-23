import type { RechargeOrder, RechargePackage, Wallet as WalletType, WalletTransaction } from '@shared/types';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'PLAYER' | 'ADMIN';
  adminRoleTemplate?: string;
  permissions?: string[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface CompanionProfile {
  id: string;
  userId: string;
  gameName: string;
  intro: string;
  hourlyRate: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  availability: 'ONLINE' | 'OFFLINE' | 'BUSY';
}

export interface CompanionRanking {
  rank: number;
  companionId: string;
  gameName: string;
  hourlyRate: number;
  availability: 'ONLINE' | 'OFFLINE' | 'BUSY';
  avgRating: number;
  completedOrderCount: number;
  reviewCount: number;
  completionRate: number;
  totalRevenue: number;
  rankingScore: number;
  poolTag: 'NEW' | 'STABLE' | 'HIGH_PERFORMING';
  scoreBreakdown: {
    quality: number;
    volume: number;
    fulfillment: number;
    revenue: number;
    riskPenalty: number;
  };
}

export interface BusinessOrder {
  id: string;
  userId: string;
  companionId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'CREATED' | 'ACCEPTED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
}

export interface BusinessReview {
  id: string;
  orderId: string;
  companionId: string;
  rating: number;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

import { apiUrl, readJsonResponse } from '@shared/apiClient';

type HttpMethod = 'GET' | 'POST' | 'PATCH';

async function request<T>(path: string, method: HttpMethod, body?: unknown, token?: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  return readJsonResponse<T>(response);
}

export const businessApi = {
  register(username: string, email: string, password: string, deviceId?: string) {
    return request<unknown>('/api/auth/register', 'POST', { username, email, password, deviceId });
  },
  login(email: string, password: string, deviceId?: string) {
    return request<AuthSession>('/api/auth/login', 'POST', { email, password, deviceId });
  },
  createTicket(token: string, subject: string, body: string) {
    return request<{ id: string; status: string }>('/api/tickets', 'POST', { subject, body }, token);
  },
  listMyTickets(token: string) {
    return request<Array<{ id: string; subject: string; status: string; createdAt: number }>>('/api/tickets', 'GET', undefined, token);
  },
  getSession(token: string) {
    return request<AuthSession['user']>('/api/auth/session', 'GET', undefined, token);
  },
  logout(token: string) {
    return request<{ ok: boolean }>('/api/auth/logout', 'POST', undefined, token);
  },
  applyCompanion(token: string, gameName: string, intro: string, hourlyRate: number) {
    return request<CompanionProfile>('/api/companions/apply', 'POST', { gameName, intro, hourlyRate }, token);
  },
  listCompanions(token: string) {
    return request<CompanionProfile[]>('/api/companions?available=true', 'GET', undefined, token);
  },
  listCompanionRankings(token: string, limit = 20) {
    const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    return request<CompanionRanking[]>(`/api/companions/rankings?limit=${safeLimit}`, 'GET', undefined, token);
  },
  createOrder(token: string, companionId: string, serviceName: string, quantity: number) {
    return request<BusinessOrder>('/api/orders', 'POST', { companionId, serviceName, quantity }, token);
  },
  updateOrder(token: string, orderId: string, action: 'accept' | 'start' | 'complete' | 'cancel') {
    return request<BusinessOrder>(`/api/orders/${orderId}/${action}`, 'POST', {}, token);
  },
  listOrders(token: string) {
    return request<BusinessOrder[]>('/api/orders', 'GET', undefined, token);
  },
  createReview(token: string, orderId: string, rating: number, content: string) {
    return request<BusinessReview>('/api/reviews', 'POST', { orderId, rating, content }, token);
  },
  listReviews(token: string) {
    return request<BusinessReview[]>('/api/reviews', 'GET', undefined, token);
  },
  listRechargePackages() {
    return request<RechargePackage[]>('/api/recharge/packages', 'GET');
  },
  createRechargeOrder(token: string, packageId: string, paymentMethod: 'GOOGLE_PAY' | 'APPLE_PAY') {
    return request<RechargeOrder>('/api/recharge/create', 'POST', { packageId, paymentMethod }, token);
  },
  verifyRecharge(token: string, orderId: string, transactionId: string, status: 'SUCCESS' | 'FAILED') {
    return request<{ status: 'SUCCESS' | 'PENDING' | 'FAILED'; alreadyProcessed?: boolean; coins?: number; message?: string }>(
      '/api/recharge/verify',
      'POST',
      { orderId, transactionId, status },
      token
    );
  },
  getWalletBalance(token: string) {
    return request<WalletType>('/api/wallet/balance', 'GET', undefined, token);
  },
  listWalletTransactions(token: string) {
    return request<WalletTransaction[]>('/api/wallet/transactions', 'GET', undefined, token);
  },
  createWithdrawRequest(token: string, diamondAmount: number, channel: string) {
    return request<unknown>('/api/wallet/withdraw-requests', 'POST', { diamondAmount, channel }, token);
  }
};
