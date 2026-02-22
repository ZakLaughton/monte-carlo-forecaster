import React from "react";
import { render, screen } from "../../test-utils";
import { SimulationForm } from "../SimulationForm";

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

  it.todo("accepts user input for project size and velocity");
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
