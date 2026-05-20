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

export function CommunityView() {
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
              key="community"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-0"
            >
              {/* Community Tabs */}
              <div className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex px-6">
                  {[
                    { id: 'TRENDING', label: t('community.tabTrending') },
                    { id: 'LATEST', label: t('community.tabLatest') },
                    { id: 'FOLLOWING', label: t('community.feedFollowing') }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCommunityTab(tab.id as any)}
                      className={`flex-1 py-4 text-sm font-bold transition-all relative ${
                        communityTab === tab.id ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                      {communityTab === tab.id && (
                        <motion.div 
                          layoutId="communityTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts List - Seamless Style */}
              <div className="divide-y divide-white/5 pb-24">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => navigateTo('POST_DETAIL', { post })}
                      className="bg-transparent hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Post Header */}
                      <div className="p-6 flex items-center justify-between">
                        <div 
                          className="flex items-center gap-4 cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            const epal = EPALS.find(ep => ep.id === post.userId);
                            if (epal) navigateTo('PROFILE', epal);
                          }}
                        >
                          <img 
                            src={post.userAvatar} 
                            alt={post.userName} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-purple-500/50 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <div className="font-bold text-base text-white group-hover:text-purple-400 transition-colors">{post.userName}</div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                              {post.gameName && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-700" />
                                  <span className="text-purple-400/80">{post.gameName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(post.userId);
                          }}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                            followedEPals.has(post.userId) 
                              ? 'bg-white/10 text-gray-400' 
                              : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          }`}
                        >
                          {followedEPals.has(post.userId) ? t('community.following') : t('community.follow')}
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="px-6 pb-4 space-y-4">
                        <p className="text-base text-gray-200 leading-relaxed">{post.content}</p>
                        {post.images && post.images.length > 0 && (
                          <div className="rounded-3xl overflow-hidden border border-white/5">
                            <img 
                              src={post.images[0]} 
                              alt="Post content" 
                              className="w-full aspect-video object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle like logic
                            }}
                            className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
                          >
                            <ThumbsUp className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-bold">{post.likes}</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateTo('POST_DETAIL', { post, focusInput: true });
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-sm font-bold">{post.comments}</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!requireAuthAction(t('auth.loginRequiredFeature'))) return;
                              setShowGiftPanel(true);
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Gift className="w-6 h-6" />
                            <span className="text-sm font-bold">{t('community.gift')}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => { e.stopPropagation(); /* Report */ }}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Flag className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Users className="w-10 h-10 text-gray-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-white font-bold">{t('community.noPostsTitle')}</h3>
                      <p className="text-gray-500 text-sm">
                        {communityTab === 'FOLLOWING' ? t('community.noPostsFollowingHint') : t('community.noPostsGenericHint')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
  );
}
