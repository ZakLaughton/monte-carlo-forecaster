import { Stack, Button, Group } from "@mantine/core";
import { useState } from "react";
import { StatusCard } from "./StatusCard";
import { Crossfade } from "./Crossfade";
import { KeyOutcomes } from "./KeyOutcomes";
import { DeliveryOddsTable, DeliveryOddsBarChart } from "./DeliveryOddsChart";
import { ForecastResults } from "./ForecastResults";
import type { OddsByWeekPoint } from "../utils/stats";

type Props = {
  oddsByWeek: OddsByWeekPoint[];
  simulationResults: number[];
  startDate: string;
  isRunning: boolean;
  hasResults: boolean;
};

export function ResultsPanel({
  oddsByWeek,
  simulationResults,
  startDate,
  isRunning,
  hasResults,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusState = isRunning ? "running" : hasResults ? "done" : "idle";
  const revealed = hasResults && !isRunning;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <StatusCard state={statusState} />
        {hasResults && (
          <Button
            variant="light"
            size="xs"
            className="share-button-pulse"
            onClick={handleShare}
          >
            {copied ? "Link copied!" : "Share results"}
          </Button>
        )}
      </Group>

      <Crossfade
        revealed={revealed}
        skeleton={<KeyOutcomes data={[]} startDate={startDate} />}
      >
        <KeyOutcomes data={oddsByWeek} startDate={startDate} />
      </Crossfade>

      <Crossfade
        revealed={revealed}
        skeleton={<DeliveryOddsTable data={[]} startDate={startDate} />}
      >
        <DeliveryOddsTable data={oddsByWeek} startDate={startDate} />
      </Crossfade>

      <Crossfade revealed={revealed} skeleton={<ForecastResults data={[]} />}>
        <ForecastResults data={simulationResults} />
      </Crossfade>

      <Crossfade
        revealed={revealed}
        skeleton={<DeliveryOddsBarChart data={[]} />}
      >
        <DeliveryOddsBarChart data={oddsByWeek} />
      </Crossfade>
    </Stack>
  );
}
