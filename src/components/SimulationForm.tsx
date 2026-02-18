import { useState } from "react";
import { TextInput, NumberInput, Button, Stack } from "@mantine/core";

type Props = {
  onRun: (velocityStr: string, size: number) => void;
};

export const SimulationForm = ({ onRun }: Props) => {
  const [velocityStr, setVelocityStr] = useState("3,5,2,4,5,4,3");
  const [projectSize, setProjectSize] = useState(20);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onRun(velocityStr, projectSize);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack maw={400} mx="auto">
        <TextInput
          label="Past sprint velocity"
          description='Use the number of tickets moved to "done" each week. Format: 1,3,4,3,2.'
          value={velocityStr}
          onChange={(e) => setVelocityStr(e.currentTarget.value)}
        />
        <NumberInput
          label="Project size (number of stories)"
          value={projectSize}
          onChange={(val) => setProjectSize(typeof val === "number" ? val : 0)}
          min={1}
        />
        <Button type="submit">Run simulation</Button>
      </Stack>
    </form>
  );
};
