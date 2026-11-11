import React, { useState } from 'react';
import { AdminSection } from './types';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminOverviewView } from './views/AdminOverviewView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminCohortAnalyticsView } from './views/AdminCohortAnalyticsView';
import { AdminTopicMapsView } from './views/AdminTopicMapsView';
import { AdminPromptsView } from './views/AdminPromptsView';
import { AdminTelemetryView } from './views/AdminTelemetryView';
import { AdminSettingsView } from './views/AdminSettingsView';

interface AdminDashboardProps {
  onBackToWelcome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWelcome }) => {
  // الحالة الداخلية للتحكم في القسم النشط (نفس أسلوب التنقل المعتمد في المشروع)
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

  // حالة فتح وإغلاق السايد بار في الشاشات الصغيرة (Responsive)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#2F2F2F] dark:text-[#FFFFFF] flex font-sans selection:bg-[#FFCB74]/30 overflow-x-hidden relative transition-colors duration-300"
      dir="rtl"
    >
      {/* 1. القائمة الجانبية الموحدة للأدمن (Admin Sidebar) */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(section) => setCurrentSection(section)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. منطقة العمل الرئيسية (المحتوى يمتد بجانب السايد بار في الشاشات الكبيرة) */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72 transition-all duration-300">
        {/* الشريط العلوي الثابت للأدمن (Admin Header) */}
        <AdminHeader
          currentSection={currentSection}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onBackToWelcome={onBackToWelcome}
        />

        {/* جسم الصفحة الرئيسي المخصص لعرض محتوى كل قسم من الأقسام الخمسة */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'overview' && (
            <AdminOverviewView
              onNavigateToSection={(section) => setCurrentSection(section)}
            />
          )}

          {currentSection === 'users' && <AdminUsersView />}

          {currentSection === 'cohort' && <AdminCohortAnalyticsView />}

          {currentSection === 'courses' && <AdminTopicMapsView />}

          {currentSection === 'prompts' && <AdminPromptsView />}

          {currentSection === 'telemetry' && <AdminTelemetryView />}

          {currentSection === 'settings' && <AdminSettingsView />}
        </main>

        {/* تذييل صفحة الأدمن (Footer) */}
        <footer className="w-full py-4 px-6 text-center text-xs border-t border-slate-200 dark:border-[#2F2F2F] bg-white/70 dark:bg-[#181818]/70 text-slate-500 dark:text-slate-400 mt-auto">
          منصة مسار للتعلم التكيفي الذكي • لوحة الإشراف الأكاديمي والتحكم • جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
