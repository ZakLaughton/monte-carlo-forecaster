import { useMemo, useState } from "react";
import { Container, Title, Stack, Button, Collapse, Grid } from "@mantine/core";
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
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Data-Driven Sprint Forecaster
        </Title>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <SimulationForm onRun={runSimulation} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            {oddsByWeek.length > 0 ? (
              <Stack gap="md">
                <DeliveryOddsTable data={oddsByWeek} />
                <ForecastResults data={simulationResults} />
                <Button variant="subtle" size="sm" onClick={toggleChart}>
                  {chartOpen ? "Hide" : "Show"} distribution chart
                </Button>
                <Collapse in={chartOpen}>
                  <DeliveryOddsBarChart data={oddsByWeek} />
                </Collapse>
              </Stack>
            ) : null}
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default App;
