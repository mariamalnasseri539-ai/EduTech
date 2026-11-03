import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Trophy, 
  Code2, 
  Zap, 
  Timer,
  BookOpen,
  HelpCircle,
  Network,
  Lock,
  GitBranch,
  Target
} from 'lucide-react';

// استيراد مكون اللوجو المعتمد
import { PlatformLogo } from '../../components/common/PlatformLogo';

interface Question {
  id: number;
  type: 'theory' | 'code';
  title: string;
  concept: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ConceptNode {
  title: string;
  description: string;
  requiredLevel: 'مبتدئ' | 'متوسط' | 'متقدم';
  subConcepts: string[];
}

interface PlacementTestProps {
  courseTitle?: string;
  onFinishTest: (score: number, level: 'مبتدئ' | 'متوسط' | 'متقدم') => void;
  onCancel: () => void;
}

export const PlacementTest: React.FC<PlacementTestProps> = ({
  courseTitle = 'أساسيات البرمجة بلغة Python',
  onFinishTest,
  onCancel,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [showResult, setShowResult] = useState(false);
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

  // أنيميشن النقاط المضيئة بالخلفية
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
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
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

  // بنك الأسئلة الشامل
  const questions: Question[] = [
    {
      id: 1,
      type: 'theory',
      title: 'ما هو الفرق الجوهري بين لغات البرمجة المفسرة (Interpreted) والمترجمة (Compiled)؟',
      concept: 'مفاهيم لغات البرمجة',
      options: [
        'اللغة المفسرة تُنفذ الكود سطراً بسطر وقت التشغيل، بينما المترجمة تُحوّله مسبقاً لملف تنفيذي آلي.',
        'اللغات المفسرة أسرع دائماً في الأداء من اللغات المترجمة.',
        'اللغات المترجمة لا تكتشف الأخطاء إلا بعد تشغيل البرنامج بالكامل.',
        'لا يوجد أي فرق تقني، التسمية مجرد تصنيف تجاري فقط.'
      ],
      correctAnswer: 0,
      explanation: 'المفسر (Interpreter) مثل بايثون ينفذ الأسطر فورياً وبشكل متتابع، أما المترجم (Compiler) مثل C++ فيترجم الكود كاملاً لملف آلي.'
    },
    {
      id: 2,
      type: 'code',
      title: 'ما هي القيمة المطبوعة عند تنفيذ هذا المقطع البرمجي؟',
      concept: 'المتغيرات والعمليات الحسابية',
      code: `x = 10\ny = 3\nresult = x // y + x % y\nprint(result)`,
      options: ['3', '4', '4.33', '1'],
      correctAnswer: 1,
      explanation: 'العملية // تعيد ناتج القسمة الصحيح (3)، والعملية % تعيد باقي القسمة (1)، وبجمعهما نحصل على 4.'
    },
    {
      id: 3,
      type: 'theory',
      title: 'أي من هياكل البيانات التالية في بايثون يُعتبر غير قابل للتعديل بعد الإنشاء (Immutable)؟',
      concept: 'أنواع البيانات وهياكلها',
      options: [
        'القوائم (Lists)',
        'القواميس (Dictionaries)',
        'الصفوف الثابتة (Tuples)',
        'المجموعات (Sets)'
      ],
      correctAnswer: 2,
      explanation: 'الـ Tuple هيكل بيانات غير قابل للتغيير أو التعديل (Immutable) بمجرد إنشائه.'
    },
    {
      id: 4,
      type: 'code',
      title: 'ما المخرجات الناتجة عن تكرار حلقة for التالية؟',
      concept: 'الحلقات الشرطية ومجال الـ Range',
      code: `total = 0\nfor i in range(1, 6, 2):\n    total += i\nprint(total)`,
      options: ['9', '6', '15', '5'],
      correctAnswer: 0,
      explanation: 'الدالة range(1, 6, 2) تُنتج القيم [1, 3, 5]، ومجموعها = 9.'
    },
    {
      id: 5,
      type: 'theory',
      title: 'ماذا يُقصد بمفهوم "التغليف" (Encapsulation) في البرمجة كائنية التوجه (OOP)؟',
      concept: 'البرمجة كائنية التوجه',
      options: [
        'إمكانية توريث الخصائص من كلاس أب إلى كلاس ابن.',
        'إخفاء البيانات وتفاصيل التنفيذ الداخلية وحمايتها من الوصول الخارجي المباشر.',
        'كتابة دالة بنفس الاسم لكن بسلوكيات متعددة ومختلفة.',
        'تحويل الكود البرمجي إلى كود مضغوط وسريع التحميل.'
      ],
      correctAnswer: 1,
      explanation: 'التغليف يعني تجميع البيانات والدوال معاً وتقييد الوصول المباشر لمتغيرات الكائن لضمان سلامة البيانات.'
    },
    {
      id: 6,
      type: 'code',
      title: 'ما القيمة التي ستعيدها الدالة عند استدعائها بالقيم الموضحة أدناه؟',
      concept: 'الدوال والمعاملات الافتراضية',
      code: `def apply_discount(price, rate=0.1):\n    if price > 100:\n        return price - (price * rate)\n    return price\n\nprint(apply_discount(200, 0.2))`,
      options: ['160.0', '180.0', '200', '190.0'],
      correctAnswer: 0,
      explanation: 'المعامل rate تم تمريره بقيمة 0.2 متجاوزاً القيمة الافتراضية، فيصبح الناتج 200 - 40 = 160.0.'
    },
    {
      id: 7,
      type: 'theory',
      title: 'ما هو التعقيد الزمني (Time Complexity) لعملية البحث الثنائي (Binary Search) في مصفوفة مرتبة؟',
      concept: 'الخوارزميات وهياكل البيانات',
      options: [
        'O(1)',
        'O(n)',
        'O(log n)',
        'O(n^2)'
      ],
      correctAnswer: 2,
      explanation: 'البحث الثنائي يقسم نطاق البحث إلى النصف في كل خطوة، لذلك تعقيده الزمني هو O(log n).'
    },
    {
      id: 8,
      type: 'code',
      title: 'ما الناتج النهائي للعمليات المطبقة على عناصر القائمة التالية؟',
      concept: 'معالجة وتعديل القوائم',
      code: `nums = [1, 2, 3]\nnums.append(4)\nnums.pop(1)\nprint(len(nums) * nums[-1])`,
      options: ['12', '16', '9', '8'],
      correctAnswer: 0,
      explanation: 'أصبحت القائمة [1, 3, 4] بطول 3 والعنصر الأخير 4، وحاصل ضرب 3 × 4 = 12.'
    },
    {
      id: 9,
      type: 'theory',
      title: 'في سياق الذكاء الاصطناعي التوليدي، ماذا يعني مصطلح (Hallucination / الهلوسة)؟',
      concept: 'أساسيات الذكاء الاصطناعي ونماذج الـ LLM',
      options: [
        'توليد النموذج لإجابات تبدو لغوياً صحيحة ومقنعة لكنها غير دقيقة أو مختلقة علمياً.',
        'توقف السيرفر عن العمل بسبب نفاد الذاكرة العشوائية.',
        'ترجمة النصوص بين اللغات بسرعة فائقة وغير متوقعة.',
        'فشل النموذج في فهم اللغة الإنجليزية التقنية.'
      ],
      correctAnswer: 0,
      explanation: 'الهلوسة تعني إنتاج نصوص أو حقائق وهمية غير مدعمة بالبيانات الصحيحة.'
    },
    {
      id: 10,
      type: 'code',
      title: 'ماذا سيطبع البرنامج عند استدعاء الخاصية من الكائن؟',
      concept: 'فئات وكائنات OOP',
      code: `class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.__score = score\n\n    def get_status(self):\n        return "Pass" if self.__score >= 50 else "Fail"\n\ns = Student("Hailah", 85)\nprint(s.get_status())`,
      options: ['Pass', 'Fail', 'AttributeError', 'None'],
      correctAnswer: 0,
      explanation: 'الكائن تم تهيئته بدرجة 85، وبما أنها أكبر من أو تساوي 50، يعيد التابع النص "Pass".'
    }
  ];

  // شجرة مفاهيم المقرر لتحديد موضع الطالب بدقة
  const courseConceptTree: ConceptNode[] = [
    {
      title: 'الأساسيات اللغوية والبيانات',
      description: 'فهم الذاكرة وطرق تخزين القيم والعمليات الحسابية والمنطقية.',
      requiredLevel: 'مبتدئ',
      subConcepts: ['Variables & Types', 'Type Casting', 'Operators']
    },
    {
      title: 'التحكم بالتدفق وسير البرنامج',
      description: 'اتخاذ القرارات التكرارية والشرطية داخل البرنامج.',
      requiredLevel: 'مبتدئ',
      subConcepts: ['If-Else Conditions', 'For / While Loops', 'Loop Control']
    },
    {
      title: 'الهياكل البيانية المدمجة',
      description: 'إدارة وتجميع البيانات بمرونة وكفاءة.',
      requiredLevel: 'متوسط',
      subConcepts: ['Lists & Tuples', 'Dictionaries & Sets', 'Comprehensions']
    },
    {
      title: 'الدوال وهيكلة الأكواد',
      description: 'بناء توابع برمجية قابلة لإعادة الاستخدام واستدعاء المكتبات.',
      requiredLevel: 'متقدم',
      subConcepts: ['Functions Def', 'Return Values', 'Modules & Imports']
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    let newScore = score;
    let newXp = xp;
    if (selectedOption === currentQuestion.correctAnswer) {
      newScore += 1;
      newXp += 30;
      setScore(newScore);
      setXp(newXp);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const determineLevel = (finalScore: number): 'مبتدئ' | 'متوسط' | 'متقدم' => {
    const percentage = (finalScore / questions.length) * 100;
    if (percentage >= 80) return 'متقدم';
    if (percentage >= 50) return 'متوسط';
    return 'مبتدئ';
  };

  // تحديد المفهوم الذي سيبدأ منه الطالب في شجرة المفاهيم
  const getStartingConceptIndex = (level: 'مبتدئ' | 'متوسط' | 'متقدم'): number => {
    if (level === 'متقدم') return 3; // الدوال وهيكلة الأكواد
    if (level === 'متوسط') return 2; // الهياكل البيانية
    return 0; // الأساسيات اللغوية
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 overflow-x-hidden relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية النقاط المضيئة */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />

      {/* هالات الإضاءة الذهبية */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* الهيدر الثابت الموحد (Fixed Navbar) عبر المنصة مع اللوجو المعتمد */}
      <header className="fixed top-0 inset-x-0 w-full flex items-center justify-between px-8 lg:px-14 py-4 border-b z-40 backdrop-blur-md transition-colors bg-white/95 dark:bg-[#111111]/85 border-[#2F2F2F]/20 dark:border-[#2F2F2F] shadow-sm">
        <div className="flex items-center gap-3">
          <PlatformLogo size={38} />
          <div className="text-right">
            <h2 className="text-sm font-bold leading-tight text-[#111111] dark:text-white">
              منصة إديوتك الذكية
            </h2>
            <p className="text-[11px] text-[#FFCB74] font-medium tracking-wide">EduTech</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFCB74]/15 border border-[#FFCB74]/40 text-[#111111] dark:text-[#FFCB74] text-xs font-bold">
          <span>اختبار تحديد المستوى</span>
          <span className="text-[10px] opacity-70">({courseTitle})</span>
        </div>
      </header>

      {/* محتوى الاختبار مع مسافة علوية pt-24 لتعويض الهيدر الثابت */}
      <div className="pt-24 flex-1 flex flex-col justify-between">
        
        {/* شريط الإلغاء ونقاط الـ XP المدمج أعلى السؤال */}
        {!showResult && (
          <div className="w-full max-w-4xl mx-auto px-6 z-10 flex items-center justify-between">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-red-500/50 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all cursor-pointer shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>إلغاء الاختبار والعودة للمقررات</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFCB74] text-[#111111] text-xs font-black shadow-[0_0_15px_rgba(255,203,116,0.3)]">
              <Zap className="w-4 h-4 fill-current" />
              <span>{xp} XP</span>
            </div>
          </div>
        )}

        {/* شريط التقدم */}
        {!showResult && (
          <div className="w-full max-w-4xl mx-auto px-6 mt-4 z-10">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
              <span className="text-[#FFCB74] font-bold">{Math.round(progressPercentage)}% مكتمل</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-[#2F2F2F] overflow-hidden border border-[#2F2F2F]/20 dark:border-transparent">
              <div 
                className="h-full bg-[#FFCB74] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,203,116,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* جسم الاختبار أو عرض النتيجة وإسقاط المستوى على شجرة المفاهيم */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-6 z-10 flex flex-col justify-center">
          
          {!showResult ? (
            <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all">
              
              {/* نوع السؤال والمفهوم المعرفي */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full bg-[#FFCB74] text-[#111111]">
                    {currentQuestion.type === 'theory' ? <BookOpen className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                    <span>{currentQuestion.type === 'theory' ? 'سؤال نظري ومفاهيمي' : 'سؤال برمجي وتتبع كود'}</span>
                  </span>
                  
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold">
                    • {currentQuestion.concept}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white leading-relaxed">
                  {currentQuestion.title}
                </h3>
              </div>

              {/* شاشة الكود (تظهر فقط إذا كان السؤال يحتوي على كود) */}
              {currentQuestion.code && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-[#2F2F2F] bg-[#111111] shadow-2xl" dir="ltr">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-[#2F2F2F]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Code2 className="w-3.5 h-3.5 text-[#FFCB74]" />
                      <span>snippet.py</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 font-mono text-sm leading-relaxed overflow-x-auto text-[#FFFFFF]">
                    <pre className="grid grid-cols-[auto_1fr] gap-x-4">
                      <span className="text-gray-500 select-none text-right">
                        {currentQuestion.code.split('\n').map((_, i) => (
                          <span key={i} className="block">{i + 1}</span>
                        ))}
                      </span>
                      <code>
                        {currentQuestion.code.split('\n').map((line, i) => (
                          <span key={i} className="block text-[#FFCB74] hover:text-white transition-colors">
                            {line}
                          </span>
                        ))}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {/* خيارات الإجابة من متعدد */}
              <div className="grid grid-cols-1 gap-3.5 mb-8">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const letters = ['أ', 'ب', 'ج', 'د'];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`py-4 px-5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer border text-right ${
                        isSelected
                          ? 'bg-[#FFCB74]/20 border-[#FFCB74] text-[#111111] dark:text-white shadow-[0_0_20px_rgba(255,203,116,0.3)] ring-1 ring-[#FFCB74]'
                          : 'bg-[#F6F6F6] dark:bg-[#111111]/40 border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74]/60 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <span className="leading-relaxed pl-4">{option}</span>
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected ? 'bg-[#FFCB74] text-[#111111]' : 'bg-gray-200 dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-300'
                      }`}>
                        {letters[idx]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* زر الانتقال للسؤال التالي */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className={`py-3.5 px-8 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-[#FFCB74] text-[#111111] shadow-[0_0_20px_rgba(255,203,116,0.4)] hover:scale-105 active:scale-95'
                      : 'bg-gray-200 dark:bg-[#111111]/50 text-gray-400 cursor-not-allowed border border-[#2F2F2F]/20 dark:border-[#2F2F2F]'
                  }`}
                >
                  <span>{currentQuestionIndex + 1 === questions.length ? 'إنهاء الاختبار وتقييم المستوى' : 'السؤال التالي'}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* شاشة النتيجة وتحديد موضع الطالب في شجرة المفاهيم */
            <div className="bg-white dark:bg-[#2F2F2F] border border-[#FFCB74]/50 rounded-3xl p-6 sm:p-9 backdrop-blur-md text-center shadow-2xl animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#FFCB74] flex items-center justify-center text-[#111111] mx-auto mb-4 shadow-[0_0_30px_rgba(255,203,116,0.6)]">
                <Trophy className="w-8 h-8" />
              </div>

              <h2 className="text-xl lg:text-2xl font-black text-[#111111] dark:text-white mb-1.5">
                اكتمل الاختبار التشخيصي وتم تحديد موضعك المعرفي!
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                حلل محرك التكيف نتائجك، وتم إسقاط مستواك الحالي مباشرة على شجرة مفاهيم المقرر لتحديد نقطة انطلاقك.
              </p>

              {/* بطاقة تقييم المستوى والـ XP */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                <div className="bg-[#F6F6F6] dark:bg-[#111111] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-2xl p-3">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-0.5">الدرجة التشخيصية</span>
                  <span className="text-lg font-extrabold text-[#111111] dark:text-white">{score} / {questions.length}</span>
                </div>
                <div className="bg-[#F6F6F6] dark:bg-[#111111] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-2xl p-3">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-0.5">نقاط الخبرة</span>
                  <span className="text-lg font-extrabold text-[#FFCB74]">+{xp} XP</span>
                </div>
                <div className="bg-[#FFCB74]/15 border border-[#FFCB74]/40 rounded-2xl p-3">
                  <span className="text-[11px] text-[#FFCB74] font-bold block mb-0.5">المستوى المحدد</span>
                  <span className="text-lg font-black text-[#111111] dark:text-white">{determineLevel(score)}</span>
                </div>
              </div>

              {/* شجرة المفاهيم التفاعلية بعد الاختبار مع تحديد موقع الطالب */}
              <div className="bg-[#F6F6F6] dark:bg-[#111111] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-3xl p-5 mb-8 text-right shadow-inner">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#FFCB74]" />
                    <span className="text-xs font-black text-[#111111] dark:text-white">
                      موقعك في شجرة مفاهيم المقرر (Learning Path Map)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#FFCB74] font-bold">
                    تم تخصيص المسار لمستواك: {determineLevel(score)}
                  </span>
                </div>

                {/* العقدة الجذرية */}
                <div className="flex flex-col items-center mb-4">
                  <div className="px-5 py-2 rounded-xl bg-[#FFCB74] text-[#111111] font-black text-xs shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{courseTitle}</span>
                  </div>
                  <div className="w-[2px] h-4 bg-[#FFCB74]" />
                </div>

                {/* عقد الشجرة مع التمييز البصري لموضع الطالب */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                  {courseConceptTree.map((node, index) => {
                    const studentLevel = determineLevel(score);
                    const startIndex = getStartingConceptIndex(studentLevel);

                    const isCurrent = index === startIndex;
                    const isMastered = index < startIndex;
                    const isLocked = index > startIndex;

                    return (
                      <div
                        key={index}
                        className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between relative ${
                          isCurrent
                            ? 'bg-[#FFCB74]/20 border-[#FFCB74] shadow-[0_0_20px_rgba(255,203,116,0.35)] ring-2 ring-[#FFCB74]'
                            : isMastered
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-white/50 dark:bg-[#2F2F2F]/40 border-[#2F2F2F]/20 opacity-60'
                        }`}
                      >
                        {/* بادج الحالة */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isCurrent
                              ? 'bg-[#FFCB74] text-[#111111]'
                              : isMastered
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-300 dark:bg-[#2F2F2F] text-gray-500'
                          }`}>
                            {isMastered ? '✓' : index + 1}
                          </span>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isCurrent
                              ? 'bg-[#FFCB74] text-[#111111] animate-pulse'
                              : isMastered
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-200 dark:bg-[#111111] text-gray-400'
                          }`}>
                            {isCurrent ? '📍 نقطة انطلاقك' : isMastered ? 'مُتقن ومُجتاز' : 'مفهوم قادم'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-[#111111] dark:text-white mb-1">
                            {node.title}
                          </h4>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight mb-2">
                            {node.description}
                          </p>
                        </div>

                        {/* المفاهيم الفرعية */}
                        <div className="pt-2 border-t border-[#2F2F2F]/10 dark:border-[#2F2F2F] space-y-1">
                          {node.subConcepts.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/10 flex items-center justify-between"
                            >
                              <span>{sub}</span>
                              {isMastered && <span className="text-emerald-500">✓</span>}
                              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB74] animate-ping" />}
                              {isLocked && <Lock className="w-2.5 h-2.5 opacity-40" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* زر الانتقال لموضع الطالب بالدرس */}
              <button
                onClick={() => onFinishTest(score, determineLevel(score))}
                className="py-3.5 px-10 rounded-full font-black text-[#111111] text-sm bg-[#FFCB74] shadow-[0_0_35px_rgba(255,203,116,0.5)] hover:shadow-[0_0_50px_rgba(255,203,116,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <span>الانتقال لدراسة المفهوم المحدد مباشرة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

        </main>

        <footer className="w-full py-4 text-center text-xs text-gray-500 border-t border-[#2F2F2F]/20 dark:border-[#2F2F2F]/50 z-10 bg-white/60 dark:bg-[#111111]/60 backdrop-blur-md">
          منصة إديوتك للتعلم التكيفي الذكي • جميع الحقوق محفوظة
        </footer>

      </div>

    </div>
  );
};

export default PlacementTest;