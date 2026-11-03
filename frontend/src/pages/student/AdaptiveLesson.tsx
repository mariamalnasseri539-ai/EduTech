import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Bot, 
  ArrowLeft, 
  Check, 
  X, 
  Send, 
  Zap, 
  RotateCcw, 
  BookOpen, 
  Terminal, 
  HelpCircle, 
  FileCheck2, 
  Trophy, 
  AlertCircle, 
  Cpu, 
  AlertTriangle, 
  Sun, 
  Moon, 
  Compass, 
  Code2, 
  Menu, 
  Home, 
  TrendingUp, 
  User, 
  Settings, 
  Target
} from 'lucide-react';

import { PlatformLogo } from '../../components/common/PlatformLogo';
import StudentCertificate from './StudentCertificate';
import { InteractiveCodeEngine } from './InteractiveCodeEngine';

type LessonTheme = 'dark' | 'light' | 'neutral';

interface SubTopicDetail {
  name: string;
  desc: string;
  type: string;
}

interface SlideContent {
  stepTitle: string;
  badgeText: string;
  description: string;
  visualType: 'capsule_core' | 'memory_viz' | 'code_walkthrough' | 'pitfalls';
  capsuleData?: {
    label: string;
    items: SubTopicDetail[];
  };
  memorySnapshot?: { name: string; type: string; address: string; value: string }[];
  interactiveCode?: { lineNum: number; code: string; explanation: string }[];
  pitfallTip?: { wrong: string; right: string; note: string };
}

interface MissionObjective {
  id: string;
  text: string;
}

interface PracticeSlide {
  stepTitle: string;
  badgeText: string;
  explanation: string;
  initialCode: string;
  expectedOutputHint: string;
  objectives: MissionObjective[];
}

interface CardData {
  id: number;
  title: string;
  conceptSummary: string;
  slides: SlideContent[];
  practiceSlides: PracticeSlide[];
  challenges: any[];
}

interface ComprehensiveQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AdaptiveLessonProps {
  courseTitle?: string;
  studentLevel?: 'مبتدئ' | 'متوسط' | 'متقدم';
  onBackToDashboard: () => void;
}

export const AdaptiveLesson: React.FC<AdaptiveLessonProps> = ({
  courseTitle = 'أساسيات البرمجة بلغة Python',
  studentLevel = 'مبتدئ',
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<'theory' | 'practice' | 'challenge' | 'comprehensive_quiz' | 'mastery_result'>('theory');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPracticeSlideIndex, setCurrentPracticeSlideIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  
  const [activeCodeLine, setActiveCodeLine] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);

  const [lessonTheme, setLessonTheme] = useState<LessonTheme>(() => {
    const saved = localStorage.getItem('edutech_lesson_theme') as LessonTheme;
    if (saved && ['dark', 'light', 'neutral'].includes(saved)) return saved;
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isCurrentChallengeCompleted, setIsCurrentChallengeCompleted] = useState(false);

  // حالات محرر الكود
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isErrorOutput, setIsErrorOutput] = useState(false);
  const [isPracticeVerified, setIsPracticeVerified] = useState(false);

  // حالات الاختبار الشامل
  const [compQuizIndex, setCompQuizIndex] = useState(0);
  const [compSelectedOption, setCompSelectedOption] = useState<number | null>(null);
  const [compScore, setCompScore] = useState(0);

  const [xp, setXp] = useState(90);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'أهلاً بكِ هيله! أنا معكِ لشرح كل سطر وتجربة الأكواد خطوة بخطوة.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSetTheme = (theme: LessonTheme) => {
    setLessonTheme(theme);
    localStorage.setItem('edutech_lesson_theme', theme);
    if (theme === 'dark' || theme === 'neutral') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'courses', label: 'المقررات الدراسية', icon: BookOpen },
    { id: 'achievements', label: 'إنجازاتي', icon: Trophy },
    { id: 'progress', label: 'تقدمي الدراسي', icon: TrendingUp },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  // بطاقات المفاهيم مدعومة بالأنماط التفاعلية المتنوعة مع الحفاظ التام على نمط سيسكو المعتمد
  const lessonCards: CardData[] = [
    {
      id: 1,
      title: 'مفهوم المتغيرات وعمليات التخزين في الذاكرة',
      conceptSummary: 'المتغير في لغة Python هو مساحة محجوزة في الذاكرة لتخزين قيمة معينة، ويعتمد نظام الكتابة الديناميكي.',
      slides: [
        {
          stepTitle: 'كبسولة تفكيك المتغيرات البرمجية (Tech Capsule Core)',
          badgeText: 'سلايد 1: الاستكشاف التفاعلي',
          description: 'انقري على كبسولة المعالج لتفكيك أجزاء بنية المتغير في الذاكرة ومطالعة تفاصيل كل مكون:',
          visualType: 'capsule_core',
          capsuleData: {
            label: 'بنية المتغير البرمجي في ذاكرة بايثون',
            items: [
              { name: 'Variable Name', desc: 'المسمى المرجعي في جدول العناوين', type: 'Pointer' },
              { name: 'Memory Address', desc: 'موقع التخزين الفيزيائي بالذاكرة RAM', type: 'Hex Ref' },
              { name: 'Object Value', desc: 'القيمة الفعلية المخزنة ككائن برمجي', type: 'Data Value' },
              { name: 'Type Tag', desc: 'تحديد نوع الكائن تلقائياً وقت التشغيل', type: 'Dynamic Type' }
            ]
          }
        },
        {
          stepTitle: 'محاكي تمثيل الذاكرة الفعلي (Memory Visualizer)',
          badgeText: 'سلايد 2: الهندسة الداخلية',
          description: 'عند تنفيذ الكود، يقوم مفسر بايثون بإنشاء الكائن أولاً في الذاكرة، ثم يربط اسم المتغير بعنوان الذاكرة (Address Pointer) بشكل فوري.',
          visualType: 'memory_viz',
          memorySnapshot: [
            { name: 'student_name', type: 'str', address: '0x7FFF9A10', value: '"Hailah"' },
            { name: 'score', type: 'int', address: '0x7FFF9A18', value: '95' },
            { name: 'is_active', type: 'bool', address: '0x7FFF9A20', value: 'True' }
          ]
        },
        {
          stepTitle: 'تتبع الكود التفاعلي السطري (Interactive Code Walkthrough)',
          badgeText: 'سلايد 3: قراءة الكود',
          description: 'انقري على أي سطر لمشاهدة ما يحدث داخلياً في مفسر بايثون لحظة قراءة هذا السطر بالتحديد:',
          visualType: 'code_walkthrough',
          interactiveCode: [
            { lineNum: 1, code: 'student_name = "Hailah"', explanation: 'حجز كائن نصي في الذاكرة وتوجيه المرجع student_name إليه تلقائياً كـ (Dynamic Typing).' },
            { lineNum: 2, code: 'score = 95', explanation: 'إنشاء كائن عددي صحيح int وتعيين العنوان في جدول المراجع.' },
            { lineNum: 3, code: 'print("الطالبة:", student_name)', explanation: 'استدعاء تابع الإخراج القياسي لجلب القيمة المشار إليها بالمرجع وطباعتها على الطرفية.' }
          ]
        },
        {
          stepTitle: 'المزالق الشائعة والأخطاء النحوية (Common Pitfalls)',
          badgeText: 'سلايد 4: التحصين البرمجي',
          description: 'أشهر الأخطاء التي يقع فيها المبرمجون في بايثون هي محاولة استدعاء متغير قبل إسناد قيمة له، أو استخدام كلمات محجوزة كأسماء.',
          visualType: 'pitfalls',
          pitfallTip: {
            wrong: 'print(user_age)\nuser_age = 20  # NameError: name "user_age" is not defined',
            right: 'user_age = 20\nprint(user_age)  # التنفيذ سليم من الأعلى للأسفل',
            note: 'بايثون لغة مفسرة تقرأ سطراً بسطر؛ لذا يجب تعريف المتغير دائماً قبل استدعائه.'
          }
        }
      ],
      practiceSlides: [
        {
          stepTitle: 'المهمة التطبيقية 1: إعداد محرك الإطلاق وتجهيز المتغيرات',
          badgeText: 'تطبيق عملي 1 من 3',
          explanation: 'في هذه الخطوة، نقوم بإنشاء متغير نصي ومتغير عددي ومتغير منطقي لتشغيل المحاكي:',
          initialCode: `# تعريف المتغيرات وتجهيز المؤشرات
fuel_level = 100
student_name = "Hailah"
is_system_ready = True

print("النظام:", student_name)
print("مستوى الطاقة:", fuel_level)
print("جاهزية الإطلاق:", is_system_ready)`,
          expectedOutputHint: 'النظام: Hailah\nمستوى الطاقة: 100\nجاهزية الإطلاق: True',
          objectives: [
            { id: 'obj1', text: 'تعيين مستوى الطاقة fuel_level بقيمة 100' },
            { id: 'obj2', text: 'إسناد اسم الطالبة كمتغير نصي' },
            { id: 'obj3', text: 'تفعيل حالة الجاهزية is_system_ready' }
          ]
        },
        {
          stepTitle: 'المهمة التطبيقية 2: التحويل بين الأنواع (Type Casting)',
          badgeText: 'تطبيق عملي 2 من 3',
          explanation: 'عند استقبال مدخلات نصية وتحويلها إلى أرقام صحيحة، نستخدم دالة int() لتجنب أخطاء دمج النصوص:',
          initialCode: `# تحويل النص إلى رقم لإجراء عملية حسابية
raw_score = "85"
bonus = 10

final_score = int(raw_score) + bonus
print("الدرجة النهائية بعد التحويل:", final_score)`,
          expectedOutputHint: 'الدرجة النهائية بعد التحويل: 95',
          objectives: [
            { id: 'obj4', text: 'تعريف مدخل نصي خام raw_score' },
            { id: 'obj5', text: 'استخدام int() للتحويل الحسابي' }
          ]
        },
        {
          stepTitle: 'المهمة التطبيقية 3: التحديث الديناميكي وإعادة الإسناد',
          badgeText: 'تطبيق عملي 3 من 3',
          explanation: 'نقوم بتحديث نفس المتغير بقيمة جديدة تماماً لنرى كيف يعيد مفسر بايثون توجيه العنوان في الذاكرة:',
          initialCode: `# إعادة إسناد المتغير بقيم وأنواع جديدة
status = "مبتدئ"
print("المستوى الأولي:", status)

status = "متقدم - إتقان كامل"
print("المستوى بعد التحديث:", status)`,
          expectedOutputHint: 'المستوى الأولي: مبتدئ\nالمستوى بعد التحديث: متقدم - إتقان كامل',
          objectives: [
            { id: 'obj6', text: 'تعريف المتغير بالقيمة الابتدائية' },
            { id: 'obj7', text: 'إعادة توجيه المتغير إلى قيمة جديدة' }
          ]
        }
      ],
      // أسئلة البطاقة 1: سؤال نصي، ثم كبسولة ناعمة، ثم نمط سيسكو بالطرفية
      challenges: [
        {
          id: 'c1_q1',
          type: 'theory_mcq', // سؤال مفاهيمي نصي بحت
          questionText: 'ما الذي يميز نظام الكتابة في لغة Python بخصوص المتغيرات وفق ما تعلمتِ في السلايدات؟',
          options: [
            'يجب كتابة نوع المتغير صراحة (int, str) قبل اسمه.',
            'تعتمد الكتابة الديناميكية (Dynamic Typing) حيث يُحدد النوع تلقائياً بناءً على القيمة المسندة.',
            'لا تقبل بايثون إلا المتغيرات النصية فقط.',
            'يجب حجز المتغير في جدول ثابت قبل تشغيل الكود.'
          ],
          correctAnswerIndex: 1,
          explanation: 'بايثون تحدد نوع المتغير تلقائياً وقت التشغيل (Dynamic Typing) دون الحاجة لتعريف النوع صراحة.'
        },
        {
          id: 'c1_q2',
          type: 'tap_chips', // كبسولات ناعمة تقفز إلى الفراغ
          questionText: 'انقري الكبسولة البرمجية المناسبة لتحويل المدخل النصي إلى رقم صحيح:',
          fileName: 'type_casting.py',
          codeTemplateParts: [
            'raw_points = "80"\ntotal = ',
            '(raw_points) + 15\nprint("المجموع:", total)'
          ],
          slotChips: ['int', 'str', 'len', 'float'],
          slotAnswer: 'int',
          explanation: 'الدالة int() تقوم بتحويل النصوص الرقمية إلى أعداد صحيحة لإتمام الجمع الحسابي.'
        },
        {
          id: 'c1_q3',
          type: 'code_slot', // نمط سيسكو المعتمد (أهداف + طرفية + زر Run)
          questionText: 'أكملي الكود باختيار الدالة المناسبة لطباعة المتغير على الطرفية:',
          fileName: 'user_profile.py',
          goals: [{ id: 'g1', text: 'تحديد دالة الإخراج والطباعة القياسية', expectedValue: 'print' }],
          slotChips: ['print', 'input', 'def', 'len'],
          slotAnswer: 'print',
          codeTemplateParts: [
            '# إعداد المتغير وعرض النتيجة\nuser_name = "Hailah"\n',
            '("مرحباً بكِ:", user_name)'
          ],
          expectedOutput: 'مرحباً بكِ: Hailah\n>>> Process finished with exit code 0',
          explanation: 'الدالة print() هي الأمر القياسي لإخراج النصوص والقيم في بايثون.'
        }
      ]
    },
    {
      id: 2,
      title: 'العمليات الحسابية والمنطقية وتحديث المتغيرات',
      conceptSummary: 'تتيح بايثون استخدام المتغيرات داخل المعادلات الحسابية والمنطقية وتحديث قيمتها مع الحفاظ على أولويات العمليات.',
      slides: [
        {
          stepTitle: 'مفهوم تحديث القيمة في الذاكرة (Value Mutability)',
          badgeText: 'سلايد 1: استيعاب التحديث',
          description: 'عند إعادة إسناد قيمة جديدة للمتغير، لا يتم تعديل القيمة القديمة بنفس المكان، بل ينشأ كائن جديد ويُحوّل المؤشر إليه.',
          visualType: 'memory_viz',
          memorySnapshot: [
            { name: 'price', type: 'int', address: '0x8A10', value: '25' },
            { name: 'quantity', type: 'int', address: '0x8A18', value: '4' },
            { name: 'total', type: 'int', address: '0x8A20', value: '100 (25 × 4)' }
          ]
        },
        {
          stepTitle: 'شرح أسبقية العمليات (Operator Precedence)',
          badgeText: 'سلايد 2: تتبع السطور',
          description: 'انقري على السطر لفهم كيفية تنفيذ الضرب والقسمة قبل الجمع والطرح:',
          visualType: 'code_walkthrough',
          interactiveCode: [
            { lineNum: 1, code: 'price = 25', explanation: 'تحديد قيمة السعر الابتدائي كعدد صحيح.' },
            { lineNum: 2, code: 'quantity = 4', explanation: 'تحديد كمية العناصر المطلوبة.' },
            { lineNum: 3, code: 'total = price * quantity', explanation: 'الضرب له أسبقية حسابية ويتم تخزين الناتج 100 في المتغير total.' }
          ]
        },
        {
          stepTitle: 'مزالق العمليات الحسابية الشائعة',
          badgeText: 'سلايد 3: فخاخ برمجية',
          description: 'الخلط بين القسمة العادية والقسمة الصحيحة وباقي القسمة:',
          visualType: 'pitfalls',
          pitfallTip: {
            wrong: 'result = 10 / 3  # النتيجة 3.3333333333333335 (نوع تعويم float)',
            right: 'int_res = 10 // 3  # النتيجة 3 قسمة صحيحة\nmod_res = 10 % 3   # النتيجة 1 باقي قسمة',
            note: 'استخدمي // عندما تحتاجين لأعداد صحيحة و % لمعرفة الباقي وتحديد الأعداد الزوجية/الفردية.'
          }
        }
      ],
      practiceSlides: [
        {
          stepTitle: 'المهمة التطبيقية 1: العمليات الحسابية الأساسية والأولويات',
          badgeText: 'تطبيق عملي 1 من 3',
          explanation: 'تجربة الأقواس لتغيير أولوية التنفيذ بين الجمع والضرب:',
          initialCode: `# اختبار أسبقية العمليات
calc1 = 10 + 2 * 5
calc2 = (10 + 2) * 5

print("بدون أقواس (الضرب أولاً):", calc1)
print("مع أقواس (الجمع أولاً):", calc2)`,
          expectedOutputHint: 'بدون أقواس (الضرب أولاً): 20\nمع أقواس (الجمع أولاً): 60',
          objectives: [
            { id: 'op1', text: 'تطبيق أولوية الضرب الافتراضية' },
            { id: 'op2', text: 'إعادة ضبط الترتيب باستخدام الأقواس' }
          ]
        },
        {
          stepTitle: 'المهمة التطبيقية 2: القسمة الصحيحة وباقي القسمة',
          badgeText: 'تطبيق عملي 2 من 3',
          explanation: 'استخدام // و % في حساب توزيع المهام والأرقام الزوجية والفردية:',
          initialCode: `# استخراج القسمة الصحيحة والباقي
candies = 23
students = 5

per_student = candies // students
remaining = candies % students

print("نصيب كل طالب:", per_student)
print("الحلوى المتبقية:", remaining)`,
          expectedOutputHint: 'نصيب كل طالب: 4\nالحلوى المتبقية: 3',
          objectives: [
            { id: 'op3', text: 'استخراج القسمة الصحيحة عبر //' },
            { id: 'op4', text: 'حساب باقي القسمة عبر المشغل %' }
          ]
        },
        {
          stepTitle: 'المهمة التطبيقية 3: العمليات المركبة (Compound Assignment)',
          badgeText: 'تطبيق عملي 3 من 3',
          explanation: 'تحديث المتغير بنفسه باستخدام المشغلات المختصرة مثل += و *=:',
          initialCode: `# تحديث النقاط برمجياً
streak = 5
xp_total = 100

streak += 1
xp_total *= 2

print("أيام التتابع:", streak)
print("الـ XP بعد المضاعفة:", xp_total)`,
          expectedOutputHint: 'أيام التتابع: 6\nالـ XP بعد المضاعفة: 200',
          objectives: [
            { id: 'op5', text: 'استخدام المشغل المركب +=' },
            { id: 'op6', text: 'استخدام المشغل المركب *=' }
          ]
        }
      ],
      // أسئلة البطاقة 2: تتبع كود، ثم سؤال نصي مفاهيمي، ثم نمط سيسكو المعتمد (الأس الرياضي كما في صورتك)
      challenges: [
        {
          id: 'c2_q1',
          type: 'code_tracing', // تتبع أسطر
          questionText: 'ما هي النتيجة النهائية للعملية الحسابية التالية وفق أسبقية بايثون؟',
          codeSnippet: `x = 20\ny = 6\nprint(x // y + x % y)`,
          options: ['3', '5', '4', '2'],
          correctAnswerIndex: 1,
          explanation: 'القسمة الصحيحة 20 // 6 تعطي 3، وباقي القسمة 20 % 6 يعطي 2، والمجموع 3 + 2 = 5.'
        },
        {
          id: 'c2_q2',
          type: 'theory_mcq', // سؤال نظري مفاهيمي بدون أكواد
          questionText: 'ما المشغل الرياضي الذي يعيد باقي القسمة بين رقمين في لغة Python؟',
          options: ['//', '%', '**', '/'],
          correctAnswerIndex: 1,
          explanation: 'المشغل % (Modulo) هو المسؤول عن إرجاع باقي القسمة.'
        },
        {
          id: 'c2_q3',
          type: 'code_slot', // نمط سيسكو المعتمد (الذي في صورتك تماماً)
          questionText: 'استخدام مشغل القوى لحساب 2 أس 3:',
          fileName: 'math_power.py',
          goals: [{ id: 'g1', text: 'استخدام مشغل القوى لحساب 2 أس 3', expectedValue: '**' }],
          slotChips: ['**', '//', '%', '^'],
          slotAnswer: '**',
          codeTemplateParts: [
            'base = 2\npower = 3\nresult = base ',
            ' power\nprint("النتيجة:", result)'
          ],
          expectedOutput: 'النتيجة : 8\n>>> Process finished with exit code 0',
          explanation: 'المشغل ** في بايثون هو المسؤول عن حساب الأس الرياضي.'
        }
      ]
    }
  ];

  const comprehensiveQuestions: ComprehensiveQuestion[] = [
    {
      id: 1,
      questionText: 'ما هي نتيجة تنفيذ: print(10 // 3 + 10 % 3) في لغة بايثون؟',
      options: ['4', '3', '4.33', '1'],
      correctAnswer: 0,
      explanation: 'القسمة الصحيحة تعطي 3 وباقي القسمة 1، المجموع = 4.'
    },
    {
      id: 2,
      questionText: 'أي من الأسماء التالية يُعتبر اسماً صحيحاً لمتغير وفق معايير Python (snake_case)؟',
      options: ['2nd_score', 'student_total_score', 'student-score', 'class'],
      correctAnswer: 1,
      explanation: 'الاسم student_total_score يتبع قواعد التسمية ولا يبدأ برقم ولا يحتوي على علامات محجوزة.'
    },
    {
      id: 3,
      questionText: 'ماذا يحدث لقيمة المتغير القديمة في الذاكرة عند إسناد قيمة جديدة لنفس الاسم؟',
      options: [
        'تُدمج القيمة الجديدة مع القديمة تلقائياً.',
        'يحدث خطأ تكرار (NameError).',
        'يتم استبدال المرجع بالقيمة الجديدة وتفريغ القديمة عبر Garbage Collector.',
        'تظل القيمة القديمة ولا تُحذف أبداً.'
      ],
      correctAnswer: 2,
      explanation: 'الاسم يرتبط بالقيمة الجديدة، والقديمة تُفرغ من الذاكرة إذا لم تعد مستخدمة.'
    }
  ];

  useEffect(() => {
    if (studentLevel === 'متوسط') {
      setCurrentCardIndex(1);
    } else if (studentLevel === 'متقدم') {
      setCurrentCardIndex(lessonCards.length - 1);
    } else {
      setCurrentCardIndex(0);
    }
  }, [studentLevel]);

  const currentCard = lessonCards[currentCardIndex] || lessonCards[0];
  const activeSlide = currentCard.slides[currentSlideIndex] || currentCard.slides[0];
  const activePracticeSlide = currentCard.practiceSlides[currentPracticeSlideIndex] || currentCard.practiceSlides[0];
  const activeChallenge = currentCard.challenges[currentChallengeIndex] || currentCard.challenges[0];

  useEffect(() => {
    if (activePracticeSlide) {
      setUserCode(activePracticeSlide.initialCode);
      setConsoleOutput(null);
      setIsErrorOutput(false);
      setIsPracticeVerified(false);
    }
  }, [currentCardIndex, currentPracticeSlideIndex]);

  useEffect(() => {
    setIsCurrentChallengeCompleted(false);
  }, [currentChallengeIndex, currentCardIndex]);

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
  }, [lessonTheme]);

  const handleRunCode = () => {
    setConsoleOutput('جارِ فحص وتشغيل الكود في مفسر بايثون...');
    setIsErrorOutput(false);

    setTimeout(() => {
      const openParens = (userCode.match(/\(/g) || []).length;
      const closeParens = (userCode.match(/\)/g) || []).length;

      if (openParens !== closeParens) {
        setIsErrorOutput(true);
        setIsPracticeVerified(false);
        setConsoleOutput(`SyntaxError: unexpected EOF while parsing\n\n[✗ تنبيه المصحح التكيفي]: توازن الأقواس غير صحيح! تأكدي من إغلاق كل قوس مفتوح.`);
        return;
      }

      setIsErrorOutput(false);
      setIsPracticeVerified(true);
      setConsoleOutput(`المخرجات الناجحة:\n${activePracticeSlide.expectedOutputHint}\n\n[✓ مصحح إديوتك الذكي]: تم التنفيذ بنجاح وتطابق الكود مع معايير الخطوة (+20 XP).`);
      setXp((prev) => prev + 20);
    }, 600);
  };

  // معالجة الانتقال بسهم موحد لليسار
  const handleNextChallenge = () => {
    if (currentChallengeIndex + 1 < currentCard.challenges.length) {
      setCurrentChallengeIndex(prev => prev + 1);
      setIsCurrentChallengeCompleted(false);
    } else {
      if (currentCardIndex + 1 < lessonCards.length) {
        setCurrentCardIndex(prev => prev + 1);
        setCurrentSlideIndex(0);
        setCurrentPracticeSlideIndex(0);
        setCurrentChallengeIndex(0);
        setIsCurrentChallengeCompleted(false);
        setCurrentStep('theory');
      } else {
        setCurrentStep('comprehensive_quiz');
      }
    }
  };

  const handleNextCompQuestion = () => {
    if (compSelectedOption === null) return;

    let newScore = compScore;
    if (compSelectedOption === comprehensiveQuestions[compQuizIndex].correctAnswer) {
      newScore += 1;
      setCompScore(newScore);
      setXp((prev) => prev + 30);
    }

    if (compQuizIndex + 1 < comprehensiveQuestions.length) {
      setCompQuizIndex(compQuizIndex + 1);
      setCompSelectedOption(null);
    } else {
      setCurrentStep('mastery_result');
    }
  };

  const masteryPercentage = Math.round((compScore / comprehensiveQuestions.length) * 100);
  const isMastered = masteryPercentage >= 80;

  const themeContainerClass = 
    lessonTheme === 'dark' 
      ? 'bg-[#111111] text-[#FFFFFF]' 
      : lessonTheme === 'neutral'
      ? 'bg-[#181C24] text-[#E8EDF5]'
      : 'bg-[#F6F6F6] text-[#111111]';

  const cardSurfaceClass = 
    lessonTheme === 'dark' 
      ? 'bg-[#2F2F2F] border-[#2F2F2F]/70 shadow-2xl' 
      : lessonTheme === 'neutral'
      ? 'bg-[#232936] border-[#313A4D] shadow-xl'
      : 'bg-white border-gray-200 shadow-md';

  const subBoxClass = 
    lessonTheme === 'dark' 
      ? 'bg-[#111111] border-[#2F2F2F]' 
      : lessonTheme === 'neutral'
      ? 'bg-[#161B24] border-[#2E3747]'
      : 'bg-[#F6F6F6] border-gray-200';

  return (
    <div className={`w-full min-h-screen ${themeContainerClass} flex flex-col font-sans selection:bg-[#FFCB74]/30 overflow-x-hidden relative transition-colors duration-300`} dir="rtl">
      
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* القائمة الجانبية */}
      <aside 
        className={`fixed top-0 right-0 h-full w-72 border-l z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between py-6 px-5 shadow-2xl ${
          lessonTheme === 'dark'
            ? 'bg-[#111111] border-[#2F2F2F] text-white'
            : lessonTheme === 'neutral'
            ? 'bg-[#181C24] border-[#313A4D] text-white'
            : 'bg-white border-gray-200 text-gray-800'
        } ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <PlatformLogo size={42} />
              <div>
                <span className="text-base font-black text-[#FFCB74] tracking-wider block leading-tight">إديوتك</span>
                <span className="text-[10px] opacity-70">EDUTECH</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'courses';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    onBackToDashboard();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFCB74] text-[#111111] font-black shadow-xs'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-[11px] text-center border-t border-white/10 pt-4 opacity-50">
          منصة إديوتك للتعلم التكيفي الذكي
        </div>
      </aside>

      {/* الشريط العلوي مع محدد الثيمات فقط */}
      <header className={`fixed top-0 inset-x-0 w-full flex items-center justify-between px-6 lg:px-12 py-3.5 border-b z-40 backdrop-blur-md transition-colors ${
        lessonTheme === 'dark'
          ? 'bg-[#111111]/90 border-[#2F2F2F]'
          : lessonTheme === 'neutral'
          ? 'bg-[#181C24]/90 border-[#313A4D]'
          : 'bg-white/95 border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 rounded-xl border border-white/15 hover:border-[#FFCB74] flex items-center justify-center transition-all cursor-pointer text-[#FFCB74]"
            title="فتح القائمة الرئيسية"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div onClick={onBackToDashboard} className="flex items-center gap-3 cursor-pointer">
            <PlatformLogo size={38} />
            <div className="text-right">
              <h2 className="text-sm font-bold leading-tight">منصة إديوتك الذكية</h2>
              <p className="text-[11px] text-[#FFCB74] font-medium tracking-wide">EduTech</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center p-1 rounded-xl border ${subBoxClass}`}>
            <button
              onClick={() => handleSetTheme('light')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                lessonTheme === 'light' ? 'bg-[#FFCB74] text-[#111111] shadow-xs' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="الوضع الفاتح"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">فاتح</span>
            </button>

            <button
              onClick={() => handleSetTheme('neutral')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                lessonTheme === 'neutral' ? 'bg-[#FFCB74] text-[#111111] shadow-xs' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="الوضع المحايد الوسط"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">وسط</span>
            </button>

            <button
              onClick={() => handleSetTheme('dark')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                lessonTheme === 'dark' ? 'bg-[#FFCB74] text-[#111111] shadow-xs' : 'text-gray-400 hover:text-gray-200'
              }`}
              title="الوضع الداكن الملكي"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">داكن</span>
            </button>
          </div>
        </div>
      </header>

      {/* منطقة المحتوى */}
      <div className="pt-20 w-full z-10 flex flex-col">
        
        <div className="w-full max-w-5xl mx-auto px-6 pt-3 flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-lg sm:text-xl font-black leading-tight">{courseTitle}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#FFCB74] font-bold">المستوى التكيفي: {studentLevel}</span>
              <span className="opacity-40">•</span>
              <span className="text-xs opacity-75">
                {currentStep === 'comprehensive_quiz' ? 'الاختبار الشامل النهائي' : `البطاقة ${currentCardIndex + 1} من ${lessonCards.length}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFCB74] text-[#111111] text-xs font-black shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>{xp} XP</span>
            </div>

            <button
              onClick={() => setIsAiTutorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFCB74] text-[#111111] font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>المعلم الذكي</span>
            </button>
          </div>
        </div>

        {/* مراحل الدرس */}
        {(currentStep === 'theory' || currentStep === 'practice' || currentStep === 'challenge') && (
          <div className="w-full max-w-3xl mx-auto px-6 mt-4">
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setCurrentStep('theory')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStep === 'theory'
                    ? 'bg-[#FFCB74] text-[#111111] border-[#FFCB74] font-black shadow-xs'
                    : `${cardSurfaceClass} opacity-80 hover:opacity-100`
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. سلايدات المفهوم</span>
              </button>

              <button
                onClick={() => setCurrentStep('practice')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStep === 'practice'
                    ? 'bg-[#FFCB74] text-[#111111] border-[#FFCB74] font-black shadow-xs'
                    : `${cardSurfaceClass} opacity-80 hover:opacity-100`
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>2. التطبيق العملي</span>
              </button>

              <button
                onClick={() => setCurrentStep('challenge')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  currentStep === 'challenge'
                    ? 'bg-[#FFCB74] text-[#111111] border-[#FFCB74] font-black shadow-xs'
                    : `${cardSurfaceClass} opacity-80 hover:opacity-100`
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>3. التحدي والتحقق</span>
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6 flex flex-col justify-center">
          
          {/* ================= 1. المفهوم النظري ================= */}
          {currentStep === 'theory' && (
            <div className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all ${cardSurfaceClass}`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#FFCB74]/20 border border-[#FFCB74]/40 text-[#FFCB74]">
                    {activeSlide.badgeText}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-2">{activeSlide.stepTitle}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentCard.slides.map((_, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => setCurrentSlideIndex(sIdx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        currentSlideIndex === sIdx
                          ? 'w-8 bg-[#FFCB74]'
                          : 'w-2.5 bg-gray-400/40 hover:bg-gray-400'
                      }`}
                      title={`الانتقال للسلايد ${sIdx + 1}`}
                    />
                  ))}
                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const u = new SpeechSynthesisUtterance(activeSlide.description);
                        u.lang = 'ar-SA';
                        window.speechSynthesis.speak(u);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-white/10 hover:border-[#FFCB74] text-[#FFCB74] mr-2"
                    title="استمع لشرح السلايد"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6 opacity-90">{activeSlide.description}</p>

              {/* المحتوى البصري */}
              <div className="mb-6">
                {activeSlide.visualType === 'capsule_core' && activeSlide.capsuleData && (
                  <div className={`p-6 rounded-3xl border ${subBoxClass} flex flex-col items-center justify-center text-center relative overflow-hidden transition-all`}>
                    {!isCapsuleOpen ? (
                      <div 
                        onClick={() => setIsCapsuleOpen(true)}
                        className="group cursor-pointer flex flex-col items-center p-6 rounded-2xl border-2 border-dashed border-[#FFCB74]/60 hover:border-[#FFCB74] hover:bg-[#FFCB74]/5 transition-all w-full max-w-sm"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74] mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg">
                          <Cpu className="w-10 h-10 animate-pulse" />
                        </div>
                        <h4 className="text-sm font-black text-[#FFCB74] mb-1">
                          {activeSlide.capsuleData.label}
                        </h4>
                        <span className="text-xs opacity-75 flex items-center gap-1.5">
                          <span>انقري هنا لفتح الكبسولة وتفكيك عناصرها برمجياً</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-full animate-fadeIn">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                          <span className="text-xs font-black text-[#FFCB74] flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            <span>محتويات كبسولة المتغير البرمجي</span>
                          </span>
                          <button
                            onClick={() => setIsCapsuleOpen(false)}
                            className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                          >
                            إغلاق الكبسولة
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {activeSlide.capsuleData.items.map((item, itmIdx) => (
                            <div 
                              key={itmIdx}
                              className="p-3.5 rounded-2xl border border-[#FFCB74]/30 bg-white/5 dark:bg-black/30 flex flex-col justify-between text-right shadow-xs hover:border-[#FFCB74] transition-all"
                            >
                              <div>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#FFCB74] font-bold mb-2 inline-block">
                                  {item.type}
                                </span>
                                <h5 className="text-xs font-black text-[#111111] dark:text-white mb-1">
                                  {item.name}
                                </h5>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSlide.visualType === 'memory_viz' && activeSlide.memorySnapshot && (
                  <div className={`p-4 sm:p-5 rounded-2xl border ${subBoxClass}`}>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <span className="text-xs font-black text-[#FFCB74] flex items-center gap-1.5">
                        <Cpu className="w-4 h-4" />
                        <span>محاكاة توزيع الذاكرة العشوائية (RAM Heap & Stack)</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-60">Architecture: x86_64</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeSlide.memorySnapshot.map((mem, mIdx) => (
                        <div key={mIdx} className="p-3 rounded-xl border border-white/10 bg-black/20 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-[#FFCB74] font-black">{mem.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 font-mono">{mem.type}</span>
                          </div>
                          <div className="font-mono text-xs text-emerald-400 font-bold">{mem.value}</div>
                          <div className="text-[9px] font-mono opacity-50 border-t border-white/5 pt-1 mt-1">
                            Ref: {mem.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'code_walkthrough' && activeSlide.interactiveCode && (
                  <div className={`rounded-2xl border ${subBoxClass} overflow-hidden`}>
                    <div className="px-4 py-2 bg-black/30 border-b border-white/10 flex items-center justify-between text-xs">
                      <span className="font-mono text-[#FFCB74] flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>walkthrough.py</span>
                      </span>
                      <span className="text-[10px] opacity-70">انقري على أي سطر لتشريحه</span>
                    </div>

                    <div className="p-4 font-mono text-xs space-y-1.5" dir="ltr">
                      {activeSlide.interactiveCode.map((line) => (
                        <div
                          key={line.lineNum}
                          onClick={() => setActiveCodeLine(line.lineNum)}
                          className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${
                            activeCodeLine === line.lineNum
                              ? 'bg-[#FFCB74]/20 border border-[#FFCB74] text-white shadow-xs'
                              : 'hover:bg-white/5 opacity-80'
                          }`}
                        >
                          <span className="text-gray-500 select-none w-4 text-right">{line.lineNum}</span>
                          <span className="font-bold text-[#FFCB74]">{line.code}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-black/40 border-t border-white/10 text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFCB74] animate-ping" />
                      <span className="opacity-90 font-medium">
                        {activeSlide.interactiveCode.find(l => l.lineNum === activeCodeLine)?.explanation}
                      </span>
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'pitfalls' && activeSlide.pitfallTip && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10">
                      <div className="flex items-center gap-1.5 text-xs font-black text-red-400 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>طريقة خاطئة شائعة (Wrong)</span>
                      </div>
                      <pre className="font-mono text-xs whitespace-pre-wrap text-red-200" dir="ltr">
                        {activeSlide.pitfallTip.wrong}
                      </pre>
                    </div>

                    <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>التطبيق النموذجي الصحيح (Right)</span>
                      </div>
                      <pre className="font-mono text-xs whitespace-pre-wrap text-emerald-200" dir="ltr">
                        {activeSlide.pitfallTip.right}
                      </pre>
                    </div>

                    <div className={`sm:col-span-2 p-3 rounded-xl border ${subBoxClass} text-xs opacity-90`}>
                      💡 <strong>نصيحة المعلم:</strong> {activeSlide.pitfallTip.note}
                    </div>
                  </div>
                )}
              </div>

              {/* أزرار التنقل بسهم موحد لليسار */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                  className="py-2 px-4 rounded-xl text-xs font-bold border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FFCB74] transition-all"
                >
                  السلايد السابق
                </button>

                {currentSlideIndex + 1 < currentCard.slides.length ? (
                  <button
                    onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                    className="py-2 px-6 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>السلايد التالي</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPracticeSlideIndex(0);
                      setCurrentStep('practice');
                    }}
                    className="py-2.5 px-6 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>الانتقال للتطبيق العملي</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ================= 2. التطبيق العملي ================= */}
          {currentStep === 'practice' && (
            <div className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all ${cardSurfaceClass}`}>
              
              <div className="mb-6 p-4 rounded-2xl border border-[#FFCB74]/40 bg-[#FFCB74]/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FFCB74]" />
                    <span className="text-xs font-black text-[#111111] dark:text-[#FFCB74]">
                      أهداف المهمة الحالية (Mission Goals):
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFCB74] text-[#111111]">
                    {activePracticeSlide.badgeText}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {activePracticeSlide.objectives.map((obj) => (
                    <div 
                      key={obj.id} 
                      className={`flex items-center gap-2 text-xs font-bold p-2 rounded-xl transition-all ${
                        isPracticeVerified 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-white/40 dark:bg-black/30 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isPracticeVerified ? 'text-emerald-500' : 'text-[#FFCB74]'}`} />
                      <span className="text-[11px] leading-tight">{obj.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base sm:text-lg font-black">{activePracticeSlide.stepTitle}</h3>
                  <p className="text-xs opacity-80 mt-1">{activePracticeSlide.explanation}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentCard.practiceSlides.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setCurrentPracticeSlideIndex(pIdx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        currentPracticeSlideIndex === pIdx
                          ? 'w-8 bg-[#FFCB74]'
                          : 'w-2.5 bg-gray-400/40 hover:bg-gray-400'
                      }`}
                      title={`خطوة عملية ${pIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* محرر الكود الموسع */}
              <div className="w-full border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-xl">
                <div>
                  <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="text-xs font-mono ml-2 font-bold opacity-70">practice_terminal.py</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUserCode(activePracticeSlide.initialCode);
                          setIsPracticeVerified(false);
                          setConsoleOutput(null);
                        }}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-[#FFCB74] transition-all text-gray-400 hover:text-white"
                        title="إعادة تعيين الكود"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleRunCode}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>تشغيل الكود الآن</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-black/50 font-mono text-xs leading-relaxed" dir="ltr">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={8}
                      className="w-full bg-transparent text-[#FFCB74] outline-none resize-none font-mono text-xs leading-relaxed"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 p-3.5 bg-black/30">
                  <span className="font-mono text-[11px] text-[#FFCB74] block mb-1 font-bold">
                    مخرجات الطرفية ومصحح إديوتك الذكي:
                  </span>
                  <div className="bg-black/60 border border-white/10 rounded-xl p-3 min-h-[60px] font-mono text-xs leading-relaxed">
                    {consoleOutput ? (
                      <pre className={`whitespace-pre-wrap font-mono ${isErrorOutput ? 'text-red-400' : 'text-emerald-400'}`}>
                        {consoleOutput}
                      </pre>
                    ) : (
                      <span className="opacity-40 text-[11px]">اضغطي على "تشغيل الكود الآن" لتنفيذ البرنامج والتحقق من صحة النتائج...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* أزرار التنقل بسهم موحد لليسار */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (currentPracticeSlideIndex > 0) {
                      setCurrentPracticeSlideIndex(prev => prev - 1);
                    } else {
                      setCurrentStep('theory');
                    }
                  }}
                  className="py-2 px-4 rounded-xl text-xs font-bold border border-white/10 hover:border-[#FFCB74] transition-all"
                >
                  {currentPracticeSlideIndex === 0 ? 'العودة لسلايدات المفهوم' : 'المهمة السابقة'}
                </button>

                {currentPracticeSlideIndex + 1 < currentCard.practiceSlides.length ? (
                  <button
                    onClick={() => setCurrentPracticeSlideIndex(prev => prev + 1)}
                    className="py-2 px-6 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>المهمة التطبيقية التالية</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentChallengeIndex(0);
                      setCurrentStep('challenge');
                    }}
                    className="py-2.5 px-6 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>الانتقال للتحديات التفاعلية (3 أسئلة)</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ================= 3. التحدي والتحقق المعتمد بأنماطه المتنوعة ================= */}
          {currentStep === 'challenge' && (
            <div className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all ${cardSurfaceClass}`}>
              
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#FFCB74]/20 border border-[#FFCB74]/40 text-[#FFCB74]">
                    سؤال التحدي {currentChallengeIndex + 1} من {currentCard.challenges.length}
                  </span>
                  <span className="text-xs font-bold mr-2 opacity-75">
                    • بطاقة: {currentCard.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentCard.challenges.map((_, qIdx) => (
                    <span
                      key={qIdx}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentChallengeIndex === qIdx
                          ? 'w-7 bg-[#FFCB74]'
                          : currentChallengeIndex > qIdx
                          ? 'bg-emerald-500'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* استدعاء محرك الأكواد التفاعلي الشامل */}
              <div className="mb-6">
                <InteractiveCodeEngine
                  challenge={activeChallenge}
                  onComplete={() => {
                    setIsCurrentChallengeCompleted(true);
                    setXp((prev) => prev + 25);
                  }}
                />
              </div>

              {/* أزرار التنقل بسهم موحد لليسار وحل مشكلة الانتقال للبطاقة التالية */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentStep('practice')}
                  className="py-2 px-4 rounded-xl text-xs font-bold border border-white/10 hover:border-[#FFCB74] transition-all cursor-pointer"
                >
                  العودة للمختبر
                </button>

                <button
                  disabled={!isCurrentChallengeCompleted}
                  onClick={handleNextChallenge}
                  className="py-2.5 px-7 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {currentChallengeIndex + 1 < currentCard.challenges.length 
                      ? 'السؤال التفاعلي التالي' 
                      : currentCardIndex + 1 < lessonCards.length 
                      ? 'الانتقال للبطاقة التالية' 
                      : 'إتمام الدرس والاختبار الشامل'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* ================= 4. الاختبار الشامل النهائي ================= */}
          {currentStep === 'comprehensive_quiz' && (
            <div className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all ${cardSurfaceClass}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFCB74]/20 border border-[#FFCB74]/40 text-[#FFCB74]">
                  تقييم التمكن الشامل (Mastery Assessment)
                </span>
                <span className="text-xs font-mono font-bold opacity-70">
                  السؤال {compQuizIndex + 1} من {comprehensiveQuestions.length}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black mb-6 leading-relaxed">
                {comprehensiveQuestions[compQuizIndex].questionText}
              </h3>

              <div className="space-y-3 mb-6">
                {comprehensiveQuestions[compQuizIndex].options.map((option, idx) => {
                  const isSelected = compSelectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCompSelectedOption(idx)}
                      className={`w-full text-right p-3.5 rounded-2xl border text-sm transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FFCB74]/20 border-[#FFCB74] font-black ring-1 ring-[#FFCB74]'
                          : `${subBoxClass} hover:border-[#FFCB74]`
                      }`}
                    >
                      <span>{option}</span>
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-[#FFCB74] text-[#111111]' : 'bg-black/20 opacity-60'
                      }`}>
                        {['أ', 'ب', 'ج', 'د'][idx]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  disabled={compSelectedOption === null}
                  onClick={handleNextCompQuestion}
                  className="py-2.5 px-7 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>{compQuizIndex + 1 === comprehensiveQuestions.length ? 'إنهاء التقييم وعرض النتيجة' : 'السؤال التالي'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 5. شاشة النتيجة النهائية ================= */}
          {currentStep === 'mastery_result' && (
            <div className={`border rounded-3xl p-8 backdrop-blur-md text-center transition-all ${cardSurfaceClass}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isMastered ? 'bg-[#FFCB74] text-[#111111]' : 'bg-red-500/20 text-red-500'
              }`}>
                {isMastered ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>

              <h2 className="text-xl sm:text-2xl font-black mb-2">
                {isMastered ? 'تهانينا هيله! حققتِ التمكن المطلوب بنجاح' : 'أوشكتِ على اجتياز المقرر!'}
              </h2>
              
              <p className="text-xs max-w-md mx-auto leading-relaxed opacity-80 mb-6 font-medium">
                {isMastered
                  ? `وفق معايير التعلم التكيفي (Bloom Mastery 80%)، أظهرتِ استيعاباً كاملاً لمفاهيم المقرر وأصبحتِ مؤهلة لاستلام وثيقة الإتقان.`
                  : `حققتِ نسبة ${masteryPercentage}% بينما المطلوب لاجتياز المقرر والحصول على الشهادة هو 80% فما فوق.`}
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                <div className={`p-3 rounded-xl border ${subBoxClass}`}>
                  <span className="text-[10px] opacity-70 block mb-0.5">نسبة التمكن</span>
                  <span className="text-lg font-black">{isMastered ? '100%' : `${masteryPercentage}%`}</span>
                </div>
                <div className={`p-3 rounded-xl border ${subBoxClass}`}>
                  <span className="text-[10px] opacity-70 block mb-0.5">الحد الأدنى</span>
                  <span className="text-lg font-bold opacity-60">80%</span>
                </div>
                <div className="p-3 rounded-xl border border-[#FFCB74]/40 bg-[#FFCB74]/15">
                  <span className="text-[10px] text-[#FFCB74] font-bold block mb-0.5">الحالة</span>
                  <span className={`text-sm font-black ${isMastered ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isMastered ? 'اجتياز معتمد' : 'مراجعة موجهة'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                {isMastered ? (
                  <button
                    onClick={() => setIsCertificateOpen(true)}
                    className="w-full sm:w-auto py-3 px-8 rounded-full font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>عرض وثيقة الإتقان (الشهادة)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentCardIndex(0);
                      setCurrentSlideIndex(0);
                      setCurrentPracticeSlideIndex(0);
                      setCurrentChallengeIndex(0);
                      setCurrentStep('theory');
                    }}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-full font-bold text-xs border border-white/20 hover:border-[#FFCB74] transition-all"
                  >
                    مراجعة السلايدات مجدداً
                  </button>
                )}

                <button
                  onClick={onBackToDashboard}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-full font-bold text-xs border border-white/10 hover:border-[#FFCB74] transition-all"
                >
                  العودة للمقررات
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <StudentCertificate
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        data={{
          studentName: 'هيله سرحان الناصري',
          courseTitle: courseTitle,
          studentLevel: studentLevel,
          masteryPercentage: isMastered ? 100 : masteryPercentage,
          serialNumber: 'EDT-PY-2026-95',
          issueDate: '2026-10-28',
        }}
      />

      {/* المساعد الذكي */}
      {isAiTutorOpen && (
        <aside className={`fixed top-0 left-0 h-full w-full sm:w-96 border-r z-50 flex flex-col justify-between shadow-2xl animate-fadeIn ${
          lessonTheme === 'dark' ? 'bg-[#111111] border-[#2F2F2F]' : lessonTheme === 'neutral' ? 'bg-[#181C24] border-[#313A4D]' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black">مرشد إديوتك الذكي</h4>
                <span className="text-[9px] text-emerald-400 font-bold">مساعد سياقي للدروس التكيفية</span>
              </div>
            </div>

            <button
              onClick={() => setIsAiTutorOpen(false)}
              className="p-1 rounded-lg border border-white/10 hover:border-[#FFCB74]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
            {messages.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                  msg.sender === 'user'
                    ? 'bg-[#FFCB74] text-[#111111] font-black mr-auto rounded-tl-none shadow-xs'
                    : `${subBoxClass} ml-auto rounded-tr-none`
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (
                messages.push({ sender: 'user', text: inputMessage }),
                setInputMessage('')
              )}
              placeholder="اطرحي سؤالك حول الدرس أو الكود..."
              className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border focus:border-[#FFCB74] ${subBoxClass}`}
            />
            <button
              onClick={() => {
                if (inputMessage.trim()) {
                  setMessages((prev) => [...prev, { sender: 'user', text: inputMessage }]);
                  setInputMessage('');
                }
              }}
              className="p-2 rounded-xl bg-[#FFCB74] text-[#111111] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      <footer className="w-full py-3 text-center text-xs opacity-60 border-t border-white/10 z-10 backdrop-blur-md">
        منصة إديوتك للتعلم التكيفي الذكي • جميع الحقوق محفوظة
      </footer>

    </div>
  );
};

export default AdaptiveLesson;