import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  LayoutDashboard,
  Gamepad2,
  ShoppingBag,
  Star,
  ShieldAlert,
  Wallet,
  ScrollText,
  Bell,
  LogOut,
  ExternalLink,
  ChevronRight,
  Users,
  Banknote,
  Flag,
  BarChart3
} from 'lucide-react';
import { adminApi } from './services/adminApi';
import { useI18n } from '../client/i18n/I18nProvider';
import type { MessageKey } from '../client/i18n/messages';

// M7 scope keeps admin localization as M8 prep only.
const ADMIN_I18N_PREP_NOTE = 'M8 admin localization prep anchor';

function adminTokenStoreKey() {
  return 'admin_workbench_token';
}

type SchemaAction = { label: string; action: string };
type SchemaModule = {
  key: 'companions' | 'orders' | 'reviews' | 'risks';
  title: string;
  columns: Array<{ key: string; label: string }>;
  actions: SchemaAction[];
};

type NavId =
  | 'dashboard'
  | 'users'
  | 'withdrawals'
  | 'reports'
  | 'data'
  | 'companions'
  | 'orders'
  | 'reviews'
  | 'risks'
  | 'finance'
  | 'audit';

const MODULES: SchemaModule[] = [
  {
    key: 'companions',
    title: '陪玩审核',
    columns: [
      { key: 'id', label: '编号' },
      { key: 'gameName', label: '游戏' },
      { key: 'status', label: '状态' },
      { key: 'availability', label: '可接单' }
    ],
    actions: [{ label: '通过', action: 'APPROVE' }, { label: '驳回', action: 'REJECT' }]
  },
  {
    key: 'orders',
    title: '订单管理',
    columns: [
      { key: 'id', label: '编号' },
      { key: 'status', label: '状态' },
      { key: 'totalPrice', label: '金额' },
      { key: 'serviceName', label: '服务' }
    ],
    actions: [{ label: '强制取消', action: 'FORCE_CANCEL' }, { label: '解决争议', action: 'RESOLVE_DISPUTE' }]
  },
  {
    key: 'reviews',
    title: '评价审核',
    columns: [
      { key: 'id', label: '编号' },
      { key: 'rating', label: '评分' },
      { key: 'status', label: '状态' },
      { key: 'content', label: '内容' }
    ],
    actions: [{ label: '通过', action: 'APPROVE' }, { label: '驳回', action: 'REJECT' }]
  },
  {
    key: 'risks',
    title: '风控事件',
    columns: [
      { key: 'id', label: '编号' },
      { key: 'type', label: '类型' },
      { key: 'severity', label: '严重度' },
      { key: 'status', label: '状态' }
    ],
    actions: [{ label: '标记已处理', action: 'RESOLVE' }]
  }
];

const NAV_ITEMS: Array<{ id: NavId; labelKey: MessageKey; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', labelKey: 'admin.nav.dashboard', icon: LayoutDashboard },
  { id: 'users', labelKey: 'admin.nav.users', icon: Users },
  { id: 'withdrawals', labelKey: 'admin.nav.withdrawals', icon: Banknote },
  { id: 'reports', labelKey: 'admin.nav.reports', icon: Flag },
  { id: 'data', labelKey: 'admin.nav.data', icon: BarChart3 },
  { id: 'companions', labelKey: 'admin.nav.companions', icon: Gamepad2 },
  { id: 'orders', labelKey: 'admin.nav.orders', icon: ShoppingBag },
  { id: 'reviews', labelKey: 'admin.nav.reviews', icon: Star },
  { id: 'risks', labelKey: 'admin.nav.risks', icon: ShieldAlert },
  { id: 'finance', labelKey: 'admin.nav.finance', icon: Wallet },
  { id: 'audit', labelKey: 'admin.nav.audit', icon: ScrollText }
];

const NAV_TITLE_KEY: Record<NavId, MessageKey> = {
  dashboard: 'admin.nav.dashboard',
  users: 'admin.nav.users',
  withdrawals: 'admin.nav.withdrawals',
  reports: 'admin.nav.reports',
  data: 'admin.nav.data',
  companions: 'admin.nav.companions',
  orders: 'admin.nav.orders',
  reviews: 'admin.nav.reviews',
  risks: 'admin.nav.risks',
  finance: 'admin.nav.finance',
  audit: 'admin.nav.audit'
};

const cardClass = 'bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]';
const inputClass =
  'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none transition-all';
/** 与主按钮、次按钮同高同圆角，工具栏里对齐成一列 */
const controlBarShapeClass = 'h-9 rounded-xl px-3 text-xs box-border';
const primaryBtnClass = `${controlBarShapeClass} inline-flex shrink-0 items-center justify-center font-bold bg-purple-600 text-white transition-colors hover:bg-purple-500`;
const subtleBtnClass = `${controlBarShapeClass} inline-flex shrink-0 items-center justify-center border border-white/10 bg-white/5 text-gray-200 transition-colors hover:bg-white/10`;
/** 深色磨砂玻璃风格下拉框；轮廓与按钮一致，箭头用 style 避免盖住底色 */
const selectClass = [
  controlBarShapeClass,
  'pr-9 py-0 leading-snug',
  'appearance-none cursor-pointer border border-white/10',
  'bg-white/[0.07] backdrop-blur-xl text-gray-100',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
  'transition-all [color-scheme:dark]',
  'focus:border-purple-500/45 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
  'hover:border-white/20 hover:bg-white/[0.09]'
].join(' ');

const selectDropdownArrowStyle: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.65rem center',
  backgroundSize: '14px 14px'
};
const optionClass = 'bg-[#130d1c] text-gray-100';

/** 展示用中文；提交给接口的 value 仍为 SUPER_ADMIN 等 */
const ADMIN_ROLE_TEMPLATE_LABEL_ZH: Record<string, string> = {
  SUPER_ADMIN: '超级管理员',
  FINANCE_ADMIN: '财务管理员',
  RISK_ADMIN: '风控管理员',
  CONTENT_ADMIN: '内容管理员'
};

function adminRoleTemplateLabelZh(key: string) {
  return ADMIN_ROLE_TEMPLATE_LABEL_ZH[key] ?? key;
}

const METRIC_LABELS: Record<string, string> = {
  companionsPending: '待审核陪玩',
  ordersDisputed: '争议订单',
  reviewsRejected: '驳回评价',
  openRiskEvents: '未处理风控',
  rechargePending: '待处理充值',
  totalRechargeUsd: '充值总额(USD)',
  totalOrderCoins: '订单总额(金币)',
  totalRefundCoins: '退款总额(金币)',
  totalIncomeCoins: '收入总额(金币)',
  rechargeUserCount: '充值人数',
  orderPlacerCount: '下单人数',
  completedOrderCount: '完成订单数',
  completedOrderCoins: '完成订单金币',
  giftCoins: '送礼金币',
  diamondIncomeApprox: '钻石收入(近似)',
  platformCoins: '平台金币余额',
  platformDiamonds: '平台钻石余额'
};

const STATUS_LABEL_ZH: Record<string, string> = {
  ACTIVE: '正常',
  FROZEN: '已冻结',
  RISK_HOLD: '风控中',
  PENDING: '待处理',
  APPROVED: '已通过',
  ONLINE: '在线',
  COMPLETED: '已完成',
  SUCCESS: '成功',
  RESOLVED: '已处理',
  CREATED: '已创建',
  IN_SERVICE: '服务中',
  DISPUTED: '争议中',
  OPEN: '待跟进',
  REJECTED: '已驳回',
  CANCELLED: '已取消',
  REFUNDED: '已退款',
  FAILED: '失败',
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  CRITICAL: '紧急',
  DISMISSED: '已驳回',
  USER: '用户',
  ORDER: '订单',
  COMPANION: '陪玩',
  HIGH_FREQUENCY_RECHARGE: '高频充值',
  ORDER_DISPUTE: '订单争议',
  NEGATIVE_BALANCE: '负余额'
};

function toDisplayLabel(key: string) {
  return METRIC_LABELS[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function formatMaybeTimestamp(value: unknown): string {
  if (typeof value === 'number' && value > 1_000_000_000_000) {
    return new Date(value).toLocaleString('zh-CN');
  }
  return String(value ?? '');
}

function formatMetricValue(key: string, value: unknown): string {
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('usd')) return `$${value.toFixed(2)}`;
    if (key.toLowerCase().includes('coins')) return `${value.toLocaleString('zh-CN')} 金币`;
    return value.toLocaleString('zh-CN');
  }
  return String(value ?? '');
}

function statusBadgeClass(value: unknown): string {
  const v = String(value || '').toUpperCase();
  if (['APPROVED', 'ONLINE', 'COMPLETED', 'SUCCESS', 'RESOLVED'].includes(v)) {
    return 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300';
  }
  if (['PENDING', 'CREATED', 'IN_SERVICE', 'DISPUTED', 'OPEN'].includes(v)) {
    return 'bg-amber-500/15 border-amber-400/30 text-amber-300';
  }
  if (['REJECTED', 'CANCELLED', 'REFUNDED', 'FAILED'].includes(v)) {
    return 'bg-rose-500/15 border-rose-400/30 text-rose-300';
  }
  return 'bg-white/10 border-white/20 text-gray-200';
}

function renderCellValue(value: unknown) {
  if (typeof value === 'string') {
    const upper = value.toUpperCase();
    if (/^[A-Z_]+$/.test(upper) && upper.length >= 3) {
      const text = STATUS_LABEL_ZH[upper] || value;
      return (
        <span className={`inline-flex px-2 py-0.5 rounded-lg border text-[10px] font-bold ${statusBadgeClass(value)}`}>
          {text}
        </span>
      );
    }
  }
  if (typeof value === 'number' && value > 1_000_000_000_000) {
    return formatMaybeTimestamp(value);
  }
  return String(value ?? '');
}

function renderRecordTitle(module: SchemaModule, record: any): string {
  if (module.key === 'companions') return record.gameName || record.id;
  if (module.key === 'orders') return record.serviceName || record.id;
  if (module.key === 'reviews') return record.content || record.id;
  if (module.key === 'risks') return record.type || record.id;
  return record.id;
}

export default function AdminWorkbench() {
  void ADMIN_I18N_PREP_NOTE;
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState(t('admin.status.ready'));
  const [dashboard, setDashboard] = useState<any>(null);
  const [companions, setCompanions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [finance, setFinance] = useState<any>(null);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [roleTemplates, setRoleTemplates] = useState<Record<string, string[]>>({});
  const [moduleFilters, setModuleFilters] = useState<
    Record<string, { q?: string; status?: string; severity?: string; page: number; pageSize: number; cursor?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }>
  >({
    companions: { q: '', status: '', page: 1, pageSize: 10, cursor: '', sortBy: 'updatedAt', sortDir: 'desc' },
    orders: { q: '', status: '', page: 1, pageSize: 10, cursor: '', sortBy: 'updatedAt', sortDir: 'desc' },
    reviews: { q: '', status: '', page: 1, pageSize: 10, cursor: '', sortBy: 'updatedAt', sortDir: 'desc' },
    risks: { status: '', severity: '', page: 1, pageSize: 10, cursor: '', sortBy: 'createdAt', sortDir: 'desc' }
  });
  const [auditFilter, setAuditFilter] = useState({
    action: '',
    actorUserId: '',
    page: 1,
    pageSize: 20,
    cursor: '',
    sortBy: 'timestamp',
    sortDir: 'desc' as 'asc' | 'desc'
  });
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');

  const [opsUsers, setOpsUsers] = useState<any[]>([]);
  const [userListQ, setUserListQ] = useState('');
  const [userListStatus, setUserListStatus] = useState('');
  const [userDetail, setUserDetail] = useState<any | null>(null);

  const [withdrawalItems, setWithdrawalItems] = useState<any[]>([]);
  const [wdStatusFilter, setWdStatusFilter] = useState('PENDING');

  const [reportItems, setReportItems] = useState<any[]>([]);
  const [repStatusFilter, setRepStatusFilter] = useState('PENDING');

  const [dataTab, setDataTab] = useState<'overview' | 'recharges' | 'orders' | 'withdrawals' | 'companions' | 'recharge_risk'>('overview');
  const [dataRange, setDataRange] = useState(() => {
    const end = Date.now();
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return { start, end };
  });
  const [dataOverview, setDataOverview] = useState<any>(null);
  const [dataRecharges, setDataRecharges] = useState<any[]>([]);
  const [dataOrders, setDataOrders] = useState<any[]>([]);
  const [dataWithdrawals, setDataWithdrawals] = useState<any[]>([]);
  const [dataCompanions, setDataCompanions] = useState<any[]>([]);
  const [dataRechargeRisk, setDataRechargeRisk] = useState<any[]>([]);

  const [companionEditId, setCompanionEditId] = useState('');
  const [companionHourly, setCompanionHourly] = useState('');
  const [companionServicesJson, setCompanionServicesJson] = useState('');

  const [walletReason, setWalletReason] = useState('');
  const [walletCoin, setWalletCoin] = useState('');
  const [walletDiamond, setWalletDiamond] = useState('');
  const [voucherCoinsIn, setVoucherCoinsIn] = useState('');
  const [voucherCodeIn, setVoucherCodeIn] = useState('');
  const [acctStatusPick, setAcctStatusPick] = useState('ACTIVE');
  const [profileNameIn, setProfileNameIn] = useState('');

  useEffect(() => {
    const u = userDetail?.user;
    if (!u) return;
    setProfileNameIn(u.username);
    setAcctStatusPick(u.accountStatus || 'ACTIVE');
    setWalletReason('');
    setWalletCoin('');
    setWalletDiamond('');
    setVoucherCoinsIn('');
    setVoucherCodeIn('');
  }, [userDetail?.user?.id]);

  useEffect(() => {
    const saved = localStorage.getItem(adminTokenStoreKey());
    if (!saved) return;
    setToken(saved);
    setSessionToken(saved);
    loadAll(saved).catch(() => {
      localStorage.removeItem(adminTokenStoreKey());
      setToken(null);
      setSessionToken(null);
      setStatus(t('admin.status.sessionExpired'));
    });
  }, []);

  const setModuleFilter = (
    key: string,
    patch: Partial<{ q?: string; status?: string; severity?: string; page: number; pageSize: number; cursor?: string; sortBy?: string; sortDir?: 'asc' | 'desc' }>
  ) => {
    setModuleFilters(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const loadAll = async (authToken: string) => {
    const now = Date.now();
    const start = now - 30 * 24 * 60 * 60 * 1000;
    const companionFilter = moduleFilters.companions;
    const orderFilter = moduleFilters.orders;
    const reviewFilter = moduleFilters.reviews;
    const riskFilter = moduleFilters.risks;
    const [d, c, o, r, rk, a, f, ar] = await Promise.all([
      adminApi.dashboard(authToken),
      adminApi.listCompanions(authToken, companionFilter),
      adminApi.listOrders(authToken, orderFilter),
      adminApi.listReviews(authToken, reviewFilter),
      adminApi.listRiskEvents(authToken, riskFilter),
      adminApi.auditLogs(authToken, auditFilter),
      adminApi.reconcile(authToken, start, now),
      adminApi.auditLogReport(authToken, start, now)
    ]);
    const templates = await adminApi.roleTemplates(authToken);
    setDashboard(d);
    setCompanions(c.items || []);
    setOrders(o.items || []);
    setReviews(r.items || []);
    setRisks(rk.items || []);
    setAuditLogs(a.items || []);
    setFinance(f);
    setAuditReport(ar);
    setRoleTemplates(templates);
    setModuleFilters(prev => ({
      companions: { ...prev.companions, cursor: c.nextCursor || '' },
      orders: { ...prev.orders, cursor: o.nextCursor || '' },
      reviews: { ...prev.reviews, cursor: r.nextCursor || '' },
      risks: { ...prev.risks, cursor: rk.nextCursor || '' }
    }));
    setAuditFilter(prev => ({ ...prev, cursor: a.nextCursor || '' }));
  };

  useEffect(() => {
    if (!token || activeNav !== 'users') return;
    adminApi
      .listOperationsUsers(token, { q: userListQ || undefined, status: userListStatus || undefined, page: 1, pageSize: 40 })
      .then(r => setOpsUsers(r.items || []))
      .catch((e: Error) => setStatus(e.message || t('admin.status.operationFailed')));
  }, [token, activeNav, userListQ, userListStatus]);

  useEffect(() => {
    if (!token || activeNav !== 'withdrawals') return;
    adminApi
      .listWithdrawals(token, { status: wdStatusFilter || undefined, page: 1, pageSize: 40 })
      .then(r => setWithdrawalItems(r.items || []))
      .catch((e: Error) => setStatus(e.message || t('admin.status.operationFailed')));
  }, [token, activeNav, wdStatusFilter]);

  useEffect(() => {
    if (!token || activeNav !== 'reports') return;
    adminApi
      .listModerationReports(token, { status: repStatusFilter || undefined, page: 1, pageSize: 40 })
      .then(r => setReportItems(r.items || []))
      .catch((e: Error) => setStatus(e.message || t('admin.status.operationFailed')));
  }, [token, activeNav, repStatusFilter]);

  useEffect(() => {
    if (!token || activeNav !== 'data') return;
    const { start, end } = dataRange;
    const load = async () => {
      try {
        if (dataTab === 'overview') {
          setDataOverview(await adminApi.reportsOverview(token, start, end));
        } else if (dataTab === 'recharges') {
          const r = await adminApi.reportsRecharges(token, { start, end, page: 1, pageSize: 80 });
          setDataRecharges(r.items || []);
        } else if (dataTab === 'orders') {
          const r = await adminApi.reportsOrders(token, { start, end, page: 1, pageSize: 80 });
          setDataOrders(r.items || []);
        } else if (dataTab === 'withdrawals') {
          const r = await adminApi.reportsWithdrawals(token, { start, end, page: 1, pageSize: 80 });
          setDataWithdrawals(r.items || []);
        } else if (dataTab === 'companions') {
          const r = await adminApi.reportsCompanions(token, start, end);
          setDataCompanions(r.items || []);
        } else if (dataTab === 'recharge_risk') {
          const r = await adminApi.reportsRechargeRisk(token, start, end);
          setDataRechargeRisk(r.items || []);
        }
      } catch (e: any) {
        setStatus(e?.message || t('admin.status.dataReportLoadFailed'));
      }
    };
    void load();
  }, [token, activeNav, dataTab, dataRange.start, dataRange.end]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(t('admin.status.loggingIn'));
    try {
      const result = await adminApi.login(email, password);
      setToken(result.token);
      setSessionToken(result.token);
      localStorage.setItem(adminTokenStoreKey(), result.token);
      try {
        await loadAll(result.token);
        setStatus(t('admin.status.readyAfterLogin'));
      } catch (loadErr) {
        setStatus(t('admin.status.loginDashboardLoadFailed', { message: (loadErr as Error).message }));
      }
    } catch (error) {
      setStatus((error as Error).message || t('admin.status.operationFailed'));
    }
  };

  const run = async (label: string, fn: () => Promise<unknown>) => {
    if (!token) return;
    setStatus(label);
    try {
      await fn();
      await loadAll(token);
      setStatus(t('admin.status.runCompleted', { label }));
    } catch (error) {
      setStatus((error as Error).message || t('admin.status.operationFailed'));
    }
  };
  const onLogout = async () => {
    if (sessionToken) {
      try {
        await adminApi.logout(sessionToken);
      } catch {
        // Ignore logout network errors, clear local state anyway.
      }
    }
    setToken(null);
    setSessionToken(null);
    localStorage.removeItem(adminTokenStoreKey());
    setDashboard(null);
    setCompanions([]);
    setOrders([]);
    setReviews([]);
    setRisks([]);
    setAuditLogs([]);
    setFinance(null);
    setAuditReport(null);
    setStatus(t('admin.status.loggedOut'));
  };

  const recordsMap = useMemo(() => ({ companions, orders, reviews, risks }), [companions, orders, reviews, risks]);

  const activeModule = MODULES.find(m => m.key === activeNav);

  const renderModuleSection = (module: SchemaModule) => (
    <section className={cardClass}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-bold">{module.title}</h3>
        <span className="text-[10px] text-gray-500">最多展示 30 条</span>
      </div>
      <div className="flex gap-2 mb-3 flex-wrap p-3 rounded-2xl bg-black/20 border border-white/10">
        {(module.key === 'companions' || module.key === 'orders' || module.key === 'reviews') && (
          <input
            className={inputClass}
            placeholder="关键词"
            value={moduleFilters[module.key].q || ''}
            onChange={e => setModuleFilter(module.key, { q: e.target.value })}
          />
        )}
        {(module.key === 'companions' || module.key === 'orders' || module.key === 'reviews') && (
          <input
            className={inputClass}
            placeholder="状态筛选"
            value={moduleFilters[module.key].status || ''}
            onChange={e => setModuleFilter(module.key, { status: e.target.value })}
          />
        )}
        {module.key === 'risks' && (
          <>
            <input
              className={inputClass}
              placeholder="状态"
              value={moduleFilters[module.key].status || ''}
              onChange={e => setModuleFilter(module.key, { status: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="严重度"
              value={moduleFilters[module.key].severity || ''}
              onChange={e => setModuleFilter(module.key, { severity: e.target.value })}
            />
          </>
        )}
        <select
          className={selectClass}
          style={selectDropdownArrowStyle}
          value={moduleFilters[module.key].sortDir || 'desc'}
          onChange={e => setModuleFilter(module.key, { sortDir: e.target.value as 'asc' | 'desc' })}
        >
          <option className={optionClass} value="desc">
            降序
          </option>
          <option className={optionClass} value="asc">
            升序
          </option>
        </select>
        <button className={primaryBtnClass} onClick={() => run(`刷新「${module.title}」`, () => loadAll(token!))}>
          应用筛选
        </button>
        <button
          className={subtleBtnClass}
          onClick={() =>
            run(`加载下一页「${module.title}」`, async () => {
              setModuleFilter(module.key, { page: 1, cursor: moduleFilters[module.key].cursor || '' });
            })
          }
        >
          下一页
        </button>
      </div>
      <div className="md:hidden space-y-2">
        {(recordsMap[module.key] || []).length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-400">暂无数据，调整筛选或刷新后重试。</div>
        )}
        {(recordsMap[module.key] || []).slice(0, 30).map((record: any) => (
          <div key={record.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white">{renderRecordTitle(module, record)}</p>
                <p className="text-[10px] text-gray-500">{record.id}</p>
              </div>
              <div>{renderCellValue(record.status ?? record.severity ?? '')}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {module.columns.slice(0, 4).map(col => (
                <div key={`${record.id}-${col.key}`} className="rounded-xl bg-white/5 border border-white/10 p-2">
                  <p className="text-gray-500">{col.label}</p>
                  <p className="text-gray-200 mt-1">{renderCellValue(record[col.key])}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {module.key === 'companions' &&
                module.actions.map(a => (
                  <button
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[10px]"
                    key={a.action}
                    onClick={() =>
                      run(`陪玩 ${a.label}`, () => adminApi.reviewCompanion(token!, record.id, a.action as 'APPROVE' | 'REJECT'))
                    }
                  >
                    {a.label}
                  </button>
                ))}
              {module.key === 'orders' &&
                module.actions.map(a => (
                  <button
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[10px]"
                    key={a.action}
                    onClick={() =>
                      run(`订单 ${a.label}`, () => adminApi.operateOrder(token!, record.id, a.action as 'FORCE_CANCEL' | 'RESOLVE_DISPUTE'))
                    }
                  >
                    {a.label}
                  </button>
                ))}
              {module.key === 'reviews' &&
                module.actions.map(a => (
                  <button
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[10px]"
                    key={a.action}
                    onClick={() =>
                      run(`评价 ${a.label}`, () =>
                        adminApi.moderateReview(token!, record.id, a.action as 'APPROVE' | 'REJECT', '后台审核')
                      )
                    }
                  >
                    {a.label}
                  </button>
                ))}
              {module.key === 'risks' && (
                <button
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[10px]"
                  onClick={() => run(t('admin.ops.resolveRiskEvent'), () => adminApi.resolveRiskEvent(token!, record.id))}
                >
                  标记已处理
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              {module.columns.map(col => (
                <th key={col.key} className="text-left border-b border-white/10 py-3 px-3 text-gray-300 font-bold">
                  {col.label}
                </th>
              ))}
              <th className="text-left border-b border-white/10 py-3 px-3 text-gray-300 font-bold w-48">操作</th>
            </tr>
          </thead>
          <tbody>
            {(recordsMap[module.key] || []).length === 0 && (
              <tr>
                <td colSpan={module.columns.length + 1} className="py-8 px-3 text-center text-gray-400">
                  暂无数据，调整筛选或刷新后重试。
                </td>
              </tr>
            )}
            {(recordsMap[module.key] || []).slice(0, 30).map((record: any) => (
              <tr key={record.id} className="hover:bg-white/5 transition-colors">
                {module.columns.map(col => (
                  <td key={`${record.id}-${col.key}`} className="border-b border-white/5 py-2 px-3 text-gray-200">
                    {renderCellValue(record[col.key])}
                  </td>
                ))}
                <td className="border-b border-white/5 py-2 px-3 space-x-1 whitespace-nowrap">
                  {module.key === 'companions' &&
                    module.actions.map(a => (
                      <button
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-purple-200"
                        key={a.action}
                        onClick={() =>
                          run(`陪玩 ${a.label}`, () => adminApi.reviewCompanion(token!, record.id, a.action as 'APPROVE' | 'REJECT'))
                        }
                      >
                        {a.label}
                      </button>
                    ))}
                  {module.key === 'orders' &&
                    module.actions.map(a => (
                      <button
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-purple-200"
                        key={a.action}
                        onClick={() =>
                          run(`订单 ${a.label}`, () => adminApi.operateOrder(token!, record.id, a.action as 'FORCE_CANCEL' | 'RESOLVE_DISPUTE'))
                        }
                      >
                        {a.label}
                      </button>
                    ))}
                  {module.key === 'reviews' &&
                    module.actions.map(a => (
                      <button
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-purple-200"
                        key={a.action}
                        onClick={() =>
                          run(`评价 ${a.label}`, () =>
                            adminApi.moderateReview(token!, record.id, a.action as 'APPROVE' | 'REJECT', '后台审核')
                          )
                        }
                      >
                        {a.label}
                      </button>
                    ))}
                  {module.key === 'risks' && (
                    <button
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-purple-200"
                      onClick={() => run(t('admin.ops.resolveRiskEvent'), () => adminApi.resolveRiskEvent(token!, record.id))}
                    >
                      标记已处理
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  if (!token) {
    return (
      <main className="min-h-screen bg-[#0b0715] text-white p-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(168,85,247,0.12)]">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-purple-300/80 font-bold">Le3eb Admin</p>
            <h1 className="text-3xl font-black tracking-tight">{t('admin.login.title')}</h1>
            <p className="text-sm text-gray-400">{t('admin.login.subtitle')}</p>
          </div>
          <form onSubmit={onLogin} className="grid gap-3">
            <input
              className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('admin.login.emailPlaceholder')}
            />
            <input
              className="bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder={t('admin.login.passwordPlaceholder')}
            />
            <button className="bg-purple-600 hover:bg-purple-500 rounded-xl py-3 font-bold transition-colors" type="submit">
              {t('admin.login.submit')}
            </button>
          </form>
          <p className="text-xs text-purple-300">{status}</p>
        </div>
      </main>
    );
  }

  const adminInitial = (dashboard?.me?.email || email || 'A').slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0b0715] text-white flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#0f081c]">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-300/90 font-bold">Le3eb</p>
            <p className="text-sm font-black">{t('admin.shell.title')}</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active ? 'bg-purple-600/25 text-white border border-purple-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 opacity-90" />
                <span className="font-medium">{t(item.labelKey)}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 text-[10px] text-gray-500">{t('admin.shell.localWorkbench')}</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-white/10 bg-[#0b0715]/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="md:hidden">
              <select
                className={`${selectClass} max-w-[140px]`}
                style={selectDropdownArrowStyle}
                value={activeNav}
                onChange={e => setActiveNav(e.target.value as NavId)}
              >
                {NAV_ITEMS.map(n => (
                  <option className={optionClass} key={n.id} value={n.id}>
                    {t(n.labelKey)}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 truncate">{t('admin.shell.console')}</p>
              <h1 className="text-base md:text-lg font-black truncate">{t(NAV_TITLE_KEY[activeNav])}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-[10px] text-gray-500 max-w-[200px] truncate" title={status}>
              {status}
            </span>
            <button type="button" className="p-2 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors" aria-label={t('admin.shell.notifications')}>
              <Bell className="w-4 h-4" />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-purple-600/40 border border-purple-400/40 flex items-center justify-center text-xs font-bold"
              title={dashboard?.me?.email || email}
            >
              {adminInitial}
            </div>
            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t('admin.shell.userSide')}
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 hover:bg-red-500/25 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t('admin.shell.logout')}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {activeNav === 'dashboard' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">核心指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {Object.entries(dashboard?.metrics || {}).map(([key, value]) => (
                  <div key={key} className="bg-black/20 border border-white/10 rounded-2xl p-3">
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">{toDisplayLabel(key)}</p>
                    <p className="text-xl font-black text-white mt-1">{formatMetricValue(key, value)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-300">管理员角色模板</span>
                <select
                  className={selectClass}
                  style={selectDropdownArrowStyle}
                  value={dashboard?.me?.adminRoleTemplate || 'SUPER_ADMIN'}
                  onChange={e =>
                    run(t('admin.ops.updateAdminTemplate'), () =>
                      adminApi.updateAdminRoleTemplate(token, dashboard?.me?.id, e.target.value as any)
                    )
                  }
                >
                  {Object.keys(roleTemplates).map(key => (
                    <option className={optionClass} key={key} value={key}>
                      {adminRoleTemplateLabelZh(key)}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          )}

          {activeNav === 'users' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">用户列表</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <input
                  className={inputClass}
                  placeholder="搜索 ID / 用户名 / 邮箱"
                  value={userListQ}
                  onChange={e => setUserListQ(e.target.value)}
                />
                <select
                  className={selectClass}
                  style={selectDropdownArrowStyle}
                  value={userListStatus}
                  onChange={e => setUserListStatus(e.target.value)}
                >
                  <option className={optionClass} value="">
                    全部状态
                  </option>
                  <option className={optionClass} value="ACTIVE">
                    正常
                  </option>
                  <option className={optionClass} value="FROZEN">
                    已冻结
                  </option>
                  <option className={optionClass} value="RISK_HOLD">
                    风控中
                  </option>
                </select>
              </div>
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">用户</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">状态</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">金币</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">钻石</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">累充 USD</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">陪玩</th>
                      <th className="text-left border-b border-white/10 py-2 px-2 text-gray-400">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opsUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="border-b border-white/5 py-2 px-2">
                          <p className="font-bold text-white">{u.username}</p>
                          <p className="text-[10px] text-gray-500">{u.id}</p>
                        </td>
                        <td className="border-b border-white/5 py-2 px-2">{renderCellValue(u.accountStatus)}</td>
                        <td className="border-b border-white/5 py-2 px-2">{u.coins}</td>
                        <td className="border-b border-white/5 py-2 px-2">{u.diamonds}</td>
                        <td className="border-b border-white/5 py-2 px-2">${Number(u.lifetimeRechargeUsd || 0).toFixed(2)}</td>
                        <td className="border-b border-white/5 py-2 px-2">{u.isCompanion ? '是' : '否'}</td>
                        <td className="border-b border-white/5 py-2 px-2">
                          <button
                            type="button"
                            className="text-purple-300 hover:underline"
                            onClick={() =>
                              adminApi
                                .getOperationsUser(token!, u.id)
                                .then(setUserDetail)
                                .catch((e: Error) => setStatus(e.message || t('admin.status.operationFailed')))
                            }
                          >
                            详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-2">
                {opsUsers.map((u: any) => (
                  <div key={u.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2">
                    <p className="font-bold">{u.username}</p>
                    <p className="text-[10px] text-gray-500">{u.id}</p>
                    <button
                      type="button"
                      className={primaryBtnClass}
                      onClick={() =>
                        adminApi
                          .getOperationsUser(token!, u.id)
                          .then(setUserDetail)
                          .catch((e: Error) => setStatus(e.message || t('admin.status.operationFailed')))
                      }
                    >
                      详情
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeNav === 'withdrawals' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">提现审核</h3>
              <select
                className={`${selectClass} mb-3`}
                style={selectDropdownArrowStyle}
                value={wdStatusFilter}
                onChange={e => setWdStatusFilter(e.target.value)}
              >
                <option className={optionClass} value="">
                  全部
                </option>
                <option className={optionClass} value="PENDING">
                  待审核
                </option>
                <option className={optionClass} value="APPROVED">
                  已通过
                </option>
                <option className={optionClass} value="REJECTED">
                  已拒绝
                </option>
              </select>
              <div className="space-y-2 text-xs">
                {withdrawalItems.map((w: any) => (
                  <div key={w.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 flex flex-wrap gap-2 justify-between items-start">
                    <div>
                      <p className="font-bold text-white">{w.username || w.userId}</p>
                      <p className="text-gray-500">钻石 {w.diamondAmount} · 手续费 ${w.feeUsd} · 实发 ${w.payoutUsd}</p>
                      <p className="text-gray-500">{w.channel} · {formatMaybeTimestamp(w.createdAt)}</p>
                      {renderCellValue(w.status)}
                    </div>
                    {w.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={primaryBtnClass}
                          onClick={async () => {
                            if (!token) return;
                            setStatus(t('admin.status.processingWithdrawal'));
                            try {
                              await adminApi.reviewWithdrawal(token, w.id, { decision: 'APPROVE', note: '' });
                              const r = await adminApi.listWithdrawals(token, { status: wdStatusFilter || undefined, page: 1, pageSize: 40 });
                              setWithdrawalItems(r.items || []);
                              setStatus(t('admin.status.withdrawalApproved'));
                            } catch (e: any) {
                              setStatus(e?.message || t('admin.status.operationFailed'));
                            }
                          }}
                        >
                          通过
                        </button>
                        <button
                          type="button"
                          className={subtleBtnClass}
                          onClick={async () => {
                            if (!token) return;
                            setStatus(t('admin.status.processingWithdrawal'));
                            try {
                              await adminApi.reviewWithdrawal(token, w.id, { decision: 'REJECT', note: '后台拒绝' });
                              const r = await adminApi.listWithdrawals(token, { status: wdStatusFilter || undefined, page: 1, pageSize: 40 });
                              setWithdrawalItems(r.items || []);
                              setStatus(t('admin.status.withdrawalRejected'));
                            } catch (e: any) {
                              setStatus(e?.message || t('admin.status.operationFailed'));
                            }
                          }}
                        >
                          拒绝
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeNav === 'reports' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">举报审核</h3>
              <select
                className={`${selectClass} mb-3`}
                style={selectDropdownArrowStyle}
                value={repStatusFilter}
                onChange={e => setRepStatusFilter(e.target.value)}
              >
                <option className={optionClass} value="">
                  全部
                </option>
                <option className={optionClass} value="PENDING">
                  待处理
                </option>
                <option className={optionClass} value="RESOLVED">
                  已处理
                </option>
                <option className={optionClass} value="DISMISSED">
                  已驳回
                </option>
              </select>
              <div className="space-y-2 text-xs">
                {reportItems.map((r: any) => (
                  <div key={r.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2">
                    <div className="flex flex-wrap gap-2 justify-between">
                      <span>{renderCellValue(r.targetType)}</span>
                      <span>{renderCellValue(r.status)}</span>
                    </div>
                    <p className="text-gray-300">对象 {r.targetId}</p>
                    <p className="text-gray-400">举报人 {r.reporterUsername || r.reporterUserId}</p>
                    <p className="text-white">{r.reason}</p>
                    {r.status === 'PENDING' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          className={primaryBtnClass}
                          onClick={async () => {
                            if (!token) return;
                            setStatus(t('admin.status.processingReport'));
                            try {
                              await adminApi.resolveModerationReport(token, r.id, { status: 'RESOLVED', note: '已核实' });
                              const x = await adminApi.listModerationReports(token, { status: repStatusFilter || undefined, page: 1, pageSize: 40 });
                              setReportItems(x.items || []);
                              setStatus(t('admin.status.reportResolved'));
                            } catch (e: any) {
                              setStatus(e?.message || t('admin.status.operationFailed'));
                            }
                          }}
                        >
                          结案
                        </button>
                        <button
                          type="button"
                          className={subtleBtnClass}
                          onClick={async () => {
                            if (!token) return;
                            setStatus(t('admin.status.processingReport'));
                            try {
                              await adminApi.resolveModerationReport(token, r.id, { status: 'DISMISSED', note: '不成立' });
                              const x = await adminApi.listModerationReports(token, { status: repStatusFilter || undefined, page: 1, pageSize: 40 });
                              setReportItems(x.items || []);
                              setStatus(t('admin.status.reportDismissed'));
                            } catch (e: any) {
                              setStatus(e?.message || t('admin.status.operationFailed'));
                            }
                          }}
                        >
                          驳回
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeNav === 'data' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">数据报表</h3>
              <div className="flex flex-wrap gap-2 mb-3 items-end">
                <label className="text-[10px] text-gray-500">
                  开始
                  <input
                    type="datetime-local"
                    className={`${inputClass} block mt-1`}
                    value={new Date(dataRange.start).toISOString().slice(0, 16)}
                    onChange={e => setDataRange(d => ({ ...d, start: new Date(e.target.value).getTime() }))}
                  />
                </label>
                <label className="text-[10px] text-gray-500">
                  结束
                  <input
                    type="datetime-local"
                    className={`${inputClass} block mt-1`}
                    value={new Date(dataRange.end).toISOString().slice(0, 16)}
                    onChange={e => setDataRange(d => ({ ...d, end: new Date(e.target.value).getTime() }))}
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(
                  [
                    ['overview', '大盘'],
                    ['recharges', '充值'],
                    ['orders', '订单'],
                    ['withdrawals', '提现'],
                    ['companions', '陪玩'],
                    ['recharge_risk', '充值风控']
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={dataTab === key ? primaryBtnClass : subtleBtnClass}
                    onClick={() => setDataTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {dataTab === 'overview' && dataOverview && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(dataOverview as Record<string, unknown>)
                    .filter(([k, v]) => k !== 'range' && typeof v !== 'object')
                    .map(([k, v]) => (
                      <div key={k} className="bg-black/20 border border-white/10 rounded-2xl p-3">
                        <p className="text-[10px] text-gray-500 font-bold">{toDisplayLabel(k)}</p>
                        <p className="text-lg font-black text-white mt-1">{formatMetricValue(k, v)}</p>
                      </div>
                    ))}
                </div>
              )}
              {dataTab === 'recharges' && (
                <div className="overflow-x-auto text-xs rounded-2xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="p-2">时间</th>
                        <th className="p-2">用户</th>
                        <th className="p-2">金额 USD</th>
                        <th className="p-2">金币</th>
                        <th className="p-2">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataRecharges.map((row: any) => (
                        <tr key={row.id} className="border-b border-white/5">
                          <td className="p-2">{formatMaybeTimestamp(row.timestamp)}</td>
                          <td className="p-2">{row.username || row.userId}</td>
                          <td className="p-2">{row.amount}</td>
                          <td className="p-2">{row.coins}</td>
                          <td className="p-2">{renderCellValue(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {dataTab === 'orders' && (
                <div className="overflow-x-auto text-xs rounded-2xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="p-2">订单</th>
                        <th className="p-2">买家</th>
                        <th className="p-2">陪玩</th>
                        <th className="p-2">金额</th>
                        <th className="p-2">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataOrders.map((row: any) => (
                        <tr key={row.id} className="border-b border-white/5">
                          <td className="p-2">{row.id}</td>
                          <td className="p-2">{row.buyerUsername}</td>
                          <td className="p-2">{row.companionGameName}</td>
                          <td className="p-2">{row.totalPrice}</td>
                          <td className="p-2">{renderCellValue(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {dataTab === 'withdrawals' && (
                <div className="overflow-x-auto text-xs rounded-2xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="p-2">时间</th>
                        <th className="p-2">用户</th>
                        <th className="p-2">钻石</th>
                        <th className="p-2">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataWithdrawals.map((row: any) => (
                        <tr key={row.id} className="border-b border-white/5">
                          <td className="p-2">{formatMaybeTimestamp(row.createdAt)}</td>
                          <td className="p-2">{row.username || row.userId}</td>
                          <td className="p-2">{row.diamondAmount}</td>
                          <td className="p-2">{renderCellValue(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {dataTab === 'companions' && (
                <div className="overflow-x-auto text-xs rounded-2xl border border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="p-2">陪玩</th>
                        <th className="p-2">完成单</th>
                        <th className="p-2">争议</th>
                        <th className="p-2">评分</th>
                        <th className="p-2">收入金币</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataCompanions.map((row: any) => (
                        <tr key={row.companionId} className="border-b border-white/5">
                          <td className="p-2">
                            {row.gameName} · {row.username}
                          </td>
                          <td className="p-2">{row.completedOrders}</td>
                          <td className="p-2">{row.disputedOrders}</td>
                          <td className="p-2">
                            {row.ratingAvg} ({row.ratingCount})
                          </td>
                          <td className="p-2">{row.orderIncomeCoins}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {dataTab === 'recharge_risk' && (
                <ul className="space-y-2 text-xs">
                  {dataRechargeRisk.map((row: any, i: number) => (
                    <li key={i} className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="font-bold text-white">{row.username || row.recharge?.userId}</p>
                      <p className="text-gray-400">{row.triggerReason}</p>
                      <p className="text-gray-500">累充 USD {Number(row.lifetimeRechargeUsd || 0).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {activeModule && renderModuleSection(activeModule)}

          {activeNav === 'companions' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-2">陪玩服务与定价</h3>
              <p className="text-[10px] text-gray-500 mb-3">填写陪玩档案 ID，可更新小时价或服务列表（JSON 数组）。</p>
              <div className="grid gap-2 md:grid-cols-2">
                <input className={inputClass} placeholder="陪玩档案 ID (cp_...)" value={companionEditId} onChange={e => setCompanionEditId(e.target.value)} />
                <input className={inputClass} placeholder="小时价（数字）" value={companionHourly} onChange={e => setCompanionHourly(e.target.value)} />
              </div>
              <textarea
                className={`${inputClass} w-full mt-2 min-h-[100px] font-mono`}
                placeholder='服务 JSON，例：[{"id":"svc1","name":"排位","unitPrice":50,"unit":"小时"}]'
                value={companionServicesJson}
                onChange={e => setCompanionServicesJson(e.target.value)}
              />
              <button
                type="button"
                className={`${primaryBtnClass} mt-2`}
                onClick={() => {
                  const body: { hourlyRate?: number; services?: Array<{ id: string; name: string; unitPrice: number; unit: string }> } = {};
                  if (companionHourly.trim()) body.hourlyRate = Number(companionHourly);
                  if (companionServicesJson.trim()) {
                    try {
                      body.services = JSON.parse(companionServicesJson);
                    } catch {
                      setStatus(t('admin.status.invalidServiceJson'));
                      return;
                    }
                  }
                  run(t('admin.ops.updateCompanionServices'), () =>
                    adminApi.patchCompanionOperator(token!, companionEditId.trim(), body)
                  );
                }}
              >
                保存
              </button>
            </section>
          )}

          {activeNav === 'finance' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">财务对账（近 30 天）</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(finance?.summary || {}).map(([key, value]) => (
                  <div key={key} className="bg-black/20 border border-white/10 rounded-2xl p-3">
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">{toDisplayLabel(key)}</p>
                    <p className="text-lg font-black text-white mt-1">{formatMetricValue(key, value)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeNav === 'audit' && (
            <section className={cardClass}>
              <h3 className="text-lg font-bold mb-3">不可篡改审计日志</h3>
              <div className="flex gap-2 mb-3 flex-wrap">
                <input
                  className={inputClass}
                  placeholder="操作类型"
                  value={auditFilter.action}
                  onChange={e => setAuditFilter(prev => ({ ...prev, action: e.target.value }))}
                />
                <input
                  className={inputClass}
                  placeholder="操作者用户 ID"
                  value={auditFilter.actorUserId}
                  onChange={e => setAuditFilter(prev => ({ ...prev, actorUserId: e.target.value }))}
                />
                <select
                  className={selectClass}
                  style={selectDropdownArrowStyle}
                  value={auditFilter.sortDir}
                  onChange={e => setAuditFilter(prev => ({ ...prev, sortDir: e.target.value as 'asc' | 'desc' }))}
                >
                  <option className={optionClass} value="desc">
                    最新优先
                  </option>
                  <option className={optionClass} value="asc">
                    最早优先
                  </option>
                </select>
                <button className={primaryBtnClass} onClick={() => run(t('admin.ops.filterAuditLogs'), () => loadAll(token))}>
                  应用
                </button>
                <button
                  className={subtleBtnClass}
                  onClick={() =>
                    run(t('admin.ops.loadMoreAudit'), async () => setAuditFilter(prev => ({ ...prev, page: 1, cursor: prev.cursor || '' })))
                  }
                >
                  下一批
                </button>
                <button
                  className={subtleBtnClass}
                  onClick={() =>
                    run(t('admin.ops.exportAuditCsv'), async () => {
                      const now = Date.now();
                      const start = now - 30 * 24 * 60 * 60 * 1000;
                      const csv = await adminApi.exportAuditLogs(token, start, now);
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'audit-logs.csv';
                      link.click();
                      URL.revokeObjectURL(url);
                    })
                  }
                >
                  导出 CSV
                </button>
              </div>
              <ul className="space-y-1">
                {auditLogs.slice(0, 20).map(log => (
                  <li className="text-xs text-gray-300 p-2 rounded-lg hover:bg-white/5 transition-colors font-mono" key={log.id}>
                    {formatMaybeTimestamp(log.timestamp)} · {log.action} · {log.targetType}:{log.targetId} · {log.hash.slice(0, 12)}…
                  </li>
                ))}
              </ul>
              <h4 className="mt-4 mb-2 text-sm font-bold">操作者汇总（近 30 天）</h4>
              <ul className="space-y-1">
                {(auditReport?.actors || []).slice(0, 10).map((actor: any) => (
                  <li
                    className="text-xs text-gray-300 p-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5"
                    key={actor.actorUserId}
                  >
                    <span className="font-bold text-white">{actor.actorUserId}</span> · 操作次数 {actor.actionCount} · 最近{' '}
                    {formatMaybeTimestamp(actor.lastActionAt)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        {userDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className={`${cardClass} max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4`}>
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg font-bold">用户详情</h3>
                <button type="button" className={subtleBtnClass} onClick={() => setUserDetail(null)}>
                  关闭
                </button>
              </div>
              {(() => {
                const pack = userDetail as any;
                const u = pack.user;
                if (!u) return <p className="text-sm text-gray-400">无数据</p>;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <p>
                        <span className="text-gray-500">用户名</span> {u.username}
                      </p>
                      <p>
                        <span className="text-gray-500">邮箱</span> {u.email}
                      </p>
                      <p>
                        <span className="text-gray-500">角色</span> {u.role}
                      </p>
                      <p>
                        <span className="text-gray-500">状态</span> {renderCellValue(u.accountStatus)}
                      </p>
                      <p>
                        <span className="text-gray-500">金币</span> {pack.wallet?.balance}
                      </p>
                      <p>
                        <span className="text-gray-500">钻石</span> {pack.diamondWallet?.balance}
                      </p>
                      <p>
                        <span className="text-gray-500">累充 USD</span> {Number(pack.lifetimeRechargeUsd || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <p className="text-sm font-bold text-white">资产调账</p>
                      <input className={inputClass} placeholder="原因（必填）" value={walletReason} onChange={e => setWalletReason(e.target.value)} />
                      <div className="flex flex-wrap gap-2">
                        <input className={inputClass} placeholder="金币增减" value={walletCoin} onChange={e => setWalletCoin(e.target.value)} />
                        <input className={inputClass} placeholder="钻石增减" value={walletDiamond} onChange={e => setWalletDiamond(e.target.value)} />
                      </div>
                      <button
                        type="button"
                        className={primaryBtnClass}
                        onClick={async () => {
                          if (!token) return;
                          const cd = walletCoin.trim() === '' ? 0 : Number(walletCoin);
                          const dd = walletDiamond.trim() === '' ? 0 : Number(walletDiamond);
                          if (cd === 0 && dd === 0) {
                            setStatus(t('admin.status.fillWalletDelta'));
                            return;
                          }
                          try {
                            await adminApi.adjustUserWallet(token, u.id, {
                              coinDelta: cd,
                              diamondDelta: dd,
                              reason: walletReason || '后台调账'
                            });
                            setUserDetail(await adminApi.getOperationsUser(token, u.id));
                            setStatus(t('admin.status.adjustDone'));
                          } catch (e: any) {
                            setStatus(e?.message || t('admin.status.adjustFailed'));
                          }
                        }}
                      >
                        提交调账
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <p className="text-sm font-bold text-white">代金券（加金币）</p>
                      <div className="flex flex-wrap gap-2">
                        <input className={inputClass} placeholder="金币数量" value={voucherCoinsIn} onChange={e => setVoucherCoinsIn(e.target.value)} />
                        <input className={inputClass} placeholder="券码/备注" value={voucherCodeIn} onChange={e => setVoucherCodeIn(e.target.value)} />
                      </div>
                      <button
                        type="button"
                        className={subtleBtnClass}
                        onClick={async () => {
                          if (!token) return;
                          try {
                            await adminApi.grantUserVoucher(token, u.id, {
                              coins: Number(voucherCoinsIn),
                              code: voucherCodeIn || 'MANUAL'
                            });
                            setUserDetail(await adminApi.getOperationsUser(token, u.id));
                            setStatus(t('admin.status.voucherIssued'));
                          } catch (e: any) {
                            setStatus(e?.message || t('admin.status.voucherIssueFailed'));
                          }
                        }}
                      >
                        发放
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <p className="text-sm font-bold text-white">账号状态</p>
                      <select
                        className={selectClass}
                        style={selectDropdownArrowStyle}
                        value={acctStatusPick}
                        onChange={e => setAcctStatusPick(e.target.value)}
                      >
                        <option className={optionClass} value="ACTIVE">
                          正常
                        </option>
                        <option className={optionClass} value="FROZEN">
                          冻结
                        </option>
                        <option className={optionClass} value="RISK_HOLD">
                          风控中
                        </option>
                      </select>
                      <button
                        type="button"
                        className={primaryBtnClass}
                        onClick={async () => {
                          if (!token) return;
                          try {
                            await adminApi.setUserAccountStatus(token, u.id, { accountStatus: acctStatusPick as any });
                            setUserDetail(await adminApi.getOperationsUser(token, u.id));
                            setStatus(t('admin.status.accountStatusUpdated'));
                          } catch (e: any) {
                            setStatus(e?.message || t('admin.status.updateFailed'));
                          }
                        }}
                      >
                        保存状态
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-2">
                      <p className="text-sm font-bold text-white">资料</p>
                      <input className={inputClass} value={profileNameIn} onChange={e => setProfileNameIn(e.target.value)} />
                      <button
                        type="button"
                        className={subtleBtnClass}
                        onClick={async () => {
                          if (!token) return;
                          try {
                            await adminApi.updateUserProfile(token, u.id, { username: profileNameIn });
                            setUserDetail(await adminApi.getOperationsUser(token, u.id));
                            setStatus(t('admin.status.profileUpdated'));
                          } catch (e: any) {
                            setStatus(e?.message || t('admin.status.updateFailed'));
                          }
                        }}
                      >
                        保存用户名
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-sm font-bold text-white mb-2">最近流水（最多 200 条）</p>
                      <ul className="text-[10px] text-gray-400 space-y-1 max-h-40 overflow-y-auto font-mono">
                        {(pack.transactions || []).slice(0, 40).map((t: any) => (
                          <li key={t.id}>
                            {formatMaybeTimestamp(t.timestamp)} · {t.type} · {t.amount} · {t.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
