import React from 'react';
import { Sparkles, Network, BarChart3, BookOpen, LogOut } from 'lucide-react';
import { CognitiveStatus } from '../types/knowledge';
import { useAuth } from '../context/AuthContext';
import { PlatformLogo } from './common/PlatformLogo';
import { ThemeToggle } from './common/ThemeToggle';

interface NavbarProps {
  activeTab: 'lesson' | 'topic-map' | 'admin';
  setActiveTab: (tab: 'lesson' | 'topic-map' | 'admin') => void;
  cognitiveStatus: CognitiveStatus;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cognitiveStatus,
}) => {
  const { userProfile, role, logout } = useAuth();

  const studentName = userProfile?.display_name || 'طالب';

  const getStatusText = (status: CognitiveStatus) => {
    switch (status) {
      case 'Mastered':
        return 'مُتقَن';
      case 'GuidedReview':
        return 'مراجعة موجهة';
      case 'Assessing':
        return 'تقييم';
      case 'ActiveLearning':
        return 'قيد التعلّم';
      default:
        return 'جديد';
    }
  };

  const getStatusBadge = () => {
    switch (cognitiveStatus) {
      case 'Mastered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'GuidedReview':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse';
      case 'Assessing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ActiveLearning':
        return 'bg-[#FFCB74]/20 text-[#FFCB74] border-[#FFCB74]/40';
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#333333] bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <PlatformLogo size={42} />
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                إديوتك
              </span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-[#FFCB74]/20 text-[#111111] dark:text-[#FFCB74] border border-[#FFCB74]/40 font-mono">
                EduTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              المنصة التعليمية التفاعلية الذكية
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 space-x-reverse bg-slate-100 dark:bg-[#2F2F2F] p-1 rounded-2xl border border-slate-200 dark:border-[#3d3d3d]">
          {role !== 'ADM' && (
            <>
              <button
                onClick={() => setActiveTab('lesson')}
                className={`flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'lesson'
                    ? 'bg-[#FFCB74] text-[#111111] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>الدرس</span>
              </button>

              <button
                onClick={() => setActiveTab('topic-map')}
                className={`flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'topic-map'
                    ? 'bg-[#FFCB74] text-[#111111] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Network className="h-4 w-4" />
                <span>المسار التعليمي</span>
              </button>
            </>
          )}

          {role === 'ADM' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 space-x-reverse px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#FFCB74] text-[#111111] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>لوحة الإشراف</span>
            </button>
          )}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
          {/* Status Badge */}
          {role !== 'ADM' && (
            <div className={`hidden md:flex items-center space-x-1.5 space-x-reverse px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{getStatusText(cognitiveStatus)}</span>
            </div>
          )}

          {/* Theme Toggle Capsule Button (كبس زر لمبة مائي) */}
          <ThemeToggle />

          {/* User Avatar & Logout */}
          <div className="flex items-center space-x-2 space-x-reverse pr-2 border-r border-slate-200 dark:border-[#333333]">
            <div
              className="h-8 w-8 rounded-full bg-[#FFCB74]/20 border border-[#FFCB74]/40 flex items-center justify-center text-[#111111] dark:text-[#FFCB74] font-bold text-xs"
              title={studentName}
            >
              {studentName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
