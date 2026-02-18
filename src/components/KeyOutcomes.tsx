import { Paper, Group, Stack, Text, Title } from "@mantine/core";

type Props = {
  data: { weeks: number; p: number }[];
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

function OutcomeMetric({ label, sublabel, weeks }: Outcome) {
  const weeksText =
    weeks != null ? `${weeks} ${weeks === 1 ? "week" : "weeks"}` : "—";

  return (
    <Stack gap={2} align="center">
      <Text fw={700} fz={28} lh={1.1} c={weeks == null ? "dimmed" : undefined}>
        {weeksText}
      </Text>
      <Text fw={600} fz="sm">
        {label}
      </Text>
      <Text c="dimmed" fz="xs">
        {sublabel}
      </Text>
    </Stack>
  );
}

export function KeyOutcomes({ data }: Props) {
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
        background: `linear-gradient(135deg, ${theme.colors.blue[9]}22, ${theme.colors.violet[9]}22)`,
        borderColor: theme.colors.blue[7],
      })}
    >
      <Title order={4} ta="center" mb="sm">
        Key Outcomes
      </Title>
      <Group justify="space-evenly" grow>
        {outcomes.map((o) => (
          <OutcomeMetric key={o.label} {...o} />
        ))}
      </Group>
    </Paper>
  );
}
