import React from 'react';
import {
  X,
  Shield,
  User as UserIcon,
  Calendar,
  Clock,
  Phone,
  Mail,
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { AdminUser } from '../../types';

interface UserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: AdminUser) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !user) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getPermissionLabel = (perm: string) => {
    switch (perm) {
      case 'manage_syllabi':
        return {
          title: 'إدارة وتعديل خرائط المناهج (Topic Maps)',
          desc: 'صلاحية تعديل المناهج وربط شروط المفاهيم القبلية وشبكات الـ DAG.',
        };
      case 'view_analytics':
        return {
          title: 'استعراض تحليلات الدفعة (Cohort Analytics)',
          desc: 'صلاحية فحص نسب الإتقان، وتوزيع الحالات المعرفية، وسجل نقاط الضعف.',
        };
      case 'manage_users':
        return {
          title: 'إدارة المستخدمين والصلاحيات (Users Control)',
          desc: 'صلاحية إضافة المشرفين وتعديل أدوار الحسابات وتعيين التراخيص.',
        };
      default:
        return { title: perm, desc: '' };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* الترويسة العلوية للمودال */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A] bg-[#F6F6F6]/50 dark:bg-[#252525]/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74] font-bold text-lg shrink-0">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#2F2F2F] dark:text-white">
                  {user.displayName}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    user.role === 'ADM'
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200'
                  }`}
                >
                  {user.role === 'ADM' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                  <span>{user.role === 'ADM' ? 'حساب مسؤول (ADM)' : 'حساب طالب (STD)'}</span>
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">UID: {user.firebaseUid}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#2F2F2F] border border-slate-200 dark:border-[#383838] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* جسم المودال القابل للتمرير */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* 1. معلومات الاتصال والبيانات الأساسية */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              البيانات الشخصية والاتصال
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#FFCB74] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block">البريد الإلكتروني</span>
                  <span className="font-semibold text-[#2F2F2F] dark:text-white font-mono truncate block">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#FFCB74] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">رقم الهاتف</span>
                  <span className="font-semibold text-[#2F2F2F] dark:text-white font-mono block">
                    {user.phone || 'غير مسجل'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#FFCB74] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">تاريخ الانضمام</span>
                  <span className="font-semibold text-[#2F2F2F] dark:text-white block">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#FFCB74] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">آخر تسجيل دخول</span>
                  <span className="font-semibold text-[#2F2F2F] dark:text-white block">
                    {formatDate(user.lastLoginAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. قسم خاص بصلاحيات المشرفين إذا كان الحساب ADM */}
          {user.role === 'ADM' && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FFCB74]" />
                <span>الصلاحيات الإدارية الممنوحة (Role-Based Permissions)</span>
              </h4>

              <div className="space-y-2">
                {['manage_syllabi', 'view_analytics', 'manage_users'].map((permKey) => {
                  const hasPerm = user.permissions.includes(permKey as any);
                  const info = getPermissionLabel(permKey);
                  return (
                    <div
                      key={permKey}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                        hasPerm
                          ? 'border-[#FFCB74]/60 bg-[#FFCB74]/10 dark:bg-[#FFCB74]/5'
                          : 'border-slate-200 dark:border-[#2F2F2F] bg-slate-50 dark:bg-[#222222] opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2F2F2F] dark:text-white text-xs sm:text-sm">
                            {info.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#333333] text-slate-600 dark:text-slate-300">
                            {permKey}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {info.desc}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                          hasPerm
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-[#2F2F2F] text-slate-500'
                        }`}
                      >
                        {hasPerm ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{hasPerm ? 'ممنوحة' : 'معطلة'}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. قسم المسار الأكاديمي إذا كان الحساب STD */}
          {user.role === 'STD' && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FFCB74]" />
                <span>المسار التعليمي وحالة التعلّم التكيفي (ZPD)</span>
              </h4>

              <div className="p-4 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    معدل التقدم العام في المقررات:
                  </span>
                  <span className="font-bold font-mono text-[#2F2F2F] dark:text-[#FFCB74]">
                    {user.academicProgress || 0}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-[#333333] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FFCB74]"
                    style={{ width: `${user.academicProgress || 0}%` }}
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400">المقررات المسجلة:</span>
                  {user.enrolledCourses.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-[#333333] font-mono text-xs font-bold text-[#2F2F2F] dark:text-white"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* أزرار الإجراءات السفلية */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-[#2A2A2A] bg-[#F6F6F6]/50 dark:bg-[#252525]/40 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onEdit(user);
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FFCB74] text-[#111111] hover:bg-[#ffd794] transition-all cursor-pointer shadow-xs"
          >
            تعديل البيانات والصلاحيات
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white dark:bg-[#2F2F2F] border border-slate-200 dark:border-[#383838] text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

