import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { api } from './api/client';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { TicketDetailModal } from './components/tasks/TicketDetailModal';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { DashboardScreen } from './screens/DashboardScreen';
import { WorkspaceBoardScreen } from './screens/WorkspaceBoardScreen';
import { SprintViewScreen } from './screens/SprintViewScreen';
import { VisionBoardScreen } from './screens/VisionBoardScreen';
import { RitualsScreen } from './screens/RitualsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { LoginScreen } from './screens/LoginScreen';

export const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeSprint, setActiveSprint] = useState(null);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [visions, setVisions] = useState([]);
  const [taskUpdate, setTaskUpdate] = useState(null);

  // Modals state
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskDefaultSprint, setCreateTaskDefaultSprint] = useState(null);
  const [createTaskDefaultStatus, setCreateTaskDefaultStatus] = useState('TODO');

  useEffect(() => {
    if (isAuthenticated) {
      loadGlobalData();
    }
  }, [isAuthenticated]);

  const loadGlobalData = async () => {
    try {
      const [sprintData, wgData, vData] = await Promise.all([
        api.getActiveSprint(),
        api.getWeeklyGoals(),
        api.getVisions(),
      ]);
      setActiveSprint(sprintData);
      setWeeklyGoals(wgData);
      setVisions(vData);
    } catch (err) {
      console.error('Failed to load global goals metadata:', err);
    }
  };

  const handleOpenTaskDetail = (id) => {
    setSelectedTaskId(id);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTaskUpdate(updatedTask);
    loadGlobalData();
  };

  const handleOpenCreateTask = (sprintId = null, defaultStatus = 'TODO') => {
    setCreateTaskDefaultSprint(sprintId || (activeSprint ? activeSprint.id : null));
    setCreateTaskDefaultStatus(defaultStatus);
    setCreateTaskOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Loading Focus...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Routes>
        <Route path="/login" element={<LoginScreen />} />

        {/* Protected Application Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex flex-col min-h-screen">
                <Navbar
                  onOpenCreateTask={() => handleOpenCreateTask()}
                  activeSprint={activeSprint}
                />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto bg-slate-950/90">
                    <Routes>
                      {/* Default landing page is Home / Focus Dashboard */}
                      <Route
                        path="/"
                        element={
                          <DashboardScreen
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onOpenCreateTask={handleOpenCreateTask}
                          />
                        }
                      />
                      <Route
                        path="/workspace"
                        element={
                          <WorkspaceBoardScreen
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onOpenCreateTask={handleOpenCreateTask}
                            weeklyGoals={weeklyGoals}
                            taskUpdate={taskUpdate}
                          />
                        }
                      />
                      <Route
                        path="/sprint"
                        element={
                          <SprintViewScreen
                            onOpenTaskDetail={handleOpenTaskDetail}
                            onOpenCreateTask={handleOpenCreateTask}
                            weeklyGoals={weeklyGoals}
                            onSprintUpdated={loadGlobalData}
                          />
                        }
                      />
                      <Route
                        path="/visions"
                        element={
                          <VisionBoardScreen
                            onSprintActivated={loadGlobalData}
                          />
                        }
                      />
                      <Route
                        path="/rituals"
                        element={<RitualsScreen visions={visions} />}
                      />
                      <Route path="/reports" element={<ReportsScreen />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>

                {/* Global Ticket Detail Slide-Over Modal */}
                {selectedTaskId && (
                  <TicketDetailModal
                    taskId={selectedTaskId}
                    weeklyGoals={weeklyGoals}
                    onClose={() => setSelectedTaskId(null)}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={() => loadGlobalData()}
                  />
                )}

                {/* Global Create Task Modal */}
                {createTaskOpen && (
                  <CreateTaskModal
                    isOpen={createTaskOpen}
                    onClose={() => setCreateTaskOpen(false)}
                    onTaskCreated={() => {
                      loadGlobalData();
                    }}
                    weeklyGoals={weeklyGoals}
                    defaultWeeklyGoalId={createTaskDefaultSprint}
                    defaultStatus={createTaskDefaultStatus}
                  />
                )}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};
