import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const SettingsSubPage: React.FC<{
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