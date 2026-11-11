import React, { useEffect, useRef } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  BarChart3,
  Clock,
  Layers
} from 'lucide-react';

interface ConceptMastery {
  name: string;
  category: string;
  masteryRate: number; // النسبة المئوية
  status: 'mastered' | 'learning' | 'needs_review';
}

interface StudentProgressProps {
  studentName?: string;
  onBackToDashboard?: () => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  studentName = 'هيله سرحان الناصري',
}) => {
  void studentName;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // قراءة ومراقبة مظهر المنصة العام (Dark / Light)
  // Theme handled globally

  // بيانات الحالة المعرفية ومؤشرات التمكن
  const progressOverview = {
    overallMastery: 78,
    zpdLevel: 'متوسط (Intermediate)',
    completedTopics: 8,
    totalTopics: 12,
    studyHours: '14.5 ساعة',
    diagnosticScore: '8/10',
  };

  // مصفوفة المفاهيم البرمجية وتتبع الإتقان لكل مفهوم
  const concepts: ConceptMastery[] = [
    { name: 'المتغيرات وأنواع البيانات الديناميكية', category: 'أساسيات Python', masteryRate: 95, status: 'mastered' },
    { name: 'العمليات الحسابية وأولويات التنفيذ', category: 'أساسيات Python', masteryRate: 90, status: 'mastered' },
    { name: 'الجمل الشرطية والتحقق المنطقي (if/else)', category: 'هياكل التحكم', masteryRate: 85, status: 'mastered' },
    { name: 'حلقات التكرار ومجال range()', category: 'هياكل التحكم', masteryRate: 72, status: 'learning' },
    { name: 'القوائم والعمليات على المصفوفات (Lists)', category: 'هياكل البيانات', masteryRate: 65, status: 'learning' },
    { name: 'الدوال والمعاملات الافتراضية (Functions)', category: 'البرمجة الإجرائية', masteryRate: 45, status: 'needs_review' },
  ];

  // نقاط القوة ومواطن المراجعة الموجهة
  const strengths = [
    'استيعاب ممتاز لنظام الكتابة الديناميكي وتخزين المتغيرات في الذاكرة.',
    'دقة عالية في حل ألغاز الكود التفاعلية المتعلقة بالعمليات الرياضية.',
    'سرعة استجابة متميزة في أسئلة الاختيار من متعدد المفاهيمية.'
  ];

  const weaknesses = [
    'الحاجة لمراجعة نطاق المعاملات الافتراضية داخل الدوال البرمجية.',
    'تتبع الحلقات المتداخلة (Nested Loops) يحتاج لتطبيق إضافي في محرر الكود.'
  ];

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

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية الإضاءة والنقاط */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* جسم الصفحة الرئيسي */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 z-10 flex flex-col gap-8">
        
        {/* عنوان الصفحة وشارة منطقة النمو (ZPD) المدمجة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#111111] dark:text-white">
              الحالة المعرفية والتقدم الدراسي
            </h1>
            <p className="text-xs text-[#FFCB74] font-bold mt-1">
              مخطط تتبع التمكن التكيفي المعرفي (Cognitive Mastery)
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFCB74] text-[#111111] text-xs font-black shadow-[0_0_15px_rgba(255,203,116,0.3)] w-fit">
            <Brain className="w-4 h-4 animate-pulse" />
            <span>منطقة النمو ZPD: {progressOverview.zpdLevel.split(' ')[0]}</span>
          </div>
        </div>

        {/* 1. لوحة المؤشرات الإجمالية ومستوى منطقة النمو (ZPD) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* كرت معدل التمكن الإجمالي */}
          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">معدل التمكن الإجمالي</span>
              <BarChart3 className="w-5 h-5 text-[#FFCB74]" />
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#111111] dark:text-white">{progressOverview.overallMastery}%</span>
                <span className="text-xs text-emerald-500 font-bold">+12% هذا الأسبوع</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-[#111111] overflow-hidden border border-[#2F2F2F]/15 dark:border-transparent">
                <div 
                  className="h-full bg-[#FFCB74] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,203,116,0.6)]"
                  style={{ width: `${progressOverview.overallMastery}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-3 leading-relaxed font-medium">
              المعيار المطلوب لإتقان أي مقرر وإصدار وثيقته هو <strong className="text-[#FFCB74]">80%</strong> فما فوق.
            </p>
          </div>

          {/* كرت منطقة التعلّم والنمو الوشيك (ZPD Level) */}
          <div className="bg-white dark:bg-[#2F2F2F] border border-[#FFCB74]/50 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-[0_0_30px_rgba(255,203,116,0.12)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[#FFCB74] font-black">منطقة النمو التكيفي (ZPD)</span>
              <Target className="w-5 h-5 text-[#FFCB74]" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#111111] dark:text-white mb-1.5">{progressOverview.zpdLevel}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3 font-medium">
                يقوم محرك الذكاء الاصطناعي بتوليد تحديات تناسب قدراتكِ الحالية تماماً لمنع الملل أو الإحباط المعرفي.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Sparkles className="w-4 h-4 text-[#FFCB74] shrink-0" />
              <span>نتيجة الفحص التشخيصي الأولي: <strong className="text-[#111111] dark:text-white">{progressOverview.diagnosticScore}</strong></span>
            </div>
          </div>

          {/* كرت إحصائيات المواضيع والوقت */}
          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">حجم الإنجاز المعرفي</span>
              <Layers className="w-5 h-5 text-[#FFCB74]" />
            </div>

            <div className="grid grid-cols-2 gap-4 my-auto">
              <div className="bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-2xl p-3.5">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">المفاهيم المتقنة</span>
                <span className="text-xl font-black text-[#111111] dark:text-white">{progressOverview.completedTopics} <span className="text-xs text-gray-400">/ {progressOverview.totalTopics}</span></span>
              </div>
              <div className="bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-2xl p-3.5">
                <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-1 font-medium">وقت التعلّم التراكمي</span>
                <span className="text-xl font-black text-[#FFCB74]">{progressOverview.studyHours}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>آخر جلسة دراسية مسجلة: اليوم</span>
            </div>
          </div>

        </section>

        {/* 2. تتبع إتقان المفاهيم البرمجية (Concept Knowledge Tracing) */}
        <section className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 lg:p-8 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
            <div>
              <h3 className="text-lg font-black text-[#111111] dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#FFCB74]" />
                <span>شجرة تتبع إتقان المفاهيم المعرفية (Knowledge Concept Tracing)</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">تحديث لحظي لدرجات التمكن لكل مفهوم برمجي بناءً على حل الألغاز والأكواد</p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#F6F6F6] dark:bg-[#111111] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-[#111111] dark:text-gray-300">
              مقرر: بايثون الأساسي
            </span>
          </div>

          <div className="space-y-4">
            {concepts.map((c, idx) => (
              <div key={idx} className="bg-[#F6F6F6] dark:bg-[#111111]/40 border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-4 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFCB74]" />
                    <h4 className="text-sm font-black text-[#111111] dark:text-white">{c.name}</h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] font-medium">
                      {c.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'mastered' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                        : c.status === 'learning'
                        ? 'bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-bold'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}>
                      {c.status === 'mastered' ? 'متقن (Mastered)' : c.status === 'learning' ? 'قيد الاكتساب' : 'بحاجة لمراجعة'}
                    </span>
                    <span className="font-mono text-sm font-black text-[#111111] dark:text-white w-12 text-left">{c.masteryRate}%</span>
                  </div>
                </div>

                {/* شريط الإتقان */}
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-[#111111] overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      c.masteryRate >= 80 
                        ? 'bg-[#FFCB74]' 
                        : c.masteryRate >= 60
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${c.masteryRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. تشخيص نقاط القوة والتوصيات الذكية بالمراجعة (Strengths & Weaknesses) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* نقاط القوة والتميز */}
          <div className="bg-white dark:bg-[#2F2F2F] border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#111111] dark:text-white">نقاط التميز والقوة الأكاديمية</h4>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">مفاهيم حققتِ فيها نسبة إتقان تفوق 85%</span>
              </div>
            </div>

            <ul className="space-y-3">
              {strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-[#F6F6F6] dark:bg-[#111111]/40 p-3 rounded-xl border border-[#2F2F2F]/15 dark:border-[#2F2F2F] font-medium">
                  <span className="text-emerald-500 font-black mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* خطة المراجعة الموجهة والتوصيات */}
          <div className="bg-white dark:bg-[#2F2F2F] border border-amber-500/30 rounded-3xl p-6 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#111111] dark:text-white">توصيات المراجعة الموجهة (Guided Review)</h4>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">مواضيع يقترح المرشد الذكي تعزيز فهمها</span>
              </div>
            </div>

            <ul className="space-y-3">
              {weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-[#F6F6F6] dark:bg-[#111111]/40 p-3 rounded-xl border border-[#2F2F2F]/15 dark:border-[#2F2F2F] font-medium">
                  <span className="text-amber-500 font-black mt-0.5">!</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

      </main>

    </div>
  );
};

export default StudentProgress;