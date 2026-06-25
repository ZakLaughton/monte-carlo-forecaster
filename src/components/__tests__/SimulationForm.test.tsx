import { render, screen } from "../../test-utils";
import { SimulationForm } from "../SimulationForm";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  localStorage.clear();
});

describe("SimulationForm", () => {
  describe("confidence alerts", () => {
    it("shows low confidence alert for 1 valid week", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [5], projectSize: null, startDate: "2026-01-01" }),
      );
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );
      expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
      expect(screen.getByText(/results can swing a lot/i)).toBeInTheDocument();
    });

    it("shows low confidence alert for 2 valid weeks", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [5, 6], projectSize: null, startDate: "2026-01-01" }),
      );
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );
      expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
      expect(screen.getByText(/results can swing a lot/i)).toBeInTheDocument();
    });

    it("shows medium confidence alert for 3 valid weeks", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [5, 6, 7], projectSize: null, startDate: "2026-01-01" }),
      );
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );
      expect(screen.getByText(/medium confidence/i)).toBeInTheDocument();
      expect(screen.getByText(/3 weeks is workable/i)).toBeInTheDocument();
    });
  });

  it("renders form with sample data pre-populated by default", () => {
    render(
      <SimulationForm onRun={() => {}} onReset={() => {}} isRunning={false} />,
    );
    expect(screen.getByLabelText(/Remaining Work Items/i)).toBeInTheDocument();
    // Sample data fills the form so the run button is immediately enabled
    expect(
      screen.getByRole("button", { name: /Run simulation/i }),
    ).not.toBeDisabled();
  });

  it("accepts user input for completed work items and remaining work", async () => {
    // Pre-seed so Week 1 starts blank and remaining has a placeholder value
    localStorage.setItem(
      "delivery-forecaster-form",
      JSON.stringify({ weeklyThroughput: [null], projectSize: 1, startDate: "2026-01-01" }),
    );
    const user = userEvent.setup();
    render(
      <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
    );

    const weekInput = screen.getByLabelText("Week 1");
    await user.type(weekInput, "4");
    expect(weekInput).toHaveValue("4");

    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.clear(remainingInput);
    await user.type(remainingInput, "15");
    expect(remainingInput).toHaveValue("15");
  });

  it("submits form and triggers simulation", async () => {
    // Pre-seed with 1 blank week so submission args are predictable
    localStorage.setItem(
      "delivery-forecaster-form",
      JSON.stringify({ weeklyThroughput: [null], projectSize: 1, startDate: "2026-01-01" }),
    );
    const onRun = jest.fn();
    const user = userEvent.setup();
    render(
      <SimulationForm onRun={onRun} onReset={jest.fn()} isRunning={false} />,
    );

    await user.type(screen.getByLabelText("Week 1"), "5");

    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.clear(remainingInput);
    await user.type(remainingInput, "10");

    const startDateInput = screen.getByLabelText("Forecast Start Date");
    await user.clear(startDateInput);
    await user.type(startDateInput, "2026-02-21");

    await user.click(screen.getByRole("button", { name: /Run simulation/i }));

    expect(onRun).toHaveBeenCalledWith([5], 10, "2026-02-21");
  });

  it("displays loading or skeleton while simulating", async () => {
    render(
      <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={true} />,
    );

    // The run button should show loading state
    const runButton = screen.getByRole("button", { name: /Run simulation/i });
    expect(runButton).toHaveAttribute("data-loading", "true");
    expect(runButton).toBeDisabled();
  });

  describe("SimulationForm invalid input", () => {
    it("disables run button and shows error for zero project size", async () => {
      const user = userEvent.setup();
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      const remainingInput = screen.getByLabelText("Remaining Work Items");
      await user.clear(remainingInput);
      await user.type(remainingInput, "0");

      const runButton = screen.getByRole("button", { name: /Run simulation/i });
      await user.click(runButton);
      expect(runButton).toBeDisabled();
      expect(
        screen.getByText(
          /add at least one historical week and remaining work/i,
        ),
      ).toBeInTheDocument();
    });

    it("disables run button and shows error for empty project size", async () => {
      const user = userEvent.setup();
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      const remainingInput = screen.getByLabelText("Remaining Work Items");
      await user.clear(remainingInput);

      const runButton = screen.getByRole("button", { name: /Run simulation/i });
      await user.click(runButton);
      expect(runButton).toBeDisabled();
      expect(
        screen.getByText(
          /add at least one historical week and remaining work/i,
        ),
      ).toBeInTheDocument();
    });

    it("disables run button and shows error for missing weekly throughput", async () => {
      // Pre-seed with a blank week but valid project size so the only problem is no valid week
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [null], projectSize: 30, startDate: "2026-01-01" }),
      );
      const user = userEvent.setup();
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      const runButton = screen.getByRole("button", { name: /Run simulation/i });
      await user.click(runButton);
      expect(runButton).toBeDisabled();
      expect(
        screen.getByText(
          /add at least one historical week and remaining work/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("URL params and localStorage protection", () => {
    afterEach(() => {
      window.history.pushState({}, "", "/");
    });

    it("does not overwrite existing localStorage when loading from URL params", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({
          weeklyThroughput: [99],
          projectSize: 999,
          startDate: "2020-01-01",
        }),
      );
      window.history.pushState({}, "", "?weeks=5,3&size=20&start=2026-04-01");
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      const stored = JSON.parse(
        localStorage.getItem("delivery-forecaster-form")!,
      );
      expect(stored.weeklyThroughput).toEqual([99]);
      expect(stored.projectSize).toBe(999);
    });

    it("writes to localStorage after user edits the form when loaded from URL params", async () => {
      const user = userEvent.setup();
      window.history.pushState({}, "", "?weeks=5,3&size=20&start=2026-04-01");
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      await user.type(screen.getByLabelText("Week 1"), "9");

      const stored = JSON.parse(
        localStorage.getItem("delivery-forecaster-form")!,
      );
      expect(stored).not.toBeNull();
      expect(stored.weeklyThroughput[0]).toBe(59); // 5 was pre-populated, 9 appended
    });
  });

  it("does not reset when the user cancels the confirm dialog", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => false);
    const onReset = jest.fn();
    const user = userEvent.setup();
    render(
      <SimulationForm onRun={jest.fn()} onReset={onReset} isRunning={false} />,
    );

    const week1 = screen.getByLabelText("Week 1");
    await user.clear(week1);
    await user.type(week1, "5");
    const remaining = screen.getByLabelText("Remaining Work Items");
    await user.clear(remaining);
    await user.type(remaining, "10");

    await user.click(screen.getByRole("button", { name: /reset/i }));

    // confirm returned false — form and callback should be untouched
    expect(onReset).not.toHaveBeenCalled();
    expect(week1).toHaveValue("5");
    expect(remaining).toHaveValue("10");
  });

  describe("URL param pre-population", () => {
    afterEach(() => {
      window.history.pushState({}, "", "/");
    });

    it("populates all form fields from URL params", () => {
      window.history.pushState(
        {},
        "",
        "?weeks=5,3,8&size=42&start=2026-03-15",
      );
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).toHaveValue("5");
      expect(screen.getByLabelText("Week 2")).toHaveValue("3");
      expect(screen.getByLabelText("Week 3")).toHaveValue("8");
      expect(screen.getByLabelText("Remaining Work Items")).toHaveValue("42");
      expect(screen.getByLabelText("Forecast Start Date")).toHaveValue(
        "2026-03-15",
      );
    });

    it("URL params take precedence over localStorage", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({
          weeklyThroughput: [99],
          projectSize: 999,
          startDate: "2020-01-01",
        }),
      );
      window.history.pushState({}, "", "?weeks=5,3&size=20&start=2026-04-01");
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).toHaveValue("5");
      expect(screen.getByLabelText("Week 2")).toHaveValue("3");
      expect(screen.getByLabelText("Remaining Work Items")).toHaveValue("20");
      expect(screen.getByLabelText("Forecast Start Date")).toHaveValue(
        "2026-04-01",
      );
    });

    it("falls back to localStorage when no URL params present", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({
          weeklyThroughput: [7],
          projectSize: 30,
          startDate: "2026-04-01",
        }),
      );
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).toHaveValue("7");
      expect(screen.getByLabelText("Remaining Work Items")).toHaveValue("30");
    });
  });

  describe("default sample data population", () => {
    it("populates form with sample data when no localStorage exists", () => {
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).not.toHaveValue("");
      expect(screen.getByLabelText("Remaining Work Items")).not.toHaveValue("");
    });

    it("populates form with sample data when localStorage has all-null values", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [null], projectSize: null, startDate: "2026-01-01" }),
      );

      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).not.toHaveValue("");
      expect(screen.getByLabelText("Remaining Work Items")).not.toHaveValue("");
    });

    it("uses localStorage data when it has valid weeks even without project size", () => {
      localStorage.setItem(
        "delivery-forecaster-form",
        JSON.stringify({ weeklyThroughput: [12, 8], projectSize: null, startDate: "2026-01-01" }),
      );

      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      expect(screen.getByLabelText("Week 1")).toHaveValue("12");
      expect(screen.getByLabelText("Remaining Work Items")).toHaveValue("");
    });

    it("clears to blank (not sample data) after reset", async () => {
      jest.spyOn(window, "confirm").mockReturnValue(true);
      const user = userEvent.setup();
      render(
        <SimulationForm onRun={jest.fn()} onReset={jest.fn()} isRunning={false} />,
      );

      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(screen.getByLabelText("Week 1")).toHaveValue("");
      expect(screen.getByLabelText("Remaining Work Items")).toHaveValue("");
    });
  });

  it("resets form and results when requested", async () => {
    jest.spyOn(window, "confirm").mockImplementation(() => true);
    const onRun = jest.fn();
    const onReset = jest.fn();
    const user = userEvent.setup();
    render(
      <SimulationForm onRun={onRun} onReset={onReset} isRunning={false} />,
    );

    // Sample data is pre-populated; typing appends to existing values but
    // all that matters is we can run and then reset to blank
    const weekInput = screen.getByLabelText("Week 1");
    await user.type(weekInput, "5");
    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.type(remainingInput, "10");
    const startDateInput = screen.getByLabelText("Forecast Start Date");
    await user.clear(startDateInput);
    await user.type(startDateInput, "2026-02-21");

    const runButton = screen.getByRole("button", { name: /Run simulation/i });
    await user.click(runButton);
    expect(onRun).toHaveBeenCalled();

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    await user.click(resetButton);
    expect(onReset).toHaveBeenCalled();

    expect(weekInput).toHaveValue("");
    expect(remainingInput).toHaveValue("");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    expect(startDateInput).toHaveValue(`${yyyy}-${mm}-${dd}`);
  });
});
