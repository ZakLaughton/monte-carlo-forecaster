/**
 * Pure utility functions that transform raw simulation data into the structured
 * data consumed by the Key Outcomes panel components.
 *
 * These functions sit between the simulation engine (monte-carlo.ts / stats.ts)
 * and the presentation layer, keeping display logic out of components.
 */

import { toCompletionDate } from "./dates";
import type { OddsByWeekPoint } from "./stats";

export type TimelinePin = {
  date: string | null;
  weekLabel: string;
  positionPct: number;
};

export type TimelinePositions = {
  fastest: TimelinePin;
  p50: TimelinePin;
  p85: TimelinePin;
  p95: TimelinePin;
  slowest: TimelinePin;
};

/**
 * Converts oddsByWeek data into labeled timeline pins, each with a position
 * percentage for rendering along a horizontal track.
 *
 * Pin positions are calculated as:
 *   (pinWeeks - fastestWeeks) / (slowestWeeks - fastestWeeks) * 100
 */
export function getTimelinePositions(
  oddsByWeek: OddsByWeekPoint[],
  startDate: string,
): TimelinePositions {
  const fastestWeeks = oddsByWeek[0].weeks;
  const slowestWeeks = oddsByWeek[oddsByWeek.length - 1].weeks;

  const p50Weeks = getPercentileWeeks(oddsByWeek, 0.5);
  const p85Weeks = getPercentileWeeks(oddsByWeek, 0.85);
  const p95Weeks = getPercentileWeeks(oddsByWeek, 0.95);

  return {
    fastest: makePin(fastestWeeks, fastestWeeks, slowestWeeks, startDate),
    p50: makePin(p50Weeks, fastestWeeks, slowestWeeks, startDate),
    p85: makePin(p85Weeks, fastestWeeks, slowestWeeks, startDate),
    p95: makePin(p95Weeks, fastestWeeks, slowestWeeks, startDate),
    slowest: makePin(slowestWeeks, fastestWeeks, slowestWeeks, startDate),
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

function makePin(
  weeks: number,
  fastestWeeks: number,
  slowestWeeks: number,
  startDate: string,
): TimelinePin {
  const range = slowestWeeks - fastestWeeks;
  const positionPct =
    range === 0 ? 0 : ((weeks - fastestWeeks) / range) * 100;

  return {
    date: toCompletionDate(startDate, weeks),
    weekLabel: `${weeks} ${weeks === 1 ? "week" : "weeks"}`,
    positionPct,
  };
}
