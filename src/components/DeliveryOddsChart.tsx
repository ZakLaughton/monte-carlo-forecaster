import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const demo = [
  { weeks: 1, p: 0.1 },
  { weeks: 2, p: 0.2 },
  { weeks: 3, p: 0.7 },
];

export function DeliveryOddsChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={demo}>
          <XAxis dataKey="weeks" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="p" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
