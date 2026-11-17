import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Archive, ChevronDown } from 'lucide-react';

const statusConfig = {
  BACKLOG: {
    label: 'Backlog',
    bg: 'bg-slate-800 text-slate-400 border-slate-700',
    icon: Archive,
    iconColor: 'text-slate-400',
  },
  TODO: {
    label: 'To Do',
    bg: 'bg-slate-800/80 text-slate-300 border-slate-700',
    icon: Circle,
    iconColor: 'text-slate-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-blue-950/70 text-blue-300 border-blue-700/60',
    icon: Clock,
    iconColor: 'text-blue-400',
  },
  BLOCKED: {
    label: 'Blocked',
    bg: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
  },
  DONE: {
    label: 'Done',
    bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
  },
};

export const StatusBadge = ({ status = 'TODO', onChange, interactive = true, size = 'sm' }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cfg = statusConfig[status] || statusConfig.TODO;
  const Icon = cfg.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (e, newStatus) => {
    e.stopPropagation();
    setOpen(false);
    if (onChange && newStatus !== status) {
      onChange(newStatus);
    }
  };

  const sizeClasses = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-1 text-xs';

  if (!interactive) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded border ${cfg.bg} ${sizeClasses}`}>
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span>{cfg.label}</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded border ${cfg.bg} ${sizeClasses} hover:brightness-125 transition-all shadow-sm focus:outline-none`}
        title="Click to change status"
      >
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span>{cfg.label}</span>
        <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-36 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1 z-50 text-xs">
          {Object.entries(statusConfig).map(([key, item]) => {
            const ItemIcon = item.icon;
            const isSelected = key === status;
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => handleSelect(e, key)}
                className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                  isSelected ? 'text-indigo-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                }`}
              >
                <ItemIcon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
