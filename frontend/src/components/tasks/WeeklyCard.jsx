import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { addDaysToKey, formatWeekRange, getWeekOffset } from '../../utils/date.js';
import { useTasks } from '../../hooks/useTasks.js';
import TaskList from './TaskList.jsx';
import { TaskListSkeleton } from '../ui/Skeleton.jsx';

export default function WeeklyCard({
  week,
  currentWeekStartKey,
  onToggle,
  onEdit,
  onDelete,
  togglingId,
}) {
  const [open, setOpen] = useState(false);
  const isCurrent = week.weekStart === currentWeekStartKey;
  const weekEnd = week.weekEnd || addDaysToKey(week.weekStart, 6);
  const weekRange = formatWeekRange(week.weekStart, weekEnd);
  const weekOffset = getWeekOffset(week.weekStart, currentWeekStartKey);
  const total = week.openCount + week.completedCount;
  const progress = total ? Math.round((week.completedCount / total) * 100) : 0;

  const weekTitle =
    weekOffset === 0
      ? 'This Week'
      : weekOffset === 1
        ? 'Next Week'
        : weekOffset === -1
          ? 'Last Week'
          : weekRange;

  const weekHint =
    weekOffset === 0 || Math.abs(weekOffset) === 1
      ? weekRange
      : weekOffset > 0
        ? 'Upcoming week'
        : 'Past week';

  const tasksQuery = useTasks({ weekStart: week.weekStart }, { enabled: open });

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white transition',
        isCurrent
          ? 'border-primary/30 shadow-[0_14px_34px_-28px_rgba(76,95,245,0.9)]'
          : 'border-line'
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-[15px] font-semibold text-ink">{weekTitle}</h3>
              {isCurrent ? (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">
                  Current
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[11px] text-muted">{weekHint}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-completed px-2.5 py-1 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {week.completedCount} completed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pending px-2.5 py-1 text-danger">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                {week.openCount} open
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-lavender">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="w-8 text-right text-[10px] font-medium text-muted">
                {progress}%
              </span>
            </div>
          </div>

          <ChevronDown
            className={cn(
              'mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="week-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 pb-2">
              {tasksQuery.isLoading ? (
                <TaskListSkeleton rows={2} className="py-4" />
              ) : tasksQuery.isError ? (
                <p className="py-4 text-xs text-danger">
                  Could not load tasks for this week.{' '}
                  <button
                    type="button"
                    onClick={() => tasksQuery.refetch()}
                    className="font-semibold underline"
                  >
                    Retry
                  </button>
                </p>
              ) : tasksQuery.data?.length ? (
                <TaskList
                  tasks={tasksQuery.data}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  togglingId={togglingId}
                  showDate
                />
              ) : (
                <p className="py-4 text-xs text-muted">No tasks scheduled for this week.</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
