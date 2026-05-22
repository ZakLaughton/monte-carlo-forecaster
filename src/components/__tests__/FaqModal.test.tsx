import { render, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { FaqModal } from "../FaqModal";

describe("FaqModal", () => {
  it("is not visible when closed", () => {
    render(<FaqModal opened={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is visible when opened", () => {
    render(<FaqModal opened={true} onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<FaqModal opened={true} onClose={onClose} />);

    await user.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders FAQ content inside the modal", () => {
    render(<FaqModal opened={true} onClose={() => {}} />);
    expect(
      screen.getByText(/frequently asked questions/i),
    ).toBeInTheDocument();
  });
});
