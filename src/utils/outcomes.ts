/**
 * Pure utility functions that transform raw simulation data into the structured
 * data consumed by the Key Outcomes panel components.
 *
 * These functions sit between the simulation engine (monte-carlo.ts / stats.ts)
 * and the presentation layer, keeping display logic out of components.
 */

import { toCompletionDate, isSameWeek } from "./dates";
import type { OddsByWeekPoint } from "./stats";

export type TimelinePin = {
  date: string | null;
  weekLabel: string;
  positionPct: number;
};

export type TimelinePositions = {
  p50: TimelinePin;
  p85: TimelinePin;
  p95: TimelinePin;
  slowest: TimelinePin;
  p85p95Collapsed: boolean;
};

/**
 * Converts oddsByWeek data into labeled timeline pins, each with a position
 * percentage for rendering along a horizontal track.
 *
 * Pin positions are percentile-based, not time-based, so the visual space
 * directly maps to simulation count:
 *   fastest=0, p50=50, p85=85, p95=95, slowest=100
 *
 * This prevents rare outlier dates (e.g. the slowest 1 in 10,000 simulation)
 * from taking up disproportionate visual space on the track.
 */
export function getTimelinePositions(
  oddsByWeek: OddsByWeekPoint[],
  startDate: string,
): TimelinePositions {
  const slowestWeeks = oddsByWeek[oddsByWeek.length - 1].weeks;

  const p50Weeks = getPercentileWeeks(oddsByWeek, 0.5);
  const p85Weeks = getPercentileWeeks(oddsByWeek, 0.85);
  const p95Weeks = getPercentileWeeks(oddsByWeek, 0.95);

  const toDate = (weeks: number) => {
    const d = new Date(`${startDate}T00:00:00`);
    d.setDate(d.getDate() + weeks * 7);
    return d;
  };

  // Positions are rescaled so p50=left edge (0%) and slowest=right edge (100%).
  // This removes the 0–50% "risky" zone from the track entirely.
  return {
    p50: makePin(p50Weeks, 0, startDate),
    p85: makePin(p85Weeks, 70, startDate),
    p95: makePin(p95Weeks, 90, startDate),
    slowest: makePin(slowestWeeks, 100, startDate),
    p85p95Collapsed: isSameWeek(toDate(p85Weeks), toDate(p95Weeks)),
  };
}

/**
 * Finds the number of weeks at which cumulative probability first reaches
 * or exceeds `target`.
 *
 * For example, with target=0.85: scans through the sorted oddsByWeek array
 * and returns the first week where 85% or more of simulations have finished.
 * Falls back to the slowest week if the data never reaches the target
 * (e.g. a truncated dataset whose max probability is 0.9).
 */
function getPercentileWeeks(
  oddsByWeek: OddsByWeekPoint[],
  target: number,
): number {
  const entry = oddsByWeek.find((point) => point.p >= target);
  return entry ? entry.weeks : oddsByWeek[oddsByWeek.length - 1].weeks;
}

function makePin(weeks: number, positionPct: number, startDate: string): TimelinePin {
  return {
    date: toCompletionDate(startDate, weeks),
    weekLabel: `${weeks} ${weeks === 1 ? "week" : "weeks"}`,
    positionPct,
  };
}
