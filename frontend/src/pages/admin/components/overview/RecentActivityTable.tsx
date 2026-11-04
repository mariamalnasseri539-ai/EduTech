import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Code2,
  FileText,
  UserPlus,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { RECENT_ACTIVITIES, RecentActivityItem } from '../../data/overviewData';

export const RecentActivityTable: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredActivities = RECENT_ACTIVITIES.filter((item) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'completion' && item.type === 'course_completion') ||
      (filterType === 'quizzes' && item.type === 'quiz') ||
      (filterType === 'code' && item.type === 'code') ||
      (filterType === 'registration' && item.type === 'registration');

    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const renderActivityIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'course_completion':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'code':
        return <Code2 className="w-4 h-4 text-purple-500" />;
      case 'quiz':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'registration':
        return <UserPlus className="w-4 h-4 text-amber-500" />;
      case 'lesson_request':
        return <Sparkles className="w-4 h-4 text-[#FFCB74]" />;
    }
  };

  const getBadgeStyle = (badgeType: RecentActivityItem['badgeType']) => {
    switch (badgeType) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
      {/* الترويسة وأدوات التصفية والبحث */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
            <History className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
              آخر النشاطات الأكاديمية والعمليات
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Live Feed • Recent Student Engagements & Milestones
            </p>
          </div>
        </div>

        {/* حقل البحث وأزرار التصفية */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* حقل البحث السريع */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم الطالب أو المقرر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 pr-9 pl-3 py-1.5 rounded-xl text-xs bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFCB74]"
            />
          </div>

          {/* تبويبات التصفية */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                  : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('completion')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'completion'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                  : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
              }`}
            >
              الشهادات
            </button>
            <button
              onClick={() => setFilterType('code')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'code'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                  : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
              }`}
            >
              الأكواد
            </button>
            <button
              onClick={() => setFilterType('quizzes')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterType === 'quizzes'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                  : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
              }`}
            >
              الاختبارات
            </button>
          </div>
        </div>
      </div>

      {/* جدول/قائمة النشاطات */}
      <div className="mt-4 divide-y divide-slate-100 dark:divide-[#262626]">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            لا توجد نشاطات مطابقة لمعايير البحث.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F6F6F6]/60 dark:hover:bg-[#252525]/40 px-2 rounded-xl transition-colors"
            >
              {/* الطالب والنشاط */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center font-bold text-sm text-[#2F2F2F] dark:text-[#FFCB74] shrink-0">
                  {act.avatarLetter}
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#2F2F2F] dark:text-white">
                      {act.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      • {act.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {renderActivityIcon(act.type)}
                    <span className="font-semibold">{act.title}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none">
                      {act.courseTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* الشارة والوقت (في الجوال) */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pr-12 sm:pr-0">
                <span className="sm:hidden text-[10px] text-slate-400 font-mono">
                  {act.timestamp}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeStyle(
                    act.badgeType
                  )}`}
                >
                  {act.badgeText}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* أسفل القائمة */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-[#FFCB74]" />
          <span>يتم تحديث سجل العمليات آنياً من مستودع Firebase و Firestore.</span>
        </div>
        <span className="font-mono text-[11px]">
          عرض {filteredActivities.length} من {RECENT_ACTIVITIES.length} سجل
        </span>
      </div>
    </div>
  );
};

export default RecentActivityTable;

