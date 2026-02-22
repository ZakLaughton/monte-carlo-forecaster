import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { DeliveryOddsTable } from "../DeliveryOddsChart";

// Ten evenly spaced data points so every DEFAULT and FULL target can be matched.
// DEFAULT_TARGETS [0.5, 0.7, 0.85, 0.9, 0.95] → shows "50%", "70%", "85%", "90%", "95%"
// FULL_TARGETS adds 0.1, 0.2 … → additionally shows "10%", "20%", etc.
const DATA = [
  { weeks: 1, p: 0.1, count: 100 },
  { weeks: 2, p: 0.2, count: 200 },
  { weeks: 3, p: 0.3, count: 300 },
  { weeks: 4, p: 0.4, count: 400 },
  { weeks: 5, p: 0.5, count: 500 },
  { weeks: 6, p: 0.6, count: 600 },
  { weeks: 7, p: 0.7, count: 700 },
  { weeks: 8, p: 0.8, count: 800 },
  { weeks: 9, p: 0.9, count: 900 },
  { weeks: 10, p: 1.0, count: 1000 },
];

describe("DeliveryOddsTable", () => {
  describe("default (collapsed) state", () => {
    it("shows the default confidence rows", () => {
      render(<DeliveryOddsTable data={DATA} />);

      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("70%")).toBeInTheDocument();
      expect(screen.getByText("95%")).toBeInTheDocument();
    });

    it("does not show extended rows before expanding", () => {
      render(<DeliveryOddsTable data={DATA} />);

      expect(screen.queryByText("10%")).not.toBeInTheDocument();
      expect(screen.queryByText("20%")).not.toBeInTheDocument();
    });

    it("shows a 'Show full distribution' link", () => {
      render(<DeliveryOddsTable data={DATA} />);

      expect(
        screen.getByRole("button", { name: /show full distribution/i }),
      ).toBeInTheDocument();
    });
  });

  describe("expanded state", () => {
    it("shows extended rows after clicking the toggle", async () => {
      const user = userEvent.setup();
      render(<DeliveryOddsTable data={DATA} />);

      await user.click(
        screen.getByRole("button", { name: /show full distribution/i }),
      );

      expect(screen.getByText("10%")).toBeInTheDocument();
      expect(screen.getByText("20%")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("changes the toggle label to 'Show less' after expanding", async () => {
      const user = userEvent.setup();
      render(<DeliveryOddsTable data={DATA} />);

      await user.click(
        screen.getByRole("button", { name: /show full distribution/i }),
      );

      expect(
        screen.getByRole("button", { name: /show less/i }),
      ).toBeInTheDocument();
    });

    it("collapses back to default rows when 'Show less' is clicked", async () => {
      const user = userEvent.setup();
      render(<DeliveryOddsTable data={DATA} />);

      await user.click(
        screen.getByRole("button", { name: /show full distribution/i }),
      );
      await user.click(screen.getByRole("button", { name: /show less/i }));

      expect(screen.queryByText("10%")).not.toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });
  });
});
