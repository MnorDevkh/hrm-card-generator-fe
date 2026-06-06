export const APP_TIMEZONE = 'Asia/Phnom_Penh';

/** Parse API datetimes (Mongo UTC, often without Z suffix). */
export function parseApiDateTime(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) return value;

  const s = String(value).trim();
  if (!s) return null;

  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) {
    return new Date(s);
  }

  const normalized = s.includes('T') ? s : `${s}T00:00:00`;
  return new Date(`${normalized}Z`);
}

/** Format API datetime in Cambodia local time. */
export function formatAppDateTime(value, options = {}) {
  const d = parseApiDateTime(value);
  if (!d || Number.isNaN(d.getTime())) return value ? String(value) : '';

  return d.toLocaleString(undefined, {
    timeZone: APP_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  });
}
