import { useCallback, useMemo, useRef, useState } from "react";
import { Container, Title, Stack, Grid, Paper } from "@mantine/core";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { toOddsByWeek } from "./utils/stats";
import { ResultsPanel } from "./components/ResultsPanel";
import { getTodayIsoDate } from "./hooks/useSimulationFormStorage";

const MIN_RUNNING_MS = 400;
const REVEAL_TRANSITION_MS = 200;

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);
  const [forecastStartDate, setForecastStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hasResults = simulationResults.length > 0;
  const busy = isRunning || isRevealing;

  const runSimulation = useCallback(
    (velocities: number[], projectSize: number, startDate: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      setIsRunning(true);
      setIsRevealing(false);
      setForecastStartDate(startDate);

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
        setIsRevealing(true);

        // Keep button disabled during CSS transition
        revealTimerRef.current = setTimeout(() => {
          setIsRevealing(false);
        }, REVEAL_TRANSITION_MS);
      }, remaining);
    },
    [],
  );

  const resetForecast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    setSimulationResults([]);
    setForecastStartDate(getTodayIsoDate());
    setIsRunning(false);
    setIsRevealing(false);
  }, []);

  const oddsByWeek = useMemo(
    () => toOddsByWeek(simulationResults),
    [simulationResults],
  );

  return (
    <Container size={960} py="md">
      <Stack gap="md">
        <Title order={4} ta="center" fw={600} c="gray.3">
          Delivery Forecast
        </Title>
        <Grid gutter="md" align="flex-start">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="md" withBorder radius="md">
              <SimulationForm
                onRun={runSimulation}
                onReset={resetForecast}
                isRunning={busy}
              />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <ResultsPanel
              oddsByWeek={oddsByWeek}
              simulationResults={simulationResults}
              startDate={forecastStartDate}
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
