import { render, screen, act } from "../test-utils";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { simulateDeliveryWeeks } from "../utils/monte-carlo";

jest.mock("../utils/monte-carlo");

// [3,3,4,4,5] → toOddsByWeek gives p50=4wk, p85=5wk, p95=5wk
// ForecastResults shows: 5 simulations, fastest=3wk, slowest=5wk, median=4wk
const MOCK_RESULTS = [3, 3, 4, 4, 5];

beforeEach(() => {
  jest.useFakeTimers();
  (simulateDeliveryWeeks as jest.Mock).mockReturnValue(MOCK_RESULTS);
  localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

// delay: null disables userEvent's internal pointer delays so they don't
// conflict with fake timers
async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Week 1"), "5");
  await user.type(screen.getByLabelText("Remaining Work Items"), "10");
  await user.click(screen.getByRole("button", { name: /run simulation/i }));
}

describe("App", () => {
  describe("initial render", () => {
    it.todo("shows idle status before any simulation is run");
    it.todo("results panel has no completion dates visible initially");
  });

  describe("simulation flow", () => {
    it("shows running status immediately after submitting the form", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      // StatusCard renders all three state layers in the DOM and uses a CSS
      // class to reveal the active one, so we check the class directly
      const runningLayer = screen
        .getByText(/running 10,000 simulations/i)
        .closest('[class*="status-row__layer"]');
      expect(runningLayer).toHaveClass("status-row__layer--visible");
    });

    it("run button stays disabled during the minimum loading delay", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      // One millisecond before the 400ms loading delay completes
      act(() => {
        jest.advanceTimersByTime(399);
      });

      expect(
        screen.getByRole("button", { name: /run simulation/i }),
      ).toBeDisabled();
    });

    it("results panel transitions to done state after the loading delay elapses", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      const doneLayer = screen
        .getByText(/forecast generated from 10,000 simulations/i)
        .closest('[class*="status-row__layer"]');
      expect(doneLayer).toHaveClass("status-row__layer--visible");
    });

    it("key outcome weeks are visible in the results panel after simulation completes", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      // p50=4wk, p85=5wk, p95=5wk — "4 weeks" also appears in DeliveryOddsTable
      expect(screen.getAllByText("4 weeks").length).toBeGreaterThan(0);
      expect(screen.getAllByText("5 weeks").length).toBeGreaterThan(0);
    });

    it("forecast stats are visible in the results panel after simulation completes", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(screen.getByText(/5 simulations/i)).toBeInTheDocument();
      expect(screen.getByText(/fastest: 3wk/i)).toBeInTheDocument();
      expect(screen.getByText(/slowest: 5wk/i)).toBeInTheDocument();
      expect(screen.getByText(/median: 4wk/i)).toBeInTheDocument();
    });

    it("run button re-enables after simulation and reveal transition both finish", async () => {
      const user = userEvent.setup({ delay: null });
      render(<App />);

      await fillAndSubmit(user);

      // 400ms loading delay + 200ms reveal transition
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(
        screen.getByRole("button", { name: /run simulation/i }),
      ).not.toBeDisabled();
    });

    it("running a second simulation replaces the previous results", async () => {
      const user = userEvent.setup({ delay: null });
      // secondResults: fastest=8wk, slowest=11wk — clearly distinct from first
      const secondResults = [8, 9, 10, 10, 11];
      (simulateDeliveryWeeks as jest.Mock)
        .mockReturnValueOnce(MOCK_RESULTS)
        .mockReturnValueOnce(secondResults);

      render(<App />);

      await fillAndSubmit(user);
      act(() => {
        jest.advanceTimersByTime(600);
      });
      expect(screen.getByText(/fastest: 3wk/i)).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: /run simulation/i }),
      );
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByText(/fastest: 8wk/i)).toBeInTheDocument();
      expect(screen.queryByText(/fastest: 3wk/i)).not.toBeInTheDocument();
    });
  });

  describe("reset flow", () => {
    it.todo("results panel returns to idle state after reset");
    it.todo("form fields are cleared after reset");
    it.todo(
      "reset during an in-flight simulation cancels the loading delay and clears state",
    );
  });

  describe("localStorage persistence", () => {
    it.todo("form values are restored from localStorage when the app mounts");
    it.todo(
      "form values written during a session are available after remounting the component",
    );
  });
});
