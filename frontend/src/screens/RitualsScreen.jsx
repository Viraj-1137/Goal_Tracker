import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  Plus,
  Calendar,
  Zap,
  Award,
  Trash2,
  X,
  Compass,
} from 'lucide-react';

export const RitualsScreen = ({ visions = [] }) => {
  const [rituals, setRituals] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rList, hMap] = await Promise.all([
        api.getRituals(),
        api.getHeatmap(),
      ]);
      setRituals(rList);
      setHeatmapData(hMap);
    } catch (err) {
      console.error('Failed to load rituals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (ritual) => {
    try {
      // Optimistic streak increment
      const wasDone = ritual.completedToday;
      await api.toggleRitual(ritual.id, null, !wasDone);

      if (!wasDone) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      }

      loadData();
    } catch (err) {
      console.error('Failed to toggle ritual:', err);
    }
  };

  const handleDeleteRitual = async (id) => {
    if (window.confirm('Archive this ritual? Past logs remain saved.')) {
      try {
        await api.archiveRitual(id);
        loadData();
      } catch (err) {
        console.error('Failed to delete ritual:', err);
      }
    }
  };

  // Generate GitHub-style heatmap days (last 20 weeks = 140 days)
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Start from Sunday of 20 weeks ago
    const totalDays = 140;
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const count = heatmapData[iso] || 0;
      days.push({
        date: iso,
        count,
        dayOfWeek: d.getDay(),
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
    }
    return days;
  }, [heatmapData]);

  // Group days into 7 rows (Sunday to Saturday)
  const heatmapGrid = useMemo(() => {
    const weeks = [];
    let currentWeek = [];

    heatmapDays.forEach((day, index) => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6 || index === heatmapDays.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [heatmapDays]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-800/80 border-slate-700/50 hover:ring-1 hover:ring-slate-500';
    if (count === 1) return 'bg-emerald-950 border-emerald-800/80 hover:ring-1 hover:ring-emerald-400';
    if (count === 2) return 'bg-emerald-700 border-emerald-600 hover:ring-1 hover:ring-emerald-300';
    return 'bg-emerald-400 border-emerald-300 text-slate-950 hover:ring-1 hover:ring-white';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-amber-400" />
            <span>Rituals & Habit Streaks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build compounding momentum. Track daily/weekly habits with streak counts and visual heatmaps.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ritual</span>
        </button>
      </div>

      {/* GitHub-Style Contribution Heatmap Card */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Daily Ritual Consistency (Past 20 Weeks)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-700 border border-emerald-600"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300"></div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-max">
            {/* Day of week labels */}
            <div className="flex flex-col justify-between text-[9px] text-slate-400 pr-2 select-none">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks */}
            {heatmapGrid.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-all ${getColorClass(
                      day.count
                    )}`}
                    title={`${day.count} rituals completed on ${day.formatted}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hovered Day Status Bar */}
        <div className="text-xs text-slate-400 h-5 flex items-center">
          {hoveredDay ? (
            <span>
              <strong className="text-slate-200">{hoveredDay.count}</strong> rituals completed on{' '}
              <span className="text-emerald-400 font-medium">{hoveredDay.formatted}</span>
            </span>
          ) : (
            <span className="text-slate-400">Hover over any square to see daily details</span>
          )}
        </div>
      </div>

      {/* Rituals List Checklist */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>Active Daily Rituals</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {rituals.length}
          </span>
        </h2>

        {rituals.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-3xl text-xs text-slate-400 space-y-2">
            <p>No rituals added yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
            >
              Add Your First Ritual
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rituals.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl shadow-sm transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(r)}
                    className="mt-0.5 w-6 h-6 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center hover:border-emerald-400 transition-colors flex-shrink-0"
                    title="Log ritual completion for today"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-200 truncate">
                        {r.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {r.frequency}
                      </span>
                    </div>

                    {r.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    )}

                    {r.visionTitle && (
                      <div className="flex items-center gap-1 text-[11px] text-indigo-400 mt-1">
                        <Compass className="w-3 h-3" />
                        <span>{r.visionTitle}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Streak Counters & Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Current Streak */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      <span>{r.currentStreak}d</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Best: <span className="text-slate-300 font-medium">{r.bestStreak}d</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRitual(r.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Archive Ritual"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ritual Modal */}
      {showCreateModal && (
        <CreateRitualModal
          isOpen={showCreateModal}
          visions={visions}
          onClose={() => setShowCreateModal(false)}
          onRitualCreated={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

const CreateRitualModal = ({ isOpen, visions = [], onClose, onRitualCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('DAILY');
  const [visionId, setVisionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      await api.createRitual({
        title,
        description,
        frequency,
        visionId: visionId ? Number(visionId) : null,
      });
      onRitualCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            Create Daily / Weekly Ritual
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Ritual Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 90-Minute Morning Deep Work"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="DAILY">Daily Habit</option>
              <option value="WEEKLY">Weekly Recurring</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Link to Life Vision (Optional)
            </label>
            <select
              value={visionId}
              onChange={(e) => setVisionId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Standalone (No Vision linked)</option>
              {visions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.lifeArea})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define rules, triggers, and time block..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all"
            >
              {submitting ? 'Creating...' : 'Create Ritual'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
