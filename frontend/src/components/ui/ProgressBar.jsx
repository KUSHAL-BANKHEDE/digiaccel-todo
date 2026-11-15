import { cn } from '../../utils/cn.js';

export default function ProgressBar({ value = 0, className }) {
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      className={cn('h-3.5 w-full overflow-hidden rounded-full bg-primary-lavender', className)}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Weekly progress"
    >
      <div
        className="h-full rounded-full bg-primary-navy transition-[width] duration-500 ease-out"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
