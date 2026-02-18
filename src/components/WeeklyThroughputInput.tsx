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
    const parsedValue = (() => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") return null;

        const asNumber = Number(trimmed);
        if (Number.isFinite(asNumber)) return asNumber;
      }

      return null;
    })();

    const updated = [...velocities];
    updated[index] = parsedValue;
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
            label={
              <>
                Count completed, independently shippable work items.
                <br />
                Be consistent in what “completed” means.
                <br />
                Major changes in team or work type reduce forecast reliability.
              </>
            }
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
          Add at least 4–6 historical weeks for more reliable results.
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
              placeholder="e.g. 3"
              onChange={(value) => handleVelocityChange(index, value)}
              allowDecimal={false}
              allowNegative={false}
              size="xs"
              w={60}
              hideControls
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
