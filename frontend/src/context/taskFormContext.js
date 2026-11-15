import { createContext, useContext } from 'react';

export const TaskFormContext = createContext(null);

export function useTaskForm() {
  const context = useContext(TaskFormContext);

  if (!context) {
    throw new Error('useTaskForm must be used inside TaskFormProvider');
  }

  return context;
}
