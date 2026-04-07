import { render, screen, act } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { ResultsPanel } from "../ResultsPanel";

const baseProps = {
  oddsByWeek: [],
  simulationResults: [],
  startDate: "2026-04-07",
  isRunning: false,
  hasResults: false,
};

describe("share button", () => {
  it("is not visible before results exist", () => {
    render(<ResultsPanel {...baseProps} hasResults={false} />);
    expect(
      screen.queryByRole("button", { name: /share results/i }),
    ).not.toBeInTheDocument();
  });

  it("is visible once results exist", () => {
    render(<ResultsPanel {...baseProps} hasResults={true} />);
    expect(
      screen.getByRole("button", { name: /share results/i }),
    ).toBeInTheDocument();
  });

  it("copies the current URL to clipboard when clicked", async () => {
    const user = userEvent.setup();
    const writeText = jest
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    render(<ResultsPanel {...baseProps} hasResults={true} />);

    await user.click(screen.getByRole("button", { name: /share results/i }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it("shows confirmation text after clicking", async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    render(<ResultsPanel {...baseProps} hasResults={true} />);

    await user.click(screen.getByRole("button", { name: /share results/i }));

    expect(screen.getByRole("button", { name: /link copied/i })).toBeInTheDocument();
  });

  it("reverts button text after 2 seconds", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    jest.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    render(<ResultsPanel {...baseProps} hasResults={true} />);

    await user.click(screen.getByRole("button", { name: /share results/i }));
    expect(screen.getByRole("button", { name: /link copied/i })).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(2000); });

    expect(screen.getByRole("button", { name: /share results/i })).toBeInTheDocument();
    jest.useRealTimers();
  });
});
