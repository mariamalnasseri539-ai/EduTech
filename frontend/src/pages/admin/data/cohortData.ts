import { MisconceptionDiagnosis, TopicMasteryMetric } from '../types';

export interface CourseCohortData {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  averageMastery: number;
  cognitiveStatusDistribution: {
    Mastered: number;
    ActiveLearning: number;
    Assessing: number;
    GuidedReview: number;
    Unassessed: number;
  };
  topicMastery: TopicMasteryMetric[];
  misconceptions: MisconceptionDiagnosis[];
  strengths: string[];
  weaknesses: string[];
}

export const COHORT_DATA_MAP: Record<string, CourseCohortData> = {
  'cs-advanced-js': {
    courseId: 'cs-advanced-js',
    courseTitle: 'Advanced JavaScript: Runtime Architecture & Concurrency',
    totalStudents: 86,
    averageMastery: 79.2,
    cognitiveStatusDistribution: {
      Mastered: 34,
      ActiveLearning: 28,
      Assessing: 12,
      GuidedReview: 8,
      Unassessed: 4,
    },
    topicMastery: [
      {
        topicId: 'js-call-stack',
        topicTitle: 'The Execution Context & Call Stack',
        averageScore: 88,
        studentsAssessed: 82,
        difficulty: 'مبتدئ',
      },
      {
        topicId: 'js-lexical-scope',
        topicTitle: 'Lexical Scope & Closures',
        averageScore: 72,
        studentsAssessed: 74,
        difficulty: 'متوسط',
      },
      {
        topicId: 'async-event-loop',
        topicTitle: 'Asynchronous Concurrency & The Event Loop',
        averageScore: 68,
        studentsAssessed: 68,
        difficulty: 'متقدم',
      },
      {
        topicId: 'promises-async-await',
        topicTitle: 'Promises & Async/Await Under the Hood',
        averageScore: 84,
        studentsAssessed: 60,
        difficulty: 'متقدم',
      },
    ],
    misconceptions: [
      {
        id: 'misc-1',
        conceptTag: 'Async Closures in Loops (var vs let)',
        topicTitle: 'Asynchronous Concurrency & The Event Loop',
        affectedStudentsCount: 14,
        severity: 'critical',
        description: 'التباس شائع بين نطاق دالة var ونطاق كتلة let داخل دوال الاستدعاء غير المتزامنة (setTimeout callbacks)، مما يؤدي لطباعة القيمة النهائية بشكل مكرر.',
        remedialRecommendation: 'توليد بطاقات شرح مقارنة تبرز الـ Lexical Scope per iteration وتكثيف أسئلة الـ Multiple Choice التشخيصية.',
      },
      {
        id: 'misc-2',
        conceptTag: 'Microtask vs Macrotask Queue Starvation',
        topicTitle: 'Asynchronous Concurrency & The Event Loop',
        affectedStudentsCount: 9,
        severity: 'high',
        description: 'اعتقاد خاطئ بأن setTimeout(0) يسبق حلول الوعود المتسلسلة (Promise Chaining)، وإغفال أولوية تفريغ طابور الـ Microtask كاملاً.',
        remedialRecommendation: 'تفعيل المحاكي المرئي لـ Call Stack والـ Event Loop مع أمثلة عملية توضح أسبقية الـ Microtasks.',
      },
      {
        id: 'misc-3',
        conceptTag: 'Hoisting of Function Declarations vs Expressions',
        topicTitle: 'The Execution Context & Call Stack',
        affectedStudentsCount: 5,
        severity: 'medium',
        description: 'صعوبة التمييز بين رفع الإعلانات (Hoisting) وتهيئة المتغيرات أثناء إنشاء الـ Variable Environment.',
        remedialRecommendation: 'توفير تدريب تفاعلي يطلب من الطالب رسم الـ Lexical Environment في مرحلة الـ Creation Phase.',
      },
    ],
    strengths: [
      'فهم ممتاز لهيكل الـ Call Stack وإدارة الـ Stack Frames بنسبة استيعاب 88%.',
      'إتقان صياغة Async/Await وحالات الـ Promise State Machine بنسبة 84%.',
      'دقة عالية في كتابة حلول التحديات البرمجية المتزامنة بمعدل نجاح 91%.',
    ],
    weaknesses: [
      'ثغرة في التفريق بين طابور Microtask وطابور Macrotask عند تداخل الموقتات.',
      'تراجع الأداء عند التعامل مع المتغيرات المغلقة (Closures) داخل الحلقات التكرارية.',
    ],
  },
  'python-basics': {
    courseId: 'python-basics',
    courseTitle: 'أساسيات البرمجة وعلوم الحاسب بلغة Python',
    totalStudents: 62,
    averageMastery: 81.5,
    cognitiveStatusDistribution: {
      Mastered: 24,
      ActiveLearning: 26,
      Assessing: 6,
      GuidedReview: 4,
      Unassessed: 2,
    },
    topicMastery: [
      {
        topicId: 'py-data-types',
        topicTitle: 'المتغيرات وأنواع البيانات الأولية',
        averageScore: 92,
        studentsAssessed: 60,
        difficulty: 'مبتدئ',
      },
      {
        topicId: 'py-control-flow',
        topicTitle: 'الجمل الشرطية وحلقات التكرار (For/While)',
        averageScore: 82,
        studentsAssessed: 58,
        difficulty: 'مبتدئ',
      },
      {
        topicId: 'py-functions',
        topicTitle: 'بناء الدوال والمعاملات (Functions & Scope)',
        averageScore: 76,
        studentsAssessed: 52,
        difficulty: 'متوسط',
      },
      {
        topicId: 'py-oop',
        topicTitle: 'مفاهيم الكائنات والفئات (OOP Foundations)',
        averageScore: 71,
        studentsAssessed: 45,
        difficulty: 'متقدم',
      },
    ],
    misconceptions: [
      {
        id: 'misc-py-1',
        conceptTag: 'Mutable Default Arguments in Functions',
        topicTitle: 'بناء الدوال والمعاملات',
        affectedStudentsCount: 8,
        severity: 'high',
        description: 'تمرير قوائم Lists فارغة كمعاملات افتراضية للدوال مما يؤدي لاحتفاظها بالحالة عبر الاستدعاءات المتعددة.',
        remedialRecommendation: 'توليد كود مقارنة يوضح استخدام None كقيمة افتراضية وتهيئة القائمة داخل الدالة.',
      },
      {
        id: 'misc-py-2',
        conceptTag: 'Variable Scope (Local vs Global)',
        topicTitle: 'الجمل الشرطية وحلقات التكرار',
        affectedStudentsCount: 6,
        severity: 'medium',
        description: 'التباس في تعديل المتغيرات العامة من داخل نطاق الدوال واستخدام الكلمة المفتاحية global.',
        remedialRecommendation: 'إضافة تمرين تصحيح أخطاء (Code Debugging) تفاعلي.',
      },
    ],
    strengths: [
      'استيعاب مرتفع لهياكل البيانات (Lists, Tuples, Dictionaries) بنسبة 92%.',
      'كتابة خوارزميات التكرار والشرط بطريقة بايثونية نظيفة.',
    ],
    weaknesses: [
      'التباس في تمرير المعاملات القابلة للتعديل (Mutable Objects).',
    ],
  },
};

