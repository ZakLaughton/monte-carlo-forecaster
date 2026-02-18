import {
  NumberInput,
  Button,
  Stack,
  Group,
  ActionIcon,
  Text,
} from "@mantine/core";

type Props = {
  velocities: number[];
  onChange: (velocities: number[]) => void;
};

export const SprintVelocityInput = ({ velocities, onChange }: Props) => {
  const handleVelocityChange = (index: number, value: number | string) => {
    const updated = [...velocities];
    updated[index] = typeof value === "number" ? value : 0;
    onChange(updated);
  };

  const addSprint = () => {
    onChange([...velocities, 0]);
  };

  const removeSprint = (index: number) => {
    onChange(velocities.filter((_, i) => i !== index));
  };

  return (
    <Stack gap="xs">
      <Text fw={500}>Past Sprint Velocities</Text>
      <Text size="sm" c="dimmed">
        Enter the number of tickets completed in each past sprint.
      </Text>

      {velocities.map((velocity, index) => (
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
            disabled={velocities.length === 1}
            aria-label={`Remove sprint ${index + 1}`}
          >
            ✕
          </ActionIcon>
        </Group>
      ))}

      <Button variant="light" onClick={addSprint}>
        + Add Sprint
      </Button>
    </Stack>
  );
};
