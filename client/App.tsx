import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { GAMES, EPALS, POSTS, PRODUCT_SEMVER } from './constants';
import { businessApi, type CompanionRanking } from './services/businessApi';
import { useI18n } from './i18n/I18nProvider';

// --- Components ---

const GlassCard = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const IconButton = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
      active 
        ? 'bg-purple-600/40 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
        : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
    }`}>
      <Icon className={`w-10 h-10 ${active ? 'text-purple-300' : 'text-purple-400'}`} />
    </div>
    <span className={`text-[10px] font-bold tracking-widest uppercase ${active ? 'text-white' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

const WaveAnimation = ({ color = "bg-black" }: { color?: string }) => (
  <div className="flex items-center gap-0.5 h-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{
          height: [4, 12, 4],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
        className={`w-0.5 ${color} rounded-full`}
      />
    ))}
  </div>
);

const EPalCard: React.FC<{ 
  epal: EPal; 
  onProfileClick: () => void; 
  onOrderClick: () => void; 
  isPlaying?: boolean;
  onPlayToggle?: (e: React.MouseEvent) => void;
  badgeText?: string;
}> = ({ epal, onProfileClick, onOrderClick, isPlaying, onPlayToggle, badgeText }) => (
  <GlassCard className="relative p-4 flex items-center gap-4 hover:bg-white/[0.05] transition-all group border-white/5">
    {/* Column 1: Avatar */}
    <div className="relative shrink-0">
      <div 
        className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 cursor-pointer group-hover:border-purple-500/50 transition-all shadow-lg" 
        onClick={onProfileClick}
      >
        <img 
          src={epal.avatarUrl} 
          alt={epal.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          referrerPolicy="no-referrer" 
        />
      </div>
      {/* Play Button Overlay */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onPlayToggle?.(e);
        }}
        className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all border z-10 ${
          isPlaying ? 'bg-white border-white text-purple-600' : 'bg-purple-600 border-purple-500/50 text-white'
        }`}
      >
        {isPlaying ? (
          <WaveAnimation color="bg-purple-600" />
        ) : (
          <Play className="w-3 h-3 fill-current ml-0.5" />
        )}
      </button>
    </div>

    {/* Column 2: Player Info */}
    <div className="flex-1 flex flex-col gap-1 min-w-0">
      <h4 
        className="font-bold text-white text-lg leading-tight cursor-pointer hover:text-purple-400 transition-colors truncate" 
        onClick={onProfileClick}
      >
        {epal.name}
      </h4>
      
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
        <span className="text-sm text-white font-bold">{epal.rating.toFixed(1)}</span>
        <span className="text-[10px] text-gray-500 font-medium">
          ({epal.orderCount >= 1000 ? `${(epal.orderCount / 1000).toFixed(1)}k` : epal.orderCount})
        </span>
      </div>

      {badgeText && (
        <div className="mt-0.5 flex">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-full">
            {badgeText}
          </span>
        </div>
      )}
    </div>

    {/* Column 3: Price + CTA */}
    <div className="flex flex-col items-end gap-2 shrink-0 pl-2">
      <div className="flex flex-col items-end leading-none">
        <div className="flex items-center gap-1 text-white font-bold">
          <span className="text-sm">{epal.price}</span>
          <CoinIcon />
        </div>
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">per hour</span>
      </div>
      
      <button 
        onClick={onOrderClick}
        className="w-8 h-8 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center transition-all active:scale-95 shadow-[0_2px_8px_rgba(168,85,247,0.2)]"
      >
        <Gamepad2 className="w-4 h-4" />
      </button>
    </div>
  </GlassCard>
);

const LegendEPalCard: React.FC<{ 
  epal: EPal; 
  onProfileClick: () => void; 
  isPlaying?: boolean;
  onPlayToggle?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: 'overlay' | 'stacked';
}> = ({ epal, onProfileClick, isPlaying, onPlayToggle, className = "", variant = 'overlay' }) => {
  const displayTags = epal.tags.slice(0, 2);
  const remainingCount = epal.tags.length - 2;

  const InfoContent = () => (
    <div className="flex justify-between items-start relative">
      <div className={`flex-1 min-w-0 ${variant === 'overlay' ? 'pr-8' : ''}`}>
        <div className="flex items-center gap-1.5">
          <h4 className={`font-bold truncate ${variant === 'overlay' ? 'text-white text-xs sm:text-sm' : 'text-white text-sm'}`}>{epal.name}</h4>
          <div className="flex items-center gap-0.5 shrink-0 bg-black/20 px-1 py-0.5 rounded-md">
            <Star className="w-2 h-2 text-yellow-500 fill-current" />
            <span className="text-[8px] text-white font-bold">{epal.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-1 overflow-hidden">
            {displayTags.map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-purple-500/30 border border-purple-500/30 rounded-full text-[7px] font-bold text-purple-200 whitespace-nowrap">
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded-full text-[7px] font-bold text-gray-300 whitespace-nowrap">
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Play Button for Overlay Variant */}
      {variant === 'overlay' && (
        <div className="absolute right-0 z-10 top-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPlayToggle?.(e);
            }}
            className="w-8 h-8 bg-purple-600 border border-purple-500/50 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            {isPlaying ? (
              <WaveAnimation color="bg-white" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white fill-current" />
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col gap-3 ${className}`} onClick={onProfileClick}>
        <div className="relative aspect-square rounded-[32px] overflow-hidden group shadow-2xl border border-white/5">
          <img 
            src={epal.avatarUrl} 
            alt={epal.name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            referrerPolicy="no-referrer" 
          />
          {/* Play Button inside avatar for stacked variant */}
          <div className="absolute bottom-3 right-3 z-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayToggle?.(e);
              }}
              className="w-8 h-8 bg-purple-600 border border-purple-500/50 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              {isPlaying ? (
                <WaveAnimation color="bg-white" />
              ) : (
                <Play className="w-3.5 h-3.5 text-white fill-current" />
              )}
            </button>
          </div>
        </div>
        <div className="px-1">
          <InfoContent />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative aspect-square rounded-[32px] overflow-hidden group cursor-pointer shadow-2xl border border-white/5 ${className}`} 
      onClick={onProfileClick}
    >
      {/* Background Image */}
      <img 
        src={epal.avatarUrl} 
        alt={epal.name} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        referrerPolicy="no-referrer" 
      />
      
      {/* Bottom 1/4 Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-black/40 backdrop-blur-xl border-t border-white/10 p-3 flex flex-col justify-center">
        <InfoContent />
      </div>
    </div>
  );
};

const GameGridItem: React.FC<{ 
  game: Game; 
  isFavorite: boolean; 
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}> = ({ game, isFavorite, onToggleFavorite, onClick }) => (
  <div 
    onClick={onClick}
    className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-white/5"
  >
    <img 
      src={game.imageUrl} 
      alt={game.name} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-end">
      <span className="font-bold text-white text-[10px] leading-tight line-clamp-2">{game.name}</span>
    </div>
    
    <button 
      onClick={onToggleFavorite}
      className="absolute top-1 right-1 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 active:scale-90 transition-transform"
    >
      <Star 
        className={`w-3 h-3 ${isFavorite ? 'text-yellow-500 fill-current' : 'text-white'}`} 
      />
    </button>
  </div>
);

// --- Helpers ---

const formatChatMessageTime = (timestamp: number, previousTimestamp?: number) => {
  const now = new Date();
  const date = new Date(timestamp);
  
  // If the difference is less than 5 minutes, don't show time
  if (previousTimestamp && timestamp - previousTimestamp < 5 * 60 * 1000) {
    return null;
  }

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (isSameDay(now, date)) {
    return timeStr;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(yesterday, date)) {
    return `Yesterday ${timeStr}`;
  }

  const beforeYesterday = new Date(now);
  beforeYesterday.setDate(now.getDate() - 2);
  if (isSameDay(beforeYesterday, date)) {
    return `2 days ago ${timeStr}`;
  }

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date > oneWeekAgo) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]} ${timeStr}`;
  }

  if (now.getFullYear() === date.getFullYear()) {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  }

  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// --- Views ---

type View = 'HOME' | 'COMMUNITY' | 'POST_DETAIL' | 'GAME_DETAIL' | 'PROFILE' | 'ORDER_CONFIRM' | 'LEGEND_LIST' | 'ALL_REVIEWS' | 'CATEGORY_SERVICES' | 'IM' | 'IM_DETAIL' | 'NOTIFICATIONS' | 'CONTACTS' | 'COMMUNITY_SELECTOR' | 'ME' | 'WALLET' | 'RECHARGE' | 'WITHDRAW' | 'APPLY_PLAYER' | 'APPLY_PLAYER_CATEGORY' | 'APPLY_PLAYER_DETAILS' | 'PLAYER_PROFILE_EDIT' | 'SETTINGS' | 'MY_ORDERS' | 'SETTINGS_EDIT_PROFILE' | 'SETTINGS_CHANGE_PASSWORD' | 'SETTINGS_LINKED_ACCOUNTS' | 'SETTINGS_LANGUAGE' | 'SETTINGS_PRIVACY' | 'SETTINGS_TERMS';
const BUSINESS_TOKEN_KEY = 'business_workbench_token';
const BUSINESS_UI_AUTH_KEY = 'business_ui_authenticated';
const PROTECTED_VIEWS = new Set<View>([
  'ORDER_CONFIRM',
  'IM',
  'IM_DETAIL',
  'NOTIFICATIONS',
  'CONTACTS',
  'WALLET',
  'RECHARGE',
  'WITHDRAW',
  'APPLY_PLAYER',
  'APPLY_PLAYER_CATEGORY',
  'APPLY_PLAYER_DETAILS',
  'PLAYER_PROFILE_EDIT',
  'SETTINGS',
  'MY_ORDERS',
  'SETTINGS_EDIT_PROFILE',
  'SETTINGS_CHANGE_PASSWORD',
  'SETTINGS_LINKED_ACCOUNTS',
  'SETTINGS_LANGUAGE',
  'SETTINGS_PRIVACY',
  'SETTINGS_TERMS',
]);

const CoinIcon = ({ className = "w-3 h-3", textClassName = "text-[8px]" }: { className?: string, textClassName?: string }) => (
  <span className={`${className} rounded-full bg-yellow-500 inline-flex items-center justify-center shrink-0`}>
    <span className={`${textClassName} text-black font-black leading-none`}>C</span>
  </span>
);

const WalletView = ({ 
  wallet, 
  transactions, 
  packages,
  onSelectPackage,
  onBack 
}: { 
  wallet: WalletType | null, 
  transactions: WalletTransaction[], 
  packages: RechargePackage[],
  onSelectPackage: (pkg: RechargePackage, method: 'GOOGLE_PAY' | 'APPLE_PAY') => void,
  onBack: () => void 
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const detectPaymentMethod = (): 'APPLE_PAY' | 'GOOGLE_PAY' => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|macintosh/.test(ua)) return 'APPLE_PAY';
    return 'GOOGLE_PAY';
  };

  const filteredTransactions = transactions.filter(tx => {
    // Type Filter
    if (typeFilter === 'EXPENSE' && tx.amount > 0) return false;
    if (typeFilter === 'INCOME' && tx.amount < 0) return false;

    // Time Filter
    if (!customStartDate && !customEndDate) return true;
    const txTime = tx.timestamp;
    const start = customStartDate ? new Date(customStartDate).getTime() : 0;
    const end = customEndDate ? new Date(customEndDate).getTime() + 86400000 : Infinity;
    return txTime >= start && txTime <= end;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0514]">
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={showHistory ? () => setShowHistory(false) : onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">{showHistory ? 'History' : 'Wallet'}</h2>
        </div>
        {!showHistory ? (
          <button 
            onClick={() => setShowHistory(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <History className="w-6 h-6" />
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`p-2 rounded-full transition-all ${showDatePicker ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Calendar className="w-6 h-6" />
            </button>
            
            <AnimatePresence>
              {showDatePicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#1a102a] border border-white/10 rounded-2xl shadow-2xl z-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Date Range</span>
                    <button 
                      onClick={() => {
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      className="text-[8px] font-bold text-purple-400 hover:text-purple-300 uppercase"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Start Date</label>
                      <input 
                        type="date" 
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full bg-[#0f071a] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">End Date</label>
                      <input 
                        type="date" 
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full bg-[#0f071a] border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="w-full py-2 bg-purple-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {!showHistory ? (
          <>
            {/* Balance Card */}
            <GlassCard className="p-8 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                <Wallet className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Current Balance</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{wallet?.balance || 0}</span>
                  <CoinIcon className="w-6 h-6" />
                </div>
              </div>
            </GlassCard>

            {/* Recharge Packages */}
            <div className="space-y-4">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest px-2">Recharge Packages</p>
              <div className="grid grid-cols-2 gap-4">
                {packages.map(pkg => (
                  <button 
                    key={pkg.id}
                    onClick={() => onSelectPackage(pkg, detectPaymentMethod())}
                    className="relative p-6 rounded-3xl border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all flex flex-col items-center gap-3 active:scale-95 group"
                  >
                    {pkg.bonus && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-950 text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-10">
                        +{pkg.bonus} BONUS
                      </div>
                    )}
                    <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-black text-white">{pkg.coins}</span>
                      <CoinIcon className="w-5 h-5" />
                    </div>
                    <div className="text-purple-400 font-black text-lg">${pkg.amount}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'EXPENSE', label: 'Expenses' },
                { id: 'INCOME', label: 'Income' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id as any)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    typeFilter === filter.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <GlassCard key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'RECHARGE' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        {tx.type === 'RECHARGE' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{tx.description}</div>
                        <div className="text-gray-500 text-[10px] font-medium">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                      <CoinIcon className="w-3 h-3" />
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-gray-600 gap-4">
                  <History className="w-12 h-12 opacity-20" />
                  <p className="font-bold">No transactions found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RechargeView = ({ 
  packages, 
  onSelect, 
  onBack 
}: { 
  packages: RechargePackage[], 
  onSelect: (pkg: RechargePackage, method: 'GOOGLE_PAY' | 'APPLE_PAY') => void, 
  onBack: () => void 
}) => {
  const detectPaymentMethod = (): 'APPLE_PAY' | 'GOOGLE_PAY' => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod|macintosh/.test(ua)) {
      return 'APPLE_PAY';
    }
    return 'GOOGLE_PAY';
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0514]">
      <div className="p-4 flex items-center gap-4 border-b border-white/5">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h2 className="text-xl font-bold text-white">Recharge Coins</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div className="space-y-4">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest px-2">Select a Package</p>
          {/* Packages Grid */}
          <div className="grid grid-cols-2 gap-4">
            {packages.map(pkg => (
              <button 
                key={pkg.id}
                onClick={() => onSelect(pkg, detectPaymentMethod())}
                className="relative p-6 rounded-3xl border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all flex flex-col items-center gap-3 active:scale-95 group"
              >
                {pkg.bonus && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-950 text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-10">
                    +{pkg.bonus} BONUS
                  </div>
                )}
                <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                  <span className="text-3xl font-black text-white">{pkg.coins}</span>
                  <CoinIcon className="w-5 h-5" />
                </div>
                <div className="text-purple-400 font-black text-lg">${pkg.amount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-4">
          <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Secure Payment</p>
              <p className="text-[10px] text-gray-500 font-medium">Automatic store checkout based on your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsSubPage: React.FC<{
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ title, onBack, children }) => (
  <div className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-8">
    <div className="flex items-center justify-between relative">
      <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 relative z-10">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">{title}</h1>
      <div className="w-10" />
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

export default function App() {
  const { locale, setLocale, t, supportedLocales, getLocaleLabel } = useI18n();
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargePackages, setRechargePackages] = useState<RechargePackage[]>([]);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [cacheSize, setCacheSize] = useState('12.4 MB');
  const userId = 'user_1'; // Mock current user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuthenticatedRef = useRef(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authEmail, setAuthEmail] = useState('demo@le3eb.club');
  const [authPassword, setAuthPassword] = useState('demo123');
  const [authUsername, setAuthUsername] = useState('new_user');
  const [authStatus, setAuthStatus] = useState('');
  const [companionRankings, setCompanionRankings] = useState<CompanionRanking[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [rankingsError, setRankingsError] = useState('');
  const [rankingSortBy, setRankingSortBy] = useState<'SCORE' | 'RATING' | 'COMPLETED'>('SCORE');
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [expandedRankingId, setExpandedRankingId] = useState<string | null>(null);
  const pendingNavigationRef = useRef<{ view: View; data?: any } | null>(null);
  const authTokenRef = useRef<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch(`/api/wallet/balance?userId=${userId}`);
      const data = await res.json();
      setWallet(data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/wallet/transactions?userId=${userId}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }, [userId]);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/recharge/packages');
      const data = await res.json();
      setRechargePackages(data);
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    }
  }, []);

  const fetchCompanionRankings = useCallback(async (token: string) => {
    setRankingsLoading(true);
    setRankingsError('');
    try {
      const list = await businessApi.listCompanionRankings(token, 10);
      setCompanionRankings(list);
    } catch (error) {
      setRankingsError((error as Error).message || t('ranking.loadFailed'));
    } finally {
      setRankingsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
    fetchPackages();
  }, [fetchWallet, fetchTransactions, fetchPackages]);

  useEffect(() => {
    const uiAuth = sessionStorage.getItem(BUSINESS_UI_AUTH_KEY) === '1';
    setIsAuthenticated(uiAuth);
    isAuthenticatedRef.current = uiAuth;
    const token = uiAuth ? localStorage.getItem(BUSINESS_TOKEN_KEY) : null;
    setAuthToken(token);
    authTokenRef.current = token;
  }, []);

  useEffect(() => {
    authTokenRef.current = authToken;
  }, [authToken]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !authToken) {
      setCompanionRankings([]);
      setRankingsLoading(false);
      setRankingsError('');
      return;
    }
    fetchCompanionRankings(authToken);
  }, [isAuthenticated, authToken, fetchCompanionRankings]);

  const sortedRankings = useMemo(() => {
    const cloned = [...companionRankings];
    if (rankingSortBy === 'RATING') {
      return cloned.sort((a, b) => b.avgRating - a.avgRating || b.rankingScore - a.rankingScore);
    }
    if (rankingSortBy === 'COMPLETED') {
      return cloned.sort((a, b) => b.completedOrderCount - a.completedOrderCount || b.rankingScore - a.rankingScore);
    }
    return cloned.sort((a, b) => b.rankingScore - a.rankingScore || b.avgRating - a.avgRating);
  }, [companionRankings, rankingSortBy]);

  const openAuthModal = (statusText = t('auth.loginRequired')) => {
    setAuthStatus(statusText);
    setAuthMode('LOGIN');
    setShowAuthModal(true);
  };

  const requireAuthAction = (statusText?: string) => {
    if (isAuthenticatedRef.current) return true;
    openAuthModal(statusText || t('auth.loginRequired'));
    return false;
  };

  const handleLogout = async () => {
    const token = authToken;
    if (token) {
      try {
        await businessApi.logout(token);
      } catch {
        // Keep local logout regardless of network/session errors.
      }
    }
    localStorage.removeItem(BUSINESS_TOKEN_KEY);
    sessionStorage.removeItem(BUSINESS_UI_AUTH_KEY);
    setIsAuthenticated(false);
    isAuthenticatedRef.current = false;
    setAuthToken(null);
    authTokenRef.current = null;
    pendingNavigationRef.current = null;
    setCurrentView('HOME');
    setViewHistory(['HOME']);
    setShowAuthModal(false);
    setAuthStatus(t('auth.loggedOut'));
  };

  const handleAuthSubmit = async () => {
    setAuthStatus(authMode === 'LOGIN' ? t('auth.loggingIn') : t('auth.registering'));
    try {
      if (authMode === 'REGISTER') {
        await businessApi.register(authUsername, authEmail, authPassword);
      }
      const session = await businessApi.login(authEmail, authPassword);
      localStorage.setItem(BUSINESS_TOKEN_KEY, session.token);
      sessionStorage.setItem(BUSINESS_UI_AUTH_KEY, '1');
      setIsAuthenticated(true);
      isAuthenticatedRef.current = true;
      setAuthToken(session.token);
      authTokenRef.current = session.token;
      setShowAuthModal(false);
      setAuthStatus(t('auth.loggedIn'));
      const pending = pendingNavigationRef.current;
      pendingNavigationRef.current = null;
      if (pending) {
        navigateTo(pending.view, pending.data);
      } else {
        setCurrentView('ME');
        setViewHistory(['ME']);
      }
    } catch (error) {
      setAuthStatus((error as Error).message);
    }
  };

  const handleRecharge = async (pkg: RechargePackage, method: 'GOOGLE_PAY' | 'APPLE_PAY') => {
    setIsRecharging(true);
    try {
      // 1. Create Order
      const createRes = await fetch('/api/recharge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, packageId: pkg.id, paymentMethod: method })
      });
      const order = await createRes.json();
      
      if (order.error) throw new Error(order.error);

      // 2. Simulate Payment Gateway (Apple/Google Pay)
      // In a real app, this would open the native payment sheet
      await new Promise(resolve => setTimeout(resolve, 2000));
      const transactionId = `pay_${Math.random().toString(36).substr(2, 9)}`;

      // 3. Verify Payment (Callback)
      const verifyRes = await fetch('/api/recharge/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          transactionId, 
          status: 'SUCCESS' 
        })
      });
      const result = await verifyRes.json();

      if (result.status === 'SUCCESS') {
        await fetchWallet();
        await fetchTransactions();
        navigateTo('WALLET');
      } else if (result.status === 'PENDING') {
        alert('Payment is being reviewed for risk control. Please check back later.');
        navigateTo('WALLET');
      }
    } catch (err: any) {
      alert(err.message || 'Recharge failed');
    } finally {
      setIsRecharging(false);
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<Category>('GAMES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [applicationDetails, setApplicationDetails] = useState({
    rank: '',
    platform: '',
    style: '',
    price: '',
    discount: ''
  });
  const [selectedEPal, setSelectedEPal] = useState<EPal | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(0);
  const [giftQuantity, setGiftQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [userCoins, setUserCoins] = useState(1250);
  const [userDiamonds, setUserDiamonds] = useState(0);
  const [userRole, setUserRole] = useState<'USER' | 'PLAYER'>('USER');
  const [isPlayerOnline, setIsPlayerOnline] = useState(true);
  const [playerApplicationStatus, setPlayerApplicationStatus] = useState<'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'>('NONE');
  const [playerApplicationStep, setPlayerApplicationStep] = useState(1);
  const [playerApplicationData, setPlayerApplicationData] = useState({
    gameId: '',
    rank: '',
    mainPosition: '',
    server: '',
    platform: '',
    style: '',
    intro: '',
    screenshots: [] as string[],
    voiceUrl: '',
    coverUrl: '',
    coverIntro: '',
    serviceName: '',
    price: 0,
    unit: 'Game',
    promotion: {
      type: 'NONE' as 'NONE' | 'FIRST_ORDER_DISCOUNT' | 'DISCOUNT' | 'BUY_X_GET_Y',
      value: 0,
      buyX: 0,
      getY: 0,
      limitType: 'NONE' as 'NONE' | 'TIME' | 'QUANTITY',
      limitValue: 0
    }
  });
  const [applyGameSearchQuery, setApplyGameSearchQuery] = useState('');
  const [showApplySelectionModal, setShowApplySelectionModal] = useState<{
    show: boolean;
    type: 'RANK' | 'MAIN' | 'SERVER' | 'PLATFORM' | 'NONE';
    options: string[];
    title: string;
  }>({
    show: false,
    type: 'NONE',
    options: [],
    title: ''
  });
  const [showGameSelectorModal, setShowGameSelectorModal] = useState(false);
  const [focusCommentInput, setFocusCommentInput] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentView === 'POST_DETAIL' && focusCommentInput && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [currentView, focusCommentInput, selectedPost?.id]);
  const [moreEPals, setMoreEPals] = useState<EPal[]>(EPALS.filter(e => !e.isLegend));
  const [loadingMore, setLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playingEPalId, setPlayingEPalId] = useState<string | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<EPalServiceVariant | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([
    { id: '1', name: 'New User Discount', discount: 5, type: 'FIXED', minSpend: 10 },
    { id: '2', name: 'Weekend Special', discount: 10, type: 'PERCENTAGE', minSpend: 20 }
  ]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [profileTab, setProfileTab] = useState<'Playlink' | 'Service' | 'Album' | 'Post'>('Service');
  const [selectedPlaylinkId, setSelectedPlaylinkId] = useState<string | null>(null);
  const [showPlaylinkModal, setShowPlaylinkModal] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [epalToUnfollow, setEpalToUnfollow] = useState<EPal | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [reviewSortOrder, setReviewSortOrder] = useState<'DEFAULT' | 'NEWEST' | 'OLDEST' | 'RATING_HIGH' | 'RATING_LOW'>('DEFAULT');
  const [selectedReviewTag, setSelectedReviewTag] = useState<string | null>(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [showReviewFilterModal, setShowReviewFilterModal] = useState(false);
  const [imTab, setImTab] = useState<'MESSAGE' | 'ORDER' | 'FRIENDS'>('MESSAGE');
  const [imSearchQuery, setImSearchQuery] = useState('');
  const [walletTab, setWalletTab] = useState<'ALL' | 'RECHARGE' | 'ORDER'>('ALL');
  const [walletDate, setWalletDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedApplyGameCategory, setSelectedApplyGameCategory] = useState<string>('GAMES');
  const [epalSortBy, setEpalSortBy] = useState<'DEFAULT' | 'ORDERS' | 'SCORE'>('DEFAULT');
  const [epalFilters, setEpalFilters] = useState({
    status: 'ALL' as 'ALL' | 'ONLINE',
    gender: 'ALL' as 'ALL' | 'Male' | 'Female',
    priceRange: [0, 100] as [number, number],
    server: 'ALL' as string,
    platform: 'ALL' as string,
    rank: 'ALL' as string,
  });
  const [showEpalFilterModal, setShowEpalFilterModal] = useState(false);
  const [showRankSelectorModal, setShowRankSelectorModal] = useState(false);
  const [showServerSelectorModal, setShowServerSelectorModal] = useState(false);
  const [showPlatformSelectorModal, setShowPlatformSelectorModal] = useState(false);
  const [isImSearchExpanded, setIsImSearchExpanded] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: '1', participantId: '1', lastMessage: 'Let\'s play tomorrow!', lastTimestamp: Date.now() - 1800000, unreadCount: 2 },
    { id: '2', participantId: '2', lastMessage: 'Nice sniper montage!', lastTimestamp: Date.now() - 3600000, unreadCount: 0 },
    { id: '3', participantId: '3', lastMessage: 'Looking for a duo?', lastTimestamp: Date.now() - 7200000, unreadCount: 1 },
  ]);
  const [imOrders, setImOrders] = useState<IMOrder[]>([
    { id: 'o1', epalId: '1', serviceName: 'League of Legends', status: 'PENDING', price: 15, timestamp: Date.now() - 86400000, unit: 'Game', unitPrice: 15, quantity: 1 },
    { id: 'o2', epalId: '3', serviceName: 'Valorant', status: 'COMPLETED', price: 24, timestamp: Date.now() - 172800000, endTime: Date.now() - 172800000 + 3600000, unit: 'Game', unitPrice: 12, quantity: 2 },
  ]);
  const [showOngoingOrderWarning, setShowOngoingOrderWarning] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([
    { id: 'm0', senderId: '1', receiverId: 'me', content: 'Long time no see!', timestamp: Date.now() - 86400000 * 2, type: 'text' }, // 2 days ago
    { id: 'm1', senderId: '1', receiverId: 'me', content: 'Hello!', timestamp: Date.now() - 3600000, type: 'text' },
    { id: 'm2', senderId: 'me', receiverId: '1', content: 'Hi there!', timestamp: Date.now() - 3500000, type: 'text' },
    { id: 'm3', senderId: '1', receiverId: 'me', content: 'Want to play?', timestamp: Date.now() - 3400000, type: 'text' },
    { id: 'm4', senderId: 'me', receiverId: '1', content: 'Sure, let\'s go!', timestamp: Date.now() - 60000, type: 'text' }, // 1 min ago
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<IMOrder | null>(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showImServiceCards, setShowImServiceCards] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTags, setReviewTags] = useState<string[]>([]);
  const [reviewFeedback, setReviewFeedback] = useState('');

  useEffect(() => {
    if (showPlaylinkModal && selectedPlaylinkId) {
      setTimeout(() => {
        const element = document.getElementById(`pl-card-${selectedPlaylinkId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        }
      }, 100);
    }
  }, [showPlaylinkModal, selectedPlaylinkId]);

  useEffect(() => {
    // Reset any service-related state if needed
    setShowServiceDetails(false);
  }, [activeServiceId]);

  const [orderTab, setOrderTab] = useState<'ALL' | 'PENDING' | 'ONGOING' | 'COMPLETED'>('ALL');
  const [userStatus, setUserStatus] = useState<'ONLINE' | 'OFFLINE' | 'PLAYING' | 'RESTING'>('ONLINE');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [viewHistory, setViewHistory] = useState<View[]>(['HOME']);
  const [contactsTab, setContactsTab] = useState<'FRIENDS' | 'FOLLOWING' | 'FOLLOWERS'>('FRIENDS');
  const [communityTab, setCommunityTab] = useState<'TRENDING' | 'LATEST' | 'FOLLOWING'>('TRENDING');
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [fullSearchQuery, setFullSearchQuery] = useState('');
  const [fullSearchResults, setFullSearchResults] = useState<EPal[]>([]);

  const [isScrolling, setIsScrolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followedEPals, setFollowedEPals] = useState<Set<string>>(new Set());
  const followersOfMe = useMemo(() => new Set(['1', '2', '3', '5']), []); // Mock users who follow me
  const mutualFollowers = useMemo(() => {
    return EPALS.filter(epal => followedEPals.has(epal.id) && followersOfMe.has(epal.id));
  }, [followedEPals, followersOfMe]);

  const filteredPosts = useMemo(() => {
    let posts = [...POSTS];
    if (selectedGame) {
      posts = posts.filter(post => post.gameId === selectedGame.id);
    }

    switch (communityTab) {
      case 'TRENDING':
        return posts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
      case 'LATEST':
        return posts.sort((a, b) => b.timestamp - a.timestamp);
      case 'FOLLOWING':
        return posts.filter(post => followedEPals.has(post.userId));
      default:
        return posts;
    }
  }, [communityTab, selectedGame, followedEPals]);

  const toggleFollow = (id: string) => {
    if (!requireAuthAction(t('auth.loginRequiredFeature'))) {
      return;
    }
    if (followedEPals.has(id)) {
      // Show confirmation modal
      const epal = EPALS.find(e => e.id === id);
      if (epal) {
        setEpalToUnfollow(epal);
        setShowUnfollowModal(true);
      }
      return;
    }

    setFollowedEPals(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const confirmUnfollow = () => {
    if (epalToUnfollow) {
      setFollowedEPals(prev => {
        const next = new Set(prev);
        next.delete(epalToUnfollow.id);
        return next;
      });
      setShowUnfollowModal(false);
      setEpalToUnfollow(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide after 1.5 seconds of no scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentView === 'HOME') {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, currentView]);

  const legendEPals = useMemo(() => EPALS.filter(e => e.isLegend).slice(0, 10), []);

  const navigateTo = (view: View, data?: any) => {
    const requiresAuth = PROTECTED_VIEWS.has(view) || (view === 'POST_DETAIL' && data?.focusInput);
    if (requiresAuth && !isAuthenticatedRef.current) {
      pendingNavigationRef.current = { view, data };
      openAuthModal(t('auth.loginRequiredFeature'));
      return;
    }

    // Reset focus state on every navigation unless explicitly requested for POST_DETAIL
    setFocusCommentInput(false);
    setShowImServiceCards(false);

    if (view !== 'IM') {
      setIsImSearchExpanded(false);
      setImSearchQuery('');
    }

    if (view === 'COMMUNITY') setSelectedGame(data || null);
    if (view === 'POST_DETAIL') {
      setSelectedPost(data.post);
      setFocusCommentInput(data.focusInput || false);
    }
    if (view === 'GAME_DETAIL') setSelectedGame(data);
    if (view === 'PROFILE') {
      setSelectedEPal(data);
      if (data.services && data.services.length > 0) {
        setActiveServiceId(data.services[0].id);
      } else {
        setActiveServiceId(null);
      }
    }
    if (view === 'ORDER_CONFIRM') {
      const epal = data?.epal || selectedEPal;
      if (epal) {
        const hasOngoingOrder = imOrders.some(order => 
          order.epalId === epal.id && 
          order.status !== 'COMPLETED' && 
          order.status !== 'CANCELLED'
        );
        if (hasOngoingOrder) {
          setShowOngoingOrderWarning(true);
          return;
        }
      }
      if (data?.epal) setSelectedEPal(data.epal);
      if (data?.variant) setSelectedVariant(data.variant);
      setOrderQuantity(1);
      setSelectedCoupon(null);
    }
    
    if (view === 'ALL_REVIEWS') {
      setSelectedEPal(data.epal);
      setReviewSortOrder('DEFAULT');
      setSelectedReviewTag(null);
      setSelectedRatingFilter(null);
      setShowReviewFilterModal(false);
    }

    if (view === 'IM_DETAIL') {
      setSelectedEPal(data);
      // Reset messages for the selected EPal (mock)
      setCurrentMessages([
        { id: 'm0', senderId: data.id, receiverId: 'me', content: 'Long time no see!', timestamp: Date.now() - 86400000 * 2, type: 'text' }, // 2 days ago
        { id: 'm1', senderId: data.id, receiverId: 'me', content: `Hello! I'm ${data.name}`, timestamp: Date.now() - 3600000, type: 'text' },
        { id: 'm2', senderId: 'me', receiverId: data.id, content: 'Hi there!', timestamp: Date.now() - 3500000, type: 'text' },
        { id: 'm3', senderId: data.id, receiverId: 'me', content: 'Want to play?', timestamp: Date.now() - 3400000, type: 'text' },
        { id: 'm4', senderId: 'me', receiverId: data.id, content: 'Sure, let\'s go!', timestamp: Date.now() - 60000, type: 'text' }, // 1 min ago
      ]);
    }
    
    if (view === 'HOME' || view === 'ME' || view === 'COMMUNITY' || view === 'IM') {
      setViewHistory([view]);
    } else {
      setViewHistory(prev => {
        // Don't push if it's the same as the current view
        if (prev[prev.length - 1] === view) return prev;
        return [...prev, view];
      });
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };


  const handleBack = () => {
    // Reset focus state when going back
    setFocusCommentInput(false);
    setShowImServiceCards(false);

    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
      window.scrollTo(0, 0);
    } else {
      setCurrentView('HOME');
      setViewHistory(['HOME']);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newItems = EPALS.filter(e => !e.isLegend).map(e => ({ ...e, id: Math.random().toString() }));
      setMoreEPals(prev => [...prev, ...newItems]);
      setLoadingMore(false);
    }, 1000);
  };

  const toggleFavorite = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const handlePlayToggle = (epalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingEPalId === epalId) {
      setPlayingEPalId(null);
    } else {
      setPlayingEPalId(epalId);
      // Auto stop after 5 seconds to simulate audio length
      setTimeout(() => {
        setPlayingEPalId(current => current === epalId ? null : current);
      }, 5000);
    }
  };

  const allSortedGames = useMemo(() => {
    return [...GAMES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);


  // Filter EPals for the Chilling tab
  const favoritedGames = useMemo(() => {
    return allSortedGames.filter(g => favorites.includes(g.id));
  }, [allSortedGames, favorites]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      const headerOffset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const groupedGames = useMemo<{ [key: string]: Game[] } | null>(() => {
    if (selectedCategory !== 'GAMES') return null;
    const groups: { [key: string]: Game[] } = {};
    GAMES.filter(g => 
      g.category === 'GAMES' && 
      (searchQuery === '' || g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).forEach(game => {
      const letter = game.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(game);
    });
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {} as { [key: string]: Game[] });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f071a] text-white font-sans selection:bg-purple-500/30">
      {/* Header */}
      {['HOME', 'COMMUNITY', 'IM', 'ME', 'COMMUNITY_SELECTOR'].includes(currentView) && (
        <header className="sticky top-0 z-50 bg-[#0f071a]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          {currentView === 'HOME' ? (
            <>
              <div className="flex-1 max-w-xs">
                <button 
                  onClick={() => setShowFullSearch(true)}
                  className="w-full flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 hover:border-purple-500/50 transition-all text-left"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{t('home.search')}</span>
                </button>
              </div>
              <button className="ml-4 p-2 text-purple-400 hover:bg-purple-500/10 rounded-full transition-colors">
                <Gift className="w-6 h-6" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 w-full">
              {viewHistory.length > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className={`text-lg font-bold flex-1 min-w-0 ${viewHistory.length === 1 ? 'text-center' : ''}`}>
                 {currentView === 'COMMUNITY' ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
                      <button
                        onClick={() => setSelectedGame(null)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                          selectedGame === null ? 'bg-purple-600 text-white' : 'text-gray-400'
                        }`}
                      >
                        {t('orders.tabAll')}
                      </button>
                      {GAMES.slice(0, 4).map(game => (
                        <button
                          key={game.id}
                          onClick={() => setSelectedGame(game)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            selectedGame?.id === game.id ? 'bg-purple-600 text-white' : 'text-gray-400'
                          }`}
                        >
                          {game.name}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => navigateTo('COMMUNITY_SELECTOR')}
                      className="p-1.5 bg-white/5 rounded-full text-gray-400 shrink-0 ml-2"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ) : currentView === 'IM' ? (
                  <div className="flex items-center justify-between w-full">
                    <span>{t('nav.im')}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowFullSearch(true)} className="p-2 hover:bg-white/10 rounded-full">
                        <Search className="w-5 h-5" />
                      </button>
                      <button onClick={() => navigateTo('CONTACTS')} className="p-2 hover:bg-white/10 rounded-full">
                        <Users className="w-5 h-5" />
                      </button>
                      <button onClick={() => navigateTo('NOTIFICATIONS')} className="p-2 hover:bg-white/10 rounded-full">
                        <Bell className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : currentView === 'ME' ? (
                  t('nav.me')
                ) : currentView === 'COMMUNITY_SELECTOR' ? (
                  t('community.selectTitle')
                ) : null}
              </h2>
            </div>
          )}
        </header>
      )}

      <main className="pb-32">
        {/* Full-screen Search Modal */}
      <AnimatePresence>
        {showFullSearch && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-[#0f071a] flex flex-col"
          >
            {/* Search Header */}
            <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5">
              <button 
                onClick={() => {
                  setShowFullSearch(false);
                  setFullSearchQuery('');
                  setFullSearchResults([]);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t('search.placeholderByIdOrName')}
                  value={fullSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setFullSearchQuery(query);
                    if (query.trim()) {
                      const results = EPALS.filter(epal => 
                        epal.id.toLowerCase().includes(query.toLowerCase()) || 
                        epal.name.toLowerCase().includes(query.toLowerCase())
                      );
                      setFullSearchResults(results);
                    } else {
                      setFullSearchResults([]);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-6 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {fullSearchQuery.trim() === '' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Search className="w-10 h-10 text-gray-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold">{t('search.forEpalsTitle')}</p>
                    <p className="text-xs text-gray-600">{t('search.forEpalsSubtitle')}</p>
                  </div>
                </div>
              ) : fullSearchResults.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <p className="text-gray-500 font-bold">{t('search.noResultsForQuery', { query: fullSearchQuery })}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('search.resultsHeading')}</p>
                  <div className="space-y-4">
                    {fullSearchResults.map(epal => {
                      const session = currentView === 'IM' ? chatSessions.find(s => s.participantId === epal.id) : null;
                      
                      return (
                          <div 
                            key={epal.id}
                            onClick={() => {
                              setShowFullSearch(false);
                              if (currentView === 'IM') {
                                navigateTo('IM_DETAIL', epal);
                              } else {
                                navigateTo('PROFILE', epal);
                              }
                            }}
                            className="flex items-center gap-4 p-2 hover:bg-white/5 transition-all cursor-pointer rounded-xl"
                          >
                            <img src={epal.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white truncate">{epal.name}</h4>
                              {session ? (
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                  <p className="text-[11px] text-gray-500 truncate flex-1">{session.lastMessage}</p>
                                  <span className="text-[9px] text-gray-700 shrink-0">{formatChatMessageTime(session.lastTimestamp)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-gray-500 font-mono">
                                    {t('search.epalIdPrefix')} {epal.id}
                                  </span>
                                  <span className="text-gray-700 text-[10px]">•</span>
                                  <span className="text-[10px] text-purple-400 font-bold">{epal.game}</span>
                                </div>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                          </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
          {currentView === 'HOME' && (
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
          )}

          {currentView === 'COMMUNITY_SELECTOR' && (
            <motion.div
              key="community_selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 pt-6 pb-24"
            >
              <div className="space-y-8">
                {Object.entries(
                  GAMES.reduce((acc, game) => {
                    const letter = game.name[0].toUpperCase();
                    if (!acc[letter]) acc[letter] = [];
                    acc[letter].push(game);
                    return acc;
                  }, {} as { [key: string]: Game[] })
                ).sort(([a], [b]) => a.localeCompare(b)).map(([letter, games]) => (
                  <div key={letter} className="space-y-4">
                    <div className="text-purple-400 font-bold text-lg border-b border-white/10 pb-2">{letter}</div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                      {games.sort((a, b) => a.name.localeCompare(b.name)).map(game => (
                        <button
                          key={game.id}
                          onClick={() => {
                            setSelectedGame(game);
                            navigateTo('COMMUNITY');
                          }}
                          className="flex flex-col gap-2 transition-all text-center group"
                        >
                          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/5">
                            <img 
                              src={game.imageUrl} 
                              alt={game.name} 
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="font-bold text-white text-[11px] truncate px-1">{game.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'COMMUNITY' && (
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
          )}

          {currentView === 'CATEGORY_SERVICES' && (
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
          )}

          {currentView === 'POST_DETAIL' && selectedPost && (
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
          )}

          {currentView === 'LEGEND_LIST' && (
            <motion.div 
              key="legend_list"
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
                <h2 className="text-lg font-bold">Legend EPals</h2>
              </div>

              <div className="px-6 grid grid-cols-2 gap-4">
                {EPALS.filter(e => e.isLegend).map(epal => (
                  <LegendEPalCard 
                    key={epal.id} 
                    epal={epal} 
                    onProfileClick={() => navigateTo('PROFILE', epal)}
                    isPlaying={playingEPalId === epal.id}
                    onPlayToggle={(e) => handlePlayToggle(epal.id, e)}
                    variant="stacked"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'GAME_DETAIL' && (
            <motion.div 
              key="game_detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="min-h-screen pb-32"
            >
              <div className="relative h-[35vh] w-full">
                <img 
                  src={selectedGame?.imageUrl} 
                  alt={selectedGame?.name} 
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

                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">{selectedGame?.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-purple-400 font-bold text-sm tracking-widest drop-shadow-md">{selectedGame?.onlineCount} Online</p>
                  </div>
                </div>
              </div>

              <div className="px-6 mt-6 space-y-4">
                {/* Sort & Filter Controls */}
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { id: 'DEFAULT', label: 'Default' },
                      { id: 'ORDERS', label: 'Orders' },
                      { id: 'SCORE', label: 'Score' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setEpalSortBy(option.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          epalSortBy === option.id 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowEpalFilterModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      Object.values(epalFilters).some(v => v !== 'ALL' && !Array.isArray(v)) || epalFilters.priceRange[0] !== 0 || epalFilters.priceRange[1] !== 100
                        ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                  </button>
                </div>

                {(() => {
                  const filteredEpals = EPALS
                    .filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''))
                    .filter(e => {
                      if (epalFilters.status === 'ONLINE' && e.onlineStatus !== 'Online') return false;
                      if (epalFilters.gender !== 'ALL' && e.gender !== epalFilters.gender) return false;
                      if (e.price < epalFilters.priceRange[0] || e.price > epalFilters.priceRange[1]) return false;
                      
                      // For Server, Platform, Rank, we check playlinks
                      if (epalFilters.server !== 'ALL' || epalFilters.platform !== 'ALL' || epalFilters.rank !== 'ALL') {
                        const matchingPlaylink = e.playlinks?.find(pl => 
                          pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || '')
                        );
                        if (!matchingPlaylink) return false;
                        if (epalFilters.server !== 'ALL' && matchingPlaylink.server !== epalFilters.server) return false;
                        if (epalFilters.platform !== 'ALL' && matchingPlaylink.platform !== epalFilters.platform) return false;
                        if (epalFilters.rank !== 'ALL' && matchingPlaylink.rank !== epalFilters.rank) return false;
                      }
                      
                      return true;
                    })
                    .sort((a, b) => {
                      if (epalSortBy === 'ORDERS') {
                        const aOrders = parseFloat(a.orderCount.replace('k', '')) * (a.orderCount.includes('k') ? 1000 : 1);
                        const bOrders = parseFloat(b.orderCount.replace('k', '')) * (b.orderCount.includes('k') ? 1000 : 1);
                        return bOrders - aOrders;
                      }
                      if (epalSortBy === 'SCORE') return b.rating - a.rating;
                      return 0; // Default
                    });

                  if (filteredEpals.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                        <Search className="w-12 h-12 opacity-20" />
                        <p className="font-bold">No EPals found with these filters</p>
                        <button 
                          onClick={() => setEpalFilters({
                            status: 'ALL',
                            gender: 'ALL',
                            priceRange: [0, 100],
                            server: 'ALL',
                            platform: 'ALL',
                            rank: 'ALL',
                          })}
                          className="text-purple-400 font-bold text-sm"
                        >
                          Reset Filters
                        </button>
                      </div>
                    );
                  }

                  return filteredEpals.map(epal => {
                    const playlink = epal.playlinks?.find(pl => 
                      pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || '')
                    );
                    
                    let badgeText = undefined;
                    if (selectedGame?.category !== 'CHILLING') {
                      if (epalFilters.rank !== 'ALL') badgeText = playlink?.rank;
                      else if (epalFilters.server !== 'ALL') badgeText = playlink?.server;
                      else if (epalFilters.platform !== 'ALL') badgeText = playlink?.platform;
                      else badgeText = playlink?.rank || playlink?.role || playlink?.server;
                    }

                    return (
                      <EPalCard 
                        key={epal.id} 
                        epal={epal} 
                        onProfileClick={() => navigateTo('PROFILE', epal)}
                        onOrderClick={() => navigateTo('ORDER_CONFIRM', { epal })}
                        isPlaying={playingEPalId === epal.id}
                        onPlayToggle={(e) => handlePlayToggle(epal.id, e)}
                        badgeText={badgeText}
                      />
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {currentView === 'PROFILE' && selectedEPal && (
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
          )}

          {currentView === 'ALL_REVIEWS' && selectedEPal && (
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
          )}

          {currentView === 'IM' && (
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
          )}

          {currentView === 'CONTACTS' && (
            <motion.div 
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 pt-6 px-6 space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">{t('contacts.title')}</h1>
              </div>

              {/* Contacts Tabs */}
              <div className="flex items-center border-b border-white/5">
                {[
                  { id: 'FRIENDS', label: t('contacts.tabFriends') },
                  { id: 'FOLLOWING', label: t('contacts.tabFollowing') },
                  { id: 'FOLLOWERS', label: t('contacts.tabFollowers') },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setContactsTab(tab.id as any)}
                    className={`flex-1 text-center pb-3 text-sm font-bold transition-all relative ${
                      contactsTab === tab.id ? 'text-purple-400' : 'text-gray-500'
                    }`}
                  >
                    {tab.label}
                    {contactsTab === tab.id && (
                      <motion.div 
                        layoutId="contactsTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {(() => {
                  const filteredList = contactsTab === 'FRIENDS' 
                    ? mutualFollowers 
                    : contactsTab === 'FOLLOWING'
                    ? EPALS.filter(e => followedEPals.has(e.id))
                    : EPALS.filter(e => followersOfMe.has(e.id));

                  if (filteredList.length === 0) {
                    return (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                          <Users className="w-8 h-8 text-gray-700" />
                        </div>
                        <p className="text-gray-500 font-bold">
                          {contactsTab === 'FRIENDS'
                            ? t('contacts.emptyFriends')
                            : contactsTab === 'FOLLOWING'
                              ? t('contacts.emptyFollowing')
                              : t('contacts.emptyFollowers')}
                        </p>
                      </div>
                    );
                  }

                  return filteredList.map(epal => (
                    <div 
                      key={epal.id} 
                      onClick={() => navigateTo('IM_DETAIL', epal)}
                      className="flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer p-2 -mx-2 rounded-xl"
                    >
                      <img src={epal.avatarUrl} className="w-14 h-14 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{epal.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{epal.game}</p>
                      </div>
                      {contactsTab === 'FRIENDS' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                          <CheckCircle2 className="w-3 h-3 text-purple-400" />
                          <span className="text-[10px] font-bold text-purple-400 uppercase">{t('contacts.mutual')}</span>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          )}

          {currentView === 'IM_DETAIL' && selectedEPal && (
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
          )}

          {currentView === 'ME' && (
            <motion.div 
              key="me"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a]"
            >
              {!isAuthenticated ? (
                <div className="px-6 pt-10 space-y-6">
                  <GlassCard className="p-8 space-y-5 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white">{t('auth.welcomeTitle')}</h2>
                      <p className="text-sm text-gray-400">{t('auth.welcomeBody')}</p>
                    </div>
                    <div className="grid gap-3">
                      <button
                        onClick={() => openAuthModal(t('auth.loginRequired'))}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                      >
                        {t('auth.goToLogin')}
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('REGISTER');
                          setAuthStatus(t('auth.registerPrompt'));
                          setShowAuthModal(true);
                        }}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-bold"
                      >
                        {t('auth.register')}
                      </button>
                    </div>
                  </GlassCard>
                </div>
              ) : (
              <div className="px-6 pt-8 space-y-4 relative z-10">
                {/* User Info Card */}
                <div className="flex items-center gap-4 px-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[28px] border-4 border-[#0f071a] overflow-hidden shadow-2xl">
                      <img src={EPALS[0].avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-black text-white truncate">Sogeryou</h1>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">ID: 88886666</span>
                        <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowStatusModal(true)}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border ${
                          userStatus === 'ONLINE' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                          userStatus === 'PLAYING' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                          userStatus === 'RESTING' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/10 border-gray-500/20 text-gray-400'
                        }`}
                      >
                        <div className={`w-1 h-1 rounded-full ${
                          userStatus === 'ONLINE' ? 'bg-green-400' :
                          userStatus === 'PLAYING' ? 'bg-blue-400' :
                          userStatus === 'RESTING' ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`} />
                        {userStatus}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <GlassCard 
                  className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30 overflow-hidden relative group cursor-pointer" 
                  onClick={() => navigateTo('WALLET')}
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{t('me.walletBalance')}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <CoinIcon className="w-6 h-6" />
                          <span className="text-3xl font-black text-white tracking-tight">{wallet?.balance ?? 0}</span>
                        </div>
                        {userRole === 'PLAYER' && (
                          <>
                            <div className="w-px h-8 bg-white/10 mx-2" />
                            <div className="flex items-center gap-2">
                              <Gem className="w-6 h-6 text-purple-400" />
                              <span className="text-3xl font-black text-white tracking-tight">{userDiamonds}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>

                {/* Companion Ranking */}
                <GlassCard className="p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <p className="text-sm font-black text-white uppercase tracking-widest">{t('ranking.title')}</p>
                    </div>
                    {rankingsLoading && <span className="text-[10px] text-gray-400">{t('ranking.refreshing')}</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { id: 'SCORE', label: t('ranking.byScore') },
                      { id: 'RATING', label: t('ranking.byRating') },
                      { id: 'COMPLETED', label: t('ranking.byCompleted') }
                    ].map(sort => (
                      <button
                        key={sort.id}
                        onClick={() => setRankingSortBy(sort.id as 'SCORE' | 'RATING' | 'COMPLETED')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition-all ${
                          rankingSortBy === sort.id
                            ? 'bg-purple-600/30 border-purple-400/40 text-purple-200'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                  {rankingsError ? (
                    <p className="text-xs text-red-300">{rankingsError}</p>
                  ) : sortedRankings.length === 0 ? (
                    <p className="text-xs text-gray-400">{t('ranking.noData')}</p>
                  ) : (
                    <div className="space-y-2">
                      {sortedRankings.slice(0, 5).map(item => (
                        <div key={item.companionId} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">#{item.rank} {item.gameName}</p>
                            <p className="text-[10px] text-gray-400">
                              {t('ranking.scoreLine', {
                                score: item.rankingScore.toFixed(2),
                                poolTag: item.poolTag,
                                completed: item.completedOrderCount
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-purple-300">★ {item.avgRating.toFixed(2)}</p>
                            <p className="text-[10px] text-gray-500">{t('ranking.completionRate', { rate: Math.round(item.completionRate * 100) })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setShowRankingModal(true)}
                    className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 py-2 text-xs font-bold text-gray-200 hover:bg-white/10 transition-all"
                  >
                    {t('ranking.viewTop10')}
                  </button>
                </GlassCard>

                {/* Main Menu */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">{t('me.accountManagement')}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => navigateTo('MY_ORDERS')}
                      className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 active:scale-[0.99] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white">{t('me.myOrders')}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{t('me.myOrdersSubtitle')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {userRole === 'PLAYER' ? (
                      <>
                        <button 
                          onClick={() => navigateTo('PLAYER_PROFILE_EDIT')}
                          className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 active:scale-[0.99] transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                              <Store className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-white">{t('me.playerProfile')}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{t('me.playerProfileSubtitle')}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isPlayerOnline ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                              <div className={`w-2.5 h-2.5 rounded-full ${isPlayerOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-white">{t('me.onlineStatus')}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{isPlayerOnline ? t('me.onlineVisible') : t('me.onlineHidden')}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsPlayerOnline(!isPlayerOnline)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isPlayerOnline ? 'bg-purple-600' : 'bg-white/10'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isPlayerOnline ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigateTo('APPLY_PLAYER')}
                        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-600/20 to-transparent rounded-[24px] border border-purple-500/30 hover:bg-purple-600/20 active:scale-[0.99] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Zap className="w-6 h-6 fill-current" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white">{t('me.becomePlayer')}</p>
                            <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{t('me.earnDiamonds')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Secondary Menu */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 mb-4">{t('me.supportSecurity')}</p>
                  <div className="space-y-1">
                    {[
                      { icon: Settings, label: t('me.menuSettings'), color: 'text-gray-400', action: () => navigateTo('SETTINGS') },
                      { icon: ShieldCheck, label: t('me.menuAccountSecurity'), color: 'text-green-400' },
                      { icon: HelpCircle, label: t('me.menuHelp'), color: 'text-blue-400' },
                      { icon: Smile, label: t('me.menuGuidelines'), color: 'text-yellow-400' },
                    ].map((item) => (
                      <button 
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span className="font-bold text-gray-300">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              )}

              {/* Status Selection Modal */}
              <AnimatePresence>
                {showStatusModal && (
                  <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-12">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowStatusModal(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      className="w-full max-w-md bg-[#1a1225] rounded-[32px] p-6 relative z-10 border border-white/10 shadow-2xl"
                    >
                      <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
                      <h3 className="text-lg font-bold text-white mb-6 text-center">{t('me.adjustStatus')}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { id: 'ONLINE', label: t('me.statusOnline'), color: 'bg-green-500', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
                          { id: 'OFFLINE', label: t('me.statusOffline'), color: 'bg-gray-500', icon: <div className="w-2 h-2 rounded-full bg-gray-500" /> },
                          { id: 'PLAYING', label: t('me.statusPlaying'), color: 'bg-blue-500', icon: <div className="w-2 h-2 rounded-full bg-blue-500" /> },
                          { id: 'RESTING', label: t('me.statusResting'), color: 'bg-yellow-500', icon: <div className="w-2 h-2 rounded-full bg-yellow-500" /> },
                        ].map((status) => (
                          <button
                            key={status.id}
                            onClick={() => {
                              setUserStatus(status.id as any);
                              setShowStatusModal(false);
                            }}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              userStatus === status.id 
                                ? 'bg-purple-600/20 border-purple-500/50 text-white' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {status.icon}
                              <span className="font-bold">{status.label}</span>
                            </div>
                            {userStatus === status.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={() => setShowStatusModal(false)}
                        className="w-full py-4 mt-6 bg-white/5 rounded-2xl text-sm font-bold text-gray-400 hover:bg-white/10 transition-all"
                      >
                        {t('me.cancel')}
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentView === 'MY_ORDERS' && (
            <motion.div 
              key="my_orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-6"
            >
              <div className="flex items-center justify-between relative">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10 relative z-10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">{t('me.myOrders')}</h1>
                <div className="w-10" />
              </div>

              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                {(
                  [
                    { id: 'ALL', label: t('orders.tabAll') },
                    { id: 'PENDING', label: t('orders.tabPending') },
                    { id: 'ONGOING', label: t('orders.tabOngoing') },
                    { id: 'COMPLETED', label: t('orders.tabCompleted') }
                  ] as const
                ).map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setOrderTab(tab.id as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      orderTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {imOrders.filter(o => orderTab === 'ALL' || o.status === orderTab).length > 0 ? (
                  imOrders.filter(o => orderTab === 'ALL' || o.status === orderTab).map((order) => {
                    const epal = EPALS.find(e => e.id === order.epalId);
                    return (
                      <div key={order.id} className="p-5 bg-white/5 rounded-[24px] border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-bold text-white text-lg">{order.serviceName || order.gameName}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{order.createTime || new Date(order.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                            order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <CoinIcon className="w-4 h-4" />
                            <span className="font-black text-white text-xl">{order.totalPrice || order.price}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetailModal(true);
                              }}
                              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                              Details
                            </button>
                            {order.status === 'COMPLETED' && !order.reviewed && (
                              <button 
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setReviewRating(5);
                                  setReviewTags([]);
                                  setReviewFeedback('');
                                  setShowReviewModal(true);
                                }}
                                className="px-4 py-2 bg-purple-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
                              >
                                Rate
                              </button>
                            )}
                            {(order.status === 'PENDING' || order.status === 'ONGOING') && (
                              <button 
                                onClick={() => epal && navigateTo('IM_DETAIL', epal)}
                                className="px-5 py-2 bg-purple-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 transition-all flex items-center gap-2"
                              >
                                <MessageCircle className="w-3 h-3" />
                                Chat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-40">
                    <FileText className="w-16 h-16" />
                    <p className="font-bold">No orders found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'RECHARGE' && (
            <motion.div 
              key="recharge"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32"
            >
              <RechargeView 
                packages={rechargePackages}
                onSelect={handleRecharge}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentView === 'WITHDRAW' && (
            <motion.div 
              key="withdraw"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Withdraw Diamonds</h1>
              </div>

              <GlassCard className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Available Balance</p>
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-2xl font-black text-white">{userDiamonds}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Estimated Value</p>
                  <p className="text-lg font-bold text-green-400">${userDiamonds.toFixed(2)}</p>
                </div>
              </GlassCard>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Withdraw Amount</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="Min. 50 Diamonds"
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                    />
                    <button className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400 hover:text-purple-300">MAX</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">USDT (TRC-20) Address</p>
                  <input 
                    type="text" 
                    placeholder="Enter your wallet address"
                    className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-[10px] text-yellow-500/80 leading-relaxed font-medium">
                    Withdrawals are processed manually by admins. Please allow up to 24 hours for the funds to arrive in your wallet.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert('Withdrawal request submitted! Please wait for admin approval.');
                  handleBack();
                }}
                className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Confirm Withdrawal
              </button>
            </motion.div>
          )}

          {currentView === 'APPLY_PLAYER' && (
            <motion.div 
              key="apply_player"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen bg-[#0f071a] flex flex-col"
            >
              <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-40">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (playerApplicationStep > 1) {
                        setPlayerApplicationStep(prev => prev - 1);
                      } else {
                        handleBack();
                      }
                    }} 
                    className="p-2 bg-white/5 rounded-xl border border-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold">{t('me.becomePlayer')}</h1>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">{t('apply.stepOf', { current: playerApplicationStep, total: 4 })}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        step <= playerApplicationStep ? 'bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                {playerApplicationStatus === 'PENDING' ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-6 text-center">
                    <div className="w-24 h-24 rounded-[40px] bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                      <History className="w-12 h-12 text-purple-400 animate-spin-slow" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white">{t('apply.pendingTitle')}</h2>
                      <p className="text-sm text-gray-500 max-w-[280px] mx-auto">{t('apply.pendingBody')}</p>
                    </div>
                    <button 
                      onClick={handleBack}
                      className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 transition-all"
                    >
                      {t('apply.backToProfile')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Step 1: Select Category */}
                    {playerApplicationStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">{t('apply.chooseGameTitle')}</h2>
                          <p className="text-sm text-gray-500">{t('apply.chooseGameSubtitle')}</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input 
                            type="text"
                            placeholder={t('apply.searchGamesPlaceholder')}
                            value={applyGameSearchQuery}
                            onChange={(e) => setApplyGameSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                          />
                        </div>

                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                          {[
                            { id: 'GAMES', label: t('apply.tabGames') },
                            { id: 'CHILLING', label: t('apply.tabChill') }
                          ].map((tab) => (
                            <button 
                              key={tab.id}
                              onClick={() => setSelectedApplyGameCategory(tab.id)}
                              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedApplyGameCategory === tab.id ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-8">
                          {Object.entries(
                            GAMES
                              .filter(game => 
                                game.category === selectedApplyGameCategory && 
                                game.name.toLowerCase().includes(applyGameSearchQuery.toLowerCase())
                              )
                              .reduce((acc, game) => {
                                const firstLetter = game.name[0].toUpperCase();
                                if (!acc[firstLetter]) acc[firstLetter] = [];
                                acc[firstLetter].push(game);
                                return acc;
                              }, {} as Record<string, Game[]>)
                          )
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([letter, games]) => (
                            <div key={letter} className="space-y-2">
                              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest px-2">{letter}</p>
                              <div className="space-y-1">
                                {games.sort((a, b) => a.name.localeCompare(b.name)).map(game => (
                                  <button
                                    key={game.id}
                                    onClick={() => {
                                      setPlayerApplicationData(prev => ({ ...prev, gameId: game.id }));
                                    }}
                                    className={`w-full py-4 px-4 flex items-center gap-4 rounded-2xl border transition-all group ${
                                      playerApplicationData.gameId === game.id 
                                        ? 'bg-purple-600/20 border-purple-500/50' 
                                        : 'bg-transparent border-transparent hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl shrink-0">
                                      <img src={game.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1 text-left">
                                      <p className={`text-base font-bold transition-colors ${
                                        playerApplicationData.gameId === game.id ? 'text-white' : 'text-gray-300'
                                      }`}>{game.name}</p>
                                    </div>
                                    {playerApplicationData.gameId === game.id && (
                                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Configuration */}
                    {playerApplicationStep === 2 && (
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">{t('apply.gameConfigTitle')}</h2>
                          <p className="text-sm text-gray-500">
                            {t('apply.gameConfigSubtitle', {
                              gameName: GAMES.find(g => g.id === playerApplicationData.gameId)?.name ?? ''
                            })}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {GAMES.find(g => g.id === playerApplicationData.gameId)?.hasRank && (
                            <button 
                              onClick={() => setShowApplySelectionModal({
                                show: true,
                                type: 'RANK',
                                title: t('apply.modalRankTitle'),
                                options: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master']
                              })}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
                            >
                              <div className="text-left">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('apply.fieldRank')}</p>
                                <p className={`text-sm font-bold ${playerApplicationData.rank ? 'text-white' : 'text-gray-600'}`}>
                                  {playerApplicationData.rank || t('apply.selectRank')}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}

                          {GAMES.find(g => g.id === playerApplicationData.gameId)?.hasMain && (
                            <button 
                              onClick={() => setShowApplySelectionModal({
                                show: true,
                                type: 'MAIN',
                                title: t('apply.modalPositionTitle'),
                                options: ['Top', 'Jungle', 'Mid', 'ADC', 'Support']
                              })}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
                            >
                              <div className="text-left">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('apply.fieldMainPosition')}</p>
                                <p className={`text-sm font-bold ${playerApplicationData.mainPosition ? 'text-white' : 'text-gray-600'}`}>
                                  {playerApplicationData.mainPosition || t('apply.selectPosition')}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}

                          {GAMES.find(g => g.id === playerApplicationData.gameId)?.hasServer && (
                            <button 
                              onClick={() => setShowApplySelectionModal({
                                show: true,
                                type: 'SERVER',
                                title: t('apply.modalServerTitle'),
                                options: ['NA', 'EUW', 'EUNE', 'SEA', 'KR', 'JP']
                              })}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
                            >
                              <div className="text-left">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('apply.fieldServer')}</p>
                                <p className={`text-sm font-bold ${playerApplicationData.server ? 'text-white' : 'text-gray-600'}`}>
                                  {playerApplicationData.server || t('apply.selectServer')}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}

                          {GAMES.find(g => g.id === playerApplicationData.gameId)?.hasPlatform && (
                            <button 
                              onClick={() => setShowApplySelectionModal({
                                show: true,
                                type: 'PLATFORM',
                                title: t('apply.modalPlatformTitle'),
                                options: ['PC', 'PS4/5', 'Xbox', 'Mobile', 'Switch']
                              })}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
                            >
                              <div className="text-left">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{t('apply.fieldPlatform')}</p>
                                <p className={`text-sm font-bold ${playerApplicationData.platform ? 'text-white' : 'text-gray-600'}`}>
                                  {playerApplicationData.platform || t('apply.selectPlatform')}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.fieldStyle')}</p>
                            <input 
                              type="text"
                              placeholder={t('apply.stylePlaceholder')}
                              value={playerApplicationData.style}
                              onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, style: e.target.value }))}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.fieldIntro')}</p>
                            <textarea 
                              placeholder={t('apply.introPlaceholder')}
                              rows={4}
                              value={playerApplicationData.intro}
                              onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, intro: e.target.value }))}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all resize-none"
                            />
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.fieldScreenshot')}</p>
                            <div className="space-y-3">
                              {playerApplicationData.screenshots.length > 0 ? (
                                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                                  <img src={playerApplicationData.screenshots[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <button 
                                    onClick={() => setPlayerApplicationData(prev => ({ ...prev, screenshots: [] }))}
                                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-xl text-white backdrop-blur-md"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setPlayerApplicationData(prev => ({ ...prev, screenshots: ['https://picsum.photos/seed/' + Math.random() + '/1280/720'] }))}
                                  className="w-full aspect-video rounded-2xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-gray-500 hover:bg-white/10 transition-all"
                                >
                                  <Camera className="w-8 h-8" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{t('apply.addScreenshot')}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Voice & Cover */}
                    {playerApplicationStep === 3 && (
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">{t('apply.step3Title')}</h2>
                          <p className="text-sm text-gray-500">{t('apply.step3Subtitle')}</p>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.voiceRecording')}</p>
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col items-center gap-6">
                              <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center relative">
                                {isRecording && (
                                  <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20" />
                                )}
                                <Mic2 className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-purple-400'}`} />
                              </div>
                              
                              <div className="text-center space-y-1">
                                {isRecording ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl font-black text-white tabular-nums">
                                      0:{recordingTime.toString().padStart(2, '0')}
                                    </span>
                                    <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map(i => (
                                        <motion.div
                                          key={i}
                                          animate={{ height: [4, 12, 4] }}
                                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                          className="w-1 bg-purple-500 rounded-full"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm font-bold text-white">
                                      {playerApplicationData.voiceUrl ? t('apply.voiceRecorded') : t('apply.voiceRecordPrompt')}
                                    </p>
                                    <p className="text-[10px] text-gray-500">{t('apply.voiceMaxSeconds')}</p>
                                  </>
                                )}
                              </div>

                              <div className="flex flex-col w-full gap-3">
                                {!isRecording && !playerApplicationData.voiceUrl && (
                                  <button 
                                    onClick={() => {
                                      setIsRecording(true);
                                      setRecordingTime(0);
                                      const timer = setInterval(() => {
                                        setRecordingTime(prev => {
                                          if (prev >= 30) {
                                            clearInterval(timer);
                                            setIsRecording(false);
                                            setPlayerApplicationData(p => ({ ...p, voiceUrl: 'https://example.com/voice.mp3' }));
                                            return 30;
                                          }
                                          return prev + 1;
                                        });
                                      }, 1000);
                                      (window as any).recordingTimer = timer;
                                    }}
                                    className="w-full py-4 bg-purple-600 rounded-2xl font-black text-white text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                  >
                                    {t('apply.startRecording')}
                                  </button>
                                )}

                                {isRecording && (
                                  <div className="flex gap-3">
                                    <button 
                                      onClick={() => {
                                        clearInterval((window as any).recordingTimer);
                                        setIsRecording(false);
                                        setRecordingTime(0);
                                      }}
                                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                      {t('me.cancel')}
                                    </button>
                                    <button 
                                      onClick={() => {
                                        clearInterval((window as any).recordingTimer);
                                        setIsRecording(false);
                                        setPlayerApplicationData(p => ({ ...p, voiceUrl: 'https://example.com/voice.mp3' }));
                                      }}
                                      className="flex-1 py-4 bg-green-600 rounded-2xl font-black text-white text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                    >
                                      {t('apply.done')}
                                    </button>
                                  </div>
                                )}

                                {!isRecording && playerApplicationData.voiceUrl && (
                                  <div className="flex gap-3">
                                    <button 
                                      onClick={() => {
                                        setPlayerApplicationData(p => ({ ...p, voiceUrl: '' }));
                                        setIsRecording(true);
                                        setRecordingTime(0);
                                        const timer = setInterval(() => {
                                          setRecordingTime(prev => {
                                            if (prev >= 30) {
                                              clearInterval(timer);
                                              setIsRecording(false);
                                              setPlayerApplicationData(p => ({ ...p, voiceUrl: 'https://example.com/voice.mp3' }));
                                              return 30;
                                            }
                                            return prev + 1;
                                          });
                                        }, 1000);
                                        (window as any).recordingTimer = timer;
                                      }}
                                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-purple-400 text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                      {t('apply.reRecord')}
                                    </button>
                                    <div className="flex-1 py-4 bg-green-600/20 border border-green-500/30 rounded-2xl flex items-center justify-center gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">{t('apply.saved')}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.coverImage')}</p>
                            <button 
                              onClick={() => setPlayerApplicationData(prev => ({ ...prev, coverUrl: 'https://picsum.photos/seed/cover/800/1200' }))}
                              className="w-full aspect-[3/4] bg-white/5 border border-dashed border-white/20 rounded-[32px] overflow-hidden flex flex-col items-center justify-center gap-3 group relative"
                            >
                              {playerApplicationData.coverUrl ? (
                                <>
                                  <img src={playerApplicationData.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-white" />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-gray-500" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-bold text-white">{t('apply.uploadCover')}</p>
                                    <p className="text-[10px] text-gray-500">{t('apply.coverPortraitHint')}</p>
                                  </div>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.coverIntro')}</p>
                            <input 
                              type="text"
                              placeholder={t('apply.coverIntroPlaceholder')}
                              value={playerApplicationData.coverIntro}
                              onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, coverIntro: e.target.value }))}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Service & Promotion */}
                    {playerApplicationStep === 4 && (
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">{t('apply.step4Title')}</h2>
                          <p className="text-sm text-gray-500">{t('apply.step4Subtitle')}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.serviceName')}</p>
                            <input 
                              type="text"
                              placeholder={t('apply.serviceNamePlaceholder')}
                              value={playerApplicationData.serviceName}
                              onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, serviceName: e.target.value }))}
                              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.priceCoins')}</p>
                              <input 
                                type="number"
                                placeholder="0"
                                value={playerApplicationData.price || ''}
                                onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                              />
                            </div>
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">{t('apply.unitLabel')}</p>
                              <select 
                                value={playerApplicationData.unit}
                                onChange={(e) => setPlayerApplicationData(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all appearance-none"
                              >
                                <option value="Game">{t('apply.unitPerGame')}</option>
                                <option value="Hour">{t('apply.unitPerHour')}</option>
                                <option value="Round">{t('apply.unitPerRound')}</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between px-2">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Promotion (Optional)</p>
                              <button 
                                onClick={() => setPlayerApplicationData(prev => ({ 
                                  ...prev, 
                                  promotion: { ...prev.promotion, type: prev.promotion.type === 'NONE' ? 'DISCOUNT' : 'NONE' } 
                                }))}
                                className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                                  playerApplicationData.promotion.type !== 'NONE' ? 'text-purple-400' : 'text-gray-600'
                                }`}
                              >
                                {playerApplicationData.promotion.type !== 'NONE' ? 'Remove' : 'Add'}
                              </button>
                            </div>

                            {playerApplicationData.promotion.type !== 'NONE' && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 p-6 bg-white/5 border border-white/10 rounded-[32px]"
                              >
                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promotion Type</p>
                                  <div className="grid grid-cols-1 gap-2">
                                    {[
                                      { id: 'FIRST_ORDER_DISCOUNT', label: 'First Order Discount' },
                                      { id: 'DISCOUNT', label: 'General Discount' },
                                      { id: 'BUY_X_GET_Y', label: 'Buy X Get Y' }
                                    ].map((type) => (
                                      <button
                                        key={type.id}
                                        onClick={() => setPlayerApplicationData(prev => ({ 
                                          ...prev, 
                                          promotion: { ...prev.promotion, type: type.id as any } 
                                        }))}
                                        className={`p-4 rounded-2xl text-left border transition-all ${
                                          playerApplicationData.promotion.type === type.id ? 'bg-purple-600/20 border-purple-500/50 text-white' : 'bg-white/5 border-white/10 text-gray-500'
                                        }`}
                                      >
                                        <p className="text-xs font-bold">{type.label}</p>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {playerApplicationData.promotion.type === 'BUY_X_GET_Y' ? 'Promotion Details' : 'Discount Value (%)'}
                                  </p>
                                  {playerApplicationData.promotion.type === 'BUY_X_GET_Y' ? (
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1 space-y-1">
                                        <p className="text-[8px] font-black text-gray-500 uppercase px-2">Buy X</p>
                                        <input 
                                          type="number"
                                          placeholder="X"
                                          value={playerApplicationData.promotion.buyX || ''}
                                          onChange={(e) => setPlayerApplicationData(prev => ({ 
                                            ...prev, 
                                            promotion: { ...prev.promotion, buyX: Number(e.target.value) } 
                                          }))}
                                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all"
                                        />
                                      </div>
                                      <div className="pt-6 text-gray-500 font-black">GET</div>
                                      <div className="flex-1 space-y-1">
                                        <p className="text-[8px] font-black text-gray-500 uppercase px-2">Get Y</p>
                                        <input 
                                          type="number"
                                          placeholder="Y"
                                          value={playerApplicationData.promotion.getY || ''}
                                          onChange={(e) => setPlayerApplicationData(prev => ({ 
                                            ...prev, 
                                            promotion: { ...prev.promotion, getY: Number(e.target.value) } 
                                          }))}
                                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all"
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <input 
                                      type="number"
                                      placeholder="0"
                                      value={playerApplicationData.promotion.value || ''}
                                      onChange={(e) => setPlayerApplicationData(prev => ({ 
                                        ...prev, 
                                        promotion: { ...prev.promotion, value: Number(e.target.value) } 
                                      }))}
                                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                                    />
                                  )}
                                </div>

                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promotion Limit</p>
                                  <div className="flex gap-2">
                                    {[
                                      { id: 'NONE', label: t('apply.limitNone') },
                                      { id: 'TIME', label: t('apply.limitTime') },
                                      { id: 'QUANTITY', label: t('apply.limitQty') }
                                    ].map((limit) => (
                                      <button
                                        key={limit.id}
                                        onClick={() => setPlayerApplicationData(prev => ({ 
                                          ...prev, 
                                          promotion: { ...prev.promotion, limitType: limit.id as any } 
                                        }))}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                          playerApplicationData.promotion.limitType === limit.id ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'
                                        }`}
                                      >
                                        {limit.label}
                                      </button>
                                    ))}
                                  </div>
                                  {playerApplicationData.promotion.limitType !== 'NONE' && (
                                    <input 
                                      type="number"
                                      placeholder={
                                        playerApplicationData.promotion.limitType === 'TIME'
                                          ? t('apply.promoPlaceholderDays')
                                          : t('apply.promoPlaceholderQty')
                                      }
                                      value={playerApplicationData.promotion.limitValue || ''}
                                      onChange={(e) => setPlayerApplicationData(prev => ({ 
                                        ...prev, 
                                        promotion: { ...prev.promotion, limitValue: Number(e.target.value) } 
                                      }))}
                                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                                    />
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              {playerApplicationStatus !== 'PENDING' && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0f071a]/80 backdrop-blur-xl border-t border-white/10 z-50">
                  {playerApplicationStep < 4 ? (
                    <button 
                      onClick={() => setPlayerApplicationStep(prev => prev + 1)}
                      disabled={(() => {
                        if (playerApplicationStep === 1) return !playerApplicationData.gameId;
                        if (playerApplicationStep === 2) {
                          const game = GAMES.find(g => g.id === playerApplicationData.gameId);
                          if (game?.hasRank && !playerApplicationData.rank) return true;
                          if (game?.hasMain && !playerApplicationData.mainPosition) return true;
                          if (game?.hasServer && !playerApplicationData.server) return true;
                          if (game?.hasPlatform && !playerApplicationData.platform) return true;
                          if (!playerApplicationData.style || !playerApplicationData.intro) return true;
                          if (playerApplicationData.screenshots.length === 0) return true;
                          return false;
                        }
                        if (playerApplicationStep === 3) {
                          return !playerApplicationData.coverUrl || !playerApplicationData.coverIntro || !playerApplicationData.voiceUrl;
                        }
                        return false;
                      })()}
                      className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all uppercase tracking-widest text-xs"
                    >
                      {t('apply.nextStep')}
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setPlayerApplicationStatus('PENDING');
                        alert(t('apply.submittedAlert'));
                      }}
                      disabled={(() => {
                        if (!playerApplicationData.serviceName || !playerApplicationData.price) return true;
                        if (playerApplicationData.promotion.type !== 'NONE') {
                          if (playerApplicationData.promotion.type === 'BUY_X_GET_Y') {
                            if (!playerApplicationData.promotion.buyX || !playerApplicationData.promotion.getY) return true;
                          } else {
                            if (!playerApplicationData.promotion.value) return true;
                          }
                          if (playerApplicationData.promotion.limitType !== 'NONE' && !playerApplicationData.promotion.limitValue) return true;
                        }
                        return false;
                      })()}
                      className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all uppercase tracking-widest text-xs"
                    >
                      {t('apply.submitApplication')}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Selection Modal for Player Application */}
          <AnimatePresence>
            {showApplySelectionModal.show && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
              >
                <div 
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  onClick={() => setShowApplySelectionModal(prev => ({ ...prev, show: false }))}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="relative w-full max-w-md bg-[#1a102d] rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/10 overflow-hidden shadow-2xl"
                >
                  <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black text-white">{showApplySelectionModal.title}</h2>
                      <button 
                        onClick={() => setShowApplySelectionModal(prev => ({ ...prev, show: false }))}
                        className="p-2 bg-white/5 rounded-xl border border-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {showApplySelectionModal.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            const type = showApplySelectionModal.type;
                            setPlayerApplicationData(prev => ({
                              ...prev,
                              rank: type === 'RANK' ? option : prev.rank,
                              mainPosition: type === 'MAIN' ? option : prev.mainPosition,
                              server: type === 'SERVER' ? option : prev.server,
                              platform: type === 'PLATFORM' ? option : prev.platform,
                            }));
                            setShowApplySelectionModal(prev => ({ ...prev, show: false }));
                          }}
                          className={`w-full p-5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                            (showApplySelectionModal.type === 'RANK' && playerApplicationData.rank === option) ||
                            (showApplySelectionModal.type === 'MAIN' && playerApplicationData.mainPosition === option) ||
                            (showApplySelectionModal.type === 'SERVER' && playerApplicationData.server === option) ||
                            (showApplySelectionModal.type === 'PLATFORM' && playerApplicationData.platform === option)
                              ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold">{option}</span>
                          {((showApplySelectionModal.type === 'RANK' && playerApplicationData.rank === option) ||
                            (showApplySelectionModal.type === 'MAIN' && playerApplicationData.mainPosition === option) ||
                            (showApplySelectionModal.type === 'SERVER' && playerApplicationData.server === option) ||
                            (showApplySelectionModal.type === 'PLATFORM' && playerApplicationData.platform === option)) && (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentView === 'APPLY_PLAYER_CATEGORY' && (
            <motion.div 
              key="apply_player_category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-8"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">{t('apply.categoryTitle')}</h1>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">{t('apply.categoryHeading')}</h2>
                  <p className="text-sm text-gray-500">{t('apply.categorySubtitle', { gameName: selectedGame?.name ?? '' })}</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {['Ranked Carry', 'Normal Play', 'Coaching', 'Leveling', 'Fun & Casual'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedServiceCategory(cat);
                        navigateTo('APPLY_PLAYER_DETAILS');
                      }}
                      className={`w-full p-6 rounded-[24px] border transition-all flex items-center justify-between group ${
                        selectedServiceCategory === cat 
                          ? 'bg-purple-600/20 border-purple-500/50 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-bold text-lg">{cat}</span>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'APPLY_PLAYER_DETAILS' && (
            <motion.div 
              key="apply_player_details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-8"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">{t('apply.detailsTitle')}</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('apply.detailsRankLevel')}</p>
                  <input 
                    type="text" 
                    value={applicationDetails.rank}
                    onChange={(e) => setApplicationDetails(prev => ({ ...prev, rank: e.target.value }))}
                    placeholder={t('apply.detailsRankPlaceholder')}
                    className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('apply.detailsPlatform')}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['PC', 'Mobile', 'Console'].map(p => (
                      <button
                        key={p}
                        onClick={() => setApplicationDetails(prev => ({ ...prev, platform: p }))}
                        className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                          applicationDetails.platform === p 
                            ? 'bg-purple-600 border-purple-500 text-white' 
                            : 'bg-white/5 border-white/10 text-gray-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('apply.detailsStyle')}</p>
                  <input 
                    type="text" 
                    value={applicationDetails.style}
                    onChange={(e) => setApplicationDetails(prev => ({ ...prev, style: e.target.value }))}
                    placeholder={t('apply.detailsStylePlaceholder')}
                    className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('apply.detailsPricePerHour')}</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={applicationDetails.price}
                        onChange={(e) => setApplicationDetails(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g. 5"
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <CoinIcon />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">{t('apply.detailsDiscount')}</p>
                    <input 
                      type="number" 
                      value={applicationDetails.discount}
                      onChange={(e) => setApplicationDetails(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="e.g. 10"
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setPlayerApplicationStatus('PENDING');
                  navigateTo('APPLY_PLAYER');
                }}
                className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                {t('apply.detailsSubmit')}
              </button>
            </motion.div>
          )}

          {currentView === 'SETTINGS' && (
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
                        alert(t('settings.cacheCleared'));
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
          )}

          {currentView === 'SETTINGS_EDIT_PROFILE' && (
            <motion.div 
              key="settings_edit_profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title="Edit Profile" onBack={() => setCurrentView('SETTINGS')}>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                      <img 
                        src="https://picsum.photos/seed/user1/200/200" 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-xl border-2 border-[#0f071a] shadow-xl">
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Nickname</p>
                      <input 
                        type="text" 
                        defaultValue="Alex"
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Bio</p>
                      <textarea 
                        defaultValue="Gaming is life! 🎮"
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-purple-500/50 outline-none transition-all h-32 resize-none"
                      />
                    </div>
                    <button className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs mt-4">
                      Save Changes
                    </button>
                  </div>
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'SETTINGS_CHANGE_PASSWORD' && (
            <motion.div 
              key="settings_change_password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title="Change Password" onBack={() => setCurrentView('SETTINGS')}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Current Password</p>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-700 focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">New Password</p>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="password" 
                        placeholder="Min. 8 characters"
                        className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-700 focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Confirm New Password</p>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input 
                        type="password" 
                        placeholder="Repeat new password"
                        className="w-full p-5 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-700 focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs mt-8">
                    Update Password
                  </button>
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'SETTINGS_LINKED_ACCOUNTS' && (
            <motion.div 
              key="settings_linked_accounts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title="Linked Accounts" onBack={() => setCurrentView('SETTINGS')}>
                <div className="space-y-4 pt-4">
                  {[
                    { name: 'Discord', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-[#5865F2]', linked: true, username: 'Alex#1234' },
                    { name: 'Google', icon: <Globe className="w-5 h-5" />, color: 'bg-[#DB4437]', linked: false },
                    { name: 'Facebook', icon: <Globe className="w-5 h-5" />, color: 'bg-[#4267B2]', linked: false },
                    { name: 'Apple', icon: <Smartphone className="w-5 h-5" />, color: 'bg-white text-black', linked: false },
                  ].map(acc => (
                    <div key={acc.name} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${acc.color} flex items-center justify-center shadow-lg`}>
                          {acc.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white">{acc.name}</p>
                          {acc.linked && <p className="text-[10px] font-bold text-gray-500">{acc.username}</p>}
                        </div>
                      </div>
                      <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        acc.linked ? 'bg-white/5 text-gray-500 border border-white/10' : 'bg-purple-600 text-white shadow-lg'
                      }`}>
                        {acc.linked ? 'Unlink' : 'Link'}
                      </button>
                    </div>
                  ))}
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'SETTINGS_LANGUAGE' && (
            <motion.div 
              key="settings_language"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title={t('settings.language')} onBack={() => setCurrentView('SETTINGS')}>
                <div className="space-y-2 pt-4">
                  {supportedLocales.map(localeOption => (
                    <button 
                      key={localeOption}
                      onClick={() => {
                        setLocale(localeOption);
                        setCurrentView('SETTINGS');
                      }}
                      className={`w-full p-5 flex items-center justify-between rounded-2xl border transition-all ${
                        locale === localeOption 
                          ? 'bg-purple-600/10 border-purple-500/50 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-bold">{getLocaleLabel(localeOption)}</span>
                      {locale === localeOption && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </button>
                  ))}
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'SETTINGS_PRIVACY' && (
            <motion.div 
              key="settings_privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title="Privacy Policy" onBack={() => setCurrentView('SETTINGS')}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">1. Information Collection</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">2. Use of Information</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We use the information we collect to provide, maintain, and improve our services, and to develop new ones.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">3. Data Security</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-600 italic pt-4">Last updated: April 4, 2026</p>
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'SETTINGS_TERMS' && (
            <motion.div 
              key="settings_terms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SettingsSubPage title="Terms of Service" onBack={() => setCurrentView('SETTINGS')}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">1. Acceptance of Terms</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      By accessing or using our services, you agree to be bound by these terms. If you do not agree to all of these terms, do not use our services.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">2. User Conduct</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      You are responsible for your use of the services and for any content you provide. You agree not to engage in any prohibited conduct.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">3. Termination</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We reserve the right to terminate or suspend your access to our services at any time, without notice, for any reason.
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-600 italic pt-4">Last updated: April 4, 2026</p>
                </div>
              </SettingsSubPage>
            </motion.div>
          )}

          {currentView === 'WALLET' && (
            <motion.div 
              key="wallet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32"
            >
              <WalletView 
                wallet={wallet}
                transactions={transactions}
                packages={rechargePackages}
                onSelectPackage={handleRecharge}
                onBack={handleBack}
              />
            </motion.div>
          )}

          {currentView === 'PLAYER_PROFILE_EDIT' && (
            <motion.div 
              key="player_profile_edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Player Profile</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Cover Image</p>
                  <button className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-all group overflow-hidden relative">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                      <Image className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-500">Upload Cover Image</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Game Services</p>
                  <div className="space-y-3">
                    {[
                      { name: 'League of Legends', price: 5, unit: 'hr' },
                      { name: 'Valorant', price: 8, unit: 'hr' },
                    ].map((service, idx) => (
                      <GlassCard key={idx} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{service.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium">{service.price} Coins / {service.unit}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </GlassCard>
                    ))}
                    <button className="w-full p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:bg-white/10 transition-all">
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Bio & Introduction</p>
                  <textarea 
                    defaultValue="Professional gamer with 5 years of experience. I can help you climb the ranks and have fun!"
                    className="w-full h-32 p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2">Voice Intro</p>
                  <button className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 text-white font-bold">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                      <Mic2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 h-1 bg-white/10 rounded-full relative">
                      <div className="absolute top-0 left-0 w-1/3 h-full bg-purple-500 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-gray-500">0:12 / 0:30</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert('Profile updated successfully!');
                  handleBack();
                }}
                className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Save Changes
              </button>
            </motion.div>
          )}

          {currentView === 'NOTIFICATIONS' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-screen pb-32 bg-[#0f071a] p-6 space-y-6"
            >
              <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">Notifications</h1>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Order Accepted', content: 'Your order for League of Legends has been accepted by Player123.', time: '2 mins ago', type: 'ORDER', unread: true },
                  { title: 'Recharge Successful', content: 'Your recharge of 100 Coins has been confirmed.', time: '1 hour ago', type: 'PAYMENT', unread: false },
                  { title: 'New Message', content: 'Player456 sent you a message.', time: '3 hours ago', type: 'CHAT', unread: false },
                  { title: 'System Update', content: 'New features added to the platform! Check them out.', time: '1 day ago', type: 'SYSTEM', unread: false },
                ].map((notif, idx) => (
                  <div key={idx} className={`p-5 space-y-2 relative overflow-hidden border-b border-white/5 last:border-0 ${notif.unread ? 'bg-purple-500/5' : ''}`}>
                    {notif.unread && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                          notif.type === 'ORDER' ? 'bg-blue-500/20 text-blue-400' :
                          notif.type === 'PAYMENT' ? 'bg-green-500/20 text-green-400' :
                          notif.type === 'CHAT' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {notif.type}
                        </span>
                        {notif.unread && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                      </div>
                      <span className="text-[10px] font-bold text-gray-600">{notif.time}</span>
                    </div>
                    <h3 className="font-bold text-white">{notif.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{notif.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'ORDER_CONFIRM' && selectedEPal && selectedVariant && (
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
          )}
        </AnimatePresence>

        {/* Unfollow Confirmation Modal */}
        <AnimatePresence>
          {showUnfollowModal && epalToUnfollow && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUnfollowModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-[201] p-6 pointer-events-none"
              >
                <GlassCard className="w-full max-w-xs p-6 space-y-6 pointer-events-auto shadow-2xl border-white/20 bg-[#1a0b2e]/90">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-purple-500/30">
                      <img src={epalToUnfollow.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h3 className="text-lg font-bold">Unfollow {epalToUnfollow.name}?</h3>
                    <p className="text-xs text-gray-400">Are you sure you want to unfollow this EPal?</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={confirmUnfollow}
                      className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold text-sm active:scale-95 transition-all"
                    >
                      Unfollow
                    </button>
                    <button 
                      onClick={() => setShowUnfollowModal(false)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Playlink Gallery Modal */}
        <AnimatePresence>
          {showPlaylinkModal && selectedEPal && selectedPlaylinkId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setShowPlaylinkModal(false)}
            >
              <button 
                className="absolute top-10 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white z-[110] active:scale-90 transition-transform"
                onClick={() => setShowPlaylinkModal(false)}
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>

              <div 
                className="w-full max-w-sm overflow-x-auto flex snap-x snap-mandatory no-scrollbar gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedEPal.playlinks?.map((pl) => (
                  <div 
                    key={pl.id}
                    id={`pl-card-${pl.id}`}
                    className="min-w-full snap-center"
                  >
                    <GlassCard className="overflow-hidden border-white/20 shadow-2xl bg-[#0f071a] flex flex-col w-full relative">
                      {/* Top Rank Highlight */}
                      <div className="bg-purple-600 px-6 py-4 flex justify-between items-center pr-14">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-[10px] font-bold text-purple-100 uppercase tracking-widest">Current Rank</span>
                        </div>
                        <span className="text-xl font-black text-white italic">{pl.rank || '-'}</span>
                      </div>

                      {/* Share Button - Top Right of Card */}
                      <div className="absolute top-3 right-3 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({
                                title: `${pl.gameName} - ${pl.nickname}`,
                                text: `Check out ${selectedEPal.name}'s ${pl.gameName} profile!`,
                                url: window.location.href
                              }).catch(console.error);
                            }
                          }}
                          className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Info Grid */}
                      <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4 bg-white/2">
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Platform</p>
                          <div className="flex items-center gap-2">
                            {pl.platform === 'PC' && <Monitor className="w-3.5 h-3.5 text-purple-400" />}
                            {pl.platform === 'PS' && <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />}
                            {pl.platform === 'Mobile' && <Smartphone className="w-3.5 h-3.5 text-purple-400" />}
                            <span className="text-sm font-bold text-white">{pl.platform || '-'}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Server</p>
                          <p className="text-sm font-bold text-white">{pl.server || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Position</p>
                          <p className="text-sm font-bold text-white">{pl.role || '-'}</p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Style</p>
                          <p className="text-sm font-bold text-white">{pl.style || '-'}</p>
                        </div>
                      </div>

                      {/* Game Image at bottom */}
                      <div className="relative aspect-video overflow-hidden group">
                        <img 
                          src={pl.posterUrl} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f071a] via-transparent to-transparent" />
                        
                        <div className="absolute bottom-4 left-6">
                          <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{pl.gameName}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-purple-400 tracking-widest">{pl.nickname}</p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(pl.nickname);
                              }}
                              className="p-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 transition-colors group/copy"
                            >
                              {copied ? (
                                <Check className="w-2.5 h-2.5 text-green-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-purple-400 group-hover/copy:text-purple-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Filter Modal */}
        <AnimatePresence>
          {showReviewFilterModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewFilterModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[201] max-w-md mx-auto p-6 pb-12 space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Filter & Sort</h2>
                  <button 
                    onClick={() => setShowReviewFilterModal(false)}
                    className="text-gray-500 hover:text-white font-bold"
                  >
                    Close
                  </button>
                </div>

                {/* Sort Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Sort By</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'DEFAULT', label: 'Default' },
                      { id: 'NEWEST', label: 'Newest' },
                      { id: 'OLDEST', label: 'Oldest' },
                      { id: 'RATING_HIGH', label: 'Highest Rating' },
                      { id: 'RATING_LOW', label: 'Lowest Rating' }
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => setReviewSortOrder(sort.id as any)}
                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                          reviewSortOrder === sort.id 
                            ? 'bg-purple-600/20 border-purple-500/50' 
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <span className={`text-sm font-bold ${reviewSortOrder === sort.id ? 'text-purple-400' : 'text-gray-300'}`}>
                          {sort.label}
                        </span>
                        {reviewSortOrder === sort.id && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Filter by Rating</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                      onClick={() => setSelectedRatingFilter(null)}
                      className={`px-5 py-3 rounded-2xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                        selectedRatingFilter === null 
                          ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-sm font-bold">All</span>
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRatingFilter(star === selectedRatingFilter ? null : star)}
                        className={`px-5 py-3 rounded-2xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                          selectedRatingFilter === star 
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <span className="text-sm font-bold">{star}</span>
                        <Star className={`w-3.5 h-3.5 ${selectedRatingFilter === star ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowReviewFilterModal(false)}
                  className="w-full py-4 rounded-2xl bg-purple-600 font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all text-white"
                >
                  Apply Filters
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Gift Panel */}
        <AnimatePresence>
          {showGiftPanel && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowGiftPanel(false);
                  setShowQuantitySelector(false);
                }}
                className="fixed inset-0 bg-black/60 z-[200]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#1a0b2e] rounded-t-[32px] border-t border-white/10 z-[201] max-w-md mx-auto p-6 pb-8 h-[70vh] flex flex-col"
              >
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h2 className="text-xl font-bold">Send a Gift</h2>
                  <button onClick={() => {
                    setShowGiftPanel(false);
                    setShowQuantitySelector(false);
                  }} className="text-gray-500 hover:text-white font-bold">Close</button>
                </div>

                {/* Gift List - Scrollable */}
                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 mb-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 0, icon: Heart, label: 'Heart', price: 10, color: 'text-red-400' },
                      { id: 1, icon: Star, label: 'Star', price: 50, color: 'text-yellow-400' },
                      { id: 2, icon: Zap, label: 'Energy', price: 100, color: 'text-blue-400' },
                      { id: 3, icon: Trophy, label: 'Trophy', price: 500, color: 'text-orange-400' },
                      { id: 4, icon: Gift, label: 'Box', price: 1000, color: 'text-purple-400' },
                      { id: 5, icon: Play, label: 'Ticket', price: 2000, color: 'text-green-400' },
                      { id: 6, icon: Star, label: 'Super', price: 5000, color: 'text-yellow-500' },
                      { id: 7, icon: Trophy, label: 'Crown', price: 10000, color: 'text-yellow-600' },
                      { id: 8, icon: Heart, label: 'Love', price: 520, color: 'text-pink-400' },
                      { id: 9, icon: Zap, label: 'Thunder', price: 999, color: 'text-yellow-300' },
                    ].map((gift) => (
                      <button 
                        key={gift.id} 
                        onClick={() => setSelectedGiftId(gift.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                          selectedGiftId === gift.id 
                            ? 'bg-purple-600/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center ${gift.color}`}>
                          <gift.icon className="w-7 h-7 fill-current" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-300">{gift.label}</span>
                        <div className="flex items-center gap-1">
                          <CoinIcon />
                          <span className="text-[11px] font-bold text-purple-400">{gift.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-2 shrink-0">
                  {/* Left: Balance & Recharge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-full border border-white/10">
                      <CoinIcon className="w-4 h-4" textClassName="text-[10px]" />
                      <span className="text-sm font-bold text-white">{wallet?.balance ?? 0}</span>
                    </div>
                    <button 
                      onClick={() => navigateTo('RECHARGE')}
                      className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-400 hover:bg-purple-600/30 active:scale-95 transition-all"
                    >
                      Recharge
                    </button>
                  </div>

                  {/* Right: Quantity & Send */}
                  <div className="relative flex items-center">
                    {/* Quantity Panel */}
                    <AnimatePresence>
                      {showQuantitySelector && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full right-0 mb-4 bg-[#2a1b3e] border border-white/10 rounded-2xl p-2 grid grid-cols-2 gap-2 shadow-2xl z-[202] min-w-[140px]"
                        >
                          {[1, 10, 52, 66, 99, 520, 1314].map((num) => (
                            <button
                              key={num}
                              onClick={() => {
                                setGiftQuantity(num);
                                setShowQuantitySelector(false);
                              }}
                              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                                giftQuantity === num ? 'bg-purple-600 text-white' : 'hover:bg-white/5 text-gray-400'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center bg-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden">
                      <button 
                        onClick={() => setShowQuantitySelector(!showQuantitySelector)}
                        className="pl-5 pr-3 py-3 flex items-center gap-1.5 border-r border-white/20 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-sm font-bold text-white">{giftQuantity}</span>
                        <ChevronRight className={`w-4 h-4 text-white/70 transition-transform ${showQuantitySelector ? 'rotate-90' : '-rotate-90'}`} />
                      </button>
                      <button 
                        onClick={() => {
                          setShowGiftPanel(false);
                          setShowQuantitySelector(false);
                        }}
                        className="pl-4 pr-6 py-3 font-bold text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Game Selector Modal */}
        <AnimatePresence>
          {showGameSelectorModal && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGameSelectorModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-6 bg-[#1a0b2e] rounded-[32px] border border-white/10 z-[201] max-w-md mx-auto p-6 overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">All Communities</h2>
                  <button onClick={() => setShowGameSelectorModal(false)} className="text-gray-500 hover:text-white font-bold">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                  <button
                    onClick={() => { 
                      setSelectedGame(null); 
                      setShowGameSelectorModal(false); 
                      if (currentView !== 'COMMUNITY') navigateTo('COMMUNITY');
                    }}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      selectedGame === null ? 'bg-purple-600/20 border-purple-500/50' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <span className="font-bold">All Communities</span>
                    {selectedGame === null && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                  </button>
                  {GAMES.map(game => (
                    <button
                      key={game.id}
                      onClick={() => { 
                        setSelectedGame(game); 
                        setShowGameSelectorModal(false); 
                        if (currentView === 'APPLY_PLAYER') {
                          navigateTo('APPLY_PLAYER_CATEGORY');
                        } else if (currentView !== 'COMMUNITY') {
                          navigateTo('COMMUNITY');
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        selectedGame?.id === game.id ? 'bg-purple-600/20 border-purple-500/50' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <img src={game.imageUrl} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <span className="font-bold flex-1 text-left">{game.name}</span>
                      {selectedGame?.id === game.id && <CheckCircle2 className="w-5 h-5 text-purple-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Ongoing Order Warning Modal */}
        <AnimatePresence>
          {showOngoingOrderWarning && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOngoingOrderWarning(false)}
                className="fixed inset-0 bg-black/60 z-[600]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-sm bg-[#1a0b2e] rounded-[32px] border border-white/10 z-[601] p-8 text-center space-y-6 shadow-2xl"
              >
                <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Ongoing Order</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    You already have an ongoing order with this EPal. Please complete or cancel it before placing a new one.
                  </p>
                </div>
                <button 
                  onClick={() => setShowOngoingOrderWarning(false)}
                  className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                  Got it
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderDetailModal && selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderDetailModal(false)}
                className="fixed inset-0 bg-black/80 z-[400]"
              />
              {(() => {
                const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                return (
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100 || info.velocity.y > 500) setShowOrderDetailModal(false);
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-[#0f071a] z-[401] p-8 pb-12 flex flex-col no-scrollbar overflow-y-auto"
                  >
                    <div 
                      onClick={() => setShowOrderDetailModal(false)}
                      className="flex items-center justify-center py-4 mb-4 shrink-0 cursor-pointer group"
                    >
                      <div className="w-12 h-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors" />
                    </div>
                    
                    <div className="flex-1 space-y-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Order Details</h2>
                        <p className="text-gray-500 text-sm font-medium">Transaction ID: {selectedOrder.id.toUpperCase()}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">EPal</span>
                          <span className="font-bold text-purple-400 text-sm">{epal?.name || selectedOrder.epalId}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Service Item</span>
                          <span className="font-bold text-white text-sm">{selectedOrder.serviceName}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Unit Type</span>
                          <span className="font-bold text-white text-sm">{selectedOrder.unit || 'Game'}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Unit Price</span>
                          <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                            <CoinIcon className="w-3.5 h-3.5" />
                            {selectedOrder.unitPrice || selectedOrder.price}
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Quantity</span>
                          <span className="font-bold text-white text-sm">x{selectedOrder.quantity || 1}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Order Created</span>
                          <span className="font-bold text-gray-400 text-sm">{selectedOrder.createTime || new Date(selectedOrder.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-5 border-b border-white/5">
                          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Order Status</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                            selectedOrder.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                            selectedOrder.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {selectedOrder.status}
                          </span>
                        </div>
                        {selectedOrder.status === 'COMPLETED' && selectedOrder.endTime && (
                          <div className="flex justify-between items-center py-5 border-b border-white/5">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Completed At</span>
                            <span className="font-bold text-gray-400 text-sm">{new Date(selectedOrder.endTime).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Highlighted Total Price Section */}
                      <div className="bg-gradient-to-br from-purple-600/10 to-transparent rounded-[32px] p-8 border border-white/5 flex flex-col items-center gap-4 shadow-2xl">
                        <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Total Payment</span>
                        <div className="flex items-center gap-3">
                          <CoinIcon className="w-8 h-8" />
                          <span className="text-5xl font-black text-white tracking-tighter">{selectedOrder.totalPrice || selectedOrder.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4 shrink-0">
                      {selectedOrder.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => {
                              setShowOrderDetailModal(false);
                              const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                              if (epal) navigateTo('IM_DETAIL', epal);
                            }}
                            className="w-full py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
                          >
                            Contact EPal Now
                          </button>
                          <button 
                            onClick={() => {
                              setImOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'CANCELLED' } : o));
                              setShowOrderDetailModal(false);
                            }}
                            className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest text-xs"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'COMPLETED' && !selectedOrder.reviewed && (
                        <button 
                          onClick={() => {
                            setShowOrderDetailModal(false);
                            setReviewRating(5);
                            setReviewTags([]);
                            setReviewFeedback('');
                            setShowReviewModal(true);
                          }}
                          className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-purple-400 hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                        >
                          Rate this Service
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && selectedOrder && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewModal(false)}
                className="fixed inset-0 bg-black/80 z-[400]"
              />
              {(() => {
                const epal = EPALS.find(e => e.id === selectedOrder.epalId);
                return (
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    drag="y"
                    dragConstraints={{ top: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 100 || info.velocity.y > 500) setShowReviewModal(false);
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 bg-[#0f071a] z-[401] p-8 pb-12 flex flex-col no-scrollbar overflow-y-auto"
                  >
                    <div 
                      onClick={() => setShowReviewModal(false)}
                      className="flex items-center justify-center py-4 mb-4 shrink-0 cursor-pointer group"
                    >
                      <div className="w-12 h-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors" />
                    </div>
                    <div className="space-y-8 flex-1">
                      <div className="relative text-center space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Rate Service</h2>
                        <p className="text-gray-500 text-sm font-medium">How was your experience with {epal?.name}?</p>
                      </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-10 h-10 ${star <= reviewRating ? 'text-yellow-500 fill-current' : 'text-gray-700'}`} />
                      </button>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Select Tags</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Professional', 'Friendly', 'Skilled', 'Good Comms', 'Patient', 'Fun'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setReviewTags(prev => 
                              prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                            reviewTags.includes(tag)
                              ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                              : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Your Feedback</p>
                    <textarea 
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      placeholder="Share your thoughts about the service..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-purple-500/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        // Mock submit
                        if (selectedOrder) {
                          setImOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, reviewed: true } : o));
                        }
                        setShowReviewModal(false);
                      }}
                      className="w-full py-4 bg-purple-600 rounded-2xl font-bold text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </>
          )}
        </AnimatePresence>
      </main>

        {/* EPal Filter Modal */}
        <AnimatePresence>
          {showEpalFilterModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[401] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0 border-b border-white/5">
                <button 
                  onClick={() => setShowEpalFilterModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Filters</h2>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8 space-y-10">
                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Status</h3>
                  <div className="flex gap-3">
                    {['ALL', 'ONLINE'].map(s => (
                      <button
                        key={s}
                        onClick={() => setEpalFilters(prev => ({ ...prev, status: s as any }))}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                          epalFilters.status === s 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {s === 'ALL' ? 'All' : 'Online Only'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Gender</h3>
                  <div className="flex gap-3">
                    {['ALL', 'Male', 'Female'].map(g => (
                      <button
                        key={g}
                        onClick={() => setEpalFilters(prev => ({ ...prev, gender: g as any }))}
                        className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                          epalFilters.gender === g 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        {g === 'ALL' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Price Range</h3>
                    <span className="text-xs font-bold text-white">{epalFilters.priceRange[0]} - {epalFilters.priceRange[1]} Coins</span>
                  </div>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={epalFilters.priceRange[1]}
                      onChange={(e) => setEpalFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>

                {/* Dynamic Filters (Server, Platform, Rank) */}
                {(() => {
                  const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                  const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                  
                  const servers = Array.from(new Set(playlinks.map(pl => pl.server).filter(Boolean)));
                  const platforms = Array.from(new Set(playlinks.map(pl => pl.platform).filter(Boolean)));
                  const ranks = Array.from(new Set(playlinks.map(pl => pl.rank).filter(Boolean)));

                  return (
                    <div className="space-y-10">
                      {servers.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Server</h3>
                          <button
                            onClick={() => setShowServerSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.server === 'ALL' ? 'All Servers' : epalFilters.server}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}

                      {platforms.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Platform</h3>
                          <button
                            onClick={() => setShowPlatformSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.platform === 'ALL' ? 'All Platforms' : epalFilters.platform}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}

                      {ranks.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Rank</h3>
                          <button
                            onClick={() => setShowRankSelectorModal(true)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:bg-white/10"
                          >
                            <span>{epalFilters.rank === 'ALL' ? 'All Ranks' : epalFilters.rank}</span>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Fixed Footer */}
              <div className="p-6 border-t border-white/5 bg-[#0f071a] flex gap-4 shrink-0">
                <button 
                  onClick={() => setEpalFilters({
                    status: 'ALL',
                    gender: 'ALL',
                    priceRange: [0, 100],
                    server: 'ALL',
                    platform: 'ALL',
                    rank: 'ALL',
                  })}
                  className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-gray-400 uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowEpalFilterModal(false)}
                  className="flex-[2] py-5 bg-purple-600 rounded-2xl font-black text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rank Selector Modal */}
        <AnimatePresence>
          {showRankSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowRankSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Rank</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEpalFilters(prev => ({ ...prev, rank: 'ALL' }));
                      setShowRankSelectorModal(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                      epalFilters.rank === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold">All Ranks</span>
                    {epalFilters.rank === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                  </button>

                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const ranks = Array.from(new Set(playlinks.map(pl => pl.rank).filter(Boolean)));

                    const RANK_ORDER = [
                      'Unranked', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger',
                      'Ascendant', 'Immortal', 'Radiant', 'Predator', 'AR', 'Level'
                    ];

                    const sortedRanks = ranks.sort((a, b) => {
                      const aIndex = RANK_ORDER.findIndex(r => a.includes(r));
                      const bIndex = RANK_ORDER.findIndex(r => b.includes(r));
                      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                      if (aIndex === -1) return 1;
                      if (bIndex === -1) return -1;
                      return aIndex - bIndex;
                    });

                    return sortedRanks.map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          setEpalFilters(prev => ({ ...prev, rank: r as string }));
                          setShowRankSelectorModal(false);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                          epalFilters.rank === r ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-bold">{r}</span>
                        {epalFilters.rank === r && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server Selector Modal */}
        <AnimatePresence>
          {showServerSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowServerSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Server</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
                <div className="space-y-3">
                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const servers = Array.from(new Set(playlinks.map(pl => pl.server).filter(Boolean)));

                    return (
                      <>
                        <button
                          onClick={() => {
                            setEpalFilters(prev => ({ ...prev, server: 'ALL' }));
                            setShowServerSelectorModal(false);
                          }}
                          className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                            epalFilters.server === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold">All Servers</span>
                          {epalFilters.server === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        {servers.map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              setEpalFilters(prev => ({ ...prev, server: s as string }));
                              setShowServerSelectorModal(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                              epalFilters.server === s ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span className="font-bold">{s}</span>
                            {epalFilters.server === s && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Platform Selector Modal */}
        <AnimatePresence>
          {showPlatformSelectorModal && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-[#0f071a] z-[500] flex flex-col"
            >
              <div className="px-6 pt-12 pb-6 flex items-center gap-4 shrink-0">
                <button 
                  onClick={() => setShowPlatformSelectorModal(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black text-white">Select Platform</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-8">
                <div className="space-y-3">
                  {(() => {
                    const gameEpals = EPALS.filter(e => e.game.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const playlinks = gameEpals.flatMap(e => e.playlinks || []).filter(pl => pl.gameName.toLowerCase().includes(selectedGame?.name.toLowerCase().split(' ')[0] || ''));
                    const platforms = Array.from(new Set(playlinks.map(pl => pl.platform).filter(Boolean)));

                    return (
                      <>
                        <button
                          onClick={() => {
                            setEpalFilters(prev => ({ ...prev, platform: 'ALL' }));
                            setShowPlatformSelectorModal(false);
                          }}
                          className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                            epalFilters.platform === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <span className="font-bold">All Platforms</span>
                          {epalFilters.platform === 'ALL' && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                        {platforms.map(p => (
                          <button
                            key={p}
                            onClick={() => {
                              setEpalFilters(prev => ({ ...prev, platform: p as string }));
                              setShowPlatformSelectorModal(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                              epalFilters.platform === p ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <span className="font-bold">{p}</span>
                            {epalFilters.platform === p && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recharge Loading Overlay */}
        <AnimatePresence>
          {isRecharging && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CoinIcon className="w-8 h-8 animate-bounce" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white">Processing Payment</h3>
                <p className="text-gray-400 text-sm">Please do not close the app or refresh the page...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuthModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[900]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[901]"
              >
                <GlassCard className="p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white">{authMode === 'LOGIN' ? t('auth.modalLogin') : t('auth.modalRegister')}</h3>
                    <button onClick={() => setShowAuthModal(false)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-purple-300">{authStatus || t('auth.modalContinueHint')}</p>
                  <div className="space-y-3">
                    {authMode === 'REGISTER' && (
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder={t('auth.usernamePlaceholder')}
                        required
                      />
                    )}
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      type="email"
                      required
                    />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      type="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAuthSubmit}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white"
                    >
                      {authMode === 'LOGIN' ? t('auth.modalLogin') : t('auth.createAccount')}
                    </button>
                  </div>
                  <button
                    onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                    className="w-full py-2 text-xs font-bold text-gray-300 hover:text-white"
                  >
                    {authMode === 'LOGIN' ? t('auth.noAccountRegister') : t('auth.haveAccountLogin')}
                  </button>
                </GlassCard>
              </motion.div>
            </>
          )}

          {showRankingModal && (
            <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm px-4 py-10" onClick={() => setShowRankingModal(false)}>
              <div className="max-w-md mx-auto bg-[#160b25] border border-white/10 rounded-3xl p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('ranking.top10ModalTitle')}</h3>
                  </div>
                  <button onClick={() => setShowRankingModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                  {sortedRankings.slice(0, 10).map(item => (
                    <div key={`modal_${item.companionId}`} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">#{item.rank} {item.gameName}</p>
                        <p className="text-xs font-bold text-purple-300">{t('ranking.modalScoreLabel', { score: item.rankingScore.toFixed(2) })}</p>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {t('ranking.modalDetailLine', {
                          poolTag: item.poolTag,
                          rating: item.avgRating.toFixed(2),
                          completed: item.completedOrderCount,
                          completionPct: Math.round(item.completionRate * 100)
                        })}
                      </p>
                      <button
                        onClick={() => setExpandedRankingId(prev => prev === item.companionId ? null : item.companionId)}
                        className="mt-2 text-[10px] font-bold text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {expandedRankingId === item.companionId ? t('ranking.hideBreakdown') : t('ranking.showBreakdown')}
                      </button>
                      {expandedRankingId === item.companionId && (
                        <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="rounded-lg bg-blue-500/10 border border-blue-400/20 px-2 py-1 text-blue-200 col-span-2">
                            {t('ranking.formulaLabel')}{' '}
                            <span className="font-bold">{t('ranking.formulaExpression')}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownQuality')} <span className="text-white font-bold">{item.scoreBreakdown.quality.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownVolume')} <span className="text-white font-bold">{item.scoreBreakdown.volume.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownFulfillment')} <span className="text-white font-bold">{item.scoreBreakdown.fulfillment.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-gray-300">
                            {t('ranking.breakdownRevenue')} <span className="text-white font-bold">{item.scoreBreakdown.revenue.toFixed(2)}</span>
                          </div>
                          <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-2 py-1 text-red-200 col-span-2">
                            {t('ranking.breakdownRisk')} <span className="font-bold">{item.scoreBreakdown.riskPenalty.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

      {/* Bottom Navigation */}
      {(currentView === 'HOME' || currentView === 'COMMUNITY' || currentView === 'CATEGORY_SERVICES' || currentView === 'IM' || currentView === 'ME') && (
        <nav className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
          <div className="bg-[#1a0b2e] border-t border-white/5 px-2 py-2 flex justify-around items-end shadow-2xl pointer-events-auto">
            <NavButton
              icon={Home}
              label={t('nav.home')}
              active={currentView === 'HOME' || currentView === 'CATEGORY_SERVICES'}
              onClick={() => navigateTo('HOME')}
            />
            <NavButton icon={Users} label={t('nav.community')} active={currentView === 'COMMUNITY'} onClick={() => navigateTo('COMMUNITY')} />
            <NavButton icon={MessageSquare} label={t('nav.im')} active={currentView === 'IM'} onClick={() => navigateTo('IM')} />
            <NavButton icon={User} label={t('nav.me')} active={currentView === 'ME'} onClick={() => navigateTo('ME')} />
          </div>
        </nav>
      )}

    </div>
  );
}

const NavButton = ({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] rounded-2xl transition-all duration-300 ${
      active ? 'text-white' : 'text-gray-500 hover:text-purple-400'
    }`}
  >
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        active
          ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105'
          : 'bg-transparent'
      }`}
    >
      <Icon className="w-5 h-5" fill={active ? 'currentColor' : 'none'} />
    </span>
    <span className="text-[9px] font-bold leading-tight text-center max-w-[64px] truncate">{label}</span>
  </button>
);
