import React from 'react';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BookOpen,
  Cpu,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AdminSection } from '../types';

interface AdminSectionPlaceholderProps {
  section: AdminSection;
}

interface SectionDetails {
  title: string;
  enTitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

export const AdminSectionPlaceholder: React.FC<AdminSectionPlaceholderProps> = ({ section }) => {
  const getSectionDetails = (): SectionDetails => {
    switch (section) {
      case 'overview':
        return {
          title: 'لوحة المؤشرات والإحصائيات العامة',
          enTitle: 'Executive Overview & KPI Dashboard',
          description:
            'مركز القيادة الشامل للمنصة؛ يعرض مؤشرات الأداء الحية للطلاب، ومعدل إنجاز الدروس التكيفية، وسلامة النظام البيئي للمحتوى.',
          features: [
            'بطاقات الأداء السريع (إجمالي الطلاب، المقررات النشطة، معدل الإتقان العام)',
            'توزيع الحالات المعرفية الحالية (Mastered, ActiveLearning, GuidedReview, Assessing)',
            'ملخص آني لنشاط الذكاء الاصطناعي ومعدلات طلب الدروس',
            'جدول آخر العمليات والنشاطات المسجلة في المنصة',
          ],
          icon: <LayoutDashboard className="w-8 h-8 text-[#FFCB74]" />,
        };
      case 'users':
        return {
          title: 'إدارة المستخدمين والصلاحيات',
          enTitle: 'Users Directory & Role-Based Access Control',
          description:
            'إدارة حسابات الطلاب والمشرفين، والتحكم بأدوار النظام (Admin / Student)، ومتابعة سجلات الدخول وتعيين الصلاحيات الأكاديمية.',
          features: [
            'جدول تفاعلي متقدم لجميع المستخدمين مع أدوات البحث والفرز والتصفية',
            'تبديل دور المستخدم بين طالب (STD) ومسؤول (ADM)',
            'إدارة وتخصيص صلاحيات المشرفين (manage_syllabi, view_analytics)',
            'عرض الحسابات المسجلة عبر Firebase مع تفاصيل آخر تسجيل دخول',
          ],
          icon: <Users className="w-8 h-8 text-[#FFCB74]" />,
        };
      case 'cohort':
        return {
          title: 'تحليلات الدفعة والمعرفة الأكاديمية',
          enTitle: 'Cohort Learning Analytics & Misconceptions',
          description:
            'تحليل تشخيصي جماعي لمستويات الاستيعاب لدى الطلاب، وكشف المفاهيم الخاطئة الشائعة ونقاط الضعف المتكررة.',
          features: [
            'تحليل جماعي لمستويات الإتقان لكل مقرر دراسي (Cohort State)',
            'جدول رصد المفاهيم الخاطئة الشائعة (Frequent Misconceptions) بحسب درجة الخطورة',
            'مؤشر نطاق التطور القريب (ZPD - Zone of Proximal Development)',
            'مقارنة متوسط درجات المهارة (Topic Mastery) للمواضيع الدراسية المختلفة',
          ],
          icon: <TrendingUp className="w-8 h-8 text-[#FFCB74]" />,
        };
      case 'courses':
        return {
          title: 'إدارة المقررات وخرائط المنهج',
          enTitle: 'Curriculum Syllabi & Concept Topic Maps (DAGs)',
          description:
            'استعراض شجرة المنهج والمقررات وخرائط المفاهيم المتشعبة، وشروط المتطلبات السابقة لكل مفهوم دراسي.',
          features: [
            'استعراض شبكات المفاهيم (Topic DAG Maps) لكل مقرر',
            'ربط كل مفهوم بمستويات بلوم المعرفية (Bloom Taxonomy Levels)',
            'التحقق من سلاسل الشروط المسبقة للموضوعات (Prerequisites)',
            'ربط المنهج مع قوالب محفزات التوليد اللحظي (Guided System Prompts)',
          ],
          icon: <BookOpen className="w-8 h-8 text-[#FFCB74]" />,
        };
      case 'prompts':
        return {
          title: 'إدارة الأوامر والبرومبت',
          enTitle: 'AI Prompt Engineering & Templates',
          description:
            'إدارة قوالب البرومبت لنماذج الذكاء الاصطناعي عبر أربعة أقسام رئيسية وحفظها في Cloud Firestore.',
          features: [
            'أوامر امتحان تحديد المستوى لكل المقررات',
            'أوامر توليد السلايدات والشروحات الثابتة',
            'أوامر الكود والواجهات التفاعلية',
            'أوامر الامتحان الصغير بعد كل درس',
          ],
          icon: <Cpu className="w-8 h-8 text-[#FFCB74]" />,
        };
      case 'telemetry':
        return {
          title: 'مراقبة أداء الذكاء الاصطناعي',
          enTitle: 'Gemini AI Telemetry & Synthesis Health',
          description:
            'مراقبة لحظية لمحرك التوليد الآلي Google Gemini 1.5، ومعدلات الالتزام بمخططات JSON Schema Draft 2020-12، وسرعة الاستجابة.',
          features: [
            'مؤشر زمن الاستجابة والتوليد بالمللي ثانية (Latency Monitoring)',
            'معدل نجاح توليد الدروس التكيفية اللحظية (Compliance Rate: 99.4%)',
            'سجل عمليات الاستشفاء والتعافي الذاتي (Self-Healing Retries)',
            'مؤشر ضمان المحتوى الصفري (Zero-Content Architecture Compliance)',
          ],
          icon: <Cpu className="w-8 h-8 text-[#FFCB74]" />,
        };
      default:
        return {
          title: 'لوحة الإدارة',
          enTitle: 'Admin Portal',
          description: 'القسم قيد الإعداد والتطوير.',
          features: [],
          icon: <Cpu className="w-8 h-8 text-[#FFCB74]" />,
        };
    }
  };

  const details = getSectionDetails();

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* بطاقة الترحيب والتعريف بالقسم */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#2F2F2F] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/40 flex items-center justify-center shrink-0">
              {details.icon}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white">
                  {details.title}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40">
                  <Clock className="w-3 h-3" />
                  <span>المرحلة الحالية: الهيكل والتأسيس</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                {details.enTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>نظام التنقل جاهز ومفعّل</span>
            </span>
          </div>
        </div>

        <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {details.description}
        </p>
      </div>

      {/* بطاقة المزايا والمكونات المخطط بناؤها في المرحلة التالية */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FFCB74]" />
              <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                المكونات المجدولة في خطة العمل القادمة
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Phase 2 Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {details.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#262626] border border-slate-200/80 dark:border-[#333333] transition-all hover:border-[#FFCB74]/50"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FFCB74] text-[#111111] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#2F2F2F] dark:text-slate-200 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFCB74] animate-pulse" />
              <h4 className="text-sm font-bold text-[#2F2F2F] dark:text-white">
                حالة التطوير الحالية
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              تم بنجاح تأسيس بنية الـ Admin Layout والقائمة الجانبية والشريط العلوي مع نظام المظهر الفاتح المعتمد (#F6F6F6 / #FFFFFF / #FFCB74).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2A2A2A]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2F2F2F] dark:text-slate-300">
              <span>جاهزية الهيكل:</span>
              <span className="text-[#2F2F2F] dark:text-[#FFCB74] font-bold font-mono">100%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#2A2A2A] mt-2 overflow-hidden">
              <div className="h-full rounded-full bg-[#FFCB74]" style={{ width: '100%' }} />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ArrowRight className="w-3.5 h-3.5 text-[#FFCB74]" />
              <span>بانتظار اعتماد المرحلة الأولى لبدء البرمجة الداخلية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSectionPlaceholder;

