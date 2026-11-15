import { cn } from '../../utils/cn.js';

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-canvas/60 px-6 py-9 text-center',
        className
      )}
    >
      {Icon ? (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
      {description ? <p className="mt-1 max-w-[260px] text-xs leading-5 text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
