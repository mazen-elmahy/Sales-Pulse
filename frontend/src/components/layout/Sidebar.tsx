import React from 'react';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  ShieldCheck,
  LogOut,
  Radio,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type ActiveTab = 'overview' | 'inventory' | 'sales';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isMock: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isMock }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory' as ActiveTab, label: 'Inventory', icon: Package },
    { id: 'sales' as ActiveTab, label: 'Sales & Activity', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-[#0c0f50] text-slate-100 flex flex-col justify-between shrink-0 shadow-xl border-r border-[#29244f]">
      {/* Top Branding */}
      <div>
        <div className="h-18 flex items-center px-6 border-b border-[#29244f] bg-[#0c0f50]/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#bc4ea9] to-[#ecbc8c] flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-white flex items-center">
                Sales<span className="text-[#ecbc8c]">Pulse</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Admin Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Read-Only Badge Notification */}
        <div className="mx-4 my-4 p-3 rounded-lg bg-[#29244f]/90 border border-[#9e5a95]/30">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#ecbc8c]">
            <ShieldCheck className="w-4 h-4 text-[#ecbc8c]" />
            <span>Read-Only Portal</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Data viewing & analytics only. Mutating operations remain restricted to Telegram & n8n.
          </p>
        </div>

        {/* Nav links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#bc4ea9] text-white shadow-md'
                    : 'text-slate-300 hover:bg-[#29244f] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#b0c0c4]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Status */}
      <div className="p-4 border-t border-[#29244f] bg-[#0c0f50]/90 space-y-3">
        {/* Backend Connection status */}
        <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded-md bg-[#29244f]/60 text-slate-300">
          <div className="flex items-center space-x-2">
            <Radio className={`w-3.5 h-3.5 ${isMock ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
            <span>{isMock ? 'Demo Simulation' : 'Live n8n Backend'}</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="truncate mr-2">
            <div className="text-xs font-semibold text-white truncate">
              {user?.email || 'admin@salespulse.co'}
            </div>
            <div className="text-[10px] text-slate-400 capitalize">
              {user?.role || 'Administrator'}
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#29244f] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
