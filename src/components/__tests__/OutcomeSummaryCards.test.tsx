/**
 * Tests for OutcomeSummaryCards.
 *
 * Two side-by-side cards:
 * - Left (accent, 2/3 width): the recommended commit date at 85%
 * - Right (dimmed, 1/3 width): the 50% reference date
 *
 * The 50% card must never use positive framing — it's a cautionary anchor.
 */

import { render, screen } from "../../test-utils";
import { OutcomeSummaryCards } from "../OutcomeSummaryCards";

const BASE_PROPS = {
  p50: { date: "May 26", weekLabel: "7 weeks" },
  p85: { date: "Jun 2", weekLabel: "8 weeks" },
  p95: { date: "Jun 9", weekLabel: "9 weeks" },
};

describe("OutcomeSummaryCards", () => {
  describe("left card (85% commit date)", () => {
    it("renders the p85 date", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText("Jun 2")).toBeInTheDocument();
    });

    it("renders the subtext with full plain-language copy", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/85% of simulations done by this date · 8 weeks out/i)).toBeInTheDocument();
    });

    it("renders a 'commit to this' label", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/commit to this/i)).toBeInTheDocument();
    });

    it("renders '85% of simulations' in the subtext", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/85% of simulations/i)).toBeInTheDocument();
    });
  });

  describe("right card (50% reference)", () => {
    it("renders the p50 date", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText("May 26")).toBeInTheDocument();
    });

    it("renders '50% of simulations' label", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/50% of simulations/i)).toBeInTheDocument();
    });

    it("does not use positive framing on the 50% card", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      const text = document.body.textContent ?? "";
      expect(text).not.toMatch(/most likely/i);
      expect(text).not.toMatch(/best case/i);
    });

    it("renders the right card at reduced opacity", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      const rightCard = screen.getByTestId("card-p50");
      const opacity = parseFloat(
        (rightCard as HTMLElement).style.opacity ?? "1",
      );
      expect(opacity).toBeLessThan(1);
    });
  });
});
