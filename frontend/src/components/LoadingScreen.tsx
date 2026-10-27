import React from 'react';
import { PlatformLogo } from './common/PlatformLogo';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'جاري تهيئة المنصة التعليمية...',
  subMessage = 'إديوتك • تجربة تعلّم ذكية وتفاعلية',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6F6F6] dark:bg-[#111111] text-slate-800 dark:text-slate-100 transition-colors duration-300 select-none">
      {/* Ambient background glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#FFCB74]/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-400/10 blur-[80px] pointer-events-none -top-10" />

      {/* Center Branded Loading Card */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm">
        {/* Animated Brand Logo */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#FFCB74] to-amber-300 opacity-30 blur-lg animate-pulse" />
          <PlatformLogo size={100} className="relative z-10" />
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-2 space-x-reverse mb-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            إديوتك
          </h1>
          <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
            EduTech
          </span>
        </div>

        {/* Main Message */}
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-2">
          {message}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-normal">
          {subMessage}
        </p>

        {/* Sleek Animated Progress Bar */}
        <div className="w-52 h-1.5 bg-slate-200 dark:bg-[#2F2F2F] rounded-full overflow-hidden mt-6 relative shadow-inner">
          <div className="absolute inset-y-0 bg-gradient-to-r from-[#FFCB74] via-amber-300 to-[#FFCB74] rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
};
