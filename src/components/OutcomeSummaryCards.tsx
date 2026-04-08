import { Group, Stack, Text } from "@mantine/core";

type PinSummary = {
  date: string | null;
  weekLabel: string;
};

type Props = {
  p50: PinSummary;
  p85: PinSummary;
  p95: PinSummary;
};

export function OutcomeSummaryCards({ p50, p85, p95 }: Props) {
  return (
    <Group gap="sm" align="stretch" wrap="nowrap">
      <CommitCard p85={p85} p95={p95} />
      <ReferenceCard p50={p50} />
    </Group>
  );
}

function CommitCard({ p85, p95 }: { p85: PinSummary; p95: PinSummary }) {
  const subtext =
    p85.weekLabel === p95.weekLabel
      ? `85–95% of simulations · ${p85.weekLabel}`
      : `85% of simulations · ${p85.weekLabel}`;

  return (
    <Stack
      gap={4}
      style={{
        flex: 2,
        background: "var(--mantine-color-dark-6)",
        borderLeft: "3px solid var(--mantine-color-green-6)",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Text size="xs" fw={600} c="green.4">
        ★ commit to this
      </Text>
      <Text fw={700} fz={28} lh={1.1}>
        {p85.date ?? "—"}
      </Text>
      <Text size="xs" c="dimmed">
        {subtext}
      </Text>
    </Stack>
  );
}

function ReferenceCard({ p50 }: { p50: PinSummary }) {
  return (
    <Stack
      data-testid="card-p50"
      gap={4}
      style={{
        flex: 1,
        opacity: 0.55,
        paddingLeft: 12,
      }}
    >
      <Text size="xs" fw={600} c="dimmed">
        50% of simulations
      </Text>
      <Text fw={700} fz={22} lh={1.1}>
        {p50.date ?? "—"}
      </Text>
      <Text size="xs" c="dimmed">
        {p50.weekLabel}
      </Text>
    </Stack>
  );
}
