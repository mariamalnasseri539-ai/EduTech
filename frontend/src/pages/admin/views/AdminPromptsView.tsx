import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Sparkles,
  Layers,
  Code2,
  HelpCircle,
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Check,
  Eye,
  Sliders,
  Cpu,
  BookOpen,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';
import { PromptCategory, AdminPromptTemplate, AdminCourse } from '../types';
import { apiClient } from '../../../services/apiClient';

interface CategoryConfig {
  id: PromptCategory;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  defaultVars: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'placement_test',
    title: 'أوامر امتحان تحديد المستوى لكل المقررات',
    shortTitle: 'امتحان تحديد المستوى',
    description: 'قوالب برومبت توليد الأسئلة التشخيصية المعيارية لتحديد المستوى المعرفي للطالب (مبتدئ / متوسط / متقدم) وفق هرم بلوم.',
    icon: CheckCircle2,
    color: 'emerald',
    defaultVars: ['{course_title}', '{question_count}', '{concept_topics}', '{difficulty_distribution}'],
  },
  {
    id: 'static_slides',
    title: 'أوامر توليد السلايدات الثابتة',
    shortTitle: 'توليد السلايدات الثابتة',
    description: 'قوالب برومبت صياغة شرائح الدروس والشروحات المفاهيمية المتسلسلة والمبسطة لكل مفهوم تعليمي بالمنهج.',
    icon: Layers,
    color: 'amber',
    defaultVars: ['{course_title}', '{concept_title}', '{student_level}', '{target_concepts}', '{slide_count}'],
  },
  {
    id: 'interactive_code',
    title: 'أوامر الكود والواجهات التفاعلية',
    shortTitle: 'الكود والواجهات التفاعلية',
    description: 'قوالب برومبت توليد التحديات البرمجية الحية (Live Coding) والشفرات التأسيسية وحالات الاختبار الآلية (Test Cases).',
    icon: Code2,
    color: 'purple',
    defaultVars: ['{concept_title}', '{programming_language}', '{student_level}', '{subtopic_title}'],
  },
  {
    id: 'micro_quiz',
    title: 'أوامر الامتحان الصغير بعد كل درس',
    shortTitle: 'الامتحان الصغير بعد الدرس',
    description: 'قوالب برومبت التقييم التكويني السريع (Micro-Quiz) للتأكد الفوري من استيعاب المفاهيم قبل الانتقال للدرس التالي.',
    icon: HelpCircle,
    color: 'sky',
    defaultVars: ['{lesson_title}', '{concept_title}', '{quiz_questions_count}', '{learned_outcomes}'],
  },
];

export const AdminPromptsView: React.FC = () => {
  const [prompts, setPrompts] = useState<AdminPromptTemplate[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('placement_test');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // نافذة الإضافة والتعديل
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AdminPromptTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // حقول نموذج الإضافة / التعديل
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PromptCategory>('placement_test');
  const [formTargetCourseId, setFormTargetCourseId] = useState('all');
  const [formTargetCourseTitle, setFormTargetCourseTitle] = useState('عام لكافة المقررات');
  const [formSystemPrompt, setFormSystemPrompt] = useState('');
  const [formUserTemplate, setFormUserTemplate] = useState('');
  const [formModel, setFormModel] = useState('gemini-1.5-pro');
  const [formTemperature, setFormTemperature] = useState(0.3);
  const [formMaxTokens, setFormMaxTokens] = useState(4096);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // نافذة المعاينة الحية والاختبار
  const [previewingPrompt, setPreviewingPrompt] = useState<AdminPromptTemplate | null>(null);
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // تأكيد الحذف
  const [deletingPrompt, setDeletingPrompt] = useState<AdminPromptTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // جلب الأوامر والمقررات من الباك إند
  const fetchPromptsAndCourses = async () => {
    try {
      setIsLoading(true);
      const [promptsRes, coursesRes] = await Promise.all([
        apiClient.get<{ prompts: AdminPromptTemplate[] }>('/prompts'),
        apiClient.get<{ courses: any[] }>('/courses').catch(() => ({ data: { courses: [] } })),
      ]);

      setPrompts(promptsRes.data.prompts || []);

      const mappedCourses = (coursesRes.data.courses || []).map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        category: c.category || '',
        estimatedHours: c.estimated_hours || 20,
        totalStudents: c.total_students || 0,
        topicsCount: Object.keys(c.topic_map || c.topics || {}).length,
        topics: c.topic_map || c.topics || {},
      }));
      setCourses(mappedCourses);
    } catch (err: any) {
      console.error('Fetch prompts error:', err);
      showToast('تعذر جلب الأوامر من الفايربيس.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptsAndCourses();
  }, []);

  // فتح نافذة إضافة أمر جديد
  const handleOpenCreateModal = (category?: PromptCategory) => {
    setEditingPrompt(null);
    const cat = category || activeCategory;
    setFormCategory(cat);
    setFormTitle('');
    setFormTargetCourseId('all');
    setFormTargetCourseTitle('عام لكافة المقررات');
    setFormModel('gemini-1.5-pro');
    setFormTemperature(0.3);
    setFormMaxTokens(4096);
    setFormIsActive(true);
    setFormNotes('');

    // قوالب افتراضية حسب القسم
    if (cat === 'placement_test') {
      setFormSystemPrompt('أنت خبير بيداغوجي متخصص في صياغة اختبارات تحديد المستوى التكيفية الذكية.');
      setFormUserTemplate('قم بإنشاء اختبار تحديد مستوى لمقرر "{course_title}".\nعدد الأسئلة: {question_count}.\nالمفاهيم: {concept_topics}');
    } else if (cat === 'static_slides') {
      setFormTitle('أمر صياغة السلايدات والشروحات التعليمية المتسلسلة التفاعلية');
      setFormSystemPrompt(`أنت كبير مهندسي التصميم التعليمي التفاعلي وخبير البيداغوجيا الرقمية في منصة مسار (MASAR). مهمتك هي توليد شرائح تعليمية ذكية، احترافية، وعالية التباين مخصصة لواجهة الطالب التكيفية.

يجب عليك الالتزام الصارم بالإلزاميات الهندسية والبيداغوجية الأربعة التالية:

1. قاعدة الألوان الصلبة الصارمة (Solid Colors Only - No Transparency):
   - يُمنع منعاً باتاً استخدام الألوان الشفافة أو الباهتة (ممنوع منعاً باتاً: Opacity, Alpha, Transparent, Faint backgrounds).
   - استخدام ألوان صلبة نقية (100% Solid Colors) ذات تباين عالي لضمان وضوح فائق وقراءة مريحة:
     * الخلفيات: أبيض صلب (#FFFFFF) أو رمادي داكن صلب (#1E1E1E / #121212).
     * ألوان التمييز والتأكيد: ذهبي مسار الصلب (#FFCB74)، زمردي صلب (#10B981)، أزرق صلب (#2563EB)، قرمزي صلب (#DC2626).
     * النصوص: أسود صلب (#111111) على الخلفيات الفاتحة، أو أبيض صلب (#FFFFFF) على الخلفيات الداكنة.

2. هيكلة التعاريف (Terms & Definitions Architecture):
   - إذا كان المحتوى يتضمن مصطلحات ومفاهيم تعريفية، يجب تقسيمه بدقة:
     * يُعرض 'اسم المصطلح' وجوباً باللغتين العربية والإنجليزية معاً بصيغة:
       [اسم المصطلح بالعربية] | [Term in English]
     * يُتبع اسم المصطلح بمكون تفاعلي قابل للطي والإسدال (Accordion / Dropdown Arrow).
     * عند الضغط على السهم المنسدل، يُسدل 'التعريف والشرح التفصيلي' باللغة العربية فقط (يمنع استخدام الإنجليزية داخل نص التعريف).

3. هيكلة القوائم والنقاط (Lists & Bulleted Points Architecture):
   - إذا كان المحتوى تعداداً نقطياً أو عناصر تسلسلية:
     * تُعرض 'النقطة الرئيسية' وجوباً باللغتين العربية والإنجليزية معاً بصيغة:
       [النقطة الرئيسية بالعربية] | [Main Concept in English]
     * تكون كل نقطة رئيسية مزودة بسهم منسدل قابل للتوسيع (Dropdown Arrow).
     * عند الإسدال، تُعرض 'النقاط الفرعية والتفاصيل التوضيحية' باللغة العربية فقط (يمنع وضع نصوص إنجليزية في التفاصيل المنسدلة).

4. المحتوى التفاعلي والأنيميشن (Interactive UI & Animations):
   - أي محتوى تعليمي، هندسي، أو تطبيقي لا يندرج تحت التعاريف أو القوائم (مثل: آليات العمل، محاكاة الذاكرة، خطوات الخوارزميات، تتبع الكود البرمجي، وتجنب الأخطاء):
     * يجب تحويله وجوباً إلى واجهات تفاعلية مرئية (Interactive UI Components).
     * يجب تزويده بحركات وتأثيرات تفاعلية حية (CSS Animations & Micro-interactions) مثل: كبسولات تفكيك المفهوم، مؤشرات التنفيذ الرادارية، ومحاكاة الذاكرة الحية لكسر الملل تماماً وتحفيز الطالب.`);
      setFormUserTemplate(`قم بتوليد حزمة شرائح تعليمية تفاعلية بصرية عالية التباين لشرح المفهوم: "{concept_title}" ضمن مقرر "{course_title}".
المستوى المعرفي للطالب: {student_level}.
العناوين الفرعية والمخرجات المستهدفة:
{target_concepts}

المواصفات الإلزامية للمخرجات:
1. شريحة المصطلحات والتعاريف: عرض اسم المصطلح بالعربية والإنجليزية (عربي | English) متبوعاً بمكون منسدل (Accordion) يفتح التعريف بالعربية فقط.
2. شريحة النقاط والقواعد: عرض النقاط الرئيسية بالعربية والإنجليزية (عربي | English) مع سهم منسدل يعرض التفاصيل بالعربية فقط.
3. شريحة المحاكاة والتفاعل الحي: واجهة تفاعلية بأنيميشن جذاب تشرح آلية عمل المفهوم وتوزيعه بالذاكرة أو تتبع الكود بألوان صلبة (Solid Colors).
4. شريحة التحصين ومقارنة الأكواد: مقارنة بصرية مزدوجة بين الممارسة الخاطئة والممارسة الصحيحة المعتمدة بألوان صلبة ودون شفافية.`);
    } else if (cat === 'interactive_code') {
      setFormSystemPrompt('أنت مهندس برمجيات متخصص في التحديات البرمجية الحية وحالات الاختبار.');
      setFormUserTemplate('قم بإنشاء تحدي برمجي تطبيقي للمفهوم "{concept_title}" بلغة "{programming_language}".\nالمستوى: {student_level}.');
    } else {
      setFormSystemPrompt('أنت خبير تقييم تكويني سريع (Micro-Quiz).');
      setFormUserTemplate('قم بصياغة اختبار قصير ومكثف (Micro-Quiz) لدرس "{lesson_title}" في مفهوم "{concept_title}".\nالأسئلة: {quiz_questions_count}.');
    }

    setIsModalOpen(true);
  };

  // فتح نافذة تعديل أمر موجود
  const handleOpenEditModal = (prompt: AdminPromptTemplate) => {
    setEditingPrompt(prompt);
    setFormCategory(prompt.category);
    setFormTitle(prompt.title);
    setFormTargetCourseId(prompt.target_course_id || 'all');
    setFormTargetCourseTitle(prompt.target_course_title || 'عام لكافة المقررات');
    setFormSystemPrompt(prompt.system_prompt);
    setFormUserTemplate(prompt.user_prompt_template);
    setFormModel(prompt.model || 'gemini-1.5-pro');
    setFormTemperature(prompt.temperature ?? 0.3);
    setFormMaxTokens(prompt.max_tokens || 4096);
    setFormIsActive(prompt.is_active ?? true);
    setFormNotes(prompt.notes || '');
    setIsModalOpen(true);
  };

  // إدراج متغير في قالب المستخدم
  const handleInsertVariable = (varName: string) => {
    setFormUserTemplate((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + varName);
  };

  // استخراج المتغيرات من نص القالب
  const extractVariables = (template: string): string[] => {
    const matches = template.match(/\{([a-zA-Z0-9_]+)\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.slice(1, -1))));
  };

  // حفظ الأمر في Cloud Firestore
  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSystemPrompt.trim() || !formUserTemplate.trim()) {
      showToast('يرجى ملء كافة الحقول الإلزامية.');
      return;
    }

    const detectedVars = extractVariables(formUserTemplate);

    const payload = {
      id: editingPrompt ? editingPrompt.id : undefined,
      title: formTitle.trim(),
      category: formCategory,
      target_course_id: formTargetCourseId,
      target_course_title: formTargetCourseTitle,
      system_prompt: formSystemPrompt.trim(),
      user_prompt_template: formUserTemplate.trim(),
      variables: detectedVars,
      model: formModel,
      temperature: formTemperature,
      max_tokens: formMaxTokens,
      is_active: formIsActive,
      notes: formNotes.trim(),
      version: editingPrompt?.version,
    };

    try {
      setIsSaving(true);
      await apiClient.post('/prompts', payload);
      showToast(editingPrompt ? 'تم تحديث قالب الأمر في الفايربيس بنجاح!' : 'تم حفظ قالب الأمر الجديد في الفايربيس!');
      setIsModalOpen(false);
      setEditingPrompt(null);
      await fetchPromptsAndCourses();
    } catch (err: any) {
      console.error('Save prompt error:', err);
      showToast('حدث خطأ أثناء حفظ الأمر في الفايربيس.');
    } finally {
      setIsSaving(false);
    }
  };

  // تبديل حالة التفعيل
  const handleToggleStatus = async (prompt: AdminPromptTemplate) => {
    try {
      await apiClient.post(`/prompts/${prompt.id}/toggle`, {});
      showToast(`تم ${prompt.is_active ? 'تعطيل' : 'تفعيل'} الأمر بنجاح.`);
      await fetchPromptsAndCourses();
    } catch (err: any) {
      console.error('Toggle status error:', err);
      showToast('تعذر تغيير حالة الأمر.');
    }
  };

  // تأكيد حذف الأمر
  const handleConfirmDelete = async () => {
    if (!deletingPrompt) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/prompts/${deletingPrompt.id}`);
      showToast(`تم حذف أمر "${deletingPrompt.title}" نهائياً من الفايربيس.`);
      setDeletingPrompt(null);
      await fetchPromptsAndCourses();
    } catch (err: any) {
      console.error('Delete prompt error:', err);
      showToast('تعذر حذف الأمر.');
    } finally {
      setIsDeleting(false);
    }
  };

  // فتح نافذة المعاينة الحية والاختبار
  const handleOpenPreview = (prompt: AdminPromptTemplate) => {
    setPreviewingPrompt(prompt);
    const vars = extractVariables(prompt.user_prompt_template);
    const initialMap: Record<string, string> = {};
    vars.forEach((v) => {
      if (v.includes('course')) initialMap[v] = 'أساسيات البرمجة بلغة Python';
      else if (v.includes('count')) initialMap[v] = '6';
      else if (v.includes('concept')) initialMap[v] = 'المتغيرات وأنواع البيانات الأولية';
      else if (v.includes('level')) initialMap[v] = 'مبتدئ';
      else if (v.includes('language')) initialMap[v] = 'Python 3';
      else if (v.includes('subtopic')) initialMap[v] = 'التحويل بين الأنواع وعمليات الجمع';
      else if (v.includes('lesson')) initialMap[v] = 'المدخل إلى جمل الدوران والشرط';
      else initialMap[v] = 'قيمة تجريبية للمتغير';
    });
    setPreviewVars(initialMap);
  };

  // حساب نص القالب بعد استبدال المتغيرات الحية
  const getRenderedPreview = (): string => {
    if (!previewingPrompt) return '';
    let rendered = previewingPrompt.user_prompt_template;
    Object.entries(previewVars).forEach(([key, val]) => {
      rendered = rendered.split(`{${key}}`).join(val || `{${key}}`);
    });
    return rendered;
  };

  // نسخ النص إلى الحافظة
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('تم نسخ نص البرومبت إلى الحافظة بنجاح.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // تصفية الأوامر في القسم النشط
  const filteredPrompts = prompts.filter((p) => {
    const matchCategory = p.category === activeCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.system_prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.user_prompt_template.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCourse =
      courseFilter === 'all' || p.target_course_id === 'all' || p.target_course_id === courseFilter;
    return matchCategory && matchSearch && matchCourse;
  });

  const activeCategoryConfig = CATEGORIES.find((c) => c.id === activeCategory)!;
  const totalPromptsCount = prompts.length;
  const activePromptsCount = prompts.filter((p) => p.is_active).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast الإشعار */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-[#111111] dark:bg-[#2F2F2F] text-white border border-[#FFCB74]/40 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slideUp">
          <Sparkles className="w-4 h-4 text-[#FFCB74]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. الترويسة الرئيسية مع الإحصائيات وزر الإضافة */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              AI PROMPT ENGINEERING
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              متصل بـ Cloud Firestore
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-[#FFCB74]" />
            <span>إدارة الأوامر والبرومبت (Prompt Templates)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed font-medium">
            التحكم الشامل ببرومبت نماذج الذكاء الاصطناعي (Gemini) لتوليد امتحانات تحديد المستوى، السلايدات الثابتة، الأكواد البرمجية، والامتحانات المصغرة بعد كل درس.
          </p>
        </div>

        {/* أزرار الإجراء السريع والإحصائيات */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => handleOpenCreateModal()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أمر برومبت جديد</span>
          </button>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات العلوية */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">إجمالي الأوامر</span>
            <Terminal className="w-4 h-4 text-[#FFCB74]" />
          </div>
          <div className="text-2xl font-black text-[#2F2F2F] dark:text-white font-mono">
            {totalPromptsCount}
          </div>
          <span className="text-[10px] text-slate-400">في قاعدة البيانات</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">الأوامر المفعلة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {activePromptsCount}
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold">جاهزة للتوليد الحي</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">أقسام الأوامر</span>
            <Layers className="w-4 h-4 text-[#FFCB74]" />
          </div>
          <div className="text-2xl font-black text-[#2F2F2F] dark:text-white font-mono">
            4
          </div>
          <span className="text-[10px] text-slate-400">أقسام بيداغوجية</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">محرك الذكاء الافتراضي</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono mt-1">
            Gemini 1.5 Pro
          </div>
          <span className="text-[10px] text-slate-400">Low Temperature 0.25</span>
        </div>
      </div>

      {/* 3. تبويبات الأقسام الأربعة الرئيسية كما طلب المستخدم تماماً */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isSelected = activeCategory === cat.id;
          const count = prompts.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'bg-white dark:bg-[#1E1E1E] border-[#FFCB74] ring-2 ring-[#FFCB74]/30 shadow-md scale-[1.01]'
                  : 'bg-white/80 dark:bg-[#181818] border-slate-200 dark:border-[#2A2A2A] hover:border-slate-300 dark:hover:border-[#383838]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#FFCB74] text-[#111111]'
                      : 'bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <CatIcon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74]'
                      : 'bg-slate-100 dark:bg-[#252525] text-slate-500'
                  }`}
                >
                  {count} أمر
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-[#2F2F2F] dark:text-white leading-tight">
                  {cat.shortTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. شريط البحث والفلترة حسب المقرر */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`البحث في ${activeCategoryConfig.shortTitle}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-semibold text-[#2F2F2F] dark:text-white focus:outline-none focus:border-[#FFCB74]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 shrink-0">المقرر المستهدف:</span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-bold text-[#2F2F2F] dark:text-white focus:outline-none focus:border-[#FFCB74]"
          >
            <option value="all">كافة المقررات</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. عرض قائمة الأوامر للقسم النشط */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#FFCB74] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500">جاري مزامنة قوالب الأوامر من الفايربيس...</p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] p-8 space-y-3">
          <Terminal className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-[#2F2F2F] dark:text-white">
            لا توجد أوامر مطابقة في قسم "{activeCategoryConfig.shortTitle}"
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكنك إضافة قالب برومبت جديد وتخصيص تعليمات الذكاء الاصطناعي للمقررات.
          </p>
          <button
            onClick={() => handleOpenCreateModal(activeCategory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111]"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أمر لهذا القسم</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map((prompt) => {
            const isPaused = !prompt.is_active;
            const vars = prompt.variables || extractVariables(prompt.user_prompt_template);

            return (
              <div
                key={prompt.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 shadow-xs space-y-4 ${
                  isPaused
                    ? 'bg-slate-50/60 dark:bg-[#181818] border-slate-200 dark:border-[#2A2A2A] opacity-80'
                    : 'bg-white dark:bg-[#1E1E1E] border-slate-200 dark:border-[#2F2F2F] hover:border-[#FFCB74]/70'
                }`}
              >
                {/* ترويسة بطاقة الأمر */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-[#2F2F2F] dark:text-white leading-tight">
                        {prompt.title}
                      </h3>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#252525] text-slate-600 dark:text-slate-300 font-bold">
                        {prompt.id}
                      </span>

                      {/* المقرر المستهدف */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/15 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{prompt.target_course_title || 'عام لكافة المقررات'}</span>
                      </span>

                      {/* نموذج الذكاء الاصطناعي */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        <span>{prompt.model || 'gemini-1.5-pro'}</span>
                      </span>

                      {/* حالة التفعيل */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isPaused
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span>{isPaused ? 'معطل مؤقتاً' : 'نشط وجاهز للتوليد'}</span>
                      </span>
                    </div>

                    {prompt.notes && (
                      <p className="text-xs text-slate-400 italic">
                        {prompt.notes}
                      </p>
                    )}
                  </div>

                  {/* أزرار الإجراءات على الأمر */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenPreview(prompt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="معاينة حية واختبار مع متغيرات تجريبية"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>معاينة واختبار</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(prompt.user_prompt_template, prompt.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="نسخ القالب إلى الحافظة"
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{copiedId === prompt.id ? 'تم النسخ' : 'نسخ'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(prompt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-[#FFCB74] border border-amber-200 dark:border-[#FFCB74]/30 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="تعديل الأمر"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(prompt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title={isPaused ? 'تفعيل الأمر' : 'تعطيل الأمر'}
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{isPaused ? 'تفعيل' : 'إيقاف'}</span>
                    </button>

                    <button
                      onClick={() => setDeletingPrompt(prompt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="حذف الأمر نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>

                {/* تفاصيل البرومبت */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100 dark:border-[#2A2A2A] text-xs">
                  {/* توجيهات النظام (System Prompt) */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F6F6] dark:bg-[#242424] border border-slate-200 dark:border-[#303030] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>توجيهات النظام (System Prompt):</span>
                      <span className="font-mono text-[10px]">Temperature: {prompt.temperature ?? 0.3}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap line-clamp-4">
                      {prompt.system_prompt}
                    </p>
                  </div>

                  {/* قالب أمر المستخدم (User Template) */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F6F6] dark:bg-[#242424] border border-slate-200 dark:border-[#303030] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>قالب المستخدم (User Template):</span>
                      <span className="font-mono text-[10px]">Max Tokens: {prompt.max_tokens || 4096}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap line-clamp-4">
                      {prompt.user_prompt_template}
                    </p>
                  </div>
                </div>

                {/* المتغيرات المدعومة */}
                {vars.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">المتغيرات الديناميكية:</span>
                    {vars.map((v, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/15 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/30"
                      >
                        {v.startsWith('{') ? v : `{${v}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. نافذة إنشاء وتعديل قالب الأمر */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <h3 className="text-base sm:text-lg font-black text-[#2F2F2F] dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#FFCB74]" />
                  <span>{editingPrompt ? 'تعديل قالب الأمر' : 'إضافة أمر برومبت جديد'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  حفظ التعديلات في Cloud Firestore مع خيارات المعايرة البيداغوجية
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4 text-xs sm:text-sm">
              {/* عنوان الأمر */}
              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  عنوان الأمر / اسم البرومبت *
                </label>
                <input
                  type="text"
                  placeholder="مثال: أمر توليد امتحان تحديد المستوى التكيفي القياسي"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FFCB74]"
                  required
                />
              </div>

              {/* القسم والمقرر المستهدف */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    القسم البيداغوجي للأمر *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PromptCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-bold text-xs focus:outline-none focus:border-[#FFCB74]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    المقرر المستهدف
                  </label>
                  <select
                    value={formTargetCourseId}
                    onChange={(e) => {
                      const cid = e.target.value;
                      setFormTargetCourseId(cid);
                      if (cid === 'all') {
                        setFormTargetCourseTitle('عام لكافة المقررات');
                      } else {
                        const target = courses.find((c) => c.id === cid);
                        setFormTargetCourseTitle(target ? target.title : cid);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-bold text-xs focus:outline-none focus:border-[#FFCB74]"
                  >
                    <option value="all">عام لكافة المقررات (Global)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* إعدادات النموذج والحرارة */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#232323] border border-slate-200 dark:border-[#2F2F2F]">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    نموذج Gemini
                  </label>
                  <select
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] text-xs font-mono font-bold text-[#2F2F2F] dark:text-white"
                  >
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    درجة الحرارة (Temp: {formTemperature})
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={formTemperature}
                    onChange={(e) => setFormTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#FFCB74]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>دقيق (0.0)</span>
                    <span>مبدع (1.0)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    الحد الأقصى للتوكنز
                  </label>
                  <input
                    type="number"
                    step={256}
                    min={512}
                    max={8192}
                    value={formMaxTokens}
                    onChange={(e) => setFormMaxTokens(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] text-xs font-mono font-bold text-[#2F2F2F] dark:text-white"
                  />
                </div>
              </div>

              {/* توجيهات النظام (System Prompt) */}
              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  توجيهات النظام (System Prompt) *
                </label>
                <textarea
                  rows={3}
                  placeholder="حدد دور النموذج، الشخصية البيداغوجية، وقواعد الصياغة الأساسية..."
                  value={formSystemPrompt}
                  onChange={(e) => setFormSystemPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono text-xs focus:outline-none focus:border-[#FFCB74] resize-none"
                  required
                />
              </div>

              {/* قالب أمر المستخدم مع أزرار إدراج المتغيرات */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300">
                    قالب أمر المستخدم (User Prompt Template) *
                  </label>
                  <span className="text-[10px] text-slate-400">انقر على المتغير لإدراجه بالقالب</span>
                </div>

                {/* أزرار المتغيرات السريعة */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2 p-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#303030]">
                  <span className="text-[10px] font-bold text-slate-400 pl-1">متغيرات جاهزة:</span>
                  {[
                    '{course_title}',
                    '{concept_title}',
                    '{student_level}',
                    '{bloom_level}',
                    '{question_count}',
                    '{concept_topics}',
                    '{target_concepts}',
                    '{programming_language}',
                    '{subtopic_title}',
                    '{lesson_title}',
                    '{quiz_questions_count}',
                  ].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1E1E1E] text-slate-700 dark:text-slate-300 hover:text-[#111111] hover:bg-[#FFCB74] dark:hover:bg-[#FFCB74] dark:hover:text-[#111111] border border-slate-200 dark:border-[#3A3A3A] text-[10px] font-mono font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={6}
                  placeholder="أدخل نص القالب، واستخدم المتغيرات بين أقواس مثل: {course_title} أو {question_count}..."
                  value={formUserTemplate}
                  onChange={(e) => setFormUserTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono text-xs focus:outline-none focus:border-[#FFCB74] resize-none"
                  required
                />
              </div>

              {/* ملاحظات وحالة التفعيل */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="ملاحظات توضيحية للفريق حول الغرض من هذا البرومبت..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs text-[#2F2F2F] dark:text-white"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded-md accent-[#FFCB74] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#2F2F2F] dark:text-slate-300">
                    تفعيل هذا الأمر فوراً
                  </span>
                </label>
              </div>

              {/* أزرار الإجراءات في النافذة */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-xs font-black bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSaving ? 'جاري الحفظ في الفايربيس...' : 'حفظ في Cloud Firestore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. نافذة المعاينة الحية والاختبار مع المتغيرات التجريبية */}
      {previewingPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74]">
                  LIVE PROMPT EVALUATION
                </span>
                <h3 className="text-base font-black text-[#2F2F2F] dark:text-white mt-1">
                  معاينة حية: {previewingPrompt.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingPrompt(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* حقول تجربة المتغيرات الحية */}
            {Object.keys(previewVars).length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sliders className="w-4 h-4" />
                  <span>المتغيرات التجريبية (عدّل القيم لتشاهد ناتج البرومبت فوراً):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(previewVars).map(([key, val]) => (
                    <div key={key}>
                      <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                        {`{${key}}`}
                      </label>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setPreviewVars({ ...previewVars, [key]: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#3A3A3A] text-xs font-semibold text-[#2F2F2F] dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ناتج البرومبت النهائي المرسل للذكاء الاصطناعي */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>البرومبت المقيم النهائي (Final Evaluated Prompt to Gemini):</span>
                <button
                  type="button"
                  onClick={() => handleCopyText(getRenderedPreview(), 'preview-text')}
                  className="flex items-center gap-1 text-[#FFCB74] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الناتج</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F6F6] dark:bg-[#151515] border border-slate-200 dark:border-[#303030] text-xs font-mono text-[#2F2F2F] dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {getRenderedPreview()}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewingPrompt(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111]"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. نافذة تأكيد الحذف */}
      {deletingPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#2F2F2F] dark:text-white">
                تأكيد حذف قالب الأمر؟
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                هل أنت متأكد من حذف الأمر "{deletingPrompt.title}" نهائياً من قاعدة بيانات الفايربيس؟
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPrompt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isDeleting ? 'جاري الحذف...' : 'نعم، حذف نهائي'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromptsView;
