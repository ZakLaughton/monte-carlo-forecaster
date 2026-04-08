/**
 * Tests for src/utils/outcomes.ts
 *
 * outcomes.ts contains pure utility functions that transform raw simulation
 * data into the structured data needed by the redesigned Key Outcomes panel.
 *
 * getTimelinePositions: converts oddsByWeek + startDate into a set of labeled
 * pins (p50, p85, p95, slowest), each with a % position along the horizontal
 * timeline track and a formatted date.
 *
 * The track starts at p50 (left edge = 0%) — the 0–50% zone is not shown.
 * Fixed position values: p50=0, p85=70, p95=90, slowest=100.
 */

import { getTimelinePositions } from "../outcomes";
import type { OddsByWeekPoint } from "../stats";

// p50=10, p85=14, p95=16, slowest=20
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

    it("positions p50 at 0% (left edge) and slowest at 100% (right edge)", () => {
      expect(result.p50.positionPct).toBe(0);
      expect(result.slowest.positionPct).toBe(100);
    });

    it("positions p85 at 70% and p95 at 90%", () => {
      expect(result.p85.positionPct).toBe(70);
      expect(result.p95.positionPct).toBe(90);
    });

    it("sets correct week labels", () => {
      expect(result.p50.weekLabel).toBe("10 weeks");
      expect(result.p85.weekLabel).toBe("14 weeks");
      expect(result.p95.weekLabel).toBe("16 weeks");
      expect(result.slowest.weekLabel).toBe("20 weeks");
    });

    it("computes non-null dates from startDate", () => {
      expect(result.p50.date).not.toBeNull();
      expect(result.p85.date).not.toBeNull();
      expect(result.p95.date).not.toBeNull();
      expect(result.slowest.date).not.toBeNull();
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
