import {
  NumberInput,
  Button,
  Stack,
  TextInput,
  Text,
  Alert,
  Group,
} from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";
import {
  getTodayIsoDate,
  useSimulationFormStorage,
} from "../hooks/useSimulationFormStorage";

type Props = {
  onRun: (velocities: number[], size: number, startDate: string) => void;
  onReset?: () => void;
  isRunning?: boolean;
};

export const SimulationForm = ({
  onRun,
  onReset,
  isRunning = false,
}: Props) => {
  const {
    weeklyThroughput,
    projectSize,
    startDate,
    setWeeklyThroughput,
    setProjectSize,
    setStartDate,
    resetForm,
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

    const normalizedWeeklyThroughput = weeklyThroughput.filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value),
    );

    onRun(normalizedWeeklyThroughput, projectSize as number, startDate);
  };

  const handleReset = () => {
    if (isRunning) return;

    const hasInput =
      weeklyThroughput.length > 1 ||
      weeklyThroughput.some((value) => value != null && value > 0) ||
      projectSize != null ||
      startDate !== getTodayIsoDate();

    if (hasInput && typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Reset form and clear forecast results?",
      );
      if (!confirmed) return;
    }

    resetForm();
    onReset?.();
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
        <Group gap="xs" grow>
          <Button
            type="submit"
            disabled={!canRun || isRunning}
            loading={isRunning}
          >
            Run simulation
          </Button>
          <Button
            type="button"
            variant="light"
            color="red"
            onClick={handleReset}
            disabled={isRunning}
          >
            Reset
          </Button>
        </Group>
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
