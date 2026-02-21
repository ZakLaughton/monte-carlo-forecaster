export type OddsByWeekPoint = {
  /** The week number */
  weeks: number;
  /** Cumulative probability of completion by this week (0..1) */
  p: number;
  /** Cumulative count of simulations completed by this week */
  count: number;
};

/**
 * Converts an array of simulation results (number of weeks)
 * into cumulative completion odds by week.
 */
export function toOddsByWeek(results: number[]): OddsByWeekPoint[] {
  if (results.length === 0) return [];

  const counts = countOccurrences(results);
  const total = results.length;

  const sortedWeeks = Array.from(counts.keys()).sort((a, b) => a - b);

  const odds: OddsByWeekPoint[] = [];
  let cumulativeCount = 0;

  for (const week of sortedWeeks) {
    const weekCount = counts.get(week)!;
    cumulativeCount += weekCount;

    odds.push({
      weeks: week,
      count: cumulativeCount,
      p: cumulativeCount / total,
    });
  }

  return odds;
}

/**
 * Counts how many times each week appears in the results.
 */
function countOccurrences(results: number[]): Map<number, number> {
  const counts = new Map<number, number>();

  for (const week of results) {
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  return counts;
}
