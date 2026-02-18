import { Paper, Text, Group } from "@mantine/core";

type ForecastResultsProps = {
  data: number[];
};

export const ForecastResults = ({ data }: ForecastResultsProps) => {
  const min = data.length > 0 ? Math.min(...data) : null;
  const max = data.length > 0 ? Math.max(...data) : null;
  const median =
    data.length > 0
      ? [...data].sort((a, b) => a - b)[Math.floor(data.length / 2)]
      : null;

  const fmt = (v: number | null, suffix = "") =>
    v != null ? `${v}${suffix}` : "—";

  return (
    <Paper p="xs" radius="md" withBorder style={{ borderStyle: "dashed" }}>
      <Group justify="space-between" gap="xs">
        <Text size="xs" c="dimmed">
          {fmt(data.length > 0 ? data.length : null)} simulations
        </Text>
        <Text size="xs" c="dimmed">
          Fastest: {fmt(min, "wk")}
        </Text>
        <Text size="xs" c="dimmed">
          Slowest: {fmt(max, "wk")}
        </Text>
        <Text size="xs" c="dimmed">
          Median: {fmt(median, "wk")}
        </Text>
      </Group>
    </Paper>
  );
};
