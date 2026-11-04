import React, { useState } from 'react';
import { X, Ban, AlertTriangle, Info } from 'lucide-react';
import { AdminUser } from '../../types';

interface BanStudentModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBan: (userId: string, reason: string) => void;
}

export const BanStudentModal: React.FC<BanStudentModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirmBan,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('يرجى كتابة سبب الحظر الإداري بوضوح.');
      return;
    }
    onConfirmBan(user.id, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl overflow-hidden flex flex-col">
        {/* الترويسة بلون تحذيري */}
        <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Ban className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-rose-950 dark:text-rose-200">
                تأكيد حظر حساب الطالب
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                Permanent Student Account Banning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#2F2F2F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* النموذج والبيانات */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* تفاصيل الطالب المستهدف */}
          <div className="p-3.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#2F2F2F] dark:text-white block">
                {user.displayName}
              </span>
              <span className="text-xs text-slate-400 font-mono block">{user.email}</span>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">UID: {user.id}</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* حقل سبب الحظر */}
          <div>
            <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
              سبب الحظر الأكاديمي أو الأمني (إلزامي):
            </label>
            <textarea
              rows={3}
              placeholder="مثال: انتهاك شروط النزاهة الأكاديمية أو محاولة اختراق طلبات التوليد..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium focus:outline-none focus:border-rose-400 resize-none"
              required
            />
          </div>

          {/* تنبيه الشفافية المعمارية */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">ملاحظة تقنية مهمة للأدمن:</span>
              <span>
                سيتم تطبيق الحظر وحفظه محلياً في لوحة الإدارة وتوثيقه بسجل العمليات. هذه الوظيفة جاهزة كلياً وستحتاج مساراً في الـ Backend (POST /api/admin/users/ban) لحظر الحساب سحابياً في Firebase عند توفره.
              </span>
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#2A2A2A] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-[#2F2F2F] text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              تأكيد حظر الحساب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BanStudentModal;

