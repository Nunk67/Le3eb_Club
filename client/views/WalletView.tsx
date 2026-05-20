import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Wallet, History, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { RechargePackage, Wallet as WalletType, WalletTransaction } from '@shared/types';
import { GlassCard } from '../components/ui/GlassCard';
import { CoinIcon } from '../components/ui/CoinIcon';

export function WalletView({ 
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
  onBack: () => void;
}) {
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