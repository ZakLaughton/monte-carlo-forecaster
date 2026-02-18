import { Paper, Text, Loader, Group } from "@mantine/core";

type StatusCardState = "idle" | "running" | "done";

type Props = {
  state: StatusCardState;
  simulationCount?: number;
};

export function StatusCard({ state, simulationCount = 10_000 }: Props) {
  return (
    <Paper p="lg" withBorder radius="md" ta="center" style={{ minHeight: 88 }}>
      <div className="status-card">
        <div
          className={`status-card__layer${
            state === "idle" ? " status-card__layer--visible" : ""
          }`}
        >
          <Text size="lg" fw={600} mb={4}>
            Your forecast will appear here
          </Text>
          <Text size="sm" c="dimmed">
            Enter your past weekly throughput and total remaining work, then hit
            Run to see delivery predictions at different confidence levels.
          </Text>
        </div>
        <div
          className={`status-card__layer${
            state === "running" ? " status-card__layer--visible" : ""
          }`}
        >
          <Group justify="center" gap="xs" py={4}>
            <Loader size={16} />
            <Text size="sm" fw={500} c="dimmed">
              Running {simulationCount.toLocaleString()} simulations\u2026
            </Text>
          </Group>
        </div>
        <div
          className={`status-card__layer${
            state === "done" ? " status-card__layer--visible" : ""
          }`}
        >
          <Text size="sm" fw={500} c="teal">
            Forecast updated
          </Text>
          <Text size="xs" c="dimmed">
            Based on {simulationCount.toLocaleString()} simulations
          </Text>
        </div>
      </div>
    </Paper>
  );
}
