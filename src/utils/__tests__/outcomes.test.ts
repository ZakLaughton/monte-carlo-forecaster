/**
 * Tests for src/utils/outcomes.ts
 *
 * outcomes.ts contains pure utility functions that transform raw simulation
 * data into the structured data needed by the redesigned Key Outcomes panel.
 *
 * getTimelinePositions: converts oddsByWeek + startDate into a set of labeled
 * pins (fastest, p50, p85, p95, slowest), each with a % position along the
 * horizontal timeline track and a formatted date. Also returns a `collapsed`
 * flag for when 85% and 95% land on the same week.
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

// all simulations complete in the same week — edge case for position math
const SINGLE_WEEK_ODDS: OddsByWeekPoint[] = [
  { weeks: 10, p: 1.0, count: 1000 },
];

const START_DATE = "2026-04-07";

describe("getTimelinePositions", () => {
  describe("normal spread", () => {
    const result = getTimelinePositions(NORMAL_ODDS, START_DATE);

    it("positions fastest at 0% and slowest at 100%", () => {
      expect(result.fastest.positionPct).toBe(0);
      expect(result.slowest.positionPct).toBe(100);
    });

    it("computes correct position percentages for each pin", () => {
      // range = 20 - 8 = 12
      // p50 (10): (10-8)/12 * 100 = 16.67
      // p85 (14): (14-8)/12 * 100 = 50
      // p95 (16): (16-8)/12 * 100 = 66.67
      expect(result.p50.positionPct).toBeCloseTo(16.67, 1);
      expect(result.p85.positionPct).toBeCloseTo(50, 1);
      expect(result.p95.positionPct).toBeCloseTo(66.67, 1);
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

  describe("edge case: fastest === slowest (all simulations same week)", () => {
    const result = getTimelinePositions(SINGLE_WEEK_ODDS, START_DATE);

    it("does not produce NaN positions", () => {
      expect(result.fastest.positionPct).not.toBeNaN();
      expect(result.slowest.positionPct).not.toBeNaN();
      expect(result.p50.positionPct).not.toBeNaN();
      expect(result.p85.positionPct).not.toBeNaN();
      expect(result.p95.positionPct).not.toBeNaN();
    });
  });
});
