import { format } from 'date-fns';
import { cn } from '../../utils/cn.js';
import { getWeekDaysFromKey } from '../../utils/date.js';

export default function WeekStrip({ weekStartKey, selectedDate, onSelect }) {
  const days = getWeekDaysFromKey(weekStartKey);

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {days.map((day) => {
        const selected = day.key === selectedDate;

        return (
          <button
            key={day.key}
            type="button"
            onClick={() => onSelect(day.key)}
            aria-pressed={selected}
            aria-label={`Select ${format(day.date, 'EEEE, d MMMM')}`}
            className="group flex flex-col items-center rounded-xl py-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <span
              className={cn(
                'text-[11px] font-medium transition',
                selected ? 'text-primary' : 'text-muted'
              )}
            >
              {day.dayLabel}
            </span>
            <span
              className={cn(
                'mt-1.5 flex h-10 w-10 flex-col items-center justify-center rounded-xl text-sm font-semibold transition',
                selected
                  ? 'bg-primary text-white shadow-[0_8px_18px_-10px_rgba(76,95,245,0.95)]'
                  : 'text-ink group-hover:bg-primary-soft'
              )}
            >
              {day.dayNumber}
              <span
                className={cn(
                  'mt-0.5 h-1 w-1 rounded-full',
                  selected ? 'bg-white' : day.isToday ? 'bg-primary' : 'bg-transparent'
                )}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
