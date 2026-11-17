import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Flame,
  TrendingUp,
  Target,
  Compass,
  Award,
  Archive,
  AlertCircle,
} from 'lucide-react';

export const ReportsScreen = () => {
  const [report, setReport] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport(selectedYear);
  }, [selectedYear]);

  const loadReport = async (year) => {
    try {
      setLoading(true);
      const data = await api.getRetrospective(year);
      setReport(data);
      if (data.selectedYear) {
        setSelectedYear(data.selectedYear);
      }
    } catch (err) {
      console.error('Failed to load yearly retrospective:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !report) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = report?.stats || {
    totalGoals: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    plannedGoals: 0,
    droppedGoals: 0,
    yearlyCompletionRate: 0,
    longestRitualStreak: 0,
  };

  const visionReports = report?.visionReports || [];
  const availableYears = report?.availableYears || [new Date().getFullYear()];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Year Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-400" />
            <span>Yearly Retrospective & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review yearly execution by Vision buckets. Historical goals are fully preserved and surfaced.
          </p>
        </div>

        {/* Year Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-indigo-400 ml-2" />
          <span className="text-xs font-semibold text-slate-400">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr} Annual Retro
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Key Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Completion Rate */}
        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Completion Rate
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {stats.yearlyCompletionRate}%
          </div>
          <p className="text-[10px] text-slate-400">Target Year {selectedYear}</p>
        </div>

        {/* Completed Goals */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-slate-100">
            {stats.completedGoals}
            <span className="text-sm font-medium text-slate-500"> / {stats.totalGoals}</span>
          </div>
          <p className="text-[10px] text-slate-400">Finished milestones</p>
        </div>

        {/* Still In Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              In Progress
            </span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-slate-100">
            {stats.inProgressGoals}
          </div>
          <p className="text-[10px] text-slate-400">Currently active work</p>
        </div>

        {/* Planned / Not Started */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Planned
            </span>
            <Circle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-100">
            {stats.plannedGoals}
          </div>
          <p className="text-[10px] text-slate-400">In the pipeline</p>
        </div>

        {/* Longest Ritual Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Top Streak
            </span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">
            {stats.longestRitualStreak}d
          </div>
          <p className="text-[10px] text-slate-400">Max habit streak</p>
        </div>
      </div>

      {/* Grouped by Vision -> Yearly Goal with 3 Buckets */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <span>Vision Breakdown ({selectedYear})</span>
          </h2>
          <span className="text-xs text-slate-400">
            {visionReports.length} Life Areas
          </span>
        </div>

        {visionReports.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-xs text-slate-400">
            No goals recorded for {selectedYear}.
          </div>
        ) : (
          visionReports.map((vr) => (
            <div
              key={vr.visionId || 'unassigned'}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
            >
              {/* Vision Header with Progress */}
              <div
                className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{
                  borderLeft: `6px solid ${vr.color || '#6366f1'}`,
                  background: `linear-gradient(90deg, ${vr.color}15 0%, transparent 80%)`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {vr.lifeArea}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">
                      {vr.totalGoals} Total Goals
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {vr.visionTitle}
                  </h3>
                  {vr.visionDescription && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {vr.visionDescription}
                    </p>
                  )}
                </div>

                {/* Progress bar per vision */}
                <div className="min-w-[180px] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Vision Completion</span>
                    <span className="font-bold text-indigo-300">{vr.completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${vr.completionRate}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {vr.completedGoals} of {vr.totalGoals} goals finished
                  </div>
                </div>
              </div>

              {/* The 3 Buckets Grid */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-950/40">
                {/* Bucket 1: Completed */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Completed ({vr.completed.length})
                    </h4>
                  </div>

                  {vr.completed.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                      None completed yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {vr.completed.map((g) => (
                        <div
                          key={g.id}
                          className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-200">
                              {g.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-900/60 text-emerald-300 rounded font-bold flex-shrink-0">
                              DONE
                            </span>
                          </div>
                          {g.completedAt && (
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Completed {g.completedAt.split('T')[0]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bucket 2: Still In Progress */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      Still In Progress ({vr.inProgress.length})
                    </h4>
                  </div>

                  {vr.inProgress.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                      No goals currently in progress
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {vr.inProgress.map((g) => (
                        <div
                          key={g.id}
                          className="p-3 bg-blue-950/20 border border-blue-800/40 rounded-xl space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-200">
                              {g.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-blue-900/60 text-blue-300 rounded font-bold flex-shrink-0">
                              IN PROGRESS
                            </span>
                          </div>
                          {g.description && (
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              {g.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bucket 3: Planned / Not Started */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Circle className="w-4 h-4 text-slate-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Planned / Not Started ({vr.planned.length})
                    </h4>
                  </div>

                  {vr.planned.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                      No planned goals
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {vr.planned.map((g) => (
                        <div
                          key={g.id}
                          className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-300">
                              {g.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-bold flex-shrink-0">
                              PLANNED
                            </span>
                          </div>
                          {g.description && (
                            <p className="text-[10px] text-slate-400 line-clamp-1">
                              {g.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropped / Archived bucket footer (if any exists) */}
              {vr.dropped && vr.dropped.length > 0 && (
                <div className="px-5 py-3 bg-rose-950/20 border-t border-rose-900/30 flex items-center justify-between text-xs text-rose-300">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-rose-400" />
                    <span>
                      <strong>{vr.dropped.length}</strong> goals archived / dropped for this vision
                    </span>
                  </div>
                  <span className="text-[10px] text-rose-400/80">Surfaced for historical audit</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
