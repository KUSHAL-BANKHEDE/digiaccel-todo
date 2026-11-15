import { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Check, Clock, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { formatShortDate, formatTimeRange } from '../../utils/date.js';

const PRIORITY_STYLES = {
  low: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-rose-50 text-rose-600',
};

const PRIORITY_DOTS = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-rose-500',
};

const ACTION_OFFSET = 88;

export default function TaskItem({ task, onToggle, onEdit, onDelete, showDate = false, busy = false }) {
  const [revealed, setRevealed] = useState(false);
  const controls = useAnimationControls();
  const completed = task.status === 'completed';

  const settle = (next) => {
    setRevealed(next);
    controls.start(
      { x: next ? -ACTION_OFFSET : 0 },
      { type: 'spring', stiffness: 520, damping: 42 }
    );
  };

  const handleDelete = () => {
    settle(false);
    onDelete(task);
  };

  return (
    <div className="relative overflow-hidden">
      <button
        type="button"
        onClick={handleDelete}
        className="absolute inset-y-0 right-0 flex w-[88px] flex-col items-center justify-center gap-1 bg-danger text-[11px] font-semibold text-white"
        aria-label={`Delete ${task.title}`}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -ACTION_OFFSET, right: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        animate={controls}
        onDragEnd={(_event, info) => {
          const next =
            info.offset.x < -30 ? true : info.offset.x > 30 ? false : revealed;
          settle(next);
        }}
        className="relative flex items-start gap-3 bg-white py-4"
      >
        <button
          type="button"
          onClick={() => onToggle(task)}
          disabled={busy}
          aria-pressed={completed}
          aria-label={completed ? `Mark ${task.title} as in progress` : `Mark ${task.title} as completed`}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[7px] border-2 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
            completed
              ? 'border-primary bg-primary text-white'
              : 'border-[#C9CEDC] bg-white text-transparent hover:border-primary',
            busy && 'opacity-50'
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="min-w-0 flex-1 text-left focus-visible:outline-none"
        >
          <p
            className={cn(
              'truncate text-[15px] font-medium leading-5',
              completed ? 'text-muted line-through' : 'text-ink'
            )}
          >
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeRange(task.startTime, task.endTime)}
            </span>
            {showDate ? (
              <span className="inline-flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-line" />
                {formatShortDate(task.date)}
              </span>
            ) : null}
            {task.priority ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                  PRIORITY_STYLES[task.priority]
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_DOTS[task.priority])} />
                {task.priority}
              </span>
            ) : null}
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            title="Edit task"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-canvas hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => settle(!revealed)}
            aria-label={`Delete ${task.title}`}
            aria-expanded={revealed}
            title="Delete task"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-pending hover:text-danger focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
