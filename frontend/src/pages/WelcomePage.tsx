import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import { AdminDashboard } from './admin/AdminDashboard';
import { StudentDashboard } from './student/StudentDashboard';
import { PlatformLogo } from '../components/common/PlatformLogo';

export const WelcomePage: React.FC = () => {
  const { userProfile, role, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'welcome' | 'admin' | 'student'>('welcome');

  const displayName = userProfile?.display_name || userProfile?.email || 'User';

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={() => setCurrentView('welcome')}
            className="text-xs text-blue-600 hover:underline"
          >
            ← العودة للرئيسية
          </button>
          <button onClick={logout} className="text-xs text-red-500 hover:underline">
            تسجيل الخروج
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  if (currentView === 'student') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111]">
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={() => setCurrentView('welcome')}
            className="text-xs text-blue-600 hover:underline"
          >
            ← العودة للرئيسية
          </button>
          <button onClick={logout} className="text-xs text-red-500 hover:underline">
            تسجيل الخروج
          </button>
        </div>
        <StudentDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#111111] flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-100">
      <div className="text-center max-w-md w-full space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <PlatformLogo size={72} />
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            أهلاً بك، <span className="font-semibold text-slate-900 dark:text-white">{displayName}</span>
          </p>
          <div className="inline-flex items-center space-x-1.5 space-x-reverse px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {role === 'ADM' ? <Shield className="h-3.5 w-3.5 text-purple-500" /> : <User className="h-3.5 w-3.5 text-emerald-500" />}
            <span>{role === 'ADM' ? 'حساب مسؤول (Admin)' : 'حساب طالب (Student)'}</span>
          </div>
        </div>

        {/* Links to Team Dev Folders */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setCurrentView('student')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
          >
            مساحة واجهات الطالب (pages/student)
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
          >
            مساحة واجهات الإدارة (pages/admin)
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج (Sign Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
