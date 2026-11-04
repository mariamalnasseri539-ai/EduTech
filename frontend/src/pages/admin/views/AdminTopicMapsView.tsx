import React, { useState } from 'react';
import {
  BookOpen,
  GitBranch,
  Network,
  Clock,
  Layers,
  ArrowRight,
  Plus,
  Edit,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { INITIAL_COURSES } from '../data/coursesData';
import { AdminCourse, AdminTopicNode } from '../types';

export const AdminTopicMapsView: React.FC = () => {
  const [courses, setCourses] = useState<AdminCourse[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cs-advanced-js');
  const [selectedTopic, setSelectedTopic] = useState<AdminTopicNode | null>(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // حقول إضافة مقرر جديد
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newHours, setNewHours] = useState(20);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const topicList = Object.values(selectedCourse.topics).sort((a, b) => a.order - b.order);

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = 'course-' + Date.now();
    const created: AdminCourse = {
      id: newId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'مقرر تكيفي بنظام المحتوى الصفري مخصص للتعلّم الفردي.',
      category: newCategory,
      estimatedHours: newHours,
      totalStudents: 0,
      topicsCount: 1,
      topics: {
        'topic-init': {
          id: 'topic-init',
          title: 'الوحدة التمهيدية وتحديد المستوى',
          description: 'فحص تموضع تشخيصي لتحديد نطاق ZPD للطلاب المسجلين.',
          prerequisites: [],
          targetConcepts: ['Core Fundamentals'],
          category: 'Introduction',
          order: 1,
          bloomLevel: 'فهم وتطبيق (Apply)',
        },
      },
    };

    setCourses((prev) => [created, ...prev]);
    setSelectedCourseId(newId);
    setIsAddCourseModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setToastMessage(`تمت إضافة المقرر "${created.title}" محلياً في لوحة الإدارة بنجاح.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn" dir="rtl">
      {/* إشعار النجاح اللحظي */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#111111] text-white border border-[#FFCB74] shadow-2xl flex items-center gap-3 animate-slideUp">
          <Sparkles className="w-5 h-5 text-[#FFCB74] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. الترويسة الرئيسية */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              CURRICULUM & TOPIC DAG ENGINE
            </span>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200">
              خرائط المفاهيم التكيفية
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            إدارة المقررات وخرائط المنهج (Topic Maps)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            استعراض هيكل المناهج وشبكات المفاهيم الموجهة (DAGs) وشروط المتطلبات السابقة ومستويات بلوم المعرفية.
          </p>
        </div>

        {/* زر إضافة مقرر جديد */}
        <button
          onClick={() => setIsAddCourseModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مقرر جديد</span>
        </button>
      </div>

      {/* 2. بطاقات اختيار المقررات التكيفية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => {
          const isSelected = selectedCourseId === course.id;
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-[#1E1E1E] border-[#FFCB74] shadow-md ring-2 ring-[#FFCB74]/30 scale-[1.01]'
                  : 'bg-white/70 dark:bg-[#1E1E1E]/70 border-slate-200 dark:border-[#2F2F2F] hover:border-slate-300 dark:hover:border-[#3A3A3A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 dark:text-slate-300">
                    {course.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {course.topicsCount} موضوعات
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#2F2F2F] dark:text-white leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#FFCB74]" />
                  <span>{course.estimatedHours} ساعة</span>
                </div>
                <span className="font-bold text-[#2F2F2F] dark:text-[#FFCB74]">
                  {course.totalStudents} طالباً
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. العارض المرئي لشبكة مفاهيم المنهج (Topic DAG Viewer) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <Network className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                خريطة المنهج وسلسلة العلاقات التكيفية: {selectedCourse.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Directed Acyclic Graph (DAG) • Pedagogical Concept Dependencies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <GitBranch className="w-4 h-4 text-[#FFCB74]" />
            <span>مسار خطي متفرع مع شروط مسبقة</span>
          </div>
        </div>

        {/* مخطط العقد (Nodes) والأسهم الرابطة */}
        <div className="space-y-4 relative">
          {topicList.map((node, index) => (
            <div key={node.id} className="relative">
              {/* خط الربط بين العقد */}
              {index < topicList.length - 1 && (
                <div className="absolute right-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#FFCB74] to-slate-200 dark:to-[#333333] z-0 -mb-4" />
              )}

              <div
                onClick={() => setSelectedTopic(node)}
                className="relative z-10 p-5 rounded-2xl bg-[#F6F6F6]/80 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] hover:border-[#FFCB74] transition-all duration-300 cursor-pointer shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#1E1E1E] border-2 border-[#FFCB74] flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74] font-black text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    0{node.order}
                  </div>

                  <div className="text-right">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-[#2F2F2F] dark:text-white group-hover:text-[#2F2F2F] dark:group-hover:text-[#FFCB74] transition-colors">
                        {node.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200">
                        {node.bloomLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
                      {node.description}
                    </p>

                    {/* المفاهيم المستهدفة */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[11px] text-slate-400 font-bold">المفاهيم:</span>
                      {node.targetConcepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#383838] text-[10px] font-mono text-slate-700 dark:text-slate-300"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* المتطلبات السابقة للمفهوم */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 md:border-r border-slate-200 dark:border-[#333333] pt-3 md:pt-0 md:pr-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      المتطلبات السابقة (Prerequisites):
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2F2F2F] dark:text-[#FFCB74]">
                      {node.prerequisites.length > 0
                        ? node.prerequisites.join(' + ')
                        : 'بدون شروط (تأسيسي)'}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2F2F2F] dark:text-[#FFCB74] group-hover:translate-x-1 transition-transform">
                    <span>تفاصيل الموضوع</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. نافذة تفاصيل الموضوع المنبثقة */}
      {selectedTopic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                  {selectedTopic.title}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Topic ID: {selectedTopic.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">وصف المفهوم:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedTopic.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">مستوى تصنيف بلوم:</span>
                  <span className="font-bold text-[#2F2F2F] dark:text-white">
                    {selectedTopic.bloomLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">التصنيف الوظيفي:</span>
                  <span className="font-mono text-[#2F2F2F] dark:text-[#FFCB74]">
                    {selectedTopic.category}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1.5">
                  المفاهيم المستهدفة في التوليد الآلي:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.targetConcepts.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-[#FFCB74]/15 border border-[#FFCB74]/30 text-xs font-mono font-bold text-[#2F2F2F] dark:text-[#FFCB74]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. نافذة إضافة مقرر جديد */}
      {isAddCourseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                  إضافة مقرر تكيفي جديد
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Create Adaptive Curriculum Track
                </p>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  اسم المقرر الدراسي
                </label>
                <input
                  type="text"
                  placeholder="مثال: هندسة البرمجيات والمعماريات النظيفة"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  وصف المقرر
                </label>
                <textarea
                  rows={3}
                  placeholder="نبذة عن أهداف المقرر والمسار التكيفي..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium focus:outline-none focus:border-[#FFCB74] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    الساعات التقديرية
                  </label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono focus:outline-none focus:border-[#FFCB74]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  ملاحظة تقنية: يتم حفظ المقرر محلياً في لوحة التحكم وتحديث خريطة الـ DAG فورياً، وسيتطلب ربطاً برمجياً لحفظ المقرر سحابياً في قاعدة بيانات Firestore عند اعتماد مسارات الـ API بالـ Backend.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111]"
                >
                  إنشاء المقرر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTopicMapsView;

