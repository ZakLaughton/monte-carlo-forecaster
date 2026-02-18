import { useState } from "react";
import { NumberInput, Button, Stack, TextInput, Text } from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";

type Props = {
  onRun: (velocities: number[], size: number, startDate: string) => void;
  isRunning?: boolean;
};

export const SimulationForm = ({ onRun, isRunning = false }: Props) => {
  const [weeklyThroughput, setWeeklyThroughput] = useState<(number | null)[]>([
    null,
  ]);
  const [projectSize, setProjectSize] = useState<number | null>(null);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const validWeeksCount = weeklyThroughput.filter(
    (v) => v != null && v > 0,
  ).length;
  const hasMinimumWeeks = validWeeksCount >= 4;
  const projectSizeValid =
    projectSize != null && projectSize > 0 && Number.isInteger(projectSize);
  const startDateValid = startDate.trim().length > 0;
  const canRun = hasMinimumWeeks && projectSizeValid && startDateValid;

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
        {!canRun && !isRunning && (
          <Text size="xs" c="dimmed">
            Enter remaining work and at least 4 historical weeks.
          </Text>
        )}
      </Stack>
    </form>
  );
};
