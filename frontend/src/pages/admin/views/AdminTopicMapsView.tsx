import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Clock,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  ListOrdered,
  Edit3,
  Trash2,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  HelpCircle
} from 'lucide-react';
import { AdminCourse, AdminTopicNode } from '../types';
import { apiClient } from '../../../services/apiClient';

export const AdminTopicMapsView: React.FC = () => {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('python-101');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // حالات تعديل وحذف المقرر
  const [courseToEdit, setCourseToEdit] = useState<AdminCourse | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editHours, setEditHours] = useState(20);
  const [editPlacementCount, setEditPlacementCount] = useState(6);
  const [editStatus, setEditStatus] = useState<'active' | 'paused'>('active');

  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // حقول إضافة مقرر جديد
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('علوم الحاسب والبرمجة');
  const [newHours, setNewHours] = useState(20);
  const [newPlacementCount, setNewPlacementCount] = useState(6);

  // حالات شاشة تعديل شجرة المفاهيم التفاعلية
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [activeCourseForTree, setActiveCourseForTree] = useState<AdminCourse | null>(null);
  const [workingTopics, setWorkingTopics] = useState<Record<string, AdminTopicNode>>({});
  
  // مراحل إضافة المفاهيم في الشجرة
  const [treeEditorStage, setTreeEditorStage] = useState<'input' | 'ask_another'>('input');
  const [conceptMainTitle, setConceptMainTitle] = useState('');
  const [conceptDesc, setConceptDesc] = useState('');
  const [conceptBloom, setConceptBloom] = useState('تطبيق وممارسة (Apply)');
  const [conceptSubTopics, setConceptSubTopics] = useState<string[]>([]);
  const [newSubTopicInput, setNewSubTopicInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // جلب المقررات الحقيقية من الباك إند و Cloud Firestore
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/courses');
      const rawList = res.data?.courses || [];

      const formatted: AdminCourse[] = rawList.map((c: any) => {
        const rawMap = c.topic_map || c.topics || {};
        return {
          id: c.id,
          title: c.title || 'مقرر بدون عنوان',
          description: c.description || 'مقرر تكيفي بنظام المحتوى الصفري مخصص للتعلّم الفردي.',
          category: c.category || 'علوم الحاسب',
          estimatedHours: Number(c.estimated_hours || 20),
          totalStudents: Number(c.total_students || 0),
          placementTestQuestionsCount: Number(c.placement_test_questions_count || 6),
          status: (c.status as 'active' | 'paused') || 'active',
          topicsCount: Object.keys(rawMap).length,
          topics: rawMap,
        };
      });

      setCourses(formatted);
      if (formatted.length > 0 && !formatted.some((c) => c.id === selectedCourseId)) {
        setSelectedCourseId(formatted[0].id);
      }
    } catch (err: any) {
      console.warn('Failed to fetch courses from server:', err);
      showToast('تعذر جلب المقررات من السيرفر، جاري استخدام الذاكرة المحلية.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // إرسال المقرر الجديد وحفظه في Firebase Firestore عبر Laravel API
  const handleAddCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const courseId = 'course-' + Date.now();
    const initialTopicMap: Record<string, AdminTopicNode> = {
      'topic-init': {
        id: 'topic-init',
        title: 'الوحدة التمهيدية وتحديد المستوى',
        description: 'فحص تموضع تشخيصي لتحديد نطاق ZPD للطلاب المسجلين.',
        prerequisites: [],
        targetConcepts: ['Core Fundamentals', 'Syntax Logic'],
        category: 'المفاهيم التأسيسية',
        order: 1,
        bloomLevel: 'فهم وتطبيق (Apply)',
      },
    };

    const payload = {
      id: courseId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'مقرر تكيفي بنظام المحتوى الصفري مخصص للتعلّم الفردي.',
      category: newCategory,
      estimated_hours: newHours,
      placement_test_questions_count: newPlacementCount,
      status: 'active',
      topic_map: initialTopicMap,
    };

    try {
      setIsSaving(true);
      await apiClient.post('/courses', payload);
      showToast(`تم حفظ المقرر "${payload.title}" في الفايربيس بنجاح!`);
      setIsAddCourseModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      await fetchCourses();
      setSelectedCourseId(courseId);
    } catch (err: any) {
      console.error('Save course error:', err);
      showToast('حدث خطأ أثناء حفظ المقرر في الفايربيس.');
    } finally {
      setIsSaving(false);
    }
  };

  // فتح نافذة تعديل المقرر
  const handleOpenEditCourse = (course: AdminCourse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCourseToEdit(course);
    setEditTitle(course.title);
    setEditDesc(course.description);
    setEditCategory(course.category);
    setEditHours(course.estimatedHours);
    setEditPlacementCount(course.placementTestQuestionsCount || 6);
    setEditStatus(course.status || 'active');
  };

  // حفظ التعديلات على المقرر في الفايربيس
  const handleSaveEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseToEdit || !editTitle.trim()) return;

    const payload = {
      id: courseToEdit.id,
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory.trim() || 'علوم الحاسب',
      estimated_hours: editHours,
      placement_test_questions_count: editPlacementCount,
      status: editStatus,
      topic_map: courseToEdit.topics,
    };

    try {
      setIsSaving(true);
      await apiClient.post('/courses', payload);
      showToast(`تم تحديث بيانات المقرر "${payload.title}" في الفايربيس بنجاح!`);
      setCourseToEdit(null);
      await fetchCourses();
    } catch (err: any) {
      console.error('Update course error:', err);
      showToast('حدث خطأ أثناء تحديث بيانات المقرر في الفايربيس.');
    } finally {
      setIsSaving(false);
    }
  };

  // إيقاف أو تفعيل المقرر مباشرة
  const handleToggleCourseStatus = async (course: AdminCourse, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextStatus = course.status === 'paused' ? 'active' : 'paused';

    const payload = {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      estimated_hours: course.estimatedHours,
      placement_test_questions_count: course.placementTestQuestionsCount || 6,
      status: nextStatus,
      topic_map: course.topics,
    };

    try {
      await apiClient.post('/courses', payload);
      showToast(`تم ${nextStatus === 'active' ? 'تفعيل' : 'إيقاف'} مقرر "${course.title}" بنجاح.`);
      await fetchCourses();
    } catch (err: any) {
      console.error('Toggle status error:', err);
      showToast('تعذر تغيير حالة المقرر.');
    }
  };

  // تأكيد حذف المقرر من الفايربيس
  const handleConfirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsDeleting(true);
      await apiClient.delete(`/courses/${courseToDelete.id}`);
      showToast(`تم حذف مقرر "${courseToDelete.title}" نهائياً من الفايربيس.`);
      setCourseToDelete(null);
      await fetchCourses();
      if (selectedCourseId === courseToDelete.id) {
        setSelectedCourseId('python-101');
      }
    } catch (err: any) {
      console.error('Delete course error:', err);
      showToast('تعذر حذف المقرر من السيرفر.');
    } finally {
      setIsDeleting(false);
    }
  };

  // فتح محرر شجرة المفاهيم المخصص
  const handleOpenTreeEditor = (course: AdminCourse) => {
    setActiveCourseForTree(course);
    setWorkingTopics({ ...course.topics });
    setTreeEditorStage('input');
    setConceptMainTitle('');
    setConceptDesc('');
    setConceptBloom('تطبيق وممارسة (Apply)');
    setConceptSubTopics([]);
    setNewSubTopicInput('');
    setIsTreeModalOpen(true);
  };

  // إضافة عنوان فرعي جديد في القائمة المؤقتة
  const handleAddSubTopic = () => {
    if (!newSubTopicInput.trim()) return;
    setConceptSubTopics([...conceptSubTopics, newSubTopicInput.trim()]);
    setNewSubTopicInput('');
  };

  // حذف عنوان فرعي من القائمة
  const handleRemoveSubTopic = (indexToRemove: number) => {
    setConceptSubTopics(conceptSubTopics.filter((_, idx) => idx !== indexToRemove));
  };

  // تأكيد إضافة العنوان الحالي وشجرته الفرعية
  const handleConfirmCurrentConcept = () => {
    if (!conceptMainTitle.trim() || !activeCourseForTree) return;

    const topicId = 't_' + Date.now();
    const currentCount = Object.keys(workingTopics).length;
    const existingList = Object.values(workingTopics);
    const lastTopic = existingList[existingList.length - 1];

    const newTopicNode: AdminTopicNode = {
      id: topicId,
      title: conceptMainTitle.trim(),
      description: conceptDesc.trim() || 'وحدة تعليمية في مسار المنهج التكيفي.',
      prerequisites: lastTopic ? [lastTopic.id] : [],
      targetConcepts: conceptSubTopics.length > 0 ? conceptSubTopics : [conceptMainTitle.trim()],
      subTopics: conceptSubTopics,
      category: 'المفاهيم التكيفية',
      order: currentCount + 1,
      bloomLevel: conceptBloom,
    };

    setWorkingTopics({
      ...workingTopics,
      [topicId]: newTopicNode,
    });

    // الانتقال لواجهة السؤال: هل تريد إضافة عنوان آخر؟
    setTreeEditorStage('ask_another');
  };

  // الرد بـ "نعم": العودة لإدخال عنوان جديد آخر
  const handleAnswerYesAddAnother = () => {
    setConceptMainTitle('');
    setConceptDesc('');
    setConceptBloom('تطبيق وممارسة (Apply)');
    setConceptSubTopics([]);
    setNewSubTopicInput('');
    setTreeEditorStage('input');
  };

  // الرد بـ "لا": حفظ الشجرة بالكامل في الفايربيس وإغلاق الواجهة
  const handleAnswerNoFinishTree = async () => {
    if (!activeCourseForTree) return;

    const payload = {
      id: activeCourseForTree.id,
      title: activeCourseForTree.title,
      description: activeCourseForTree.description,
      category: activeCourseForTree.category,
      estimated_hours: activeCourseForTree.estimatedHours,
      placement_test_questions_count: activeCourseForTree.placementTestQuestionsCount || 6,
      status: activeCourseForTree.status || 'active',
      topic_map: workingTopics,
    };

    try {
      setIsSaving(true);
      await apiClient.post('/courses', payload);
      showToast(`تم حفظ وتحديث شجرة المفاهيم لمقرر "${activeCourseForTree.title}" في الفايربيس بنجاح!`);
      setIsTreeModalOpen(false);
      setActiveCourseForTree(null);
      await fetchCourses();
    } catch (err: any) {
      console.error('Save concept tree error:', err);
      showToast('تعذر حفظ شجرة المفاهيم في الفايربيس.');
    } finally {
      setIsSaving(false);
    }
  };

  // حذف وحدة من شجرة المفاهيم أثناء التعديل
  const handleDeleteWorkingTopic = (topicId: string) => {
    const updated = { ...workingTopics };
    delete updated[topicId];
    setWorkingTopics(updated);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Toast الإشعارات */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-[#111111] dark:bg-[#2F2F2F] text-white border border-[#FFCB74]/40 shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slideUp">
          <Sparkles className="w-4 h-4 text-[#FFCB74]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. الترويسة الرئيسية مع أزرار التحكم وتبديل النمط */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              COURSES MANAGEMENT
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200">
              متصل بـ Cloud Firestore
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            إدارة المقررات الدراسية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            التحكم الكامل بالمقررات: التعديل، الإيقاف، الحذف، وبناء شجرة المفاهيم الموجهة.
          </p>
        </div>

        {/* أزرار الإجراءات وإضافة مقرر جديد */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-bold text-[#2F2F2F] dark:text-white">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFCB74]" />
            <span>المقررات</span>
          </div>

          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مقرر جديد</span>
          </button>
        </div>
      </div>

      {/* شريط البحث وتصفية التصنيفات */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute right-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="البحث في المقررات بالاسم أو الوصف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] text-[#2F2F2F] dark:text-white outline-none focus:border-[#FFCB74] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#2F2F2F] text-[#2F2F2F] dark:text-white font-medium outline-none focus:border-[#FFCB74] shadow-xs"
          >
            <option value="all">جميع التصنيفات</option>
            {Array.from(new Set(courses.map((c) => c.category))).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* حالة التحميل الأولي */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#FFCB74] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500">جاري مزامنة المقررات من قاعدة بيانات الفايربيس...</p>
        </div>
      )}

      {/* 2. الواجهة الأساسية: المقررات */}
      {!isLoading && (
        <div className="space-y-3">
          {courses
            .filter((c) => {
              const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
              const matchCategory = selectedCategoryFilter === 'all' || c.category === selectedCategoryFilter;
              return matchSearch && matchCategory;
            })
            .map((course) => {
              const isPaused = course.status === 'paused';
              return (
                <div
                  key={course.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs ${
                    isPaused
                      ? 'bg-slate-50/70 dark:bg-[#181818] border-slate-200 dark:border-[#2A2A2A] opacity-75'
                      : 'bg-white dark:bg-[#1E1E1E] border-slate-200 dark:border-[#2F2F2F] hover:border-[#FFCB74]/60'
                  }`}
                >
                  {/* معلومات المقرر يميناً */}
                  <div className="flex-1 space-y-1.5 text-right">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-[#2F2F2F] dark:text-white leading-tight">
                        {course.title}
                      </h3>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#2A2A2A] text-slate-600 dark:text-slate-300 font-bold">
                        {course.id}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/15 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/30">
                        {course.category}
                      </span>

                      {/* حالة المقرر (نشط / متوقف) */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          isPaused
                            ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        <span>{isPaused ? 'متوقف حالياً' : 'نشط للطلاب'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-3xl leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-[#FFCB74]" />
                        <span>{course.estimatedHours} ساعة تدريبية</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <GitBranch className="w-3 h-3 text-[#FFCB74]" />
                        <span>{course.topicsCount} وحدات مفاهيم</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-[#FFCB74]">
                        <ListOrdered className="w-3 h-3" />
                        <span>امتحان تحديد المستوى: {course.placementTestQuestionsCount || 6} أسئلة</span>
                      </div>
                    </div>
                  </div>

                  {/* أزرار الإجراءات في آخر الصف (تعديل، إيقاف، حذف) */}
                  <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#2A2A2A] shrink-0">
                    {/* خيار تعديل */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditCourse(course, e)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-[#FFCB74] border border-amber-200 dark:border-[#FFCB74]/30 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="تعديل بيانات المقرر وشجرة المفاهيم"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>

                    {/* خيار إيقاف أو تفعيل */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleCourseStatus(course, e)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isPaused
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#383838] hover:bg-slate-200'
                      }`}
                      title={isPaused ? 'تفعيل المقرر وإتاحته للطلاب' : 'إيقاف المقرر مؤقتاً'}
                    >
                      {isPaused ? <PlayCircle className="w-3.5 h-3.5 text-emerald-500" /> : <PauseCircle className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{isPaused ? 'تفعيل' : 'إيقاف'}</span>
                    </button>

                    {/* خيار حذف */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCourseToDelete(course);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="حذف المقرر نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 4. نافذة تعديل بيانات المقرر (مع زر تعديل شجرة المفاهيم بأسفلها) */}
      {courseToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#FFCB74]" />
                  <span>تعديل بيانات المقرر: {courseToEdit.title}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Update Course Details in Cloud Firestore
                </p>
              </div>
              <button
                onClick={() => setCourseToEdit(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  اسم المقرر الدراسي
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  وصف المقرر
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium focus:outline-none focus:border-[#FFCB74] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    الساعات التقديرية
                  </label>
                  <input
                    type="number"
                    value={editHours}
                    onChange={(e) => setEditHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono focus:outline-none focus:border-[#FFCB74]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFCB74] mb-1">
                    أسئلة تحديد المستوى
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={25}
                    value={editPlacementCount}
                    onChange={(e) => setEditPlacementCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-[#FFCB74] text-[#2F2F2F] dark:text-[#FFCB74] font-bold font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                  حالة تفعيل المقرر
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'paused')}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
                >
                  <option value="active">نشط ومتاح للطلاب</option>
                  <option value="paused">متوقف مؤقتاً</option>
                </select>
              </div>

              {/* زر تعديل شجرة المفاهيم البارز بأسفل التعديل كما طلب المستخدم تماماً */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const c = courseToEdit;
                    setCourseToEdit(null);
                    handleOpenTreeEditor(c);
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-black text-xs bg-[#FFCB74]/20 hover:bg-[#FFCB74]/30 text-[#111111] dark:text-[#FFCB74] border-2 border-[#FFCB74] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <GitBranch className="w-4 h-4 text-[#FFCB74]" />
                  <span>تعديل شجرة المفاهيم</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCourseToEdit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ تعديلات المقرر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. شاشة تعديل شجرة المفاهيم المخصصة بأسلوب الإضافة المتسلسلة والتفرعات */}
      {isTreeModalOpen && activeCourseForTree && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* ترويسة نافذة شجرة المفاهيم */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-xs text-[#FFCB74] font-bold">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>محرر شجرة المفاهيم والعناوين الفرعية</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#2F2F2F] dark:text-white mt-0.5">
                  {activeCourseForTree.title}
                </h3>
              </div>
              <button
                onClick={() => setIsTreeModalOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-[#2F2F2F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* المرحلة الأولى: إدخال العنوان الرئيسي وإضافة العناوين الفرعية */}
            {treeEditorStage === 'input' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                  أدخل العنوان الرئيسي للوحدة، ويمكنك إضافة تفرعات وعناوين فرعية تابعة لها بالضغط على "إضافة عنوان فرعي".
                </div>

                {/* العنوان الرئيسي */}
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    العنوان الرئيسي للمفهوم / الوحدة *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: المتغيرات وأنواع البيانات الأولية"
                    value={conceptMainTitle}
                    onChange={(e) => setConceptMainTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FFCB74]"
                    required
                  />
                </div>

                {/* الوصف البيداغوجي */}
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    الوصف والمخرجات التعليمية
                  </label>
                  <textarea
                    rows={2}
                    placeholder="نبذة عن المفهوم وما يتعلمه الطالب..."
                    value={conceptDesc}
                    onChange={(e) => setConceptDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium text-xs focus:outline-none focus:border-[#FFCB74] resize-none"
                  />
                </div>

                {/* مستوى بلوم المعرفي */}
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    مستوى بلوم المعرفي
                  </label>
                  <select
                    value={conceptBloom}
                    onChange={(e) => setConceptBloom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white text-xs font-semibold focus:outline-none focus:border-[#FFCB74]"
                  >
                    <option value="تذكر وفهم (Remember/Understand)">تذكر وفهم (Remember/Understand)</option>
                    <option value="تطبيق وممارسة (Apply)">تطبيق وممارسة (Apply)</option>
                    <option value="تطبيق وتحليل (Apply/Analyze)">تطبيق وتحليل (Apply/Analyze)</option>
                    <option value="تقييم وابتكار (Evaluate/Create)">تقييم وابتكار (Evaluate/Create)</option>
                  </select>
                </div>

                {/* قسم التفرعات والعناوين الفرعية */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#2A2A2A]">
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-2">
                    التفرعات والعناوين الفرعية (إن وُجدت):
                  </label>

                  {/* قائمة العناوين الفرعية المضافة حالياً */}
                  {conceptSubTopics.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {conceptSubTopics.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs font-semibold"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span>{sub}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubTopic(idx)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* حقل إضافة عنوان فرعي جديد */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="أدخل عنوان فرعي، ثم اضغط على زر الإضافة..."
                      value={newSubTopicInput}
                      onChange={(e) => setNewSubTopicInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubTopic();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white text-xs focus:outline-none focus:border-[#FFCB74]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubTopic}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74]/20 hover:bg-[#FFCB74]/30 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FFCB74]" />
                      <span>إضافة عنوان فرعي</span>
                    </button>
                  </div>
                </div>

                {/* خياري التأكيد أو الإلغاء كما في متطلبات المستخدم */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsTreeModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCurrentConcept}
                    disabled={!conceptMainTitle.trim()}
                    className="px-6 py-2 rounded-xl text-xs font-black bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد</span>
                  </button>
                </div>
              </div>
            )}

            {/* المرحلة الثانية: السؤال: هل تريد إضافة عنوان آخر؟ */}
            {treeEditorStage === 'ask_another' && (
              <div className="py-6 px-4 text-center space-y-5 animate-scaleUp">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-black text-[#2F2F2F] dark:text-white">
                    تم تأكيد وإضافة العنوان بنجاح!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    أصبح لديك الآن {Object.keys(workingTopics).length} وحدات في شجرة مفاهيم هذا المقرر.
                  </p>
                </div>

                {/* السؤال المحوري المطلوب */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 max-w-sm mx-auto">
                  <span className="text-sm font-black text-[#111111] dark:text-[#FFCB74] flex items-center justify-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>هل تريد إضافة عنوان آخر؟</span>
                  </span>
                </div>

                {/* خيارات نعم (للإضافة مرة ثانية) أو لا (للإنهاء والحفظ) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAnswerYesAddAnother}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نعم، أريد إضافة عنوان آخر</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAnswerNoFinishTree}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-[#2F2F2F] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#383838] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isSaving ? 'جاري الحفظ في الفايربيس...' : 'لا، إنهاء وحفظ شجرة المفاهيم'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* معاينة سريعة للشجرة المجمعة حالياً أسفل النافذة */}
            {Object.keys(workingTopics).length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    الوحدات المضافة حالياً ({Object.keys(workingTopics).length}):
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5">
                  {Object.values(workingTopics).map((t, i) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FFCB74]">0{i + 1}</span>
                        <span className="font-bold text-[#2F2F2F] dark:text-white">{t.title}</span>
                        {t.subTopics && t.subTopics.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({t.subTopics.length} تفرعات)
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteWorkingTopic(t.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="حذف هذه الوحدة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. نافذة تأكيد حذف المقرر */}
      {courseToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl border border-red-500/30 dark:border-red-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-500 pb-2 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  تأكيد حذف المقرر نهائياً
                </h3>
                <p className="text-xs text-red-500 font-medium">
                  إجراء لا يمكن التراجع عنه
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف مقرر <strong className="text-slate-900 dark:text-white font-bold font-mono">"{courseToDelete.title}"</strong>؟
              <br />
              سيتم مسح المقرر وشجرة المفاهيم المرتبطة به بالكامل من قاعدة بيانات Cloud Firestore.
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#2F2F2F] text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                إلغاء التراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCourse}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'جاري الحذف...' : 'نعم، احذف المقرر'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. نافذة إضافة مقرر جديد وحفظه بالفايربيس */}
      {isAddCourseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#2A2A2A]">
              <div className="text-right">
                <h3 className="text-base font-bold text-[#2F2F2F] dark:text-white">
                  إضافة مقرر تكيفي جديد في الفايربيس
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Create Adaptive Curriculum Track in Cloud Firestore
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
                  placeholder="مثال: الذكاء الاصطناعي وهياكل البيانات التكيفية"
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
                  rows={2}
                  placeholder="نبذة عن أهداف المقرر والمسار التكيفي..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium focus:outline-none focus:border-[#FFCB74] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
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
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono focus:outline-none focus:border-[#FFCB74]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFCB74] mb-1">
                    أسئلة تحديد المستوى
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={25}
                    value={newPlacementCount}
                    onChange={(e) => setNewPlacementCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-[#FFCB74] text-[#2F2F2F] dark:text-[#FFCB74] font-bold font-mono focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  سيتم حفظ المقرر وشجرة مفاهيمه فورياً في مجموعة <code>courses</code> في Cloud Firestore.
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
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? 'جاري الحفظ في الفايربيس...' : 'حفظ المقرر'}
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
