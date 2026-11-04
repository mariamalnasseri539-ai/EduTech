import React, { useState } from 'react';
import { Brain, Info, PieChart } from 'lucide-react';
import { COGNITIVE_STATUS_DATA, CognitiveStatusItem } from '../../data/overviewData';

export const CognitiveDistributionChart: React.FC = () => {
  const [hoveredStatus, setHoveredStatus] = useState<CognitiveStatusItem | null>(null);

  const totalStudents = COGNITIVE_STATUS_DATA.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col justify-between">
      <div>
        {/* الترويسة */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <Brain className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
                توزيع الطلاب حسب الحالة المعرفية
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Cognitive Status Distribution (ZPD Engine)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F6F6F6] dark:bg-[#262626] text-xs font-bold text-[#2F2F2F] dark:text-slate-300">
            <PieChart className="w-3.5 h-3.5 text-[#FFCB74]" />
            <span>{totalStudents} طالباً</span>
          </div>
        </div>

        {/* شريط التوزيع المدمج المتعدد الألوان */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>النسب الإجمالية للدفعة</span>
            <span>
              {hoveredStatus
                ? `${hoveredStatus.labelAr}: ${hoveredStatus.percentage}% (${hoveredStatus.count} طالب)`
                : 'مرر على أي شريحة لتفاصيل إضافية'}
            </span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-[#2A2A2A] overflow-hidden flex shadow-inner">
            {COGNITIVE_STATUS_DATA.map((item) => (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredStatus(item)}
                onMouseLeave={() => setHoveredStatus(null)}
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300 hover:brightness-110 cursor-pointer relative group"
                title={`${item.labelAr}: ${item.count} طلاب (${item.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* قائمة تفصيل الحالات الخمس المعرفية */}
        <div className="mt-6 space-y-2.5">
          {COGNITIVE_STATUS_DATA.map((item) => {
            const isHovered = hoveredStatus?.key === item.key;
            return (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredStatus(item)}
                onMouseLeave={() => setHoveredStatus(null)}
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isHovered
                    ? 'border-[#FFCB74] bg-[#FFCB74]/10 dark:bg-[#FFCB74]/5 shadow-xs'
                    : 'border-slate-100 dark:border-[#2A2A2A] bg-[#F6F6F6]/60 dark:bg-[#242424]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col text-right">
                    <span className="text-xs sm:text-sm font-bold text-[#2F2F2F] dark:text-white">
                      {item.labelAr}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.labelEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.count} طالباً
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-black min-w-11 text-center"
                    style={{
                      backgroundColor: `${item.color}25`,
                      color: item.color,
                    }}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* شريط توضيحي سفلي */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center gap-2 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-[#FFCB74] shrink-0" />
        <span>
          يتم تصنيف الحالات لحظياً وفق خوارزمية بايز المعرفية (Bayesian Knowledge Tracing).
        </span>
      </div>
    </div>
  );
};

export default CognitiveDistributionChart;

