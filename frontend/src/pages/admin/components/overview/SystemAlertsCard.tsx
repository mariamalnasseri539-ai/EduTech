import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  AlertCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { SYSTEM_ALERTS, SystemAlertItem } from '../../data/overviewData';

interface SystemAlertsCardProps {
  onNavigateToSection?: (section: 'cohort' | 'telemetry' | 'users') => void;
}

export const SystemAlertsCard: React.FC<SystemAlertsCardProps> = ({ onNavigateToSection }) => {
  const [alerts, setAlerts] = useState<SystemAlertItem[]>(SYSTEM_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'technical'>('all');

  const filteredAlerts = alerts.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const renderSeverityIcon = (severity: SystemAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (severity: SystemAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-r-4 border-r-rose-500';
      case 'warning':
        return 'border-r-4 border-r-[#FFCB74]';
      case 'info':
        return 'border-r-4 border-r-blue-500';
    }
  };

  const handleActionClick = (alertId: string) => {
    if (!onNavigateToSection) return;
    if (alertId === 'alt-1') onNavigateToSection('cohort');
    else if (alertId === 'alt-2') onNavigateToSection('telemetry');
    else if (alertId === 'alt-3') onNavigateToSection('users');
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-[#2F2F2F] shadow-xs">
      {/* الترويسة وأزرار التصفية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-[#FFCB74]">
            <Bell className="w-5 h-5" />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#2F2F2F] dark:text-white">
                التنبيهات الأكاديمية والتقنية
              </h3>
              {alerts.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Academic Diagnosis & AI System Health Alerts
            </p>
          </div>
        </div>

        {/* فلاتر التصنيف */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] text-xs self-start sm:self-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            الكل ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedCategory('academic')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedCategory === 'academic'
                ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            أكاديمي
          </button>
          <button
            onClick={() => setSelectedCategory('technical')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              selectedCategory === 'technical'
                ? 'bg-white dark:bg-[#1E1E1E] text-[#2F2F2F] dark:text-[#FFCB74] shadow-xs'
                : 'text-slate-500 hover:text-[#2F2F2F] dark:hover:text-white'
            }`}
          >
            تقني
          </button>
        </div>
      </div>

      {/* قائمة التنبيهات */}
      <div className="mt-4 space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-[#F6F6F6]/60 dark:bg-[#242424] rounded-xl border border-dashed border-slate-200 dark:border-[#333333]">
            لا توجد تنبيهات نشطة حالياً، جميع المؤشرات طبيعية.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl bg-[#F6F6F6]/70 dark:bg-[#242424] border border-slate-200/80 dark:border-[#333333] transition-all hover:border-[#FFCB74]/60 ${getBorderColor(
                alert.severity
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {renderSeverityIcon(alert.severity)}
                  </div>

                  <div className="text-right">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#2F2F2F] dark:text-white leading-tight">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        • {alert.timestamp}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {alert.description}
                    </p>

                    {/* زر الإجراء */}
                    {alert.actionText && (
                      <button
                        onClick={() => handleActionClick(alert.id)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2F2F2F] dark:text-[#FFCB74] hover:underline"
                      >
                        <span>{alert.actionText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* زر تأكيد/إخفاء التنبيه */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  title="تمت الملاحظة (إخفاء التنبيه)"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SystemAlertsCard;

