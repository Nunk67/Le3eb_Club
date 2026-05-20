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

export function ImDetailView() {
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
              key={`im_detail_${selectedEPal.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen flex flex-col bg-[#0f071a]"
            >
              {/* Top Bar */}
              <div className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={() => navigateTo('PROFILE', selectedEPal)}
                  >
                    <div className="flex flex-col">
                      <h4 className="font-bold text-white text-sm leading-tight group-hover:text-purple-400 transition-colors">{selectedEPal.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                        <span className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">{t('im.online')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleFollow(selectedEPal.id)}
                    className={`p-2 rounded-xl transition-all active:scale-95 ${
                      followedEPals.has(selectedEPal.id) 
                        ? 'bg-white/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${followedEPals.has(selectedEPal.id) ? 'fill-current' : ''}`} />
                  </button>
                  {selectedEPal.services && selectedEPal.services.length > 0 && (
                    <button 
                      onClick={() => setShowImServiceCards(!showImServiceCards)}
                      className={`p-2 rounded-xl transition-all active:scale-95 ${
                        showImServiceCards 
                          ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      <Gamepad2 className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Service Cards Overlay */}
              <AnimatePresence>
                {showImServiceCards && selectedEPal.services && selectedEPal.services.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#0f071a] border-b border-white/5 overflow-hidden shrink-0"
                  >
                    <div className="flex gap-4 overflow-x-auto no-scrollbar p-4 snap-x">
                      {selectedEPal.services.map(service => (
                        <div 
                          key={service.id}
                          onClick={() => navigateTo('ORDER_CONFIRM', { epal: selectedEPal, variant: service.variants[0] })}
                          className="min-w-[280px] bg-white/5 rounded-2xl border border-white/10 p-3 flex gap-3 cursor-pointer hover:bg-white/10 transition-all snap-center"
                        >
                          <div className="shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                              <img src={service.posterUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="space-y-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-white text-sm truncate">{service.name}</h4>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-[10px] font-bold text-white">{service.rating}</span>
                                <span className="text-[10px] text-gray-500 font-medium">({service.orderCount})</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <CoinIcon className="w-3 h-3" />
                                <span className="text-sm font-black text-purple-400">{service.variants[0].price}</span>
                                <span className="text-[9px] text-gray-500 font-bold uppercase">/{service.variants[0].unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-32">
                {currentMessages.map((msg, index) => {
                  const prevMsg = index > 0 ? currentMessages[index - 1] : undefined;
                  const timeDisplay = formatChatMessageTime(msg.timestamp, prevMsg?.timestamp);
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {timeDisplay && (
                        <div className="flex justify-center my-4">
                          <span className="text-[10px] text-gray-500 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            {timeDisplay}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[65%] rounded-2xl px-4 py-2.5 ${
                          msg.senderId === 'me' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Input Bar */}
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a0b2e]/95 backdrop-blur-xl border-t border-white/10 p-4 pb-8">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                      <Smile className="w-6 h-6" />
                    </button>
                    <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-2">
                      <input 
                        type="text" 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={t('im.typeMessagePlaceholder')} 
                        className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && messageInput.trim()) {
                            const newMsg: Message = {
                              id: Math.random().toString(),
                              senderId: 'me',
                              receiverId: selectedEPal.id,
                              content: messageInput,
                              timestamp: Date.now(),
                              type: 'text'
                            };
                            setCurrentMessages(prev => [...prev, newMsg]);
                            setMessageInput('');
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!requireAuthAction(t('auth.loginRequiredFeature'))) return;
                        setShowGiftPanel(true);
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <Gift className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => {
                        if (messageInput.trim()) {
                          const newMsg: Message = {
                            id: Math.random().toString(),
                            senderId: 'me',
                            receiverId: selectedEPal.id,
                            content: messageInput,
                            timestamp: Date.now(),
                            type: 'text'
                          };
                          setCurrentMessages(prev => [...prev, newMsg]);
                          setMessageInput('');
                        }
                      }}
                      className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
  );
}
