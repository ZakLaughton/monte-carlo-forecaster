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
  p85p95Collapsed: false,
};

const COLLAPSED_PROPS = {
  p85: { date: "Jun 2", weekLabel: "8 weeks" },
  p85p95Collapsed: true,
};

describe("OutcomeSummaryCards", () => {
  describe("full-width card", () => {
    it("renders a single card with no siblings", () => {
      const { container } = render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(container.firstChild?.childNodes).toHaveLength(1);
    });
  });

  describe("collapsed (85% and 95% same week)", () => {
    it("shows '85–95%' in the subtext", () => {
      render(<OutcomeSummaryCards {...COLLAPSED_PROPS} />);
      expect(screen.getByText(/85–95% of simulations done by this date/i)).toBeInTheDocument();
    });
  });

  describe("spread (85% and 95% different weeks)", () => {
    it("shows '85%' only in the subtext", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/85% of simulations done by this date/i)).toBeInTheDocument();
      expect(screen.queryByText(/85–95%/i)).not.toBeInTheDocument();
    });
  });

  describe("left card (85% commit date)", () => {
    it("renders the p85 date", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText("Jun 2")).toBeInTheDocument();
    });

    it("renders the subtext with full plain-language copy", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/85% of simulations done by this date · 8 weeks out/i)).toBeInTheDocument();
    });

    it("renders a '85% confidence date' label", () => {
      render(<OutcomeSummaryCards {...BASE_PROPS} />);
      expect(screen.getByText(/85% confidence date/i)).toBeInTheDocument();
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
