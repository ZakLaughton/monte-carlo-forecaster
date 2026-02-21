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
