import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      dir="ltr"
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"}
      title={isDark ? "التحويل للوضع الفاتح" : "التحويل للوضع الليلي"}
      className={`group relative inline-flex h-9 w-[72px] shrink-0 items-center rounded-full p-1 transition-all duration-300 ease-in-out cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCB74] ${
        isDark
          ? "bg-[#181818]/90 border border-[#383838] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
          : "bg-slate-200/90 border border-slate-300 shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)]"
      } backdrop-blur-md hover:scale-105 ${className}`}
    >
      {/* Liquid Water Droplet Gloss Reflection (تأثير انعكاس الماء الزجاجي) */}
      <span className="absolute inset-x-2 top-0.5 h-[35%] rounded-full bg-gradient-to-b from-white/40 dark:from-white/15 to-transparent pointer-events-none" />

      {/* Sun Icon on Left */}
      <span className="flex-1 flex justify-center items-center z-0 transition-opacity duration-300">
        <Sun
          className={`h-4 w-4 transition-transform duration-300 ${
            !isDark ? "text-amber-500 scale-110 drop-shadow-[0_0_6px_rgba(255,203,116,0.8)]" : "text-slate-400 opacity-30 scale-90"
          }`}
        />
      </span>

      {/* Moon Icon on Right */}
      <span className="flex-1 flex justify-center items-center z-0 transition-opacity duration-300">
        <Moon
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            isDark ? "text-[#FFCB74] scale-110 drop-shadow-[0_0_6px_rgba(255,203,116,0.8)]" : "text-slate-400 opacity-30 scale-90"
          }`}
        />
      </span>

      {/* Fluid / Glass Sliding Switch Knob (كبس زر اللمبة المنزلق داخل الماء) */}
      <span
        className={`absolute top-1 bottom-1 w-7 rounded-full transition-transform duration-300 ease-out flex items-center justify-center shadow-md ${
          isDark
            ? "translate-x-[36px] bg-gradient-to-b from-[#2F2F2F] to-[#202020] border border-[#FFCB74]/40 shadow-[0_2px_8px_rgba(255,203,116,0.3)]"
            : "translate-x-0 bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        }`}
      >
        {/* Soft Knob Water Droplet Sheen */}
        <span className="absolute inset-x-1 top-0.5 h-2 rounded-full bg-white/50 dark:bg-white/15 pointer-events-none" />
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-[#FFCB74] animate-pulse" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
