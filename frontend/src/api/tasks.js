import api from './client.js';

const unwrap = (request) => request.then((response) => response.data.data);

export const fetchTasks = (filters = {}) => unwrap(api.get('/tasks', { params: filters }));

export const fetchWeeklySummary = (params = {}) =>
  unwrap(api.get('/tasks/weeks', { params }));

export const createTask = (payload) => unwrap(api.post('/tasks', payload));

export const updateTask = (id, payload) => unwrap(api.patch(`/tasks/${id}`, payload));

export const updateTaskStatus = (id, status) =>
  unwrap(api.patch(`/tasks/${id}/status`, { status }));

export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((response) => response.data);
