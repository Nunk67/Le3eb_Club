import React from 'react';
import { 
  Search, 
  Gift, 
  Gamepad2, 
  Coffee, 
  Star, 
  Home, 
  Compass, 
  MessageSquare, 
  User, 
  ChevronRight, 
  Play, 
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Mic2,
  MapPin,
  User2,
  Heart,
  Venus,
  Mars,
  Copy,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Image,
  Layout,
  Monitor,
  Smartphone,
  Share2,
  ChevronDown,
  ChevronUp,
  Filter,
  SlidersHorizontal,
  ThumbsUp,
  MoreHorizontal,
  Flag,
  Users,
  Zap,
  Trophy,
  Send,
  Bell,
  Contact,
  Smile,
  AlertTriangle,
  Wallet,
  CreditCard,
  History,
  Settings,
  X,
  Camera,
  LogOut,
  ShieldCheck,
  HelpCircle,
  Gem,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Calendar,
  Store,
  ChevronLeft,
  Lock,
  Globe,
  Shield,
  Link,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Game, EPal, EPalServiceVariant, Coupon, Playlink, Post, Message, ChatSession, IMOrder, Wallet as WalletType, RechargePackage, WalletTransaction, RechargeOrder } from '@shared/types';
import { PRODUCT_SEMVER } from '../constants';
import { GlassCard } from '../components/ui/GlassCard';
import { IconButton } from '../components/ui/IconButton';
import { WaveAnimation } from '../components/ui/WaveAnimation';
import { CoinIcon } from '../components/ui/CoinIcon';
import { EPalCard } from '../components/cards/EPalCard';
import { LegendEPalCard } from '../components/cards/LegendEPalCard';
import { GameGridItem } from '../components/cards/GameGridItem';
import { WalletView } from '../views/WalletView';
import { RechargeView } from '../views/RechargeView';
import { SettingsSubPage } from '../components/SettingsSubPage';
import { formatChatMessageTime } from '../lib/chatTime';

import { useApp } from '../app/AppContext';

export function MeView() {
const {
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
  } = useApp();

  return (
            <motion.div 
              key="me"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a]"
            >
              {!isAuthenticated ? (
                <div className="px-6 pt-10 space-y-6">
                  <GlassCard className="p-8 space-y-5 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white">{t('auth.welcomeTitle')}</h2>
                      <p className="text-sm text-gray-400">{t('auth.welcomeBody')}</p>
                    </div>
                    <div className="grid gap-3">
                      <button
                        onClick={() => openAuthModal(t('auth.loginRequired'))}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                      >
                        {t('auth.goToLogin')}
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('REGISTER');
                          setAuthStatus(t('auth.registerPrompt'));
                          setShowAuthModal(true);
                        }}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-bold"
                      >
                        {t('auth.register')}
                      </button>
                    </div>
                  </GlassCard>
                </div>
              ) : (
              <div className="px-6 pt-8 space-y-4 relative z-10">
                {/* User Info Card */}
                <div className="flex items-center gap-4 px-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[28px] border-4 border-[#0f071a] overflow-hidden shadow-2xl">
                      <img src={EPALS[0].avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-black text-white truncate">Sogeryou</h1>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">ID: 88886666</span>
                        <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowStatusModal(true)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                          userStatus === 'ONLINE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          userStatus === 'PLAYING' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          userStatus === 'RESTING' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/10 border-gray-500/20 text-gray-400'
                        }`}
                      >
                        <div className={`w-1 h-1 rounded-full ${
                          userStatus === 'ONLINE' ? 'bg-green-400' :
                          userStatus === 'PLAYING' ? 'bg-blue-400' :
                          userStatus === 'RESTING' ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`} />
                        {userStatus}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <GlassCard 
                  className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30 overflow-hidden relative group cursor-pointer" 
                  onClick={() => navigateTo('WALLET')}
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{t('me.walletBalance')}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <CoinIcon className="w-6 h-6" />
                          <span className="text-3xl font-black text-white tracking-tight">{wallet?.balance ?? 0}</span>
                        </div>
                        {userRole === 'PLAYER' && (
                          <>
                            <div className="w-px h-8 bg-white/10 mx-2" />
                            <div className="flex items-center gap-2">
                              <Gem className="w-6 h-6 text-purple-400" />
                              <span className="text-3xl font-black text-white tracking-tight">{userDiamonds}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>

                {/* Companion Ranking */}
                <GlassCard className="p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <p className="text-sm font-black text-white uppercase tracking-widest">{t('ranking.title')}</p>
                    </div>
                    {rankingsLoading && <span className="text-[10px] text-gray-400">{t('ranking.refreshing')}</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { id: 'SCORE', label: t('ranking.byScore') },
                      { id: 'RATING', label: t('ranking.byRating') },
                      { id: 'COMPLETED', label: t('ranking.byCompleted') }
                    ].map(sort => (
                      <button
                        key={sort.id}
                        onClick={() => setRankingSortBy(sort.id as 'SCORE' | 'RATING' | 'COMPLETED')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition-all ${
                          rankingSortBy === sort.id
                            ? 'bg-purple-600/30 border-purple-400/40 text-purple-200'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                  {rankingsError ? (
                    <p className="text-xs text-red-300">{rankingsError}</p>
                  ) : sortedRankings.length === 0 ? (
                    <p className="text-xs text-gray-400">{t('ranking.noData')}</p>
                  ) : (
                    <div className="space-y-2">
                      {sortedRankings.slice(0, 5).map(item => (
                        <div key={item.companionId} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">#{item.rank} {item.gameName}</p>
                            <p className="text-[10px] text-gray-400">
                              {t('ranking.scoreLine', {
                                score: item.rankingScore.toFixed(2),
                                poolTag: item.poolTag,
                                completed: item.completedOrderCount
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-purple-300">★ {item.avgRating.toFixed(2)}</p>
                            <p className="text-[10px] text-gray-500">{t('ranking.completionRate', { rate: Math.round(item.completionRate * 100) })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowRankingModal(true)}
                    className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 py-2 text-xs font-bold text-gray-200 hover:bg-white/10 transition-all"
                  >
                    {t('ranking.viewTop10')}
                  </button>
                </GlassCard>

                {/* Main Menu */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">{t('me.accountManagement')}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => navigateTo('MY_ORDERS')}
                      className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 active:scale-[0.99] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white">{t('me.myOrders')}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{t('me.myOrdersSubtitle')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {userRole === 'PLAYER' ? (
                      <>
                        <button 
                          onClick={() => navigateTo('PLAYER_PROFILE_EDIT')}
                          className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 active:scale-[0.99] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                              <Store className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-white">{t('me.playerProfile')}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{t('me.playerProfileSubtitle')}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPlayerOnline ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${isPlayerOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-white">{t('me.onlineStatus')}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{isPlayerOnline ? t('me.onlineVisible') : t('me.onlineHidden')}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsPlayerOnline(!isPlayerOnline)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isPlayerOnline ? 'bg-purple-600' : 'bg-white/10'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isPlayerOnline ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigateTo('APPLY_PLAYER')}
                        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-600/20 to-transparent rounded-[24px] border border-purple-500/30 hover:bg-purple-600/20 active:scale-[0.99] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Zap className="w-6 h-6 fill-current" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white">{t('me.becomePlayer')}</p>
                            <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{t('me.earnDiamonds')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Secondary Menu */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">{t('me.supportSecurity')}</p>
                  <div className="space-y-1">
                    {[
                      { icon: Settings, label: t('me.menuSettings'), color: 'text-gray-400', action: () => navigateTo('SETTINGS') },
                      { icon: ShieldCheck, label: t('me.menuAccountSecurity'), color: 'text-green-400' },
                      { icon: HelpCircle, label: t('me.menuHelp'), color: 'text-blue-400' },
                      { icon: Smile, label: t('me.menuGuidelines'), color: 'text-yellow-400' },
                    ].map((item) => (
                      <button 
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-bold text-gray-300">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* Status Selection Modal */}
              <AnimatePresence>
                {showStatusModal && (
                  <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-12">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowStatusModal(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      className="w-full max-w-md bg-[#1a1225] rounded-[32px] p-6 relative z-10 border border-white/10 shadow-2xl"
                    >
                      <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
                      <h3 className="text-lg font-bold text-white mb-6 text-center">{t('me.adjustStatus')}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { id: 'ONLINE', label: t('me.statusOnline'), color: 'bg-green-500', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
                          { id: 'OFFLINE', label: t('me.statusOffline'), color: 'bg-gray-500', icon: <div className="w-2 h-2 rounded-full bg-gray-500" /> },
                          { id: 'PLAYING', label: t('me.statusPlaying'), color: 'bg-blue-500', icon: <div className="w-2 h-2 rounded-full bg-blue-500" /> },
                          { id: 'RESTING', label: t('me.statusResting'), color: 'bg-yellow-500', icon: <div className="w-2 h-2 rounded-full bg-yellow-500" /> },
                        ].map((status) => (
                          <button
                            key={status.id}
                            onClick={() => {
                              setUserStatus(status.id as any);
                              setShowStatusModal(false);
                            }}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              userStatus === status.id 
                                ? 'bg-purple-600/20 border-purple-500/50 text-white' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {status.icon}
                              <span className="font-bold">{status.label}</span>
                            </div>
                            {userStatus === status.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setShowStatusModal(false)}
                        className="w-full py-4 mt-6 bg-white/5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-white/10 transition-all"
                      >
                        {t('me.cancel')}
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
  );
}
