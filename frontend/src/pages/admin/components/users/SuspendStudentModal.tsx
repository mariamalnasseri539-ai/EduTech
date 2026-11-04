import React, { useState } from 'react';
import { X, Clock, AlertCircle, Info } from 'lucide-react';
import { AdminUser } from '../../types';

interface SuspendStudentModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuspend: (userId: string, durationDays: number, reason: string) => void;
}

export const SuspendStudentModal: React.FC<SuspendStudentModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirmSuspend,
}) => {
  const [duration, setDuration] = useState<number>(7);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('يرجى تحديد سبب الإيقاف المؤقت للحساب.');
      return;
    }
    onConfirmSuspend(user.id, duration, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-2xl overflow-hidden flex flex-col">
        {/* الترويسة بلون عنبري */}
        <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#FFCB74]">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-200">
                إيقاف مؤقت لحساب الطالب
              </h3>
              <p className="text-xs text-amber-600 dark:text-[#FFCB74] font-mono mt-0.5">
                Temporary Student Account Suspension
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

        {/* النموذج */}
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
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* اختيار مدة الإيقاف المؤقت */}
          <div>
            <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
              مدة الإيقاف المؤقت:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '3 أيام', days: 3 },
                { label: '7 أيام', days: 7 },
                { label: '14 يوماً', days: 14 },
                { label: '30 يوماً', days: 30 },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setDuration(opt.days)}
                  className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                    duration === opt.days
                      ? 'bg-[#FFCB74] border-[#FFCB74] text-[#111111] shadow-xs'
                      : 'border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* سبب الإيقاف المؤقت */}
          <div>
            <label className="block text-xs font-bold text-[#2F2F2F] dark:text-slate-300 mb-1.5">
              سبب الإيقاف المؤقت (إلزامي):
            </label>
            <textarea
              rows={3}
              placeholder="مثال: فحص أمني لحساب مسجل منه نشاط غير اعتيادي أو استيفاء وثائق الهوية..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-medium focus:outline-none focus:border-amber-400 resize-none"
              required
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#FFCB74] shrink-0" />
            <span>سيتم توثيق هذا الإجراء وتاريخه ومدته تلقائياً في سجل إجراءات الأدمن.</span>
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
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all cursor-pointer"
            >
              تأكيد الإيقاف المؤقت
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuspendStudentModal;

