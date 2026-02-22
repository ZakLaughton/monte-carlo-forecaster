import React from "react";
import { render, screen } from "../../test-utils";
import { SimulationForm } from "../SimulationForm";
import userEvent from "@testing-library/user-event";

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
    await user.clear(weekInput);
    await user.type(weekInput, "4");
    expect(weekInput).toHaveValue("4");

    // Enter a value for Remaining Work Items
    const remainingInput = screen.getByLabelText("Remaining Work Items");
    await user.clear(remainingInput);
    await user.type(remainingInput, "15");
    expect(remainingInput).toHaveValue("15");
  });

  it.todo("validates input and shows errors");
  it.todo("submits form and triggers simulation");
  it.todo("displays loading or skeleton while simulating");
  it.todo("shows simulation results after completion");
  it.todo("handles edge cases (e.g., empty input, zero velocity)");
  it.todo(
    "integrates with child components (WeeklyThroughputInput, DeliveryOddsChart, etc.)",
  );
  it.todo("resets form and results when requested");
});
