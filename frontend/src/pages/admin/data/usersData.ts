import { AdminUser, AuditLogEntry } from '../types';

export const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr-101',
    firebaseUid: 'mock-admin-uid-101',
    displayName: 'م. آيات (مسؤول النظام)',
    email: 'admin.ayat@masar.edu',
    role: 'ADM',
    status: 'active',
    permissions: ['manage_syllabi', 'view_analytics', 'manage_users'],
    placementCompleted: true,
    enrolledCourses: ['cs-advanced-js', 'python-basics'],
    createdAt: '2026-09-01T08:30:00Z',
    lastLoginAt: '2026-11-04T16:15:00Z',
    phone: '+966 50 123 4567',
  },
  {
    id: 'usr-102',
    firebaseUid: 'mock-admin-uid-102',
    displayName: 'د. خالد البابطين',
    email: 'k.babtain@masar.edu',
    role: 'ADM',
    status: 'active',
    permissions: ['manage_syllabi', 'view_analytics'],
    placementCompleted: true,
    enrolledCourses: ['cs-advanced-js'],
    createdAt: '2026-09-15T10:00:00Z',
    lastLoginAt: '2026-11-03T11:20:00Z',
    phone: '+966 55 987 6543',
  },
  {
    id: 'usr-103',
    firebaseUid: 'mock-admin-uid-103',
    displayName: 'أ. مريم الناصري',
    email: 'mariam.alnasseri@masar.edu',
    role: 'ADM',
    status: 'active',
    permissions: ['view_analytics'],
    placementCompleted: true,
    enrolledCourses: ['python-basics'],
    createdAt: '2026-10-01T14:45:00Z',
    lastLoginAt: '2026-11-04T09:10:00Z',
    phone: '+966 56 444 3322',
  },
  {
    id: 'usr-201',
    firebaseUid: 'mock-student-uid-201',
    displayName: 'هيله سرحان الناصري',
    email: 'hailah.student@smart-learning.edu',
    role: 'STD',
    status: 'active',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['python-basics', 'cs-advanced-js'],
    createdAt: '2026-10-10T09:20:00Z',
    lastLoginAt: '2026-11-04T15:40:00Z',
    academicProgress: 100,
    phone: '+966 54 111 2233',
  },
  {
    id: 'usr-202',
    firebaseUid: 'mock-student-uid-202',
    displayName: 'ريان صالح الشمري',
    email: 'rayan.alshammari@gmail.com',
    role: 'STD',
    status: 'active',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['cs-advanced-js'],
    createdAt: '2026-10-12T11:00:00Z',
    lastLoginAt: '2026-11-04T14:10:00Z',
    academicProgress: 78,
    phone: '+966 50 888 7766',
  },
  {
    id: 'usr-203',
    firebaseUid: 'mock-student-uid-203',
    displayName: 'سارة خالد الدوسري',
    email: 'sara.aldosari@outlook.com',
    role: 'STD',
    status: 'active',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['python-basics', 'data-structures'],
    createdAt: '2026-10-18T16:30:00Z',
    lastLoginAt: '2026-11-04T12:00:00Z',
    academicProgress: 64,
    phone: '+966 53 555 4411',
  },
  {
    id: 'usr-204',
    firebaseUid: 'mock-student-uid-204',
    displayName: 'عبدالرحمن فهد العتيبي',
    email: 'abdulrahman.otaibi@hotmail.com',
    role: 'STD',
    status: 'suspended',
    suspendDurationDays: 7,
    suspendedAt: '2026-11-01T10:00:00Z',
    banReason: 'تجاوز محاولات تسجيل الدخول الخاطئة وإجراء فحص أمني',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['cs-advanced-js'],
    createdAt: '2026-10-22T13:15:00Z',
    lastLoginAt: '2026-11-01T10:00:00Z',
    academicProgress: 52,
    phone: '+966 58 333 9988',
  },
  {
    id: 'usr-205',
    firebaseUid: 'mock-student-uid-205',
    displayName: 'نورة عبدالله القحطاني',
    email: 'noura.alqahtani@gmail.com',
    role: 'STD',
    status: 'pending',
    permissions: [],
    placementCompleted: false,
    enrolledCourses: ['python-basics'],
    createdAt: '2026-11-01T08:00:00Z',
    lastLoginAt: '2026-11-02T19:00:00Z',
    academicProgress: 15,
    phone: '+966 59 777 6655',
  },
  {
    id: 'usr-206',
    firebaseUid: 'mock-student-uid-206',
    displayName: 'عمر إبراهيم الغامدي',
    email: 'omar.ghamdi@yahoo.com',
    role: 'STD',
    status: 'banned',
    bannedAt: '2026-10-26T14:30:00Z',
    bannedBy: 'م. آيات (مسؤول النظام)',
    banReason: 'مخالفة سياسة النزاهة الأكاديمية ومحاولة إرسال استعلامات آلية متعددة لمحرك Gemini',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['python-basics'],
    createdAt: '2026-10-05T17:10:00Z',
    lastLoginAt: '2026-10-25T14:00:00Z',
    academicProgress: 35,
    phone: '+966 52 222 1100',
  },
  {
    id: 'usr-207',
    firebaseUid: 'mock-student-uid-207',
    displayName: 'شهد تركي المطيري',
    email: 'shahad.mutairi@masar-student.edu',
    role: 'STD',
    status: 'active',
    permissions: [],
    placementCompleted: true,
    enrolledCourses: ['cs-advanced-js', 'web-fundamentals'],
    createdAt: '2026-10-28T12:40:00Z',
    lastLoginAt: '2026-11-04T16:00:00Z',
    academicProgress: 88,
    phone: '+966 55 666 7788',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    adminName: 'م. آيات (مسؤول النظام)',
    actionType: 'ban',
    targetUserId: 'usr-206',
    targetUserName: 'عمر إبراهيم الغامدي',
    details: 'حظر الحساب الأكاديمي نهائياً لمنع الوصول للدروس والاختبارات التوليدية',
    reason: 'مخالفة سياسة النزاهة الأكاديمية ومحاولة إرسال استعلامات آلية متعددة لمحرك Gemini',
    timestamp: '2026-10-26T14:30:00Z',
  },
  {
    id: 'log-2',
    adminName: 'د. خالد البابطين',
    actionType: 'suspend',
    targetUserId: 'usr-204',
    targetUserName: 'عبدالرحمن فهد العتيبي',
    details: 'تعليق الحساب مؤقتاً لمدة 7 أيام',
    reason: 'تجاوز محاولات تسجيل الدخول الخاطئة وإجراء فحص أمني',
    timestamp: '2026-11-01T10:00:00Z',
  },
  {
    id: 'log-3',
    adminName: 'م. آيات (مسؤول النظام)',
    actionType: 'permission_change',
    targetUserId: 'usr-102',
    targetUserName: 'د. خالد البابطين',
    details: 'منح صلاحية إدارة وتعديل خرائط المناهج (manage_syllabi)',
    timestamp: '2026-09-15T10:05:00Z',
  },
];

const STORAGE_USERS_KEY = 'edutech_admin_users_db_v2';
const STORAGE_LOGS_KEY = 'edutech_admin_audit_logs_v1';

export const loadStoredUsers = (): AdminUser[] => {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users: AdminUser[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {}
};

export const loadStoredAuditLogs = (): AuditLogEntry[] => {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
};

export const saveStoredAuditLogs = (logs: AuditLogEntry[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch {}
};
