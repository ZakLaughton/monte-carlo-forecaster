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
 * Formats a Date object as "Mon DD, YYYY" in the user's locale.
 */
const COMPLETION_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

function formatCompletionDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, COMPLETION_DATE_FORMAT).format(
    date,
  );
}
