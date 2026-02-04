import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { weeks: number; p: number }[];
};

export function DeliveryOddsChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 300 }}>
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
