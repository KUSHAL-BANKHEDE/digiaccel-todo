export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDate = (value) => new Date(`${value}T00:00:00.000Z`);

export const toDateString = (date) => date.toISOString().slice(0, 10);

export const isValidDateString = (value) => {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = parseDate(value);
  return !Number.isNaN(parsed.getTime()) && toDateString(parsed) === value;
};

export const addDays = (dateString, days) => {
  const date = parseDate(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateString(date);
};

export const getWeekStart = (dateString) => {
  const date = parseDate(dateString);
  const dayOfWeek = date.getUTCDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  date.setUTCDate(date.getUTCDate() + offsetToMonday);
  return toDateString(date);
};

export const getWeekEnd = (weekStart) => addDays(weekStart, 6);

export const todayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
