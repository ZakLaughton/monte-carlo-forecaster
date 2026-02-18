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
    <Stack gap={4}>
      <Text fw={500} size="sm">
        Past Sprint Velocities
      </Text>

      {velocities.map((velocity, index) => (
        <Group key={index} gap="xs" wrap="nowrap">
          <Text size="sm" w={70} style={{ flexShrink: 0 }}>
            Sprint {index + 1}
          </Text>
          <NumberInput
            value={velocity}
            onChange={(value) => handleVelocityChange(index, value)}
            min={0}
            size="xs"
            w={60}
            hideControls
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

      <Button
        variant="light"
        size="compact-xs"
        onClick={addSprint}
        w="fit-content"
      >
        + Add sprint
      </Button>
    </Stack>
  );
};
