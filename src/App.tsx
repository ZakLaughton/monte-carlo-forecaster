import { useCallback, useMemo, useRef, useState } from "react";
import { Container, Title, Stack, Grid, Paper } from "@mantine/core";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { toOddsByWeek } from "./utils/stats";
import { ResultsPanel } from "./components/ResultsPanel";

const MIN_RUNNING_MS = 350;

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasResults = simulationResults.length > 0;

  const runSimulation = useCallback(
    (velocities: number[], projectSize: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(true);

      const startedAt = Date.now();

      // Compute immediately
      const results = simulateDeliveryWeeks({
        velocityHistory: velocities,
        projectSize,
      });

      // Enforce minimum visible loading time
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_RUNNING_MS - elapsed);

      timerRef.current = setTimeout(() => {
        setSimulationResults(results);
        setIsRunning(false);
      }, remaining);
    },
    [],
  );

  const oddsByWeek = useMemo(
    () => toOddsByWeek(simulationResults),
    [simulationResults],
  );

  return (
    <Container size={960} py="md">
      <Stack gap="md">
        <Title order={4} ta="center" fw={500} c="dimmed">
          Data-Driven Forecaster
        </Title>
        <Grid gutter="md" align="flex-start">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="md" withBorder radius="md">
              <SimulationForm onRun={runSimulation} isRunning={isRunning} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <ResultsPanel
              oddsByWeek={oddsByWeek}
              simulationResults={simulationResults}
              isRunning={isRunning}
              hasResults={hasResults}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default App;
