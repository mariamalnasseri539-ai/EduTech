import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  User, 
  Settings, 
  Code2, 
  Bot, 
  UserCheck, 
  Sparkles, 
  Target, 
  FileCheck2,
  Menu,
  X
} from 'lucide-react';

// استيراد مكون اللوجو المعتمد
import { PlatformLogo } from '../../components/common/PlatformLogo';

// استيراد الواجهات المستقلة
import StudentCourses from './StudentCourses';
import PlacementTest from './PlacementTest';
import AdaptiveLesson from './AdaptiveLesson';
import StudentAchievements from './StudentAchievements';
import StudentProgress from './StudentProgress';
import StudentProfile from './StudentProfile';
import StudentSettings from './StudentSettings';

interface StudentDashboardProps {
  studentName?: string;
  onStartJourney?: () => void;
  onNavigateToCourses?: () => void;
  onBackToWelcome?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName = 'هيله سرحان الناصري',
  onBackToWelcome,
}) => {
  void onBackToWelcome;
  const [currentView, setCurrentView] = useState<
    'welcome' | 'courses' | 'test' | 'lesson' | 'achievements' | 'progress' | 'profile' | 'settings'
  >('welcome');
  const [selectedCourseId, setSelectedCourseId] = useState('python-101');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('أساسيات البرمجة بلغة Python');
  const [determinedStudentLevel, setDeterminedStudentLevel] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>('مبتدئ');
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'achievements' | 'progress' | 'profile' | 'settings'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // قراءة المظهر المحفوظ أو استخدام الفاتح (Light) كافتراضي معتمد وتطبيقه على الجذر
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('masar_theme') || localStorage.getItem('app-theme') || localStorage.getItem('edutech_theme');
    const isDark = saved ? saved === 'dark' : false;
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
    return isDark;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // دالة تغيير وحفظ المظهر العام فورياً
  const handleToggleTheme = (mode: boolean) => {
    setIsDarkMode(mode);
    localStorage.setItem('masar_theme', mode ? 'dark' : 'light');
    localStorage.setItem('app-theme', mode ? 'dark' : 'light');
    if (mode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  // تحديث التبويب النشط بالتزامن مع الشاشة المعروضة
  useEffect(() => {
    if (currentView === 'welcome') setActiveTab('home');
    else if (currentView === 'courses') setActiveTab('courses');
    else if (currentView === 'achievements') setActiveTab('achievements');
    else if (currentView === 'progress') setActiveTab('progress');
    else if (currentView === 'profile') setActiveTab('profile');
    else if (currentView === 'settings') setActiveTab('settings');
  }, [currentView]);

  // أنيميشن النقاط المضيئة بالخلفية متكيف مع المظهر بوضوح عالٍ
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

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.35,
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
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  // عناصر القائمة
  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, view: 'welcome' },
    { id: 'courses', label: 'المقررات الدراسية', icon: BookOpen, view: 'courses' },
    { id: 'achievements', label: 'إنجازاتي', icon: Trophy, view: 'achievements' },
    { id: 'progress', label: 'تقدمي الدراسي', icon: TrendingUp, view: 'progress' },
    { id: 'profile', label: 'الملف الشخصي', icon: User, view: 'profile' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, view: 'settings' },
  ] as const;

  // شاشات الاختبار والدرس المستقلة
  if (currentView === 'test') {
    return (
      <PlacementTest
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        onCancel={() => setCurrentView('courses')}
        onFinishTest={(_score, level) => {
          setDeterminedStudentLevel(level);
          setCurrentView('lesson');
        }}
      />
    );
  }

  if (currentView === 'lesson') {
    return (
      <AdaptiveLesson
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        studentLevel={determinedStudentLevel}
        onBackToDashboard={() => setCurrentView('courses')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 overflow-x-hidden relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية الإضاءة والنقاط المضيئة (ظاهرة دائماً فوق خلفية الصفحة وخلف المحتوى) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-90" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none z-[1]" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none z-[1]" />

      {/* ستارة التعتيم عند فتح السايد بار */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* السايد بار الموحد لجميع الواجهات */}
      <aside 
        className={`fixed top-0 right-0 h-screen max-h-screen w-72 border-l z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between py-6 px-5 shadow-2xl bg-white dark:bg-[#111111] border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-[#111111] dark:text-[#FFFFFF] overflow-y-auto overflow-x-hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
            <div className="flex items-center gap-3">
              <PlatformLogo size={42} />
              <div>
                <span className="text-base font-black text-[#111111] dark:text-[#FFCB74] tracking-wider block leading-tight">مسار</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">MASAR</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-gray-100 dark:bg-[#2F2F2F] hover:bg-gray-200 dark:hover:bg-[#3F3F3F] text-gray-700 dark:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setCurrentView(item.view);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFCB74] text-[#111111] font-black shadow-[0_0_20px_rgba(255,203,116,0.35)]'
                      : 'text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2F2F2F]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#111111]' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-[11px] text-center border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] pt-4 text-gray-500 dark:text-gray-400">
          منصة مسار للتعلم التكيفي الذكي
        </div>
      </aside>

      {/* الشريط العلوي الثابت تماماً (Fixed Navbar) عبر كافة الصفحات */}
      <header className="fixed top-0 inset-x-0 w-full flex items-center justify-between px-8 lg:px-14 py-4 border-b z-40 backdrop-blur-md transition-colors bg-white/95 dark:bg-[#111111]/85 border-[#2F2F2F]/15 dark:border-[#2F2F2F] shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer bg-white dark:bg-[#2F2F2F] border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74] text-[#111111] dark:text-[#FFCB74] shadow-xs"
            title="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => {
              setCurrentView('welcome');
              setActiveTab('home');
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <PlatformLogo size={38} />
            <div className="text-right">
              <h2 className="text-sm font-bold leading-tight text-[#111111] dark:text-white">
                منصة مسار الذكية
              </h2>
              <p className="text-[11px] text-[#FFCB74] font-medium tracking-wide">MASAR</p>
            </div>
          </div>
        </div>
      </header>

      {/* جسم الصفحة المتغير حسب التبويب المختار */}
      <div className="flex-1 flex flex-col relative z-10 pt-20">
        
        {/* 1. صفحة المقررات */}
        {currentView === 'courses' && (
          <StudentCourses 
            studentLevel={determinedStudentLevel}
            onBackToDashboard={() => setCurrentView('welcome')}
            onSelectCourse={(courseId, startMode, courseTitle) => {
              setSelectedCourseId(courseId);
              if (courseTitle) setSelectedCourseTitle(courseTitle);
              if (startMode === 'direct_lesson') {
                setDeterminedStudentLevel('مبتدئ');
                setCurrentView('lesson');
              } else {
                setCurrentView('test');
              }
            }}
          />
        )}

        {/* 2. صفحة إنجازاتي */}
        {currentView === 'achievements' && (
          <StudentAchievements 
            studentName={studentName}
            onBackToDashboard={() => setCurrentView('welcome')}
          />
        )}

        {/* 3. صفحة تقدمي الدراسي */}
        {currentView === 'progress' && (
          <StudentProgress 
            studentName={studentName}
            onBackToDashboard={() => setCurrentView('welcome')}
          />
        )}

        {/* 4. صفحة الملف الشخصي */}
        {currentView === 'profile' && (
          <StudentProfile 
            studentName={studentName}
            onBackToDashboard={() => setCurrentView('welcome')}
          />
        )}

        {/* 5. صفحة الإعدادات */}
        {currentView === 'settings' && (
          <StudentSettings 
            studentName={studentName}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            onBackToDashboard={() => setCurrentView('welcome')}
            onLogout={() => setCurrentView('welcome')}
          />
        )}

        {/* 6. الواجهة الترحيبية الرئيسية */}
        {currentView === 'welcome' && (
          <main className="flex-1 flex flex-col justify-center items-center px-6 lg:px-12 py-10 max-w-6xl mx-auto w-full relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center w-full mb-12 mt-2">
              <div className="md:col-span-7 text-right">
                <h1 className="text-3xl lg:text-5xl font-black mb-3 leading-tight text-[#111111] dark:text-[#FFFFFF]">
                  أهلاً بكِ، <span className="text-[#FFCB74] drop-shadow-xs">{studentName}</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#FFCB74] mb-5">
                  تعلّم البرمجة بالطريقة التي تناسبك.
                </h2>
                <p className="text-base leading-relaxed max-w-xl text-gray-600 dark:text-gray-400 font-medium">
                  منصة تعليمية ذكية تتكيف مع مستواك واحتياجاتك الشخصية، ابدأ بتحديد مستواك المعرفي، ثم تعلّم عبر دروس تفاعلية مخصصة وتطبيق عملي بمساعدة المصحح الذكي.
                </p>
              </div>

              {/* قسم الشاشة والمربعات الدائرية المحيطة بها */}
              <div className="md:col-span-5 flex justify-center relative">
                <div className="relative w-72 h-72 flex items-center justify-center">
                  
                  {/* الدوائر الذهبية الدوارة */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-[#FFCB74] animate-spin shadow-[0_0_20px_rgba(255,203,116,0.25)]" 
                    style={{ animationDuration: '32s' }} 
                  />
                  <div 
                    className="absolute inset-5 rounded-full border-2 border-dashed border-[#FFCB74]/70 animate-spin" 
                    style={{ animationDuration: '22s', animationDirection: 'reverse' }} 
                  />
                  
                  {/* المربعات الثلاثة المحيطة بالشاشة */}
                  <div className="absolute top-2 right-10 w-11 h-11 rounded-xl border flex items-center justify-center shadow-md bg-white dark:bg-[#2F2F2F] border-[#FFCB74]/40">
                    <span className="text-base font-bold text-[#FFCB74]">🐍</span>
                  </div>

                  <div className="absolute top-14 -left-1 w-11 h-11 rounded-xl border flex items-center justify-center shadow-md bg-white dark:bg-[#2F2F2F] border-[#FFCB74]/40 text-[#FFCB74]">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-8 right-4 w-10 h-10 rounded-xl border flex items-center justify-center shadow-md bg-white dark:bg-[#2F2F2F] border-[#FFCB74]/40 text-[#FFCB74]">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  {/* مجسم الشاشة الرئيسي */}
                  <div className="w-52 h-40 rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-colors shadow-2xl bg-white dark:bg-[#2F2F2F] border-[#FFCB74]">
                    <div className="w-full h-full rounded-xl border flex items-center justify-center bg-[#F6F6F6] dark:bg-[#111111] border-[#2F2F2F]/20 dark:border-[#2F2F2F]">
                      <span className="font-mono text-3xl font-black text-[#FFCB74] drop-shadow-[0_0_14px_rgba(255,203,116,0.9)]">
                        &lt;/&gt;
                      </span>
                    </div>
                    <div className="w-20 h-1 rounded-full bg-[#FFCB74] mt-1.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* كروت المزايا */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl mb-12">
              <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl py-5 px-6 flex items-center justify-center gap-3.5 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#FFCB74]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">تعلّم مخصص</span>
              </div>

              <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl py-5 px-6 flex items-center justify-center gap-3.5 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#FFCB74]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">مساعد ذكي</span>
              </div>

              <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] rounded-2xl py-5 px-6 flex items-center justify-center gap-3.5 transition-all duration-300 shadow-sm hover:shadow-lg">
                <div className="w-11 h-11 rounded-xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#FFCB74]">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">تطبيق عملي</span>
              </div>
            </div>

            {/* مسار الرحلة */}
            <div className="w-full max-w-5xl relative mb-12 px-6">
              
              {/* الخط الذهبي الواصل بين المراحل */}
              <div className="absolute top-7 left-16 right-16 h-[2px] bg-[#FFCB74]/50 -z-0" />

              <div className="grid grid-cols-4 gap-4 relative z-10">
                
                {/* 1. تحديد المستوى */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#FFCB74] border-2 border-white dark:border-[#111111] flex items-center justify-center shadow-[0_0_20px_rgba(255,203,116,0.6)] mb-2.5 transition-all ring-2 ring-[#FFCB74]">
                    <Target className="w-6 h-6 stroke-[2.4] text-[#111111] drop-shadow-sm" />
                  </div>
                  <div className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">تحديد المستوى</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">فحص تشخيصي أولي</div>
                </div>

                {/* 2. الدروس التكيفية */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#FFCB74] flex items-center justify-center mb-2.5 transition-all shadow-xs bg-white dark:bg-[#2F2F2F] text-[#FFCB74]">
                    <BookOpen className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">2. الدروس التكيفية</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">تعلّم نشط</div>
                </div>

                {/* 3. الاختبارات والتقييم */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#FFCB74] flex items-center justify-center mb-2.5 transition-all shadow-xs bg-white dark:bg-[#2F2F2F] text-[#FFCB74]">
                    <Sparkles className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">3. الاختبارات والتقييم</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">تقييم الإتقان</div>
                </div>

                {/* 4. الشهادة المعتمدة */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full border-2 border-[#FFCB74] flex items-center justify-center mb-2.5 transition-all shadow-xs bg-white dark:bg-[#2F2F2F] text-[#FFCB74]">
                    <FileCheck2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="text-sm font-bold text-[#111111] dark:text-[#FFFFFF]">4. الشهادة المعتمدة</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">إصدار وثيقة الإتقان</div>
                </div>

              </div>
            </div>

            <button
              onClick={() => setCurrentView('courses')}
              className="px-16 py-4 rounded-full font-black text-[#111111] text-base bg-[#FFCB74] shadow-[0_0_35px_rgba(255,203,116,0.5)] hover:shadow-[0_0_50px_rgba(255,203,116,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              ابدأ رحلتك التعليمية
            </button>
          </main>
        )}
      </div>

      {/* الفوتر */}
      <footer className="w-full py-4 text-center text-xs border-t z-20 backdrop-blur-md transition-colors border-[#2F2F2F]/15 dark:border-[#2F2F2F]/50 bg-white/70 dark:bg-[#111111]/70 text-gray-500 dark:text-gray-400">
        منصة مسار للتعلم التكيفي الذكي • جميع الحقوق محفوظة
      </footer>

    </div>
  );
};

export default StudentDashboard;