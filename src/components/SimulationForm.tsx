import { useState } from "react";
import { NumberInput, Button, Stack } from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";

type Props = {
  onRun: (velocities: number[], size: number) => void;
  isRunning?: boolean;
};

export const SimulationForm = ({ onRun, isRunning = false }: Props) => {
  const [weeklyThroughput, setWeeklyThroughput] = useState<(number | null)[]>([
    3, 5, 2, 4, 5, 4, 3,
  ]);
  const [projectSize, setProjectSize] = useState<number | null>(20);

  const allWeeksValid =
    weeklyThroughput.length > 0 &&
    weeklyThroughput.every((v) => v != null && v >= 0);
  const projectSizeValid = projectSize != null && projectSize > 0;
  const canRun = allWeeksValid && projectSizeValid;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!canRun) return;
    onRun(weeklyThroughput as number[], projectSize as number);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <WeeklyThroughputInput
          velocities={weeklyThroughput}
          onChange={setWeeklyThroughput}
        />
        <NumberInput
          label="Total remaining work (stories)"
          value={projectSize ?? ""}
          onChange={(val) =>
            setProjectSize(typeof val === "number" ? val : null)
          }
          min={1}
          allowDecimal={false}
          allowNegative={false}
          error={projectSize === null}
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
