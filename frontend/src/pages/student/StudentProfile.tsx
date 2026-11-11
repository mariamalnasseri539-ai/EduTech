import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Sparkles, 
  Edit3, 
  Check, 
  Zap, 
  Flame, 
  Code2, 
  Headphones, 
  Eye,
  Calendar,
  BookOpen,
  ShieldCheck,
  Hash
} from 'lucide-react';

interface StudentProfileProps {
  studentName?: string;
  onBackToDashboard: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  studentName = 'هيله سرحان الناصري',
  onBackToDashboard,
}) => {
  void onBackToDashboard;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // حالة نمط التعلم التكيفي المفضل
  const [learningStyle, setLearningStyle] = useState<'practical' | 'visual' | 'auditory'>('practical');
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('شغوفة بتعلم البرمجة وتطوير التطبيقات عبر منصة مسار الذكية.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // قراءة ومراقبة مظهر المنصة العام (Dark / Light)
  // Theme handled globally

  // بيانات الحساب الأساسية في المنصة (دون أي بيانات جامعية)
  const studentData = {
    name: studentName,
    email: 'student@masar.edu.ye',
    accountId: 'MSR-4089',
    accountStatus: 'حساب موثق ومفعل',
    membership: 'عضو مسجل في منصة مسار',
    joinedDate: 'سبتمبر 2026',
    completedCoursesCount: 1,
    currentStreak: 5,
    totalXp: 380,
  };

  // أنيميشن الخلفية
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.2,
      color: '255, 203, 116',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.color}, 0.7)`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSaveBio = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية الإضاءة والنقاط */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-12 py-8 z-10 flex flex-col gap-8">
        
        {/* عنوان الصفحة ومؤشرات الـ XP والـ Streak */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#111111] dark:text-white">
              الملف الشخصي
            </h1>
            <p className="text-xs text-[#FFCB74] font-bold mt-1">
              بيانات الحساب وتفضيلات التعلم
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFCB74] text-[#111111] text-xs font-black shadow-[0_0_15px_rgba(255,203,116,0.3)]">
              <Zap className="w-4 h-4 fill-current animate-bounce" />
              <span>{studentData.totalXp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black shadow-xs">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>{studentData.currentStreak} أيام مستمرة</span>
            </div>
          </div>
        </div>

        {/* 1. كرت رأس الملف الشخصي والأفاتار */}
        <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xs hover:shadow-lg transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCB74]/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* الصورة الرمزية */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F6F6F6] dark:bg-[#111111] border-2 border-[#FFCB74] flex items-center justify-center text-[#FFCB74] shadow-[0_0_30px_rgba(255,203,116,0.25)]">
                <User className="w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-lg bg-emerald-500 border-2 border-white dark:border-[#111111] flex items-center justify-center text-white shadow-xs" title="حساب نشط">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* الاسم والمعلومات الأساسية */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111111] dark:text-white">{studentData.name}</h2>
                  <span className="text-xs text-[#FFCB74] font-bold block mt-1">
                    {studentData.membership}
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl bg-[#F6F6F6] dark:bg-[#111111] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-700 dark:text-gray-300 shadow-2xs flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#FFCB74]" />
                    <span>مُعرّف الحساب: {studentData.accountId}</span>
                  </span>
                </div>
              </div>

              {/* النبذة التعريفية */}
              <div className="mt-4 pt-4 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">النبذة التعريفية (Bio):</span>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#FFCB74] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveBio}
                      className="text-xs text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer font-black"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>حفظ</span>
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {bio}
                  </p>
                ) : (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full bg-[#F6F6F6] dark:bg-[#111111] border border-[#FFCB74] rounded-xl p-3 text-xs text-[#111111] dark:text-white outline-none focus:ring-1 focus:ring-[#FFCB74]"
                  />
                )}

                {savedSuccess && (
                  <span className="text-[11px] text-emerald-500 font-bold block mt-1 animate-fadeIn">
                    ✓ تم حفظ النبذة التعريفية بنجاح!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. بيانات الحساب الأساسية ونمط التعلم */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* العمود الأيمن: بيانات الحساب بالمنصة */}
          <div className="lg:col-span-7 bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 sm:p-7 backdrop-blur-sm flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                <ShieldCheck className="w-5 h-5 text-[#FFCB74]" />
                <h3 className="text-base font-black text-[#111111] dark:text-white">بيانات الحساب الأساسية</h3>
              </div>

              <div className="space-y-3 text-xs">
                {/* البريد الإلكتروني دون حذف */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FFCB74]" />
                    <span>البريد الإلكتروني المعتمد:</span>
                  </span>
                  <span className="font-mono text-gray-800 dark:text-gray-200 font-bold">{studentData.email}</span>
                </div>

                {/* حالة الحساب */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFCB74]" />
                    <span>حالة الحساب:</span>
                  </span>
                  <span className="text-emerald-500 font-black">{studentData.accountStatus}</span>
                </div>

                {/* المقررات المكتملة */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#FFCB74]" />
                    <span>المقررات المكتملة:</span>
                  </span>
                  <span className="text-[#FFCB74] font-black">{studentData.completedCoursesCount} مقرر</span>
                </div>

                {/* تاريخ الانضمام */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <span className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FFCB74]" />
                    <span>تاريخ الانضمام للمنصة:</span>
                  </span>
                  <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{studentData.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" />
              <span>الحساب مسجل ونشط في منصة مسار للتعلم التكيفي الذكي.</span>
            </div>
          </div>

          {/* العمود الأيسر: نمط التعلم التكيفي المفضل */}
          <div className="lg:col-span-5 bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 sm:p-7 backdrop-blur-sm flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#FFCB74]" />
                <h3 className="text-base font-black text-[#111111] dark:text-white">نمط التعلم التكيفي المفضل</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed font-medium">
                تفضيل أسلوب تلقي الشروحات والأنشطة التفاعلية في الدروس:
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => setLearningStyle('practical')}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    learningStyle === 'practical'
                      ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-xs ring-1 ring-[#FFCB74]'
                      : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${learningStyle === 'practical' ? 'bg-[#FFCB74] text-[#111111]' : 'bg-gray-200 dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-400'}`}>
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">تطبيقي وعملي (Kinesthetic/Coding)</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">التركيز على حل الألغاز وتجربة الأكواد في المحرر</span>
                    </div>
                  </div>
                  {learningStyle === 'practical' && <Check className="w-4 h-4 text-[#FFCB74]" />}
                </button>

                <button
                  onClick={() => setLearningStyle('visual')}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    learningStyle === 'visual'
                      ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-xs ring-1 ring-[#FFCB74]'
                      : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${learningStyle === 'visual' ? 'bg-[#FFCB74] text-[#111111]' : 'bg-gray-200 dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-400'}`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">بصري ومفاهيمي (Visual/Conceptual)</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">التركيز على الجداول والمخططات والمقارنات</span>
                    </div>
                  </div>
                  {learningStyle === 'visual' && <Check className="w-4 h-4 text-[#FFCB74]" />}
                </button>

                <button
                  onClick={() => setLearningStyle('auditory')}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    learningStyle === 'auditory'
                      ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-xs ring-1 ring-[#FFCB74]'
                      : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${learningStyle === 'auditory' ? 'bg-[#FFCB74] text-[#111111]' : 'bg-gray-200 dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-400'}`}>
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">سمعي وتوضيحي (Auditory/TTS)</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">تفضيل الاستماع للشرح الصوتي للمفاهيم</span>
                    </div>
                  </div>
                  {learningStyle === 'auditory' && <Check className="w-4 h-4 text-[#FFCB74]" />}
                </button>
              </div>
            </div>

            <span className="text-[10px] text-emerald-500 font-bold mt-4 block">
              ✓ تم تعيين النمط التكيفي المفضل تلقائياً في جلستكِ الحالية.
            </span>
          </div>

        </div>

      </main>

    </div>
  );
};

export default StudentProfile;