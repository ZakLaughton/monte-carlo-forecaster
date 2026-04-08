/**
 * Tests for the TimelineTrack component.
 *
 * TimelineTrack renders a horizontal bar with pins at p50, p85, and p95.
 * Each pin shows a date above the track and a two-line label below ("X% done" / "by this date").
 * The p85 pin shows a star next to its date. The "slowest" pin is not rendered.
 */

import { render, screen } from "../../test-utils";
import { TimelineTrack } from "../TimelineTrack";
import type { TimelinePositions } from "../../utils/outcomes";

const POSITIONS: TimelinePositions = {
  p50: { date: "May 12", weekLabel: "5 weeks", positionPct: 0 },
  p85: { date: "Jun 9", weekLabel: "9 weeks", positionPct: 70 },
  p95: { date: "Jun 23", weekLabel: "11 weeks", positionPct: 90 },
  slowest: { date: "Jul 7", weekLabel: "13 weeks", positionPct: 100 },
  p85p95Collapsed: false,
};

const COLLAPSED_POSITIONS: TimelinePositions = {
  ...POSITIONS,
  p85p95Collapsed: true,
};

describe("TimelineTrack", () => {
  describe("pin labels", () => {
    it("renders two-line labels for p50, p85, and p95", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      expect(screen.getAllByText("50% done")).toHaveLength(1);
      expect(screen.getAllByText("85% done")).toHaveLength(1);
      expect(screen.getAllByText("95% done")).toHaveLength(1);
      expect(screen.getAllByText("by this date")).toHaveLength(3);
    });

    it("does not render a slowest pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);
      expect(screen.queryByText("slowest")).not.toBeInTheDocument();
    });

    it("renders a star next to the p85 date", () => {
      render(<TimelineTrack positions={POSITIONS} />);
      expect(screen.getByText("Jun 9 ★")).toBeInTheDocument();
    });

    it("renders dates for p50, p85, and p95", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      expect(screen.getByText("May 12")).toBeInTheDocument();
      expect(screen.getByText("Jun 9 ★")).toBeInTheDocument();
      expect(screen.getByText("Jun 23")).toBeInTheDocument();
    });
  });

  describe("collapsed (p85 and p95 same week)", () => {
    it("renders only two pins (p50 and p85)", () => {
      render(<TimelineTrack positions={COLLAPSED_POSITIONS} />);
      const pins = document.querySelectorAll("[data-pin]");
      expect(pins).toHaveLength(2);
    });

    it("does not render the 95% done label", () => {
      render(<TimelineTrack positions={COLLAPSED_POSITIONS} />);
      expect(screen.queryByText("95% done")).not.toBeInTheDocument();
    });
  });

  describe("spread (p85 and p95 different weeks)", () => {
    it("renders three pins (p50, p85, p95)", () => {
      render(<TimelineTrack positions={POSITIONS} />);
      const pins = document.querySelectorAll("[data-pin]");
      expect(pins).toHaveLength(3);
    });
  });

  describe("pin positions", () => {
    it("positions each pin at the correct percentage offset", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      const pins = document.querySelectorAll("[data-pin]");
      expect(pins).toHaveLength(3);
    });
  });
});
