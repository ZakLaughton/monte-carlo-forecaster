import { Divider, Paper, Stack, Title } from "@mantine/core";
import { getTimelinePositions } from "../utils/outcomes";
import { TimelineTrack } from "./TimelineTrack";
import { OutcomeSummaryCards } from "./OutcomeSummaryCards";
import type { OddsByWeekPoint } from "../utils/stats";

type Props = {
  data: OddsByWeekPoint[];
  startDate?: string;
};

export function KeyOutcomes({ data, startDate = "" }: Props) {
  const isEmpty = data.length === 0;
  const timelinePositions =
    !isEmpty && startDate ? getTimelinePositions(data, startDate) : null;

  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      radius="md"
      style={(theme) => ({
        borderColor: isEmpty ? theme.colors.dark[4] : theme.colors.blue[7],
        opacity: isEmpty ? 0.82 : 1,
      })}
    >
      <Title order={4} ta="center" mb="sm">
        Key Outcomes
      </Title>
      {timelinePositions && (
        <Stack gap={0}>
          <OutcomeSummaryCards p85={timelinePositions.p85} />
          <Divider my="sm" />
          <TimelineTrack positions={timelinePositions} />
        </Stack>
      )}
    </Paper>
  );
}
