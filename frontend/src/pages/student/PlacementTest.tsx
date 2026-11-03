import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Trophy, 
  Code2, 
  Zap, 
  BookOpen, 
  Lock, 
  GitBranch, 
  ChevronLeft, 
  Info, 
  RotateCcw,
  Menu,
  X,
  Home,
  TrendingUp,
  User,
  Settings
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

interface SubTopic {
  id: string;
  name: string;
  difficulty: 'سهل' | 'متوسط' | 'متقدم';
}

interface ConceptNode {
  id: number;
  title: string;
  summary: string;
  categoryLevel: 'تأسيسي' | 'بنائي' | 'متقدم';
  subTopics: SubTopic[];
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
  const [selectedResultNode, setSelectedResultNode] = useState<ConceptNode | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // عناصر القائمة الجانبية الموحدة
  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, action: onCancel },
    { id: 'courses', label: 'المقررات الدراسية', icon: BookOpen, action: onCancel },
    { id: 'achievements', label: 'إنجازاتي', icon: Trophy, action: onCancel },
    { id: 'progress', label: 'تقدمي الدراسي', icon: TrendingUp, action: onCancel },
    { id: 'profile', label: 'الملف الشخصي', icon: User, action: onCancel },
    { id: 'settings', label: 'الإعدادات', icon: Settings, action: onCancel },
  ];

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

  // شجرة مفاهيم متكيفة ديناميكياً بحسب المقرر المختار
  const getCourseConceptTree = (): ConceptNode[] => {
    if (courseTitle.includes('الذكاء الاصطناعي') || courseTitle.toLowerCase().includes('ai')) {
      return [
        {
          id: 1,
          title: 'بنية نماذج اللغات الضخمة LLM',
          summary: 'فهم التوكينز (Tokens) وسياق الانتباه ومعاملات التوليد.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'ai1_1', name: 'تقطيع النصوص (Tokenization & Vocab)', difficulty: 'سهل' },
            { id: 'ai1_2', name: 'معاملات التحكم (Temperature, Top-P)', difficulty: 'متوسط' },
            { id: 'ai1_3', name: 'النوافذ السياقية وحجم الذاكرة (Context Window)', difficulty: 'متوسط' }
          ]
        },
        {
          id: 2,
          title: 'هندسة الأوامر الأساسية',
          summary: 'التحكم بالاستجابة وصياغة أدوار النظام وقوالب التوجيه.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'ai2_1', name: 'تقنيات Zero-Shot و Few-Shot', difficulty: 'سهل' },
            { id: 'ai2_2', name: 'تعليمات النظام وتحديد الأدوار (System Role)', difficulty: 'سهل' },
            { id: 'ai2_3', name: 'التوليد بصيغ مهيكلة (JSON Outputs)', difficulty: 'متوسط' }
          ]
        },
        {
          id: 3,
          title: 'التفكير المتسلسل واستدعاء الدوال',
          summary: 'توجيه النموذج للتفكير خطوة بخطوة وربطه بالأدوات الخارجية.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'ai3_1', name: 'سلسلة التفكير (Chain of Thought - CoT)', difficulty: 'متوسط' },
            { id: 'ai3_2', name: 'إطار عمل التفكير والتنفيذ (ReAct Framework)', difficulty: 'متقدم' },
            { id: 'ai3_3', name: 'استدعاء الدوال البرمجية (Function Calling)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 4,
          title: 'التضمينات والبحث الدلالي',
          summary: 'تمثيل المعرفة بالنواقل الرقمية للبحث المتشابه في المعنى.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'ai4_1', name: 'المتجهات الدلالية (Vector Embeddings)', difficulty: 'متوسط' },
            { id: 'ai4_2', name: 'قياس التشابه الزاوي (Cosine Similarity)', difficulty: 'متوسط' },
            { id: 'ai4_3', name: 'قواعد البيانات الشعاعية (Vector Databases)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 5,
          title: 'معمارية التوليد المعزز بالاسترجاع RAG',
          summary: 'ربط النماذج الذكية ببياناتك ومستنداتك الخاصة بدقة.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'ai5_1', name: 'تقطيع وفهرسة الوثائق (Chunking Strategies)', difficulty: 'متوسط' },
            { id: 'ai5_2', name: 'حقن السياق المسترجع (Context Injection)', difficulty: 'متقدم' },
            { id: 'ai5_3', name: 'إعادة الترتيب والتقييم (Reranking & HyDE)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 6,
          title: 'حماية الأمان ومنع الهلوسة',
          summary: 'تحصين التطبيقات ضد الاختراق وحقن الأوامر والتحقق من الحقائق.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'ai6_1', name: 'كشف وضبط الهلوسة (Hallucination Guardrails)', difficulty: 'متوسط' },
            { id: 'ai6_2', name: 'التصدي لاختراق الأوامر (Prompt Injection)', difficulty: 'متقدم' },
            { id: 'ai6_3', name: 'تقييم جودة النماذج (RAG Triad & Benchmarking)', difficulty: 'متقدم' }
          ]
        }
      ];
    }

    if (courseTitle.includes('OOP') || courseTitle.toLowerCase().includes('oop')) {
      return [
        {
          id: 1,
          title: 'الفئات والكائنات التأسيسية',
          summary: 'صياغة المخططات البرمجية وتوليد الكائنات المستقلة.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'o1_1', name: 'بناء الفئات وإنشاء الكائنات (Class & Object)', difficulty: 'سهل' },
            { id: 'o1_2', name: 'دالة البناء وتمرير الذات (__init__ & self)', difficulty: 'سهل' },
            { id: 'o1_3', name: 'متغيرات الكائن مقابل متغيرات الفئة', difficulty: 'متوسط' }
          ]
        },
        {
          id: 2,
          title: 'التغليف وحماية الحالة الداخلية',
          summary: 'منع التعديل المباشر وتقييد الوصول لسلامة البيانات.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'o2_1', name: 'الخصائص الخاصة والعامة (Public vs Private)', difficulty: 'سهل' },
            { id: 'o2_2', name: 'دوال القراءة والتعديل الموجهة (@property Get/Set)', difficulty: 'متوسط' },
            { id: 'o2_3', name: 'حماية وتغليف المنطق التشغيلي', difficulty: 'متوسط' }
          ]
        },
        {
          id: 3,
          title: 'الوراثة وإعادة استخدام الأكواد',
          summary: 'اشتقاق فئات مخصصة من فئات أساسية لمنع التكرار.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'o3_1', name: 'الوراثة الفردية وتمرير الخصائص', difficulty: 'سهل' },
            { id: 'o3_2', name: 'استدعاء دالة الأصل عبر super()', difficulty: 'متوسط' },
            { id: 'o3_3', name: 'إعادة تعريف التوابع (Method Overriding)', difficulty: 'متوسط' }
          ]
        },
        {
          id: 4,
          title: 'تعدد الأشكال وسلوكيات الواجهات',
          summary: 'تنفيذ سلوكيات متباينة عبر واجهة برمجية موحدة.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'o4_1', name: 'مبدأ Duck Typing في بايثون', difficulty: 'متوسط' },
            { id: 'o4_2', name: 'الدوال السحرية وتحميل المشغلات (Dunder Methods)', difficulty: 'متقدم' },
            { id: 'o4_3', name: 'التفاعل الموحد مع كائنات متنوعة', difficulty: 'متقدم' }
          ]
        },
        {
          id: 5,
          title: 'التجريد وبناء العقود البرمجية',
          summary: 'إلزام الفئات المشتقة بهيكل محدد دون الخوض في تفاصيلها.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'o5_1', name: 'الفئات المجردة عبر مكتبة abc', difficulty: 'متوسط' },
            { id: 'o5_2', name: 'المحددات المجردة (@abstractmethod)', difficulty: 'متقدم' },
            { id: 'o5_3', name: 'فصل الواجهة عن التنفيذ الميداني', difficulty: 'متقدم' }
          ]
        },
        {
          id: 6,
          title: 'مبادئ التصميم النظيف SOLID',
          summary: 'معايير هندسة البرمجيات لبناء نظم مرنة وقابلة للتوسع والصيانة.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'o6_1', name: 'المسؤولية الواحدة والفتح/الإغلاق (SRP & OCP)', difficulty: 'متقدم' },
            { id: 'o6_2', name: 'مبدأ استبدال لسكوف وفصل الواجهات (LSP & ISP)', difficulty: 'متقدم' },
            { id: 'o6_3', name: 'عكس الاعتماديات واستقلالية الوحدات (DIP)', difficulty: 'متقدم' }
          ]
        }
      ];
    }

    return [
      {
        id: 1,
        title: 'الذاكرة والمتغيرات الديناميكية',
        summary: 'فهم حجز الذاكرة Heap & Stack وعناوين المراجع وتعدد الأنواع.',
        categoryLevel: 'تأسيسي',
        subTopics: [
          { id: 'p1_1', name: 'إسناد المتغيرات والمراجع (References)', difficulty: 'سهل' },
          { id: 'p1_2', name: 'الأنواع التأسيسية (int, float, str, bool)', difficulty: 'سهل' },
          { id: 'p1_3', name: 'التحويل بين الأنواع (Type Casting)', difficulty: 'متوسط' },
          { id: 'p1_4', name: 'العمليات الحسابية والمنطقية المدمجة', difficulty: 'سهل' }
        ]
      },
      {
        id: 2,
        title: 'منطق التحكم وتدفق التنفيذ',
        summary: 'بناء المنطق الشرطي والتكرار التراكمي وإدارة مسار التنفيذ.',
        categoryLevel: 'تأسيسي',
        subTopics: [
          { id: 'p2_1', name: 'الشروط المركبة (If-Elif-Else)', difficulty: 'سهل' },
          { id: 'p2_2', name: 'تكرار النطاق مع حلقات For Loop', difficulty: 'متوسط' },
          { id: 'p2_3', name: 'الحلقات المفتوحة وحالات While Loops', difficulty: 'متوسط' },
          { id: 'p2_4', name: 'أوامر التحكم (Break, Continue, Pass)', difficulty: 'سهل' }
        ]
      },
      {
        id: 3,
        title: 'هياكل البيانات المتسلسلة',
        summary: 'إدارة المجموعات المرتبة، والتقطيع والفهرسة والتعديل المباشر.',
        categoryLevel: 'بنائي',
        subTopics: [
          { id: 'p3_1', name: 'القوائم الديناميكية وعملياتها (Lists)', difficulty: 'متوسط' },
          { id: 'p3_2', name: 'الصفوف غير القابلة للتعديل (Tuples)', difficulty: 'سهل' },
          { id: 'p3_3', name: 'تقطيع وفهرسة السلاسل (Slicing)', difficulty: 'متوسط' },
          { id: 'p3_4', name: 'توليد القوائم المضغوط (Comprehensions)', difficulty: 'متقدم' }
        ]
      },
      {
        id: 4,
        title: 'القواميس والجداول الترابطية',
        summary: 'تنظيم البيانات بواسطة جداول الهاش (Hash Maps) والمجموعات الفريدة.',
        categoryLevel: 'بنائي',
        subTopics: [
          { id: 'p4_1', name: 'القواميس المعتمدة على المفاتيح (Key-Value)', difficulty: 'متوسط' },
          { id: 'p4_2', name: 'القواميس المتداخلة واستخراج البيانات', difficulty: 'متقدم' },
          { id: 'p4_3', name: 'المجموعات الفريدة والعمليات الجبرية (Sets)', difficulty: 'متوسط' }
        ]
      },
      {
        id: 5,
        title: 'الدوال والبرمجة التركيبية',
        summary: 'هندسة الأكواد القابلة لإعادة الاستخدام وإدارة نطاق المتغيرات.',
        categoryLevel: 'متقدم',
        subTopics: [
          { id: 'p5_1', name: 'تعريف الدوال وتمرير المعاملات (Def & Args)', difficulty: 'متوسط' },
          { id: 'p5_2', name: 'المعاملات الديناميكية (*args & **kwargs)', difficulty: 'متقدم' },
          { id: 'p5_3', name: 'نطاق المتغيرات وقواعد Scope (LEGB)', difficulty: 'متقدم' },
          { id: 'p5_4', name: 'الدوال المجهولة والمصغرة (Lambda)', difficulty: 'متقدم' }
        ]
      },
      {
        id: 6,
        title: 'إدارة الملفات وحماية الأخطاء',
        summary: 'معالجة الاستثناءات وقت التشغيل والتعامل مع الملفات الخارجية.',
        categoryLevel: 'متقدم',
        subTopics: [
          { id: 'p6_1', name: 'اصطياد الأخطاء (Try-Except-Finally)', difficulty: 'متوسط' },
          { id: 'p6_2', name: 'القراءة والكتابة في الملفات (File I/O)', difficulty: 'متوسط' },
          { id: 'p6_3', name: 'بناء واستيراد الحزم والمكتبات (Modules)', difficulty: 'متقدم' }
        ]
      }
    ];
  };

  const activeConceptTree = getCourseConceptTree();
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const determineLevel = (finalScore: number): 'مبتدئ' | 'متوسط' | 'متقدم' => {
    const percentage = (finalScore / questions.length) * 100;
    if (percentage >= 80) return 'متقدم';
    if (percentage >= 50) return 'متوسط';
    return 'مبتدئ';
  };

  const getStartingConceptIndex = (level: 'مبتدئ' | 'متوسط' | 'متقدم'): number => {
    if (level === 'متقدم') return 4;
    if (level === 'متوسط') return 2;
    return 0;
  };

  // دالة إعادة الاختبار بالكامل
  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setXp(0);
    setShowResult(false);
    setSelectedResultNode(null);
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
      const calculatedLevel = determineLevel(newScore);
      const startIdx = getStartingConceptIndex(calculatedLevel);
      setSelectedResultNode(activeConceptTree[startIdx] || activeConceptTree[0]);
      setShowResult(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 overflow-x-hidden relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية النقاط المضيئة */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />

      {/* هالات الإضاءة الذهبية */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFCB74]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      {/* ستارة التعتيم عند فتح السايد بار */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}

      {/* السايد بار الموحد لجميع الواجهات */}
      <aside 
        className={`fixed top-0 right-0 h-full w-72 border-l z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between py-6 px-5 shadow-2xl bg-white dark:bg-[#111111] border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-[#111111] dark:text-[#FFFFFF] ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
            <div className="flex items-center gap-3">
              <PlatformLogo size={42} />
              <div>
                <span className="text-base font-black text-[#111111] dark:text-[#FFCB74] tracking-wider block leading-tight">إديوتك</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">EDUTECH</span>
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
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    item.action();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2F2F2F]"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="text-[11px] text-center border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F] pt-4 text-gray-500 dark:text-gray-400">
          منصة إديوتك للتعلم التكيفي الذكي
        </div>
      </aside>

      {/* الهيدر الثابت الموحد عبر المنصة مزود بزر السايدبار واللوجو */}
      <header className="fixed top-0 inset-x-0 w-full flex items-center justify-between px-6 sm:px-10 py-3.5 border-b z-40 backdrop-blur-md transition-colors bg-white/95 dark:bg-[#111111]/85 border-[#2F2F2F]/20 dark:border-[#2F2F2F] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer bg-white dark:bg-[#2F2F2F] border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74] text-[#111111] dark:text-[#FFCB74] shadow-xs"
            title="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div onClick={onCancel} className="flex items-center gap-2.5 cursor-pointer">
            <PlatformLogo size={36} />
            <div className="text-right">
              <h2 className="text-sm font-bold leading-tight text-[#111111] dark:text-white">
                منصة إديوتك الذكية
              </h2>
              <p className="text-[10px] text-[#FFCB74] font-medium tracking-wide">EduTech</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFCB74]/15 border border-[#FFCB74]/40 text-[#111111] dark:text-[#FFCB74] text-xs font-bold">
          <span>اختبار تحديد المستوى</span>
          <span className="text-[10px] opacity-70">({courseTitle})</span>
        </div>
      </header>

      {/* محتوى الاختبار مع مسافة علوية pt-24 */}
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

        {/* جسم الاختبار بحجم رشيق ومتناسق موحد */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 z-10 flex flex-col justify-center">
          
          {!showResult ? (
            <div className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl transition-all">
              
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
            /* ================= شاشة النتيجة بأبعاد متناسقة وخيارات تنقل مرنة ================= */
            <div className="bg-white dark:bg-[#1a1a1a] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-2xl animate-fadeIn">
              
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-[#FFCB74] flex items-center justify-center text-[#111111] mx-auto mb-2.5 shadow-[0_0_20px_rgba(255,203,116,0.4)]">
                  <Trophy className="w-6 h-6" />
                </div>
                <h2 className="text-lg lg:text-xl font-black text-[#111111] dark:text-white mb-1">
                  اكتمل الاختبار التشخيصي وتم تحديد موضعك المعرفي!
                </h2>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  تم إسقاط مستواك الحالي مباشرة على شجرة مفاهيم المقرر لتحديد نقطة انطلاقك التكيفية[cite: 16].
                </p>
              </div>

              {/* بطاقات المؤشرات الثلاثية المدمجة */}
              <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto mb-5 text-center">
                <div className="bg-[#F6F6F6] dark:bg-[#141414] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-xl p-2.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">الدرجة</span>
                  <span className="text-sm font-extrabold text-[#111111] dark:text-white">{score} / {questions.length}</span>
                </div>
                <div className="bg-[#F6F6F6] dark:bg-[#141414] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-xl p-2.5">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 block mb-0.5">الخبرة</span>
                  <span className="text-sm font-extrabold text-[#FFCB74]">+{xp} XP</span>
                </div>
                <div className="bg-[#FFCB74]/15 border border-[#FFCB74]/40 rounded-xl p-2.5">
                  <span className="text-[10px] text-[#FFCB74] font-bold block mb-0.5">المستوى</span>
                  <span className="text-sm font-black text-[#111111] dark:text-white">{determineLevel(score)}</span>
                </div>
              </div>

              {/* الشجرة الرشيقة بحجم محكم وموحد لجميع البطاقات */}
              <div className="border border-[#2F2F2F]/20 dark:border-[#2F2F2F] rounded-2xl overflow-hidden mb-5 flex flex-col shadow-inner">
                
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F] bg-[#F6F6F6] dark:bg-[#141414]">
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#FFCB74]" />
                    <span className="text-xs font-black text-[#111111] dark:text-white">
                      شجرة المفاهيم: <span className="text-[#FFCB74]">{courseTitle}</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74]">
                    المسار المخصص: {determineLevel(score)}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row h-[320px]">
                  
                  {/* شجرة المسار الرأسية - بطاقات موحدة الحجم تماماً */}
                  <div className="flex-1 p-3.5 overflow-y-auto flex flex-col items-center justify-start bg-slate-50/50 dark:bg-[#141414]/50 border-b lg:border-b-0 lg:border-l border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                    
                    {/* العقدة الجذرية */}
                    <div className="px-4 py-1.5 rounded-full bg-[#FFCB74] text-[#111111] font-black text-[11px] shadow-xs flex items-center gap-1 border border-white dark:border-[#111111] shrink-0">
                      <Sparkles className="w-3 h-3" />
                      <span>{courseTitle}</span>
                    </div>

                    <div className="w-[2px] h-3.5 bg-[#FFCB74]/70 shrink-0" />

                    {/* عقد المسار موحدة الأبعاد بالكامل */}
                    <div className="w-full max-w-sm flex flex-col items-center">
                      {activeConceptTree.map((node, index) => {
                        const calculatedLevel = determineLevel(score);
                        const startIndex = getStartingConceptIndex(calculatedLevel);

                        const isCurrent = index === startIndex;
                        const isMastered = index < startIndex;
                        const isLocked = index > startIndex;
                        const isSelected = selectedResultNode?.id === node.id;

                        return (
                          <div key={node.id} className="w-full flex flex-col items-center">
                            {index > 0 && (
                              <div className={`w-[2px] h-3.5 shrink-0 transition-colors ${
                                isMastered ? 'bg-emerald-500' : isCurrent ? 'bg-[#FFCB74]' : 'bg-[#2F2F2F]/30 dark:bg-[#2F2F2F]'
                              }`} />
                            )}

                            {/* بطاقة محطة موحدة العرض والارتفاع */}
                            <div
                              onClick={() => setSelectedResultNode(node)}
                              className={`w-full h-12 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shrink-0 ${
                                isSelected
                                  ? 'ring-1.5 ring-[#FFCB74] scale-[1.01] shadow-md'
                                  : 'hover:scale-[1.01]'
                              } ${
                                isCurrent
                                  ? 'bg-[#FFCB74]/15 border-[#FFCB74] shadow-xs'
                                  : isMastered
                                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                  : isLocked
                                  ? 'bg-white/60 dark:bg-[#1a1a1a]/60 border-[#2F2F2F]/20 opacity-60'
                                  : 'bg-white dark:bg-[#242424] border-[#2F2F2F]/20 hover:border-[#FFCB74]'
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                                  isCurrent
                                    ? 'bg-[#FFCB74] text-[#111111]'
                                    : isMastered
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300'
                                }`}>
                                  {isMastered ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : index + 1}
                                </div>

                                <div className="text-right truncate">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <h4 className="text-xs font-black text-[#111111] dark:text-white truncate">
                                      {node.title}
                                    </h4>
                                    <span className="text-[8px] px-1 py-0.2 rounded font-bold bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74] shrink-0">
                                      {node.categoryLevel}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 mr-1">
                                {isCurrent && (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#FFCB74] text-[#111111] whitespace-nowrap shadow-xs">
                                    📍 انطلاقك
                                  </span>
                                )}
                                {isMastered && (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 whitespace-nowrap">
                                    مُتقن
                                  </span>
                                )}
                                {isLocked && <Lock className="w-3 h-3 text-gray-400" />}
                                <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* لوحة التفاصيل الجانبية الفورية بحجم متناسق */}
                  <div className="w-full lg:w-72 p-3.5 overflow-y-auto bg-white dark:bg-[#1a1a1a] flex flex-col justify-between shrink-0 text-right">
                    {selectedResultNode ? (
                      <div>
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#FFCB74]">
                            تفاصيل المحطة
                          </span>
                          <span className="text-[9px] font-mono font-bold text-gray-400">
                            #{selectedResultNode.id}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-[#111111] dark:text-white mb-1">
                          {selectedResultNode.title}
                        </h4>

                        <p className="text-[10px] leading-relaxed text-gray-600 dark:text-gray-300 mb-2.5">
                          {selectedResultNode.summary}
                        </p>

                        <div>
                          <span className="text-[10px] font-black text-[#FFCB74] block mb-1.5 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            <span>المفاهيم المتفرعة:</span>
                          </span>

                          <div className="space-y-1">
                            {selectedResultNode.subTopics.map((topic) => (
                              <div
                                key={topic.id}
                                className="p-1.5 rounded-lg border border-[#2F2F2F]/15 dark:border-[#2F2F2F] bg-slate-50 dark:bg-[#222222] flex items-center justify-between text-[10px]"
                              >
                                <div className="flex items-center gap-1 truncate">
                                  <span className="w-1 h-1 rounded-full bg-[#FFCB74] shrink-0" />
                                  <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                    {topic.name}
                                  </span>
                                </div>
                                <span className={`text-[7px] font-bold px-1 py-0.2 rounded shrink-0 ${
                                  topic.difficulty === 'سهل'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : topic.difficulty === 'متوسط'
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {topic.difficulty}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                        <Info className="w-5 h-5 mb-1 opacity-50" />
                        <span>انقري على أي عقدة لعرض تفاصيلها</span>
                      </div>
                    )}

                    <div className="text-[9px] text-gray-400 pt-2 mt-2 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                      💡 ستبدأ الدراسة مباشرة من المحطة المحددة.
                    </div>
                  </div>

                </div>

              </div>

              {/* أزرار الإجراءات: زر المتابعة، زر إعادة الاختبار، وزر العودة للمقررات لعدم حصر الطالب */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={() => onFinishTest(score, determineLevel(score))}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-full font-black text-[#111111] text-xs bg-[#FFCB74] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>الانتقال لدراسة المفهوم المحدد مباشرة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRetakeTest}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-full font-bold text-xs border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74] hover:bg-[#FFCB74]/10 text-gray-700 dark:text-gray-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة الاختبار</span>
                </button>

                <button
                  onClick={onCancel}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-full font-bold text-xs border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-white/40 hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>العودة لقائمة المقررات</span>
                </button>
              </div>

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