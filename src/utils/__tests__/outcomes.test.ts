/**
 * Tests for src/utils/outcomes.ts
 *
 * outcomes.ts contains pure utility functions that transform raw simulation
 * data into the structured data needed by the redesigned Key Outcomes panel.
 *
 * getTimelinePositions: converts oddsByWeek + startDate into a set of labeled
 * pins (fastest, p50, p85, p95, slowest), each with a % position along the
 * horizontal timeline track and a formatted date.
 *
 * Pin positions are percentile-based (not time-based), so the visual space
 * directly maps to simulation count:
 *   fastest=0, p50=50, p85=85, p95=95, slowest=100
 */

import { getTimelinePositions } from "../outcomes";
import type { OddsByWeekPoint } from "../stats";

// fastest=8, p50=10, p85=14, p95=16, slowest=20
const NORMAL_ODDS: OddsByWeekPoint[] = [
  { weeks: 8, p: 0.1, count: 100 },
  { weeks: 10, p: 0.5, count: 500 },
  { weeks: 12, p: 0.7, count: 700 },
  { weeks: 14, p: 0.85, count: 850 },
  { weeks: 16, p: 0.95, count: 950 },
  { weeks: 20, p: 1.0, count: 1000 },
];

const START_DATE = "2026-04-07";

describe("getTimelinePositions", () => {
  describe("normal spread", () => {
    const result = getTimelinePositions(NORMAL_ODDS, START_DATE);

    it("positions fastest at 0% and slowest at 100%", () => {
      expect(result.fastest.positionPct).toBe(0);
      expect(result.slowest.positionPct).toBe(100);
    });

    it("positions pins at their percentile values, not time values", () => {
      expect(result.p50.positionPct).toBe(50);
      expect(result.p85.positionPct).toBe(85);
      expect(result.p95.positionPct).toBe(95);
    });

    it("sets correct week labels", () => {
      expect(result.fastest.weekLabel).toBe("8 weeks");
      expect(result.p50.weekLabel).toBe("10 weeks");
      expect(result.p85.weekLabel).toBe("14 weeks");
      expect(result.p95.weekLabel).toBe("16 weeks");
      expect(result.slowest.weekLabel).toBe("20 weeks");
    });

    it("computes non-null dates from startDate", () => {
      expect(result.fastest.date).not.toBeNull();
      expect(result.p50.date).not.toBeNull();
      expect(result.p85.date).not.toBeNull();
      expect(result.p95.date).not.toBeNull();
      expect(result.slowest.date).not.toBeNull();
    });
  });

  describe("edge case: 1-week label is singular", () => {
    it("uses 'week' (singular) when a pin lands on week 1", () => {
      const oneWeekOdds: OddsByWeekPoint[] = [
        { weeks: 1, p: 1.0, count: 1000 },
      ];
      const result = getTimelinePositions(oneWeekOdds, START_DATE);
      expect(result.fastest.weekLabel).toBe("1 week");
    });
  });

  describe("edge case: percentile fallback when data doesn't reach target", () => {
    it("falls back to slowest week when no entry reaches the p95 threshold", () => {
      // max probability is 0.9, never reaches 0.95
      const lowCoverageOdds: OddsByWeekPoint[] = [
        { weeks: 8, p: 0.5, count: 500 },
        { weeks: 12, p: 0.85, count: 850 },
        { weeks: 16, p: 0.9, count: 900 },
      ];
      const result = getTimelinePositions(lowCoverageOdds, START_DATE);
      expect(result.p95.weekLabel).toBe("16 weeks");
    });
  });

});
