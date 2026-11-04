import React from 'react';
import {
  Eye,
  Shield,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Ban,
  Calendar,
  Clock,
  Edit3
} from 'lucide-react';
import { AdminUser } from '../../types';

interface UsersTableProps {
  users: AdminUser[];
  onViewDetails: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onRequestBan: (user: AdminUser) => void;
  onRequestSuspend: (user: AdminUser) => void;
  onUnbanUser: (userId: string) => void;
  onUnsuspendUser: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onViewDetails,
  onEditUser,
  onRequestBan,
  onRequestSuspend,
  onUnbanUser,
  onUnsuspendUser,
}) => {
  const getRoleBadge = (role: AdminUser['role']) => {
    if (role === 'ADM') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
          <Shield className="w-3 h-3 text-purple-600" />
          <span>مسؤول (ADM)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
        <UserIcon className="w-3 h-3 text-emerald-600" />
        <span>طالب (STD)</span>
      </span>
    );
  };

  const getStatusBadge = (user: AdminUser) => {
    switch (user.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>نشط (Active)</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>بانتظار التأكيد</span>
          </span>
        );
      case 'suspended':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80"
            title={user.banReason || 'موقوف مؤقتاً'}
          >
            <Clock className="w-3 h-3 text-amber-500" />
            <span>موقوف مؤقتاً ({user.suspendDurationDays || 7} أيام)</span>
          </span>
        );
      case 'banned':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80"
            title={user.banReason || 'محظور من الإدارة'}
          >
            <Ban className="w-3 h-3 text-rose-500" />
            <span>محظور (Banned)</span>
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-12 text-center border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
        <div className="w-14 h-14 rounded-full bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center mx-auto mb-3 text-[#2F2F2F] dark:text-[#FFCB74]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white mb-1">
          لا يوجد مستخدمين مطابقين
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          جرّب تغيير كلمات البحث أو إزالة بعض فلاتر الدور والحالة لإظهار النتائج.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2F2F2F] shadow-xs overflow-hidden"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#F6F6F6] dark:bg-[#252525] border-b border-slate-200 dark:border-[#2F2F2F] text-xs font-bold text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">المستخدم</th>
              <th className="py-3.5 px-4">الدور</th>
              <th className="py-3.5 px-4">حالة الحساب</th>
              <th className="py-3.5 px-4 hidden md:table-cell">تاريخ التسجيل</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">الصلاحيات</th>
              <th className="py-3.5 px-4 text-center">إجراءات الحساب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#262626] text-xs sm:text-sm">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[#F6F6F6]/60 dark:hover:bg-[#252525]/40 transition-colors group"
              >
                {/* 1. المستخدم: صورة + اسم + بريد */}
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center font-bold text-sm text-[#2F2F2F] dark:text-[#FFCB74] shrink-0">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#2F2F2F] dark:text-white leading-tight">
                        {user.displayName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. الدور */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>

                {/* 3. الحالة */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getStatusBadge(user)}
                </td>

                {/* 4. تاريخ التسجيل */}
                <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </td>

                {/* 5. الصلاحيات */}
                <td className="py-3.5 px-4 hidden lg:table-cell whitespace-nowrap">
                  {user.role === 'ADM' ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {user.permissions.length > 0 ? (
                        user.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFCB74]/20 text-[#2F2F2F] dark:text-[#FFCB74] border border-[#FFCB74]/30"
                          >
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">بدون صلاحيات إضافية</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      المقررات: {user.enrolledCourses.length} • تقدم: {user.academicProgress || 0}%
                    </span>
                  )}
                </td>

                {/* 6. قائمة الإجراءات المتكاملة للطالب/المشرف */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    {/* زر عرض التفاصيل */}
                    <button
                      onClick={() => onViewDetails(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#2F2F2F] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors"
                      title="عرض تفاصيل المستخدم"
                      aria-label="عرض تفاصيل المستخدم"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* زر تعديل البيانات والصلاحيات */}
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#2F2F2F] dark:text-slate-400 dark:hover:text-[#FFCB74] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors"
                      title="تعديل البيانات والصلاحيات"
                      aria-label="تعديل البيانات والصلاحيات"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* إجراءات حظر وإلغاء حظر وإيقاف مؤقت للطلاب */}
                    {user.status === 'banned' ? (
                      /* زر إلغاء الحظر */
                      <button
                        onClick={() => onUnbanUser(user.id)}
                        className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        title="إلغاء حظر الحساب الأكاديمي"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إلغاء الحظر</span>
                      </button>
                    ) : user.status === 'suspended' ? (
                      /* زر إلغاء الإيقاف المؤقت */
                      <button
                        onClick={() => onUnsuspendUser(user.id)}
                        className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                        title="إنهاء الإيقاف المؤقت وتفعيل الحساب"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>إعادة تفعيل</span>
                      </button>
                    ) : (
                      <>
                        {/* زر إيقاف مؤقت */}
                        <button
                          onClick={() => onRequestSuspend(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                          title="إيقاف مؤقت للحساب"
                          aria-label="إيقاف مؤقت للحساب"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        {/* زر حظر الحساب */}
                        <button
                          onClick={() => onRequestBan(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="حظر حساب الطالب"
                          aria-label="حظر حساب الطالب"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
