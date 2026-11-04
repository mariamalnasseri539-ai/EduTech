export interface KpiMetric {
  id: string;
  title: string;
  enTitle: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subText: string;
  iconName: 'students' | 'courses' | 'mastery' | 'activities' | 'ai';
}

export interface CognitiveStatusItem {
  key: 'Mastered' | 'ActiveLearning' | 'GuidedReview' | 'Assessing' | 'Unassessed';
  labelAr: string;
  labelEn: string;
  count: number;
  percentage: number;
  color: string;
  bgLight: string;
}

export interface RecentActivityItem {
  id: string;
  studentName: string;
  avatarLetter: string;
  type: 'registration' | 'quiz' | 'code' | 'course_completion' | 'lesson_request';
  title: string;
  courseTitle: string;
  timestamp: string;
  badgeText: string;
  badgeType: 'success' | 'warning' | 'info' | 'purple';
}

export interface SystemAlertItem {
  id: string;
  category: 'academic' | 'technical';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  actionText?: string;
}

export const OVERVIEW_KPIS: KpiMetric[] = [
  {
    id: 'students',
    title: 'إجمالي عدد الطلاب',
    enTitle: 'Total Students',
    value: '148',
    change: '+14%',
    isPositive: true,
    subText: '18 طالباً جديداً هذا الأسبوع',
    iconName: 'students',
  },
  {
    id: 'courses',
    title: 'إجمالي المقررات التكيفية',
    enTitle: 'Active Courses',
    value: '6',
    change: '24 مسار',
    isPositive: true,
    subText: 'مسارات متفرعة بنظام DAG',
    iconName: 'courses',
  },
  {
    id: 'mastery',
    title: 'متوسط الإتقان الأكاديمي',
    enTitle: 'Average Topic Mastery',
    value: '78.4%',
    change: '+5.2%',
    isPositive: true,
    subText: 'معدل عام مرتفع عبر المنصة',
    iconName: 'mastery',
  },
  {
    id: 'activities',
    title: 'الأنشطة التعليمية المنجزة',
    enTitle: 'Completed Activities',
    value: '1,420',
    change: '+22%',
    isPositive: true,
    subText: 'اختبارات وتمارين برمجية',
    iconName: 'activities',
  },
  {
    id: 'ai',
    title: 'نشاط الذكاء الاصطناعي',
    enTitle: 'Gemini 1.5 Telemetry',
    value: '99.4%',
    change: '1,240ms',
    isPositive: true,
    subText: 'معدل دقة التوليد اللحظي',
    iconName: 'ai',
  },
];

export const COGNITIVE_STATUS_DATA: CognitiveStatusItem[] = [
  {
    key: 'Mastered',
    labelAr: 'مُتقَن (Mastered)',
    labelEn: 'Mastered',
    count: 58,
    percentage: 39,
    color: '#10B981',
    bgLight: 'bg-emerald-500',
  },
  {
    key: 'ActiveLearning',
    labelAr: 'تعلّم نشط (Active Learning)',
    labelEn: 'Active Learning',
    count: 46,
    percentage: 31,
    color: '#FFCB74',
    bgLight: 'bg-[#FFCB74]',
  },
  {
    key: 'Assessing',
    labelAr: 'قيد التقييم (Assessing)',
    labelEn: 'Assessing',
    count: 22,
    percentage: 15,
    color: '#8B5CF6',
    bgLight: 'bg-purple-500',
  },
  {
    key: 'GuidedReview',
    labelAr: 'مراجعة موجهة (Guided Review)',
    labelEn: 'Guided Review',
    count: 14,
    percentage: 10,
    color: '#F43F5E',
    bgLight: 'bg-rose-500',
  },
  {
    key: 'Unassessed',
    labelAr: 'غير مقيّم (Unassessed)',
    labelEn: 'Unassessed',
    count: 8,
    percentage: 5,
    color: '#64748B',
    bgLight: 'bg-slate-400',
  },
];

export const WEEKLY_ACTIVITY_DATA = [
  { day: 'السبت', quizzes: 34, codeChallenges: 21, lessonsGenerated: 45 },
  { day: 'الأحد', quizzes: 58, codeChallenges: 42, lessonsGenerated: 78 },
  { day: 'الإثنين', quizzes: 72, codeChallenges: 55, lessonsGenerated: 92 },
  { day: 'الثلاثاء', quizzes: 65, codeChallenges: 49, lessonsGenerated: 84 },
  { day: 'الأربعاء', quizzes: 88, codeChallenges: 63, lessonsGenerated: 110 },
  { day: 'الخميس', quizzes: 95, codeChallenges: 70, lessonsGenerated: 124 },
  { day: 'الجمعة', quizzes: 45, codeChallenges: 32, lessonsGenerated: 60 },
];

export const MASTERY_PROGRESSION_POINTS = [
  { week: 'الأسبوع 1', score: 62 },
  { week: 'الأسبوع 2', score: 67 },
  { week: 'الأسبوع 3', score: 71 },
  { week: 'الأسبوع 4', score: 75 },
  { week: 'الأسبوع 5', score: 78.4 },
];

export const PERFORMANCE_LEVELS = [
  { label: 'مبتدئ (Beginner)', percentage: 22, color: 'bg-blue-500', text: 'text-blue-600' },
  { label: 'متوسط (Intermediate)', percentage: 48, color: 'bg-[#FFCB74]', text: 'text-[#2F2F2F] dark:text-[#FFCB74]' },
  { label: 'متقدم (Advanced)', percentage: 24, color: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'متقن فائق (Mastery)', percentage: 6, color: 'bg-purple-500', text: 'text-purple-600' },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-1',
    studentName: 'هيله سرحان الناصري',
    avatarLetter: 'هـ',
    type: 'course_completion',
    title: 'إتمام مسار الإتقان بنجاح',
    courseTitle: 'أساسيات البرمجة بلغة Python',
    timestamp: 'منذ 10 دقائق',
    badgeText: 'إصدار شهادة 100%',
    badgeType: 'success',
  },
  {
    id: 'act-2',
    studentName: 'ريان بن صالح الشمري',
    avatarLetter: 'ر',
    type: 'code',
    title: 'اجتياز التحدي البرمجي (Event Loop)',
    courseTitle: 'Advanced JavaScript Runtime',
    timestamp: 'منذ 25 دقيقة',
    badgeText: 'كود سليم 95%',
    badgeType: 'purple',
  },
  {
    id: 'act-3',
    studentName: 'سارة خالد الدوسري',
    avatarLetter: 'س',
    type: 'quiz',
    title: 'إكمال اختبار تحديد المستوى التشخيصي',
    courseTitle: 'هياكل البيانات والخوارزميات',
    timestamp: 'منذ 45 دقيقة',
    badgeText: 'مستوى متوسط',
    badgeType: 'info',
  },
  {
    id: 'act-4',
    studentName: 'عبدالرحمن فهد العتيبي',
    avatarLetter: 'ع',
    type: 'lesson_request',
    title: 'توليد درس علاجي في Closures',
    courseTitle: 'Advanced JavaScript Runtime',
    timestamp: 'منذ ساعة',
    badgeText: 'توليد ذكي آني',
    badgeType: 'warning',
  },
  {
    id: 'act-5',
    studentName: 'نورة عبدالله القحطاني',
    avatarLetter: 'ن',
    type: 'registration',
    title: 'انضمام طالب جديد إلى المنصة',
    courseTitle: 'حساب جديد عبر Firebase',
    timestamp: 'منذ ساعتين',
    badgeText: 'طالب معتمد',
    badgeType: 'info',
  },
];

export const SYSTEM_ALERTS: SystemAlertItem[] = [
  {
    id: 'alt-1',
    category: 'academic',
    severity: 'warning',
    title: 'صعوبة شائعة في مفهوم "Asynchronous Closures in Loops"',
    description: 'تم رصد 14 طالباً في حالة Guided Review يواجهون التباساً بين نطاق var و let داخل دوال التوقيت. يُقترح تفعيل بطاقات تدعيمية موجهة.',
    timestamp: 'اليوم • 02:30 م',
    actionText: 'مراجعة تحليلات الدفعة',
  },
  {
    id: 'alt-2',
    category: 'technical',
    severity: 'info',
    title: 'سلامة نموذج التوليد Gemini 1.5 Pro',
    description: 'استقرار تام في زمن الاستجابة (1.2 ثانية) مع نسبة امتثال 99.4% لمعايير JSON Schema Draft 2020-12 دون أي تجاوزات.',
    timestamp: 'اليوم • 11:15 ص',
    actionText: 'سجل التيليميتري',
  },
  {
    id: 'alt-3',
    category: 'academic',
    severity: 'critical',
    title: '3 طلاب تجاوزوا مهلة التقييم في اختبار التموضع',
    description: 'طلاب مسجلون لم يكملوا فحص ZPD الأولي لأكثر من 48 ساعة من وقت إنشاء الحساب.',
    timestamp: 'أمس • 06:40 م',
    actionText: 'عرض قائمة الطلاب',
  },
];

