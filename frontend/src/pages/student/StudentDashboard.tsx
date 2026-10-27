import React from 'react';

/**
 * Student Workspace Page
 * Dedicated space for the team to build student features.
 */
export const StudentDashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">لوحة الطالب (Student)</h1>
      <p className="text-slate-500 text-sm">مساحة مخصصة لأعضاء الفريق لبناء وتصميم واجهات الطالب والتعلّم.</p>
    </div>
  );
};

export default StudentDashboard;
