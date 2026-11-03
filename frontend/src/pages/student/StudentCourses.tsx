import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Clock, 
  Award, 
  Sparkles, 
  Play, 
  Code2, 
  BrainCircuit, 
  Database,
  Network,
  X,
  Layers,
  GitBranch,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  Info,
  HelpCircle,
  ArrowLeft,
  Compass,
  RotateCcw,
  Trophy
} from 'lucide-react';

// استيراد الشعار المعتمد
import { PlatformLogo } from '../../components/common/PlatformLogo';

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

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  duration: string;
  lessonsCount: number;
  progress: number;
  icon: any;
  color: string;
  tag: string;
  imageUrl: string;
  mainConcepts: string[];
  conceptTree: ConceptNode[];
}

interface StudentCoursesProps {
  studentLevel?: 'مبتدئ' | 'متوسط' | 'متقدم';
  onBackToDashboard?: () => void;
  onSelectCourse?: (courseId: string, startMode?: 'test' | 'direct_lesson') => void;
}

export const StudentCourses: React.FC<StudentCoursesProps> = ({
  studentLevel,
  onBackToDashboard,
  onSelectCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalCourse, setActiveModalCourse] = useState<Course | null>(null);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const [courseToStart, setCourseToStart] = useState<Course | null>(null);
  const [courseToImprove, setCourseToImprove] = useState<Course | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentStudentLevel = studentLevel || (typeof window !== 'undefined' ? (localStorage.getItem('edutech_student_level') as 'مبتدئ' | 'متوسط' | 'متقدم' | null) : null);

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

  const categories = [
    { id: 'all', label: 'جميع المقررات' },
    { id: 'python', label: 'بايثون والذكاء الاصطناعي' },
    { id: 'web', label: 'تطوير الويب' },
    { id: 'fundamentals', label: 'أساسيات البرمجة' },
    { id: 'algorithms', label: 'خوارزميات وهياكل بيانات' },
  ];

  const courses: Course[] = [
    {
      id: 'python-core',
      title: 'أساسيات البرمجة بلغة Python',
      description: 'تعلم التفكير البرمجي التكيفي وبناء الخوارزميات وحل المشكلات التفاعلية بمساعدة الذكاء الاصطناعي.',
      category: 'python',
      level: 'مبتدئ',
      duration: '32 ساعة',
      lessonsCount: 48,
      progress: 100, // مكتمل وناجح مثلاً بنسبة 90%
      icon: Code2,
      color: '#FFCB74',
      tag: 'مقرر مخصص لكِ',
      imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80',
      mainConcepts: ['المتغيرات والذاكرة', 'التحكم بالتدفق', 'الهياكل الخطية', 'القواميس والخرائط', 'الدوال والمودل', 'معالجة الاستثناءات'],
      conceptTree: [
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
      ]
    },
    {
      id: 'ai-prompt-engineering',
      title: 'الذكاء الاصطناعي وهندسة الأوامر',
      description: 'فهم نماذج الـ LLM وتوظيف واجهات برمجة التطبيقات لبناء حلول ذكية وأدوات تكيفية.',
      category: 'python',
      level: 'متوسط',
      duration: '28 ساعة',
      lessonsCount: 36,
      progress: 20,
      icon: BrainCircuit,
      color: '#E5B158',
      tag: 'شائع الآن',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      mainConcepts: ['معمارية Transformers', 'صياغة الأوامر التأسيسية', 'التفكير الاستدلالي CoT', 'التضمين الشعاعي Embeddings', 'أنظمة RAG المسترجعة', 'تفادي الهلوسة والأمان'],
      conceptTree: [
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
      ]
    },
    {
      id: 'react-frontend',
      title: 'بناء واجهات الويب بـ React & Vite',
      description: 'تصميم واجهات المستخدم العصرية التفاعلية وإدارة الحالة بالاعتماد على أفضل الممارسات.',
      category: 'web',
      level: 'متوسط',
      duration: '36 ساعة',
      lessonsCount: 44,
      progress: 0,
      icon: Sparkles,
      color: '#FFD79A',
      tag: 'جديد',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      mainConcepts: ['مكونات JSX', 'الحالة التفاعلية useState', 'الآثار الجانبية useEffect', 'النماذج والأحداث', 'إدارة الحالة Context API', 'استدعاء الخوادم APIs'],
      conceptTree: [
        {
          id: 1,
          title: 'معمارية المكونات ونظام JSX',
          summary: 'تفكيك الواجهة لمكونات معزولة وتمرير الخصائص (Props).',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'r1_1', name: 'بنية المكونات وتركيب الـ JSX', difficulty: 'سهل' },
            { id: 'r1_2', name: 'تمرير الخصائص والتركيب (Props Composition)', difficulty: 'سهل' },
            { id: 'r1_3', name: 'التصيير الشرطي والقوائم (Conditional Rendering)', difficulty: 'سهل' }
          ]
        },
        {
          id: 2,
          title: 'إدارة الحالة اللحظية useState',
          summary: 'التحكم بالبيانات التفاعلية وإعادة تصيير الواجهة بمرونة.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'r2_1', name: 'مفهوم الحالة وتحديثها (Immutable State)', difficulty: 'سهل' },
            { id: 'r2_2', name: 'رفع الحالة للأعلى (Lifting State Up)', difficulty: 'متوسط' },
            { id: 'r2_3', name: 'الحالة المشتقة وحساب القيم المعقدة', difficulty: 'متوسط' }
          ]
        },
        {
          id: 3,
          title: 'دورة الحياة والأثر الجانبي useEffect',
          summary: 'إدارة المؤقتات، والاشتراكات وتنظيف الموارد الخارجية.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'r3_1', name: 'مصفوفة الاعتماديات (Dependency Array)', difficulty: 'متوسط' },
            { id: 'r3_2', name: 'دوال التنظيف (Cleanup Functions)', difficulty: 'متقدم' },
            { id: 'r3_3', name: 'المراجع المباشرة للعناصر (useRef Hook)', difficulty: 'متوسط' }
          ]
        },
        {
          id: 4,
          title: 'النماذج والتفاعل المتقدم',
          summary: 'بناء استمارات إدخال محكمة والتحقق الفوري من صحة المدخلات.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'r4_1', name: 'المدخلات المتحكم بها (Controlled Inputs)', difficulty: 'سهل' },
            { id: 'r4_2', name: 'إدارة الأخطاء وحالات التحميل', difficulty: 'متوسط' },
            { id: 'r4_3', name: 'بناء الخطافات المخصصة (Custom Hooks)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 5,
          title: 'إدارة الحالة الشاملة Context API',
          summary: 'مشاركة البيانات العامة مثل الثيمات وحسابات المستخدم دون Prop Drilling.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'r5_1', name: 'إنشاء السياق والمزود (CreateContext & Provider)', difficulty: 'متوسط' },
            { id: 'r5_2', name: 'استهلاك البيانات عبر useContext', difficulty: 'متوسط' },
            { id: 'r5_3', name: 'تحسين كفاءة إعادة التصيير (Memoization)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 6,
          title: 'تكامل الخوادم والواجهات الخارجية',
          summary: 'جلب البيانات المتزامنة ومعالجة أخطاء الشبكة بسلاسة.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'r6_1', name: 'استدعاء الـ APIs عبر Fetch & Axios', difficulty: 'متوسط' },
            { id: 'r6_2', name: 'واجهات التحديث المتفائل (Optimistic UI)', difficulty: 'متقدم' },
            { id: 'r6_3', name: 'حدود الأخطاء (Error Boundaries)', difficulty: 'متقدم' }
          ]
        }
      ]
    },
    {
      id: 'dsa-fundamentals',
      title: 'هياكل البيانات والخوارزميات',
      description: 'تحليل التعقيد الحسابي وبناء الهياكل البرمجية الكفؤة لحل المعضلات البرمجية الكبيرة.',
      category: 'algorithms',
      level: 'متقدم',
      duration: '40 ساعة',
      lessonsCount: 50,
      progress: 0,
      icon: Database,
      color: '#B8822B',
      tag: 'مسار معتمد',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      mainConcepts: ['تحليل التعقيد Big-O', 'المصفوفات والقوائم المترابطة', 'المكدسات والطوابير', 'الفرز والبحث الثنائي', 'الأشجار الهرمية BST', 'الرسوم البيانية والمسارات'],
      conceptTree: [
        {
          id: 1,
          title: 'تحليل الكفاءة الرياضية Big-O',
          summary: 'قياس استهلاك الوقت والذاكرة البرمجية نظرياً وميدانياً.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'd1_1', name: 'التعقيد الزمني والمكاني (Time & Space)', difficulty: 'متوسط' },
            { id: 'd1_2', name: 'حالات الكفاءة (Best, Worst, Average Case)', difficulty: 'متوسط' },
            { id: 'd1_3', name: 'التعقيدات الشائعة (O(1), O(n), O(log n))', difficulty: 'سهل' }
          ]
        },
        {
          id: 2,
          title: 'الهياكل الخطية المترابطة',
          summary: 'تنظيم البيانات الخطية بين الذاكرة المتصلة والمؤشرات.',
          categoryLevel: 'تأسيسي',
          subTopics: [
            { id: 'd2_1', name: 'المصفوفات الديناميكية وتكلفة التوسع', difficulty: 'سهل' },
            { id: 'd2_2', name: 'القوائم الأحادية المترابطة (Singly Linked List)', difficulty: 'متوسط' },
            { id: 'd2_3', name: 'القوائم المزدوجة وعمليات المؤشرات', difficulty: 'متقدم' }
          ]
        },
        {
          id: 3,
          title: 'المكدسات والطوابير المنظمة',
          summary: 'تنفيذ مبادئ LIFO و FIFO ومحاكاة مكدس استدعاء البرامج.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'd3_1', name: 'المكدس وتطبيقاته (Stack: Push/Pop)', difficulty: 'سهل' },
            { id: 'd3_2', name: 'الطابور القياسي والدائري (Queue & Deque)', difficulty: 'متوسط' },
            { id: 'd3_3', name: 'مكدس استدعاء الذاكرة (Call Stack Tracing)', difficulty: 'متوسط' }
          ]
        },
        {
          id: 4,
          title: 'خوارزميات الفرز والبحث السريع',
          summary: 'استراتيجيات التقسيم والتغلب وتصغير نطاق البحث.',
          categoryLevel: 'بنائي',
          subTopics: [
            { id: 'd4_1', name: 'البحث الثنائي في المصفوفات المرتبة (O(log n))', difficulty: 'متوسط' },
            { id: 'd4_2', name: 'الفرز بالدمج (Merge Sort)', difficulty: 'متقدم' },
            { id: 'd4_3', name: 'الفرز السريع واختيار المحور (Quick Sort)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 5,
          title: 'الهياكل الشجرية وأشجار البحث',
          summary: 'تنظيم المعرفة هرمياً للوصول اللوغاريتمي الفائق.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'd5_1', name: 'أشجار البحث الثنائية (Binary Search Tree - BST)', difficulty: 'متقدم' },
            { id: 'd5_2', name: 'طرق الاجتياز الشجري (In-order, Pre-order, Post-order)', difficulty: 'متوسط' },
            { id: 'd5_3', name: 'أشجار التوازن الذاتي (Balanced Trees Concept)', difficulty: 'متقدم' }
          ]
        },
        {
          id: 6,
          title: 'الرسوم البيانية وشبكات المسارات',
          summary: 'نمذجة العلاقات الشبكية واكتشاف أقصر الطرق.',
          categoryLevel: 'متقدم',
          subTopics: [
            { id: 'd6_1', name: 'تمثيل الرسوم البيانية (Adjacency Matrix & List)', difficulty: 'متوسط' },
            { id: 'd6_2', name: 'البحث العرضي والعمقي (BFS & DFS)', difficulty: 'متقدم' },
            { id: 'd6_3', name: 'خوارزمية ديكسترا لأقصر مسار (Dijkstra Algorithm)', difficulty: 'متقدم' }
          ]
        }
      ]
    },
    {
      id: 'oop-architecture',
      title: 'البرمجة كائنية التوجه OOP',
      description: 'إتقان مبادئ OOP ومفاهيم التصميم النظيف لكتابة نظم برمجية قوية وقابلة للتوسع.',
      category: 'fundamentals',
      level: 'متوسط',
      duration: '30 ساعة',
      lessonsCount: 38,
      progress: 0,
      icon: Layers,
      color: '#FFCB74',
      tag: 'أساسيات هندسية',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      mainConcepts: ['الفئات والكائنات', 'التغليف وحماية البيانات', 'الوراثة والتوسع', 'تعدد الأشكال Polymorphism', 'التجريد والواجهات', 'مبادئ SOLID المعمارية'],
      conceptTree: [
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
      ]
    }
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStartingConceptIndex = (level: 'مبتدئ' | 'متوسط' | 'متقدم' | null): number | null => {
    if (!level) return null;
    if (level === 'متقدم') return 4;
    if (level === 'متوسط') return 2;
    return 0;
  };

  useEffect(() => {
    if (activeModalCourse) {
      const startIndex = getStartingConceptIndex(currentStudentLevel);
      const defaultIndex = startIndex !== null ? startIndex : 0;
      setSelectedNode(activeModalCourse.conceptTree[defaultIndex] || activeModalCourse.conceptTree[0]);
    } else {
      setSelectedNode(null);
    }
  }, [activeModalCourse]);

  return (
    <div className="w-full min-h-screen bg-[#F6F6F6] dark:bg-[#111111] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans selection:bg-[#FFCB74]/30 relative transition-colors duration-300" dir="rtl">
      
      {/* خلفية النقاط المضيئة */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-75" />

      {/* هالات إضاءة ذهبية ناعمة */}
      <div className="fixed top-1/3 -right-20 w-[450px] h-[450px] bg-[#FFCB74]/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 -left-20 w-[400px] h-[400px] bg-[#FFCB74]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 lg:px-10 py-6 z-10">
        
        {/* عنوان الصفحة وحقل البحث */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-1.5 bg-[#FFCB74]/20 border border-[#FFCB74]/40 text-[#111111] dark:text-[#FFCB74] shadow-xs">
              <Sparkles className="w-3 h-3 text-[#FFCB74]" />
              <span>محتوى تعليمي يتكيف مع تقدمك الفعلي</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-[#111111] dark:text-[#FFFFFF]">
              اختر المقرر وابدأ خطوتك القادمة
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-[#FFCB74]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مقرر أو موضوع..."
                className="w-full rounded-xl pr-9 pl-3 py-1.5 text-xs outline-none transition-all bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] focus:border-[#FFCB74] text-[#111111] dark:text-[#FFFFFF] placeholder-gray-400 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#FFCB74] text-[#111111] shadow-[0_0_12px_rgba(255,203,116,0.35)] font-black'
                      : 'bg-white dark:bg-[#2F2F2F] text-gray-600 dark:text-gray-300 hover:text-[#111111] dark:hover:text-white border border-[#2F2F2F]/15 dark:border-[#2F2F2F] shadow-xs'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* شبكة كروت المقررات بأبعاد مدمجة وطبيعية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const Icon = course.icon;
            const hasStarted = course.progress > 0;
            const isCompleted = course.progress >= 100;

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-[#2F2F2F] border border-[#2F2F2F]/15 dark:border-[#2F2F2F] hover:border-[#FFCB74] dark:hover:border-[#FFCB74] rounded-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* 1. البانر الصوري الرشيق والمدمج */}
                <div className="relative w-full h-20 overflow-hidden shrink-0">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-75"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-[#2F2F2F] dark:via-[#2F2F2F]/60 dark:to-transparent" />

                  {/* وسام المقرر والأيقونة */}
                  <div className="absolute top-2 inset-x-2.5 flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/90 dark:bg-[#111111]/85 backdrop-blur-md border border-[#FFCB74]/40 text-[#FFCB74] shadow-xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/90 dark:bg-[#111111]/85 backdrop-blur-md border border-[#FFCB74]/40 text-[#111111] dark:text-[#FFCB74]">
                      {course.tag}
                    </span>
                  </div>
                </div>

                {/* 2. محتوى الكرت المدمج */}
                <div className="p-3.5 pt-0.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-black mb-1 transition-colors text-[#111111] dark:text-[#FFFFFF] group-hover:text-[#FFCB74] line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-[10px] leading-relaxed mb-2 text-gray-600 dark:text-gray-400 font-medium line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mb-2.5">
                      <span className="text-[9px] font-bold block mb-1 text-[#FFCB74]">
                        المفاهيم المغطاة:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {course.mainConcepts.slice(0, 3).map((concept, idx) => (
                          <span 
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded border font-medium bg-[#F6F6F6] dark:bg-[#111111]/50 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-700 dark:text-gray-300"
                          >
                            {concept}
                          </span>
                        ))}
                        {course.mainConcepts.length > 3 && (
                          <span className="text-[9px] px-1 text-gray-400 font-bold self-center">
                            +{course.mainConcepts.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* شريط الإحصائيات */}
                    <div className="flex items-center justify-between text-[10px] mb-2 border-y py-1 border-[#2F2F2F]/15 dark:border-[#2F2F2F] text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FFCB74]" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#FFCB74]" />
                        <span>{course.lessonsCount} درساً</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#FFCB74]" />
                        <span>{course.level}</span>
                      </div>
                    </div>

                    {/* شريط الإنجاز وإبراز درجة النجاح إذا اكتمل المقرر */}
                    {hasStarted ? (
                      <div className="mb-2">
                        <div className="flex justify-between items-center text-[9px] mb-0.5">
                          <span className="text-gray-500 dark:text-gray-400 font-bold">
                            {isCompleted ? 'درجة الإتقان الحالية' : 'الإنجاز'}
                          </span>
                          <span className="font-extrabold text-[#FFCB74]">
                            {isCompleted ? '90% (ناجح ومُعتمد)' : `${course.progress}%`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-[#111111]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-[#FFCB74]'}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {/* أزرار الإجراءات مع دعم ميزة تحسين الدرجة لـ 100% */}
                    <div className="grid grid-cols-12 gap-1.5">
                      {isCompleted ? (
                        <>
                          <button
                            onClick={() => setCourseToImprove(course)}
                            className="col-span-7 py-1.5 px-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-[1.02] active:scale-95"
                            title="إعادة الأنشطة لرفع درجتك إلى 100%"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>تحسين الدرجة لـ 100%</span>
                          </button>

                          <button
                            onClick={() => setActiveModalCourse(course)}
                            className="col-span-5 py-1.5 px-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 bg-[#F6F6F6] dark:bg-[#111111]/40 text-[#111111] dark:text-[#FFCB74] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74]"
                          >
                            <Network className="w-3 h-3 text-[#FFCB74]" />
                            <span>شجرة المفاهيم</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setCourseToStart(course)}
                            className="col-span-6 py-1.5 px-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer bg-[#FFCB74] text-[#111111] shadow-xs hover:scale-[1.02] active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{hasStarted ? 'متابعة' : 'بدء المقرر'}</span>
                          </button>

                          <button
                            onClick={() => setActiveModalCourse(course)}
                            className="col-span-6 py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 bg-[#F6F6F6] dark:bg-[#111111]/40 text-[#111111] dark:text-[#FFCB74] border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74]"
                          >
                            <Network className="w-3 h-3 text-[#FFCB74]" />
                            <span>شجرة المفاهيم</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* ================= نافذة تحسين الدرجة إلى 100% للمقررات المكتملة ================= */}
      {courseToImprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white dark:bg-[#1e1e1e] border border-[#FFCB74]/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-center">
            
            <button
              onClick={() => setCourseToImprove(null)}
              className="absolute top-4 left-4 w-7 h-7 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 text-gray-500 dark:text-gray-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74] mx-auto mb-3">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#111111] dark:text-white mb-1.5">
              تحسين درجة الإتقان: <span className="text-[#FFCB74]">{courseToImprove.title}</span>
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
              لقد اجتزتِ هذا المقرر بنجاح محققة درجة <strong>90%</strong>. يمكنك الآن إعادة دراسة المفاهيم وخوض التقييم مجدداً لتحقيق الدرجة الكاملة <strong>100%</strong> وتحديث وثيقة إتقانك دون أن تفقدي نتيجتك الحالية.
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => {
                  const id = courseToImprove.id;
                  setCourseToImprove(null);
                  if (onSelectCourse) onSelectCourse(id, 'direct_lesson');
                }}
                className="py-2.5 px-6 rounded-xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>بدء تحسين الدرجة إلى 100%</span>
              </button>

              <button
                onClick={() => setCourseToImprove(null)}
                className="py-2.5 px-4 rounded-xl font-bold text-xs border border-white/20 hover:border-[#FFCB74] text-gray-500 dark:text-gray-300 transition-all cursor-pointer"
              >
                إلغاء والاحتفاظ بدرجتي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= نافذة تحديد طريقة البدء ================= */}
      {courseToStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="bg-white dark:bg-[#1e1e1e] border border-[#FFCB74]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-center">
            
            <button
              onClick={() => setCourseToStart(null)}
              className="absolute top-4 left-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-gray-100 dark:bg-[#2c2c2c] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] text-gray-500 dark:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#FFCB74] mx-auto mb-4 shadow-sm">
              <Compass className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-[#111111] dark:text-white mb-2">
              كيف تود أن تبدأ في مقرر: <span className="text-[#FFCB74]">{courseToStart.title}</span>؟
            </h3>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              اختر المسار المناسب لخبرتك السابقة لضمان تجربة تعليمية تكيفية مريحة ومخصصة لك.
            </p>

            <div className="grid grid-cols-1 gap-3.5 mb-5 text-right">
              <button
                onClick={() => {
                  const id = courseToStart.id;
                  setCourseToStart(null);
                  if (onSelectCourse) onSelectCourse(id, 'direct_lesson');
                }}
                className="p-4 rounded-2xl border border-[#2F2F2F]/20 dark:border-[#2F2F2F] hover:border-[#FFCB74] bg-[#F6F6F6] dark:bg-[#252525] hover:bg-[#FFCB74]/10 transition-all cursor-pointer group flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h4 className="text-xs sm:text-sm font-black text-[#111111] dark:text-white group-hover:text-[#FFCB74]">
                      البدء من الصفر تماماً (مبتدئ)
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pr-4">
                    مناسب لمن ليس لديه أي خلفية برمجية سابقة ويريد التأسيس خطوة بخطوة من أول بطاقة بدون اختبار.
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-[#FFCB74] group-hover:-translate-x-1 transition-transform shrink-0 mt-2" />
              </button>

              <button
                onClick={() => {
                  const id = courseToStart.id;
                  setCourseToStart(null);
                  if (onSelectCourse) onSelectCourse(id, 'test');
                }}
                className="p-4 rounded-2xl border-2 border-[#FFCB74]/40 hover:border-[#FFCB74] bg-[#FFCB74]/15 hover:bg-[#FFCB74]/25 transition-all cursor-pointer group flex items-start justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#FFCB74] animate-ping" />
                    <h4 className="text-xs sm:text-sm font-black text-[#111111] dark:text-white">
                      إجراء فحص تشخيصي لتحديد المستوى (موصى به)
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed pr-4">
                    مناسب لمن لديه معرفة سابقة ويريد تجاوز المفاهيم التي يعرفها بالفعل والبدء من نقطة متقدمة تناسبه.
                  </p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#FFCB74] group-hover:-translate-x-1 transition-transform shrink-0 mt-2" />
              </button>
            </div>

            <button
              onClick={() => setCourseToStart(null)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-bold"
            >
              إلغاء والعودة للمقررات
            </button>
          </div>
        </div>
      )}

      {/* ================= النافذة المنبثقة لشجرة المفاهيم التفاعلية ================= */}
      {activeModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            className="border rounded-3xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden transition-all duration-300 bg-white dark:bg-[#1a1a1a] border-[#2F2F2F]/20 dark:border-[#2F2F2F] shadow-2xl"
            dir="rtl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F] bg-[#F6F6F6] dark:bg-[#141414] shrink-0">
              <div className="flex items-center gap-3">
                <PlatformLogo size={36} />
                <div>
                  <h3 className="text-sm sm:text-base font-black flex items-center gap-2 text-[#111111] dark:text-white">
                    <span>خارطة المعرفة التكيفية:</span>
                    <span className="text-[#FFCB74]">{activeModalCourse.title}</span>
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {currentStudentLevel 
                      ? `تم ضبط مسارك التكيفي الحالي وفق نتيجة الاختبار: ${currentStudentLevel}` 
                      : 'اضغطي على أي محطة لاستعراض تفاصيلها ومفاهيمها الفرعية'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalCourse(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer bg-gray-100 dark:bg-[#252525] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto overflow-x-auto flex flex-col items-center justify-start bg-slate-50/50 dark:bg-[#141414]/50 border-b lg:border-b-0 lg:border-l border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                <div className="px-6 py-2.5 rounded-full bg-[#FFCB74] text-[#111111] font-black text-xs shadow-md flex items-center gap-2 border-2 border-white dark:border-[#111111] shrink-0">
                  <Sparkles className="w-4 h-4" />
                  <span>{activeModalCourse.title}</span>
                </div>

                <div className="w-[2px] h-6 bg-[#FFCB74]/70" />

                <div className="w-full max-w-2xl flex flex-col items-center">
                  {activeModalCourse.conceptTree.map((node, index) => {
                    const startIndex = getStartingConceptIndex(currentStudentLevel);
                    const hasTested = startIndex !== null;
                    const isCurrent = hasTested && index === startIndex;
                    const isMastered = hasTested && index < startIndex;
                    const isLocked = hasTested && index > startIndex;
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <div key={node.id} className="w-full flex flex-col items-center">
                        {index > 0 && (
                          <div className={`w-[2px] h-6 transition-colors ${
                            isMastered ? 'bg-emerald-500' : isCurrent ? 'bg-[#FFCB74]' : 'bg-[#2F2F2F]/30 dark:bg-[#2F2F2F]'
                          }`} />
                        )}

                        <div
                          onClick={() => setSelectedNode(node)}
                          className={`w-full max-w-lg p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'ring-2 ring-[#FFCB74] scale-[1.02] shadow-lg'
                              : 'hover:scale-[1.01]'
                          } ${
                            isCurrent
                              ? 'bg-[#FFCB74]/15 border-[#FFCB74] shadow-[0_0_20px_rgba(255,203,116,0.3)]'
                              : isMastered
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                              : isLocked
                              ? 'bg-white/60 dark:bg-[#1a1a1a]/60 border-[#2F2F2F]/20 opacity-60'
                              : 'bg-white dark:bg-[#242424] border-[#2F2F2F]/20 hover:border-[#FFCB74]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 shadow-xs ${
                              isCurrent
                                ? 'bg-[#FFCB74] text-[#111111]'
                                : isMastered
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 dark:bg-[#333333] text-gray-600 dark:text-gray-300'
                            }`}>
                              {isMastered ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : index + 1}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-black text-[#111111] dark:text-white">
                                  {node.title}
                                </h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74]">
                                  {node.categoryLevel}
                                </span>
                              </div>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                                {node.subTopics.length} مفاهيم فرعية مبرمجة
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FFCB74] text-[#111111] animate-pulse whitespace-nowrap shadow-xs">
                                📍 نقطة انطلاقك
                              </span>
                            )}
                            {isMastered && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 whitespace-nowrap">
                                مُتقن ومُجتاز
                              </span>
                            )}
                            {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            <ChevronLeft className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-96 p-5 sm:p-6 overflow-y-auto bg-white dark:bg-[#1a1a1a] flex flex-col justify-between shrink-0">
                {selectedNode ? (
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#FFCB74]/20 text-[#FFCB74] border border-[#FFCB74]/30">
                        تفاصيل المحطة المعرفية
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-400">
                        Node #{selectedNode.id}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-[#111111] dark:text-white mb-2">
                      {selectedNode.title}
                    </h4>

                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 mb-5">
                      {selectedNode.summary}
                    </p>

                    <div>
                      <span className="text-xs font-black text-[#FFCB74] block mb-2.5 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>المفاهيم والتطبيقات المتفرعة:</span>
                      </span>

                      <div className="space-y-2">
                        {selectedNode.subTopics.map((topic) => (
                          <div
                            key={topic.id}
                            className="p-2.5 rounded-xl border border-[#2F2F2F]/15 dark:border-[#2F2F2F] bg-slate-50 dark:bg-[#222222] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB74]" />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {topic.name}
                              </span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
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
                    <Info className="w-8 h-8 mb-2 opacity-50" />
                    <span>انقري على أي عقدة في الشجرة لعرض تفاصيلها</span>
                  </div>
                )}

                <div className="pt-4 mt-6 border-t border-[#2F2F2F]/15 dark:border-[#2F2F2F]">
                  <button
                    onClick={() => {
                      const course = activeModalCourse;
                      setActiveModalCourse(null);
                      setCourseToStart(course);
                    }}
                    className="w-full py-3 px-6 rounded-2xl font-black text-xs bg-[#FFCB74] text-[#111111] shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>بدء دراسة هذا المقرر الآن</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-2.5 border-t flex items-center justify-between border-[#2F2F2F]/15 dark:border-[#2F2F2F] bg-[#F6F6F6] dark:bg-[#141414] shrink-0 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>الهيكل المعرفي الكامل يوضح تسلسل المحطات وفق نمط بلوم المعرفي للتعلم التكيفي.</span>
              <span className="text-[#FFCB74] font-bold">منصة إديوتك الذكية • EduTech 2026</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentCourses;