import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, SearchX, X } from 'lucide-react';
import TaskList from '../components/tasks/TaskList.jsx';
import { TaskListSkeleton } from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import { useTaskForm } from '../context/taskFormContext.js';
import useDebounce from '../hooks/useDebounce.js';
import {
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from '../hooks/useTasks.js';

export default function SearchPage() {
  const navigate = useNavigate();
  const { openEdit } = useTaskForm();
  const inputRef = useRef(null);
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term.trim(), 300);
  const filters = debouncedTerm
    ? { search: debouncedTerm, sort: '-date' }
    : { sort: '-date' };

  const tasksQuery = useTasks(filters);
  const statusMutation = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const tasks = tasksQuery.data ?? [];
  const togglingId = statusMutation.isPending ? statusMutation.variables?.id : null;

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const handleToggle = (task) => {
    statusMutation.mutate({
      id: task._id,
      status: task.status === 'completed' ? 'in-progress' : 'completed',
    });
  };

  const handleDelete = (task) => {
    deleteMutation.mutate(task._id);
  };

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 px-5 pt-6">
        <button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="Back to home"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-canvas focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search for a task"
            enterKeyHint="search"
            autoComplete="off"
            aria-label="Search for a task"
            className="field-input pl-11 pr-11"
          />
          {term ? (
            <button
              type="button"
              onClick={() => {
                setTerm('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>

      <section className="mt-6 flex-1 px-5 pb-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {debouncedTerm ? 'Search results' : 'All Tasks'}
          </h2>
          {tasksQuery.isFetching && !tasksQuery.isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
          ) : (
            <span className="text-[11px] text-muted">
              {tasks.length} task{tasks.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {tasksQuery.isLoading ? (
          <TaskListSkeleton rows={5} />
        ) : tasksQuery.isError ? (
          <ErrorState
            title="Search unavailable"
            message="We could not load your tasks. Check your connection and try again."
            onRetry={() => tasksQuery.refetch()}
          />
        ) : tasks.length ? (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onEdit={openEdit}
            onDelete={handleDelete}
            togglingId={togglingId}
            showDate
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No tasks found"
            description={
              debouncedTerm
                ? `Nothing matches "${debouncedTerm}". Try a different keyword.`
                : 'There are no tasks yet. Go back home and create your first one.'
            }
          />
        )}
      </section>
    </main>
  );
}
