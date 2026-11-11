import React, { useState } from 'react';
import {
  TrendingUp,
  Brain,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  BarChart3,
  Award,
  ArrowUpRight,
  Lightbulb
} from 'lucide-react';
import { COHORT_DATA_MAP } from '../data/cohortData';

export const AdminCohortAnalyticsView: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs-advanced-js');
  const [remediationToast, setRemediationToast] = useState<string | null>(null);

  const cohort = COHORT_DATA_MAP[selectedCourseId] || COHORT_DATA_MAP['cs-advanced-js'];

  const triggerRemediation = (conceptTag: string) => {
    setRemediationToast(`تم جدولة محفز علاجي بالذكاء الاصطناعي لمفهوم "${conceptTag}" لجميع الطلاب المتأثرين.`);
    setTimeout(() => {
      setRemediationToast(null);
    }, 4000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            حرج جداً (Critical)
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            أولوية عالية (High)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            متوسط (Medium)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn" dir="rtl">
      {/* إشعار التوليد العلاجي اللحظي */}
      {remediationToast && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#111111] text-white border border-[#FFCB74] shadow-2xl flex items-center gap-3 animate-slideUp">
          <Sparkles className="w-5 h-5 text-[#FFCB74] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{remediationToast}</span>
        </div>
      )}

      {/* 1. الترويسة واختيار المقرر المعني */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              COHORT DIAGNOSTICS & ANALYTICS
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200">
              تحليل بايز المعرفي للدفعة
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            تحليلات أداء الدفعة واستيعاب المفاهيم
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            مراقبة جماعية لمعدلات الإتقان، ونقاط القوة والضعف، وتشخيص المفاهيم الملتبسة لاتخاذ قرارات تربوية مستنيرة.
          </p>
        </div>

        {/* قائمة اختيار المقرر */}
        <div className="flex items-center gap-2 bg-[#F6F6F6] dark:bg-[#252525] p-2 rounded-xl border border-slate-200 dark:border-[#333333] shrink-0">
          <BookOpen className="w-4 h-4 text-[#FFCB74] shrink-0" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-transparent font-bold text-xs sm:text-sm text-[#2F2F2F] dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="cs-advanced-js">Advanced JavaScript Runtime</option>
            <option value="python-basics">أساسيات البرمجة بلغة Python</option>
          </select>
        </div>
      </div>

      {/* 2. بطاقات الإحصاءات الأربع السريعة للمقرر المختار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              إجمالي طلاب الدفعة
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {cohort.totalStudents}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Enrolled in Cohort
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              متوسط إتقان المقرر
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {cohort.averageMastery}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              +4.8% مقارنة بالأسبوع الماضي
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              طلاب أتموا الإتقان الكامل
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {cohort.cognitiveStatusDistribution.Mastered}
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
              حالة Mastered
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 flex items-center justify-center text-purple-600">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              طلاب بحاجة مراجعة موجهة
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {cohort.cognitiveStatusDistribution.GuidedReview}
            </span>
            <span className="text-[10px] text-rose-500 font-bold block mt-0.5">
              Guided Review State
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. مقارنة مستويات إتقان الموضوعات في المنهج */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                مقارنة مستويات التحصيل وإتقان الموضوعات (Topic Mastery DAG)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Average Mastery Breakdown Across Syllabus Topics
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            {cohort.topicMastery.length} مواضيع في المسار
          </span>
        </div>

        <div className="space-y-4">
          {cohort.topicMastery.map((topic) => (
            <div
              key={topic.topicId}
              className="p-4 rounded-xl bg-[#F6F6F6]/60 dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#FFCB74] text-[#111111] font-bold text-xs flex items-center justify-center">
                    #
                  </span>
                  <span className="font-bold text-[#2F2F2F] dark:text-white text-xs sm:text-sm">
                    {topic.topicTitle}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#333333] text-slate-600 dark:text-slate-300">
                    مستوى: {topic.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    تم تقييم: <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">{topic.studentsAssessed}</span> طالب
                  </span>
                  <span className="text-sm font-black font-mono text-[#2F2F2F] dark:text-[#FFCB74]">
                    {topic.averageScore}%
                  </span>
                </div>
              </div>

              {/* شريط الإتقان */}
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#333333] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    topic.averageScore >= 85
                      ? 'bg-emerald-500'
                      : topic.averageScore >= 70
                      ? 'bg-[#FFCB74]'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${topic.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. مصفوفة نقاط القوة والضعف البيداغوجية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نقاط القوة */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
              أبرز نقاط القوة لدى الدفعة (Cohort Strengths)
            </h3>
          </div>
          <div className="space-y-3">
            {cohort.strengths.map((str, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* نقاط الضعف */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
              نقاط الضعف التي تستلزم تدخلاً بيداغوجياً (Weakness Points)
            </h3>
          </div>
          <div className="space-y-3">
            {cohort.weaknesses.map((weak, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40 text-xs sm:text-sm font-semibold text-rose-900 dark:text-rose-200 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  !
                </div>
                <span>{weak}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. تشخيص المفاهيم الخاطئة الشائعة (Frequent Misconceptions) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#FFCB74]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                تشخيص المفاهيم الأكثر صعوبة والالتباسات المتكررة (Frequent Misconceptions)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Automated Pedagogical Misconception Detection & Remediation Engine
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {cohort.misconceptions.length} تشخيصات نشطة
          </span>
        </div>

        <div className="space-y-4">
          {cohort.misconceptions.map((misc) => (
            <div
              key={misc.id}
              className="p-5 rounded-2xl bg-[#F6F6F6]/80 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-[#2F2F2F] dark:text-white">
                    {misc.conceptTag}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    (الموضوع: {misc.topicTitle})
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span className="text-rose-600 dark:text-rose-400 font-mono font-black">{misc.affectedStudentsCount}</span> طلاب متأثرين
                  </span>
                  {getSeverityBadge(misc.severity)}
                </div>
              </div>

              {/* وصف الصعوبة والالتباس */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {misc.description}
              </p>

              {/* التوصية العلاجية بالذكاء الاصطناعي وزر التنفيذ */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Sparkles className="w-4 h-4 text-[#FFCB74] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2F2F2F] dark:text-white block">
                      التوصية العلاجية المقترحة (AI Synthesis Prompt):
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      {misc.remedialRecommendation}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => triggerRemediation(misc.conceptTag)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>توليد تدريب علاجي</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCohortAnalyticsView;

