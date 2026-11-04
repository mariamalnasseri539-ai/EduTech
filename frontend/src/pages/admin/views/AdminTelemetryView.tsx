import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_AI_TELEMETRY, INITIAL_AI_LOGS } from '../data/telemetryData';
import { AiTelemetryData, AiLogEntry } from '../types';

export const AdminTelemetryView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<AiTelemetryData>(INITIAL_AI_TELEMETRY);
  const [logs] = useState<AiLogEntry[]>(INITIAL_AI_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    // محاكاة جلب التيليميتري المباشر من مسار /api/admin/telemetry
    setTimeout(() => {
      setIsRefreshing(false);
      setTelemetry((prev) => ({
        ...prev,
        dailyTotalSynthesized: prev.dailyTotalSynthesized + 1,
        averageSynthesisLatencyMs: Math.floor(1200 + Math.random() * 80),
      }));
    }, 700);
  };

  const filteredLogs = logs.filter(
    (l) => filterStatus === 'all' || l.status === filterStatus
  );

  const getStatusBadge = (status: AiLogEntry['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>نجاح فوري (SUCCESS)</span>
          </span>
        );
      case 'HEALED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>تعافٍ ذاتي (HEALED)</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>فشل التوليد (FAILED)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn" dir="rtl">
      {/* 1. الترويسة الرئيسية */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              AI ENGINE & GEMINI TELEMETRY
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Zero-Content Engine Active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            مراقبة نشاط وأداء أنظمة الذكاء الاصطناعي
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            متابعة لحظية لعمليات التوليد التكيفي، ومعدلات الدقة والامتثال للمخططات، وسرعة استجابة Google Gemini 1.5.
          </p>
        </div>

        {/* زر التحديث السريع */}
        <button
          onClick={handleRefreshTelemetry}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>تحديث سجل التيليميتري</span>
        </button>
      </div>

      {/* 2. بطاقات الإحصاءات الأربع لنشاط الذكاء الاصطناعي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              معدل دقة الامتثال للمخطط
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {telemetry.generationComplianceRate}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              JSON Schema Draft 2020-12
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              متوسط سرعة التوليد اللحظي
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {telemetry.averageSynthesisLatencyMs}
              <span className="text-sm font-normal text-slate-400 mr-1">ms</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Average Synthesis Latency
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              معدل الاستشفاء الذاتي
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-[#FFCB74] font-mono">
              {telemetry.selfHealingRetryRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Self-Healing Retry Rate
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 flex items-center justify-center text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
              العمليات المولدة اليوم
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
              {telemetry.dailyTotalSynthesized}
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
              دروس وتمارين مخصصة
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 flex items-center justify-center text-purple-600">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. بطاقة ضمانات معمارية المحتوى الصفري ونموذج Gemini */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#FFCB74]" />
            <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
              خصائص محرك التوليد الآلي وضمانات الـ Zero-Content
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200">
            API Endpoints Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-1">
            <span className="text-slate-400 font-semibold block">المحرك المعتمد:</span>
            <span className="text-sm font-bold text-[#2F2F2F] dark:text-white font-mono block">
              {telemetry.engine}
            </span>
            <span className="text-[11px] text-slate-500 block">
              وضع الإخراج المهيكل (Structured JSON Outputs)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-1">
            <span className="text-slate-400 font-semibold block">درجة الحرارة (Temperature):</span>
            <span className="text-sm font-bold text-[#2F2F2F] dark:text-[#FFCB74] font-mono block">
              {telemetry.temperature} (High Determinism)
            </span>
            <span className="text-[11px] text-slate-500 block">
              درجة تشتت منخفضة لضمان دقة الشروحات العلمية
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-1">
            <span className="text-slate-400 font-semibold block">ضمان المحتوى الصفري:</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
              {telemetry.zeroContentGuarantee}
            </span>
            <span className="text-[11px] text-slate-500 block">
              توليد 100% آني مخصص لكل طالب بناءً على نطاق ZPD
            </span>
          </div>
        </div>
      </div>

      {/* 4. سجل عمليات التوليد والـ Stream اللحظي */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                سجل عمليات وطلبات الذكاء الاصطناعي (AI Synthesis Stream)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Live Transaction Log & Schema Validation Stream
              </p>
            </div>
          </div>

          {/* فلاتر الحالة */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              جميع الطلبات
            </button>
            <button
              onClick={() => setFilterStatus('SUCCESS')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'SUCCESS'
                  ? 'bg-white dark:bg-[#1E1E1E] text-emerald-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              ناجحة
            </button>
            <button
              onClick={() => setFilterStatus('HEALED')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterStatus === 'HEALED'
                  ? 'bg-white dark:bg-[#1E1E1E] text-amber-600 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              استشفاء ذاتي
            </button>
          </div>
        </div>

        {/* جدول السجلات */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2F2F2F]">
          <table className="w-full text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] dark:bg-[#252525] border-b border-slate-200 dark:border-[#2F2F2F] text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-3 px-4">الوقت</th>
                <th className="py-3 px-4">العملية المنفذة</th>
                <th className="py-3 px-4">النموذج</th>
                <th className="py-3 px-4">زمن الاستجابة</th>
                <th className="py-3 px-4">الموضوع / الطالب</th>
                <th className="py-3 px-4 text-center">حالة المطابقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#262626]">
              {filteredLogs.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-[#F6F6F6]/60 dark:hover:bg-[#252525]/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-xs">
                    {entry.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#2F2F2F] dark:text-white">
                    {entry.action}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-purple-600 dark:text-purple-400 font-bold">
                    {entry.model}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#2F2F2F] dark:text-[#FFCB74]">
                    {entry.latencyMs} ms
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-mono text-slate-600 dark:text-slate-300 block">
                      {entry.topicId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Student: {entry.studentId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(entry.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTelemetryView;

