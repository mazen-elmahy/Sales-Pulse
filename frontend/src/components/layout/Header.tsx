import React, { useState } from 'react';
import { Calendar, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FilterParams } from '../../types/dashboard';

interface HeaderProps {
  title: string;
  subtitle: string;
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isMock: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  filters,
  onFilterChange,
  onRefresh,
  isLoading,
  isMock,
}) => {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customFrom, setCustomFrom] = useState(filters.from);
  const [customTo, setCustomTo] = useState(filters.to);

  const getCairoDateOffset = (daysAgo: number): string => {
    const d = new Date(Date.now() - daysAgo * 86400000);
    return d.toISOString().slice(0, 10);
  };

  const handlePresetChange = (preset: 'today' | '7d' | '30d' | '90d' | 'custom') => {
    if (preset === 'custom') {
      setShowCustomRange(true);
      return;
    }
    setShowCustomRange(false);
    const today = getCairoDateOffset(0);
    let fromDate = today;
    if (preset === '7d') fromDate = getCairoDateOffset(6);
    else if (preset === '30d') fromDate = getCairoDateOffset(29);
    else if (preset === '90d') fromDate = getCairoDateOffset(89);

    onFilterChange({
      ...filters,
      from: fromDate,
      to: today,
    });
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFrom && customTo && customFrom <= customTo) {
      onFilterChange({
        ...filters,
        from: customFrom,
        to: customTo,
      });
      setShowCustomRange(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isMock
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {isMock ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Demo Data Mode</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected (n8n API)</span>
              </>
            )}
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => handlePresetChange('today')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                !showCustomRange && filters.from === filters.to
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handlePresetChange('7d')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                !showCustomRange && filters.from === getCairoDateOffset(6)
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => handlePresetChange('30d')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                !showCustomRange && filters.from === getCairoDateOffset(29)
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => handlePresetChange('90d')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                !showCustomRange && filters.from === getCairoDateOffset(89)
                  ? 'bg-white shadow-xs text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              90D
            </button>
            <button
              onClick={() => handlePresetChange('custom')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium flex items-center space-x-1 ${
                showCustomRange ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Custom</span>
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-50"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#bc4ea9]' : ''}`} />
          </button>
        </div>
      </div>

      {showCustomRange && (
        <form
          onSubmit={handleApplyCustom}
          className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs"
        >
          <span className="font-medium text-slate-700">Custom Date Range (Africa/Cairo):</span>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#bc4ea9]"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#bc4ea9]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#bc4ea9] text-white rounded-md font-medium hover:bg-[#9e5a95] transition-colors"
          >
            Apply Range
          </button>
          <button
            type="button"
            onClick={() => setShowCustomRange(false)}
            className="px-2 py-1.5 text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </form>
      )}
    </header>
  );
};
