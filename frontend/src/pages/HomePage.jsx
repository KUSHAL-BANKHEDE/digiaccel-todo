import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Search } from 'lucide-react';
import SummaryCards from '../components/tasks/SummaryCards.jsx';
import TaskList from '../components/tasks/TaskList.jsx';
import WeeklyCard from '../components/tasks/WeeklyCard.jsx';
import WeekStrip from '../components/ui/WeekStrip.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Button from '../components/ui/Button.jsx';
import {
  SummaryCardsSkeleton,
  TaskListSkeleton,
  WeeklyCardSkeleton,
} from '../components/ui/Skeleton.jsx';
import { useTaskForm } from '../context/taskFormContext.js';
import {
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
  useWeeklySummary,
} from '../hooks/useTasks.js';
import {
  addDaysToKey,
  formatLongDate,
  getCurrentWeekStartKey,
  isTodayKey,
  todayKey,
} from '../utils/date.js';

const orderWeeks = (weeks, currentWeekStartKey) => {
  const byWeek = new Map(weeks.map((week) => [week.weekStart, week]));

  if (!byWeek.has(currentWeekStartKey)) {
    byWeek.set(currentWeekStartKey, {
      weekStart: currentWeekStartKey,
      weekEnd: addDaysToKey(currentWeekStartKey, 6),
      openCount: 0,
      completedCount: 0,
      total: 0,
    });
  }

  const allWeeks = Array.from(byWeek.values());

  return [
    allWeeks.find((week) => week.weekStart === currentWeekStartKey),
    ...allWeeks
      .filter((week) => week.weekStart > currentWeekStartKey)
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart)),
    ...allWeeks
      .filter((week) => week.weekStart < currentWeekStartKey)
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart)),
  ];
};

export default function HomePage() {
  const navigate = useNavigate();
  const { openCreate, openEdit } = useTaskForm();
  const currentWeekStartKey = useMemo(() => getCurrentWeekStartKey(), []);
  const [selectedDate, setSelectedDate] = useState(() => todayKey());
  const [showWholeWeek, setShowWholeWeek] = useState(false);

  const summaryQuery = useWeeklySummary();
  const weekTasksQuery = useTasks({ weekStart: currentWeekStartKey });
  const statusMutation = useUpdateTaskStatus();
  const deleteMutation = useDeleteTask();

  const summary = useMemo(() => {
    const currentWeek = summaryQuery.data?.find(
      (week) => week.weekStart === currentWeekStartKey
    );

    return (
      currentWeek ?? {
        weekStart: currentWeekStartKey,
        weekEnd: addDaysToKey(currentWeekStartKey, 6),
        openCount: 0,
        completedCount: 0,
        total: 0,
      }
    );
  }, [summaryQuery.data, currentWeekStartKey]);

  const weeks = useMemo(
    () => orderWeeks(summaryQuery.data ?? [], currentWeekStartKey),
    [summaryQuery.data, currentWeekStartKey]
  );

  const weekTasks = weekTasksQuery.data ?? [];
  const visibleTasks = showWholeWeek
    ? weekTasks
    : weekTasks.filter((task) => task.date === selectedDate);
  const totalTasks = summary.openCount + summary.completedCount;
  const progress = totalTasks ? (summary.completedCount / totalTasks) * 100 : 0;
  const selectionLabel = isTodayKey(selectedDate) ? 'Tasks Today' : formatLongDate(selectedDate);
  const listTitle = showWholeWeek ? 'This Week' : selectionLabel;
  const togglingId = statusMutation.isPending ? statusMutation.variables?.id : null;

  const handleToggle = (task) => {
    statusMutation.mutate({
      id: task._id,
      status: task.status === 'completed' ? 'in-progress' : 'completed',
    });
  };

  const handleDelete = (task) => {
    deleteMutation.mutate(task._id);
  };

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    setShowWholeWeek(false);
  };

  return (
    <>
      <main className="flex flex-1 flex-col pb-32">
        <div className="px-5 pt-6">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-line bg-white px-4 text-left text-sm text-muted transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
          >
            <Search className="h-4 w-4" />
            Search for a task
          </button>
        </div>

        <section className="px-5 pt-5">
          <WeekStrip
            weekStartKey={currentWeekStartKey}
            selectedDate={selectedDate}
            onSelect={selectDate}
          />
        </section>

        <section className="px-5 pt-6">
          {summaryQuery.isLoading ? (
            <SummaryCardsSkeleton />
          ) : summaryQuery.isError ? (
            <ErrorState
              title="Weekly summary unavailable"
              message="We could not load your weekly totals."
              onRetry={() => summaryQuery.refetch()}
            />
          ) : (
            <SummaryCards completed={summary.completedCount} open={summary.openCount} />
          )}
        </section>

        <section className="px-5 pt-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold text-ink">Weekly Progress</h2>
            <span className="text-[11px] font-medium text-muted">
              {summary.completedCount}/{totalTasks} done
            </span>
          </div>
          <ProgressBar value={progress} className="mt-3" />
        </section>

        <section className="pt-7">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display text-[17px] font-semibold text-ink">{listTitle}</h2>
            <button
              type="button"
              onClick={() => setShowWholeWeek((current) => !current)}
              className="rounded-lg px-1 py-1 text-[13px] font-semibold text-primary transition hover:text-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {showWholeWeek ? 'Day' : 'View All'}
            </button>
          </div>

          <div className="mt-2 px-5">
            {weekTasksQuery.isLoading ? (
              <TaskListSkeleton rows={3} />
            ) : weekTasksQuery.isError ? (
              <ErrorState
                title="Tasks unavailable"
                message="We could not load this week's tasks."
                onRetry={() => weekTasksQuery.refetch()}
              />
            ) : visibleTasks.length ? (
              <TaskList
                tasks={visibleTasks}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
                togglingId={togglingId}
              />
            ) : (
              <EmptyState
                icon={ClipboardList}
                title={showWholeWeek ? 'No tasks this week' : 'Nothing scheduled'}
                description={
                  showWholeWeek
                    ? 'Plan your week by adding your first task.'
                    : 'No tasks for this day. Add one or pick another date.'
                }
                action={
                  <Button size="sm" onClick={() => openCreate(selectedDate)}>
                    <Plus className="h-4 w-4" />
                    Add task
                  </Button>
                }
              />
            )}
          </div>
        </section>

        <section className="px-5 pt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-ink">Weekly Overview</h2>
              <p className="mt-1 text-[11px] text-muted">Tap a week to see all its tasks.</p>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {summaryQuery.isLoading ? (
              <>
                <WeeklyCardSkeleton />
                <WeeklyCardSkeleton />
              </>
            ) : summaryQuery.isError ? null : (
              weeks.map((week) => (
                <WeeklyCard
                  key={week.weekStart}
                  week={week}
                  currentWeekStartKey={currentWeekStartKey}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  togglingId={togglingId}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => openCreate(selectedDate)}
        aria-label="Add new task"
        className="fixed bottom-[calc(1.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-fab transition hover:bg-primary-dark active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        <Plus className="h-6 w-6" strokeWidth={2.4} />
      </button>
    </>
  );
}
