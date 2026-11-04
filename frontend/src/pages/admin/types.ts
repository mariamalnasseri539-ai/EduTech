export type AdminSection =
  | 'overview'
  | 'users'
  | 'cohort'
  | 'courses'
  | 'telemetry';

export interface AdminNavItem {
  id: AdminSection;
  title: string;
  subtitle: string;
  iconName: 'overview' | 'users' | 'cohort' | 'courses' | 'telemetry';
  badge?: string;
}

export type UserRole = 'STD' | 'ADM';
export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pending';
export type AdminPermission = 'manage_syllabi' | 'view_analytics' | 'manage_users';

export interface AdminUser {
  id: string;
  firebaseUid: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: AccountStatus;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  suspendDurationDays?: number;
  suspendedAt?: string;
  permissions: AdminPermission[];
  placementCompleted: boolean;
  enrolledCourses: string[];
  createdAt: string;
  lastLoginAt: string;
  academicProgress?: number;
  phone?: string;
}

export interface UserStats {
  totalUsers: number;
  studentsCount: number;
  adminsCount: number;
  activeCount: number;
  bannedCount: number;
  suspendedCount: number;
}

export interface AuditLogEntry {
  id: string;
  adminName: string;
  actionType: 'ban' | 'unban' | 'suspend' | 'unsuspend' | 'permission_change' | 'role_change' | 'create_user' | 'update_user';
  targetUserId: string;
  targetUserName: string;
  details: string;
  reason?: string;
  timestamp: string;
}

// Cohort Analytics Types
export interface MisconceptionDiagnosis {
  id: string;
  conceptTag: string;
  topicTitle: string;
  affectedStudentsCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remedialRecommendation: string;
}

export interface TopicMasteryMetric {
  topicId: string;
  topicTitle: string;
  averageScore: number;
  studentsAssessed: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
}

// Course & Topic Maps Types
export interface AdminTopicNode {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  targetConcepts: string[];
  category: string;
  order: number;
  bloomLevel: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  totalStudents: number;
  topicsCount: number;
  topics: Record<string, AdminTopicNode>;
}

// AI Telemetry Types
export interface AiTelemetryData {
  engine: string;
  temperature: number;
  schemaVersion: string;
  generationComplianceRate: number;
  selfHealingRetryRate: number;
  averageSynthesisLatencyMs: number;
  zeroContentGuarantee: string;
  activeRequestsCount: number;
  dailyTotalSynthesized: number;
  totalTokensProcessed: number;
}

export interface AiLogEntry {
  id: string;
  timestamp: string;
  action: string;
  model: string;
  latencyMs: number;
  status: 'SUCCESS' | 'HEALED' | 'FAILED';
  topicId: string;
  studentId: string;
}
