import React from 'react';
import { Search, Filter, ArrowUpDown, UserPlus, X } from 'lucide-react';
import { UserRole, AccountStatus } from '../../types';

interface UserFiltersBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedRole: 'all' | UserRole;
  onRoleChange: (val: 'all' | UserRole) => void;
  selectedStatus: 'all' | AccountStatus;
  onStatusChange: (val: 'all' | AccountStatus) => void;
  sortBy: 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc';
  onSortChange: (val: 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc') => void;
  onOpenAddUser: () => void;
  totalFilteredCount: number;
}

export const UserFiltersBar: React.FC<UserFiltersBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  onOpenAddUser,
  totalFilteredCount,
}) => {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col gap-4"
      dir="rtl"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* حقل البحث السريع بالاسم أو البريد */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد الإلكتروني، أو المعرف..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-9 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFCB74] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* زر إضافة مستخدم جديد */}
        <button
          onClick={onOpenAddUser}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FFCB74] text-[#111111] shadow-[0_2px_12px_rgba(255,203,116,0.35)] hover:bg-[#ffd794] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* خيارات التصفية والترتيب */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2A2A2A] text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* فلتر الدور */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 font-semibold">الدور:</span>
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
            >
              <option value="all">جميع الأدوار</option>
              <option value="STD">طلاب فقط (STD)</option>
              <option value="ADM">مشرفين فقط (ADM)</option>
            </select>
          </div>

          {/* فلتر حالة الحساب */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">حالة الحساب:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط (Active)</option>
              <option value="pending">بانتظار التأكيد (Pending)</option>
              <option value="suspended">موقوف مؤقتاً (Suspended)</option>
              <option value="banned">محظور (Banned)</option>
            </select>
          </div>

          {/* ترتيب البيانات */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 font-semibold">الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-[#2F2F2F] dark:text-white font-semibold focus:outline-none focus:border-[#FFCB74]"
            >
              <option value="date_desc">الأحدث تسجيلاً</option>
              <option value="date_asc">الأقدم تسجيلاً</option>
              <option value="name_asc">الاسم (أ - ي)</option>
              <option value="name_desc">الاسم (ي - أ)</option>
            </select>
          </div>
        </div>

        {/* عدد النتائج */}
        <div className="text-slate-400 font-mono text-[11px]">
          نتائج البحث: <span className="font-bold text-[#2F2F2F] dark:text-[#FFCB74]">{totalFilteredCount}</span> مستخدم
        </div>
      </div>
    </div>
  );
};

export default UserFiltersBar;
