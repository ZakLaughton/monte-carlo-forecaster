import { useRef } from "react";
import {
  NumberInput,
  Button,
  Stack,
  Group,
  ActionIcon,
  Text,
  Tooltip,
} from "@mantine/core";

type Props = {
  velocities: (number | null)[];
  onChange: (velocities: (number | null)[]) => void;
};

export const WeeklyThroughputInput = ({ velocities, onChange }: Props) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVelocityChange = (index: number, value: number | string) => {
    const updated = [...velocities];
    updated[index] = typeof value === "number" ? value : null;
    onChange(updated);
  };

  const addWeek = () => {
    onChange([...velocities, null]);
    // Focus the new input after render
    requestAnimationFrame(() => {
      const newIndex = velocities.length;
      inputRefs.current[newIndex]?.focus();
    });
  };

  const removeWeek = (index: number) => {
    onChange(velocities.filter((_, i) => i !== index));
  };

  return (
    <Stack gap={6}>
      <div>
        <Group gap={6} align="center" wrap="nowrap">
          <Text fw={500} size="sm">
            Completed Work Items
          </Text>
          <Tooltip
            label="Use weeks that reflect similar team composition and work type. If the nature of work changes significantly, your forecast may not hold."
            multiline
            w={320}
            withArrow
          >
            <ActionIcon
              size="xs"
              variant="subtle"
              color="gray"
              aria-label="Throughput guidance"
            >
              i
            </ActionIcon>
          </Tooltip>
        </Group>
        <Text size="xs" c="dimmed">
          Enter the number of work items completed each week.
        </Text>
      </div>

      <Stack gap={4}>
        {velocities.map((velocity, index) => (
          <Group key={index} gap="xs" wrap="nowrap" align="center">
            <Text size="sm" w={70} style={{ flexShrink: 0 }}>
              Week {index + 1}
            </Text>
            <NumberInput
              ref={(el) => {
                inputRefs.current[index] = el as unknown as HTMLInputElement;
              }}
              value={velocity ?? ""}
              onChange={(value) => handleVelocityChange(index, value)}
              min={0}
              allowDecimal={false}
              allowNegative={false}
              size="xs"
              w={60}
              hideControls
              error={velocity === null}
            />
            <ActionIcon
              color="gray"
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
      </Stack>

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
