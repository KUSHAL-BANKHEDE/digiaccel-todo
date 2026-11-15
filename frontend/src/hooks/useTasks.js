import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createTask,
  deleteTask,
  fetchTasks,
  fetchWeeklySummary,
  updateTask,
  updateTaskStatus,
} from '../api/tasks.js';

export const tasksKey = ['tasks'];
export const weeksKey = ['weeks'];

const getErrorMessage = (error) =>
  error?.friendlyMessage || 'Something went wrong. Please try again.';

const invalidateTaskData = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: tasksKey });
  queryClient.invalidateQueries({ queryKey: weeksKey });
};

export const useTasks = (filters = {}, options = {}) =>
  useQuery({
    queryKey: [...tasksKey, filters],
    queryFn: () => fetchTasks(filters),
    ...options,
  });

export const useWeeklySummary = (params = {}, options = {}) =>
  useQuery({
    queryKey: [...weeksKey, params],
    queryFn: () => fetchWeeklySummary(params),
    ...options,
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      invalidateTaskData(queryClient);
      toast.success('Task created');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: () => {
      invalidateTaskData(queryClient);
      toast.success('Task updated');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      invalidateTaskData(queryClient);
      toast.success('Task deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });

      const previousTasks = queryClient.getQueriesData({ queryKey: tasksKey });

      queryClient.setQueriesData({ queryKey: tasksKey }, (current) => {
        if (!Array.isArray(current)) return current;

        return current.map((task) =>
          task._id === id
            ? {
                ...task,
                status,
                completedAt: status === 'completed' ? new Date().toISOString() : null,
              }
            : task
        );
      });

      return { previousTasks };
    },
    onError: (error, _variables, context) => {
      context?.previousTasks?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksKey });
      queryClient.invalidateQueries({ queryKey: weeksKey });
    },
  });
};
