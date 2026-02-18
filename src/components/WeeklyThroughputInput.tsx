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

export const WeeklyThroughputInput = ({ velocities, onChange }: Props) => {
  const handleVelocityChange = (index: number, value: number | string) => {
    const updated = [...velocities];
    updated[index] = typeof value === "number" ? value : 0;
    onChange(updated);
  };

  const addWeek = () => {
    onChange([...velocities, 0]);
  };

  const removeWeek = (index: number) => {
    onChange(velocities.filter((_, i) => i !== index));
  };

  return (
    <Stack gap={4}>
      <Text fw={500} size="sm">
        Past Weekly Throughput
      </Text>

      {velocities.map((velocity, index) => (
        <Group key={index} gap="xs" wrap="nowrap">
          <Text size="sm" w={70} style={{ flexShrink: 0 }}>
            Week {index + 1}
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
            onClick={() => removeWeek(index)}
            disabled={velocities.length === 1}
            aria-label={`Remove week ${index + 1}`}
          >
            ✕
          </ActionIcon>
        </Group>
      ))}

      <Button
        variant="light"
        size="compact-xs"
        onClick={addWeek}
        w="fit-content"
      >
        + Add week
      </Button>
    </Stack>
  );
};
