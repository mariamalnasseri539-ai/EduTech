import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  Lock,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { AdminUser, UserRole, AccountStatus, AdminPermission, UserStats, AuditLogEntry } from '../types';
import {
  loadStoredUsers,
  saveStoredUsers,
  loadStoredAuditLogs,
  saveStoredAuditLogs
} from '../data/usersData';
import { UserStatsCards } from '../components/users/UserStatsCards';
import { UserFiltersBar } from '../components/users/UserFiltersBar';
import { UsersTable } from '../components/users/UsersTable';
import { PaginationBar } from '../components/users/PaginationBar';
import { UserDetailsModal } from '../components/users/UserDetailsModal';
import { EditUserModal } from '../components/users/EditUserModal';
import { AddUserModal } from '../components/users/AddUserModal';
import { PermissionsMatrixCard } from '../components/users/PermissionsMatrixCard';
import { BanStudentModal } from '../components/users/BanStudentModal';
import { SuspendStudentModal } from '../components/users/SuspendStudentModal';
import { AuditLogsTable } from '../components/users/AuditLogsTable';

export const AdminUsersView: React.FC = () => {
  // حالة المستخدمين وسجل العمليات
  const [users, setUsers] = useState<AdminUser[]>(() => loadStoredUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadStoredAuditLogs());

  // التبويب النشط
  const [activeTab, setActiveTab] = useState<'directory' | 'permissions' | 'audit_logs'>('directory');

  // فلاتر وبحث وترتيب
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | AccountStatus>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'>('date_desc');

  // ترقيم الصفحات (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // حالات النوافذ المنبثقة (Modals)
  const [selectedUserDetails, setSelectedUserDetails] = useState<AdminUser | null>(null);
  const [selectedEditUser, setSelectedEditUser] = useState<AdminUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [banningUser, setBanningUser] = useState<AdminUser | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<AdminUser | null>(null);

  // إشعار التأكيد اللحظي (Toast Feedback)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // تسجيل عملية في سجل الرقابة
  const addAuditLog = (
    actionType: AuditLogEntry['actionType'],
    targetUser: AdminUser,
    details: string,
    reason?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: 'log-' + Date.now(),
      adminName: 'م. آيات (مسؤول النظام)',
      actionType,
      targetUserId: targetUser.id,
      targetUserName: targetUser.displayName,
      details,
      reason,
      timestamp: new Date().toISOString(),
    };
    const nextLogs = [newEntry, ...auditLogs];
    setAuditLogs(nextLogs);
    saveStoredAuditLogs(nextLogs);
  };

  // حساب الإحصائيات الأربع ديناميكياً
  const stats: UserStats = useMemo(() => {
    const totalUsers = users.length;
    const studentsCount = users.filter((u) => u.role === 'STD').length;
    const adminsCount = users.filter((u) => u.role === 'ADM').length;
    const activeCount = users.filter((u) => u.status === 'active').length;
    const bannedCount = users.filter((u) => u.status === 'banned').length;
    const suspendedCount = users.filter((u) => u.status === 'suspended').length;
    return { totalUsers, studentsCount, adminsCount, activeCount, bannedCount, suspendedCount };
  }, [users]);

  // تصفية وترتيب المستخدمين
  const filteredUsers = useMemo(() => {
    let list = [...users];

    // بحث بالاسم أو البريد
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    // تصفية حسب الدور
    if (selectedRole !== 'all') {
      list = list.filter((u) => u.role === selectedRole);
    }

    // تصفية حسب حالة الحساب
    if (selectedStatus !== 'all') {
      list = list.filter((u) => u.status === selectedStatus);
    }

    // الترتيب
    list.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'name_asc') {
        return a.displayName.localeCompare(b.displayName, 'ar');
      }
      if (sortBy === 'name_desc') {
        return b.displayName.localeCompare(a.displayName, 'ar');
      }
      return 0;
    });

    return list;
  }, [users, searchTerm, selectedRole, selectedStatus, sortBy]);

  // تقطيع الصفحات
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // قائمة المشرفين فقط للمصفوفة
  const adminUsers = useMemo(() => {
    return users.filter((u) => u.role === 'ADM');
  }, [users]);

  // حفظ التعديلات على مستخدم
  const handleSaveUser = (updatedUser: AdminUser) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      saveStoredUsers(next);
      return next;
    });
    addAuditLog('update_user', updatedUser, 'تعديل بيانات الحساب وتحديث الصلاحيات');
    showToast(`تم تحديث بيانات المستخدم "${updatedUser.displayName}" بنجاح.`);
  };

  // إضافة مستخدم جديد
  const handleAddUser = (newUser: AdminUser) => {
    setUsers((prev) => {
      const next = [newUser, ...prev];
      saveStoredUsers(next);
      return next;
    });
    setCurrentPage(1);
    addAuditLog('create_user', newUser, `إنشاء حساب جديد بدور (${newUser.role})`);
    showToast(`تمت إضافة المستخدم "${newUser.displayName}" بنجاح.`);
  };

  // حظر طالب مع توثيق السبب
  const handleConfirmBan = (userId: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updated: AdminUser = {
      ...target,
      status: 'banned',
      banReason: reason,
      bannedAt: new Date().toISOString(),
      bannedBy: 'م. آيات (مسؤول النظام)',
    };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog('ban', target, 'حظر حساب الطالب نهائياً لمنع الدخول والتعلم التوليدي', reason);
    showToast(`تم حظر حساب الطالب "${target.displayName}" وتوثيق السبب في السجل.`);
  };

  // إيقاف مؤقت مع تحديد المدة والسبب
  const handleConfirmSuspend = (userId: string, durationDays: number, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updated: AdminUser = {
      ...target,
      status: 'suspended',
      suspendDurationDays: durationDays,
      banReason: reason,
      suspendedAt: new Date().toISOString(),
    };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog(
      'suspend',
      target,
      `إيقاف الحساب مؤقتاً لمدة ${durationDays} أيام`,
      reason
    );
    showToast(`تم إيقاف حساب الطالب مؤقتاً لمدة ${durationDays} أيام.`);
  };

  // إلغاء حظر حساب
  const handleUnbanUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updated: AdminUser = {
      ...target,
      status: 'active',
      banReason: undefined,
      bannedAt: undefined,
      bannedBy: undefined,
    };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog('unban', target, 'إلغاء حظر الحساب وإعادة تفعيله بالكامل');
    showToast(`تم إلغاء حظر الطالب "${target.displayName}" وإعادة تفعيل حسابه.`);
  };

  // إلغاء إيقاف مؤقت
  const handleUnsuspendUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updated: AdminUser = {
      ...target,
      status: 'active',
      banReason: undefined,
      suspendDurationDays: undefined,
      suspendedAt: undefined,
    };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog('unsuspend', target, 'إنهاء فترة الإيقاف المؤقت وإعادة تفعيل الحساب');
    showToast(`تم إنهاء الإيقاف المؤقت وتفعيل حساب الطالب.`);
  };

  // تبديل صلاحية معينة لمشرف من المصفوفة
  const handleToggleAdminPermission = (userId: string, permission: AdminPermission) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const exists = target.permissions.includes(permission);
    const nextPerms = exists
      ? target.permissions.filter((p) => p !== permission)
      : [...target.permissions, permission];

    const updated: AdminUser = { ...target, permissions: nextPerms };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog(
      'permission_change',
      target,
      `${exists ? 'تعطيل' : 'منح'} صلاحية (${permission}) للمشرف`
    );
    showToast(`تم تحديث صلاحية "${permission}" للمشرف.`);
  };

  // تحويل مشرف إلى طالب
  const handleDemoteToStudent = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updated: AdminUser = { ...target, role: 'STD' as UserRole, permissions: [] };

    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? updated : u));
      saveStoredUsers(next);
      return next;
    });

    addAuditLog('role_change', target, 'تحويل الحساب من مشرف (ADM) إلى طالب (STD)');
    showToast('تم تحويل حساب المشرف إلى حساب طالب (STD).');
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn" dir="rtl">
      {/* إشعار النجاح اللحظي (Toast Notification) */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#111111] text-white border border-[#FFCB74] shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-[#FFCB74] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. الترويسة الرئيسية والتبويبات الثلاثة */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
              USER & STUDENT MANAGEMENT
            </span>
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-200">
              إدارة الحظر والإيقاف والصلاحيات
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#2F2F2F] dark:text-white leading-tight">
            إدارة المستخدمين وحسابات الطلاب والصلاحيات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            التحكم الشامل بحسابات الطلاب، الحظر الإداري، الإيقاف المؤقت، وتعيين تراخيص المشرفين وسجل العمليات.
          </p>
        </div>

        {/* أزرار التبديل بين الأقسام الثلاثة */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs self-start md:self-center">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-[#FFCB74] text-[#111111] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>دليل المستخدمين ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'permissions'
                ? 'bg-[#FFCB74] text-[#111111] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>مصفوفة الصلاحيات ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'audit_logs'
                ? 'bg-[#FFCB74] text-[#111111] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>سجل الإجراءات ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* 2. بطاقات الإحصائيات الأربع للمستخدمين */}
      <UserStatsCards stats={stats} />

      {/* 3. جسم المحتوى بحسب التبويب النشط */}
      {activeTab === 'directory' ? (
        <div className="space-y-4">
          {/* شريط الفلاتر والبحث وزر الإضافة */}
          <UserFiltersBar
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            selectedRole={selectedRole}
            onRoleChange={(val) => {
              setSelectedRole(val);
              setCurrentPage(1);
            }}
            selectedStatus={selectedStatus}
            onStatusChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            onOpenAddUser={() => setIsAddUserOpen(true)}
            totalFilteredCount={filteredUsers.length}
          />

          {/* جدول المستخدمين مع إجراءات الحظر والإيقاف */}
          <UsersTable
            users={paginatedUsers}
            onViewDetails={(u) => setSelectedUserDetails(u)}
            onEditUser={(u) => setSelectedEditUser(u)}
            onRequestBan={(u) => setBanningUser(u)}
            onRequestSuspend={(u) => setSuspendingUser(u)}
            onUnbanUser={handleUnbanUser}
            onUnsuspendUser={handleUnsuspendUser}
          />

          {/* شريط ترقيم الصفحات */}
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : activeTab === 'permissions' ? (
        /* تبويب مصفوفة الصلاحيات المتقدمة */
        <PermissionsMatrixCard
          admins={adminUsers}
          onToggleAdminPermission={handleToggleAdminPermission}
          onDemoteToStudent={handleDemoteToStudent}
        />
      ) : (
        /* تبويب سجل الإجراءات والحظر */
        <AuditLogsTable logs={auditLogs} />
      )}

      {/* 4. النوافذ المنبثقة (Modals) */}
      <UserDetailsModal
        user={selectedUserDetails}
        isOpen={Boolean(selectedUserDetails)}
        onClose={() => setSelectedUserDetails(null)}
        onEdit={(u) => setSelectedEditUser(u)}
      />

      <EditUserModal
        user={selectedEditUser}
        isOpen={Boolean(selectedEditUser)}
        onClose={() => setSelectedEditUser(null)}
        onSave={handleSaveUser}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAddUser}
      />

      <BanStudentModal
        user={banningUser}
        isOpen={Boolean(banningUser)}
        onClose={() => setBanningUser(null)}
        onConfirmBan={handleConfirmBan}
      />

      <SuspendStudentModal
        user={suspendingUser}
        isOpen={Boolean(suspendingUser)}
        onClose={() => setSuspendingUser(null)}
        onConfirmSuspend={handleConfirmSuspend}
      />
    </div>
  );
};

export default AdminUsersView;
