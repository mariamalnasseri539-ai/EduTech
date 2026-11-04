import React, { useState, useEffect } from 'react';
import { X, Shield, User as UserIcon, Check, Lock, AlertCircle } from 'lucide-react';
import { AdminUser, UserRole, AccountStatus, AdminPermission } from '../../types';

interface EditUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: AdminUser) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STD');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setPhone(user.phone || '');
      setRole(user.role);
      setStatus(user.status);
      setPermissions(user.permissions || []);
      setErrorMessage('');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleTogglePermission = (perm: AdminPermission) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'ADM' && permissions.length === 0) {
      // افتراضياً تفعيل صلاحيات المشرف الأساسية
      setPermissions(['view_analytics']);
    } else if (newRole === 'STD') {
      setPermissions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim()) {
      setErrorMessage('يرجى ملء الاسم والبريد الإلكتروني بصورة صحيحة.');
      return;
    }

    const updated: AdminUser = {
      ...user,
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: role,
      status: status,
      permissions: role === 'ADM' ? permissions : [],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* الترويسة */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A] bg-[#F6F6F6]/50 dark:bg-[#252525]/40">
          <div className="text-right">
            <h3 className="text-lg font-bold text-[#2F2F2F] dark:text-white">
              تعديل بيانات المستخدم والصلاحيات
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Edit User Profile & Permissions Matrix
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#2F2F2F] border border-slate-200 dark:border-[#383838] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* نموذج التعديل */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* الاسم الكامل */}
          <div>
            <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
              required
            />
          </div>

          {/* البريد الإلكتروني ورقم الهاتف */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono text-xs focus:outline-none focus:border-[#FFCB74]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono text-xs focus:outline-none focus:border-[#FFCB74]"
              />
            </div>
          </div>

          {/* الدور وحالة الحساب */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#2A2A2A]">
            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                دور الحساب في المنصة
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('STD')}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    role === 'STD'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-[#333333] text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>طالب (STD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('ADM')}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    role === 'ADM'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                      : 'border-slate-200 dark:border-[#333333] text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>مسؤول (ADM)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                حالة الحساب
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
              >
                <option value="active">نشط (Active)</option>
                <option value="pending">بانتظار التأكيد (Pending)</option>
                <option value="suspended">معلّق (Suspended)</option>
              </select>
            </div>
          </div>

          {/* تعيين الصلاحيات المتقدمة (تظهر فقط عند اختيار دور ADM) */}
          {role === 'ADM' && (
            <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-[#FFCB74]" />
                <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white">
                  صلاحيات الإشراف المخصصة (Permissions Matrix)
                </h4>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'manage_syllabi' as AdminPermission,
                    name: 'إدارة وتعديل خرائط المناهج (manage_syllabi)',
                    desc: 'السماح بإنشاء وتعديل المقررات وشبكات المفاهيم التكيفية (DAGs).',
                  },
                  {
                    key: 'view_analytics' as AdminPermission,
                    name: 'استعراض تحليلات الدفعة (view_analytics)',
                    desc: 'السماح بالاطلاع على درجات الإتقان وحالات الطلاب ومؤشرات ZPD.',
                  },
                  {
                    key: 'manage_users' as AdminPermission,
                    name: 'إدارة المستخدمين والصلاحيات (manage_users)',
                    desc: 'السماح بتعديل حسابات المشرفين والطلاب وتعيين الأدوار.',
                  },
                ].map((item) => {
                  const isChecked = permissions.includes(item.key);
                  return (
                    <label
                      key={item.key}
                      onClick={() => handleTogglePermission(item.key)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#FFCB74] bg-[#FFCB74]/15 dark:bg-[#FFCB74]/5'
                          : 'border-slate-200 dark:border-[#333333] bg-[#F6F6F6]/50 dark:bg-[#252525]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-[#FFCB74] border-[#FFCB74] text-[#111111]'
                            : 'border-slate-300 dark:border-[#444444] bg-white dark:bg-[#202020]'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2F2F2F] dark:text-white block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* أزرار الحفظ والإلغاء */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

