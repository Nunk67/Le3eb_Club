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

export function ProfileView() {
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
              key="profile"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="space-y-0"
            >
              <div className="relative h-[35vh]">
                <img 
                  src={selectedEPal.avatarUrl} 
                  alt={selectedEPal.name} 
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
              </div>
              
              <div className="px-6 -mt-12 relative z-10 space-y-6">
                {/* Avatar Frame */}
                <div className="absolute -top-12 left-10 w-24 h-24 rounded-3xl border-4 border-[#0f071a] overflow-hidden shadow-2xl z-30">
                  <img src={selectedEPal.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                <GlassCard className="p-5 pt-16 space-y-3 relative z-20 shadow-2xl">
                  {/* Follow Button - Top Right */}
                  <button 
                    onClick={() => selectedEPal && toggleFollow(selectedEPal.id)}
                    className={`absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-95 transition-all group ${
                      selectedEPal && followedEPals.has(selectedEPal.id)
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    }`}
                  >
                    <Heart 
                      className={`w-3.5 h-3.5 text-white ${
                        selectedEPal && followedEPals.has(selectedEPal.id) ? 'fill-current' : ''
                      }`} 
                    />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      {selectedEPal && followedEPals.has(selectedEPal.id) ? t('community.following') : t('community.follow')}
                    </span>
                  </button>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 pr-24">
                      <h1 className="text-xl font-bold truncate">{selectedEPal.name}</h1>
                      {selectedEPal.gender && (
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${selectedEPal.gender === 'Female' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {selectedEPal.gender === 'Female' ? <Venus className="w-3 h-3" /> : <Mars className="w-3 h-3" />}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-tight">
                          {t('search.epalIdPrefix')} {selectedEPal.id.slice(0, 8)}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(selectedEPal.id)}
                          className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                          {copied ? <Check className="w-2.5 h-2.5 text-green-400" /> : <Copy className="w-2.5 h-2.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>{selectedEPal.followersCount || '0'}</span>
                          <span className="font-medium opacity-60">{t('contacts.tabFollowers')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{selectedEPal.followingCount || '0'}</span>
                          <span className="font-medium opacity-60">{t('contacts.tabFollowing')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Info Badges */}
                      <div className="flex flex-wrap gap-2">
                        {selectedEPal.onlineStatus && (
                          <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase">{selectedEPal.onlineStatus}</span>
                          </div>
                        )}

                        {selectedEPal.region && (
                          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">{selectedEPal.region}</span>
                          </div>
                        )}
                      </div>
                    </div>
                </GlassCard>

                {/* Profile Tabs */}
                <div className="flex justify-between items-center px-2 py-4 border-b border-white/5 sticky top-0 bg-[#0f071a]/80 backdrop-blur-xl z-40 -mx-6 px-8">
                  {[
                    { id: 'Playlink', icon: Play },
                    { id: 'Service', icon: Gamepad2 },
                    { id: 'Album', icon: Image },
                    { id: 'Post', icon: Layout }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id as any)}
                      className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${profileTab === tab.id ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <tab.icon className={`w-5 h-5 ${profileTab === tab.id ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tab.id}</span>
                      {profileTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-4 left-0 right-0 h-0.5 bg-purple-400 rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {profileTab === 'Service' && selectedEPal.services && selectedEPal.services.length > 0 && (
                  <div className="space-y-6 pt-2 relative z-30">
                    <div className="flex gap-4 overflow-x-auto pt-4 pb-6 no-scrollbar -mx-2 px-2">
                      {selectedEPal.services.map(service => {
                        return (
                          <button
                            key={service.id}
                            onClick={() => setActiveServiceId(service.id)}
                            className={`flex flex-col items-center gap-2 shrink-0 transition-all duration-300 ${activeServiceId === service.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                          >
                            <div className={`w-20 h-28 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeServiceId === service.id ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] scale-110' : 'border-white/10'}`}>
                              <img 
                                src={service.posterUrl} 
                                alt={service.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${activeServiceId === service.id ? 'text-white' : 'text-gray-500'}`}>{service.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Service Content */}
                    {selectedEPal.services.find(s => s.id === activeServiceId) && (
                      <div className="space-y-6">
                        {(() => {
                          const service = selectedEPal.services.find(s => s.id === activeServiceId)!;
                          return (
                            <>
                              <GlassCard className="p-6 space-y-4">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1.5">
                                      <h3 className="text-xl font-bold">{service.name}</h3>
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                          <span className="text-sm font-bold">{service.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                          <span className="text-sm font-bold">{service.orderCount} Orders</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={(e) => handlePlayToggle(selectedEPal.id, e)}
                                      className="w-10 h-10 bg-purple-600 border border-purple-500/50 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0"
                                    >
                                      {playingEPalId === selectedEPal.id ? (
                                        <WaveAnimation color="bg-white" />
                                      ) : (
                                        <Play className="w-4 h-4 text-white fill-current" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Screenshots */}
                                <img 
                                  src={service.screenshots[0]} 
                                  className="w-full h-36 object-cover rounded-2xl border border-white/10" 
                                  referrerPolicy="no-referrer"
                                />

                                <div className="space-y-4">
                                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                                  
                                  {/* Service Details Toggle */}
                                  {service.details && (
                                    <div className="space-y-3">
                                      <button 
                                        onClick={() => setShowServiceDetails(!showServiceDetails)}
                                        className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300 transition-colors"
                                      >
                                        {showServiceDetails ? (
                                          <>
                                            <ChevronUp className="w-3 h-3" />
                                            View Less
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="w-3 h-3" />
                                            View More
                                          </>
                                        )}
                                      </button>

                                      <AnimatePresence>
                                        {showServiceDetails && (
                                          <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="space-y-1.5 pt-1">
                                              {service.details.rank && (
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
                                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Rank</p>
                                                  <p className="text-xs font-bold text-purple-400">{service.details.rank}</p>
                                                </div>
                                              )}
                                              {service.details.server && (
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
                                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Server</p>
                                                  <p className="text-xs font-bold text-purple-400">{service.details.server}</p>
                                                </div>
                                              )}
                                              {service.details.main && (
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
                                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Main</p>
                                                  <p className="text-xs font-bold text-purple-400">{service.details.main}</p>
                                                </div>
                                              )}
                                              {service.details.style && (
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
                                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Style</p>
                                                  <p className="text-xs font-bold text-purple-400">{service.details.style}</p>
                                                </div>
                                              )}
                                              {service.details.platform && (
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
                                                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Platform</p>
                                                  <p className="text-xs font-bold text-purple-400">{service.details.platform}</p>
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                </div>

                                {/* Variants */}
                                <div className="space-y-3 pt-2">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Service Types</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {service.variants.map((v, idx) => (
                                      <button 
                                        key={idx} 
                                        onClick={() => navigateTo('ORDER_CONFIRM', { epal: selectedEPal, variant: v })}
                                        className="flex justify-between items-center p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all text-left"
                                      >
                                        <span className="text-sm font-bold">{v.name}</span>
                                        <span className="text-purple-400 font-bold flex items-center gap-1">
                                          {v.price} <CoinIcon />
                                          <span className="text-[10px] text-gray-500 uppercase">/ {v.unit}</span>
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </GlassCard>

                              {/* Reviews Section */}
                              <div className="space-y-6">
                                <div className="flex justify-between items-end px-1">
                                  <div className="space-y-1">
                                    <h3 className="text-lg font-bold">User Reviews</h3>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/30">
                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                        <span className="text-sm font-bold text-purple-400">{selectedEPal.rating.toFixed(1)}</span>
                                      </div>
                                      <span className="text-xs text-gray-500 font-bold">{selectedEPal.orderCount} Ratings</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => navigateTo('ALL_REVIEWS', { epal: selectedEPal })}
                                    className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    View All
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Review Tags */}
                                {selectedEPal.reviewTags && (
                                  <div className="flex flex-wrap gap-2 px-1">
                                    {selectedEPal.reviewTags.map((tag, idx) => (
                                      <div 
                                        key={idx}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2"
                                      >
                                        <span className="text-[11px] font-bold text-gray-300">{tag.name}</span>
                                        <span className="text-[10px] font-bold text-gray-500">{tag.count}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="space-y-3">
                                  {selectedEPal.reviews?.slice(0, 2).map(review => (
                                    <div key={review.id}>
                                      <GlassCard className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-3">
                                            <img src={review.userAvatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                                            <div>
                                              <p className="text-sm font-bold">{review.userName}</p>
                                              <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <span className="text-[10px] text-gray-600 font-bold">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 italic">"{review.comment}"</p>
                                      </GlassCard>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {profileTab === 'Playlink' && (
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    {selectedEPal.playlinks?.map((pl) => (
                      <button 
                        key={pl.id}
                        onClick={() => {
                          setSelectedPlaylinkId(pl.id);
                          setShowPlaylinkModal(true);
                        }}
                        className="relative aspect-[16/6] rounded-2xl overflow-hidden group active:scale-[0.98] transition-all border border-white/5"
                      >
                        <img 
                          src={pl.posterUrl} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 backdrop-blur-md px-2 py-0.5 rounded border border-purple-500/20">
                              {pl.gameName}
                            </span>
                            <h3 className="text-lg font-black text-white tracking-tight uppercase">{pl.nickname}</h3>
                          </div>
                          {pl.platform && (
                            <div className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center">
                              {pl.platform === 'PC' && <Monitor className="w-4 h-4 text-white" />}
                              {pl.platform === 'PS' && <Gamepad2 className="w-4 h-4 text-white" />}
                              {pl.platform === 'Mobile' && <Smartphone className="w-4 h-4 text-white" />}
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex flex-nowrap gap-2 overflow-hidden">
                          {[pl.rank, pl.server, pl.role, pl.style].filter(Boolean).map((tag, idx) => (
                            <span key={idx} className="text-[9px] font-bold text-white/90 uppercase tracking-wider bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 whitespace-nowrap shrink-0">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {profileTab === 'Album' && (
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${selectedEPal.id}${i}/400/400`} 
                          className="w-full h-full object-cover opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {profileTab === 'Post' && (
                  <div className="space-y-4 pt-4">
                    {(() => {
                      const userPosts = POSTS.filter(p => p.userId === selectedEPal.id);
                      if (userPosts.length === 0) {
                        return (
                          <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                              <Layout className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="text-gray-500 font-bold">{t('community.noPostsTitle')}</p>
                          </div>
                        );
                      }
                      return userPosts.map((post) => (
                        <button 
                          key={post.id} 
                          onClick={() => navigateTo('POST_DETAIL', { post })}
                          className="w-full text-left"
                        >
                          <GlassCard className="p-4 space-y-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <img src={post.userAvatar} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="text-xs font-bold">{post.userName}</p>
                                <p className="text-[10px] text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-200 line-clamp-3">{post.content}</p>
                            {post.images && post.images.length > 0 && (
                              <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                                {post.images.slice(0, 2).map((img, idx) => (
                                  <div key={idx} className="aspect-video rounded-xl bg-white/5 overflow-hidden">
                                    <img src={img} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </GlassCard>
                        </button>
                      ));
                    })()}
                  </div>
                )}
              </div>

              {/* Floating Profile Actions */}
              <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 pointer-events-none">
                <div className="flex gap-4 max-w-md mx-auto pointer-events-auto">
                  <button 
                    onClick={() => selectedEPal && navigateTo('IM_DETAIL', selectedEPal)}
                    className="flex-1 py-4 rounded-2xl bg-[#1a0b2e]/90 backdrop-blur-xl border border-white/10 font-bold flex items-center justify-center gap-3 text-white shadow-2xl active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-5 h-5 text-purple-400" /> Chat
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedEPal && activeServiceId) {
                        const service = selectedEPal.services?.find(s => s.id === activeServiceId);
                        if (service) {
                          navigateTo('ORDER_CONFIRM', { epal: selectedEPal, variant: service.variants[0] });
                        }
                      }
                    }}
                    className="flex-1 py-4 rounded-2xl bg-purple-600 font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 text-white"
                  >
                    <Play className="w-5 h-5 fill-current" /> Play
                  </button>
                </div>
              </div>
            </motion.div>
  );
}
