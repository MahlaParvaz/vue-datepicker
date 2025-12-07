export function compareDates(a, b) {
  if (!a || !b) return 0;

  const yearA = a.jy || a.year;
  const yearB = b.jy || b.year;
  const monthA = a.jm || a.month;
  const monthB = b.jm || b.month;
  const dayA = a.jd || a.day;
  const dayB = b.jd || b.day;

  if (yearA !== yearB) return yearA - yearB;
  if (monthA !== monthB) return monthA - monthB;
  return dayA - dayB;
}

export function isSameDate(a, b) {
  if (!a || !b) return false;

  const yearA = a.jy || a.year;
  const yearB = b.jy || b.year;
  const monthA = a.jm || a.month;
  const monthB = b.jm || b.month;
  const dayA = a.jd || a.day;
  const dayB = b.jd || b.day;

  return yearA === yearB && monthA === monthB && dayA === dayB;
}

export function isBefore(a, b) {
  return compareDates(a, b) < 0;
}

export function isAfter(a, b) {
  return compareDates(a, b) > 0;
}

export function isBetween(date, start, end) {
  if (!date || !start || !end) return false;
  return compareDates(date, start) >= 0 && compareDates(date, end) <= 0;
}

export function isBetweenExclusive(date, start, end) {
  if (!date || !start || !end) return false;
  return compareDates(date, start) > 0 && compareDates(date, end) < 0;
}

export function sortDates(dates, descending = false) {
  const sorted = [...dates].sort(compareDates);
  return descending ? sorted.reverse() : sorted;
}
