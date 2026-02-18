import { Paper, Group, Stack, Text, Title } from "@mantine/core";
import { toCompletionDate } from "../utils/dates";

type Props = {
  data: { weeks: number; p: number }[];
  startDate?: string;
};

function getPercentileWeeks(
  data: { weeks: number; p: number }[],
  target: number,
): number | null {
  const entry = data.find((point) => point.p >= target);
  return entry ? entry.weeks : null;
}

type Outcome = {
  label: string;
  sublabel: string;
  weeks: number | null;
};

function OutcomeMetric({
  label,
  sublabel,
  weeks,
  startDate = "",
  isPlaceholder = false,
}: Outcome & { startDate?: string; isPlaceholder?: boolean }) {
  const weeksText =
    weeks != null ? `${weeks} ${weeks === 1 ? "week" : "weeks"}` : "— weeks";
  const completionDate =
    weeks != null && startDate ? toCompletionDate(startDate, weeks) : null;

  return (
    <Stack gap={2} align="center">
      <Text
        fw={700}
        fz={28}
        lh={1.1}
        c={weeks == null ? "dimmed" : undefined}
        style={
          isPlaceholder
            ? {
                background: "var(--mantine-color-dark-6)",
                borderRadius: 8,
                paddingInline: 10,
                paddingBlock: 1,
              }
            : undefined
        }
      >
        {weeksText}
      </Text>
      <Text fw={600} fz="sm" c={isPlaceholder ? "dimmed" : undefined}>
        {label}
      </Text>
      <Text c="dimmed" fz="xs">
        {sublabel}
      </Text>
      <Text c="dimmed" fz="xs">
        {completionDate ?? ""}
      </Text>
    </Stack>
  );
}

export function KeyOutcomes({ data, startDate = "" }: Props) {
  const isEmpty = data.length === 0;
  const p50 = getPercentileWeeks(data, 0.5);
  const p85 = getPercentileWeeks(data, 0.85);
  const p95 = getPercentileWeeks(data, 0.95);

  const outcomes: Outcome[] = [
    { label: "Coin flip", sublabel: "50% confidence", weeks: p50 },
    { label: "Highly likely", sublabel: "85% confidence", weeks: p85 },
    { label: "Almost certain", sublabel: "95% confidence", weeks: p95 },
  ];

  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      radius="md"
      style={(theme) => ({
        background: isEmpty
          ? `linear-gradient(135deg, ${theme.colors.dark[7]}, ${theme.colors.dark[6]})`
          : `linear-gradient(135deg, ${theme.colors.blue[9]}22, ${theme.colors.violet[9]}22)`,
        borderColor: isEmpty ? theme.colors.dark[4] : theme.colors.blue[7],
        opacity: isEmpty ? 0.82 : 1,
      })}
    >
      <Title order={4} ta="center" mb="sm">
        Key Outcomes
      </Title>
      <Group justify="space-evenly" grow>
        {outcomes.map((o) => (
          <OutcomeMetric
            key={o.label}
            {...o}
            startDate={startDate}
            isPlaceholder={isEmpty}
          />
        ))}
      </Group>
    </Paper>
  );
}
