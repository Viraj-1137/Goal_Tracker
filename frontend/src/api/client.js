const BASE_URL = '/api';

export const getStoredToken = () => localStorage.getItem('focus_token');
export const setStoredToken = (token) => localStorage.setItem('focus_token', token);
export const removeStoredToken = () => localStorage.removeItem('focus_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('focus_user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem('focus_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('focus_user');

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: response.statusText };
    }
    const error = new Error(errorData.message || 'API request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request('/auth/me'),

  // Dashboard
  getDashboardSummary: () => request('/dashboard/summary'),

  // Visions
  getVisions: (all = false) => request(`/visions${all ? '?all=true' : ''}`),
  getVision: (id) => request(`/visions/${id}`),
  createVision: (data) => request('/visions', { method: 'POST', body: JSON.stringify(data) }),
  updateVision: (id, data) => request(`/visions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  archiveVision: (id) => request(`/visions/${id}`, { method: 'DELETE' }),

  // Yearly Goals
  getYearlyGoals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/yearly-goals${query ? `?${query}` : ''}`);
  },
  createYearlyGoal: (data) => request('/yearly-goals', { method: 'POST', body: JSON.stringify(data) }),
  updateYearlyGoal: (id, data) => request(`/yearly-goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateYearlyGoalStatus: (id, status) =>
    request(`/yearly-goals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  archiveYearlyGoal: (id) => request(`/yearly-goals/${id}`, { method: 'DELETE' }),

  // Weekly Goals (Sprints)
  getWeeklyGoals: (yearlyGoalId) =>
    request(`/weekly-goals${yearlyGoalId ? `?yearlyGoalId=${yearlyGoalId}` : ''}`),
  getActiveSprint: () => request('/weekly-goals/active'),
  createWeeklyGoal: (data) => request('/weekly-goals', { method: 'POST', body: JSON.stringify(data) }),
  updateWeeklyGoal: (id, data) => request(`/weekly-goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateWeeklyGoalStatus: (id, status) =>
    request(`/weekly-goals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  activateSprint: (id) => request(`/weekly-goals/${id}/activate`, { method: 'POST' }),
  closeSprint: (id, data) => request(`/weekly-goals/${id}/close`, { method: 'POST', body: JSON.stringify(data) }),
  archiveWeeklyGoal: (id) => request(`/weekly-goals/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.priority) query.set('priority', params.priority);
    if (params.weeklyGoalId) query.set('weeklyGoalId', params.weeklyGoalId);
    const qs = query.toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },
  getTodayTasks: () => request('/tasks/today'),
  getSprintTasks: (sprintId) => request(`/tasks/sprint/${sprintId}`),
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateTaskStatus: (id, status, position = null) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, position }),
    }),
  updateTaskPosition: (id, status, position) =>
    request(`/tasks/${id}/position`, {
      method: 'PATCH',
      body: JSON.stringify({ taskId: id, status, position }),
    }),
  archiveTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Attachments
  getAttachments: (taskId) => request(`/tasks/${taskId}/attachments`),
  addAttachment: (taskId, data) =>
    request(`/tasks/${taskId}/attachments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAttachment: (taskId, attachmentId) =>
    request(`/tasks/attachments/${attachmentId}`, { method: 'DELETE' }),
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Rituals
  getRituals: () => request('/rituals'),
  createRitual: (data) => request('/rituals', { method: 'POST', body: JSON.stringify(data) }),
  updateRitual: (id, data) => request(`/rituals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  archiveRitual: (id) => request(`/rituals/${id}`, { method: 'DELETE' }),
  toggleRitual: (id, date = null, completed = null) =>
    request(`/rituals/${id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ date, completed }),
    }),
  getHeatmap: (startDate, endDate) => {
    const query = new URLSearchParams();
    if (startDate) query.set('startDate', startDate);
    if (endDate) query.set('endDate', endDate);
    const qs = query.toString();
    return request(`/rituals/heatmap${qs ? `?${qs}` : ''}`);
  },

  // Reports
  getRetrospective: (year) =>
    request(`/reports/retrospective${year ? `?year=${year}` : ''}`),
};
