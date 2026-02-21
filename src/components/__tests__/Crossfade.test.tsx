import { render } from "@testing-library/react";
import { Crossfade } from "../Crossfade";

describe("Crossfade", () => {
  it("renders skeleton and content layers", () => {
    const { getByText } = render(
      <Crossfade revealed={false} skeleton={<span>Loading...</span>}>
        <span>Actual Content</span>
      </Crossfade>,
    );
    expect(getByText("Loading...")).toBeInTheDocument();
    expect(getByText("Actual Content")).toBeInTheDocument();
  });

  it("applies crossfade--revealed class when revealed is true", () => {
    const { container } = render(
      <Crossfade revealed={true} skeleton={<span>Skeleton</span>}>
        <span>Content</span>
      </Crossfade>,
    );
    expect(container.firstChild).toHaveClass("crossfade--revealed");
  });

  it("does not apply crossfade--revealed class when revealed is false", () => {
    const { container } = render(
      <Crossfade revealed={false} skeleton={<span>Skeleton</span>}>
        <span>Content</span>
      </Crossfade>,
    );
    expect(container.firstChild).not.toHaveClass("crossfade--revealed");
  });
});
