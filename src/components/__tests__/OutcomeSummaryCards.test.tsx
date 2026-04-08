/**
 * Tests for OutcomeSummaryCards.
 *
 * Single full-width card showing the recommended 85% commit date.
 * The 50% reference has been removed — it's already shown in the timeline below.
 */

import { render, screen } from "../../test-utils";
import { OutcomeSummaryCards } from "../OutcomeSummaryCards";

const BASE_PROPS = {
  p85: { date: "Jun 2", weekLabel: "8 weeks" },
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

  describe("50% reference (removed)", () => {
    it("does not render the 50% date", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.queryByText("May 26")).not.toBeInTheDocument();
    });

    it("does not render '50% of simulations' text", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.queryByText(/50% of simulations/i)).not.toBeInTheDocument();
    });
  });
});
