/**
 * Returns true if two dates are within 6 days of each other (inclusive).
 * Used to determine whether the 85% and 95% forecast dates are close enough
 * to treat as the same delivery window.
 */
export function isSameWeek(a: Date, b: Date): boolean {
  const diffDays = Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 6;
}

/**
 * Returns a formatted completion date given a start date and number of weeks.
 * @param startDate - ISO date string (YYYY-MM-DD)
 * @param weeks - Number of weeks to add
 * @returns Formatted date string (e.g., "Jun 4, 2026") or null if invalid input
 */
export function toCompletionDate(
  startDate: string,
  weeks: number,
): string | null {
  if (!startDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;

  const completionDate = new Date(start);
  completionDate.setDate(completionDate.getDate() + weeks * 7);

  return formatCompletionDate(completionDate);
}

/**
 * Formats a Date object as "Mon DD" within the current year, or "Mon DD, YYYY"
 * when the date falls in a different year.
 */
function formatCompletionDate(date: Date): string {
  const includeYear = date.getFullYear() !== new Date().getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  };
  return new Intl.DateTimeFormat(undefined, options).format(date);
}
