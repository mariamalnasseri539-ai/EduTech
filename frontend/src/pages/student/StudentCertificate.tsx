import React from 'react';
import { 
  Sparkles, 
  X, 
  Printer, 
  GraduationCap 
} from 'lucide-react';

export interface CertificateData {
  studentName?: string;
  courseTitle?: string;
  studentLevel?: string;
  masteryPercentage?: number;
  serialNumber?: string;
  issueDate?: string;
}

interface StudentCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  data?: CertificateData;
}

export const StudentCertificate: React.FC<StudentCertificateProps> = ({
  isOpen,
  onClose,
  data = {
    studentName: 'هيله سرحان الناصري',
    courseTitle: 'أساسيات البرمجة بلغة Python',
    studentLevel: 'مبتدئ',
    masteryPercentage: 100,
    serialNumber: 'EDT-PY-2026-95',
    issueDate: '2026-10-28',
  },
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#111111] border-2 border-[#FFCB74] rounded-3xl p-8 sm:p-12 shadow-[0_0_80px_rgba(255,203,116,0.35)] overflow-hidden flex flex-col justify-between transition-colors duration-300">
        
        {/* زخارف الأركان الذهبية */}
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-[#FFCB74] rounded-tr-xl pointer-events-none" />
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-[#FFCB74] rounded-tl-xl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-[#FFCB74] rounded-br-xl pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-[#FFCB74] rounded-bl-xl pointer-events-none" />

        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-xl bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-gray-600 dark:text-gray-300 hover:text-[#111111] dark:hover:text-white transition-all cursor-pointer z-20 shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس الشهادة */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FFCB74] flex items-center justify-center text-[#111111] mx-auto mb-3 shadow-[0_0_25px_rgba(255,203,116,0.4)]">
            <GraduationCap className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold text-[#FFCB74] tracking-widest uppercase block mb-1">
            منصة مسار للتعلم التكيفي الذكي • MASAR PLATFORM
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] dark:text-[#FFFFFF] tracking-wide">
            وثيقة إتقان وإنجاز معتمدة
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Certificate of Adaptive Mastery Completion</p>
        </div>

        {/* نص الشهادة وبيانات الطالبة */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">تشهد منصة مسار بأن الطالبة:</p>
          
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] dark:text-[#FFCB74] my-3 py-1">
            {data.studentName}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2 font-medium">
            قد أتمت بنجاح متطلبات دراسة واجتياز التقييم التكيفي لمقرر:
          </p>
          <h3 className="text-lg sm:text-xl font-black text-[#FFCB74] mt-1 mb-4">
            {data.courseTitle}
          </h3>

          <div className="inline-flex items-center gap-6 px-6 py-2.5 rounded-2xl bg-[#F6F6F6] dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-xs text-gray-700 dark:text-gray-200 shadow-xs">
            <span>نسبة الإتقان: <strong className="text-emerald-500 text-sm">{data.masteryPercentage}%</strong></span>
            <span className="text-gray-400">•</span>
            <span>التقدير: <strong className="text-[#FFCB74] text-sm">ممتاز مع مرتبة الشرف</strong></span>
            <span className="text-gray-400">•</span>
            <span>المستوى: <strong className="text-[#111111] dark:text-white text-sm">{data.studentLevel}</strong></span>
          </div>
        </div>

        {/* أسفل الشهادة والختم والأرقام المعتمدة */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] pt-6 gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="text-right">
            <span className="block font-mono text-[11px] text-gray-400 dark:text-gray-500">الرقم التسلسلي المعتمد:</span>
            <span className="font-mono text-xs text-[#FFCB74] font-bold">{data.serialNumber}</span>
          </div>

          {/* ختم الإتقان الذهبي */}
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FFCB74] flex flex-col items-center justify-center text-center p-1 bg-[#FFCB74]/10 shadow-[0_0_20px_rgba(255,203,116,0.2)]">
            <Sparkles className="w-4 h-4 text-[#FFCB74] mb-0.5" />
            <span className="text-[9px] font-black text-[#FFCB74] leading-tight">معتمد رقمياً</span>
            <span className="text-[8px] text-gray-500 dark:text-gray-400 font-mono">2026/2027</span>[cite: 6]
          </div>

          <div className="text-left font-mono">
            <span className="block text-[11px] text-gray-400 dark:text-gray-500">تاريخ الإصدار:</span>
            <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{data.issueDate}</span>
          </div>
        </div>

        {/* أزرار الطباعة والتصدير */}
        <div className="mt-8 pt-4 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] flex items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="py-3 px-8 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-[0_0_20px_rgba(255,203,116,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة وتصدير الشهادة (PDF)</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl font-bold text-xs bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-gray-700 dark:text-gray-300 border border-[#2F2F2F]/15 dark:border-[#2F2F2F] transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentCertificate;