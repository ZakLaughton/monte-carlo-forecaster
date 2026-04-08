import { Paper, Title } from "@mantine/core";
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
        <OutcomeSummaryCards
          p50={timelinePositions.p50}
          p85={timelinePositions.p85}
          p95={timelinePositions.p95}
        />
      )}
      {timelinePositions && <TimelineTrack positions={timelinePositions} />}
    </Paper>
  );
}
