import { useMemo, useState } from "react";
import { Container, Title, Stack, Grid } from "@mantine/core";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { toOddsByWeek } from "./utils/stats";
import { ResultsPanel } from "./components/ResultsPanel";
import { EmptyState } from "./components/EmptyState";

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
              <ResultsPanel
                oddsByWeek={oddsByWeek}
                simulationResults={simulationResults}
              />
            ) : (
              <EmptyState />
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default App;
