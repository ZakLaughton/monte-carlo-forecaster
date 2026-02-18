export function toCompletionDate(
  startDate: string,
  weeks: number,
): string | null {
  if (!startDate) return null;

  const base = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(base.getTime())) return null;

  const completion = new Date(base);
  completion.setDate(completion.getDate() + weeks * 7);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(completion);
}
