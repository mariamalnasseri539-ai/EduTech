import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  FileCheck2, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  Lock,
  Star
} from 'lucide-react';

import StudentCertificate, { CertificateData } from './StudentCertificate';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // النسبة المئوية لإنجاز الوسام
  category: 'التزام' | 'برمجة' | 'إتقان';
}

interface StudentAchievementsProps {
  studentName?: string;
  onBackToDashboard: () => void;
}

export const StudentAchievements: React.FC<StudentAchievementsProps> = ({
  studentName = 'هيله سرحان الناصري',
  onBackToDashboard,
}) => {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // قراءة ومراقبة مظهر المنصة العام (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edutech_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('edutech_theme');
      setIsDarkMode(saved ? saved === 'dark' : true);
    };

    window.addEventListener('storage', checkTheme);
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  // إحصائيات التلعيب
  const stats = {
    totalXp: 380,
    streakDays: 5,
    certificatesCount: 1,
    unlockedBadgesCount: 3,
    totalBadgesCount: 6,
  };

  // قائمة الشهادات المكتسبة
  const earnedCertificates: CertificateData[] = [
    {
      studentName: studentName,
      courseTitle: 'أساسيات البرمجة بلغة Python',
      studentLevel: 'مبتدئ',
      masteryPercentage: 100,
      serialNumber: 'EDT-PY-2026-95',
      issueDate: '2026-10-28',
    }
  ];

  // الأوسمة والشارات التحفيزية
  const badges: Badge[] = [
    {
      id: 'first-step',
      title: 'الانطلاقة الأولى',
      description: 'إكمال أول درس تشخيصي بنجاح وتحديد منطقة التعلم الوشيك.',
      icon: '🚀',
      unlocked: true,
      progress: 100,
      category: 'التزام'
    },
    {
      id: 'code-solver',
      title: 'محللة الشفرات',
      description: 'حل 5 ألغاز كود تفاعلية دون أي خطأ نحوي.',
      icon: '🧩',
      unlocked: true,
      progress: 100,
      category: 'برمجة'
    },
    {
      id: 'python-master',
      title: 'إتقان بايثون',
      description: 'اجتياز التقييم النهائي الشامل لمقرر بايثون بنسبة 80% أو أكثر.',
      icon: '🐍',
      unlocked: true,
      progress: 100,
      category: 'إتقان'
    },
    {
      id: 'streak-champion',
      title: 'شعلة الاستمرار',
      description: 'الحفاظ على سلسلة تعلّم يومية مستمرة لمدة 7 أيام متتالية.',
      icon: '🔥',
      unlocked: false,
      progress: 71, // 5 من 7 أيام
      category: 'التزام'
    },
    {
      id: 'ai-collaborator',
      title: 'صديقة الذكاء الاصطناعي',
      description: 'الاستفادة من المرشد الذكي وسؤاله 10 أسئلة سياقية لتثبيت المفاهيم.',
      icon: '🤖',
      unlocked: false,
      progress: 40,
      category: 'إتقان'
    },
    {
      id: 'full-stack-legend',
      title: 'مهندسة البرمجيات الشاملة',
      description: 'إتمام كافة المقررات الـ 5 المقررة في المنصة بنجاح معتمد.',
      icon: '👑',
      unlocked: false,
      progress: 20,
      category: 'برمجة'
    }
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

  const handleOpenCertificate = (cert: CertificateData) => {
    setSelectedCert(cert);
    setIsCertModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية النقاط المضيئة */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* جسم الصفحة الرئيسي */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 z-10 flex flex-col gap-8">
        
        {/* عنوان الصفحة وشارات الـ XP والـ Streak المدمجة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#111111] dark:text-white">
              سجل الإنجازات والشهادات
            </h1>
            <p className="text-xs text-[#FFCB74] font-bold mt-1">
              مستودع أوسمتكِ ووثائق إتقانكِ الأكاديمية
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFCB74] text-[#111111] text-xs font-black shadow-[0_0_15px_rgba(255,203,116,0.3)]">
              <Zap className="w-4 h-4 fill-current animate-bounce" />
              <span>{stats.totalXp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-black shadow-xs">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>{stats.streakDays} أيام مستمرة</span>
            </div>
          </div>
        </div>

        {/* 1. كروت الإحصائيات التلخيصية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-5 backdrop-blur-sm flex items-center gap-4 shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74] shadow-xs">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">إجمالي نقاط الخبرة</span>
              <span className="text-2xl font-black text-[#111111] dark:text-white">{stats.totalXp} <span className="text-xs text-[#FFCB74]">XP</span></span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-5 backdrop-blur-sm flex items-center gap-4 shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 shadow-xs">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">سلسلة التعلّم اليومي</span>
              <span className="text-2xl font-black text-[#111111] dark:text-white">{stats.streakDays} <span className="text-xs text-orange-500 font-bold">أيام</span></span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-5 backdrop-blur-sm flex items-center gap-4 shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">الشهادات المعتمدة</span>
              <span className="text-2xl font-black text-[#111111] dark:text-white">{stats.certificatesCount} <span className="text-xs text-emerald-500 font-bold">شهادة</span></span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-5 backdrop-blur-sm flex items-center gap-4 shadow-xs transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">الأوسمة المكتسبة</span>
              <span className="text-2xl font-black text-[#111111] dark:text-white">{stats.unlockedBadgesCount} <span className="text-xs text-gray-400">/ {stats.totalBadgesCount}</span></span>
            </div>
          </div>
        </div>

        {/* 2. قسم الشهادات المعتمدة (معاينة وطباعة فورية) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#FFCB74]" />
              <h3 className="text-lg font-black text-[#111111] dark:text-white">وثائق الإتقان والشهادات الرقمية المعتمدة</h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">الشهادات مسجلة برقم تسلسلي معتمد وتاريخ إصدار</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {earnedCertificates.map((cert, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group relative overflow-hidden shadow-xs"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCB74]/[0.08] rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#FFCB74]/15 border border-[#FFCB74]/40 text-[#111111] dark:text-[#FFCB74]">
                      {cert.serialNumber}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>معتمد 100%</span>
                    </span>
                  </div>

                  <h4 className="text-base font-black text-[#111111] dark:text-white mb-1 group-hover:text-[#FFCB74] transition-colors">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    المستوى المتقن: <strong className="text-[#111111] dark:text-gray-200">{cert.studentLevel}</strong> - الامتياز الأكاديمي
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 py-3 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] mb-4">
                    <span>تاريخ الإصدار:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{cert.issueDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCertificate(cert)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-[#FFCB74] text-[#111111] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>عرض وطباعة الشهادة</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. شاشات الأوسمة والشارات (Badges Showcase) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFCB74]" />
              <h3 className="text-lg font-black text-[#111111] dark:text-white">لوحة الأوسمة والشارات التفاعلية</h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">تفتح الأوسمة آلياً مع استمراركِ في حل الألغاز والتحديات</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div 
                key={b.id}
                className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-xs ${
                  b.unlocked 
                    ? 'bg-white dark:bg-[#2F2F2F] border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] hover:shadow-lg' 
                    : 'bg-white/50 dark:bg-[#2F2F2F]/40 border-[#2F2F2F]/10 dark:border-[#2F2F2F]/30 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs ${
                      b.unlocked 
                        ? 'bg-[#FFCB74]/15 border border-[#FFCB74]/40' 
                        : 'bg-gray-100 dark:bg-[#111111] border border-[#2F2F2F]/20 grayscale'
                    }`}>
                      {b.icon}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.unlocked 
                        ? 'bg-[#FFCB74]/15 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/30' 
                        : 'bg-gray-100 dark:bg-[#111111] text-gray-500 border border-[#2F2F2F]/20'
                    }`}>
                      {b.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-black text-[#111111] dark:text-white">{b.title}</h4>
                    {!b.unlocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4 font-medium">
                    {b.description}
                  </p>
                </div>

                {/* شريط الإنجاز للوسام */}
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-gray-500 dark:text-gray-400 font-bold">{b.unlocked ? 'مكتمل' : 'قيد التقدم'}</span>
                    <span className={`font-black ${b.unlocked ? 'text-[#FFCB74]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {b.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-[#111111] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.unlocked 
                          ? 'bg-[#FFCB74] shadow-[0_0_10px_rgba(255,203,116,0.5)]' 
                          : 'bg-gray-400 dark:bg-gray-600'
                      }`}
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </main>

      {/* استدعاء المكون المستقل للشهادة */}
      {selectedCert && (
        <StudentCertificate
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          data={selectedCert}
        />
      )}

    </div>
  );
};

export default StudentAchievements;