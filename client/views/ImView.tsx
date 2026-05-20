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

export function ImView() {
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
              key="im"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 pt-4 px-6 space-y-6"
            >
              {/* Sub Tabs */}
              <div className="flex items-center border-b border-white/5 pb-4">
                <button 
                  onClick={() => setImTab('MESSAGE')}
                  className={`flex-1 text-center text-lg font-bold transition-all relative ${imTab === 'MESSAGE' ? 'text-white' : 'text-gray-500'}`}
                >
                  {t('im.tabMessage')}
                  {imTab === 'MESSAGE' && <motion.div layoutId="imTab" className="absolute -bottom-4 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
                </button>
                <button 
                  onClick={() => setImTab('FRIENDS')}
                  className={`flex-1 text-center text-lg font-bold transition-all relative ${imTab === 'FRIENDS' ? 'text-white' : 'text-gray-500'}`}
                >
                  {t('im.tabFriends')}
                  {imTab === 'FRIENDS' && <motion.div layoutId="imTab" className="absolute -bottom-4 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
                </button>
                <button 
                  onClick={() => setImTab('ORDER')}
                  className={`flex-1 text-center text-lg font-bold transition-all relative ${imTab === 'ORDER' ? 'text-white' : 'text-gray-500'}`}
                >
                  {t('im.tabOrder')}
                  {imTab === 'ORDER' && <motion.div layoutId="imTab" className="absolute -bottom-4 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
                </button>
              </div>

              {imTab === 'MESSAGE' ? (
                <div className="space-y-6">
                  {chatSessions.filter(s => {
                    const p = EPALS.find(e => e.id === s.participantId);
                    // Only show sessions with a last message
                    if (!s.lastMessage) return false;
                    return !imSearchQuery || p?.name.toLowerCase().includes(imSearchQuery.toLowerCase());
                  }).map(session => {
                    const participant = EPALS.find(e => e.id === session.participantId);
                    if (!participant) return null;
                    return (
                      <div 
                        key={session.id} 
                        onClick={() => navigateTo('IM_DETAIL', participant)}
                        className="flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer p-2 -mx-2 rounded-xl"
                      >
                        <div className="relative">
                          <img src={participant.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                          {session.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-[#0f071a] flex items-center justify-center text-[10px] font-bold text-white">
                              {session.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-white truncate">{participant.name}</h4>
                            <span className="text-[10px] text-gray-500 font-bold">{formatChatMessageTime(session.lastTimestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">{session.lastMessage}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : imTab === 'FRIENDS' ? (
                <div className="space-y-6">
                  {mutualFollowers.filter(e => !imSearchQuery || e.name.toLowerCase().includes(imSearchQuery.toLowerCase())).length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                        <Users className="w-8 h-8 text-gray-700" />
                      </div>
                      <p className="text-gray-500 font-bold">{t('im.noMutualFollowers')}</p>
                    </div>
                  ) : (
                    mutualFollowers.filter(e => !imSearchQuery || e.name.toLowerCase().includes(imSearchQuery.toLowerCase())).map(epal => {
                      const session = chatSessions.find(s => s.participantId === epal.id);
                      return (
                        <div 
                          key={epal.id} 
                          onClick={() => navigateTo('IM_DETAIL', epal)}
                          className="flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer p-2 -mx-2 rounded-xl"
                        >
                          <div className="relative">
                            <img src={epal.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                            {session && session.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-[#0f071a] flex items-center justify-center text-[10px] font-bold text-white">
                                {session.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-white truncate">{epal.name}</h4>
                              {session && (
                                <span className="text-[10px] text-gray-500 font-bold">{formatChatMessageTime(session.lastTimestamp)}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">
                              {session ? session.lastMessage : t('im.mutualFollowerLine', { game: epal.game })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {imOrders.map(order => {
                    const epal = EPALS.find(e => e.id === order.epalId);
                    if (!epal) return null;
                    return (
                      <div 
                        key={order.id} 
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetailModal(true);
                        }}
                        className="flex items-center gap-4 py-4 border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer group px-2 -mx-2"
                      >
                        <div className="relative shrink-0">
                          <img src={epal.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0f071a] ${epal.onlineStatus === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-white text-sm truncate">{epal.name}</h4>
                            <span className="text-[10px] text-gray-500 font-bold">{formatChatMessageTime(order.timestamp)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col min-w-0">
                              <p className="text-xs text-gray-400 truncate mb-1">{order.serviceName}</p>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  order.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                                  order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400' :
                                  'bg-purple-500/10 text-purple-400'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-sm font-black text-white">{order.price}</span>
                              <CoinIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {order.status === 'PENDING' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateTo('IM_DETAIL', epal);
                              }}
                              className="p-2.5 bg-purple-600 rounded-xl text-white shadow-lg active:scale-90 transition-all"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          ) : (order.status === 'COMPLETED' && !order.reviewed) && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setReviewRating(5);
                                setReviewTags([]);
                                setReviewFeedback('');
                                setShowReviewModal(true);
                              }}
                              className="p-2.5 bg-white/10 rounded-xl text-purple-400 hover:bg-purple-500/20 transition-all"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
  );
}
