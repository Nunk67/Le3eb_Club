import React from 'react';

export const IconButton = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group" type="button">
    <div
      className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        active
          ? 'bg-purple-600/40 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          : 'bg-white/5 border border-white/10 group-hover:bg-white/10'
      }`}
    >
      <Icon className={`w-10 h-10 ${active ? 'text-purple-300' : 'text-purple-400'}`} />
    </div>
    <span className={`text-[10px] font-bold tracking-widest uppercase ${active ? 'text-white' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);
