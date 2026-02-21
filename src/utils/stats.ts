export type OddsByWeekPoint = {
  /** The week number */
  weeks: number;
  /** Cumulative probability of completion by this week (0..1) */
  p: number;
  /** Cumulative count of simulations completed by this week */
  count: number;
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
  const counts = countOccurrences(results);
  return buildCumulativeOdds(counts);
}

/**
 * Counts how many times each week number appears in the results.
 */
function countOccurrences(results: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const w of results) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return counts;
}

/**
 * Builds a sorted cumulative odds array from a map of week counts.
 */
function buildCumulativeOdds(counts: Map<number, number>): OddsByWeekPoint[] {
  const total = Array.from(counts.values()).reduce((sum, c) => sum + c, 0);
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
