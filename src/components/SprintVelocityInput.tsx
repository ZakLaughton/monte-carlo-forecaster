import {
  NumberInput,
  Button,
  Stack,
  SimpleGrid,
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

      <SimpleGrid cols={3} spacing="xs">
        {velocities.map((velocity, index) => (
          <Group key={index} gap={4} align="flex-end" wrap="nowrap">
            <NumberInput
              label={`Sprint ${index + 1}`}
              value={velocity}
              onChange={(value) => handleVelocityChange(index, value)}
              min={0}
              size="xs"
              style={{ flex: 1 }}
            />
            <ActionIcon
              color="red"
              variant="subtle"
              size="sm"
              onClick={() => removeSprint(index)}
              disabled={velocities.length === 1}
              aria-label={`Remove sprint ${index + 1}`}
            >
              ✕
            </ActionIcon>
          </Group>
        ))}
      </SimpleGrid>

      <Button variant="light" size="xs" onClick={addSprint}>
        + Add Sprint
      </Button>
    </Stack>
  );
};
