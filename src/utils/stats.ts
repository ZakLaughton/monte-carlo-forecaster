export type OddsByWeekPoint = {
  weeks: number;
  p: number; // probability done by this week (0..1)
  count: number; // cumulative count (optional but handy)
};

/**
 * Converts an array of simulation results (number of weeks) into an array of cumulative odds.
 * Each result represents the number of weeks it took to complete a task in a simulation.
 * The function calculates the probability of completion by each week, along with cumulative counts.
 *
 * @param results - An array of numbers where each number represents the weeks taken in a simulation.
 * @returns An array of objects, each containing:
 *   - `weeks`: The week number.
 *   - `p`: The cumulative probability of completion by this week (0 to 1).
 *   - `count`: The cumulative count of simulations completed by this week.
 */
export function toOddsByWeek(results: number[]): OddsByWeekPoint[] {
  if (results.length === 0) return [];

  // Count exact weeks
  const counts = new Map<number, number>();
  for (const w of results) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }

  const total = results.length;

  // Sort by week and build cumulative odds
  const sortedWeeks = Array.from(counts.keys()).sort((a, b) => a - b);

  let cumulativeCount = 0;
  return sortedWeeks.map((weeks) => {
    cumulativeCount += counts.get(weeks)!;
    return {
      weeks,
      count: cumulativeCount,
      p: cumulativeCount / total,
    };
  });
}
