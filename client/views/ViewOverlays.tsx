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

export function ViewOverlays() {
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
    <>
        {/* Unfollow Confirmation Modal */}
        <AnimatePresence>
          {showUnfollowModal && epalToUnfollow && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUnfollowModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-[201] p-6 pointer-events-none"
              >
                <GlassCard className="w-full max-w-xs p-6 space-y-6 pointer-events-auto shadow-2xl border-white/20 bg-[#1a0b2e]/90">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-purple-500/30">
                      <img src={epalToUnfollow.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h3 className="text-lg font-bold">Unfollow {epalToUnfollow.name}?</h3>
                    <p className="text-xs text-gray-400">Are you sure you want to unfollow this EPal?</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={confirmUnfollow}
                      className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold text-sm active:scale-95 transition-all"
                    >
                      Unfollow
                    </button>
                    <button 
                      onClick={() => setShowUnfollowModal(false)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Playlink Gallery Modal */}
        <AnimatePresence>
          {showPlaylinkModal && selectedEPal && selectedPlaylinkId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setShowPlaylinkModal(false)}
            >
              <button 
                className="absolute top-10 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white z-[110] active:scale-90 transition-transform"
                onClick={() => setShowPlaylinkModal(false)}
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>

              <div 
                className="w-full max-w-sm overflow-x-auto flex snap-x snap-mandatory no-scrollbar gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedEPal.playlinks?.map((pl) => (
                  <div 
                    key={pl.id}
                    id={`pl-card-${pl.id}`}
                    className="min-w-full snap-center"
                  >
                    <GlassCard className="overflow-hidden border-white/20 shadow-2xl bg-[#0f071a] flex flex-col w-full relative">
                      {/* Top Rank Highlight */}
                      <div className="bg-purple-600 px-6 py-4 flex justify-between items-center pr-14">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-[10px] font-bold text-purple-100 uppercase tracking-widest">Current Rank</span>
                        </div>
                        <span className="text-xl font-black text-white italic">{pl.rank || '-'}</span>
                      </div>

                      {/* Share Button - Top Right of Card */}
                      <div className="absolute top-3 right-3 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({
                                title: `${pl.gameName} - ${pl.nickname}`,
                                text: `Check out ${selectedEPal.name}'s ${pl.gameName} profile!`,
                                url: window.location.href
                              }).catch(console.error);
                            }
                          }}
                          className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Info Grid */}
                      <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 bg-white/2">
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Platform</p>
                          <div className="flex items-center gap-2">
                            {pl.platform === 'PC' && <Monitor className="w-3.5 h-3.5 text-purple-400" />}
                            {pl.platform === 'PS' && <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />}
                            {pl.platform === 'Mobile' && <Smartphone className="w-3.5 h-3.5 text-purple-400" />}
                            <span className="text-sm font-bold text-white">{pl.platform || '-'}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Server</p>
                          <p className="text-sm font-bold text-white">{pl.server || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Position</p>
                          <p className="text-sm font-bold text-white">{pl.role || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Style</p>
                          <p className="text-sm font-bold text-white">{pl.style || '-'}</p>
                        </div>
                      </div>

                      {/* Game Image at bottom */}
                      <div className="relative aspect-video overflow-hidden group">
                        <img 
                          src={pl.posterUrl} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f071a] via-transparent to-transparent" />
                        
                        <div className="absolute bottom-4 left-6">
                          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{pl.gameName}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-purple-400 tracking-widest">{pl.nickname}</p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pl.nickname);
                              }}
                              className="p-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors group/copy"
                            >
                              {copied ? (
                                <Check className="w-2.5 h-2.5 text-green-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-purple-400 group-hover/copy:text-purple-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Filter Modal */}
        <AnimatePresence>
          {showReviewFilterModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewFilterModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[201] max-w-md mx-auto p-6 pb-12 space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Filter & Sort</h2>
                  <button 
                    onClick={() => setShowReviewFilterModal(false)}
                    className="text-gray-500 hover:text-white font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Sort Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Sort By</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'DEFAULT', label: 'Default' },
                      { id: 'NEWEST', label: 'Newest' },
                      { id: 'OLDEST', label: 'Oldest' },
                      { id: 'RATING_HIGH', label: 'Highest Rating' },
                      { id: 'RATING_LOW', label: 'Lowest Rating' }
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => setReviewSortOrder(sort.id as any)}
                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                          reviewSortOrder === sort.id 
                            ? 'bg-purple-600/20 border-purple-500/50' 
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <span className={`text-sm font-bold ${reviewSortOrder === sort.id ? 'text-purple-400' : 'text-gray-300'}`}>
                          {sort.label}
                        </span>
                        {reviewSortOrder === sort.id && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Filter by Rating</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                      onClick={() => setSelectedRatingFilter(null)}
                      className={`px-5 py-3 rounded-2xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedRatingFilter === null 
                          ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-sm font-bold">All</span>
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRatingFilter(star === selectedRatingFilter ? null : star)}
                        className={`px-5 py-3 rounded-2xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                          selectedRatingFilter === star 
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <span className="text-sm font-bold">{star}</span>
                        <Star className={`w-3.5 h-3.5 ${selectedRatingFilter === star ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowReviewFilterModal(false)}
                  className="w-full py-4 rounded-2xl bg-purple-600 font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all text-white"
                >
                  Apply Filters
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Gift Panel */}
        <AnimatePresence>
          {showGiftPanel && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowGiftPanel(false);
                  setShowQuantitySelector(false);
                }}
                className="fixed inset-0 bg-black/60 z-[200]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[201] max-w-md mx-auto p-6 pb-8 h-[70vh] flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h2 className="text-xl font-bold">Send a Gift</h2>
                  <button onClick={() => {
                    setShowGiftPanel(false);
                    setShowQuantitySelector(false);
                  }} className="text-gray-500 hover:text-white font-bold">Close</button>
                </div>

                {/* Gift List - Scrollable */}
                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 mb-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 0, icon: Heart, label: 'Heart', price: 10, color: 'text-red-400' },
                      { id: 1, icon: Star, label: 'Star', price: 50, color: 'text-yellow-400' },
                      { id: 2, icon: Zap, label: 'Energy', price: 100, color: 'text-blue-400' },
                      { id: 3, icon: Trophy, label: 'Trophy', price: 500, color: 'text-orange-400' },
                      { id: 4, icon: Gift, label: 'Box', price: 1000, color: 'text-purple-400' },
                      { id: 5, icon: Play, label: 'Ticket', price: 2000, color: 'text-green-400' },
                      { id: 6, icon: Star, label: 'Super', price: 5000, color: 'text-yellow-500' },
                      { id: 7, icon: Trophy, label: 'Crown', price: 10000, color: 'text-yellow-600' },
                      { id: 8, icon: Heart, label: 'Love', price: 520, color: 'text-pink-400' },
                      { id: 9, icon: Zap, label: 'Thunder', price: 999, color: 'text-yellow-300' },
                    ].map((gift) => (
                      <button 
                        key={gift.id} 
                        onClick={() => setSelectedGiftId(gift.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                          selectedGiftId === gift.id 
                            ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${gift.color}`}>
                          <gift.icon className="w-7 h-7 fill-current" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-300">{gift.label}</span>
                        <div className="flex items-center gap-1">
                          <CoinIcon />
                          <span className="text-[11px] font-bold text-purple-400">{gift.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-2 shrink-0">
                  {/* Left: Balance & Recharge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-full border border-white/10">
                      <CoinIcon className="w-4 h-4" textClassName="text-[10px]" />
                      <span className="text-sm font-bold text-white">{wallet?.balance ?? 0}</span>
                    </div>
                    <button 
                      onClick={() => navigateTo('RECHARGE')}
                      className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-400 hover:bg-purple-600/30 active:scale-95 transition-all"
                    >
                      Recharge
                    </button>
                  </div>

                  {/* Right: Quantity & Send */}
                  <div className="relative flex items-center">
                    {/* Quantity Panel */}
                    <AnimatePresence>
                      {showQuantitySelector && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full right-0 mb-4 bg-[#2a1b3e] border border-white/10 rounded-2xl p-2 grid grid-cols-2 gap-2 shadow-2xl z-[202] min-w-[140px]"
                        >
                          {[1, 10, 52, 66, 99, 520, 1314].map((num) => (
                            <button
                              key={num}
                              onClick={() => {
                                setGiftQuantity(num);
                                setShowQuantitySelector(false);
                              }}
                              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                                giftQuantity === num ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-gray-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center bg-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden">
                      <button 
                        onClick={() => setShowQuantitySelector(!showQuantitySelector)}
                        className="pl-5 pr-3 py-3 flex items-center gap-1.5 border-r border-white/20 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-sm font-bold text-white">{giftQuantity}</span>
                        <ChevronRight className={`w-4 h-4 text-white/70 transition-transform ${showQuantitySelector ? 'rotate-90' : '-rotate-90'}`} />
                      </button>
                      <button 
                        onClick={() => {
                          setShowGiftPanel(false);
                          setShowQuantitySelector(false);
                        }}
                        className="pl-4 pr-6 py-3 font-bold text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Game Selector Modal */}
        <AnimatePresence>
          {showGameSelectorModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGameSelectorModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-6 bg-[#1a0b2e] rounded-[32px] border border-white/10 z-[201] max-w-md mx-auto p-6 overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">All Communities</h2>
                  <button onClick={() => setShowGameSelectorModal(false)} className="text-gray-500 hover:text-white font-bold">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                  <button
                    onClick={() => { 
                      setSelectedGame(null); 
                      setShowGameSelectorModal(false); 
                      if (currentView !== 'COMMUNITY') navigateTo('COMMUNITY');
                    }}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      selectedGame === null ? 'bg-purple-600/20 border-purple-500/50' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <span className="font-bold">All Communities</span>
                    {selectedGame === null && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>
                  {GAMES.map(game => (
                    <button
                      key={game.id}
                      onClick={() => { 
                        setSelectedGame(game); 
                        setShowGameSelectorModal(false); 
                        if (currentView === 'APPLY_PLAYER') {
                          navigateTo('APPLY_PLAYER_CATEGORY');
                        } else if (currentView !== 'COMMUNITY') {
                          navigateTo('COMMUNITY');
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        selectedGame?.id === game.id ? 'bg-purple-600/20 border-purple-500/50' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <img src={game.imageUrl} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <span className="font-bold flex-1 text-left">{game.name}</span>
                      {selectedGame?.id === game.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Ongoing Order Warning Modal */}
        <AnimatePresence>
          {showOngoingOrderWarning && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOngoingOrderWarning(false)}
                className="fixed inset-0 bg-black/60 z-[600]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm bg-[#1a0b2e] rounded-[32px] border border-white/10 z-[601] p-8 text-center space-y-6 shadow-2xl"
              >
                <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Ongoing Order</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    You already have an ongoing order with this EPal. Please complete or cancel it before placing a new one.
                  </p>
                </div>
                <button 
                  onClick={() => setShowOngoingOrderWarning(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                  Got it
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderDetailModal && selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderDetailModal(false)}
                className="fixed inset-0 bg-black/80 z-[400]"
              />
              {(() => {
                const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                return (
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100 || info.velocity.y > 500) setShowOrderDetailModal(false);
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-[#0f071a] z-[401] p-8 pb-12 flex flex-col no-scrollbar overflow-y-auto"
                  >
                    <div 
                      onClick={() => setShowOrderDetailModal(false)}
                      className="flex items-center justify-center py-4 mb-4 shrink-0 cursor-pointer group"
                    >
                      <div className="w-12 h-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors" />
                    </div>
                    
                    <div className="flex-1 space-y-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Order Details</h2>
                        <p className="text-gray-500 text-sm font-medium">Transaction ID: {selectedOrder.id.toUpperCase()}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">EPal</span>
                          <span className="font-bold text-purple-400 text-sm">{epal?.name || selectedOrder.epalId}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Service Item</span>
                          <span className="font-bold text-white text-sm">{selectedOrder.serviceName}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Unit Type</span>
                          <span className="font-bold text-white text-sm">{selectedOrder.unit || 'Game'}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Unit Price</span>
                          <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                            <CoinIcon className="w-3.5 h-3.5" />
                            {selectedOrder.unitPrice || selectedOrder.price}
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Quantity</span>
                          <span className="font-bold text-white text-sm">x{selectedOrder.quantity || 1}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Order Created</span>
                          <span className="font-bold text-gray-400 text-sm">{selectedOrder.createTime || new Date(selectedOrder.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Order Status</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                            selectedOrder.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                            selectedOrder.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        {selectedOrder.status === 'COMPLETED' && selectedOrder.endTime && (
                          <div className="flex justify-between items-center py-5 border-b border-white/5">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Completed At</span>
                            <span className="font-bold text-gray-400 text-sm">{new Date(selectedOrder.endTime).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Highlighted Total Price Section */}
                      <div className="bg-gradient-to-br from-purple-600/10 to-transparent rounded-[32px] p-8 border border-white/5 flex flex-col items-center gap-4 shadow-2xl">
                        <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Total Payment</span>
                        <div className="flex items-center gap-3">
                          <CoinIcon className="w-8 h-8" />
                          <span className="text-5xl font-black text-white tracking-tighter">{selectedOrder.totalPrice || selectedOrder.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4 shrink-0">
                      {selectedOrder.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => {
                              setShowOrderDetailModal(false);
                              const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                              if (epal) navigateTo('IM_DETAIL', epal);
                            }}
                            className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
                          >
                            Contact EPal Now
                          </button>
                          <button 
                            onClick={() => {
                              setImOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'CANCELLED' } : o));
                              setShowOrderDetailModal(false);
                            }}
                            className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest text-xs"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'COMPLETED' && !selectedOrder.reviewed && (
                        <button 
                          onClick={() => {
                            setShowOrderDetailModal(false);
                            setReviewRating(5);
                            setReviewTags([]);
                            setReviewFeedback('');
                            setShowReviewModal(true);
                          }}
                          className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-purple-400 hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                        >
                          Rate this Service
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewModal(false)}
                className="fixed inset-0 bg-black/80 z-[400]"
              />
              {(() => {
                const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                return (
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100 || info.velocity.y > 500) setShowReviewModal(false);
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-[#0f071a] z-[401] p-8 pb-12 flex flex-col no-scrollbar overflow-y-auto"
                  >
                    <div 
                      onClick={() => setShowReviewModal(false)}
                      className="flex items-center justify-center py-4 mb-4 shrink-0 cursor-pointer group"
                    >
                      <div className="w-12 h-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors" />
                    </div>
                    <div className="space-y-8 flex-1">
                      <div className="relative text-center space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Rate Service</h2>
                        <p className="text-gray-500 text-sm font-medium">How was your experience with {epal?.name}?</p>
                      </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-10 h-10 ${star <= reviewRating ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                      </button>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Select Tags</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Professional', 'Friendly', 'Skilled', 'Good Comms', 'Patient', 'Fun'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setReviewTags(prev => 
                              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                            reviewTags.includes(tag)
                              ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                              : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Your Feedback</p>
                    <textarea 
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      placeholder="Share your thoughts about the service..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        // Local IM orders are client-side until chat history is promoted to the API.
                        if (selectedOrder) {
                          setImOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, reviewed: true } : o));
                        }
                        setShowReviewModal(false);
                      }}
                      className="w-full py-4 bg-purple-600 rounded-2xl font-bold text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </>
          )}
        </AnimatePresence>
    </>
  );
}
