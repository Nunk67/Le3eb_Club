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

export function OrderConfirmView() {
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
              key="order"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 pt-6 px-6 space-y-6"
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">{t('order.confirmTitle')}</h1>
              </div>

              {/* Service Info */}
              <GlassCard className="p-4 flex gap-4">
                <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img 
                    src={selectedEPal.services?.find(s => s.id === activeServiceId)?.posterUrl || selectedEPal.avatarUrl} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <h2 className="text-lg font-bold">{selectedEPal.services?.find(s => s.id === activeServiceId)?.name || selectedEPal.game}</h2>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white leading-tight">{selectedEPal.name}</p>
                    <p className="text-sm font-bold text-white opacity-60 leading-tight">
                      {t('search.epalIdPrefix')} {selectedEPal.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Service Types */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{t('order.serviceType')}</h3>
                <button 
                  onClick={() => setShowServiceTypeModal(true)}
                  className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all text-left"
                >
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">{selectedVariant.name}</span>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-tight flex items-center gap-1">
                      {selectedVariant.price} <CoinIcon /> / {selectedVariant.unit}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('order.quantity')}</h3>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    {(() => {
                      const unit = selectedVariant.unit.toLowerCase();
                      if (unit.includes('min')) {
                        const mins = parseInt(unit) || 0;
                        return t('order.totalMinutes', { n: mins * orderQuantity });
                      }
                      if (unit.includes('game')) {
                        return t('order.totalGames', { n: orderQuantity });
                      }
                      if (unit.includes('time')) {
                        return t('order.totalTimes', { n: orderQuantity });
                      }
                      return t('order.totalUnits', { n: orderQuantity, unit: selectedVariant.unit });
                    })()}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-sm font-bold text-gray-300">{t('order.selectUnits')}</span>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold w-4 text-center">{orderQuantity}</span>
                    <button 
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center active:scale-90 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">{t('order.priceSummary')}</h3>
                <GlassCard className="p-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('order.subtotal')}</span>
                    <span className="font-bold flex items-center gap-1">
                      {selectedVariant.price * orderQuantity} <CoinIcon />
                    </span>
                  </div>
                  <button 
                    disabled={availableCoupons.length === 0}
                    onClick={() => setShowCouponModal(true)}
                    className={`w-full flex justify-between items-center text-sm transition-all ${
                      availableCoupons.length > 0 ? 'hover:opacity-70 active:scale-[0.98]' : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-gray-400">{t('order.coupon')}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold flex items-center gap-1 ${selectedCoupon ? 'text-green-400' : 'text-gray-500'}`}>
                        {selectedCoupon ? (
                          <>
                            -{selectedCoupon.type === 'FIXED' 
                              ? selectedCoupon.discount 
                              : Math.floor((selectedVariant.price * orderQuantity) * (selectedCoupon.discount / 100))} <CoinIcon />
                          </>
                        ) : (availableCoupons.length > 0 ? t('order.selectCoupon') : t('order.noCoupons'))}
                      </span>
                      {availableCoupons.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                  </button>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('order.discount')}</span>
                    <span className="font-bold text-green-400 flex items-center gap-1">
                      -{selectedCoupon ? (selectedCoupon.type === 'FIXED' ? selectedCoupon.discount : Math.floor((selectedVariant.price * orderQuantity) * (selectedCoupon.discount / 100))) : 0} <CoinIcon />
                    </span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{t('order.finalPrice')}</span>
                    <span className="text-2xl font-bold text-purple-400 flex items-center gap-1.5">
                      {(() => {
                        const subtotal = selectedVariant.price * orderQuantity;
                        let discount = 0;
                        if (selectedCoupon) {
                          discount = selectedCoupon.type === 'FIXED' 
                            ? selectedCoupon.discount 
                            : Math.floor(subtotal * (selectedCoupon.discount / 100));
                        }
                        return Math.max(0, subtotal - discount);
                      })()} <CoinIcon className="w-5 h-5" textClassName="text-[10px]" />
                    </span>
                  </div>
                </GlassCard>
              </div>

              {/* Action Buttons */}
              <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-[#0f071a] to-transparent">
                <div className="max-w-md mx-auto">
                  <button 
                    onClick={() => {
                      if (!selectedEPal || !selectedVariant) return;

                      // Check for ongoing orders
                      const hasOngoingOrder = imOrders.some(order => 
                        order.epalId === selectedEPal.id && 
                        order.status !== 'COMPLETED' && 
                        order.status !== 'CANCELLED'
                      );

                      if (hasOngoingOrder) {
                        setShowOngoingOrderWarning(true);
                        return;
                      }

                      // Add new order
                      const newOrder: IMOrder = {
                        id: `o${Date.now()}`,
                        epalId: selectedEPal.id,
                        serviceName: selectedEPal.services?.find(s => s.id === activeServiceId)?.name || selectedEPal.game,
                        status: 'PENDING',
                        price: (() => {
                          const subtotal = selectedVariant.price * orderQuantity;
                          let discount = 0;
                          if (selectedCoupon) {
                            discount = selectedCoupon.type === 'FIXED' 
                              ? selectedCoupon.discount 
                              : Math.floor(subtotal * (selectedCoupon.discount / 100));
                          }
                          return Math.max(0, subtotal - discount);
                        })(),
                        timestamp: Date.now(),
                        unit: selectedVariant.unit,
                        unitPrice: selectedVariant.price,
                        quantity: orderQuantity
                      };

                      setImOrders(prev => [newOrder, ...prev]);
                      navigateTo('IM');
                      setImTab('ORDER');
                    }}
                    className="w-full py-4 rounded-2xl bg-purple-600 font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all text-white"
                  >
                    {t('order.payStart')}
                  </button>
                </div>
              </div>

              {/* Coupon Modal */}
              <AnimatePresence>
                {showCouponModal && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowCouponModal(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[101] max-w-md mx-auto p-6 pb-12 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{t('order.couponModalTitle')}</h2>
                        <button 
                          onClick={() => setShowCouponModal(false)}
                          className="text-gray-500 hover:text-white font-bold"
                        >
                          {t('order.close')}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={() => {
                            setSelectedCoupon(null);
                            setShowCouponModal(false);
                          }}
                          className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                            selectedCoupon === null 
                              ? 'bg-purple-600/20 border-purple-500/50' 
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <span className="font-bold">{t('order.noCouponOption')}</span>
                          {selectedCoupon === null && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                        </button>

                        {availableCoupons.map(coupon => {
                          const subtotal = selectedVariant.price * orderQuantity;
                          const isDisabled = coupon.minSpend ? subtotal < coupon.minSpend : false;
                          
                          return (
                            <button 
                              key={coupon.id}
                              disabled={isDisabled}
                              onClick={() => {
                                setSelectedCoupon(coupon);
                                setShowCouponModal(false);
                              }}
                              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                                selectedCoupon?.id === coupon.id 
                                  ? 'bg-purple-600/20 border-purple-500/50' 
                                  : isDisabled ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed' : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="space-y-1">
                                <p className="font-bold">{coupon.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  {coupon.type === 'FIXED' ? <>{coupon.discount} <CoinIcon /> OFF</> : `${coupon.discount}% OFF`}
                                  {coupon.minSpend && <> • Min spend {coupon.minSpend} <CoinIcon /></>}
                                </p>
                              </div>
                              {selectedCoupon?.id === coupon.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Service Type Modal */}
              <AnimatePresence>
                {showServiceTypeModal && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowServiceTypeModal(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[101] max-w-md mx-auto p-6 pb-12 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Select Service Type</h2>
                        <button 
                          onClick={() => setShowServiceTypeModal(false)}
                          className="text-gray-500 hover:text-white font-bold"
                        >
                          Close
                        </button>
                      </div>

                      <div className="space-y-3">
                        {selectedEPal.services?.find(s => s.id === activeServiceId)?.variants.map((v, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              setSelectedVariant(v);
                              setShowServiceTypeModal(false);
                            }}
                            className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                              selectedVariant.name === v.name 
                                ? 'bg-purple-600/20 border-purple-500/50' 
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="font-bold">{v.name}</p>
                              <p className="text-xs text-purple-400 font-bold uppercase tracking-tight">
                                <span className="flex items-center gap-1">
                                  {v.price} <CoinIcon /> / {v.unit}
                                </span>
                              </p>
                            </div>
                            {selectedVariant.name === v.name && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
  );
}
