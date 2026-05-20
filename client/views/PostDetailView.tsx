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

export function PostDetailView() {
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
              key={`post_detail_${selectedPost.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32"
            >
              {/* Header */}
              <div className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-white/5">
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-lg font-bold">Post Detail</h2>
              </div>

              {/* Original Post */}
              <div className="p-6 space-y-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    const epal = EPALS.find(ep => ep.id === selectedPost.userId);
                    if (epal) navigateTo('PROFILE', epal);
                  }}
                >
                  <img 
                    src={selectedPost.userAvatar} 
                    alt={selectedPost.userName} 
                    className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-purple-500/50 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-base text-white group-hover:text-purple-400 transition-colors">{selectedPost.userName}</div>
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      {new Date(selectedPost.timestamp).toLocaleDateString()}
                      {selectedPost.gameName && ` • ${selectedPost.gameName}`}
                    </div>
                  </div>
                </div>
                <p className="text-base text-gray-200 leading-relaxed">{selectedPost.content}</p>
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="rounded-3xl overflow-hidden border border-white/5 bg-white/5">
                    <img 
                      src={selectedPost.images[0]} 
                      alt="Post content" 
                      className="w-full max-h-[60vh] object-contain bg-black/20"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-8">
                        <button className={`flex items-center gap-2 transition-colors ${selectedPost.isLiked ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                          <ThumbsUp className={`w-6 h-6 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-bold">{selectedPost.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                          <MessageSquare className="w-6 h-6" />
                          <span className="text-sm font-bold">{selectedPost.comments}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (!requireAuthAction(t('auth.loginRequiredFeature'))) return;
                            setShowGiftPanel(true);
                          }}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Gift className="w-6 h-6" />
                          <span className="text-sm font-bold">{t('community.gift')}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => { /* Report */ }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Flag className="w-6 h-6" />
                      </button>
                    </div>
              </div>

              {/* Author's Services - Horizontal Scroll */}
              {(() => {
                const author = EPALS.find(e => e.id === selectedPost.userId);
                if (!author || !author.services || author.services.length === 0) return null;
                
                return (
                  <div className="py-6 space-y-4">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
                      {author.services
                        .sort((a, b) => {
                          const aOrders = parseInt(a.orderCount.replace(/[^0-9.]/g, '') || '0') * (a.orderCount.includes('k') ? 1000 : 1);
                          const bOrders = parseInt(b.orderCount.replace(/[^0-9.]/g, '') || '0') * (b.orderCount.includes('k') ? 1000 : 1);
                          return bOrders - aOrders;
                        })
                        .map(service => (
                          <div key={service.id} className="min-w-[200px]">
                            <GlassCard className="p-2 flex flex-col gap-2">
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <img src={service.posterUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                  <span className="text-[9px] font-bold text-white">{service.rating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-bold text-white text-xs line-clamp-1">{service.name}</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{service.orderCount}</span>
                                  <button 
                                    onClick={() => navigateTo('ORDER_CONFIRM', { epal: author, variant: service.variants[0] })}
                                    className="px-2 py-1 bg-purple-500 hover:bg-purple-400 text-white rounded-lg font-bold text-[10px] transition-colors active:scale-95"
                                  >
                                    <span className="flex items-center gap-1">
                                      {service.variants[0].price} <CoinIcon />
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })()}

              {/* Comments Section */}
              <div className="px-6 space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-bold">Comments ({selectedPost.comments})</h3>
                <div className="space-y-8">
                  {selectedPost.commentsList?.map(comment => (
                    <div key={comment.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div 
                          className="flex items-start gap-3 cursor-pointer group"
                          onClick={() => {
                            const epal = EPALS.find(ep => ep.id === comment.userId);
                            if (epal) navigateTo('PROFILE', epal);
                          }}
                        >
                          <img 
                            src={comment.userAvatar} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-purple-500/50 transition-all" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{comment.userName}</span>
                              <span className="text-[10px] text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                        <button className="p-1 text-gray-500 hover:text-purple-400 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="pl-13 flex items-center gap-6">
                        <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider">Reply</button>
                        <button className="text-[10px] font-bold text-gray-500 hover:text-red-400 uppercase tracking-wider">Report</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment Input Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a0b2e]/95 backdrop-blur-xl border-t border-white/10 p-4 pb-8">
                <div className="max-w-md mx-auto flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-2">
                    <input 
                      ref={commentInputRef}
                      type="text" 
                      placeholder="Say something nice..." 
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500"
                    />
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
  );
}
