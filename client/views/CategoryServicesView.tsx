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

export function CategoryServicesView() {
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
              key="category_services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32"
            >
              {/* Header */}
              <div className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md border-b border-white/5">
                <div className="px-6 py-4 flex items-center gap-4">
                  <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-lg font-bold">{t('category.servicesTitle')}</h2>
                </div>
                
                {/* Tabs */}
                <div className="flex px-6 border-b border-white/5">
                  {[
                    { id: 'GAMES', label: t('apply.tabGames') },
                    { id: 'CHILLING', label: t('category.tabChilling') },
                    { id: 'FAVOURITE', label: t('category.tabFavorite') }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id as Category)}
                      className={`flex-1 py-3 text-sm font-bold transition-all relative ${
                        selectedCategory === tab.id ? 'text-purple-400' : 'text-gray-500'
                      }`}
                    >
                      {tab.label}
                      {selectedCategory === tab.id && (
                        <motion.div 
                          layoutId="activeCategoryTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 space-y-6">
                {selectedCategory === 'GAMES' && groupedGames ? (
                <div className="space-y-8 pt-4">
                  {Object.keys(groupedGames).length > 0 ? (
                    Object.entries(groupedGames as { [key: string]: Game[] }).map(([letter, games]) => (
                      <div key={letter} id={`letter-${letter}`} className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-400 border-b border-white/5 pb-2">{letter}</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {games.map(game => (
                            <GameGridItem 
                              key={game.id}
                              game={game}
                              isFavorite={favorites.includes(game.id)}
                              onToggleFavorite={(e) => toggleFavorite(game.id, e)}
                              onClick={() => navigateTo('GAME_DETAIL', game)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                      <Search className="w-12 h-12 opacity-20" />
                      <p className="font-bold">{t('category.noGamesForQuery', { query: searchQuery })}</p>
                    </div>
                  )}
                  
                  {/* Alphabet Sidebar */}
                  {Object.keys(groupedGames).length > 0 && (
                    <motion.div 
                      animate={{ opacity: isScrolling ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50 py-4 bg-black/20 backdrop-blur-sm rounded-full border border-white/5"
                    >
                      {Object.keys(groupedGames).map(letter => (
                        <button 
                          key={letter}
                          onClick={() => scrollToLetter(letter)}
                          className="text-[10px] font-bold text-gray-500 hover:text-purple-400 transition-colors px-2 py-0.5"
                        >
                          {letter}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 pt-4">
                  {(() => {
                    const filtered = (selectedCategory === 'FAVOURITE' 
                      ? GAMES.filter(g => favorites.includes(g.id))
                      : GAMES.filter(g => g.category === selectedCategory)
                    ).filter(g => 
                      searchQuery === '' || g.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                          {selectedCategory === 'FAVOURITE' && searchQuery === '' ? (
                            <>
                              <Star className="w-12 h-12 opacity-20" />
                              <p className="font-bold">{t('category.noFavoritesYet')}</p>
                            </>
                          ) : (
                            <>
                              <Search className="w-12 h-12 opacity-20" />
                              <p className="font-bold">
                                {searchQuery
                                  ? t('search.noResultsForQuery', { query: searchQuery })
                                  : t('category.noResultsForSearch')}
                              </p>
                            </>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-3 gap-4">
                        {filtered.map(game => (
                          <GameGridItem 
                            key={game.id}
                            game={game}
                            isFavorite={favorites.includes(game.id)}
                            onToggleFavorite={(e) => toggleFavorite(game.id, e)}
                            onClick={() => navigateTo('GAME_DETAIL', game)}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
              </div>
            </motion.div>
  );
}
