import { Stack, Text } from "@mantine/core";

type PinSummary = {
  date: string | null;
  weekLabel: string;
};

type Props = {
  p85: PinSummary;
};

export function OutcomeSummaryCards({ p85 }: Props) {
  const subtext = `85% of simulations done by this date · ${p85.weekLabel} out`;

  return (
    <Stack
      gap={4}
      style={{
        background: "var(--mantine-color-dark-6)",
        borderLeft: "3px solid var(--mantine-color-green-6)",
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Text size="xs" fw={600} c="green.4">
        ★ 85% confidence date
      </Text>
      <Text fw={700} fz={44} lh={1.1}>
        {p85.date ?? "—"}
      </Text>
      <Text size="xs" c="dimmed">
        {subtext}
      </Text>
    </Stack>
  );
}
