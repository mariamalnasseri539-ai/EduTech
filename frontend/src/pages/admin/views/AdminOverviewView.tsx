import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { KpiCardsGrid } from '../components/overview/KpiCardsGrid';
import { CognitiveDistributionChart } from '../components/overview/CognitiveDistributionChart';
import { MasteryProgressionChart } from '../components/overview/MasteryProgressionChart';
import { LearningActivityChart } from '../components/overview/LearningActivityChart';
import { RecentActivityTable } from '../components/overview/RecentActivityTable';
import { SystemAlertsCard } from '../components/overview/SystemAlertsCard';

interface AdminOverviewViewProps {
  onNavigateToSection?: (section: 'cohort' | 'telemetry' | 'users') => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({ onNavigateToSection }) => {
  const { userProfile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState('الآن');

  const adminName = userProfile?.display_name || 'مسؤول المنصة';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshedTime(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 600);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn" dir="rtl">
      {/* 1. الترويسة الترحيبية ومؤشر الاتصال */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              EDUTECH ANALYTICS HUB
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>مباشر • Live Telemetry</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            مرحباً بك، <span className="text-[#2F2F2F] dark:text-[#FFCB74]">{adminName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            لوحة الإشراف والمؤشرات اللحظية لمتابعة حالات المعرفة ونشاط المحتوى التوليدي.
          </p>
        </div>

        {/* أزرار الإجراءات السريعة ومؤشر Gemini */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#262626] border border-slate-200 dark:border-[#333333] text-xs">
            <Cpu className="w-4 h-4 text-[#FFCB74]" />
            <span className="text-slate-500 dark:text-slate-400">نموذج الذكاء:</span>
            <span className="font-bold text-[#2F2F2F] dark:text-white font-mono">
              Gemini 1.5 Pro (JSON 2020-12)
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#FFCB74] text-[#111111] shadow-[0_2px_10px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>تحديث المؤشرات</span>
            <span className="text-[10px] text-[#111111]/70 font-mono">({lastRefreshedTime})</span>
          </button>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات الخمس الرئيسية (KPI Cards) */}
      <KpiCardsGrid />

      {/* 3. شبكة الرسوم البيانية: توزيع الحالات المعرفية + تطور مستوى الإتقان */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع الحالات المعرفية (Mastered, ActiveLearning, GuidedReview, Assessing, Unassessed) */}
        <CognitiveDistributionChart />

        {/* تطور مستوى إتقان الطلاب ومستويات الأداء */}
        <MasteryProgressionChart />
      </div>

      {/* 4. نشاط الطلاب والتعلّم التكيفي الأسبوعي */}
      <LearningActivityChart />

      {/* 5. قسم النشاط الأخير وقسم التنبيهات (جنباً إلى جنب على الشاشات الكبيرة) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* جدول آخر العمليات والأنشطة (7 أعمدة) */}
        <div className="xl:col-span-7">
          <RecentActivityTable />
        </div>

        {/* قسم التنبيهات الأكاديمية والتقنية (5 أعمدة) */}
        <div className="xl:col-span-5">
          <SystemAlertsCard onNavigateToSection={onNavigateToSection} />
        </div>
      </div>

      {/* بطاقة الخاتمة البيداغوجية */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            معمارية المحتوى الصفري (Zero-Content Cloud Architecture) مفعلة • يتم توليد المحتوى التعليمي
            والاختبارات آنياً للطلاب مع تقييم مستمر لمؤشر ZPD.
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-[#2F2F2F] dark:text-[#FFCB74]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EduTech System Healthy</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewView;

