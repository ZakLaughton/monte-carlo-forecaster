import { Stack, Paper, Text } from "@mantine/core";
import { KeyOutcomes } from "./KeyOutcomes";
import { DeliveryOddsTable, DeliveryOddsBarChart } from "./DeliveryOddsChart";
import { ForecastResults } from "./ForecastResults";
import type { OddsByWeekPoint } from "../utils/stats";

type Props = {
  oddsByWeek: OddsByWeekPoint[];
  simulationResults: number[];
};

export function ResultsPanel({ oddsByWeek, simulationResults }: Props) {
  const hasResults = oddsByWeek.length > 0;

  return (
    <Stack gap="md">
      {!hasResults && (
        <Paper p="lg" withBorder radius="md" ta="center">
          <Text size="lg" fw={600} mb={4}>
            Your forecast will appear here
          </Text>
          <Text size="sm" c="dimmed">
            Enter your past sprint velocities and project size, then hit Run to
            see delivery predictions at different confidence levels.
          </Text>
        </Paper>
      )}
      <KeyOutcomes data={oddsByWeek} />
      <DeliveryOddsTable data={oddsByWeek} />
      <ForecastResults data={simulationResults} />
      <DeliveryOddsBarChart data={oddsByWeek} />
    </Stack>
  );
}
