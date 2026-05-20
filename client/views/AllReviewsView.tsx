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

export function AllReviewsView() {
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
              key="all_reviews"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32"
            >
              {/* Header */}
              <div className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-white/5 mb-6">
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold">All Reviews</h2>
              </div>

              <div className="px-6 space-y-6">
                {/* Rating Summary */}
                <GlassCard className="p-6 flex items-center justify-between bg-gradient-to-br from-purple-600/10 to-transparent">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{selectedEPal.rating.toFixed(1)}</span>
                    <span className="text-sm font-bold text-gray-500">/ 5.0</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(selectedEPal.rating) ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-bold pt-1">{selectedEPal.orderCount} Ratings in total</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold text-purple-400">100%</div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Positive Rate</p>
                </div>
              </GlassCard>

              {/* Tags & Filters */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Filter by Tag</h3>
                  <div className="flex items-center gap-3">
                    {(selectedReviewTag || selectedRatingFilter || reviewSortOrder !== 'DEFAULT') && (
                      <button 
                        onClick={() => {
                          setSelectedReviewTag(null);
                          setSelectedRatingFilter(null);
                          setReviewSortOrder('DEFAULT');
                        }}
                        className="text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button 
                      onClick={() => setShowReviewFilterModal(true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                        selectedRatingFilter || reviewSortOrder !== 'DEFAULT'
                          ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Filter</span>
                    </button>
                  </div>
                </div>
                {selectedEPal.reviewTags && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEPal.reviewTags.map((tag, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedReviewTag(tag.name === selectedReviewTag ? null : tag.name)}
                        className={`px-4 py-2 rounded-2xl border transition-all flex items-center gap-2 ${
                          selectedReviewTag === tag.name 
                            ? 'bg-purple-600/20 border-purple-500/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className={`text-xs font-bold ${selectedReviewTag === tag.name ? 'text-purple-400' : 'text-gray-300'}`}>
                          {tag.name}
                        </span>
                        <span className="text-xs font-bold text-gray-500">{tag.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {(selectedRatingFilter || reviewSortOrder !== 'DEFAULT') && (
                <div className="flex flex-wrap gap-2 px-1">
                  {selectedRatingFilter && (
                    <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center gap-1.5">
                      <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                      <span className="text-[10px] font-bold text-purple-400">{selectedRatingFilter} Stars</span>
                    </div>
                  )}
                  {reviewSortOrder !== 'DEFAULT' && (
                    <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-bold text-purple-400">
                        {reviewSortOrder === 'NEWEST' ? 'Newest' : 
                         reviewSortOrder === 'OLDEST' ? 'Oldest' : 
                         reviewSortOrder === 'RATING_HIGH' ? 'Highest Rating' : 'Lowest Rating'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Review List */}
              <div className="space-y-4">
                {(() => {
                  let filtered = [...(selectedEPal.reviews || [])];
                  
                  // Filter by tag
                  if (selectedReviewTag) {
                    filtered = filtered.filter(r => r.tags?.includes(selectedReviewTag));
                  }

                  // Filter by rating
                  if (selectedRatingFilter) {
                    filtered = filtered.filter(r => r.rating === selectedRatingFilter);
                  }
                  
                  // Sort
                  if (reviewSortOrder === 'NEWEST') {
                    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                  } else if (reviewSortOrder === 'OLDEST') {
                    filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                  } else if (reviewSortOrder === 'RATING_HIGH') {
                    filtered.sort((a, b) => b.rating - a.rating);
                  } else if (reviewSortOrder === 'RATING_LOW') {
                    filtered.sort((a, b) => a.rating - b.rating);
                  }
                  
                  if (filtered.length === 0) {
                    return (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                          <MessageSquare className="w-8 h-8 text-gray-700" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-bold">No reviews found</p>
                          <p className="text-xs text-gray-500">Try selecting a different filter or tag</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedReviewTag(null);
                            setSelectedRatingFilter(null);
                            setReviewSortOrder('DEFAULT');
                          }}
                          className="text-xs font-bold text-purple-400"
                        >
                          Reset all filters
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(review => (
                    <div key={review.id}>
                      <GlassCard className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                              const epal = EPALS.find(ep => ep.name === review.userName);
                              if (epal) navigateTo('PROFILE', epal);
                            }}
                          >
                            <img 
                              src={review.userAvatar} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/5 group-hover:border-purple-500/50 transition-all" 
                              referrerPolicy="no-referrer" 
                            />
                            <div>
                              <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">{review.userName}</p>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-600 font-bold">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                        {review.tags && review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {review.tags.map((t, i) => (
                              <span key={i} className="text-[9px] font-bold text-gray-500 uppercase tracking-tight bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </GlassCard>
                    </div>
                  ));
                })()}
              </div>
              </div>
            </motion.div>
  );
}
