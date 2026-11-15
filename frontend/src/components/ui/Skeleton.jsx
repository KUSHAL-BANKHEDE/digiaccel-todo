import { cn } from '../../utils/cn.js';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEEF5]', className)} />;
}

export function TaskListSkeleton({ rows = 3, className }) {
  return (
    <div className={cn('space-y-5 py-3', className)}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((item) => (
        <div key={item} className="rounded-2xl bg-canvas p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="mt-4 h-7 w-14" />
        </div>
      ))}
    </div>
  );
}

export function WeeklyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
