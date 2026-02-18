import { Paper, Title, Text } from "@mantine/core";

type ForecastResultsProps = {
  data: number[];
};

export const ForecastResults = ({ data }: ForecastResultsProps) => {
  if (data.length === 0) {
    return (
      <Text c="dimmed" ta="center">
        Submit the form above to run a simulation.
      </Text>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={4} mb="sm">
        Simulation Summary
      </Title>
      <Text>
        <strong>Simulations run:</strong> {data.length.toLocaleString()}
      </Text>
      <Text>
        <strong>Fastest completion:</strong> {min} weeks
      </Text>
      <Text>
        <strong>Slowest completion:</strong> {max} weeks
      </Text>
      <Text>
        <strong>Median:</strong> {median} weeks
      </Text>
    </Paper>
  );
};
