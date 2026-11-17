import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Compass,
  Target,
  Calendar,
  ChevronDown,
  ChevronRight,
  Plus,
  Zap,
  Edit2,
  Trash2,
  CheckCircle2,
  Heart,
  Briefcase,
  DollarSign,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
  X,
} from 'lucide-react';

const ICON_COMPONENTS = {
  Compass,
  Heart,
  Briefcase,
  DollarSign,
  Sparkles,
  TrendingUp,
  Activity,
  Target,
  Zap,
};

export const VisionBoardScreen = ({ onSprintActivated }) => {
  const navigate = useNavigate();
  const [visions, setVisions] = useState([]);
  const [yearlyGoals, setYearlyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expansion states
  const [expandedVisions, setExpandedVisions] = useState({});
  const [expandedYearlyGoals, setExpandedYearlyGoals] = useState({});

  // Modals
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [editingVision, setEditingVision] = useState(null);
  const [showYearlyModal, setShowYearlyModal] = useState(false);
  const [selectedVisionForYearly, setSelectedVisionForYearly] = useState(null);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [selectedYearlyForWeekly, setSelectedYearlyForWeekly] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [vData, ygData, wgData] = await Promise.all([
        api.getVisions(),
        api.getYearlyGoals(),
        api.getWeeklyGoals(),
      ]);
      setVisions(vData);
      setYearlyGoals(ygData);
      setWeeklyGoals(wgData);

      // Auto-expand all visions by default
      const initialExp = {};
      vData.forEach((v) => {
        initialExp[v.id] = true;
      });
      setExpandedVisions(initialExp);
    } catch (err) {
      console.error('Failed to load visions board:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVision = (id) => {
    setExpandedVisions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleYearly = (id) => {
    setExpandedYearlyGoals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleActivateSprint = async (weeklyGoalId) => {
    try {
      await api.activateSprint(weeklyGoalId);
      loadAll();
      if (onSprintActivated) onSprintActivated();
    } catch (err) {
      console.error('Failed to activate sprint:', err);
    }
  };

  const handleDeleteVision = async (id) => {
    if (window.confirm('Archive this Vision? All attached goals remain safely stored.')) {
      try {
        await api.archiveVision(id);
        loadAll();
      } catch (err) {
        console.error('Failed to archive vision:', err);
      }
    }
  };

  const handleDeleteYearly = async (id) => {
    if (window.confirm('Archive this Yearly Goal?')) {
      try {
        await api.archiveYearlyGoal(id);
        loadAll();
      } catch (err) {
        console.error('Failed to archive yearly goal:', err);
      }
    }
  };

  const handleDeleteWeekly = async (id) => {
    if (window.confirm('Archive this Weekly Goal?')) {
      try {
        await api.archiveWeeklyGoal(id);
        loadAll();
      } catch (err) {
        console.error('Failed to archive weekly goal:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-indigo-400" />
            <span>Vision & Goals Hierarchy</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pinboard structure: Vision ➔ Yearly Goals ➔ Weekly Sprints ➔ Tasks. Click any node to drill in.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVision(null);
            setShowVisionModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Vision</span>
        </button>
      </div>

      {/* Visions Grid (Pinboard style cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visions.map((vision) => {
          const isExpanded = !!expandedVisions[vision.id];
          const vGoals = yearlyGoals.filter((yg) => yg.visionId === vision.id);
          const IconComp = ICON_COMPONENTS[vision.icon] || Compass;

          return (
            <div
              key={vision.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-xl transition-all flex flex-col"
            >
              {/* Vision Card Header */}
              <div
                className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-4 cursor-pointer select-none"
                style={{
                  borderTop: `4px solid ${vision.color || '#6366f1'}`,
                  background: `linear-gradient(135deg, ${vision.color}10 0%, transparent 60%)`,
                }}
                onClick={() => toggleVision(vision.id)}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
                    style={{
                      backgroundColor: `${vision.color}25`,
                      color: vision.color || '#6366f1',
                    }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {vision.lifeArea}
                      </span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] text-slate-400">
                        {vGoals.length} Yearly Goals
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-100 group-hover:text-white mt-0.5">
                      {vision.title}
                    </h2>

                    {vision.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {vision.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVisionForYearly(vision);
                      setShowYearlyModal(true);
                    }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                    title="Add Yearly Goal to this Vision"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVision(vision.id);
                    }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                    title="Archive Vision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-1 text-slate-500">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Yearly Goals List */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-slate-950/40 flex-1">
                  {vGoals.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-800/80 rounded-2xl text-xs text-slate-500 space-y-2">
                      <p>No yearly goals linked yet.</p>
                      <button
                        onClick={() => {
                          setSelectedVisionForYearly(vision);
                          setShowYearlyModal(true);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Yearly Goal</span>
                      </button>
                    </div>
                  ) : (
                    vGoals.map((yg) => {
                      const isYgExpanded = !!expandedYearlyGoals[yg.id];
                      const linkedWeekly = weeklyGoals.filter(
                        (wg) => wg.yearlyGoalId === yg.id
                      );
                      const isDone = yg.status === 'DONE';

                      return (
                        <div
                          key={yg.id}
                          className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 space-y-3 hover:border-slate-700 transition-all shadow-sm"
                        >
                          {/* Yearly Goal Header */}
                          <div
                            className="flex items-start justify-between gap-3 cursor-pointer select-none"
                            onClick={() => toggleYearly(yg.id)}
                          >
                            <div className="flex items-start gap-2.5">
                              <Target className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-amber-400/80">
                                    YEAR {yg.targetYear}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                                      isDone
                                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                                        : yg.status === 'IN_PROGRESS'
                                        ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}
                                  >
                                    {yg.status}
                                  </span>
                                </div>
                                <h3 className="text-xs font-bold text-slate-200 mt-0.5">
                                  {yg.title}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedYearlyForWeekly(yg);
                                  setShowWeeklyModal(true);
                                }}
                                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-teal-400 rounded text-xs flex items-center gap-1"
                                title="Add Weekly Sprint Goal"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-semibold hidden sm:inline">Sprint</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteYearly(yg.id);
                                }}
                                className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded"
                                title="Archive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              <div className="p-1 text-slate-500">
                                {isYgExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expandable Weekly Sprints / Goals */}
                          {isYgExpanded && (
                            <div className="pl-4 border-l-2 border-slate-800 space-y-2 pt-1">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Linked Weekly Sprints ({linkedWeekly.length})
                              </div>

                              {linkedWeekly.length === 0 ? (
                                <div className="text-xs text-slate-500 italic py-1">
                                  No sprints linked yet.
                                </div>
                              ) : (
                                linkedWeekly.map((wg) => (
                                  <div
                                    key={wg.id}
                                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Calendar className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-semibold text-slate-200 truncate">
                                            {wg.title}
                                          </span>
                                          {wg.isActive && (
                                            <span className="text-[9px] px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-bold uppercase animate-pulse">
                                              Active
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                          {wg.weekStartDate} — {wg.weekEndDate}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      {!wg.isActive && wg.status !== 'DONE' && (
                                        <button
                                          type="button"
                                          onClick={() => handleActivateSprint(wg.id)}
                                          className="px-2 py-0.5 text-[10px] font-semibold bg-teal-950 text-teal-300 hover:bg-teal-900 border border-teal-800/60 rounded"
                                        >
                                          Set Active
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteWeekly(wg.id)}
                                        className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded"
                                        title="Archive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create / Edit Vision Modal */}
      {showVisionModal && (
        <CreateVisionModal
          isOpen={showVisionModal}
          onClose={() => setShowVisionModal(false)}
          onVisionCreated={() => {
            setShowVisionModal(false);
            loadAll();
          }}
        />
      )}

      {/* Create Yearly Goal Modal */}
      {showYearlyModal && (
        <CreateYearlyGoalModal
          isOpen={showYearlyModal}
          vision={selectedVisionForYearly}
          onClose={() => setShowYearlyModal(false)}
          onGoalCreated={() => {
            setShowYearlyModal(false);
            loadAll();
          }}
        />
      )}

      {/* Create Weekly Goal Modal */}
      {showWeeklyModal && (
        <CreateWeeklyGoalModal
          isOpen={showWeeklyModal}
          yearlyGoal={selectedYearlyForWeekly}
          onClose={() => setShowWeeklyModal(false)}
          onSprintCreated={() => {
            setShowWeeklyModal(false);
            loadAll();
            if (onSprintActivated) onSprintActivated();
          }}
        />
      )}
    </div>
  );
};

// Sub-modals for Vision, Yearly Goal, and Weekly Goal
const CreateVisionModal = ({ isOpen, onClose, onVisionCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lifeArea, setLifeArea] = useState('CAREER');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Compass');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      await api.createVision({ title, description, lifeArea, color, icon });
      onVisionCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Create Life Vision
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Vision Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Full-Stack Architecture"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Life Area
            </label>
            <select
              value={lifeArea}
              onChange={(e) => setLifeArea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="CAREER">Career & Tech</option>
              <option value="HEALTH">Health & Fitness</option>
              <option value="FINANCE">Finance & Wealth</option>
              <option value="PERSONAL_GROWTH">Personal Growth & Learning</option>
              <option value="RELATIONSHIPS">Relationships & Family</option>
              <option value="CREATIVE">Creative & Expression</option>
              <option value="LIFESTYLE">Lifestyle & Freedom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description / Core Tenets
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this vision matters and what success looks like..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-white ring-2 ring-indigo-500/50' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow transition-all"
            >
              {submitting ? 'Creating...' : 'Create Vision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateYearlyGoalModal = ({ isOpen, vision, onClose, onGoalCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      await api.createYearlyGoal({
        title,
        description,
        targetYear: Number(targetYear),
        visionId: vision?.id,
      });
      onGoalCreated();
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
            <Target className="w-5 h-5 text-amber-400" />
            Add Yearly Goal
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {vision && (
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            Linked to: <span className="font-semibold text-slate-200">{vision.title}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Yearly Goal Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ship 3 Production Full-Stack Projects"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Target Year
            </label>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Measurable milestones and criteria for the year..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
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
              className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow transition-all"
            >
              {submitting ? 'Creating...' : 'Create Yearly Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateWeeklyGoalModal = ({ isOpen, yearlyGoal, onClose, onSprintCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setSubmitting(true);
      await api.createWeeklyGoal({
        title,
        description,
        weekStartDate: weekStartDate || null,
        weekEndDate: weekEndDate || null,
        yearlyGoalId: yearlyGoal?.id,
        isActive,
      });
      onSprintCreated();
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
            <Calendar className="w-5 h-5 text-teal-400" />
            Create Weekly Sprint Goal
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {yearlyGoal && (
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            Linked to: <span className="font-semibold text-slate-200">{yearlyGoal.title}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Sprint Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint 43: Complete Authentication & API"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={weekEndDate}
                onChange={(e) => setWeekEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Sprint Scope & Focus
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key deliverable for this weekly sprint..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Set as Current Active Sprint immediately</span>
          </label>

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
              className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow transition-all"
            >
              {submitting ? 'Creating...' : 'Create Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
