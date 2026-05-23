import { useState, useEffect, useMemo, useRef, useCallback, type MouseEvent } from 'react';
import {
  Category, Game, EPal, EPalServiceVariant, Coupon, Playlink, Post, Message, ChatSession, IMOrder,
  Wallet as WalletType, RechargePackage, WalletTransaction,
} from '@shared/types';
import { GAMES, EPALS, POSTS } from '../constants';
import { businessApi, type CompanionRanking } from '../services/businessApi';
import { useI18n } from '../i18n/I18nProvider';
import { useDeviceId } from '../hooks/useDeviceId';
import { type View, BUSINESS_TOKEN_KEY, BUSINESS_UI_AUTH_KEY } from '../router/routes';
import { viewRequiresAuth } from '../router/guards';
import { useUiStore } from '../stores/uiStore';
import { resolveOrderContext } from '../lib/resolveOrderContext';

export function useAppState() {
  const deviceId = useDeviceId();
  const { locale, setLocale, t, supportedLocales, getLocaleLabel } = useI18n();
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargePackages, setRechargePackages] = useState<RechargePackage[]>([]);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [cacheSize, setCacheSize] = useState('12.4 MB');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuthenticatedRef = useRef(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [companionRankings, setCompanionRankings] = useState<CompanionRanking[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [rankingsError, setRankingsError] = useState('');
  const [rankingSortBy, setRankingSortBy] = useState<'SCORE' | 'RATING' | 'COMPLETED'>('SCORE');
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [expandedRankingId, setExpandedRankingId] = useState<string | null>(null);
  const pendingNavigationRef = useRef<{ view: View; data?: any } | null>(null);
  const authTokenRef = useRef<string | null>(null);

  const fetchWallet = useCallback(async () => {
    const token = authTokenRef.current;
    if (!token) {
      setWallet(null);
      return;
    }
    try {
      const data = await businessApi.getWalletBalance(token);
      setWallet(data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    const token = authTokenRef.current;
    if (!token) {
      setTransactions([]);
      return;
    }
    try {
      const data = await businessApi.listWalletTransactions(token);
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }, []);

  const fetchPackages = useCallback(async () => {
    try {
      const data = await businessApi.listRechargePackages();
      setRechargePackages(data);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    }
  }, []);

  const fetchCompanionRankings = useCallback(async (token: string) => {
    setRankingsLoading(true);
    setRankingsError('');
    try {
      const list = await businessApi.listCompanionRankings(token, 10);
      setCompanionRankings(list);
    } catch (error) {
      setRankingsError((error as Error).message || t('ranking.loadFailed'));
    } finally {
      setRankingsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    const uiAuth = sessionStorage.getItem(BUSINESS_UI_AUTH_KEY) === '1';
    setIsAuthenticated(uiAuth);
    isAuthenticatedRef.current = uiAuth;
    const token = uiAuth ? localStorage.getItem(BUSINESS_TOKEN_KEY) : null;
    setAuthToken(token);
    authTokenRef.current = token;
  }, []);

  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !authToken) {
      setCompanionRankings([]);
      setRankingsLoading(false);
      setRankingsError('');
      setWallet(null);
      setTransactions([]);
      return;
    }
    fetchWallet();
    fetchTransactions();
    fetchCompanionRankings(authToken);
  }, [isAuthenticated, authToken, fetchCompanionRankings, fetchWallet, fetchTransactions]);

  const sortedRankings = useMemo(() => {
    const cloned = [...companionRankings];
    if (rankingSortBy === 'RATING') {
      return cloned.sort((a, b) => b.avgRating - a.avgRating || b.rankingScore - a.rankingScore);
    }
    if (rankingSortBy === 'COMPLETED') {
      return cloned.sort((a, b) => b.completedOrderCount - a.completedOrderCount || b.rankingScore - a.rankingScore);
    }
    return cloned.sort((a, b) => b.rankingScore - a.rankingScore || b.avgRating - a.avgRating);
  }, [companionRankings, rankingSortBy]);

  const openAuthModal = (statusText = t('auth.loginRequired')) => {
    setAuthStatus(statusText);
    setAuthMode('LOGIN');
    setShowAuthModal(true);
  };

  const notify = (message: string) => {
    setToastMessage(message);
    useUiStore.getState().setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage('');
      useUiStore.getState().setToastMessage('');
    }, 3500);
  };

  const requireAuthAction = (statusText?: string) => {
    if (isAuthenticatedRef.current) return true;
    openAuthModal(statusText || t('auth.loginRequired'));
    return false;
  };

  const handleLogout = async () => {
    const token = authToken;
    if (token) {
      try {
        await businessApi.logout(token);
      } catch {
        // Keep local logout regardless of network/session errors.
      }
    }
    localStorage.removeItem(BUSINESS_TOKEN_KEY);
    sessionStorage.removeItem(BUSINESS_UI_AUTH_KEY);
    setIsAuthenticated(false);
    isAuthenticatedRef.current = false;
    setAuthToken(null);
    authTokenRef.current = null;
    pendingNavigationRef.current = null;
    setCurrentView('HOME');
    setViewHistory(['HOME']);
    setShowAuthModal(false);
    setAuthStatus(t('auth.loggedOut'));
  };

  const handleAuthSubmit = async () => {
    setAuthStatus(authMode === 'LOGIN' ? t('auth.loggingIn') : t('auth.registering'));
    try {
      if (authMode === 'REGISTER') {
        await businessApi.register(authUsername, authEmail, authPassword, deviceId || undefined);
      }
      const session = await businessApi.login(authEmail, authPassword, deviceId || undefined);
      localStorage.setItem(BUSINESS_TOKEN_KEY, session.token);
      sessionStorage.setItem(BUSINESS_UI_AUTH_KEY, '1');
      setIsAuthenticated(true);
      isAuthenticatedRef.current = true;
      setAuthToken(session.token);
      authTokenRef.current = session.token;
      setShowAuthModal(false);
      setAuthStatus(t('auth.loggedIn'));
      const pending = pendingNavigationRef.current;
      pendingNavigationRef.current = null;
      if (pending) {
        navigateTo(pending.view, pending.data);
      } else {
        setCurrentView('ME');
        setViewHistory(['ME']);
      }
    } catch (error) {
      setAuthStatus((error as Error).message);
    }
  };

  const handleRecharge = async (pkg: RechargePackage, method: 'GOOGLE_PAY' | 'APPLE_PAY') => {
    if (!requireAuthAction(t('auth.loginRequired'))) return;
    const token = authTokenRef.current;
    if (!token) {
      openAuthModal(t('auth.loginRequired'));
      return;
    }
    setIsRecharging(true);
    try {
      // 1. Create Order
      const order = await businessApi.createRechargeOrder(token, pkg.id, method);

      // 2. Simulate Payment Gateway (Apple/Google Pay)
      // In a real app, this would open the native payment sheet
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `pay_${Math.random().toString(36).substr(2, 9)}`;

      // 3. Verify Payment (Callback)
      const result = await businessApi.verifyRecharge(token, order.id, transactionId, 'SUCCESS');

      if (result.status === 'SUCCESS') {
        await fetchWallet();
        await fetchTransactions();
        navigateTo('WALLET');
      } else if (result.status === 'PENDING') {
        notify('Payment is being reviewed for risk control. Please check back later.');
        navigateTo('WALLET');
      }
    } catch (err: any) {
      notify(err.message || 'Recharge failed');
    } finally {
      setIsRecharging(false);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<Category>('GAMES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [applicationDetails, setApplicationDetails] = useState({
    rank: '',
    platform: '',
    style: '',
    price: '',
    discount: ''
  });
  const [selectedEPal, setSelectedEPal] = useState<EPal | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(0);
  const [giftQuantity, setGiftQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [userCoins, setUserCoins] = useState(1250);
  const [userDiamonds, setUserDiamonds] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<'USER' | 'PLAYER'>('USER');
  const [isPlayerOnline, setIsPlayerOnline] = useState(true);
  const [playerApplicationStatus, setPlayerApplicationStatus] = useState<'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'>('NONE');
  const [playerApplicationStep, setPlayerApplicationStep] = useState(1);
  const [playerApplicationData, setPlayerApplicationData] = useState({
    gameId: '',
    rank: '',
    mainPosition: '',
    server: '',
    platform: '',
    style: '',
    intro: '',
    screenshots: [] as string[],
    voiceUrl: '',
    coverUrl: '',
    coverIntro: '',
    serviceName: '',
    price: 0,
    unit: 'Game',
    promotion: {
      type: 'NONE' as 'NONE' | 'FIRST_ORDER_DISCOUNT' | 'DISCOUNT' | 'BUY_X_GET_Y',
      value: 0,
      buyX: 0,
      getY: 0,
      limitType: 'NONE' as 'NONE' | 'TIME' | 'QUANTITY',
      limitValue: 0
    }
  });
  const [applyGameSearchQuery, setApplyGameSearchQuery] = useState('');
  const [showApplySelectionModal, setShowApplySelectionModal] = useState<{
    show: boolean;
    type: 'RANK' | 'MAIN' | 'SERVER' | 'PLATFORM' | 'NONE';
    options: string[];
    title: string;
  }>({
    show: false,
    type: 'NONE',
    options: [],
    title: ''
  });
  const [showGameSelectorModal, setShowGameSelectorModal] = useState(false);
  const [focusCommentInput, setFocusCommentInput] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentView === 'POST_DETAIL' && focusCommentInput && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [currentView, focusCommentInput, selectedPost?.id]);

  const handleWithdrawSubmit = async () => {
    if (!requireAuthAction(t('auth.loginRequired'))) return;
    const token = authTokenRef.current;
    const diamondAmount = Number(withdrawAmount);
    if (!token) {
      openAuthModal(t('auth.loginRequired'));
      return;
    }
    if (!Number.isFinite(diamondAmount) || diamondAmount <= 0) {
      notify('Enter a valid withdrawal amount.');
      return;
    }
    if (!withdrawAddress.trim()) {
      notify('Enter your payout wallet address.');
      return;
    }
    setWithdrawSubmitting(true);
    try {
      await businessApi.createWithdrawRequest(token, diamondAmount, `USDT_TRC20:${withdrawAddress.trim()}`);
      setWithdrawAmount('');
      setWithdrawAddress('');
      notify('Withdrawal request submitted. Please wait for admin approval.');
      handleBack();
    } catch (error) {
      notify((error as Error).message || 'Withdrawal request failed.');
    } finally {
      setWithdrawSubmitting(false);
    }
  };
  const [moreEPals, setMoreEPals] = useState<EPal[]>(EPALS.filter(e => !e.isLegend));
  const [loadingMore, setLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playingEPalId, setPlayingEPalId] = useState<string | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<EPalServiceVariant | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([
    { id: '1', name: 'New User Discount', discount: 5, type: 'FIXED', minSpend: 10 },
    { id: '2', name: 'Weekend Special', discount: 10, type: 'PERCENTAGE', minSpend: 20 }
  ]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [profileTab, setProfileTab] = useState<'Playlink' | 'Service' | 'Album' | 'Post'>('Service');
  const [selectedPlaylinkId, setSelectedPlaylinkId] = useState<string | null>(null);
  const [showPlaylinkModal, setShowPlaylinkModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [epalToUnfollow, setEpalToUnfollow] = useState<EPal | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [reviewSortOrder, setReviewSortOrder] = useState<'DEFAULT' | 'NEWEST' | 'OLDEST' | 'RATING_HIGH' | 'RATING_LOW'>('DEFAULT');
  const [selectedReviewTag, setSelectedReviewTag] = useState<string | null>(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [showReviewFilterModal, setShowReviewFilterModal] = useState(false);
  const [imTab, setImTab] = useState<'MESSAGE' | 'ORDER' | 'FRIENDS'>('MESSAGE');
  const [imSearchQuery, setImSearchQuery] = useState('');
  const [walletTab, setWalletTab] = useState<'ALL' | 'RECHARGE' | 'ORDER'>('ALL');
  const [walletDate, setWalletDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedApplyGameCategory, setSelectedApplyGameCategory] = useState<string>('GAMES');
  const [epalSortBy, setEpalSortBy] = useState<'DEFAULT' | 'ORDERS' | 'SCORE'>('DEFAULT');
  const [epalFilters, setEpalFilters] = useState({
    status: 'ALL' as 'ALL' | 'ONLINE',
    gender: 'ALL' as 'ALL' | 'Male' | 'Female',
    priceRange: [0, 100] as [number, number],
    server: 'ALL' as string,
    platform: 'ALL' as string,
    rank: 'ALL' as string,
  });
  const [showEpalFilterModal, setShowEpalFilterModal] = useState(false);
  const [showRankSelectorModal, setShowRankSelectorModal] = useState(false);
  const [showServerSelectorModal, setShowServerSelectorModal] = useState(false);
  const [showPlatformSelectorModal, setShowPlatformSelectorModal] = useState(false);
  const [isImSearchExpanded, setIsImSearchExpanded] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: '1', participantId: '1', lastMessage: 'Let\'s play tomorrow!', lastTimestamp: Date.now() - 1800000, unreadCount: 2 },
    { id: '2', participantId: '2', lastMessage: 'Nice sniper montage!', lastTimestamp: Date.now() - 3600000, unreadCount: 0 },
    { id: '3', participantId: '3', lastMessage: 'Looking for a duo?', lastTimestamp: Date.now() - 7200000, unreadCount: 1 },
  ]);
  const [imOrders, setImOrders] = useState<IMOrder[]>([
    { id: 'o1', epalId: '1', serviceName: 'League of Legends', status: 'COMPLETED', price: 15, timestamp: Date.now() - 86400000, endTime: Date.now() - 86400000 + 3600000, unit: 'Game', unitPrice: 15, quantity: 1 },
    { id: 'o2', epalId: '3', serviceName: 'Valorant', status: 'COMPLETED', price: 24, timestamp: Date.now() - 172800000, endTime: Date.now() - 172800000 + 3600000, unit: 'Game', unitPrice: 12, quantity: 2 },
  ]);
  const [showOngoingOrderWarning, setShowOngoingOrderWarning] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([
    { id: 'm0', senderId: '1', receiverId: 'me', content: 'Long time no see!', timestamp: Date.now() - 86400000 * 2, type: 'text' }, // 2 days ago
    { id: 'm1', senderId: '1', receiverId: 'me', content: 'Hello!', timestamp: Date.now() - 3600000, type: 'text' },
    { id: 'm2', senderId: 'me', receiverId: '1', content: 'Hi there!', timestamp: Date.now() - 3500000, type: 'text' },
    { id: 'm3', senderId: '1', receiverId: 'me', content: 'Want to play?', timestamp: Date.now() - 3400000, type: 'text' },
    { id: 'm4', senderId: 'me', receiverId: '1', content: 'Sure, let\'s go!', timestamp: Date.now() - 60000, type: 'text' }, // 1 min ago
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<IMOrder | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showImServiceCards, setShowImServiceCards] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [reviewFeedback, setReviewFeedback] = useState('');

  useEffect(() => {
    if (showPlaylinkModal && selectedPlaylinkId) {
      setTimeout(() => {
        const element = document.getElementById(`pl-card-${selectedPlaylinkId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        }
      }, 100);
    }
  }, [showPlaylinkModal, selectedPlaylinkId]);

  useEffect(() => {
    // Reset any service-related state if needed
    setShowServiceDetails(false);
  }, [activeServiceId]);

  const [orderTab, setOrderTab] = useState<'ALL' | 'PENDING' | 'ONGOING' | 'COMPLETED'>('ALL');
  const [userStatus, setUserStatus] = useState<'ONLINE' | 'OFFLINE' | 'PLAYING' | 'RESTING'>('ONLINE');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [viewHistory, setViewHistory] = useState<View[]>(['HOME']);
  const [contactsTab, setContactsTab] = useState<'FRIENDS' | 'FOLLOWING' | 'FOLLOWERS'>('FRIENDS');
  const [communityTab, setCommunityTab] = useState<'TRENDING' | 'LATEST' | 'FOLLOWING'>('TRENDING');
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [fullSearchQuery, setFullSearchQuery] = useState('');
  const [fullSearchResults, setFullSearchResults] = useState<EPal[]>([]);

  const [isScrolling, setIsScrolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followedEPals, setFollowedEPals] = useState<Set<string>>(new Set());
  const followersOfMe = useMemo(() => new Set(['1', '2', '3', '5']), []); // Mock users who follow me
  const mutualFollowers = useMemo(() => {
    return EPALS.filter(epal => followedEPals.has(epal.id) && followersOfMe.has(epal.id));
  }, [followedEPals, followersOfMe]);

  const filteredPosts = useMemo(() => {
    let posts = [...POSTS];
    if (selectedGame) {
      posts = posts.filter(post => post.gameId === selectedGame.id);
    }

    switch (communityTab) {
      case 'TRENDING':
        return posts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
      case 'LATEST':
        return posts.sort((a, b) => b.timestamp - a.timestamp);
      case 'FOLLOWING':
        return posts.filter(post => followedEPals.has(post.userId));
      default:
        return posts;
    }
  }, [communityTab, selectedGame, followedEPals]);

  const toggleFollow = (id: string) => {
    if (!requireAuthAction(t('auth.loginRequiredFeature'))) {
      return;
    }
    if (followedEPals.has(id)) {
      // Show confirmation modal
      const epal = EPALS.find(e => e.id === id);
      if (epal) {
        setEpalToUnfollow(epal);
        setShowUnfollowModal(true);
      }
      return;
    }

    setFollowedEPals(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const confirmUnfollow = () => {
    if (epalToUnfollow) {
      setFollowedEPals(prev => {
        const next = new Set(prev);
        next.delete(epalToUnfollow.id);
        return next;
      });
      setShowUnfollowModal(false);
      setEpalToUnfollow(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide after 1.5 seconds of no scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentView === 'HOME') {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, currentView]);

  const legendEPals = useMemo(() => EPALS.filter(e => e.isLegend).slice(0, 10), []);

  const navigateTo = (view: View, data?: any) => {
    const requiresAuth = viewRequiresAuth(view, data);
    if (requiresAuth && !isAuthenticatedRef.current) {
      pendingNavigationRef.current = { view, data };
      openAuthModal(t('auth.loginRequiredFeature'));
      return;
    }

    // Reset focus state on every navigation unless explicitly requested for POST_DETAIL
    setFocusCommentInput(false);
    setShowImServiceCards(false);

    if (view !== 'IM') {
      setIsImSearchExpanded(false);
      setImSearchQuery('');
    }

    if (view === 'COMMUNITY') setSelectedGame(data || null);
    if (view === 'POST_DETAIL') {
      setSelectedPost(data.post);
      setFocusCommentInput(data.focusInput || false);
    }
    if (view === 'GAME_DETAIL') setSelectedGame(data);
    if (view === 'PROFILE') {
      setSelectedEPal(data);
      if (data.services && data.services.length > 0) {
        setActiveServiceId(data.services[0].id);
      } else {
        setActiveServiceId(null);
      }
    }
    if (view === 'ORDER_CONFIRM') {
      const epal = data?.epal || selectedEPal;
      if (!epal) return;

      const hasOngoingOrder = imOrders.some(order =>
        order.epalId === epal.id &&
        order.status !== 'COMPLETED' &&
        order.status !== 'CANCELLED',
      );
      if (hasOngoingOrder) {
        setShowOngoingOrderWarning(true);
        return;
      }

      const orderContext = resolveOrderContext(epal, {
        variant: data?.variant,
        serviceId: data?.serviceId,
        activeServiceId,
      });
      if (!orderContext) {
        notify('This companion has no bookable services yet.');
        return;
      }

      if (data?.epal) setSelectedEPal(data.epal);
      setActiveServiceId(orderContext.serviceId);
      setSelectedVariant(orderContext.variant);
      setOrderQuantity(1);
      setSelectedCoupon(null);
    }
    
    if (view === 'ALL_REVIEWS') {
      setSelectedEPal(data.epal);
      setReviewSortOrder('DEFAULT');
      setSelectedReviewTag(null);
      setSelectedRatingFilter(null);
      setShowReviewFilterModal(false);
    }

    if (view === 'IM_DETAIL') {
      setSelectedEPal(data);
      // Reset messages for the selected EPal (mock)
      setCurrentMessages([
        { id: 'm0', senderId: data.id, receiverId: 'me', content: 'Long time no see!', timestamp: Date.now() - 86400000 * 2, type: 'text' }, // 2 days ago
        { id: 'm1', senderId: data.id, receiverId: 'me', content: `Hello! I'm ${data.name}`, timestamp: Date.now() - 3600000, type: 'text' },
        { id: 'm2', senderId: 'me', receiverId: data.id, content: 'Hi there!', timestamp: Date.now() - 3500000, type: 'text' },
        { id: 'm3', senderId: data.id, receiverId: 'me', content: 'Want to play?', timestamp: Date.now() - 3400000, type: 'text' },
        { id: 'm4', senderId: 'me', receiverId: data.id, content: 'Sure, let\'s go!', timestamp: Date.now() - 60000, type: 'text' }, // 1 min ago
      ]);
    }
    
    if (view === 'HOME' || view === 'ME' || view === 'COMMUNITY' || view === 'IM') {
      setViewHistory([view]);
    } else {
      setViewHistory(prev => {
        // Don't push if it's the same as the current view
        if (prev[prev.length - 1] === view) return prev;
        return [...prev, view];
      });
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };


  const handleBack = () => {
    // Reset focus state when going back
    setFocusCommentInput(false);
    setShowImServiceCards(false);

    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
      window.scrollTo(0, 0);
    } else {
      setCurrentView('HOME');
      setViewHistory(['HOME']);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newItems = EPALS.filter(e => !e.isLegend).map(e => ({ ...e, id: Math.random().toString() }));
      setMoreEPals(prev => [...prev, ...newItems]);
      setLoadingMore(false);
    }, 1000);
  };

  const toggleFavorite = (gameId: string, e: MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handlePlayToggle = (epalId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (playingEPalId === epalId) {
      setPlayingEPalId(null);
    } else {
      setPlayingEPalId(epalId);
      // Auto stop after 5 seconds to simulate audio length
      setTimeout(() => {
        setPlayingEPalId(current => current === epalId ? null : current);
      }, 5000);
    }
  };

  const allSortedGames = useMemo(() => {
    return [...GAMES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);


  // Filter EPals for the Chilling tab
  const favoritedGames = useMemo(() => {
    return allSortedGames.filter(g => favorites.includes(g.id));
  }, [allSortedGames, favorites]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const headerOffset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const groupedGames = useMemo<{ [key: string]: Game[] } | null>(() => {
    if (selectedCategory !== 'GAMES') return null;
    const groups: { [key: string]: Game[] } = {};
    GAMES.filter(g => 
      g.category === 'GAMES' && 
      (searchQuery === '' || g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).forEach(game => {
      const letter = game.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(game);
    });
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {} as { [key: string]: Game[] });
  }, [selectedCategory, searchQuery]);

  return {
    deviceId, locale, setLocale, t, supportedLocales, getLocaleLabel,
    currentView, setCurrentView, wallet, setWallet, transactions, setTransactions,
    rechargePackages, setRechargePackages, isRecharging, setIsRecharging,
    isRecording, setIsRecording, recordingTime, setRecordingTime,
    pushNotificationsEnabled, setPushNotificationsEnabled, cacheSize, setCacheSize,
    isAuthenticated, setIsAuthenticated, isAuthenticatedRef, authToken, setAuthToken,
    showAuthModal, setShowAuthModal, authMode, setAuthMode, authEmail, setAuthEmail,
    authPassword, setAuthPassword, authUsername, setAuthUsername, authStatus, setAuthStatus,
    toastMessage, setToastMessage, companionRankings, setCompanionRankings,
    rankingsLoading, setRankingsLoading, rankingsError, setRankingsError,
    rankingSortBy, setRankingSortBy, showRankingModal, setShowRankingModal,
    expandedRankingId, setExpandedRankingId, pendingNavigationRef, authTokenRef,
    fetchWallet, fetchTransactions, fetchPackages, fetchCompanionRankings, sortedRankings,
    openAuthModal, notify, requireAuthAction, handleLogout, handleAuthSubmit, handleRecharge,
    selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, selectedGame, setSelectedGame,
    selectedServiceCategory, setSelectedServiceCategory, applicationDetails, setApplicationDetails,
    selectedEPal, setSelectedEPal, selectedPost, setSelectedPost, showGiftPanel, setShowGiftPanel,
    selectedGiftId, setSelectedGiftId, giftQuantity, setGiftQuantity, showQuantitySelector, setShowQuantitySelector,
    userCoins, setUserCoins, userDiamonds, setUserDiamonds, withdrawAmount, setWithdrawAmount,
    withdrawAddress, setWithdrawAddress, withdrawSubmitting, setWithdrawSubmitting,
    userRole, setUserRole, isPlayerOnline, setIsPlayerOnline, playerApplicationStatus, setPlayerApplicationStatus,
    playerApplicationStep, setPlayerApplicationStep, playerApplicationData, setPlayerApplicationData,
    applyGameSearchQuery, setApplyGameSearchQuery, showApplySelectionModal, setShowApplySelectionModal,
    showGameSelectorModal, setShowGameSelectorModal, focusCommentInput, setFocusCommentInput, commentInputRef,
    handleWithdrawSubmit, moreEPals, setMoreEPals, loadingMore, setLoadingMore, favorites, setFavorites,
    playingEPalId, setPlayingEPalId, activeServiceId, setActiveServiceId, selectedVariant, setSelectedVariant,
    orderQuantity, setOrderQuantity, availableCoupons, setAvailableCoupons, selectedCoupon, setSelectedCoupon,
    showCouponModal, setShowCouponModal, showServiceTypeModal, setShowServiceTypeModal,
    profileTab, setProfileTab, selectedPlaylinkId, setSelectedPlaylinkId, showPlaylinkModal, setShowPlaylinkModal,
    showUnfollowModal, setShowUnfollowModal, epalToUnfollow, setEpalToUnfollow, showServiceDetails, setShowServiceDetails,
    reviewSortOrder, setReviewSortOrder, selectedReviewTag, setSelectedReviewTag, selectedRatingFilter, setSelectedRatingFilter,
    showReviewFilterModal, setShowReviewFilterModal, imTab, setImTab, imSearchQuery, setImSearchQuery,
    walletTab, setWalletTab, walletDate, setWalletDate, selectedApplyGameCategory, setSelectedApplyGameCategory,
    epalSortBy, setEpalSortBy, epalFilters, setEpalFilters, showEpalFilterModal, setShowEpalFilterModal,
    showRankSelectorModal, setShowRankSelectorModal, showServerSelectorModal, setShowServerSelectorModal,
    showPlatformSelectorModal, setShowPlatformSelectorModal, isImSearchExpanded, setIsImSearchExpanded,
    chatSessions, setChatSessions, imOrders, setImOrders, showOngoingOrderWarning, setShowOngoingOrderWarning,
    currentMessages, setCurrentMessages, messageInput, setMessageInput, selectedOrder, setSelectedOrder,
    showOrderDetailModal, setShowOrderDetailModal, showImServiceCards, setShowImServiceCards,
    showReviewModal, setShowReviewModal, reviewRating, setReviewRating, reviewTags, setReviewTags, reviewFeedback, setReviewFeedback,
    orderTab, setOrderTab, userStatus, setUserStatus, showStatusModal, setShowStatusModal, viewHistory, setViewHistory,
    contactsTab, setContactsTab, communityTab, setCommunityTab, showFullSearch, setShowFullSearch,
    fullSearchQuery, setFullSearchQuery, fullSearchResults, setFullSearchResults,
    isScrolling, setIsScrolling, copied, setCopied, followedEPals, setFollowedEPals, followersOfMe, mutualFollowers,
    filteredPosts, toggleFollow, confirmUnfollow, copyToClipboard, observer, lastElementRef, legendEPals,
    navigateTo, handleBack, loadMore, toggleFavorite, handlePlayToggle, allSortedGames, favoritedGames, alphabet, scrollToLetter, groupedGames,
    EPALS, GAMES, POSTS,
  };
}

export type AppState = ReturnType<typeof useAppState>;
