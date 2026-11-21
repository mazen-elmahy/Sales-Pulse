import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badgeText,
  badgeVariant = 'info',
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
          <Icon className="w-5 h-5 text-[#bc4ea9]" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {badgeText && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              badgeVariant === 'danger'
                ? 'bg-rose-100 text-rose-700'
                : badgeVariant === 'warning'
                ? 'bg-amber-100 text-amber-700'
                : badgeVariant === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-2 flex items-center text-xs text-slate-500 space-x-1">
          {trend && (
            <span className={`font-semibold mr-1 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.value}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
