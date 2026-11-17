import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { api } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Paperclip,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const COLUMN_DEFS = {
  BACKLOG: {
    id: 'BACKLOG',
    title: 'Backlog',
    color: 'border-slate-700 bg-slate-900/40 text-slate-400',
    headerBg: 'bg-slate-800/40 text-slate-300',
    isOptional: true,
  },
  TODO: {
    id: 'TODO',
    title: 'To Do',
    color: 'border-slate-800 bg-slate-900/50 text-slate-300',
    headerBg: 'bg-slate-800/60 text-slate-200',
    isOptional: false,
  },
  IN_PROGRESS: {
    id: 'IN_PROGRESS',
    title: 'In Progress',
    color: 'border-blue-900/30 bg-blue-950/20 text-blue-300',
    headerBg: 'bg-blue-950/50 text-blue-200 border-blue-800/40',
    isOptional: false,
  },
  BLOCKED: {
    id: 'BLOCKED',
    title: 'Blocked',
    color: 'border-rose-900/30 bg-rose-950/20 text-rose-300',
    headerBg: 'bg-rose-950/50 text-rose-200 border-rose-800/40',
    isOptional: true,
  },
  DONE: {
    id: 'DONE',
    title: 'Done',
    color: 'border-emerald-900/30 bg-emerald-950/20 text-emerald-300',
    headerBg: 'bg-emerald-950/50 text-emerald-200 border-emerald-800/40',
    isOptional: false,
  },
};

export const WorkspaceBoardScreen = ({
  onOpenTaskDetail,
  onOpenCreateTask,
  weeklyGoals = [],
  taskUpdate,
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, TODO, IN_PROGRESS, DONE
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sprintFilter, setSprintFilter] = useState('ALL');

  // Column visibility toggles
  const [showBacklog, setShowBacklog] = useState(false);
  const [showBlocked, setShowBlocked] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (!taskUpdate) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === taskUpdate.id ? { ...task, ...taskUpdate } : task))
    );
  }, [taskUpdate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click status change directly without page reload
  const handleDirectStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      if (newStatus === 'DONE') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }

      await api.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      loadTasks(); // rollback on failure
    }
  };

  // Drag and Drop Handler
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

    // Optimistically update
    const sourceColTasks = filteredTasks.filter((t) => t.status === source.droppableId);
    const destColTasks = source.droppableId === targetStatus
      ? sourceColTasks
      : filteredTasks.filter((t) => t.status === targetStatus);

    // Calculate new position
    let newPosition = 0.0;
    if (destColTasks.length === 0) {
      newPosition = 1.0;
    } else if (destination.index === 0) {
      newPosition = (destColTasks[0]?.position || 1.0) - 1.0;
    } else if (destination.index >= destColTasks.length) {
      newPosition = (destColTasks[destColTasks.length - 1]?.position || 0.0) + 1.0;
    } else {
      const prevPos = destColTasks[destination.index - 1]?.position || 0.0;
      const nextPos = destColTasks[destination.index]?.position || prevPos + 2.0;
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
      loadTasks();
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (sprintFilter !== 'ALL') {
      if (sprintFilter === 'NONE' && t.weeklyGoalId) return false;
      if (sprintFilter !== 'NONE' && String(t.weeklyGoalId) !== sprintFilter) return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description && t.description.toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }
    return true;
  });

  // Determine active columns
  const activeColumnKeys = Object.keys(COLUMN_DEFS).filter((key) => {
    if (key === 'BACKLOG' && !showBacklog) return false;
    if (key === 'BLOCKED' && !showBlocked) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-full space-y-6 flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Workspace Board</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredTasks.length} tasks
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Jira-style kanban workflow. Drag & drop cards or change status with a single click.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => onOpenCreateTask(null, 'TODO')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-slate-900/70 border border-slate-800 rounded-2xl flex-shrink-0">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 'ALL'
                ? 'All'
                : s === 'TODO'
                ? 'To Do'
                : s === 'IN_PROGRESS'
                ? 'In Progress'
                : 'Done'}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 w-44 focus:w-56 transition-all focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sprint filter */}
          <select
            value={sprintFilter}
            onChange={(e) => setSprintFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 max-w-[160px] truncate focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Sprints</option>
            <option value="NONE">No Sprint (Backlog)</option>
            {weeklyGoals.map((wg) => (
              <option key={wg.id} value={wg.id}>
                {wg.title}
              </option>
            ))}
          </select>

          {/* Column toggles */}
          <div className="flex items-center gap-1 ml-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setShowBacklog(!showBacklog)}
              className={`px-2 py-1 text-xs rounded-lg border flex items-center gap-1 transition-colors ${
                showBacklog
                  ? 'bg-slate-800 border-slate-700 text-slate-200 font-semibold'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Backlog Column"
            >
              {showBacklog ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Backlog</span>
            </button>

            <button
              onClick={() => setShowBlocked(!showBlocked)}
              className={`px-2 py-1 text-xs rounded-lg border flex items-center gap-1 transition-colors ${
                showBlocked
                  ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 font-semibold'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Blocked Column"
            >
              {showBlocked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Blocked</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Container with DragDropContext */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 h-full min-w-max">
              {activeColumnKeys.map((colKey) => {
                const colDef = COLUMN_DEFS[colKey];
                const colTasks = filteredTasks.filter((t) => t.status === colKey);

                return (
                  <div
                    key={colKey}
                    className="w-80 flex-shrink-0 flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-sm"
                  >
                    {/* Column Header */}
                    <div className={`p-3.5 border-b border-slate-800/80 flex items-center justify-between ${colDef.headerBg}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider">
                          {colDef.title}
                        </span>
                        <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-900/80 border border-slate-700/60 font-semibold text-slate-300">
                          {colTasks.length}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenCreateTask(null, colKey)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                        title={`Add task to ${colDef.title}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Droppable Column Area */}
                    <Droppable droppableId={colKey}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 p-2.5 overflow-y-auto space-y-2.5 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-indigo-950/20' : ''
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
                                  className={`group bg-slate-900 border rounded-xl p-3.5 transition-all shadow-sm hover:shadow-md cursor-pointer select-none ${
                                    dragSnapshot.isDragging
                                      ? 'border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-500/30 rotate-1'
                                      : 'border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  {/* Top line: Linked Sprint / Vision & Priority */}
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    {task.weeklyGoalTitle ? (
                                      <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-800/40 truncate max-w-[160px]">
                                        {task.weeklyGoalTitle}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">
                                        Backlog
                                      </span>
                                    )}

                                    <PriorityBadge priority={task.priority} size="xs" />
                                  </div>

                                  {/* Task Title */}
                                  <h4 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-relaxed mb-2.5">
                                    {task.title}
                                  </h4>

                                  {/* Card Bottom Meta & 1-Click Status Badge */}
                                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                                    <div className="flex items-center gap-2">
                                      {task.dueDate && (
                                        <span className="flex items-center gap-1 text-slate-400">
                                          <Calendar className="w-3 h-3 text-slate-500" />
                                          <span>{task.dueDate}</span>
                                        </span>
                                      )}

                                      {task.attachments && task.attachments.length > 0 && (
                                        <span className="flex items-center gap-0.5 text-indigo-400">
                                          <Paperclip className="w-3 h-3" />
                                          <span>{task.attachments.length}</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* 1-Click Status Badge */}
                                    <StatusBadge
                                      status={task.status}
                                      onChange={(newStatus) =>
                                        handleDirectStatusChange(task.id, newStatus)
                                      }
                                      size="xs"
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {colTasks.length === 0 && (
                            <div className="h-24 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-xs text-slate-400">
                              Drop cards here
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>

                    {/* Quick Add Button at bottom of column */}
                    <div className="p-2 border-t border-slate-800/60 bg-slate-900/40">
                      <button
                        type="button"
                        onClick={() => onOpenCreateTask(null, colKey)}
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create in {colDef.title}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};
