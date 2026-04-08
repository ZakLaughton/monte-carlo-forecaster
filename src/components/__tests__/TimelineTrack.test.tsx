/**
 * Tests for the TimelineTrack component.
 *
 * TimelineTrack renders a horizontal bar with pins at p50, p85, p95, and
 * slowest. The track starts at p50 (left edge) — the 0–50% zone is not shown.
 * Pin positions are driven by positionPct values from getTimelinePositions.
 */

import { render, screen } from "../../test-utils";
import { TimelineTrack } from "../TimelineTrack";
import type { TimelinePositions } from "../../utils/outcomes";

const POSITIONS: TimelinePositions = {
  p50: { date: "May 12", weekLabel: "5 weeks", positionPct: 0 },
  p85: { date: "Jun 9", weekLabel: "9 weeks", positionPct: 70 },
  p95: { date: "Jun 23", weekLabel: "11 weeks", positionPct: 90 },
  slowest: { date: "Jul 7", weekLabel: "13 weeks", positionPct: 100 },
};

describe("TimelineTrack", () => {
  describe("pin labels", () => {
    it("renders the below-pin label for each pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);

      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("★ 85%")).toBeInTheDocument();
      expect(screen.getByText("95%")).toBeInTheDocument();
      expect(screen.getByText("slowest")).toBeInTheDocument();
    });

    it("does not render a fastest pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);
      expect(screen.queryByText("fastest")).not.toBeInTheDocument();
    });

    it("renders a legend line explaining what the percentages mean", () => {
      render(<TimelineTrack positions={POSITIONS} />);
      expect(
        screen.getByText(/each % is both a simulation count and your confidence/i),
      ).toBeInTheDocument();
    });

    it("renders the date above each pin", () => {
      render(<TimelineTrack positions={POSITIONS} />);

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
      expect(positions).toContain("70%");
      expect(positions).toContain("90%");
      expect(positions).toContain("100%");
    });
  });
});
