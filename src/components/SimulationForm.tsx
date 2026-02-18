import {
  NumberInput,
  Button,
  Stack,
  TextInput,
  Text,
  Alert,
} from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";
import { useSimulationFormStorage } from "../hooks/useSimulationFormStorage";

type Props = {
  onRun: (velocities: number[], size: number, startDate: string) => void;
  isRunning?: boolean;
};

export const SimulationForm = ({ onRun, isRunning = false }: Props) => {
  const {
    weeklyThroughput,
    projectSize,
    startDate,
    setWeeklyThroughput,
    setProjectSize,
    setStartDate,
  } = useSimulationFormStorage();

  const validWeeksCount = weeklyThroughput.filter(
    (v) => v != null && v > 0,
  ).length;
  const hasAtLeastOneWeek = validWeeksCount >= 1;
  const projectSizeValid =
    projectSize != null && projectSize > 0 && Number.isInteger(projectSize);
  const startDateValid = startDate.trim().length > 0;
  const canRun = hasAtLeastOneWeek && projectSizeValid && startDateValid;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!canRun) return;
    onRun(weeklyThroughput as number[], projectSize as number, startDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <WeeklyThroughputInput
          velocities={weeklyThroughput}
          onChange={setWeeklyThroughput}
        />
        <NumberInput
          label="Total remaining work items"
          value={projectSize ?? ""}
          placeholder="e.g. 20"
          onChange={(val) =>
            setProjectSize(typeof val === "number" ? val : null)
          }
          min={1}
          allowDecimal={false}
          allowNegative={false}
        />
        <TextInput
          label="Forecast start date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.currentTarget.value)}
          error={!startDateValid}
        />
        <Button
          type="submit"
          disabled={!canRun || isRunning}
          loading={isRunning}
        >
          Run simulation
        </Button>
        {validWeeksCount >= 1 && validWeeksCount <= 2 && (
          <Alert variant="light" color="yellow" title="Low confidence">
            With only 1–2 weeks of history, results can swing a lot. Add 4–6
            weeks for more reliable forecasts.
          </Alert>
        )}
        {validWeeksCount === 3 && (
          <Alert variant="light" color="blue" title="Medium confidence">
            3 weeks is workable, but 4–6 weeks is more reliable.
          </Alert>
        )}
        {!canRun && !isRunning && (
          <Text size="xs" c="dimmed">
            Enter remaining work and at least one completed week.
          </Text>
        )}
      </Stack>
    </form>
  );
};
