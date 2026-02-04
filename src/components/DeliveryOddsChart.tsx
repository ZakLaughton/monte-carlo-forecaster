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

function calculatePercentileData(data: { weeks: number; p: number }[]) {
  const percentiles = [];
  for (let i = 0.1; i <= 1; i += 0.1) {
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

export function DeliveryOddsTable({ data }: Props) {
  const percentiles = calculatePercentileData(data);

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>
            Percentile
          </th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Weeks</th>
        </tr>
      </thead>
      <tbody>
        {percentiles.map((row) => (
          <tr key={row.percentile}>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {row.percentile}
            </td>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              {row.weeks}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
