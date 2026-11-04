import React from 'react';
import { Users, GraduationCap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserStats } from '../../types';

interface UserStatsCardsProps {
  stats: UserStats;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
      {/* 1. إجمالي المستخدمين */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
            إجمالي المستخدمين
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
            {stats.totalUsers}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            Total Registered Users
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FFCB74]/15 border border-[#FFCB74]/30 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* 2. عدد الطلاب */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
            عدد الطلاب المسجلين
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
            {stats.studentsCount}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
            حسابات الطلاب (STD)
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <GraduationCap className="w-6 h-6" />
        </div>
      </div>

      {/* 3. عدد المشرفين */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
            عدد المشرفين والإدارة
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
            {stats.adminsCount}
          </span>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
            صلاحيات المسؤول (ADM)
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      {/* 4. الحسابات النشطة */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
            الحسابات النشطة
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#2F2F2F] dark:text-white font-mono">
            {stats.activeCount}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            Active Status Accounts
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#2F2F2F] dark:text-[#FFCB74]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default UserStatsCards;

