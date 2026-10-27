import React from 'react';
import { Sparkles } from 'lucide-react';
import { PlatformLogo } from '../common/PlatformLogo';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthCardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab?: 'login' | 'register';
  onTabChange?: (tab: 'login' | 'register') => void;
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
  children,
  title,
  subtitle,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between overflow-y-auto transition-colors duration-300 bg-[#F6F6F6] dark:bg-[#111111] text-slate-800 dark:text-slate-100 font-sans relative selection:bg-[#FFCB74]/40 selection:text-slate-900">
      {/* Background Decorative Ambient Gradients & Mesh Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30 dark:opacity-25">
        <div className="absolute -top-32 left-1/4 w-[420px] h-[420px] rounded-full bg-[#FFCB74] blur-[128px] animate-pulse" />
        <div className="absolute -top-20 right-1/4 w-[360px] h-[360px] rounded-full bg-amber-400 blur-[110px]" />
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-10 shrink-0">
        {/* Brand Logo with Glow */}
        <div className="flex items-center space-x-3 space-x-reverse group cursor-default">
          <PlatformLogo size={46} />
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                إديوتك
              </span>
              <span className="text-[11px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/40">
                EduTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              المنصة التعليمية التفاعلية الذكية
            </p>
          </div>
        </div>

        {/* Theme Toggle Button (كبس زر لمبة مائي لشمس وقمر) */}
        <ThemeToggle />
      </header>

      {/* Main Centered Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6 z-10 w-full">
        <div className="w-full max-w-md my-auto">
          {/* Card Outer Elevation Frame */}
          <div className="relative group">
            {/* Subtle Golden Ambient Aura around the card */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-[#FFCB74]/30 to-transparent rounded-[32px] blur-sm opacity-50 dark:opacity-40 group-hover:opacity-75 transition duration-500" />
            
            <div className="relative bg-white dark:bg-[#2F2F2F] border border-slate-200/90 dark:border-[#3d3d3d] rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
              
              {/* Optional Segmented Tab Switcher (Login / Register) */}
              {activeTab && onTabChange && (
                <div className="flex items-center p-1 mb-6 rounded-2xl bg-slate-100 dark:bg-[#222222] border border-slate-200/80 dark:border-[#383838]">
                  <button
                    type="button"
                    onClick={() => onTabChange('login')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                      activeTab === 'login'
                        ? 'bg-[#FFCB74] text-[#111111] shadow-md shadow-[#FFCB74]/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    type="button"
                    onClick={() => onTabChange('register')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                      activeTab === 'register'
                        ? 'bg-[#FFCB74] text-[#111111] shadow-md shadow-[#FFCB74]/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    إنشاء حساب جديد
                  </button>
                </div>
              )}

              {/* Card Header Title */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 text-[#FFCB74] mb-2.5 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  {subtitle}
                </p>
              </div>

              {/* Inner Form Content */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-[11px] text-slate-400 dark:text-slate-500 shrink-0 z-10">
        <span>© 2026 إديوتك EduTech. جميع الحقوق محفوظة.</span>
      </footer>
    </div>
  );
};
