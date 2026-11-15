import { useCallback, useMemo, useState } from 'react';
import TaskFormSheet from '../components/tasks/TaskFormSheet.jsx';
import { todayKey } from '../utils/date.js';
import { TaskFormContext } from './taskFormContext.js';

export default function TaskFormProvider({ children }) {
  const [sheet, setSheet] = useState({ open: false, task: null, defaultDate: todayKey() });

  const openCreate = useCallback((defaultDate = todayKey()) => {
    setSheet({ open: true, task: null, defaultDate });
  }, []);

  const openEdit = useCallback((task) => {
    setSheet({ open: true, task, defaultDate: task.date });
  }, []);

  const close = useCallback(() => {
    setSheet((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(() => ({ openCreate, openEdit, close }), [openCreate, openEdit, close]);

  return (
    <TaskFormContext.Provider value={value}>
      {children}
      <TaskFormSheet
        open={sheet.open}
        task={sheet.task}
        defaultDate={sheet.defaultDate}
        onClose={close}
      />
    </TaskFormContext.Provider>
  );
}
