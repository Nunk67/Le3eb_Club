import { apiUrl, readJsonResponse } from '../apiClient';

type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'PLAYER' | 'ADMIN';
  permissions?: string[];
};

type Method = 'GET' | 'POST' | 'PATCH';
type ListQuery = {
  page?: number;
  pageSize?: number;
  cursor?: string;
  q?: string;
  status?: string;
  severity?: string;
  start?: number;
  end?: number;
  actorUserId?: string;
  action?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  userId?: string;
};

type PagedResult<T> = { items: T[]; total: number; page: number; pageSize: number; nextCursor?: string | null; mode?: 'page' | 'cursor' };

function toQuery(params: ListQuery = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

async function request<T>(path: string, method: Method, token: string, body?: unknown): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  return readJsonResponse<T>(response);
}

export const adminApi = {
  async login(email: string, password: string) {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return readJsonResponse<{ token: string; user: AuthUser }>(response);
  },
  dashboard(token: string) {
    return request('/api/admin/dashboard', 'GET', token);
  },
  logout(token: string) {
    return request<{ ok: boolean }>('/api/auth/logout', 'POST', token, {});
  },
  roleTemplates(token: string) {
    return request<Record<string, string[]>>('/api/admin/role-templates', 'GET', token);
  },
  updateAdminRoleTemplate(token: string, userId: string, roleTemplate: 'SUPER_ADMIN' | 'FINANCE_ADMIN' | 'RISK_ADMIN' | 'CONTENT_ADMIN') {
    return request(`/api/admin/users/${userId}/role-template`, 'POST', token, { roleTemplate });
  },
  listCompanions(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/companions${toQuery(params)}`, 'GET', token);
  },
  reviewCompanion(token: string, companionId: string, action: 'APPROVE' | 'REJECT') {
    return request(`/api/admin/companions/${companionId}/review`, 'POST', token, { action });
  },
  listOrders(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/orders${toQuery(params)}`, 'GET', token);
  },
  operateOrder(token: string, orderId: string, action: 'FORCE_CANCEL' | 'RESOLVE_DISPUTE') {
    return request(`/api/admin/orders/${orderId}/action`, 'POST', token, { action });
  },
  listReviews(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/reviews${toQuery(params)}`, 'GET', token);
  },
  moderateReview(token: string, reviewId: string, action: 'APPROVE' | 'REJECT', reason?: string) {
    return request(`/api/admin/reviews/${reviewId}/moderate`, 'POST', token, { action, reason });
  },
  listRiskEvents(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/risk-events${toQuery(params)}`, 'GET', token);
  },
  resolveRiskEvent(token: string, eventId: string) {
    return request(`/api/admin/risk-events/${eventId}/resolve`, 'POST', token, {});
  },
  reconcile(token: string, start: number, end: number) {
    return request(`/api/admin/finance/reconciliation?start=${start}&end=${end}`, 'GET', token);
  },
  auditLogs(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/audit-logs${toQuery(params)}`, 'GET', token);
  },
  auditLogReport(token: string, start: number, end: number) {
    return request<{ range: { start: number; end: number }; totalLogs: number; actors: Array<{ actorUserId: string; actionCount: number; lastActionAt: number; actionTypes: Record<string, number> }> }>(
      `/api/admin/audit-logs/report?start=${start}&end=${end}`,
      'GET',
      token
    );
  },
  async exportAuditLogs(token: string, start: number, end: number) {
    const response = await fetch(apiUrl(`/api/admin/audit-logs/export?start=${start}&end=${end}`), {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(payload || 'Export failed');
    }
    return response.text();
  },

  listOperationsUsers(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/operations/users${toQuery(params)}`, 'GET', token);
  },
  getOperationsUser(token: string, userId: string) {
    return request<unknown>(`/api/admin/operations/users/${userId}`, 'GET', token);
  },
  adjustUserWallet(token: string, userId: string, body: { coinDelta?: number; diamondDelta?: number; reason: string }) {
    return request(`/api/admin/operations/users/${userId}/wallet-adjust`, 'POST', token, body);
  },
  grantUserVoucher(token: string, userId: string, body: { coins: number; code?: string }) {
    return request(`/api/admin/operations/users/${userId}/voucher`, 'POST', token, body);
  },
  setUserAccountStatus(token: string, userId: string, body: { accountStatus: 'ACTIVE' | 'FROZEN' | 'RISK_HOLD'; banModules?: Record<string, boolean> }) {
    return request(`/api/admin/operations/users/${userId}/account-status`, 'POST', token, body);
  },
  updateUserProfile(token: string, userId: string, body: { username?: string; gender?: 'M' | 'F' | 'U'; phone?: string; country?: string }) {
    return request(`/api/admin/operations/users/${userId}/profile`, 'POST', token, body);
  },
  listWithdrawals(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/operations/withdrawals${toQuery(params)}`, 'GET', token);
  },
  reviewWithdrawal(token: string, id: string, body: { decision: 'APPROVE' | 'REJECT'; note?: string }) {
    return request(`/api/admin/operations/withdrawals/${id}/review`, 'POST', token, body);
  },
  listModerationReports(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/operations/reports${toQuery(params)}`, 'GET', token);
  },
  resolveModerationReport(token: string, id: string, body: { status: 'RESOLVED' | 'DISMISSED'; note?: string }) {
    return request(`/api/admin/operations/reports/${id}/resolve`, 'POST', token, body);
  },
  reportsOverview(token: string, start: number, end: number) {
    return request<unknown>(`/api/admin/reports/overview?start=${start}&end=${end}`, 'GET', token);
  },
  reportsRecharges(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/reports/recharges${toQuery(params)}`, 'GET', token);
  },
  reportsOrders(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/reports/orders${toQuery(params)}`, 'GET', token);
  },
  reportsWithdrawals(token: string, params?: ListQuery) {
    return request<PagedResult<any>>(`/api/admin/reports/withdrawals${toQuery(params)}`, 'GET', token);
  },
  reportsCompanions(token: string, start: number, end: number) {
    return request<{ range: { start: number; end: number }; items: any[] }>(`/api/admin/reports/companions?start=${start}&end=${end}`, 'GET', token);
  },
  reportsRechargeRisk(token: string, start: number, end: number) {
    return request<{ range: { start: number; end: number }; items: any[] }>(`/api/admin/reports/recharge-risk?start=${start}&end=${end}`, 'GET', token);
  },
  patchCompanionOperator(token: string, companionId: string, body: { hourlyRate?: number; services?: Array<{ id: string; name: string; unitPrice: number; unit: string }> }) {
    return request(`/api/admin/companions/${companionId}/operator`, 'PATCH', token, body);
  }
};
