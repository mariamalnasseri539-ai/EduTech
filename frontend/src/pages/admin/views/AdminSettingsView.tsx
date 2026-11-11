import React from 'react';
import { Sun, Moon, Shield, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { PlatformLogo } from '../../../components/common/PlatformLogo';

export const AdminSettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { userProfile, role } = useAuth();

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6" dir="rtl">
      {/* الترويسة الرئيسية */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              SYSTEM & APPEARANCE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            إعدادات المنصة والمظهر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            تخصيص ثيم الواجهات (الوضع الفاتح / الداكن) وضبط تفضيلات حساب المشرف.
          </p>
        </div>

        <PlatformLogo size={42} showText />
      </div>

      {/* بطاقة التحكم في المظهر والثيم */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-black text-[#2F2F2F] dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFCB74]" />
            <span>مظهر النظام (Theme Mode)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            الوضع الافتراضي المعتمد هو الوضع الفاتح (Light Mode). يمكنك التبديل بحرية وسيتم حفظ تفضيلك فورياً.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* خيار الوضع الفاتح */}
          <button
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border text-right transition-all flex items-start justify-between cursor-pointer ${
              !isDark
                ? 'bg-[#FFCB74]/15 border-[#FFCB74] ring-2 ring-[#FFCB74]/40 shadow-sm'
                : 'bg-slate-50 dark:bg-[#252525] border-slate-200 dark:border-[#333333] hover:border-[#FFCB74]/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-[#2F2F2F] dark:text-white">
                  الوضع الفاتح (Light Mode)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pr-10">
                الوضع الافتراضي الصباحي ذو الخلفيات البيضاء المريحة للقراءة والتركيز.
              </p>
            </div>
            {!isDark && (
              <span className="w-6 h-6 rounded-full bg-[#FFCB74] text-[#111111] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}
          </button>

          {/* خيار الوضع الداكن */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border text-right transition-all flex items-start justify-between cursor-pointer ${
              isDark
                ? 'bg-[#FFCB74]/15 border-[#FFCB74] ring-2 ring-[#FFCB74]/40 shadow-sm'
                : 'bg-slate-50 dark:bg-[#252525] border-slate-200 dark:border-[#333333] hover:border-[#FFCB74]/60'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2F2F2F] text-[#FFCB74] flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-sm font-black text-[#2F2F2F] dark:text-white">
                  الوضع الداكن (Dark Mode)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pr-10">
                الوضع الليلي عالي التباين المصمم لتقليل إجهاد العين أثناء العمل المطول.
              </p>
            </div>
            {isDark && (
              <span className="w-6 h-6 rounded-full bg-[#FFCB74] text-[#111111] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* تفاصيل حساب المشرف الحالي */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
        <h3 className="text-sm font-black text-[#2F2F2F] dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-500" />
          <span>بيانات وصلاحيات المشرف</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333]">
            <span className="text-slate-400 block mb-1">اسم المسؤول:</span>
            <span className="font-bold text-[#2F2F2F] dark:text-white">
              {userProfile?.display_name || 'مسؤول منصة مسار'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333]">
            <span className="text-slate-400 block mb-1">البريد الإلكتروني:</span>
            <span className="font-bold font-mono text-[#2F2F2F] dark:text-white truncate block">
              {userProfile?.email || 'admin@masar.edu'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333]">
            <span className="text-slate-400 block mb-1">مستوى الصلاحية:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {role === 'ADM' ? 'مدير نظام كامل (Super Admin)' : 'مشرف أكاديمي'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsView;
