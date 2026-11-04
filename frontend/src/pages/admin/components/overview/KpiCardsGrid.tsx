import React from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  Cpu,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { OVERVIEW_KPIS, KpiMetric } from '../../data/overviewData';

export const KpiCardsGrid: React.FC = () => {
  const renderIcon = (iconName: KpiMetric['iconName']) => {
    switch (iconName) {
      case 'students':
        return <Users className="w-5 h-5 text-[#2F2F2F] dark:text-[#FFCB74]" />;
      case 'courses':
        return <BookOpen className="w-5 h-5 text-[#2F2F2F] dark:text-[#FFCB74]" />;
      case 'mastery':
        return <TrendingUp className="w-5 h-5 text-[#2F2F2F] dark:text-[#FFCB74]" />;
      case 'activities':
        return <Activity className="w-5 h-5 text-[#2F2F2F] dark:text-[#FFCB74]" />;
      case 'ai':
        return <Cpu className="w-5 h-5 text-[#2F2F2F] dark:text-[#FFCB74]" />;
    }
  };

  return (
    <section className="w-full" aria-label="مؤشرات الأداء الرئيسية">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FFCB74]" />
          <h2 className="text-sm font-bold text-[#2F2F2F] dark:text-white">
            المؤشرات الأكاديمية والتشغيلية الرئيسية (KPIs)
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Live System Overview
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {OVERVIEW_KPIS.map((kpi) => (
          <div
            key={kpi.id}
            className="group bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs hover:shadow-md hover:border-[#FFCB74]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* الترويسة العلوية للبطاقة: الأيقونة ونسبة النمو */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {renderIcon(kpi.iconName)}
                </div>

                <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/40">
                  <ArrowUpRight className="w-3 h-3" />
                  <span dir="ltr">{kpi.change}</span>
                </div>
              </div>

              {/* القيمة الإحصائية */}
              <div className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white tracking-tight mb-1">
                {kpi.value}
              </div>

              {/* المسمى الوظيفي للبطاقة */}
              <h3 className="text-xs sm:text-sm font-bold text-[#2F2F2F] dark:text-slate-200 leading-snug">
                {kpi.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {kpi.enTitle}
              </p>
            </div>

            {/* تفاصيل إضافية أسفل البطاقة */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="truncate">{kpi.subText}</span>
              <Sparkles className="w-3 h-3 text-[#FFCB74] shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KpiCardsGrid;

