import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import confetti from 'canvas-confetti';
import {
  Target,
  Zap,
  CheckCircle2,
  Circle,
  Flame,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Plus,
  Clock,
} from 'lucide-react';

export const DashboardScreen = ({ onOpenTaskDetail, onOpenCreateTask }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    try {
      await api.updateTaskStatus(task.id, newStatus);
      if (newStatus === 'DONE') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      loadSummary();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleToggleRitual = async (ritual) => {
    try {
      await api.toggleRitual(ritual.id, null, !ritual.completedToday);
      if (!ritual.completedToday) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      }
      loadSummary();
    } catch (err) {
      console.error('Failed to toggle ritual:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const activeGoal = summary?.activeWeeklyGoal;
  const sprintStats = summary?.sprintStats || { totalTasks: 0, completedTasks: 0, completionPercentage: 0 };
  const todayTasks = summary?.todayTasks || [];
  const todayRituals = summary?.todayRituals || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Daily Focus Dashboard</span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Prioritize what matters today. Keep your daily rituals aligned with your life vision.
          </p>
        </div>

        {/* Quick stats pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Done Today: </span>
              <span className="font-bold text-slate-200">{summary?.completedTasksToday || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Top Streak: </span>
              <span className="font-bold text-amber-400">{summary?.longestStreak || 0}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero: Prominent Vision-Board Style Active Sprint Goal */}
      {activeGoal ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
          {/* Background decorative glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              {/* Vision / Parent Breadcrumb Pill */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 text-[11px] font-bold bg-teal-500/20 text-teal-300 rounded-lg border border-teal-500/30 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  ACTIVE SPRINT
                </span>
                {activeGoal.visionTitle && (
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <span>•</span>
                    <span className="text-indigo-300 font-semibold">{activeGoal.visionTitle}</span>
                  </span>
                )}
                {activeGoal.yearlyGoalTitle && (
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <span>•</span>
                    <span className="text-amber-300 font-medium">{activeGoal.yearlyGoalTitle}</span>
                  </span>
                )}
              </div>

              {/* Goal Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                {activeGoal.title}
              </h2>

              {activeGoal.description && (
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                  {activeGoal.description}
                </p>
              )}

              {/* Sprint Date Range */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>
                  {activeGoal.weekStartDate} to {activeGoal.weekEndDate}
                </span>
              </div>
            </div>

            {/* Sprint Completion Gauge & Action */}
            <div className="flex flex-col items-start md:items-end justify-between min-w-[200px] space-y-4">
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Sprint Progress</span>
                  <span className="font-bold text-teal-400">{sprintStats.completionPercentage}%</span>
                </div>
                {/* Slim progress bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-500 rounded-full"
                    style={{ width: `${sprintStats.completionPercentage}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  {sprintStats.completedTasks} of {sprintStats.totalTasks} tasks completed
                </div>
              </div>

              <Link
                to="/sprint"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <span>Open Sprint Kanban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Zap className="w-8 h-8 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-200">No Active Sprint Right Now</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose a weekly goal from your Vision & Goals board or create one to start your sprint.
          </p>
          <Link
            to="/visions"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
          >
            <span>Browse Goals</span>
          </Link>
        </div>
      )}

      {/* Two Column Grid: Today's Tasks & Today's Rituals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Today's Action Checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-100">Today's Tasks</h2>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {todayTasks.length}
              </span>
            </div>

            <button
              onClick={onOpenCreateTask}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 space-y-2">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <p className="font-medium text-slate-300">All clear for today!</p>
                <p>No tasks scheduled for today. Pull tasks from your sprint or take a breather.</p>
              </div>
            ) : (
              todayTasks.map((t) => {
                const isDone = t.status === 'DONE';
                return (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskDetail(t.id)}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* One-click completion checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTask(t);
                        }}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 hover:border-indigo-400 text-transparent hover:text-slate-400'
                        }`}
                        title={isDone ? 'Mark Todo' : 'Mark Done'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`text-xs font-medium block truncate ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-200 group-hover:text-white'
                          }`}
                        >
                          {t.title}
                        </span>
                        {t.weeklyGoalTitle && (
                          <span className="text-[10px] text-teal-400 truncate block">
                            {t.weeklyGoalTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <PriorityBadge priority={t.priority} size="xs" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Daily Rituals & Streaks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-100">Daily Rituals</h2>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {todayRituals.filter((r) => r.completedToday).length} / {todayRituals.length}
              </span>
            </div>

            <Link
              to="/rituals"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>View Heatmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 space-y-2">
            {todayRituals.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No rituals configured yet. Create a daily habit to track streaks!
              </div>
            ) : (
              todayRituals.map((r) => {
                const isCompleted = r.completedToday;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleToggleRitual(r)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 hover:border-amber-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`text-xs font-semibold block truncate ${
                            isCompleted ? 'text-slate-200' : 'text-slate-300'
                          }`}
                        >
                          {r.title}
                        </span>
                        {r.visionTitle && (
                          <span className="text-[10px] text-indigo-400 truncate block">
                            {r.visionTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Streak badge */}
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-950/50 border border-amber-800/40 rounded-full text-xs font-bold text-amber-400 flex-shrink-0">
                      <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{r.currentStreak}d</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
