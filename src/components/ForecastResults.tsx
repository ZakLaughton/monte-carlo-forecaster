import { Paper, Title, Text } from "@mantine/core";

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
    <Paper shadow="xs" p="md" withBorder>
      <Title order={4} mb="sm">
        Simulation Summary
      </Title>
      <Text>
        <strong>Simulations run:</strong>{" "}
        {fmt(data.length > 0 ? data.length : null)}
      </Text>
      <Text>
        <strong>Fastest completion:</strong> {fmt(min, " weeks")}
      </Text>
      <Text>
        <strong>Slowest completion:</strong> {fmt(max, " weeks")}
      </Text>
      <Text>
        <strong>Median:</strong> {fmt(median, " weeks")}
      </Text>
    </Paper>
  );
};
