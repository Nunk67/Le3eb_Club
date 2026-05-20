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

import { useApp } from './AppContext';
import { ViewRouter } from '../views/ViewRouter';

export function AppShell() {
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
    <div className="min-h-screen bg-[#0f071a] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      {['HOME', 'COMMUNITY', 'IM', 'ME', 'COMMUNITY_SELECTOR'].includes(currentView) && (
        <header className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          {currentView === 'HOME' ? (
            <>
              <div className="flex-1 max-w-xs">
                <button 
                  onClick={() => setShowFullSearch(true)}
                  className="w-full flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 hover:border-purple-500/50 transition-all text-left"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{t('home.search')}</span>
                </button>
              </div>
              <button className="ml-4 p-2 text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors">
                <Gift className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 w-full">
              {viewHistory.length > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className={`text-lg font-bold flex-1 min-w-0 ${viewHistory.length === 1 ? 'text-center' : ''}`}>
                 {currentView === 'COMMUNITY' ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
                      <button
                        onClick={() => setSelectedGame(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                          selectedGame === null ? 'bg-purple-600 text-white' : 'text-gray-400'
                        }`}
                      >
                        {t('orders.tabAll')}
                      </button>
                      {GAMES.slice(0, 4).map(game => (
                        <button
                          key={game.id}
                          onClick={() => setSelectedGame(game)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            selectedGame?.id === game.id ? 'bg-purple-600 text-white' : 'text-gray-400'
                          }`}
                        >
                          {game.name}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => navigateTo('COMMUNITY_SELECTOR')}
                      className="p-1.5 bg-white/5 rounded-full text-gray-400 shrink-0 ml-2"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ) : currentView === 'IM' ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{t('nav.im')}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowFullSearch(true)} className="p-2 hover:bg-white/10 rounded-full">
                        <Search className="w-5 h-5" />
                      </button>
                      <button onClick={() => navigateTo('CONTACTS')} className="p-2 hover:bg-white/10 rounded-full">
                        <Users className="w-5 h-5" />
                      </button>
                      <button onClick={() => navigateTo('NOTIFICATIONS')} className="p-2 hover:bg-white/10 rounded-full">
                        <Bell className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : currentView === 'ME' ? (
                  t('nav.me')
                ) : currentView === 'COMMUNITY_SELECTOR' ? (
                  t('community.selectTitle')
                ) : null}
              </h2>
            </div>
          )}
        </header>
      )}

      <main className="pb-32">
        {/* Full-screen Search Modal */}
      <AnimatePresence>
        {showFullSearch && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0f071a] flex flex-col"
          >
            {/* Search Header */}
            <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5">
              <button 
                onClick={() => {
                  setShowFullSearch(false);
                  setFullSearchQuery('');
                  setFullSearchResults([]);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('search.placeholderByIdOrName')}
                  value={fullSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setFullSearchQuery(query);
                    if (query.trim()) {
                      const results = EPALS.filter(epal => 
                        epal.id.toLowerCase().includes(query.toLowerCase()) || 
                        epal.name.toLowerCase().includes(query.toLowerCase())
                      );
                      setFullSearchResults(results);
                    } else {
                      setFullSearchResults([]);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-6 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {fullSearchQuery.trim() === '' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Search className="w-10 h-10 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold">{t('search.forEpalsTitle')}</p>
                    <p className="text-xs text-gray-600">{t('search.forEpalsSubtitle')}</p>
                  </div>
                </div>
              ) : fullSearchResults.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <p className="text-gray-500 font-bold">{t('search.noResultsForQuery', { query: fullSearchQuery })}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('search.resultsHeading')}</p>
                  <div className="space-y-4">
                    {fullSearchResults.map(epal => {
                      const session = currentView === 'IM' ? chatSessions.find(s => s.participantId === epal.id) : null;
                      
                      return (
                          <div 
                            key={epal.id}
                            onClick={() => {
                              setShowFullSearch(false);
                              if (currentView === 'IM') {
                                navigateTo('IM_DETAIL', epal);
                              } else {
                                navigateTo('PROFILE', epal);
                              }
                            }}
                            className="flex items-center gap-4 p-2 hover:bg-white/5 transition-all cursor-pointer rounded-xl"
                          >
                            <img src={epal.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white truncate">{epal.name}</h4>
                              {session ? (
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                  <p className="text-[11px] text-gray-500 truncate flex-1">{session.lastMessage}</p>
                                  <span className="text-[9px] text-gray-700 shrink-0">{formatChatMessageTime(session.lastTimestamp)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {t('search.epalIdPrefix')} {epal.id}
                                  </span>
                                  <span className="text-gray-700 text-[10px]">•</span>
                                  <span className="text-[10px] text-purple-400 font-bold">{epal.game}</span>
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ViewRouter />
      </main>

        {/* EPal Filter Modal */}
        <AnimatePresence>
          {showEpalFilterModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[401] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0 border-b border-white/5">
                <button 
                  onClick={() => setShowEpalFilterModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Filters</h2>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8 space-y-10">
                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Status</h3>
                  <div className="flex gap-3">
                    {['ALL', 'ONLINE'].map(s => (
                      <button
                        key={s}
                        onClick={() => setEpalFilters(prev => ({ ...prev, status: s as any }))}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                          epalFilters.status === s 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {s === 'ALL' ? 'All' : 'Online Only'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Gender</h3>
                  <div className="flex gap-3">
                    {['ALL', 'Male', 'Female'].map(g => (
                      <button
                        key={g}
                        onClick={() => setEpalFilters(prev => ({ ...prev, gender: g as any }))}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                          epalFilters.gender === g 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {g === 'ALL' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Price Range</h3>
                    <span className="text-xs font-bold text-white">{epalFilters.priceRange[0]} - {epalFilters.priceRange[1]} Coins</span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={epalFilters.priceRange[1]}
                      onChange={(e) => setEpalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>

                {/* Dynamic Filters (Server, Platform, Rank) */}
                {(() => {
                  const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                  const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                  
                  const servers = Array.from(new Set(playlinks.map(pl => pl.server).filter(Boolean)));
                  const platforms = Array.from(new Set(playlinks.map(pl => pl.platform).filter(Boolean)));
                  const ranks = Array.from(new Set(playlinks.map(pl => pl.rank).filter(Boolean)));

                  return (
                    <div className="space-y-10">
                      {servers.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Server</h3>
                          <button
                            onClick={() => setShowServerSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.server === 'ALL' ? 'All Servers' : epalFilters.server}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}

                      {platforms.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Platform</h3>
                          <button
                            onClick={() => setShowPlatformSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.platform === 'ALL' ? 'All Platforms' : epalFilters.platform}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}

                      {ranks.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Rank</h3>
                          <button
                            onClick={() => setShowRankSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.rank === 'ALL' ? 'All Ranks' : epalFilters.rank}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Fixed Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0f071a] flex gap-4 shrink-0">
                <button 
                  onClick={() => setEpalFilters({
                    status: 'ALL',
                    gender: 'ALL',
                    priceRange: [0, 100],
                    server: 'ALL',
                    platform: 'ALL',
                    rank: 'ALL',
                  })}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowEpalFilterModal(false)}
                  className="flex-[2] py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rank Selector Modal */}
        <AnimatePresence>
          {showRankSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowRankSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Rank</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEpalFilters(prev => ({ ...prev, rank: 'ALL' }));
                      setShowRankSelectorModal(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                      epalFilters.rank === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold">All Ranks</span>
                    {epalFilters.rank === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                  </button>

                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const ranks = Array.from(new Set(playlinks.map(pl => pl.rank).filter(Boolean)));

                    const RANK_ORDER = [
                      'Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger',
                      'Ascendant', 'Immortal', 'Radiant', 'Predator', 'AR', 'Level'
                    ];

                    const sortedRanks = ranks.sort((a, b) => {
                      const aIndex = RANK_ORDER.findIndex(r => a.includes(r));
                      const bIndex = RANK_ORDER.findIndex(r => b.includes(r));
                      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                      if (aIndex === -1) return 1;
                      if (bIndex === -1) return -1;
                      return aIndex - bIndex;
                    });

                    return sortedRanks.map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          setEpalFilters(prev => ({ ...prev, rank: r as string }));
                          setShowRankSelectorModal(false);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                          epalFilters.rank === r ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-bold">{r}</span>
                        {epalFilters.rank === r && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server Selector Modal */}
        <AnimatePresence>
          {showServerSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowServerSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Server</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
                <div className="space-y-3">
                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const servers = Array.from(new Set(playlinks.map(pl => pl.server).filter(Boolean)));

                    return (
                      <>
                        <button
                          onClick={() => {
                            setEpalFilters(prev => ({ ...prev, server: 'ALL' }));
                            setShowServerSelectorModal(false);
                          }}
                          className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                            epalFilters.server === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold">All Servers</span>
                          {epalFilters.server === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        {servers.map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              setEpalFilters(prev => ({ ...prev, server: s as string }));
                              setShowServerSelectorModal(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                              epalFilters.server === s ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span className="font-bold">{s}</span>
                            {epalFilters.server === s && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Platform Selector Modal */}
        <AnimatePresence>
          {showPlatformSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowPlatformSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Platform</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
                <div className="space-y-3">
                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const platforms = Array.from(new Set(playlinks.map(pl => pl.platform).filter(Boolean)));

                    return (
                      <>
                        <button
                          onClick={() => {
                            setEpalFilters(prev => ({ ...prev, platform: 'ALL' }));
                            setShowPlatformSelectorModal(false);
                          }}
                          className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                            epalFilters.platform === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold">All Platforms</span>
                          {epalFilters.platform === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        {platforms.map(p => (
                          <button
                            key={p}
                            onClick={() => {
                              setEpalFilters(prev => ({ ...prev, platform: p as string }));
                              setShowPlatformSelectorModal(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                              epalFilters.platform === p ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span className="font-bold">{p}</span>
                            {epalFilters.platform === p && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recharge Loading Overlay */}
        <AnimatePresence>
          {isRecharging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CoinIcon className="w-8 h-8 animate-bounce" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Processing Payment</h3>
                <p className="text-gray-400 text-sm">Please do not close the app or refresh the page...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuthModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[900]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[901]"
              >
                <GlassCard className="p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white">{authMode === 'LOGIN' ? t('auth.modalLogin') : t('auth.modalRegister')}</h3>
                    <button onClick={() => setShowAuthModal(false)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-purple-300">{authStatus || t('auth.modalContinueHint')}</p>
                  <div className="space-y-3">
                    {authMode === 'REGISTER' && (
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder={t('auth.usernamePlaceholder')}
                        required
                      />
                    )}
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      type="email"
                      required
                    />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      type="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAuthSubmit}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white"
                    >
                      {authMode === 'LOGIN' ? t('auth.modalLogin') : t('auth.createAccount')}
                    </button>
                  </div>
                  <button
                    onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                    className="w-full py-2 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    {authMode === 'LOGIN' ? t('auth.noAccountRegister') : t('auth.haveAccountLogin')}
                  </button>
                </GlassCard>
              </motion.div>
            </>
          )}

          {showRankingModal && (
            <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm px-4 py-10" onClick={() => setShowRankingModal(false)}>
              <div className="max-w-md mx-auto bg-[#160b25] border border-white/10 rounded-3xl p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('ranking.top10ModalTitle')}</h3>
                  </div>
                  <button onClick={() => setShowRankingModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {sortedRankings.slice(0, 10).map(item => (
                    <div key={`modal_${item.companionId}`} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">#{item.rank} {item.gameName}</p>
                        <p className="text-xs font-bold text-purple-300">{t('ranking.modalScoreLabel', { score: item.rankingScore.toFixed(2) })}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {t('ranking.modalDetailLine', {
                          poolTag: item.poolTag,
                          rating: item.avgRating.toFixed(2),
                          completed: item.completedOrderCount,
                          completionPct: Math.round(item.completionRate * 100)
                        })}
                      </p>
                      <button
                        onClick={() => setExpandedRankingId(prev => prev === item.companionId ? null : item.companionId)}
                        className="mt-2 text-[10px] font-bold text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {expandedRankingId === item.companionId ? t('ranking.hideBreakdown') : t('ranking.showBreakdown')}
                      </button>
                      {expandedRankingId === item.companionId && (
                        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="rounded-lg bg-blue-500/10 border border-blue-400/20 px-2 py-1 text-blue-200 col-span-2">
                            {t('ranking.formulaLabel')}{' '}
                            <span className="font-bold">{t('ranking.formulaExpression')}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownQuality')} <span className="text-white font-bold">{item.scoreBreakdown.quality.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownVolume')} <span className="text-white font-bold">{item.scoreBreakdown.volume.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownFulfillment')} <span className="text-white font-bold">{item.scoreBreakdown.fulfillment.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownRevenue')} <span className="text-white font-bold">{item.scoreBreakdown.revenue.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-2 py-1 text-red-200 col-span-2">
                            {t('ranking.breakdownRisk')} <span className="font-bold">{item.scoreBreakdown.riskPenalty.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      {/* Bottom Navigation */}
      {(currentView === 'HOME' || currentView === 'COMMUNITY' || currentView === 'CATEGORY_SERVICES' || currentView === 'IM' || currentView === 'ME') && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
          <div className="bg-[#1a0b2e] border-t border-white/5 px-2 py-2 flex justify-around items-end shadow-2xl pointer-events-auto">
            <NavButton
              icon={Home}
              label={t('nav.home')}
              active={currentView === 'HOME' || currentView === 'CATEGORY_SERVICES'}
              onClick={() => navigateTo('HOME')}
            />
            <NavButton icon={Users} label={t('nav.community')} active={currentView === 'COMMUNITY'} onClick={() => navigateTo('COMMUNITY')} />
            <NavButton icon={MessageSquare} label={t('nav.im')} active={currentView === 'IM'} onClick={() => navigateTo('IM')} />
            <NavButton icon={User} label={t('nav.me')} active={currentView === 'ME'} onClick={() => navigateTo('ME')} />
          </div>
        </nav>
      )}

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed left-4 right-4 bottom-24 z-[500] rounded-2xl border border-white/10 bg-[#1a0b2e] px-4 py-3 text-sm font-bold text-white"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const NavButton = ({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] rounded-2xl transition-all duration-300 ${
      active ? 'text-white' : 'text-gray-500 hover:text-purple-400'
    }`}
  >
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        active
          ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105'
          : 'bg-transparent'
      }`}
    >
      <Icon className="w-5 h-5" fill={active ? 'currentColor' : 'none'} />
    </span>
    <span className="text-[9px] font-bold leading-tight text-center max-w-[64px] truncate">{label}</span>
  </button>
);

