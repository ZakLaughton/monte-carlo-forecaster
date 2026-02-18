import { useMemo, useState } from "react";
import { Container, Title, Stack, Button, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { ForecastResults } from "./components/ForecastResults";
import { toOddsByWeek } from "./utils/stats";
import {
  DeliveryOddsTable,
  DeliveryOddsBarChart,
} from "./components/DeliveryOddsChart";

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [chartOpen, { toggle: toggleChart }] = useDisclosure(false);

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
            <ForecastResults data={simulationResults} />
            <Button variant="subtle" size="sm" onClick={toggleChart}>
              {chartOpen ? "Hide" : "Show"} distribution chart
            </Button>
            <Collapse in={chartOpen}>
              <DeliveryOddsBarChart data={oddsByWeek} />
            </Collapse>
          </>
        )}
      </Stack>
    </Container>
  );
}

export default App;
