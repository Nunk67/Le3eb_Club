import React from 'react';
import { Star, Play, Gamepad2 } from 'lucide-react';
import type { EPal } from '@shared/types';
import { GlassCard } from '../ui/GlassCard';
import { CoinIcon } from '../ui/CoinIcon';
import { WaveAnimation } from '../ui/WaveAnimation';

export const EPalCard: React.FC<{ 
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