import { useState } from "react";
import { NumberInput, Button, Stack } from "@mantine/core";
import { WeeklyThroughputInput } from "./WeeklyThroughputInput";

type Props = {
  onRun: (velocities: number[], size: number) => void;
};

export const SimulationForm = ({ onRun }: Props) => {
  const [weeklyThroughput, setWeeklyThroughput] = useState<number[]>([
    3, 5, 2, 4, 5, 4, 3,
  ]);
  const [projectSize, setProjectSize] = useState(20);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onRun(weeklyThroughput, projectSize);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <WeeklyThroughputInput
          velocities={weeklyThroughput}
          onChange={setWeeklyThroughput}
        />
        <NumberInput
          label="Total remaining work (stories)"
          value={projectSize}
          onChange={(val) => setProjectSize(typeof val === "number" ? val : 0)}
          min={1}
        />
        <Button type="submit">Run simulation</Button>
      </Stack>
    </form>
  );
};
