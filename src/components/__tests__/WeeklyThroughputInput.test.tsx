import { useState } from "react";
import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { WeeklyThroughputInput } from "../WeeklyThroughputInput";

// Controlled wrapper so the component has real state to update
function Wrapper({ initial = [null] }: { initial?: (number | null)[] }) {
  const [velocities, setVelocities] = useState<(number | null)[]>(initial);
  return <WeeklyThroughputInput velocities={velocities} onChange={setVelocities} />;
}

describe("WeeklyThroughputInput", () => {
  describe("rendering", () => {
    it("renders a single empty week input by default", () => {
      render(<Wrapper />);
      expect(screen.getByLabelText("Week 1")).toBeInTheDocument();
      expect(screen.queryByLabelText("Week 2")).not.toBeInTheDocument();
    });

    it("renders an input for each value in the initial list", () => {
      render(<Wrapper initial={[5, 8, 3]} />);
      expect(screen.getByLabelText("Week 1")).toHaveValue("5");
      expect(screen.getByLabelText("Week 2")).toHaveValue("8");
      expect(screen.getByLabelText("Week 3")).toHaveValue("3");
    });
  });

  describe("adding weeks", () => {
    it("adds a new empty week input when Add week is clicked", async () => {
      const user = userEvent.setup();
      render(<Wrapper />);

      await user.click(screen.getByRole("button", { name: /add week/i }));

      expect(screen.getByLabelText("Week 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Week 2")).toHaveValue("");
    });
  });

  describe("removing weeks", () => {
    it("remove button is disabled when there is only one week", () => {
      render(<Wrapper />);
      expect(
        screen.getByRole("button", { name: /remove week 1/i }),
      ).toBeDisabled();
    });

    it("remove buttons are enabled when more than one week exists", () => {
      render(<Wrapper initial={[5, 8]} />);
      expect(
        screen.getByRole("button", { name: /remove week 1/i }),
      ).not.toBeDisabled();
      expect(
        screen.getByRole("button", { name: /remove week 2/i }),
      ).not.toBeDisabled();
    });

    it("clicking remove deletes that week's input", async () => {
      const user = userEvent.setup();
      render(<Wrapper initial={[5, 8]} />);

      await user.click(screen.getByRole("button", { name: /remove week 2/i }));

      expect(screen.queryByLabelText("Week 2")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Week 1")).toBeInTheDocument();
    });

    it("removing a week preserves values of the remaining weeks", async () => {
      const user = userEvent.setup();
      render(<Wrapper initial={[5, 8, 3]} />);

      // Remove the middle week
      await user.click(screen.getByRole("button", { name: /remove week 2/i }));

      // Week 1 keeps its value; what was Week 3 shifts up to Week 2
      expect(screen.getByLabelText("Week 1")).toHaveValue("5");
      expect(screen.getByLabelText("Week 2")).toHaveValue("3");
      expect(screen.queryByLabelText("Week 3")).not.toBeInTheDocument();
    });

    it("removing a week leaves the last remaining remove button disabled", async () => {
      const user = userEvent.setup();
      render(<Wrapper initial={[5, 8]} />);

      await user.click(screen.getByRole("button", { name: /remove week 2/i }));

      expect(
        screen.getByRole("button", { name: /remove week 1/i }),
      ).toBeDisabled();
    });
  });

  describe("clearing a week's value", () => {
    it("treats a cleared input as an empty value", async () => {
      const user = userEvent.setup();
      render(<Wrapper initial={[5]} />);

      await user.clear(screen.getByLabelText("Week 1"));

      expect(screen.getByLabelText("Week 1")).toHaveValue("");
    });
  });
});
