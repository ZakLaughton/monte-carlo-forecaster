import React from "react";
import { MantineProvider } from "@mantine/core";
import { render as rtlRender } from "@testing-library/react";

function render(ui: React.ReactElement, options?: Record<string, unknown>) {
  return rtlRender(<MantineProvider>{ui}</MantineProvider>, options);
}

export * from "@testing-library/react";
export { render };
