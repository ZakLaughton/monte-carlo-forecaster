import { Stack } from "@mantine/core";
import { KeyOutcomes } from "./KeyOutcomes";
import { DeliveryOddsTable, DeliveryOddsBarChart } from "./DeliveryOddsChart";
import { ForecastResults } from "./ForecastResults";
import type { OddsByWeekPoint } from "../utils/stats";

type Props = {
  oddsByWeek: OddsByWeekPoint[];
  simulationResults: number[];
};

export function ResultsPanel({ oddsByWeek, simulationResults }: Props) {
  return (
    <Stack gap="md">
      <KeyOutcomes data={oddsByWeek} />
      <DeliveryOddsTable data={oddsByWeek} />
      <ForecastResults data={simulationResults} />
      <DeliveryOddsBarChart data={oddsByWeek} />
    </Stack>
  );
}
