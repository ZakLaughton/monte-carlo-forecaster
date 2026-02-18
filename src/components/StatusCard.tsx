import { Text, Loader, Group } from "@mantine/core";

type StatusCardState = "idle" | "running" | "done";

type Props = {
  state: StatusCardState;
  simulationCount?: number;
};

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--mantine-color-teal-7)", flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function StatusCard({ state, simulationCount = 10_000 }: Props) {
  return (
    <div className="status-row" aria-live="polite">
      <div
        className={`status-row__layer${
          state === "idle" ? " status-row__layer--visible" : ""
        }`}
      >
        <Text size="xs" fw={400} c="gray.6">
          Enter throughput and remaining work, then run simulation.
        </Text>
      </div>

      <div
        className={`status-row__layer${
          state === "running" ? " status-row__layer--visible" : ""
        }`}
      >
        <Group justify="flex-start" gap={6} wrap="nowrap">
          <Loader size={12} />
          <Text size="xs" fw={400} c="dimmed">
            Running {simulationCount.toLocaleString()} simulations…
          </Text>
        </Group>
      </div>

      <div
        className={`status-row__layer${
          state === "done" ? " status-row__layer--visible" : ""
        }`}
      >
        <Group justify="flex-start" gap={6} wrap="nowrap">
          <CheckIcon />
          <Text size="xs" fw={400} c="dimmed">
            Forecast updated ({simulationCount.toLocaleString()} simulations)
          </Text>
        </Group>
      </div>
    </div>
  );
}
