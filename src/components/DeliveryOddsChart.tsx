import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { LabelList } from "recharts";
import { Table, Paper, Title, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  data: { weeks: number; p: number; count: number }[];
};

const DEFAULT_TARGETS = [0.5, 0.7, 0.85, 0.9, 0.95];
const FULL_TARGETS = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0,
];

function calculatePercentileData(
  data: { weeks: number; p: number }[],
  targets: number[],
) {
  const percentiles = [];
  for (const i of targets) {
    const entry = data.find((point) => point.p >= i);
    if (entry) {
      percentiles.push({
        percentile: `${Math.round(i * 100)}%`,
        weeks: entry.weeks,
      });
    }
  }
  return percentiles;
}

export function DeliveryOddsTable({ data }: Props) {
  const [showFull, { toggle }] = useDisclosure(false);
  const percentiles = calculatePercentileData(
    data,
    showFull ? FULL_TARGETS : DEFAULT_TARGETS,
  );

  return (
    <>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center">Confidence</Table.Th>
            <Table.Th ta="center">Finish by</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {percentiles.map((row) => (
            <Table.Tr key={row.percentile}>
              <Table.Td ta="center">{row.percentile}</Table.Td>
              <Table.Td ta="center">
                {row.weeks} {row.weeks === 1 ? "week" : "weeks"}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Anchor component="button" size="sm" mt={4} onClick={toggle}>
        {showFull ? "Show less" : "Show full distribution"}
      </Anchor>
    </>
  );
}

export function DeliveryOddsBarChart({ data }: Props) {
  // Transform data to calculate exact counts for each week
  const exactCounts = data.map((point, index) => {
    const previousCount = index > 0 ? data[index - 1].count : 0;
    return {
      weeks: point.weeks,
      count: point.count - previousCount, // Subtract cumulative count of the previous week
    };
  });

  return (
    <Paper shadow="xs" p="md" withBorder>
      <Title order={4} mb="sm">
        Simulations Completed Per Week
      </Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={exactCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weeks" />
          <YAxis tickFormatter={(v) => `${v}`} />
          <Tooltip
            formatter={(value?: number) =>
              value == null ? "" : `${value} items`
            }
            labelFormatter={(label) => `Week ${label}`}
          />
          <Bar dataKey="count" fill="#8884d8">
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
