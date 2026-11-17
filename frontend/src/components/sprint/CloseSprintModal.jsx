import React, { useState } from 'react';
import { api } from '../../api/client';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ArrowRight, Archive, XCircle } from 'lucide-react';

export const CloseSprintModal = ({
  isOpen,
  onClose,
  sprint,
  incompleteTasksCount = 0,
  otherWeeklyGoals = [],
  onSprintClosed,
}) => {
  const [action, setAction] = useState('NEXT_SPRINT'); // NEXT_SPRINT, BACKLOG, DROP
  const [nextWeeklyGoalId, setNextWeeklyGoalId] = useState('');
  const [nextWeeklyGoalTitle, setNextWeeklyGoalTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !sprint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        incompleteAction: action,
        nextWeeklyGoalId: action === 'NEXT_SPRINT' && nextWeeklyGoalId ? Number(nextWeeklyGoalId) : null,
        nextWeeklyGoalTitle: action === 'NEXT_SPRINT' && !nextWeeklyGoalId ? nextWeeklyGoalTitle : null,
      };

      const result = await api.closeSprint(sprint.id, payload);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onSprintClosed) onSprintClosed(result);
      onClose();
    } catch (err) {
      console.error('Failed to close sprint:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">Close Active Sprint</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 space-y-1">
            <div className="text-sm font-semibold text-slate-200">{sprint.title}</div>
            <div className="text-xs text-slate-400">
              {sprint.weekStartDate} — {sprint.weekEndDate}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-200 mb-1">
              You have <span className="font-bold text-amber-400">{incompleteTasksCount}</span> incomplete task(s).
            </h3>
            <p className="text-xs text-slate-400">
              Choose what to do with tasks that are not yet marked as Done:
            </p>
          </div>

          {/* Radio Choices */}
          <div className="space-y-2.5">
            {/* Choice 1: Next Sprint */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                action === 'NEXT_SPRINT'
                  ? 'bg-indigo-950/40 border-indigo-500/80 text-slate-200 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="sprintAction"
                value="NEXT_SPRINT"
                checked={action === 'NEXT_SPRINT'}
                onChange={() => setAction('NEXT_SPRINT')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1 text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  Move to Next Sprint
                </div>
                <p className="text-slate-400">
                  Carry over unfinished work into a future sprint to keep momentum.
                </p>

                {action === 'NEXT_SPRINT' && (
                  <div className="mt-3 space-y-2">
                    <select
                      value={nextWeeklyGoalId}
                      onChange={(e) => setNextWeeklyGoalId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Auto-create next week's sprint</option>
                      {otherWeeklyGoals
                        .filter((g) => g.id !== sprint.id && g.status !== 'DONE')
                        .map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.title} ({g.weekStartDate})
                          </option>
                        ))}
                    </select>

                    {!nextWeeklyGoalId && (
                      <input
                        type="text"
                        placeholder="Optional title for new sprint (or leave blank for auto)"
                        value={nextWeeklyGoalTitle}
                        onChange={(e) => setNextWeeklyGoalTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    )}
                  </div>
                )}
              </div>
            </label>

            {/* Choice 2: Backlog */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                action === 'BACKLOG'
                  ? 'bg-indigo-950/40 border-indigo-500/80 text-slate-200 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="sprintAction"
                value="BACKLOG"
                checked={action === 'BACKLOG'}
                onChange={() => setAction('BACKLOG')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-0.5">
                  <Archive className="w-3.5 h-3.5 text-amber-400" />
                  Move to Backlog
                </div>
                <p className="text-slate-400">
                  Unassign from sprint and return to product backlog for future planning.
                </p>
              </div>
            </label>

            {/* Choice 3: Drop / Abandon */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                action === 'DROP'
                  ? 'bg-indigo-950/40 border-indigo-500/80 text-slate-200 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                name="sprintAction"
                value="DROP"
                checked={action === 'DROP'}
                onChange={() => setAction('DROP')}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-0.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  Drop / Archive Incomplete Tasks
                </div>
                <p className="text-slate-400">
                  Safely archive remaining tasks. Surfaced in Reports, never hard-deleted.
                </p>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Closing Sprint...' : 'Complete & Close Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
