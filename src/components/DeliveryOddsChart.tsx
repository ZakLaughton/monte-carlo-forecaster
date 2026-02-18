import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { LabelList } from "recharts";
import { AreaChart, Area } from "recharts";
import { Table } from "@mantine/core";

type Props = {
  data: { weeks: number; p: number; count: number }[];
};

function calculatePercentileData(data: { weeks: number; p: number }[]) {
  const targets = [
    0.1, 0.2, 0.3, 0.4, 0.5, 0.6,
    0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0,
  ];
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

export function DeliveryOddsChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 300, padding: "20px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weeks" />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            formatter={(value?: number) =>
              value == null ? "" : `${(value * 100).toFixed(1)}%`
            }
            labelFormatter={(label) => `By week ${label}`}
          />
          <Line type="monotone" dataKey="p" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeliveryOddsTable({ data }: Props) {
  const percentiles = calculatePercentileData(data);

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th ta="center">Percentile</Table.Th>
          <Table.Th ta="center">Weeks</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {percentiles.map((row) => (
          <Table.Tr key={row.percentile}>
            <Table.Td ta="center">{row.percentile}</Table.Td>
            <Table.Td ta="center">{row.weeks}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
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
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
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
    </div>
  );
}

export function DeliveryOddsAreaChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 300, padding: "20px" }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="weeks" />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip
            formatter={(value?: number) =>
              value == null ? "" : `${(value * 100).toFixed(1)}%`
            }
            labelFormatter={(label) => `By week ${label}`}
          />
          <Area type="monotone" dataKey="p" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
