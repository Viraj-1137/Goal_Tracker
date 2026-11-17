import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  Calendar,
  Clock,
  Paperclip,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  Link as LinkIcon,
  Trash2,
  UploadCloud,
  Check,
  ExternalLink,
  Bold,
  Italic,
  List,
  Code,
  CheckSquare,
} from 'lucide-react';

export const TicketDetailModal = ({
  taskId,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
  weeklyGoals = [],
}) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [weeklyGoalId, setWeeklyGoalId] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Link modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkType, setLinkType] = useState('LINK');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!taskId) return;
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await api.getTask(taskId);
      setTask(data);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setStatus(data.status || 'TODO');
      setPriority(data.priority || 'MEDIUM');
      setDueDate(data.dueDate || '');
      setWeeklyGoalId(data.weeklyGoalId ? String(data.weeklyGoalId) : '');
      loadAttachments();
    } catch (err) {
      console.error('Failed to load task:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = async () => {
    try {
      const atts = await api.getAttachments(taskId);
      setAttachments(atts);
    } catch (err) {
      console.error('Failed to load attachments:', err);
    }
  };

  const handleSave = async (overrides = {}) => {
    try {
      setSaving(true);
      const payload = {
        title: overrides.title !== undefined ? overrides.title : title,
        description: overrides.description !== undefined ? overrides.description : description,
        status: overrides.status !== undefined ? overrides.status : status,
        priority: overrides.priority !== undefined ? overrides.priority : priority,
        dueDate: overrides.dueDate !== undefined ? overrides.dueDate : (dueDate || null),
        weeklyGoalId: overrides.weeklyGoalId !== undefined ? (overrides.weeklyGoalId ? Number(overrides.weeklyGoalId) : null) : (weeklyGoalId ? Number(weeklyGoalId) : null),
      };

      const updated = await api.updateTask(taskId, payload);
      setTask(updated);
      if (onTaskUpdated) onTaskUpdated(updated);
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await handleSave({ status: newStatus });
  };

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    await handleSave({ priority: newPriority });
  };

  const handleWeeklyGoalChange = async (newGoalId) => {
    setWeeklyGoalId(newGoalId);
    await handleSave({ weeklyGoalId: newGoalId });
  };

  const handleDueDateChange = async (newDate) => {
    setDueDate(newDate);
    await handleSave({ dueDate: newDate });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to archive this task?')) {
      try {
        await api.archiveTask(taskId);
        if (onTaskDeleted) onTaskDeleted(taskId);
        onClose();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  // Attachments Handling
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploaded = await api.uploadFile(file);
      await api.addAttachment(taskId, {
        type: uploaded.type,
        urlOrPath: uploaded.url,
        label: uploaded.originalName,
      });
      loadAttachments();
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Failed to upload file: ' + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddLinkAttachment = async (e) => {
    e.preventDefault();
    if (!linkUrl) return;

    try {
      await api.addAttachment(taskId, {
        type: linkType,
        urlOrPath: linkUrl,
        label: linkLabel || linkUrl,
      });
      setLinkUrl('');
      setLinkLabel('');
      setShowLinkModal(false);
      loadAttachments();
    } catch (err) {
      console.error('Failed to add link:', err);
    }
  };

  const handleDeleteAttachment = async (attId) => {
    try {
      await api.deleteAttachment(taskId, attId);
      setAttachments(attachments.filter((a) => a.id !== attId));
    } catch (err) {
      console.error('Failed to delete attachment:', err);
    }
  };

  // Rich Text helper formatting
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('task-desc-area');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + selected + suffix;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    setDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur sticky top-0 z-10">
          <div className="flex-1 mr-4 overflow-hidden">
            {task && (
              <Breadcrumbs
                visionId={task.visionId}
                visionTitle={task.visionTitle}
                yearlyGoalId={task.yearlyGoalId}
                yearlyGoalTitle={task.yearlyGoalTitle}
                weeklyGoalId={task.weeklyGoalId}
                weeklyGoalTitle={task.weeklyGoalTitle}
                taskTitle={task.title}
              />
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Archive Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Task title..."
                className="w-full text-xl font-bold bg-transparent text-slate-100 border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors py-1"
              />
            </div>

            {/* Meta Attributes Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              {/* Status */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Status
                </label>
                <StatusBadge status={status} onChange={handleStatusChange} />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Due Date
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => handleDueDateChange(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sprint Link */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Sprint / Goal
                </label>
                <select
                  value={weeklyGoalId}
                  onChange={(e) => handleWeeklyGoalChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1 text-slate-200 truncate focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">No Sprint (Backlog)</option>
                  {weeklyGoals.map((wg) => (
                    <option key={wg.id} value={wg.id}>
                      {wg.title} {wg.isActive ? '⚡ (Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description with Markdown Toolbar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                {/* Rich text formatting shortcuts */}
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded border border-slate-700">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Bullet list"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- [ ] ')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Checklist task"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('`', '`')}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Inline Code"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                id="task-desc-area"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="Add a detailed description, checklist, or acceptance criteria (Markdown supported)..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Attachments ({attachments.length})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File / Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add Link / Sheet</span>
                  </button>
                </div>
              </div>

              {/* Add Link Sub-modal/form */}
              {showLinkModal && (
                <form
                  onSubmit={handleAddLinkAttachment}
                  className="p-3 bg-slate-800/80 rounded-xl border border-indigo-500/40 space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-300">
                      Link Spreadsheet or External Document
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={linkType}
                      onChange={(e) => setLinkType(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1.5 text-slate-200"
                    >
                      <option value="EXCEL">Spreadsheet / Excel / Sheet</option>
                      <option value="LINK">External Link / Doc</option>
                      <option value="FILE">Online Document</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Label (e.g. Q4 Budget Sheet)"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1.5 text-slate-200"
                    />
                    <input
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      required
                      className="bg-slate-900 border border-slate-700 rounded text-xs px-2 py-1.5 text-slate-200"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowLinkModal(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow"
                    >
                      Attach
                    </button>
                  </div>
                </form>
              )}

              {/* Attachments List */}
              {attachments.length === 0 ? (
                <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-400">
                  No attachments yet. Drop screenshots, PDF specs, or spreadsheet links here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachments.map((att) => {
                    const isImg = att.type === 'IMAGE' || att.urlOrPath.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                    const isSheet = att.type === 'EXCEL' || att.urlOrPath.includes('sheet') || att.urlOrPath.includes('excel');

                    return (
                      <div
                        key={att.id}
                        className="group relative flex items-center gap-3 p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all"
                      >
                        {/* Thumbnail / Icon */}
                        {isImg ? (
                          <a
                            href={att.urlOrPath}
                            target="_blank"
                            rel="noreferrer"
                            className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700 block"
                          >
                            <img
                              src={att.urlOrPath}
                              alt={att.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </a>
                        ) : isSheet ? (
                          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center flex-shrink-0 text-emerald-400">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center flex-shrink-0 text-indigo-400">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <a
                            href={att.urlOrPath}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-slate-200 hover:text-indigo-400 truncate flex items-center gap-1 group/link"
                          >
                            <span className="truncate">{att.label || 'Attachment'}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                            {att.type}
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                          title="Remove attachment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {saving ? 'Saving changes...' : 'All changes saved automatically'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
