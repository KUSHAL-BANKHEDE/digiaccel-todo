import { CheckCheck, ClipboardList } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const pad = (value) => String(value ?? 0).padStart(2, '0');

function SummaryCard({ tone, icon: Icon, label, value }) {
  const isComplete = tone === 'complete';

  return (
    <div className={cn('rounded-2xl p-4', isComplete ? 'bg-completed' : 'bg-pending')}>
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg bg-white/70',
            isComplete ? 'text-primary' : 'text-danger'
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[13px] font-medium text-ink">{label}</span>
      </div>
      <div className="mt-3.5 flex items-end gap-1.5">
        <span className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink">
          {pad(value)}
        </span>
        <span className="mb-0.5 text-[10px] text-muted">This week</span>
      </div>
    </div>
  );
}

export default function SummaryCards({ completed = 0, open = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryCard tone="complete" icon={CheckCheck} label="Task Complete" value={completed} />
      <SummaryCard tone="pending" icon={ClipboardList} label="Task Pending" value={open} />
    </div>
  );
}
