/**
 * Tests for the TimelineTrack component.
 *
 * TimelineTrack renders a horizontal bar with pins at fastest, p50, p85,
 * p95, and slowest dates. Each pin shows a date above the line and a
 * plain-language label below. Pin positions are driven by positionPct
 * values from getTimelinePositions.
 */

import { render, screen } from "../../test-utils";
import { TimelineTrack } from "../TimelineTrack";
import type { TimelinePositions } from "../../utils/outcomes";

const POSITIONS: TimelinePositions = {
  fastest: { date: "Apr 14", weekLabel: "1 week", positionPct: 0 },
  p50: { date: "May 12", weekLabel: "5 weeks", positionPct: 33 },
  p85: { date: "Jun 9", weekLabel: "9 weeks", positionPct: 67 },
  p95: { date: "Jun 23", weekLabel: "11 weeks", positionPct: 83 },
  slowest: { date: "Jul 7", weekLabel: "13 weeks", positionPct: 100 },
};

describe("TimelineTrack", () => {
  describe("pin labels", () => {
    it("renders the below-pin label for each pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      expect(screen.getByText("fastest")).toBeInTheDocument();
      expect(screen.getByText("50% done by this date")).toBeInTheDocument();
      expect(screen.getByText("★ 85% done by this date")).toBeInTheDocument();
      expect(screen.getByText("95% done by this date")).toBeInTheDocument();
      expect(screen.getByText("slowest")).toBeInTheDocument();
    });

    it("renders the date above each pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      expect(screen.getByText("Apr 14")).toBeInTheDocument();
      expect(screen.getByText("May 12")).toBeInTheDocument();
      expect(screen.getByText("Jun 9")).toBeInTheDocument();
      expect(screen.getByText("Jun 23")).toBeInTheDocument();
      expect(screen.getByText("Jul 7")).toBeInTheDocument();
    });

  });

  describe("pin positions", () => {
    it("positions each pin at the correct percentage offset", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      const pins = document.querySelectorAll("[data-pin]");
      const positions = Array.from(pins).map(
        (pin) => (pin as HTMLElement).style.left,
      );

      expect(positions).toContain("0%");
      expect(positions).toContain("33%");
      expect(positions).toContain("67%");
      expect(positions).toContain("83%");
      expect(positions).toContain("100%");
    });
  });
});
