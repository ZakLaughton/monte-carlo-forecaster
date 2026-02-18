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

      <Group gap={6} align="flex-end">
        {velocities.map((velocity, index) => (
          <Stack key={index} gap={0} align="center">
            <NumberInput
              label={`S${index + 1}`}
              value={velocity}
              onChange={(value) => handleVelocityChange(index, value)}
              min={0}
              size="xs"
              w={52}
              hideControls
              styles={{ label: { fontSize: 10 } }}
            />
            <ActionIcon
              color="red"
              variant="transparent"
              size="xs"
              onClick={() => removeSprint(index)}
              disabled={velocities.length === 1}
              aria-label={`Remove sprint ${index + 1}`}
            >
              ✕
            </ActionIcon>
          </Stack>
        ))}
        <Button variant="light" size="xs" onClick={addSprint}>
          +
        </Button>
      </Group>
    </Stack>
  );
};
