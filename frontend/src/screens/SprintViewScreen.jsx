import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { api } from '../api/client';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CloseSprintModal } from '../components/sprint/CloseSprintModal';
import confetti from 'canvas-confetti';
import {
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  ArrowRight,
  Sparkles,
  Paperclip,
  CheckCheck,
} from 'lucide-react';

const SPRINT_COLUMNS = {
  TODO: { id: 'TODO', title: 'To Do', bg: 'bg-slate-900/60' },
  IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', bg: 'bg-blue-950/20' },
  DONE: { id: 'DONE', title: 'Done', bg: 'bg-emerald-950/20' },
};

export const SprintViewScreen = ({
  onOpenTaskDetail,
  onOpenCreateTask,
  weeklyGoals = [],
  onSprintUpdated,
}) => {
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);

  useEffect(() => {
    loadActiveSprint();
  }, []);

  const loadActiveSprint = async () => {
    try {
      setLoading(true);
      const active = await api.getActiveSprint();
      setSprint(active);
      if (active && active.id) {
        const sprintTasks = await api.getSprintTasks(active.id);
        setTasks(sprintTasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Failed to load active sprint:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectStatusChange = async (taskId, newStatus) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      if (newStatus === 'DONE') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      await api.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task status:', err);
      if (sprint) {
        const sprintTasks = await api.getSprintTasks(sprint.id);
        setTasks(sprintTasks);
      }
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const targetStatus = destination.droppableId;

    const colTasks = tasks.filter((t) => t.status === targetStatus);
    let newPosition = 0.0;
    if (colTasks.length === 0) {
      newPosition = 1.0;
    } else if (destination.index === 0) {
      newPosition = (colTasks[0]?.position || 1.0) - 1.0;
    } else if (destination.index >= colTasks.length) {
      newPosition = (colTasks[colTasks.length - 1]?.position || 0.0) + 1.0;
    } else {
      const prevPos = colTasks[destination.index - 1]?.position || 0.0;
      const nextPos = colTasks[destination.index]?.position || prevPos + 2.0;
      newPosition = (prevPos + nextPos) / 2.0;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus, position: newPosition } : t))
    );

    if (targetStatus === 'DONE' && source.droppableId !== 'DONE') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    try {
      await api.updateTaskPosition(taskId, targetStatus, newPosition);
    } catch (err) {
      console.error('Failed to update task position:', err);
      if (sprint) {
        const sprintTasks = await api.getSprintTasks(sprint.id);
        setTasks(sprintTasks);
      }
    }
  };

  const handleSprintClosed = () => {
    if (onSprintUpdated) onSprintUpdated();
    loadActiveSprint();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center mx-auto text-teal-400">
          <Zap className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">No Active Sprint</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          There is currently no active sprint set. Activate an existing weekly goal or create a new one from the Vision & Goals board.
        </p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const incompleteTasks = tasks.filter((t) => t.status !== 'DONE').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 max-w-full space-y-6 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Sprint Header Panel */}
      <div className="p-6 bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border border-teal-500/30 rounded-3xl shadow-xl space-y-4 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            {/* Clickable breadcrumbs */}
            <Breadcrumbs
              visionId={sprint.visionId}
              visionTitle={sprint.visionTitle}
              yearlyGoalId={sprint.yearlyGoalId}
              yearlyGoalTitle={sprint.yearlyGoalTitle}
              weeklyGoalId={sprint.id}
              weeklyGoalTitle={sprint.title}
            />

            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {sprint.title}
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full animate-pulse">
                Active Sprint
              </span>
            </div>

            {sprint.description && (
              <p className="text-xs text-slate-300 line-clamp-2">{sprint.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>
                Sprint Period: <span className="text-slate-200">{sprint.weekStartDate}</span> to{' '}
                <span className="text-slate-200">{sprint.weekEndDate}</span>
              </span>
            </div>
          </div>

          {/* Sprint Gauge & Close Action */}
          <div className="flex flex-col items-start md:items-end justify-between min-w-[220px] space-y-3">
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Sprint Completion</span>
                <span className="font-bold text-teal-400">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                {completedTasks} / {totalTasks} tasks completed
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCreateTask(sprint.id, 'TODO')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => setShowCloseModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl shadow-lg shadow-teal-600/25 transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Close Sprint</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Kanban Board Scoped to Active Sprint */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full min-w-[720px]">
            {Object.entries(SPRINT_COLUMNS).map(([colKey, colDef]) => {
              const colTasks = tasks.filter((t) => t.status === colKey);

              return (
                <div
                  key={colKey}
                  className="flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-sm"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                        {colDef.title}
                      </span>
                      <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-900 border border-slate-700 font-semibold text-slate-300">
                        {colTasks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenCreateTask(sprint.id, colKey)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Droppable Area */}
                  <Droppable droppableId={colKey}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto space-y-2.5 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-teal-950/20' : ''
                        }`}
                      >
                        {colTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() => onOpenTaskDetail(task.id)}
                                className={`bg-slate-900 border rounded-xl p-3.5 transition-all shadow-sm cursor-pointer select-none ${
                                  dragSnapshot.isDragging
                                    ? 'border-teal-400 shadow-teal-500/20 ring-2 ring-teal-500/30'
                                    : 'border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <PriorityBadge priority={task.priority} size="xs" />
                                  <StatusBadge
                                    status={task.status}
                                    onChange={(newStatus) =>
                                      handleDirectStatusChange(task.id, newStatus)
                                    }
                                    size="xs"
                                  />
                                </div>

                                <h4 className="text-xs font-semibold text-slate-100 hover:text-teal-300 transition-colors line-clamp-2 leading-relaxed mb-2.5">
                                  {task.title}
                                </h4>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                                  {task.dueDate ? (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3 text-slate-500" />
                                      <span>{task.dueDate}</span>
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}

                                  {task.attachments && task.attachments.length > 0 && (
                                    <span className="flex items-center gap-0.5 text-teal-400">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{task.attachments.length}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {colTasks.length === 0 && (
                          <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
                            Drop cards here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>

                  {/* Add button */}
                  <div className="p-2 border-t border-slate-800/60 bg-slate-900/40">
                    <button
                      type="button"
                      onClick={() => onOpenCreateTask(sprint.id, colKey)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to {colDef.title}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* Close Sprint Modal */}
      <CloseSprintModal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        sprint={sprint}
        incompleteTasksCount={incompleteTasks}
        otherWeeklyGoals={weeklyGoals}
        onSprintClosed={handleSprintClosed}
      />
    </div>
  );
};
