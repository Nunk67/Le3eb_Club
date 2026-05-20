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

export function SettingsView() {
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
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-8"
            >
              <div className="flex items-center justify-between relative">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10 relative z-10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">{t('settings.title')}</h1>
                <div className="w-10" />
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('settings.accountSection')}</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setCurrentView('SETTINGS_EDIT_PROFILE')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.editProfile')}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setCurrentView('SETTINGS_CHANGE_PASSWORD')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.changePassword')}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setCurrentView('SETTINGS_LINKED_ACCOUNTS')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.linkedAccounts')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 text-blue-400" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('settings.general')}</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setCurrentView('SETTINGS_LANGUAGE')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.language')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-400">{getLocaleLabel(locale)}</span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                    <div className="w-full flex items-center justify-between p-5">
                      <span className="font-bold text-gray-300">{t('settings.pushNotifications')}</span>
                      <button 
                        onClick={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${pushNotificationsEnabled ? 'bg-purple-600' : 'bg-white/10'}`}
                      >
                        <motion.div 
                          animate={{ x: pushNotificationsEnabled ? 24 : 4 }}
                          className="absolute top-1 w-3 h-3 rounded-full bg-white" 
                        />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        setCacheSize('0 B');
                        notify(t('settings.cacheCleared'));
                      }}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.clearCache')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-600">{cacheSize}</span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('settings.about')}</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setCurrentView('SETTINGS_PRIVACY')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.privacyPolicy')}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setCurrentView('SETTINGS_TERMS')}
                      className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                    >
                      <span className="font-bold text-gray-300">{t('settings.termsOfService')}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="w-full flex items-center justify-between p-5">
                      <span className="font-bold text-gray-300">{t('settings.versionLabel')}</span>
                      <span className="text-[10px] font-bold text-gray-600">v{PRODUCT_SEMVER}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-5 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('settings.logout')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
  );
}
