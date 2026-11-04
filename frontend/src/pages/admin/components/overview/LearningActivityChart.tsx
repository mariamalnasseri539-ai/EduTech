import React, { useState } from 'react';
import { BarChart3, Calendar, Layers } from 'lucide-react';
import { WEEKLY_ACTIVITY_DATA } from '../../data/overviewData';

export const LearningActivityChart: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5); // الخميس كافتراضي

  const maxTotal = 250; // سقف المقياس

  const selectedDay = WEEKLY_ACTIVITY_DATA[selectedDayIndex];

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
              نشاط الطلاب والتعلّم التكيفي خلال الأسبوع
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Daily Student Learning Engagements (Weekly Activity)
            </p>
          </div>
        </div>

        {/* دليل الألوان (Legend) */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FFCB74]" />
            <span className="text-slate-600 dark:text-slate-300">دروس مولدة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            <span className="text-slate-600 dark:text-slate-300">اختبارات تشخيصية</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">تمارين برمجية</span>
          </div>
        </div>
      </div>

      {/* أعمدة النشاط البيانية */}
      <div className="mt-6">
        <div className="h-52 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6">
          {WEEKLY_ACTIVITY_DATA.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            const total = item.lessonsGenerated + item.quizzes + item.codeChallenges;
            const heightPercent = Math.min(100, Math.round((total / maxTotal) * 100));

            return (
              <div
                key={item.day}
                onClick={() => setSelectedDayIndex(idx)}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* إحصائية اليوم عند التحديد أو التمرير */}
                <div
                  className={`text-[10px] font-mono font-bold transition-opacity duration-200 ${
                    isSelected ? 'text-[#2F2F2F] dark:text-[#FFCB74] opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {total}
                </div>

                {/* العمود متعدد الأقسام */}
                <div
                  className={`w-full max-w-[42px] rounded-xl flex flex-col-reverse overflow-hidden transition-all duration-300 shadow-xs ${
                    isSelected
                      ? 'ring-2 ring-[#FFCB74] ring-offset-2 dark:ring-offset-[#1E1E1E] scale-105'
                      : 'hover:brightness-105 opacity-85 hover:opacity-100'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* قسم التمارين البرمجية */}
                  <div
                    style={{
                      height: `${(item.codeChallenges / total) * 100}%`,
                      backgroundColor: '#3B82F6',
                    }}
                    title={`تمارين برمجية: ${item.codeChallenges}`}
                  />
                  {/* قسم الاختبارات */}
                  <div
                    style={{
                      height: `${(item.quizzes / total) * 100}%`,
                      backgroundColor: '#8B5CF6',
                    }}
                    title={`اختبارات: ${item.quizzes}`}
                  />
                  {/* قسم الدروس المولدة */}
                  <div
                    style={{
                      height: `${(item.lessonsGenerated / total) * 100}%`,
                      backgroundColor: '#FFCB74',
                    }}
                    title={`دروس مولدة: ${item.lessonsGenerated}`}
                  />
                </div>

                {/* اسم اليوم */}
                <span
                  className={`text-xs font-semibold mt-1 transition-colors ${
                    isSelected
                      ? 'text-[#2F2F2F] dark:text-[#FFCB74] font-black'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* تفاصيل اليوم المحدد أسفل الرسم */}
      <div className="mt-6 p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#2F2F2F] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FFCB74]" />
          <span className="text-xs font-bold text-[#2F2F2F] dark:text-white">
            تفاصيل نشاط يوم {selectedDay.day}:
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFCB74]" />
            <span className="text-slate-500 dark:text-slate-400">دروس توليدية:</span>
            <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">
              {selectedDay.lessonsGenerated}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-500 dark:text-slate-400">اختبارات:</span>
            <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">
              {selectedDay.quizzes}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-500 dark:text-slate-400">تمارين كود:</span>
            <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">
              {selectedDay.codeChallenges}
            </span>
          </div>

          <div className="pr-3 mr-1 border-r border-slate-300 dark:border-[#3A3A3A] flex items-center gap-1 font-bold text-[#2F2F2F] dark:text-[#FFCB74]">
            <Layers className="w-3.5 h-3.5" />
            <span>
              إجمالي:{' '}
              {selectedDay.lessonsGenerated + selectedDay.quizzes + selectedDay.codeChallenges}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningActivityChart;

