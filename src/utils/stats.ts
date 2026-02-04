export type OddsByWeekPoint = {
  weeks: number;
  p: number; // probability done by this week (0..1)
  count: number; // cumulative count (optional but handy)
};

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
