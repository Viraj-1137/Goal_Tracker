import React from 'react';
import { ArrowDown, ArrowRight, ArrowUp, AlertCircle } from 'lucide-react';

const priorityConfig = {
  LOW: {
    label: 'Low',
    bg: 'bg-slate-800/80 text-slate-300 border-slate-700',
    icon: ArrowDown,
    iconColor: 'text-slate-400',
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-950/60 text-blue-300 border-blue-800/50',
    icon: ArrowRight,
    iconColor: 'text-blue-400',
  },
  HIGH: {
    label: 'High',
    bg: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    icon: ArrowUp,
    iconColor: 'text-amber-400',
  },
  URGENT: {
    label: 'Urgent',
    bg: 'bg-red-950/60 text-red-300 border-red-800/50 animate-pulse',
    icon: AlertCircle,
    iconColor: 'text-red-400',
  },
};

export const PriorityBadge = ({ priority = 'MEDIUM', showIcon = true, size = 'sm' }) => {
  const cfg = priorityConfig[priority] || priorityConfig.MEDIUM;
  const Icon = cfg.icon;

  const sizeClasses = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded border ${cfg.bg} ${sizeClasses}`}>
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span>{cfg.label}</span>
    </span>
  );
};
