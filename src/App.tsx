import { useMemo, useState } from "react";
import { Container, Title, Stack } from "@mantine/core";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { ForecastResults } from "./components/ForecastResults";
import { toOddsByWeek } from "./utils/stats";
import {
  DeliveryOddsTable,
  DeliveryOddsBarChart,
  DeliveryOddsAreaChart,
} from "./components/DeliveryOddsChart";

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);

  const runSimulation = (velocities: number[], projectSize: number) => {
    const simulatedLengths = simulateDeliveryWeeks({
      velocityHistory: velocities,
      projectSize,
    });

    setSimulationResults(simulatedLengths);
  };

  const oddsByWeek = useMemo(
    () => toOddsByWeek(simulationResults),
    [simulationResults],
  );

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Data-Driven Sprint Forecaster
        </Title>
        <SimulationForm onRun={runSimulation} />
        {oddsByWeek.length > 0 && (
          <>
            <DeliveryOddsTable data={oddsByWeek} />
            <DeliveryOddsBarChart data={oddsByWeek} />
            <DeliveryOddsAreaChart data={oddsByWeek} />
          </>
        )}
        <ForecastResults data={simulationResults} />
      </Stack>
    </Container>
  );
}

export default App;
