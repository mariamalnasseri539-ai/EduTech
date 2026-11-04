import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className="p-4 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-slate-200 dark:border-[#2F2F2F] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      dir="rtl"
    >
      {/* نطاق العناصر المعروضة */}
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <span>
          عرض <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">{startItem}</span> -{' '}
          <span className="font-bold font-mono text-[#2F2F2F] dark:text-white">{endItem}</span> من أصل{' '}
          <span className="font-bold font-mono text-[#2F2F2F] dark:text-[#FFCB74]">{totalItems}</span> مستخدم
        </span>

        {/* اختيار عدد الصفوف في الصفحة */}
        <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-[#333333]">
          <span>في الصفحة:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-[#F6F6F6] dark:bg-[#252525] border border-slate-200 dark:border-[#333333] font-bold text-[#2F2F2F] dark:text-white focus:outline-none focus:border-[#FFCB74]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* أزرار الصفحات */}
      <div className="flex items-center gap-1.5">
        {/* السابق */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="الصفحة السابقة"
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* أرقام الصفحات */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg font-bold font-mono transition-all ${
              currentPage === pageNum
                ? 'bg-[#FFCB74] text-[#111111] shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A2A2A]'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* التالي */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-[#333333] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A2A2A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="الصفحة التالية"
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;

