import React from 'react';
import { Menu, Shield, LogOut, ChevronLeft } from 'lucide-react';
import { AdminSection } from '../types';
import { PlatformLogo } from '../../../components/common/PlatformLogo';
import { ThemeToggle } from '../../../components/common/ThemeToggle';
import { useAuth } from '../../../context/AuthContext';

interface AdminHeaderProps {
  currentSection: AdminSection;
  onOpenMobileSidebar: () => void;
  onBackToWelcome?: () => void;
}

const SECTION_TITLES: Record<AdminSection, { ar: string; en: string }> = {
  overview: { ar: 'نظرة عامة والمؤشرات', en: 'Overview & Key Metrics' },
  users: { ar: 'المستخدمين والصلاحيات', en: 'Users & Permissions' },
  cohort: { ar: 'تحليلات الدفعة المعرفية', en: 'Cohort Analytics' },
  courses: { ar: 'المقررات وخرائط المنهج', en: 'Courses & Topic Maps' },
  telemetry: { ar: 'مراقبة الذكاء الاصطناعي', en: 'AI Telemetry' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSection,
  onOpenMobileSidebar,
  onBackToWelcome,
}) => {
  const { userProfile, role, logout } = useAuth();

  const adminName = userProfile?.display_name || userProfile?.email?.split('@')[0] || 'مسؤول المنصة';
  const adminEmail = userProfile?.email || 'admin@edutech.edu';
  const sectionInfo = SECTION_TITLES[currentSection];

  return (
    <header
      className="sticky top-0 z-30 w-full h-18 bg-white dark:bg-[#181818] border-b border-slate-200 dark:border-[#2F2F2F] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs transition-colors duration-200"
      dir="rtl"
    >
      {/* الجزء الأيمن: زر فتح القائمة (موبايل) + الشعار + مسار الصفحة النشطة */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* زر السايد بار في الشاشات الصغيرة */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#2F2F2F] hover:bg-slate-200 dark:hover:bg-[#383838] flex items-center justify-center text-[#2F2F2F] dark:text-white transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* الشعار واسم اللوحة */}
        <div className="flex items-center gap-3">
          <PlatformLogo size={36} />
          <div className="hidden sm:block text-right">
            <h1 className="text-sm font-black text-[#2F2F2F] dark:text-white leading-tight">
              لوحة تحكم الإدارة
            </h1>
            <p className="text-[10px] text-[#2F2F2F]/60 dark:text-slate-400 font-mono">
              EduTech Admin Portal
            </p>
          </div>
        </div>

        {/* فاصل ومسار الصفحة النشطة (Breadcrumb) */}
        <div className="hidden md:flex items-center gap-2 pr-3 mr-1 border-r border-slate-200 dark:border-[#2F2F2F]">
          <span className="text-xs text-slate-400">القسم:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F6F6F6] dark:bg-[#262626] border border-slate-200 dark:border-[#333333]">
            <span className="text-xs font-bold text-[#2F2F2F] dark:text-white">
              {sectionInfo.ar}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden xl:inline">
              ({sectionInfo.en})
            </span>
          </div>
        </div>
      </div>

      {/* الجزء الأيسر: زر العودة + تبديل الثيم + ملف الأدمن وسجل الخروج */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* زر العودة للشاشة الرئيسية (إن وُجد) */}
        {onBackToWelcome && (
          <button
            onClick={onBackToWelcome}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2F2F2F] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2F2F2F] transition-colors"
            title="العودة للشاشة الترحيبية"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
        )}

        {/* مفتاح الثيم المائي المعتمد */}
        <ThemeToggle />

        {/* فاصل */}
        <div className="h-7 w-px bg-slate-200 dark:bg-[#2F2F2F] hidden sm:block" />

        {/* معلومات حساب الأدمن */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#FFCB74]/20 border-2 border-[#FFCB74] flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74] font-bold text-sm shadow-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span
              className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#181818]"
              title="متصل"
            />
          </div>

          <div className="hidden sm:flex flex-col text-right">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2F2F2F] dark:text-white leading-tight">
                {adminName}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#FFCB74] text-[#111111]">
                <Shield className="w-2.5 h-2.5" />
                <span>{role === 'ADM' ? 'أدمن' : 'مشرف'}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[130px]">
              {adminEmail}
            </span>
          </div>

          {/* زر تسجيل الخروج السريع */}
          <button
            onClick={logout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mr-1"
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

