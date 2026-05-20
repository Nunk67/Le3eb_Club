import React from 'react';
import { Star } from 'lucide-react';
import type { Game } from '@shared/types';

export const GameGridItem: React.FC<{ 
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