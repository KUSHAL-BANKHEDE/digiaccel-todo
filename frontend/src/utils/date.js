import {
  addDays,
  differenceInCalendarWeeks,
  format,
  isToday,
  parseISO,
  startOfWeek,
} from 'date-fns';

export const toDateKey = (date) => format(date, 'yyyy-MM-dd');

export const parseDateKey = (key) => parseISO(key);

export const todayKey = () => toDateKey(new Date());

export const isTodayKey = (key) => key === todayKey();

export const getWeekStartDate = (date = new Date()) => startOfWeek(date, { weekStartsOn: 1 });

export const getCurrentWeekStartKey = () => toDateKey(getWeekStartDate());

export const addDaysToKey = (key, amount) => toDateKey(addDays(parseDateKey(key), amount));

export const getWeekDaysFromKey = (weekStartKey) => {
  const start = parseDateKey(weekStartKey);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);

    return {
      key: toDateKey(date),
      date,
      dayLabel: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isToday(date),
    };
  });
};

export const getWeekOffset = (weekStartKey, referenceWeekStartKey) =>
  differenceInCalendarWeeks(parseDateKey(weekStartKey), parseDateKey(referenceWeekStartKey), {
    weekStartsOn: 1,
  });

export const formatWeekRange = (weekStartKey, weekEndKey) => {
  const start = parseDateKey(weekStartKey);
  const end = parseDateKey(weekEndKey);

  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
};

export const formatLongDate = (key) => format(parseDateKey(key), 'EEEE d, MMMM');

export const formatShortDate = (key) => format(parseDateKey(key), 'EEE, d MMM');

export const formatTimeRange = (startTime, endTime) =>
  endTime ? `${startTime} - ${endTime}` : startTime;
