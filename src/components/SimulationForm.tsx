import { useState } from "react";
import {
  NumberInput,
  Button,
  Stack,
  Group,
  ActionIcon,
  Text,
} from "@mantine/core";

type Props = {
  onRun: (velocities: number[], size: number) => void;
};

export const SimulationForm = ({ onRun }: Props) => {
  const [sprintVelocities, setSprintVelocities] = useState<number[]>([
    3, 5, 2, 4, 5, 4, 3,
  ]);
  const [projectSize, setProjectSize] = useState(20);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onRun(sprintVelocities, projectSize);
  };

  const handleVelocityChange = (index: number, value: number | string) => {
    const updated = [...sprintVelocities];
    updated[index] = typeof value === "number" ? value : 0;
    setSprintVelocities(updated);
  };

  const addSprint = () => {
    setSprintVelocities([...sprintVelocities, 0]);
  };

  const removeSprint = (index: number) => {
    setSprintVelocities(sprintVelocities.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack maw={400} mx="auto">
        <Text fw={500}>Past Sprint Velocities</Text>
        <Text size="sm" c="dimmed">
          Enter the number of tickets completed in each past sprint.
        </Text>

        {sprintVelocities.map((velocity, index) => (
          <Group key={index} gap="xs" align="flex-end">
            <NumberInput
              label={`Sprint ${index + 1}`}
              value={velocity}
              onChange={(value) => handleVelocityChange(index, value)}
              min={0}
              w={100}
            />
            <ActionIcon
              color="red"
              variant="subtle"
              size="lg"
              onClick={() => removeSprint(index)}
              disabled={sprintVelocities.length === 1}
              aria-label={`Remove sprint ${index + 1}`}
            >
              ✕
            </ActionIcon>
          </Group>
        ))}

        <Button variant="light" onClick={addSprint}>
          + Add Sprint
        </Button>

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
