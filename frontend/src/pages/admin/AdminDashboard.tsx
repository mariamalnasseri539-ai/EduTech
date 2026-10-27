import React from 'react';

/**
 * Admin Workspace Page
 * Dedicated space for the team to build administrator features.
 */
export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">لوحة تحكم الإدارة (Admin)</h1>
      <p className="text-slate-500 text-sm">مساحة مخصصة لأعضاء الفريق لبناء وتصميم واجهات الإدارة.</p>
    </div>
  );
};

export default AdminDashboard;
