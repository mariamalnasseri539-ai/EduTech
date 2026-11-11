import React, { useState } from 'react';
import { X, UserPlus, Shield, User as UserIcon, Lock, Check, AlertCircle } from 'lucide-react';
import { AdminUser, UserRole, AccountStatus, AdminPermission } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newUser: AdminUser) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STD');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleTogglePermission = (perm: AdminPermission) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim()) {
      setErrorMessage('يرجى إدخال اسم المستخدم وبريده الإلكتروني.');
      return;
    }

    const uniqueUid = 'usr-' + Math.floor(100000 + Math.random() * 900000);
    const newUser: AdminUser = {
      id: uniqueUid,
      firebaseUid: 'fb-' + uniqueUid,
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role: role,
      status: status,
      permissions: role === 'ADM' ? permissions : [],
      placementCompleted: role === 'ADM',
      enrolledCourses: role === 'STD' ? ['python-basics'] : [],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      academicProgress: 0,
    };

    onAdd(newUser);
    onClose();
    // Reset form
    setDisplayName('');
    setEmail('');
    setPhone('');
    setRole('STD');
    setStatus('active');
    setPermissions([]);
    setErrorMessage('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-slate-200 dark:border-[#2F2F2F] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* الترويسة */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#2A2A2A] bg-[#F6F6F6]/50 dark:bg-[#252525]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-[#2F2F2F] dark:text-white">
                إضافة مستخدم جديد
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Create New User Account & Assign Role
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#2F2F2F] border border-slate-200 dark:border-[#383838] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* النموذج */}
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
              placeholder="مثال: سارة محمد القحطاني"
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
                placeholder="user@masar.edu"
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
                placeholder="+966 50 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-mono text-xs focus:outline-none focus:border-[#FFCB74]"
              />
            </div>
          </div>

          {/* اختيار الدور والحالة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#2A2A2A]">
            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                الدور الأساسي
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('STD');
                    setPermissions([]);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    role === 'STD'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-[#333333] text-slate-500'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>طالب (STD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('ADM');
                    if (permissions.length === 0) setPermissions(['view_analytics']);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                    role === 'ADM'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
                      : 'border-slate-200 dark:border-[#333333] text-slate-500'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>مسؤول (ADM)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
                الحالة المبدئية
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
              >
                <option value="active">نشط ومفعل (Active)</option>
                <option value="pending">بانتظار التأكيد (Pending)</option>
              </select>
            </div>
          </div>

          {/* الصلاحيات في حال المشرف */}
          {role === 'ADM' && (
            <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#FFCB74]" />
                <h4 className="text-xs font-bold text-[#2F2F2F] dark:text-white">
                  تحديد الصلاحيات المبدئية
                </h4>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'manage_syllabi' as AdminPermission, name: 'إدارة المناهج (manage_syllabi)' },
                  { key: 'view_analytics' as AdminPermission, name: 'استعراض التحليلات (view_analytics)' },
                  { key: 'manage_users' as AdminPermission, name: 'إدارة المستخدمين (manage_users)' },
                ].map((item) => {
                  const isChecked = permissions.includes(item.key);
                  return (
                    <label
                      key={item.key}
                      onClick={() => handleTogglePermission(item.key)}
                      className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#FFCB74] bg-[#FFCB74]/15 dark:bg-[#FFCB74]/5'
                          : 'border-slate-200 dark:border-[#333333] bg-[#F6F6F6]/50 dark:bg-[#252525]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-[#FFCB74] border-[#FFCB74] text-[#111111]'
                            : 'border-slate-300 dark:border-[#444444] bg-white dark:bg-[#202020]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-[#2F2F2F] dark:text-white">
                        {item.name}
                      </span>
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
              إضافة المستخدم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

