import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { init } from "@plausible-analytics/tracker";
import "@mantine/core/styles.css";
import "./animations.css";
import App from "./App.tsx";

if (import.meta.env.PROD) {
  init({
    domain: "forecaster.zaklaughton.dev",
    captureOnLocalhost: false,
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
