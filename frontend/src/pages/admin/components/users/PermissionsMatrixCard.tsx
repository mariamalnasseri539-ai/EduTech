import React from 'react';
import { ShieldCheck, Lock, Check, X, Info } from 'lucide-react';
import { AdminUser, AdminPermission } from '../../types';

interface PermissionsMatrixCardProps {
  admins: AdminUser[];
  onToggleAdminPermission: (userId: string, permission: AdminPermission) => void;
  onDemoteToStudent: (userId: string) => void;
}

export const PermissionsMatrixCard: React.FC<PermissionsMatrixCardProps> = ({
  admins,
  onToggleAdminPermission,
  onDemoteToStudent,
}) => {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-6"
      dir="rtl"
    >
      {/* الترويسة والوصف */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-[#2F2F2F] dark:text-white">
              مصفوفة التحكم في صلاحيات المشرفين (Permissions Matrix)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Role-Based Access Control (RBAC) • Enterprise Policy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-xs font-bold text-purple-700 dark:text-purple-400">
          <ShieldCheck className="w-4 h-4" />
          <span>{admins.length} مشرفين معتمدين</span>
        </div>
      </div>

      {/* بطاقة توضيحية لتعريف الصلاحيات الثلاث */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FFCB74]" />
            <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white font-mono">
              manage_syllabi
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            صلاحية التحكم في شجرة المناهج وخرائط المفاهيم التكيفية (DAGs) وشروط المتطلبات السابقة.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white font-mono">
              view_analytics
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            صلاحية الاطلاع على تحليلات الدفعة، نسب الإتقان، وتوزيع الحالات المعرفية وسجل نقاط الضعف.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200/80 dark:border-[#333333]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white font-mono">
              manage_users
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            صلاحية إدارة حسابات المستخدمين، تحويل الأدوار، وتعديل مصفوفة الصلاحيات الخاصة بالإدارة.
          </p>
        </div>
      </div>

      {/* جدول مصفوفة الصلاحيات مع مفاتيح التبديل (Switches) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2F2F2F]">
        <table className="w-full text-right border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#F6F6F6] dark:bg-[#252525] border-b border-slate-200 dark:border-[#2F2F2F] text-slate-500 dark:text-slate-400 font-bold">
              <th className="py-3 px-4">المشرف المسؤول</th>
              <th className="py-3 px-4 text-center">إدارة المناهج (manage_syllabi)</th>
              <th className="py-3 px-4 text-center">استعراض التحليلات (view_analytics)</th>
              <th className="py-3 px-4 text-center">إدارة المستخدمين (manage_users)</th>
              <th className="py-3 px-4 text-center">إجراءات الدور</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#262626]">
            {admins.map((admin) => {
              const hasSyllabi = admin.permissions.includes('manage_syllabi');
              const hasAnalytics = admin.permissions.includes('view_analytics');
              const hasUsers = admin.permissions.includes('manage_users');

              return (
                <tr
                  key={admin.id}
                  className="hover:bg-[#F6F6F6]/60 dark:hover:bg-[#252525]/40 transition-colors"
                >
                  {/* المشرف */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0">
                        {admin.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#2F2F2F] dark:text-white leading-tight">
                          {admin.displayName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* المفتاح 1: manage_syllabi */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleAdminPermission(admin.id, 'manage_syllabi')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hasSyllabi ? 'bg-[#FFCB74]' : 'bg-slate-200 dark:bg-[#333333]'
                      }`}
                      title={hasSyllabi ? 'تعطيل الصلاحية' : 'تفعيل الصلاحية'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                          hasSyllabi ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {hasSyllabi ? (
                          <Check className="w-3 h-3 text-[#111111] stroke-[3]" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    </button>
                  </td>

                  {/* المفتاح 2: view_analytics */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleAdminPermission(admin.id, 'view_analytics')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hasAnalytics ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-[#333333]'
                      }`}
                      title={hasAnalytics ? 'تعطيل الصلاحية' : 'تفعيل الصلاحية'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                          hasAnalytics ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {hasAnalytics ? (
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    </button>
                  </td>

                  {/* المفتاح 3: manage_users */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleAdminPermission(admin.id, 'manage_users')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hasUsers ? 'bg-purple-600' : 'bg-slate-200 dark:bg-[#333333]'
                      }`}
                      title={hasUsers ? 'تعطيل الصلاحية' : 'تفعيل الصلاحية'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                          hasUsers ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      >
                        {hasUsers ? (
                          <Check className="w-3 h-3 text-purple-600 stroke-[3]" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    </button>
                  </td>

                  {/* زر التحويل إلى طالب */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onDemoteToStudent(admin.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 hover:underline font-semibold"
                    >
                      تحويل لطالب (STD)
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
        <Info className="w-4 h-4 text-[#FFCB74] shrink-0" />
        <span>
          التغييرات في الصلاحيات تُحفظ فورياً في ذاكرة التطبيق، وتُفعّل مباشرة للمشرف المسجل.
        </span>
      </div>
    </div>
  );
};

export default PermissionsMatrixCard;

