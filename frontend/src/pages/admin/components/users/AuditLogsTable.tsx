import React, { useState } from 'react';
import {
  ShieldAlert,
  Calendar,
  UserCheck,
  Ban,
  Clock,
  Key,
  Search,
  Filter
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
}

export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.targetUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = filterAction === 'all' || log.actionType === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (actionType: AuditLogEntry['actionType']) => {
    switch (actionType) {
      case 'ban':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200">
            <Ban className="w-3 h-3 text-rose-600" />
            <span>حظر حساب طالب</span>
          </span>
        );
      case 'unban':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>إلغاء حظر حساب</span>
          </span>
        );
      case 'suspend':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>إيقاف مؤقت</span>
          </span>
        );
      case 'permission_change':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200">
            <Key className="w-3 h-3 text-purple-600" />
            <span>تعديل صلاحيات</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span>تعديل حساب</span>
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs space-y-5"
      dir="rtl"
    >
      {/* الترويسة والبحث */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#FFCB74]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-[#2F2F2F] dark:text-white">
              سجل إجراءات وعمليات الأدمن (Audit & Compliance Log)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Immutable Admin Activity & Enforcement History
            </p>
          </div>
        </div>

        {/* البحث والتصفية */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث في السجل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-8 pl-3 py-1.5 rounded-xl text-xs bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFCB74]"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] font-bold text-[#2F2F2F] dark:text-white focus:outline-none focus:border-[#FFCB74]"
            >
              <option value="all">جميع الإجراءات</option>
              <option value="ban">عمليات الحظر</option>
              <option value="suspend">الإيقاف المؤقت</option>
              <option value="permission_change">تغيير الصلاحيات</option>
            </select>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2F2F2F]">
        <table className="w-full text-right border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#F6F6F6] dark:bg-[#252525] border-b border-slate-200 dark:border-[#2F2F2F] text-slate-500 dark:text-slate-400 font-bold">
              <th className="py-3 px-4">التاريخ والوقت</th>
              <th className="py-3 px-4">المشرف المنفّذ</th>
              <th className="py-3 px-4">نوع الإجراء</th>
              <th className="py-3 px-4">المستخدم المستهدف</th>
              <th className="py-3 px-4">السبب والتفاصيل المسجلة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#262626]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                  لا توجد سجلات مطابقة في أرشيف الإجراءات.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[#F6F6F6]/60 dark:hover:bg-[#252525]/40 transition-colors"
                >
                  {/* التاريخ */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FFCB74]" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </td>

                  {/* المشرف */}
                  <td className="py-3.5 px-4 font-bold text-[#2F2F2F] dark:text-white whitespace-nowrap">
                    {log.adminName}
                  </td>

                  {/* الإجراء */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getActionBadge(log.actionType)}
                  </td>

                  {/* المستخدم المستهدف */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#2F2F2F] dark:text-slate-200 block">
                      {log.targetUserName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      ID: {log.targetUserId}
                    </span>
                  </td>

                  {/* السبب والتفاصيل */}
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      {log.details}
                    </div>
                    {log.reason && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                        السبب: "{log.reason}"
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsTable;

