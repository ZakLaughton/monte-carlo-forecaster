import { useState } from "react";
import { NumberInput, Button, Stack, TextInput } from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";

type Props = {
  onRun: (velocities: number[], size: number, startDate: string) => void;
  isRunning?: boolean;
};

export const SimulationForm = ({ onRun, isRunning = false }: Props) => {
  const [weeklyThroughput, setWeeklyThroughput] = useState<(number | null)[]>([
    3, 5, 2, 4, 5, 4, 3,
  ]);
  const [projectSize, setProjectSize] = useState<number | null>(20);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );

  const allWeeksValid =
    weeklyThroughput.length > 0 &&
    weeklyThroughput.every((v) => v != null && v >= 0);
  const projectSizeValid = projectSize != null && projectSize > 0;
  const startDateValid = startDate.trim().length > 0;
  const canRun = allWeeksValid && projectSizeValid && startDateValid;

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
          onChange={(val) =>
            setProjectSize(typeof val === "number" ? val : null)
          }
          min={1}
          allowDecimal={false}
          allowNegative={false}
          error={projectSize === null}
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
      </Stack>
    </form>
  );
};
