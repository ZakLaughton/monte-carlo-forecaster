import { render, screen } from "../../test-utils";
import { SimulationForm } from "../SimulationForm";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  localStorage.clear();
});

it("renders form and disables run button when empty", () => {
  render(
    <SimulationForm onRun={() => {}} onReset={() => {}} isRunning={false} />,
  );
  expect(screen.getByLabelText(/Remaining Work Items/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Run simulation/i }),
  ).toBeDisabled();
});

describe("SimulationForm", () => {
  it("renders initial form state", () => {
    render(
      <SimulationForm onRun={() => {}} onReset={() => {}} isRunning={false} />,
    );
    expect(screen.getByLabelText(/Remaining Work Items/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Run simulation/i }),
    ).toBeDisabled();
  });

  it("accepts user input for completed work items and remaining work", async () => {
    const user = userEvent.setup();
    render(
      <SimulationForm
        onRun={jest.fn()}
        onReset={jest.fn()}
        isRunning={false}
      />,
    );

    // Enter a value for Week 1
    const weekInput = screen.getByLabelText("Week 1");
    await user.type(weekInput, "4");
    expect(weekInput).toHaveValue("4");

    // Enter a value for Remaining Work Items
    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.type(remainingInput, "15");
    expect(remainingInput).toHaveValue("15");
  });

  it("submits form and triggers simulation", async () => {
    const onRun = jest.fn();
    const user = userEvent.setup();
    render(
      <SimulationForm onRun={onRun} onReset={jest.fn()} isRunning={false} />,
    );

    // Enter valid values
    const weekInput = screen.getByLabelText("Week 1");
    await user.type(weekInput, "5");

    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.type(remainingInput, "10");

    const startDateInput = screen.getByLabelText("Forecast Start Date");
    await user.clear(startDateInput);
    await user.type(startDateInput, "2026-02-21");

    // Submit the form
    const runButton = screen.getByRole("button", { name: /Run simulation/i });
    await user.click(runButton);

    // Assert that onRun was called with expected values
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
        <SimulationForm
          onRun={jest.fn()}
          onReset={jest.fn()}
          isRunning={false}
        />,
      );

      const remainingInput = screen.getByLabelText("Remaining Work Items");
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
        <SimulationForm
          onRun={jest.fn()}
          onReset={jest.fn()}
          isRunning={false}
        />,
      );

      const remainingInput = screen.getByLabelText("Remaining Work Items");
      await user.clear(remainingInput);
      // Input is now empty

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
      const user = userEvent.setup();
      render(
        <SimulationForm
          onRun={jest.fn()}
          onReset={jest.fn()}
          isRunning={false}
        />,
      );

      // Clear Week 1 input
      const weekInput = screen.getByLabelText("Week 1");
      await user.clear(weekInput);

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

  it.todo("shows simulation results after completion");
  it.todo("handles edge cases (e.g., empty input, zero velocity)");
  it.todo(
    "integrates with child components (WeeklyThroughputInput, DeliveryOddsChart, etc.)",
  );
  it.todo("resets form and results when requested");
});
