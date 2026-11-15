import { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import Sheet from '../ui/Sheet.jsx';
import Button from '../ui/Button.jsx';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks.js';
import { formatLongDate } from '../../utils/date.js';
import { cn } from '../../utils/cn.js';

const PRIORITIES = [
  {
    value: 'low',
    label: 'Low',
    dot: 'bg-emerald-500',
    active: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  },
  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-amber-500',
    active: 'border-amber-500 bg-amber-50 text-amber-700',
  },
  {
    value: 'high',
    label: 'High',
    dot: 'bg-rose-500',
    active: 'border-rose-500 bg-rose-50 text-rose-700',
  },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  priority: null,
};

export default function TaskFormSheet({ open, task, defaultDate, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} title={task ? 'Edit Task' : 'Add New Task'}>
      <TaskForm task={task} defaultDate={defaultDate} onClose={onClose} />
    </Sheet>
  );
}

function TaskForm({ task, defaultDate, onClose }) {
  const isEditing = Boolean(task);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const [form, setForm] = useState(() =>
    task
      ? {
          title: task.title ?? '',
          description: task.description ?? '',
          date: task.date ?? '',
          startTime: task.startTime ?? '',
          endTime: task.endTime ?? '',
          priority: task.priority ?? null,
        }
      : { ...EMPTY_FORM, date: defaultDate }
  );
  const [errors, setErrors] = useState({});

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const togglePriority = (value) => {
    setForm((current) => ({
      ...current,
      priority: current.priority === value ? null : value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Title is required';
    if (!form.date) nextErrors.date = 'Date is required';
    if (!form.startTime) nextErrors.startTime = 'Start time is required';

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      nextErrors.endTime = 'End time must be later than start time';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const applyServerErrors = (error) => {
    if (!Array.isArray(error.details)) return;

    const fieldErrors = {};
    error.details.forEach((detail) => {
      if (detail.field) fieldErrors[detail.field] = detail.message;
    });

    setErrors((current) => ({ ...current, ...fieldErrors }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime || null,
      priority: form.priority,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: task._id, payload },
        { onSuccess: onClose, onError: applyServerErrors }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose, onError: applyServerErrors });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 pb-1">
      <div>
          <label htmlFor="task-title" className="mb-1.5 block text-[13px] font-medium text-ink">
            Task title
          </label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={updateField('title')}
            placeholder="Doing Homework"
            maxLength={120}
            autoComplete="off"
            className={cn(
              'field-input',
              errors.title && 'border-danger focus:border-danger focus:ring-danger/10'
            )}
          />
          {errors.title ? <p className="mt-1 text-xs text-danger">{errors.title}</p> : null}
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-ink">Set Time</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="time"
                  value={form.startTime}
                  onChange={updateField('startTime')}
                  aria-label="Start time"
                  className={cn(
                    'field-input pl-10 pr-2',
                    errors.startTime && 'border-danger focus:border-danger focus:ring-danger/10'
                  )}
                />
              </div>
              {errors.startTime ? (
                <p className="mt-1 text-[11px] text-danger">{errors.startTime}</p>
              ) : null}
            </div>
            <div>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="time"
                  value={form.endTime}
                  onChange={updateField('endTime')}
                  aria-label="End time (optional)"
                  className={cn(
                    'field-input pl-10 pr-2',
                    errors.endTime && 'border-danger focus:border-danger focus:ring-danger/10'
                  )}
                />
              </div>
              {errors.endTime ? (
                <p className="mt-1 text-[11px] text-danger">{errors.endTime}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="task-date" className="mb-1.5 block text-[13px] font-medium text-ink">
            Set Date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="task-date"
              type="date"
              value={form.date}
              onChange={updateField('date')}
              className={cn(
                'field-input pl-10',
                errors.date && 'border-danger focus:border-danger focus:ring-danger/10'
              )}
            />
          </div>
          {errors.date ? (
            <p className="mt-1 text-xs text-danger">{errors.date}</p>
          ) : form.date ? (
            <p className="mt-1 text-[11px] text-muted">{formatLongDate(form.date)}</p>
          ) : null}
        </div>

        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-ink">
            Priority <span className="font-normal text-muted">(optional)</span>
          </span>
          <div className="flex gap-2">
            {PRIORITIES.map((priority) => {
              const selected = form.priority === priority.value;

              return (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => togglePriority(priority.value)}
                  aria-pressed={selected}
                  className={cn(
                    'flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                    selected
                      ? priority.active
                      : 'border-line bg-white text-muted hover:border-muted/40'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', priority.dot)} />
                  {priority.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="task-description" className="mb-1.5 block text-[13px] font-medium text-ink">
            Description <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="task-description"
            value={form.description}
            onChange={updateField('description')}
            placeholder="Add Description"
            rows={3}
            maxLength={1000}
            className="field-input h-auto min-h-[92px] resize-none py-3"
          />
        </div>

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        {isEditing ? 'Save changes' : 'Create task'}
      </Button>
    </form>
  );
}
