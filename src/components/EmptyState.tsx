import { Stack, Paper, Text, Box, Group } from "@mantine/core";

const placeholder = (height: number, width?: number | string) => ({
  height,
  width: width ?? "100%",
  borderRadius: 4,
  backgroundColor: "var(--mantine-color-dark-5)",
});

export function EmptyState() {
  return (
    <Stack gap="md">
      <Paper p="lg" withBorder radius="md" ta="center">
        <Text size="lg" fw={600} mb={4}>
          Your forecast will appear here
        </Text>
        <Text size="sm" c="dimmed">
          Enter your past sprint velocities and project size, then hit Run to
          see delivery predictions at different confidence levels.
        </Text>
      </Paper>

      {/* Placeholder: Key Outcomes */}
      <Paper p="md" withBorder radius="md" opacity={0.5}>
        <Box style={placeholder(14, 120)} mx="auto" mb="sm" />
        <Group justify="space-evenly" grow>
          {[1, 2, 3].map((i) => (
            <Stack key={i} gap={4} align="center">
              <Box style={placeholder(28, 80)} />
              <Box style={placeholder(12, 50)} />
              <Box style={placeholder(10, 70)} />
            </Stack>
          ))}
        </Group>
      </Paper>

      {/* Placeholder: Percentile Table */}
      <Paper p="md" withBorder radius="md" opacity={0.5}>
        <Group justify="space-evenly" mb="xs">
          <Box style={placeholder(12, 80)} />
          <Box style={placeholder(12, 60)} />
        </Group>
        {[1, 2, 3, 4, 5].map((i) => (
          <Group key={i} justify="space-evenly" mb={6}>
            <Box style={placeholder(10, 50)} />
            <Box style={placeholder(10, 60)} />
          </Group>
        ))}
      </Paper>

      {/* Placeholder: Chart */}
      <Paper p="md" withBorder radius="md" opacity={0.5}>
        <Box style={placeholder(14, 140)} mb="sm" />
        <Box style={placeholder(150)} />
      </Paper>
    </Stack>
  );
}
