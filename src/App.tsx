import { useMemo, useState } from "react";
import { Container, Title, Stack, Grid, Paper } from "@mantine/core";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { toOddsByWeek } from "./utils/stats";
import { ResultsPanel } from "./components/ResultsPanel";

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
    <Container size={960} py="xl">
      <Stack gap="md">
        <Title order={2} ta="center" fw={600}>
          Data-Driven Forecaster
        </Title>
        <Grid gutter="md" align="flex-start">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="md" withBorder radius="md">
              <SimulationForm onRun={runSimulation} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <ResultsPanel
              oddsByWeek={oddsByWeek}
              simulationResults={simulationResults}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default App;
