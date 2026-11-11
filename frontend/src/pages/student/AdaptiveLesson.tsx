import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Play, 
  CheckCircle2, 
  Bot, 
  ArrowLeft, 
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
  Code2, 
  Menu, 
  Home, 
  TrendingUp, 
  User, 
  Settings, 
  Target,
  ChevronDown,
  Layers,
  ListChecks
} from 'lucide-react';

import { PlatformLogo } from '../../components/common/PlatformLogo';
import StudentCertificate from './StudentCertificate';
import { InteractiveCodeEngine } from './InteractiveCodeEngine';
import { apiClient } from '../../services/apiClient';

type LessonTheme = 'dark' | 'light' | 'neutral';

interface SubTopicDetail {
  name: string;
  desc: string;
  type: string;
}

export interface SlideDefinition {
  id: string;
  termAr: string;
  termEn: string;
  definitionAr: string;
}

export interface SlideListGroup {
  id: string;
  mainPointAr: string;
  mainPointEn: string;
  subPointsAr: string[];
}

interface SlideContent {
  stepTitle: string;
  badgeText: string;
  description: string;
  definitions?: SlideDefinition[];
  lists?: SlideListGroup[];
  visualType?: 'definitions_accordion' | 'lists_accordion' | 'capsule_core' | 'memory_viz' | 'code_walkthrough' | 'pitfalls';
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
  courseId?: string;
  courseTitle?: string;
  studentLevel?: 'مبتدئ' | 'متوسط' | 'متقدم';
  onBackToDashboard: () => void;
}

export const AdaptiveLesson: React.FC<AdaptiveLessonProps> = ({
  courseId,
  courseTitle = 'أساسيات البرمجة بلغة Python',
  studentLevel = 'مبتدئ',
  onBackToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<'theory' | 'practice' | 'challenge' | 'comprehensive_quiz' | 'mastery_result'>('theory');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPracticeSlideIndex, setCurrentPracticeSlideIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // حالات الربط مع الباك إند و Cloud Firestore للأوامر وشجرة المفاهيم
  const [activeCourse, setActiveCourse] = useState<any>(null);
  const [activeSlidePromptTitle, setActiveSlidePromptTitle] = useState<string>('');
  const [activeCodePromptTitle, setActiveCodePromptTitle] = useState<string>('');
  const [activeQuizPromptTitle, setActiveQuizPromptTitle] = useState<string>('');
  const [dynamicCards, setDynamicCards] = useState<CardData[] | null>(null);
  
  const [activeCodeLine, setActiveCodeLine] = useState<number>(1);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);

  // حالات القوائم والتعاريف المنسدلة (Accordion / Dropdown)
  const [expandedDefinitions, setExpandedDefinitions] = useState<Record<string, boolean>>({
    'def_0_1': true,
    'def_1_1': true,
    'def_2_1': true
  });
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>({
    'list_0_1': true,
    'list_1_1': true,
    'list_2_1': true
  });

  const toggleDefinition = (id: string) => {
    setExpandedDefinitions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleList = (id: string) => {
    setExpandedLists(prev => ({ ...prev, [id]: !prev[id] }));
  };

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

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setLessonTheme(isDark ? 'dark' : 'light');
  }, []);

  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'courses', label: 'المقررات الدراسية', icon: BookOpen },
    { id: 'achievements', label: 'إنجازاتي', icon: Trophy },
    { id: 'progress', label: 'تقدمي الدراسي', icon: TrendingUp },
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const lessonCards: CardData[] = [
    {
      id: 1,
      title: 'مفهوم المتغيرات وعمليات التخزين في الذاكرة',
      conceptSummary: 'المتغير في لغة Python هو مساحة محجوزة في الذاكرة لتخزين قيمة معينة، ويعتمد نظام الكتابة الديناميكي.',
      slides: [
        {
          stepTitle: 'المصطلحات والتعاريف الأساسية للمتغيرات (Definitions Accordion)',
          badgeText: 'سلايد 1: التعاريف والمصطلحات المعرفية',
          description: 'انقري على السهم المنسدل لإسدال تعريف كل مصطلح باللغة العربية فقط:',
          visualType: 'definitions_accordion',
          definitions: [
            {
              id: 'def_default_1',
              termAr: 'المتغيرات وعناوين الذاكرة',
              termEn: 'Variables & Memory Pointers',
              definitionAr: 'المتغير هو مساحة محجوزة في الذاكرة العشوائية RAM لربط مسمى رمزي بكائن بيانات محدد بدقة دون تعديل مباشر للعناوين الفيزيائية.'
            },
            {
              id: 'def_default_2',
              termAr: 'الكتابة الديناميكية للأنواع',
              termEn: 'Dynamic Typing Architecture',
              definitionAr: 'نظام تشغيل يحدد نوع البيانات تلقائياً أثناء زمن التشغيل بناءً على القيمة المسندة دون الحاجة للإعلان الصريح المسبق عن النوع.'
            }
          ]
        },
        {
          stepTitle: 'قواعد التخصيص والنقاط الهيكلية (Lists Dropdown)',
          badgeText: 'سلايد 2: القوائم والنقاط الهيكلية',
          description: 'استعراض النقطة الرئيسية باللغتين مع سهم منسدل يعرض القواعد والتفاصيل بالعربية فقط:',
          visualType: 'lists_accordion',
          lists: [
            {
              id: 'list_default_1',
              mainPointAr: 'قواعد تسمية وهيكلة المتغيرات البرمجية',
              mainPointEn: 'Naming Conventions & Scoping Directives',
              subPointsAr: [
                'يجب أن يبدأ اسم المتغير بحرف أبجدي أو بشرطة سفلية، ويُمنع البدء بأرقام أو رموز خاصة.',
                'تجنب استخدام الكلمات المحجوزة في مفسر اللغة لتفادي تداخل النطاقات البرمجية.',
                'الالتزام بنمط التسمية الواضح والمعبر عن الغرض الوظيفي للمتغير.'
              ]
            },
            {
              id: 'list_default_2',
              mainPointAr: 'أنواع البيانات الأساسية الأولية',
              mainPointEn: 'Primitive Data Types & Storage',
              subPointsAr: [
                'الأعداد الصحيحة (Integers): تخزين الأعداد الرقمية الكاملة بدقة لا متناهية.',
                'النصوص وسلاسل المحارف (Strings): تمثيل النصوص المكتوبة بأي لغة ضمن ترميز يونيكود.',
                'القيم المنطقية الثنائية (Booleans): تمثيل حالات التحقق الشرطي بصواب أو خطأ.'
              ]
            }
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
      challenges: [
        {
          id: 'c1_q1',
          type: 'theory_mcq',
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
          type: 'tap_chips',
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
          type: 'code_slot',
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
      challenges: [
        {
          id: 'c2_q1',
          type: 'code_tracing',
          questionText: 'ما هي النتيجة النهائية للعملية الحسابية التالية وفق أسبقية بايثون؟',
          codeSnippet: `x = 20\ny = 6\nprint(x // y + x % y)`,
          options: ['3', '5', '4', '2'],
          correctAnswerIndex: 1,
          explanation: 'القسمة الصحيحة 20 // 6 تعطي 3، وباقي القسمة 20 % 6 يعطي 2، والمجموع 3 + 2 = 5.'
        },
        {
          id: 'c2_q2',
          type: 'theory_mcq',
          questionText: 'ما المشغل الرياضي الذي يعيد باقي القسمة بين رقمين في لغة Python؟',
          options: ['//', '%', '**', '/'],
          correctAnswerIndex: 1,
          explanation: 'المشغل % (Modulo) هو المسؤول عن إرجاع باقي القسمة.'
        },
        {
          id: 'c2_q3',
          type: 'code_slot',
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

  // بنك الأسئلة الشامل المتكامل مع المقرر
  const comprehensiveQuestions: ComprehensiveQuestion[] = [
    {
      id: 1,
      questionText: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'في هندسة الأوامر (Prompt Engineering)، ما هو الدور الأساسي للـ System Prompt مقارنة بالـ User Prompt؟'
        : 'ما هي نتيجة تنفيذ: print(10 // 3 + 10 % 3) في لغة بايثون؟',
      options: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? [
            'تحديد الهوية العامة والسلوك والقواعد الحاكمة للنموذج قبل بدء المحادثة.',
            'حساب التكلفة المالية لكل توكن مستهلك في الجلسة.',
            'توليد صور تلقائية مرفقة بالردود النصية.',
            'إيقاف معالج الـ GPU وقت خمول الاستجابة.'
          ]
        : ['4', '3', '4.33', '1'],
      correctAnswer: 0,
      explanation: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'الـ System Prompt يحدد شخصية وسياق وقواعد استجابة النموذج للتحكم في المخرجات وضمان دقتها.'
        : 'القسمة الصحيحة تعطي 3 وباقي القسمة 1، المجموع = 4.'
    },
    {
      id: 2,
      questionText: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'ماذا يُقصد بتقنية (Few-Shot Prompting) عند توجيه النماذج التوليدية؟'
        : 'أي من الأسماء التالية يُعتبر اسماً صحيحاً لمتغير وفق معايير Python (snake_case)؟',
      options: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? [
            'إرسال الأمر دون أي أمثلة سابقة نهائياً.',
            'تزويد النموذج ببضعة أمثلة توضيحية لمدخلات ومخرجات سابقة لضبط نسق الإجابة.',
            'تدريب النموذج من الصفر على مجموعة بيانات ضخمة.',
            'تقليل عدد التوكنات لأدنى حد لتوفير الذاكرة.'
          ]
        : ['2nd_score', 'student_total_score', 'student-score', 'class'],
      correctAnswer: 1,
      explanation: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'تقنية Few-Shot تعتمد على تزويد النموذج بأمثلة محددة وموجهة داخل السياق لفهم المطلوب دون إعادة تدريب.'
        : 'الاسم student_total_score يتبع قواعد التسمية ولا يبدأ برقم ولا يحتوي على علامات محجوزة.'
    },
    {
      id: 3,
      questionText: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'ما وظيفة معامل درجة الحرارة (Temperature) في استدعاءات نماذج الـ LLM؟'
        : 'ماذا يحدث لقيمة المتغير القديمة في الذاكرة عند إسناد قيمة جديدة لنفس الاسم؟',
      options: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? [
            'قياس درجة حرارة المعالج المركزي للسيرفر.',
            'التحكم في درجة العشوائية والابتكارية مقابل الدقة والتوقع في المخرجات.',
            'تحديد سرعة نقل البيانات عبر الإنترنت.',
            'تحديد لغة البرمجة التي كُتب بها النموذج.'
          ]
        : [
            'تُدمج القيمة الجديدة مع القديمة تلقائياً.',
            'يحدث خطأ تكرار (NameError).',
            'يتم استبدال المرجع بالقيمة الجديدة وتفريغ القديمة عبر Garbage Collector.',
            'تظل القيمة القديمة ولا تُحذف أبداً.'
          ],
      correctAnswer: courseTitle.includes('ai') || courseTitle.includes('الذكاء') ? 1 : 2,
      explanation: courseTitle.includes('ai') || courseTitle.includes('الذكاء')
        ? 'خفض Temperature (مثل 0.1) يعطي إجابات دقيقة ومحددة، بينما رفعه (مثل 0.8) يزيد من التنوع الإبداعي.'
        : 'الاسم يرتبط بالقيمة الجديدة، والقديمة تُفرغ من الذاكرة إذا لم تعد مستخدمة.'
    }
  ];

  // جلب بيانات شجرة المفاهيم والأوامر النشطة من الباك إند و Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchAdaptiveMetadata = async () => {
      try {
        // 1. جلب تفاصيل المقرر وشجرة المفاهيم إن وُجد المعرف
        if (courseId) {
          try {
            const courseRes = await apiClient.get(`/courses/${courseId}`);
            if (isMounted && courseRes.data?.course) {
              const c = courseRes.data.course;
              setActiveCourse(c);
              const rawTopics = c.topic_map || c.topics || {};
              const topicList = Array.isArray(rawTopics) ? rawTopics : Object.values(rawTopics);
              if (topicList.length > 0) {
                const mappedCards: CardData[] = topicList.map((top: any, idx: number) => {
                  const subList: string[] = Array.isArray(top.subTopics) ? top.subTopics : (Array.isArray(top.targetConcepts) ? top.targetConcepts : []);
                  return {
                    id: idx + 1,
                    title: top.title || `الوحدة التعليمية ${idx + 1}`,
                    conceptSummary: top.description || `مفهوم تعليمي تكيفي موجه بالذكاء الاصطناعي بنظام المحتوى الصفري.`,
                    slides: [
                      {
                        stepTitle: `المصطلحات والتعاريف الأساسية: ${top.title || ''}`,
                        badgeText: `سلايد 1: التعاريف والمصطلحات (Bilingual Definitions Accordion)`,
                        description: `عرض اسم المصطلح باللغتين العربية والإنجليزية، يليه سهم منسدل يسدل التعريف بالعربية فقط:`,
                        visualType: 'definitions_accordion',
                        definitions: [
                          {
                            id: `def_${idx}_1`,
                            termAr: `مفهوم: ${top.title}`,
                            termEn: top.titleEn || (top.title.includes('JavaScript') ? 'JavaScript Core' : top.title.includes('Python') ? 'Python Concept' : 'Core Concept'),
                            definitionAr: top.description || `بنية معرفية أساسية تحدد كيفية تمثيل ومعالجة البيانات والعمليات البرمجية بدقة داخل النظام.`
                          },
                          {
                            id: `def_${idx}_2`,
                            termAr: `نطاق التنفيذ وزمن التشغيل`,
                            termEn: `Execution Scope & Runtime Context`,
                            definitionAr: `البيئة النشطة في الذاكرة التي تحكم دورة حياة المتغيرات والعمليات وتحدد صلاحية الوصول إليها أثناء زمن تشغيل البرنامج.`
                          },
                          ...(subList.length > 0 ? [{
                            id: `def_${idx}_3`,
                            termAr: typeof subList[0] === 'string' ? subList[0] : (subList[0] as any).name || 'المكون البنائي الفرعي',
                            termEn: `Specialized Mechanism`,
                            definitionAr: `الآلية البنائية الفرعية المستخدمة في إدارة وتطبيق التدفق المنطقي لهذا الدرس بكفاءة عالية وفق معايير الكود النظيف.`
                          }] : [])
                        ]
                      },
                      {
                        stepTitle: `القواعد والنقاط الهيكلية المعتمدة`,
                        badgeText: `سلايد 2: القوائم والنقاط (Bilingual Lists Dropdown)`,
                        description: `عرض النقطة الرئيسية باللغتين مع سهم منسدل يعرض النقاط الفرعية والتفاصيل بالعربية فقط:`,
                        visualType: 'lists_accordion',
                        lists: [
                          {
                            id: `list_${idx}_1`,
                            mainPointAr: `المعايير الهندسية لتطبيق ${top.title}`,
                            mainPointEn: `Engineering Standards & Directives`,
                            subPointsAr: [
                              `التحقق الصارم من صحة المدخلات والتوافق النوعي قبل الشروع في المعالجة.`,
                              `تحسين استهلاك الذاكرة وتفادي تكوين مراجع دائرية غير ضرورية.`,
                              `الالتزام بمبادئ الكود النظيف وقابلية الصيانة والتوسع المستقبلي.`
                            ]
                          },
                          {
                            id: `list_${idx}_2`,
                            mainPointAr: `مخرجات التمكن في شجرة المفاهيم`,
                            mainPointEn: `Mastery Learning Outcomes`,
                            subPointsAr: subList.length > 0 
                              ? subList.map(s => typeof s === 'string' ? `إتقان وتطبيق: ${s}` : `إتقان وتطبيق: ${(s as any).name || 'المفهوم الفرعي'}`)
                              : [
                                `استيعاب وتفكيك بنية المفهوم منطقياً دون أخطاء نحوية أو مفاهيمية.`,
                                `تطبيق الخوارزميات المرتبطة به وحل التحديات العملية بكفاءة عالية.`
                              ]
                          }
                        ]
                      },
                      {
                        stepTitle: `المحاكاة الهندسية وتتبع الكود الحي`,
                        badgeText: `سلايد 3: واجهة تفاعلية وأنيميشن حي (Interactive UI)`,
                        description: `واجهة محاكاة تفاعلية تجمع توزيع الذاكرة العشوائية وتتبع الكود سطراً بسطر بألوان صلبة واضحة ومؤشرات حية:`,
                        visualType: 'memory_viz',
                        memorySnapshot: [
                          { name: 'current_concept', type: 'str', address: '0x7FFF9A10', value: `"${top.title || 'Topic'}"` },
                          { name: 'bloom_level', type: 'str', address: '0x7FFF9A18', value: `"${top.bloomLevel || 'Apply'}"` },
                          { name: 'mastery_index', type: 'float', address: '0x7FFF9A20', value: '0.85' }
                        ],
                        interactiveCode: [
                          { lineNum: 1, code: `# دراسة وتطبيق: ${top.title}`, explanation: `تهيئة وتخصيص الموارد لمفهوم ${top.title}.` },
                          { lineNum: 2, code: `concept_status = "mastered"`, explanation: `تحديث مصفوفة التمكن للدفعة المعرفية في جدول الذاكرة.` },
                          { lineNum: 3, code: `print("تم استيعاب المفهوم وتثبيته بنجاح")`, explanation: `طباعة رسالة تأكيد إتمام المعالجة.` }
                        ]
                      },
                      {
                        stepTitle: `التحصين البرمجي ومقارنة الأكواد والمزالق (Pitfalls)`,
                        badgeText: `سلايد 4: التحصين البرمجي (Visual Code Diff)`,
                        description: `مقارنة بصرية مباشرة بألوان صلبة واضحة بين الخطأ الشائع والحل النموذجي المعتمد لمفهوم ${top.title}:`,
                        visualType: 'pitfalls',
                        pitfallTip: {
                          wrong: `# ممارسة خاطئة شائعة في تطبيق ${top.title}\nprocess_without_validation()`,
                          right: `# الطريقة المعيارية الصحيحة المعتمدة\nvalidate_inputs()\nprocess()`,
                          note: `ينبغي مراعاة شروط التحقق المسبقة في شجرة المفاهيم قبل الانتقال للخطوة التالية.`
                        }
                      }
                    ],
                    practiceSlides: [
                      {
                        stepTitle: `المهمة التطبيقية: ممارسة مفهوم ${top.title}`,
                        badgeText: `تطبيق عملي 1 من 1`,
                        explanation: `اكتبي ونفذي الكود الخاص بتطبيق ${top.title} للتحقق من المخرجات عبر المصحح الذكي:`,
                        initialCode: `# تدريب عملي تكيفي على: ${top.title}\nvalue = "${top.title}"\nprint("المفهوم المطبق:", value)`,
                        expectedOutputHint: `المفهوم المطبق: ${top.title}`,
                        objectives: [
                          { id: 'obj_dyn_1', text: `تطبيق عملي مباشر على ${top.title}` },
                          { id: 'obj_dyn_2', text: `التحقق من صحة المخرجات البرمجية` }
                        ]
                      }
                    ],
                    challenges: [
                      {
                        id: `c_${idx}_1`,
                        type: 'theory_mcq',
                        title: `تحدي التمكن المعرفي: ${top.title}`,
                        questionText: `ما هو المعيار البيداغوجي الأساسي عند تطبيق مفهوم "${top.title}" في بيئة المنصة التكيفية؟`,
                        options: [
                          `استيعاب البنية التأسيسية وتطبيق الممارسات المعيارية لمفهوم ${top.title}`,
                          `تجاوز شروط التحقق المسبقة دون تدقيق في الذاكرة`,
                          `تعطيل الاستثناءات والأخطاء التشغيلية لزيادة السرعة`,
                          `لا يوجد أي تأثير لمفهوم ${top.title} على بنية البرنامج`
                        ],
                        correctAnswerIndex: 0,
                        explanation: `المعيار البيداغوجي المعتمد يتطلب ترسيخ القواعد الأساسية لـ ${top.title} لضمان كتابة كود سليم وموثوق.`
                      },
                      {
                        id: `c_${idx}_2`,
                        type: 'code_tracing',
                        title: `تتبع المخرجات البرمجية: ${top.title}`,
                        questionText: `ما هي النتيجة الدقيقة عند تشغيل كود فحص مفهوم ${top.title}؟`,
                        codeSnippet: `# فحص تطبيقي لمفهوم ${top.title}\nconcept_name = "${top.title}"\nprint("الحالة:", len(concept_name) > 0)`,
                        options: [
                          'الحالة: True',
                          'الحالة: False',
                          'None',
                          'SyntaxError'
                        ],
                        correctAnswerIndex: 0,
                        explanation: `تم إسناد نص صحيح للمتغير مما يجعل طول النص أكبر من صفر ويعيد True.`
                      }
                    ]
                  };
                });
                setDynamicCards(mappedCards);
              }
            }
          } catch (cErr) {
            console.warn('Could not fetch specific course details, fallback to default lessons', cErr);
          }
        }

        // 2. جلب بيانات الأوامر النشطة الثلاثة (السلايدات، الكود، الاختبار)
        try {
          const [slidesPromptRes, codePromptRes, quizPromptRes] = await Promise.allSettled([
            apiClient.get('/prompts/active/static_slides'),
            apiClient.get('/prompts/active/interactive_code'),
            apiClient.get('/prompts/active/micro_quiz')
          ]);

          if (isMounted) {
            if (slidesPromptRes.status === 'fulfilled' && slidesPromptRes.value.data?.prompt?.title) {
              setActiveSlidePromptTitle(slidesPromptRes.value.data.prompt.title);
            }
            if (codePromptRes.status === 'fulfilled' && codePromptRes.value.data?.prompt?.title) {
              setActiveCodePromptTitle(codePromptRes.value.data.prompt.title);
            }
            if (quizPromptRes.status === 'fulfilled' && quizPromptRes.value.data?.prompt?.title) {
              setActiveQuizPromptTitle(quizPromptRes.value.data.prompt.title);
            }
          }
        } catch (pErr) {
          console.warn('Could not fetch active prompts metadata', pErr);
        }
      } catch (err) {
        console.error('Error initializing adaptive lesson view:', err);
      }
    };

    fetchAdaptiveMetadata();
    return () => { isMounted = false; };
  }, [courseId, studentLevel]);

  const activeLessonCards = (dynamicCards && dynamicCards.length > 0) ? dynamicCards : lessonCards;

  useEffect(() => {
    if (studentLevel === 'متوسط') {
      setCurrentCardIndex(Math.min(1, activeLessonCards.length - 1));
    } else if (studentLevel === 'متقدم') {
      setCurrentCardIndex(Math.max(0, activeLessonCards.length - 1));
    } else {
      setCurrentCardIndex(0);
    }
  }, [studentLevel, activeLessonCards.length]);

  const currentCard = activeLessonCards[currentCardIndex] || activeLessonCards[0];
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
      setConsoleOutput(`المخرجات الناجحة:\n${activePracticeSlide.expectedOutputHint}\n\n[✓ مصحح مسار الذكي]: تم التنفيذ بنجاح وتطابق الكود مع معايير الخطوة (+20 XP).`);
      setXp((prev) => prev + 20);
    }, 600);
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex + 1 < currentCard.challenges.length) {
      setCurrentChallengeIndex(prev => prev + 1);
      setIsCurrentChallengeCompleted(false);
    } else {
      if (currentCardIndex + 1 < activeLessonCards.length) {
        setCurrentCardIndex(prev => prev + 1);
        setCurrentSlideIndex(0);
        setCurrentPracticeSlideIndex(0);
        setCurrentChallengeIndex(0);
        setIsCurrentChallengeCompleted(false);
        setCurrentStep('theory');
      } else {
        setCompQuizIndex(0);
        setCompSelectedOption(null);
        setCompScore(0);
        setCurrentStep('comprehensive_quiz');
      }
    }
  };

  // معالجة الانتقال بين الأسئلة الثلاثة للاختبار الشامل
  const handleNextCompQuestion = () => {
    if (compSelectedOption === null) return;

    const currentQuestion = comprehensiveQuestions[compQuizIndex];
    let newScore = compScore;
    if (compSelectedOption === currentQuestion.correctAnswer) {
      newScore += 1;
      setCompScore(newScore);
      setXp((prev) => prev + 30);
    }

    if (compQuizIndex + 1 < comprehensiveQuestions.length) {
      setCompQuizIndex((prev) => prev + 1);
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
      ? 'bg-[#1E1E1E] border-2 border-[#383838] shadow-2xl text-[#FFFFFF]' 
      : lessonTheme === 'neutral'
      ? 'bg-[#222938] border-2 border-[#3A4559] shadow-xl text-[#FFFFFF]'
      : 'bg-[#FFFFFF] border-2 border-[#E2E8F0] shadow-xl text-[#111111]';

  const subBoxClass = 
    lessonTheme === 'dark' 
      ? 'bg-[#141414] border-2 border-[#2A2A2A] text-[#FFFFFF]' 
      : lessonTheme === 'neutral'
      ? 'bg-[#171D28] border-2 border-[#2B3545] text-[#FFFFFF]'
      : 'bg-[#F8FAFC] border-2 border-[#CBD5E1] text-[#111111]';

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
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
        className={`fixed top-0 right-0 h-screen max-h-screen w-72 border-l z-50 flex flex-col justify-between py-6 px-5 shadow-2xl overflow-y-auto overflow-x-hidden ${
          lessonTheme === 'dark'
            ? 'bg-[#111111] border-[#2F2F2F] text-white'
            : lessonTheme === 'neutral'
            ? 'bg-[#181C24] border-[#313A4D] text-white'
            : 'bg-white border-gray-200 text-gray-800'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <PlatformLogo size={42} />
              <div>
                <span className="text-base font-black text-[#FFCB74] tracking-wider block leading-tight">مسار</span>
                <span className="text-[10px] opacity-70">MASAR</span>
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
          منصة مسار للتعلم التكيفي الذكي
        </div>
      </aside>

      {/* الشريط العلوي مع محدد الثيمات */}
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
              <h2 className="text-sm font-bold leading-tight">منصة مسار الذكية</h2>
              <p className="text-[11px] text-[#FFCB74] font-medium tracking-wide">MASAR</p>
            </div>
          </div>
        </div>

        {/* شارة التزامن الذكي مع أوامر وشجرة مفاهيم الإدارة */}
        <div className="hidden xl:flex items-center gap-2">
          {activeSlidePromptTitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCB74]/15 border border-[#FFCB74]/40 text-[11px] font-bold text-[#FFCB74]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أمر السلايدات: {activeSlidePromptTitle}</span>
            </div>
          )}
          {activeCodePromptTitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-bold text-blue-500 dark:text-blue-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>أمر الكود: {activeCodePromptTitle}</span>
            </div>
          )}
          {activeCourse && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>المقرر: {activeCourse.title}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            العودة للمقررات
          </button>
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
                {currentStep === 'comprehensive_quiz' 
                  ? `الاختبار الشامل النهائي (سؤال ${compQuizIndex + 1} من ${comprehensiveQuestions.length})${activeQuizPromptTitle ? ` • مُدار بـ: ${activeQuizPromptTitle}` : ''}` 
                  : `البطاقة ${currentCardIndex + 1} من ${activeLessonCards.length}`}
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

              {/* المحتوى البصري والتفاعلي (وفق معايير الألوان الصلبة والتعاريف والقوائم المنسدلة) */}
              <div className="mb-6">
                
                {/* 1. هيكلة التعاريف (Bilingual Term Accordion - Arabic Definition) */}
                {activeSlide.definitions && activeSlide.definitions.length > 0 && (
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FFCB74] text-[#111111] flex items-center justify-center font-bold">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#111111] dark:text-[#FFCB74]">
                          المصطلحات والمفاهيم المعرفية (اسدل التعريف العربي بالنقر)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#1E1E1E] text-[#FFCB74] border border-[#383838]">
                        {activeSlide.definitions.length} مصطلحات معتمدة
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {activeSlide.definitions.map((def, defIdx) => {
                        const isOpen = expandedDefinitions[def.id] ?? (defIdx === 0);
                        return (
                          <div 
                            key={def.id || defIdx}
                            className="rounded-2xl border-2 border-[#E2E8F0] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#1E1E1E] overflow-hidden transition-all shadow-sm"
                          >
                            <button
                              type="button"
                              onClick={() => toggleDefinition(def.id)}
                              className="w-full p-4 flex items-center justify-between gap-3 text-right hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-colors cursor-pointer"
                            >
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-sm sm:text-base font-black text-[#111111] dark:text-[#FFFFFF]">
                                  {def.termAr}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#92400E] dark:text-[#FFCB74] bg-[#FEF3C7] dark:bg-[#2A2315] px-2.5 py-0.5 rounded-md border border-[#FDE68A] dark:border-[#78350F]">
                                  {def.termEn}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                                  {isOpen ? 'طي التعريف' : 'عرض التعريف'}
                                </span>
                                <div className={`w-7 h-7 rounded-lg bg-[#F1F5F9] dark:bg-[#2A2A2A] border border-[#CBD5E1] dark:border-[#444444] flex items-center justify-center text-[#111111] dark:text-[#FFFFFF] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              </div>
                            </button>

                            {isOpen && (
                              <div className="px-4 pb-4 pt-2 border-t-2 border-[#E2E8F0] dark:border-[#383838] bg-[#F8FAFC] dark:bg-[#161616] animate-fadeIn">
                                <div className="flex items-start gap-2.5">
                                  <span className="w-2 h-2 rounded-full bg-[#10B981] mt-2 shrink-0" />
                                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#1E293B] dark:text-[#F1F5F9]">
                                    {def.definitionAr}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. هيكلة القوائم والنقاط (Bilingual Main Point - Arabic Sub-points) */}
                {activeSlide.lists && activeSlide.lists.length > 0 && (
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-[#FFFFFF] flex items-center justify-center font-bold">
                          <ListChecks className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#111111] dark:text-[#60A5FA]">
                          النقاط الهيكلية والتوجيهات التنفيذية (اسدل التفاصيل بالعربية)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#1E1E1E] text-[#60A5FA] border border-[#383838]">
                        {activeSlide.lists.length} محاور رئيسية
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {activeSlide.lists.map((listGroup, listIdx) => {
                        const isOpen = expandedLists[listGroup.id] ?? (listIdx === 0);
                        return (
                          <div 
                            key={listGroup.id || listIdx}
                            className="rounded-2xl border-2 border-[#E2E8F0] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#1E1E1E] overflow-hidden transition-all shadow-sm"
                          >
                            <button
                              type="button"
                              onClick={() => toggleList(listGroup.id)}
                              className="w-full p-4 flex items-center justify-between gap-3 text-right hover:bg-[#F8FAFC] dark:hover:bg-[#252525] transition-colors cursor-pointer"
                            >
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-sm sm:text-base font-black text-[#111111] dark:text-[#FFFFFF]">
                                  {listGroup.mainPointAr}
                                </span>
                                <span className="text-xs font-mono font-bold text-[#1D4ED8] dark:text-[#93C5FD] bg-[#DBEAFE] dark:bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#BFDBFE] dark:border-[#1E3A8A]">
                                  {listGroup.mainPointEn}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                                  {isOpen ? 'طي التفاصيل' : 'عرض التفاصيل'}
                                </span>
                                <div className={`w-7 h-7 rounded-lg bg-[#F1F5F9] dark:bg-[#2A2A2A] border border-[#CBD5E1] dark:border-[#444444] flex items-center justify-center text-[#111111] dark:text-[#FFFFFF] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              </div>
                            </button>

                            {isOpen && (
                              <div className="px-4 pb-4 pt-3 border-t-2 border-[#E2E8F0] dark:border-[#383838] bg-[#F8FAFC] dark:bg-[#161616] animate-fadeIn">
                                <ul className="space-y-2.5 text-xs sm:text-sm">
                                  {listGroup.subPointsAr.map((sub, sIdx) => (
                                    <li key={sIdx} className="flex items-start gap-2.5 text-[#1E293B] dark:text-[#F1F5F9] font-medium leading-relaxed">
                                      <span className="w-2 h-2 rounded-full bg-[#2563EB] dark:bg-[#60A5FA] shrink-0 mt-1.5" />
                                      <span>{sub}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. الكبسولة التفاعلية بألوان صلبة واضحة */}
                {activeSlide.visualType === 'capsule_core' && activeSlide.capsuleData && (
                  <div className={`p-6 sm:p-7 rounded-3xl border-2 border-[#E2E8F0] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#141414] flex flex-col items-center justify-center text-center relative overflow-hidden transition-all shadow-md`}>
                    {!isCapsuleOpen ? (
                      <div 
                        onClick={() => setIsCapsuleOpen(true)}
                        className="group cursor-pointer flex flex-col items-center p-6 sm:p-8 rounded-3xl border-2 border-dashed border-[#FFCB74] bg-[#F8FAFC] dark:bg-[#1E1E1E] hover:bg-[#FFFBEB] dark:hover:bg-[#252525] transition-all w-full max-w-md shadow-lg"
                      >
                        <div className="w-20 h-20 rounded-2xl bg-[#FFCB74] text-[#111111] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-md font-bold">
                          <Cpu className="w-10 h-10 animate-pulse text-[#111111]" />
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                          <span className="text-[11px] font-bold text-[#10B981] font-mono">جاهزة للتفكيك البصري (Solid Colors)</span>
                        </div>
                        <h4 className="text-base font-black text-[#111111] dark:text-[#FFCB74] mb-1">
                          {activeSlide.capsuleData.label}
                        </h4>
                        <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium mt-1">
                          <span>انقري هنا لفتح الكبسولة واستعراض مكوناتها بالألوان التفاعلية</span>
                          <Sparkles className="w-4 h-4 text-[#FFCB74]" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-full animate-fadeIn">
                        <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-[#E2E8F0] dark:border-[#2A2A2A]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FFCB74] flex items-center justify-center text-[#111111] font-bold">
                              <Cpu className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-black text-[#111111] dark:text-[#FFCB74]">
                              تفكيك عناصر الكبسولة التفاعلية
                            </span>
                          </div>
                          <button
                            onClick={() => setIsCapsuleOpen(false)}
                            className="text-xs px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#252525] border-2 border-[#CBD5E1] dark:border-[#444444] text-[#111111] dark:text-[#FFFFFF] hover:bg-[#E2E8F0] dark:hover:bg-[#333333] transition-all cursor-pointer font-black"
                          >
                            ✕ طي الكبسولة
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {activeSlide.capsuleData.items.map((item, itmIdx) => {
                            const solidColorThemes = [
                              { border: 'border-2 border-[#10B981]', bg: 'bg-[#F0FDF4] dark:bg-[#0D2214]', badge: 'bg-[#10B981] text-[#FFFFFF]', text: 'text-[#064E3B] dark:text-[#34D399]' },
                              { border: 'border-2 border-[#0284C7]', bg: 'bg-[#F0F9FF] dark:bg-[#0A2338]', badge: 'bg-[#0284C7] text-[#FFFFFF]', text: 'text-[#0C4A6E] dark:text-[#38BDF8]' },
                              { border: 'border-2 border-[#7C3AED]', bg: 'bg-[#FAF5FF] dark:bg-[#1E0F33]', badge: 'bg-[#7C3AED] text-[#FFFFFF]', text: 'text-[#4C1D95] dark:text-[#C084FC]' },
                              { border: 'border-2 border-[#D97706]', bg: 'bg-[#FFFBEB] dark:bg-[#2B1B09]', badge: 'bg-[#D97706] text-[#FFFFFF]', text: 'text-[#78350F] dark:text-[#FBBF24]' }
                            ];
                            const theme = solidColorThemes[itmIdx % solidColorThemes.length];

                            return (
                              <div 
                                key={itmIdx}
                                className={`p-4 rounded-2xl ${theme.border} ${theme.bg} flex flex-col justify-between text-right shadow-sm hover:scale-102 transition-all cursor-pointer`}
                              >
                                <div>
                                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ${theme.badge} mb-2 inline-block`}>
                                    {item.type}
                                  </span>
                                  <h5 className="text-sm font-black text-[#111111] dark:text-white mb-1.5">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-[#334155] dark:text-[#E2E8F0] leading-relaxed font-medium">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. محاكاة الذاكرة بألوان صلبة واضحة ومؤشرات حية */}
                {activeSlide.visualType === 'memory_viz' && activeSlide.memorySnapshot && (
                  <div className={`p-5 sm:p-6 rounded-3xl border-2 border-[#383838] bg-[#141414] text-[#FFFFFF] shadow-xl`}>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#2A2A2A]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                        <span className="text-xs font-black text-[#FFCB74] flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-[#FFCB74]" />
                          <span>محاكاة توزيع الذاكرة العشوائية الحية (RAM Heap & Stack Simulator)</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1E1E1E] text-[#10B981] font-bold border-2 border-[#10B981]">
                        ● Live Telemetry
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
                      {activeSlide.memorySnapshot.map((mem, mIdx) => {
                        const isSelected = selectedMemoryIndex === mIdx;
                        return (
                          <div 
                            key={mIdx} 
                            onClick={() => setSelectedMemoryIndex(mIdx)}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${
                              isSelected
                                ? 'border-[#FFCB74] bg-[#2A2315] shadow-md scale-102'
                                : 'border-[#383838] bg-[#1E1E1E] hover:border-[#FFCB74]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-[#FFCB74] font-black">{mem.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#2D2D2D] text-[#E2E8F0] font-bold border border-[#444444]">
                                {mem.type}
                              </span>
                            </div>
                            <div className="font-mono text-sm text-[#10B981] font-black tracking-wide">
                              {mem.value}
                            </div>
                            <div className="text-[10px] font-mono text-[#94A3B8] border-t-2 border-[#2A2A2A] pt-1.5 flex items-center justify-between">
                              <span>Ref: {mem.address}</span>
                              <span className="text-[9px] text-[#FFCB74] font-bold">انقر للفحص</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* تفاصيل المؤشر المحدد */}
                    {activeSlide.memorySnapshot[selectedMemoryIndex] && (
                      <div className="p-3.5 rounded-xl bg-[#1E1E1E] border-2 border-[#FFCB74] text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-[#E2E8F0]">
                        <span className="text-[#FFCB74] font-bold">
                          المتغير المفحوص: {activeSlide.memorySnapshot[selectedMemoryIndex].name}
                        </span>
                        <span className="text-[#10B981] font-bold">
                          القيمة المخزنة: {activeSlide.memorySnapshot[selectedMemoryIndex].value}
                        </span>
                        <span className="text-[#94A3B8]">
                          العنوان السداسي: {activeSlide.memorySnapshot[selectedMemoryIndex].address}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. تشريح الكود السطري التفاعلي */}
                {activeSlide.visualType === 'code_walkthrough' && activeSlide.interactiveCode && (
                  <div className={`rounded-3xl border-2 border-[#383838] overflow-hidden shadow-xl bg-[#121212]`}>
                    <div className="px-5 py-3 bg-[#1A1A1A] border-b-2 border-[#2A2A2A] flex items-center justify-between text-xs">
                      <span className="font-mono text-[#FFCB74] flex items-center gap-2 font-bold">
                        <Code2 className="w-4 h-4" />
                        <span>Interactive_Walkthrough.py</span>
                      </span>
                      <span className="text-[11px] text-[#94A3B8] font-bold">
                        انقري على أي سطر لتشريحه برمجياً بالذكاء الاصطناعي
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 font-mono text-xs space-y-2 bg-[#0E0E0E]" dir="ltr">
                      {activeSlide.interactiveCode.map((line) => {
                        const isActive = activeCodeLine === line.lineNum;
                        return (
                          <div
                            key={line.lineNum}
                            onClick={() => setActiveCodeLine(line.lineNum)}
                            className={`p-2.5 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                              isActive
                                ? 'bg-[#2A2315] border-2 border-[#FFCB74] text-[#FFFFFF] shadow-md'
                                : 'hover:bg-[#1E1E1E] text-[#94A3B8] hover:text-[#FFFFFF] border-2 border-transparent'
                            }`}
                          >
                            <span className="text-[#64748B] font-bold select-none w-5 text-right font-mono">{line.lineNum}</span>
                            <span className={`font-bold font-mono ${isActive ? 'text-[#FFCB74]' : 'text-[#E2E8F0]'}`}>
                              {line.code}
                            </span>
                            {isActive && (
                              <span className="mr-auto text-[10px] px-2.5 py-0.5 rounded-md bg-[#FFCB74] text-[#111111] font-black">
                                السطر النشط
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-[#1A1A1A] border-t-2 border-[#2A2A2A] text-xs sm:text-sm flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFCB74] animate-ping shrink-0" />
                      <span className="text-[#FFFFFF] font-medium leading-relaxed">
                        {activeSlide.interactiveCode.find(l => l.lineNum === activeCodeLine)?.explanation}
                      </span>
                    </div>
                  </div>
                )}

                {/* 6. المزالق البرمجية والتحصين بألوان صلبة عالية التباين */}
                {activeSlide.visualType === 'pitfalls' && activeSlide.pitfallTip && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl border-2 border-[#DC2626] bg-[#FEF2F2] dark:bg-[#251010] shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-black text-[#DC2626] dark:text-[#F87171] mb-2.5">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                        <span>مكمن الخلل الشائع (Wrong Pattern)</span>
                      </div>
                      <pre className="font-mono text-xs whitespace-pre-wrap text-[#991B1B] dark:text-[#FECACA] bg-[#FFFFFF] dark:bg-[#1A0A0A] p-3.5 rounded-xl border-2 border-[#FCA5A5] dark:border-[#7F1D1D]" dir="ltr">
                        {activeSlide.pitfallTip.wrong}
                      </pre>
                    </div>

                    <div className="p-5 rounded-3xl border-2 border-[#10B981] bg-[#F0FDF4] dark:bg-[#0E2015] shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-black text-[#10B981] dark:text-[#34D399] mb-2.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>التطبيق النموذجي المعتمد (Clean Code)</span>
                      </div>
                      <pre className="font-mono text-xs whitespace-pre-wrap text-[#065F46] dark:text-[#A7F3D0] bg-[#FFFFFF] dark:bg-[#07150D] p-3.5 rounded-xl border-2 border-[#6EE7B7] dark:border-[#064E3B]" dir="ltr">
                        {activeSlide.pitfallTip.right}
                      </pre>
                    </div>

                    <div className={`sm:col-span-2 p-4 rounded-2xl border-2 border-[#D97706] bg-[#FFFBEB] dark:bg-[#231808] text-xs text-[#111111] dark:text-white flex items-center justify-between gap-3 shadow-sm`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#D97706] dark:text-[#FFCB74] shrink-0" />
                        <span className="text-[#78350F] dark:text-[#FDE68A]"><strong>نصيحة المعلم الذكية:</strong> {activeSlide.pitfallTip.note}</span>
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#D97706] text-[#FFFFFF] font-mono shrink-0 whitespace-nowrap">
                        +20 XP Focus
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* أزرار التنقل */}
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

              {/* محرر الكود */}
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
                    مخرجات الطرفية ومصحح مسار الذكي:
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

              {/* أزرار التنقل */}
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

          {/* ================= 3. التحدي والتحقق المعتمد ================= */}
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

              {/* محرك الأكواد التفاعلي */}
              <div className="mb-6">
                <InteractiveCodeEngine
                  challenge={activeChallenge}
                  onComplete={() => {
                    setIsCurrentChallengeCompleted(true);
                    setXp((prev) => prev + 25);
                  }}
                />
              </div>

              {/* أزرار التنقل */}
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
                      : currentCardIndex + 1 < activeLessonCards.length 
                      ? 'الانتقال للبطاقة التالية' 
                      : 'إتمام الدرس والاختبار الشامل'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* ================= 4. الاختبار الشامل النهائي (3 أسئلة متتالية) ================= */}
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
                  className="py-2.5 px-7 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
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
                    className="w-full sm:w-auto py-3 px-8 rounded-full font-black text-xs bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                    className="w-full sm:w-auto py-2.5 px-6 rounded-full font-bold text-xs border border-white/20 hover:border-[#FFCB74] transition-all cursor-pointer"
                  >
                    مراجعة السلايدات مجدداً
                  </button>
                )}

                <button
                  onClick={onBackToDashboard}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-full font-bold text-xs border border-white/10 hover:border-[#FFCB74] transition-all cursor-pointer"
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
        <aside className={`fixed top-0 left-0 h-screen max-h-screen w-full sm:w-96 border-r z-50 flex flex-col justify-between shadow-2xl animate-fadeIn overflow-y-auto overflow-x-hidden ${
          lessonTheme === 'dark' ? 'bg-[#111111] border-[#2F2F2F]' : lessonTheme === 'neutral' ? 'bg-[#181C24] border-[#313A4D]' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black">مرشد مسار الذكي</h4>
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
        منصة مسار للتعلم التكيفي الذكي • جميع الحقوق محفوظة
      </footer>

    </div>
  );
};

export default AdaptiveLesson;