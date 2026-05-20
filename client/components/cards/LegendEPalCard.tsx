import React from 'react';
import { Star, Play } from 'lucide-react';
import type { EPal } from '@shared/types';
import { WaveAnimation } from '../ui/WaveAnimation';

export const LegendEPalCard: React.FC<{ 
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