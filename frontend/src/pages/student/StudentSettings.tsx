import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Volume2, 
  Bell, 
  Lock, 
  LogOut, 
  Check, 
  Play, 
  ShieldCheck
} from 'lucide-react';

interface StudentSettingsProps {
  studentName?: string;
  isDarkMode?: boolean;
  onToggleTheme?: (mode: boolean) => void;
  onBackToDashboard?: () => void;
  onLogout?: () => void;
}

export const StudentSettings: React.FC<StudentSettingsProps> = ({
  studentName = 'هيله سرحان الناصري',
  isDarkMode = true,
  onToggleTheme,
  onBackToDashboard,
  onLogout,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weaknessAlerts, setWeaknessAlerts] = useState(true);
  
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // تبديل وتطبيق المظهر العام فورياً
  const handleThemeChange = () => {
    const nextMode = !isDarkMode;
    localStorage.setItem('masar_theme', nextMode ? 'dark' : 'light');
    localStorage.setItem('app-theme', nextMode ? 'dark' : 'light');
    localStorage.setItem('edutech_theme', nextMode ? 'dark' : 'light');
    if (nextMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    if (onToggleTheme) {
      onToggleTheme(nextMode);
    }
  };

  const handleTestVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const testText = voiceGender === 'female'
        ? `أهلاً بكِ ${studentName}! أنا المساعدة الذكية، سأقوم بشرح الدروس التكيفية بهذه النبرة والسرعة.`
        : `أهلاً بك يا ${studentName}! أنا مرشدك الذكي، وسأرافقك في مسار تعلم البرمجة التكيفي.`;
      
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.lang = 'ar-SA';
      utterance.rate = speechRate;
      utterance.pitch = voiceGender === 'female' ? 1.25 : 0.75;

      utterance.onstart = () => setIsPlayingTestAudio(true);
      utterance.onend = () => setIsPlayingTestAudio(false);
      utterance.onerror = () => setIsPlayingTestAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('المتصفح لا يدعم محاكي القراءة الصوتية');
    }
  };

  const handleSaveAll = () => {
    localStorage.setItem('masar_theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('app-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('edutech_theme', isDarkMode ? 'dark' : 'light');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
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
  }, [isDarkMode]);

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية الإضاءة والنقاط */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* تنبيه الحفظ في منتصف الشاشة */}
      {saveToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-emerald-400/50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>تم حفظ كافة التفضيلات بنجاح في جلستك الحالية!</span>
        </div>
      )}

      {/* جسم الصفحة الرئيسي */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 lg:px-12 py-8 z-10 flex flex-col gap-6">
        
        {/* عنوان الصفحة وزر الحفظ المدمج */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#111111] dark:text-white">
              إعدادات المنصة والحساب
            </h1>
            <p className="text-xs text-[#FFCB74] font-bold mt-1">
              تخصيص المظهر، صوت الشرح، والتنبيهات الذكية
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFCB74] text-[#111111] font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer w-fit"
          >
            <Check className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </div>

        {/* 1. إعدادات المظهر بنمط الكبسولة الموحد */}
        <section className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-sm transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border flex items-center justify-center bg-[#FFCB74]/15 border-[#FFCB74]/40 text-[#FFCB74]">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111] dark:text-white">
                  مظهر المنصة (الوضع الليلي / النهاري)
                </h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  التبديل بين الوضع الداكن الملكي والوضع الأبيض الناصع لكافة الواجهات
                </span>
              </div>
            </div>

            {/* مفتاح الكبسولة المنزلق */}
            <div 
              onClick={handleThemeChange}
              className="w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 relative flex items-center justify-between border bg-[#F6F6F6] dark:bg-[#111111] border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74]"
              title={isDarkMode ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            >
              <div className="w-6 h-6 flex items-center justify-center z-10">
                <Sun className={`w-3.5 h-3.5 transition-opacity ${!isDarkMode ? 'opacity-100 text-[#111111]' : 'opacity-40 text-gray-400'}`} />
              </div>

              <div className="w-6 h-6 flex items-center justify-center z-10">
                <Moon className={`w-3.5 h-3.5 transition-opacity ${isDarkMode ? 'opacity-100 text-[#111111]' : 'opacity-40 text-gray-400'}`} />
              </div>

              <div 
                className={`absolute top-1 w-6 h-6 rounded-full transition-transform duration-300 shadow-md flex items-center justify-center bg-[#FFCB74] ${
                  isDarkMode 
                    ? 'translate-x-1' 
                    : '-translate-x-8'
                }`}
              />
            </div>
          </div>
        </section>

        {/* 2. إعدادات القارئ الصوتي التفاعلي (TTS Audio Settings) */}
        <section className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-sm transition-all shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F] mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl border flex items-center justify-center bg-[#FFCB74]/15 border-[#FFCB74]/40 text-[#FFCB74]">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#111111] dark:text-white">
                  إعدادات الصوت والشرح التفاعلي (TTS)
                </h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  تخصيص نوع صوت القارئ وسرعة القراءة في بطاقات الدروس
                </span>
              </div>
            </div>

            <button
              onClick={handleTestVoice}
              disabled={isPlayingTestAudio}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/20 dark:border-[#2F2F2F] text-gray-700 dark:text-gray-300 hover:text-[#111111] dark:hover:text-[#FFCB74] hover:border-[#FFCB74]"
            >
              <Play className={`w-3.5 h-3.5 ${isPlayingTestAudio ? 'animate-spin text-[#FFCB74]' : ''}`} />
              <span>{isPlayingTestAudio ? 'جارِ التجربة...' : 'تجربة الصوت'}</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold block mb-2.5 text-[#111111] dark:text-gray-300">
                جنس ونبرة صوت القارئ:
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setVoiceGender('female')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    voiceGender === 'female'
                      ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-xs ring-1 ring-[#FFCB74]'
                      : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">صوت أنثوي (Soft / Calm)</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      نبرة هادئة وواضحة لتوضيح المفاهيم
                    </span>
                  </div>
                  {voiceGender === 'female' && <Check className="w-4 h-4 text-[#FFCB74]" />}
                </button>

                <button
                  onClick={() => setVoiceGender('male')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                    voiceGender === 'male'
                      ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-xs ring-1 ring-[#FFCB74]'
                      : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block">صوت رجالي (Deep / Focused)</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      نبرة عميقة ومركزة للتوجيه البرمجي
                    </span>
                  </div>
                  {voiceGender === 'male' && <Check className="w-4 h-4 text-[#FFCB74]" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#111111] dark:text-gray-300">
                  سرعة القراءة الصوتية:
                </span>
                <span className="text-xs font-mono font-bold text-[#FFCB74]">
                  {speechRate}x
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[0.8, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSpeechRate(rate)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      speechRate === rate
                        ? 'bg-[#FFCB74] text-[#111111] border-transparent font-black shadow-xs'
                        : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-700 dark:text-gray-300 hover:border-[#FFCB74]'
                    }`}
                  >
                    {rate === 0.8 ? 'مريح (0.8x)' : rate === 1.0 ? 'طبيعي (1.0x)' : 'سريع (1.2x)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. إعدادات التنبيهات الذكية */}
        <section className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-sm transition-all shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F] mb-4">
            <div className="w-9 h-9 rounded-xl border flex items-center justify-center bg-[#FFCB74]/15 border-[#FFCB74]/40 text-[#FFCB74]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111111] dark:text-white">
                تفضيلات الإشعارات والتذكير
              </h3>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                التحكم في رسائل التذكير اليومي وتنبيهات المراجعة الموجهة
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
              <div>
                <span className="text-xs font-black block mb-0.5 text-[#111111] dark:text-white">
                  تذكير سلسلة التعلّم اليومية (Streak Reminder)
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  تنبيه ذكي يحفزكِ على المذاكرة يومياً للحفاظ على الـ Streak 🔥
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailyReminders}
                onChange={(e) => setDailyReminders(e.target.checked)}
                className="w-4 h-4 accent-[#FFCB74] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
              <div>
                <span className="text-xs font-black block mb-0.5 text-[#111111] dark:text-white">
                  إشعارات المراجعة الموجهة لنقاط الضعف
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  اقتراح بطاقات المراجعة للمفاهيم التي حصلتِ فيها على أقل من 80%
                </span>
              </div>
              <input
                type="checkbox"
                checked={weaknessAlerts}
                onChange={(e) => setWeaknessAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#FFCB74] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 4. الحساب والأمان وتسجيل الخروج */}
        <section className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] rounded-3xl p-6 backdrop-blur-sm transition-all shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F] mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111111] dark:text-white">
                الأمان والجلسة الحالية
              </h3>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                إدارة كلمة المرور وإنهاء الجلسة بأمان
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={() => alert('سيتم فتح نافذة تحديث كلمة المرور المربوطة بالباك إند.')}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/20 dark:border-[#2F2F2F] text-gray-700 dark:text-gray-300 hover:text-[#111111] dark:hover:text-white hover:border-[#FFCB74]"
            >
              <Lock className="w-4 h-4" />
              <span>تغيير كلمة المرور</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('هل أنتِ متأكدة من رغبتك في تسجيل الخروج من منصة مسار؟')) {
                  if (onLogout) onLogout();
                  else if (onBackToDashboard) onBackToDashboard();
                }
              }}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl border border-red-500/40 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج الآمن (Logout)</span>
            </button>
          </div>
        </section>

      </main>

    </div>
  );
};

export default StudentSettings;