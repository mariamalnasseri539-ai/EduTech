import React from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BookOpen,
  Cpu,
  X,
  Shield,
  Sparkles
} from 'lucide-react';
import { AdminSection, AdminNavItem } from '../types';
import { PlatformLogo } from '../../../components/common/PlatformLogo';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'overview',
    title: 'نظرة عامة',
    subtitle: 'Overview',
    iconName: 'overview',
    badge: 'الرئيسية',
  },
  {
    id: 'users',
    title: 'المستخدمين والصلاحيات',
    subtitle: 'Users & Permissions',
    iconName: 'users',
  },
  {
    id: 'cohort',
    title: 'تحليلات الدفعة',
    subtitle: 'Cohort Analytics',
    iconName: 'cohort',
  },
  {
    id: 'courses',
    title: 'المقررات وخرائط المنهج',
    subtitle: 'Courses & Topic Maps',
    iconName: 'courses',
  },
  {
    id: 'telemetry',
    title: 'مراقبة الذكاء الاصطناعي',
    subtitle: 'AI Telemetry',
    iconName: 'telemetry',
    badge: 'Gemini 1.5',
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
}) => {
  const renderIcon = (iconName: AdminNavItem['iconName'], isActive: boolean) => {
    const iconClass = `w-5 h-5 shrink-0 transition-colors ${
      isActive ? 'text-[#111111]' : 'text-slate-500 dark:text-slate-400 group-hover:text-[#2F2F2F] dark:group-hover:text-[#FFCB74]'
    }`;

    switch (iconName) {
      case 'overview':
        return <LayoutDashboard className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'cohort':
        return <TrendingUp className={iconClass} />;
      case 'courses':
        return <BookOpen className={iconClass} />;
      case 'telemetry':
        return <Cpu className={iconClass} />;
      default:
        return <Shield className={iconClass} />;
    }
  };

  return (
    <>
      {/* ستارة التعتيم للشاشات الصغيرة عند فتح القائمة */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* شريط السايد بار الرئيسي للأدمن */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#181818] border-l border-slate-200 dark:border-[#2F2F2F] z-50 flex flex-col justify-between py-6 px-4 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="flex flex-col gap-6">
          {/* ترويسة السايد بار مع الشعار وزر الإغلاق في الموبايل */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2F2F2F]">
            <div className="flex items-center gap-3">
              <PlatformLogo size={42} />
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-[#2F2F2F] dark:text-white leading-tight">
                    إديوتك
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40">
                    أدمن
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  لوحة تحكم الإدارة
                </p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F] transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* قائمة أقسام الأدمن المعتمدة */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
              أقسام الإدارة والتحكم
            </span>

            {NAV_ITEMS.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  className={`group w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFCB74] text-[#111111] font-bold shadow-[0_2px_12px_rgba(255,203,116,0.35)] scale-[1.01]'
                      : 'text-[#2F2F2F] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#262626] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {renderIcon(item.iconName, isActive)}
                    <div className="flex flex-col text-right">
                      <span className="text-xs sm:text-sm leading-tight">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono leading-none mt-0.5 ${
                          isActive
                            ? 'text-[#111111]/70'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-tight ${
                        isActive
                          ? 'bg-[#111111] text-[#FFCB74]'
                          : 'bg-[#FFCB74]/15 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* بطاقة معلومات النظام بأسفل السايد بار */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#2F2F2F]">
          <div className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#202020] border border-slate-200/80 dark:border-[#2F2F2F]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" />
              <span className="text-xs font-bold text-[#2F2F2F] dark:text-white">
                بوابة الإشراف الذكية
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              إدارة المحتوى الصفري ومتابعة حالات التعلّم لجميع الطلاب.
            </p>
          </div>
          <div className="mt-3 text-[10px] text-center text-slate-400 dark:text-slate-500 font-mono">
            EduTech Admin • v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

