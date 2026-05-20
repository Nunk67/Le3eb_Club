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

export function GameDetailView() {
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
              key="game_detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="min-h-screen pb-32"
            >
              <div className="relative h-[35vh] w-full">
                <img 
                  src={selectedGame?.imageUrl} 
                  alt={selectedGame?.name} 
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f071a] via-transparent to-black/40" />
                
                {/* Back Button */}
                <button 
                  onClick={handleBack}
                  className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/40 transition-all z-50"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">{selectedGame?.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-purple-400 font-bold text-sm tracking-widest drop-shadow-md">{selectedGame?.onlineCount} Online</p>
                  </div>
                </div>
              </div>

              <div className="px-6 mt-6 space-y-4">
                {/* Sort & Filter Controls */}
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { id: 'DEFAULT', label: 'Default' },
                      { id: 'ORDERS', label: 'Orders' },
                      { id: 'SCORE', label: 'Score' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setEpalSortBy(option.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          epalSortBy === option.id 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowEpalFilterModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      Object.values(epalFilters).some(v => v !== 'ALL' && !Array.isArray(v)) || epalFilters.priceRange[0] !== 0 || epalFilters.priceRange[1] !== 100
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </button>
                </div>

                {(() => {
                  const filteredEpals = EPALS
                    .filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''))
                    .filter(e => {
                      if (epalFilters.status === 'ONLINE' && e.onlineStatus !== 'Online') return false;
                      if (epalFilters.gender !== 'ALL' && e.gender !== epalFilters.gender) return false;
                      if (e.price < epalFilters.priceRange[0] || e.price > epalFilters.priceRange[1]) return false;
                      
                      // For Server, Platform, Rank, we check playlinks
                      if (epalFilters.server !== 'ALL' || epalFilters.platform !== 'ALL' || epalFilters.rank !== 'ALL') {
                        const matchingPlaylink = e.playlinks?.find(pl => 
                          pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || '')
                        );
                        if (!matchingPlaylink) return false;
                        if (epalFilters.server !== 'ALL' && matchingPlaylink.server !== epalFilters.server) return false;
                        if (epalFilters.platform !== 'ALL' && matchingPlaylink.platform !== epalFilters.platform) return false;
                        if (epalFilters.rank !== 'ALL' && matchingPlaylink.rank !== epalFilters.rank) return false;
                      }
                      
                      return true;
                    })
                    .sort((a, b) => {
                      if (epalSortBy === 'ORDERS') {
                        const aOrders = parseFloat(a.orderCount.replace('k', '')) * (a.orderCount.includes('k') ? 1000 : 1);
                        const bOrders = parseFloat(b.orderCount.replace('k', '')) * (b.orderCount.includes('k') ? 1000 : 1);
                        return bOrders - aOrders;
                      }
                      if (epalSortBy === 'SCORE') return b.rating - a.rating;
                      return 0; // Default
                    });

                  if (filteredEpals.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                        <Search className="w-12 h-12 opacity-20" />
                        <p className="font-bold">No EPals found with these filters</p>
                        <button 
                          onClick={() => setEpalFilters({
                            status: 'ALL',
                            gender: 'ALL',
                            priceRange: [0, 100],
                            server: 'ALL',
                            platform: 'ALL',
                            rank: 'ALL',
                          })}
                          className="text-purple-400 font-bold text-sm"
                        >
                          Reset Filters
                        </button>
                      </div>
                    );
                  }

                  return filteredEpals.map(epal => {
                    const playlink = epal.playlinks?.find(pl => 
                      pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || '')
                    );
                    
                    let badgeText = undefined;
                    if (selectedGame?.category !== 'CHILLING') {
                      if (epalFilters.rank !== 'ALL') badgeText = playlink?.rank;
                      else if (epalFilters.server !== 'ALL') badgeText = playlink?.server;
                      else if (epalFilters.platform !== 'ALL') badgeText = playlink?.platform;
                      else badgeText = playlink?.rank || playlink?.role || playlink?.server;
                    }

                    return (
                      <EPalCard 
                        key={epal.id} 
                        epal={epal} 
                        onProfileClick={() => navigateTo('PROFILE', epal)}
                        onOrderClick={() => navigateTo('ORDER_CONFIRM', { epal })}
                        isPlaying={playingEPalId === epal.id}
                        onPlayToggle={(e) => handlePlayToggle(epal.id, e)}
                        badgeText={badgeText}
                      />
                    );
                  });
                })()}
              </div>
            </motion.div>
  );
}
