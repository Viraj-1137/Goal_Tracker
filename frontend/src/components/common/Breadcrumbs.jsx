import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Compass, Target, Calendar, CheckSquare } from 'lucide-react';

export const Breadcrumbs = ({
  visionId,
  visionTitle,
  yearlyGoalId,
  yearlyGoalTitle,
  weeklyGoalId,
  weeklyGoalTitle,
  taskTitle,
  onNavigate,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleVisionClick = (e) => {
    e.stopPropagation();
    if (onNavigate) onNavigate('vision', visionId);
    else navigate('/visions');
  };

  const handleYearlyClick = (e) => {
    e.stopPropagation();
    if (onNavigate) onNavigate('yearly', yearlyGoalId);
    else navigate('/visions');
  };

  const handleWeeklyClick = (e) => {
    e.stopPropagation();
    if (onNavigate) onNavigate('weekly', weeklyGoalId);
    else navigate('/sprint');
  };

  const hasAny = visionTitle || yearlyGoalTitle || weeklyGoalTitle;

  if (!hasAny) {
    return (
      <div className={`flex items-center text-xs text-slate-400 italic ${className}`}>
        <span>Standalone Task (no linked goal)</span>
      </div>
    );
  }

  return (
    <nav className={`flex items-center flex-wrap gap-1.5 text-xs text-slate-400 ${className}`}>
      {visionTitle && (
        <button
          type="button"
          onClick={handleVisionClick}
          className="flex items-center gap-1 hover:text-indigo-400 font-medium text-slate-300 transition-colors"
          title={`Vision: ${visionTitle}`}
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[140px]">{visionTitle}</span>
        </button>
      )}

      {visionTitle && yearlyGoalTitle && (
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
      )}

      {yearlyGoalTitle && (
        <button
          type="button"
          onClick={handleYearlyClick}
          className="flex items-center gap-1 hover:text-amber-400 font-medium text-slate-300 transition-colors"
          title={`Yearly Goal: ${yearlyGoalTitle}`}
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[140px]">{yearlyGoalTitle}</span>
        </button>
      )}

      {(visionTitle || yearlyGoalTitle) && weeklyGoalTitle && (
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
      )}

      {weeklyGoalTitle && (
        <button
          type="button"
          onClick={handleWeeklyClick}
          className="flex items-center gap-1 hover:text-teal-400 font-medium text-slate-300 transition-colors"
          title={`Sprint: ${weeklyGoalTitle}`}
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span className="truncate max-w-[140px]">{weeklyGoalTitle}</span>
        </button>
      )}

      {taskTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
          <span className="flex items-center gap-1 text-slate-200 font-semibold truncate max-w-[180px]">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{taskTitle}</span>
          </span>
        </>
      )}
    </nav>
  );
};
