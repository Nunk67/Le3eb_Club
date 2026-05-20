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

export function HomeView() {
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
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-6 space-y-8"
            >
              {/* Category Buttons */}
              <section className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <IconButton 
                    icon={Gamepad2} 
                    label="GAMES" 
                    onClick={() => {
                      setSelectedCategory('GAMES');
                      navigateTo('CATEGORY_SERVICES');
                    }} 
                  />
                  <IconButton 
                    icon={Coffee} 
                    label="CHILLING" 
                    onClick={() => {
                      setSelectedCategory('CHILLING');
                      navigateTo('CATEGORY_SERVICES');
                    }} 
                  />
                  <IconButton 
                    icon={Star} 
                    label="FAVOURITE" 
                    onClick={() => {
                      setSelectedCategory('FAVOURITE');
                      navigateTo('CATEGORY_SERVICES');
                    }} 
                  />
                </div>
              </section>

              {/* Trending Realms */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold tracking-tight">{t('home.trendingRealms')}</h3>
                  <button 
                    onClick={() => {
                      setSelectedCategory('GAMES');
                      navigateTo('CATEGORY_SERVICES');
                    }} 
                    className="text-xs text-purple-400 font-bold"
                  >
                    {t('home.viewAll')}
                  </button>
                </div>
                <div 
                  className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x"
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollLeft + target.offsetWidth >= target.scrollWidth - 10) {
                      setTimeout(() => {
                        setSelectedCategory('GAMES');
                        navigateTo('CATEGORY_SERVICES');
                      }, 100);
                    }
                  }}
                >
                  {GAMES.slice(0, 8).map(game => (
                    <div 
                      key={game.id}
                      onClick={() => navigateTo('GAME_DETAIL', game)}
                      className="relative min-w-[180px] h-44 rounded-2xl overflow-hidden group cursor-pointer snap-start"
                    >
                      <img 
                        src={game.imageUrl} 
                        alt={game.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                        <span className="font-bold text-white">{game.name}</span>
                        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{game.onlineCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Legend ePals */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">{t('home.legendEPals')}</h3>
                  </div>
                  <button onClick={() => navigateTo('LEGEND_LIST')} className="text-sm font-bold text-purple-400 flex items-center gap-1">
                    {t('home.viewAll')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div 
                  className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x"
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollLeft + target.offsetWidth >= target.scrollWidth - 10) {
                      setTimeout(() => navigateTo('LEGEND_LIST'), 100);
                    }
                  }}
                >
                  <div className="grid grid-rows-2 grid-flow-col gap-4">
                    {legendEPals.map(epal => (
                      <div key={epal.id} className="w-[280px] snap-start">
                        <LegendEPalCard 
                          epal={epal} 
                          onProfileClick={() => navigateTo('PROFILE', epal)}
                          isPlaying={playingEPalId === epal.id}
                          onPlayToggle={(e) => handlePlayToggle(epal.id, e)}
                          className="w-[280px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* More ePals */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight">{t('home.moreEPals')}</h3>
                <div className="space-y-4">
                  {moreEPals.map(epal => {
                    const badgeText = epal.game;
                    
                    return (
                      <EPalCard 
                        key={epal.id} 
                        epal={epal} 
                        onProfileClick={() => navigateTo('PROFILE', epal)}
                        onOrderClick={() => navigateTo('ORDER_CONFIRM', { epal })}
                        isPlaying={playingEPalId === epal.id}
                        onPlayToggle={(e) => handlePlayToggle(epal.id, e)}
                        badgeText={badgeText}
                        showTags={true}
                      />
                    );
                  })}
                </div>
                
                {/* Sentinel for infinite scroll */}
                <div ref={lastElementRef} className="h-20 flex items-center justify-center">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-gray-500 font-bold">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span>{t('home.loadingMore')}</span>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
  );
}
