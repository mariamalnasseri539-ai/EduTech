import React, { useState } from 'react';
import { TrendingUp, Award, Sparkles } from 'lucide-react';
import {
  MASTERY_PROGRESSION_POINTS,
  PERFORMANCE_LEVELS,
} from '../../data/overviewData';

export const MasteryProgressionChart: React.FC = () => {
  const [activePointIndex, setActivePointIndex] = useState<number>(
    MASTERY_PROGRESSION_POINTS.length - 1
  );

  // حساب إحداثيات منحنى الـ SVG
  // العرض 400، الارتفاع 160
  // النطاق Y من 50 إلى 90
  const width = 460;
  const height = 150;
  const paddingX = 40;
  const paddingY = 25;

  const minY = 55;
  const maxY = 85;

  const points = MASTERY_PROGRESSION_POINTS.map((pt, i) => {
    const x =
      paddingX +
      (i * (width - paddingX * 2)) / (MASTERY_PROGRESSION_POINTS.length - 1);
    const y =
      height -
      paddingY -
      ((pt.score - minY) / (maxY - minY)) * (height - paddingY * 2);
    return { x, y, score: pt.score, week: pt.week };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col justify-between">
      <div>
        {/* الترويسة */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
                تطور مستوى إتقان الطلاب
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Cohort Academic Mastery Growth
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>+16.4% نمو إجمالي</span>
          </div>
        </div>

        {/* رسم بياني SVG تفاعلي لمنحنى النمو */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>منحنى الإتقان الأسبوعي (متوسط الدرجات)</span>
            <span className="font-bold text-[#2F2F2F] dark:text-[#FFCB74]">
              {points[activePointIndex].week}: {points[activePointIndex].score}%
            </span>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-40 overflow-visible"
            >
              <defs>
                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFCB74" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FFCB74" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* خطوط الشبكة الأفقية */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={width - paddingX}
                y2={paddingY}
                stroke="#888888"
                strokeOpacity="0.15"
                strokeDasharray="4,4"
              />
              <line
                x1={paddingX}
                y1={height / 2}
                x2={width - paddingX}
                y2={height / 2}
                stroke="#888888"
                strokeOpacity="0.15"
                strokeDasharray="4,4"
              />
              <line
                x1={paddingX}
                y1={height - paddingY}
                x2={width - paddingX}
                y2={height - paddingY}
                stroke="#888888"
                strokeOpacity="0.25"
              />

              {/* المساحة المظللة بالذهبي */}
              <path d={areaD} fill="url(#goldAreaGrad)" />

              {/* خط المنحنى الذهبي */}
              <path
                d={pathD}
                fill="none"
                stroke="#FFCB74"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* نقاط القياس التفاعلية */}
              {points.map((pt, idx) => {
                const isActive = activePointIndex === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setActivePointIndex(idx)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? 7 : 4.5}
                      fill={isActive ? '#111111' : '#FFFFFF'}
                      stroke="#FFCB74"
                      strokeWidth={isActive ? 3 : 2}
                      className="transition-all duration-200"
                    />
                    <text
                      x={pt.x}
                      y={height - 5}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {pt.week}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* توزيع مستويات الأداء الأربعة */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#FFCB74]" />
              <span>توزيع مستويات أداء الطلاب</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Performance Level Distribution
            </span>
          </div>

          <div className="space-y-2.5">
            {PERFORMANCE_LEVELS.map((level, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {level.label}
                  </span>
                  <span className={`font-bold font-mono ${level.text}`}>
                    {level.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#2A2A2A] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${level.color}`}
                    style={{ width: `${level.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryProgressionChart;

