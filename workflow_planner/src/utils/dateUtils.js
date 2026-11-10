export const pad = (n) => String(n).padStart(2, '0');

export const toIsoDate = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const getPeriodKey = (scope, offset = 0) => {
  const d = new Date();
  if (scope === 'day') {
    d.setDate(d.getDate() + offset);
    return toIsoDate(d);
  } else if (scope === 'week') {
    const monday = getMonday(d);
    monday.setDate(monday.getDate() + offset * 7);
    return toIsoDate(monday);
  } else if (scope === 'month') {
    d.setMonth(d.getMonth() + offset);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  }
  return toIsoDate(d);
};

export const formatPeriodLabel = (scope, periodKey) => {
  if (!periodKey) return '';
  if (scope === 'month') {
    const [y, m] = periodKey.split('-');
    return `${MONTH_NAMES[+m - 1]} ${y}`;
  }
  const parts = periodKey.split('-');
  if (parts.length < 3) return periodKey;
  const [y, m, d] = parts;
  return `${scope === 'week' ? 'Week of ' : ''}${+d} ${MONTH_NAMES[+m - 1]} ${y}`;
};

export const getFormattedCurrentDate = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
