import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X, Check } from 'lucide-react';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  placeholder?: string;
}

const formatDateToInput = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Date Range',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState(value.startDate);
  const [customEnd, setCustomEnd] = useState(value.endDate);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync custom inputs with external value
  useEffect(() => {
    setCustomStart(value.startDate);
    setCustomEnd(value.endDate);
  }, [value.startDate, value.endDate]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectPreset = (key: string) => {
    const today = new Date();
    let start = '';
    let end = formatDateToInput(today);
    let label = 'Date Range';

    switch (key) {
      case 'ALL':
        start = '';
        end = '';
        label = 'All Time';
        break;
      case 'TODAY': {
        start = formatDateToInput(today);
        end = formatDateToInput(today);
        label = 'Today';
        break;
      }
      case 'YESTERDAY': {
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        start = formatDateToInput(yest);
        end = formatDateToInput(yest);
        label = 'Yesterday';
        break;
      }
      case '7D': {
        const d7 = new Date(today);
        d7.setDate(d7.getDate() - 7);
        start = formatDateToInput(d7);
        label = 'Last 7 Days';
        break;
      }
      case '30D': {
        const d30 = new Date(today);
        d30.setDate(d30.getDate() - 30);
        start = formatDateToInput(d30);
        label = 'Last 30 Days';
        break;
      }
      case '90D': {
        const d90 = new Date(today);
        d90.setDate(d90.getDate() - 90);
        start = formatDateToInput(d90);
        label = 'Last 90 Days';
        break;
      }
      case 'THIS_MONTH': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        start = formatDateToInput(monthStart);
        label = 'This Month';
        break;
      }
      case 'THIS_YEAR': {
        const yearStart = new Date(today.getFullYear(), 0, 1);
        start = formatDateToInput(yearStart);
        label = 'This Year';
        break;
      }
      default:
        break;
    }

    onChange({ startDate: start, endDate: end, label });
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart && !customEnd) {
      selectPreset('ALL');
      return;
    }

    let displayLabel = 'Custom Range';
    if (customStart && customEnd) {
      displayLabel = `${customStart} to ${customEnd}`;
    } else if (customStart) {
      displayLabel = `From ${customStart}`;
    } else if (customEnd) {
      displayLabel = `Until ${customEnd}`;
    }

    onChange({
      startDate: customStart,
      endDate: customEnd,
      label: displayLabel,
    });
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: '', endDate: '', label: 'All Time' });
    setCustomStart('');
    setCustomEnd('');
  };

  const isCustomActive = Boolean(value.startDate || value.endDate);
  const activeLabel = isCustomActive ? value.label : placeholder;

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
          isCustomActive
            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-xs'
            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Calendar className={`w-3.5 h-3.5 ${isCustomActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
        <span className="max-w-[140px] truncate">{activeLabel}</span>

        {isCustomActive ? (
          <span
            onClick={handleClear}
            title="Clear date filter"
            className="p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 ml-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#0b132b] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-100">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Quick Select
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'ALL', label: 'All Time' },
                { id: 'TODAY', label: 'Today' },
                { id: '7D', label: 'Last 7 Days' },
                { id: '30D', label: 'Last 30 Days' },
                { id: 'THIS_MONTH', label: 'This Month' },
                { id: 'THIS_YEAR', label: 'This Year' },
              ].map((item) => {
                const isSelected = value.label === item.label || (item.id === 'ALL' && !isCustomActive);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPreset(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Custom Date Range
            </div>
            <form onSubmit={handleApplyCustom} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    END DATE
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                >
                  Apply Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
