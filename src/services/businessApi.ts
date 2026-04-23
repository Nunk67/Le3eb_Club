export interface AuthSession {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'USER' | 'PLAYER';
  };
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

import { apiUrl, readJsonResponse } from '../apiClient';

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
  register(username: string, email: string, password: string) {
    return request<unknown>('/api/auth/register', 'POST', { username, email, password });
  },
  login(email: string, password: string) {
    return request<AuthSession>('/api/auth/login', 'POST', { email, password });
  },
  getSession(token: string) {
    return request<AuthSession['user']>('/api/auth/session', 'GET', undefined, token);
  },
  logout(token: string) {
    return request<{ ok: boolean }>('/api/auth/logout', 'POST', {}, token);
  },
  applyCompanion(token: string, gameName: string, intro: string, hourlyRate: number) {
    return request<CompanionProfile>('/api/companions/apply', 'POST', { gameName, intro, hourlyRate }, token);
  },
  listCompanions(token: string) {
    return request<CompanionProfile[]>('/api/companions?available=true', 'GET', undefined, token);
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
  getBusinessDashboard(token: string) {
    return request<unknown>('/api/dashboard/business', 'GET', undefined, token);
  }
};
