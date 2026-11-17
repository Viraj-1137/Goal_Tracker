import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  Zap,
  Compass,
  Flame,
  BarChart3,
  Calendar,
} from 'lucide-react';

const navItems = [
  {
    to: '/',
    label: 'Home / Focus',
    icon: LayoutDashboard,
    badge: 'Daily',
  },
  {
    to: '/workspace',
    label: 'Workspace Board',
    icon: KanbanSquare,
  },
  {
    to: '/sprint',
    label: 'Active Sprint',
    icon: Zap,
    highlight: true,
  },
  {
    to: '/visions',
    label: 'Vision & Goals',
    icon: Compass,
  },
  {
    to: '/rituals',
    label: 'Rituals Tracker',
    icon: Flame,
  },
  {
    to: '/reports',
    label: 'Reports / Retro',
    icon: BarChart3,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-60 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-3.5rem)]">
      <div>
        <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom info card */}
      <div className="p-3 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 rounded-xl border border-indigo-900/20 text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          Focus Philosophy
        </div>
        <p className="text-slate-400 leading-relaxed">
          Align daily rituals and Jira sprints directly with your multi-year life vision.
        </p>
      </div>
    </aside>
  );
};
