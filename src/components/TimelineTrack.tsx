import type { TimelinePositions, TimelinePin } from "../utils/outcomes";

type Props = {
  positions: TimelinePositions;
};

export function TimelineTrack({ positions }: Props) {
  return (
    <div style={{ position: "relative", paddingBlock: "2rem" }}>
      {/* Track bar */}
      <div
        style={{
          position: "relative",
          height: 6,
          borderRadius: 3,
          background: "var(--mantine-color-dark-4)",
        }}
      >
        {/* Yellow: p50 (left edge) to p85 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${positions.p85.positionPct}%`,
            height: "100%",
            background: "var(--mantine-color-yellow-6)",
          }}
        />
        {/* Green: p85 to p95 */}
        <div
          style={{
            position: "absolute",
            left: `${positions.p85.positionPct}%`,
            width: `${positions.p95.positionPct - positions.p85.positionPct}%`,
            height: "100%",
            background: "var(--mantine-color-green-6)",
          }}
        />
      </div>

      {/* Pins */}
      <Pin pin={positions.p50} label="50%" muted />
      <Pin pin={positions.p85} label="★ 85%" accent />
      <Pin pin={positions.p95} label="95%" muted />
      <Pin pin={positions.slowest} label="slowest" faint />

      {/* Legend */}
      <p
        style={{
          marginTop: "1.5rem",
          fontSize: 11,
          fontStyle: "italic",
          color: "var(--mantine-color-dark-2)",
          textAlign: "center",
        }}
      >
        Each % is both a simulation count and your confidence that the team delivers by that date.
      </p>
    </div>
  );
}

type PinProps = {
  pin: TimelinePin;
  label: string;
  faint?: boolean;
  muted?: boolean;
  accent?: boolean;
};

function Pin({ pin, label, faint, accent }: PinProps) {
  const color = accent
    ? "var(--mantine-color-green-4)"
    : faint
      ? "var(--mantine-color-dark-2)"
      : "var(--mantine-color-gray-5)";

  return (
    <div
      data-pin
      style={{
        position: "absolute",
        left: `${pin.positionPct}%`,
        top: 0,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Date above the line */}
      <span style={{ fontSize: 11, color, whiteSpace: "nowrap" }}>
        {pin.date}
      </span>

      {/* Vertical line */}
      <div style={{ width: 1, height: 16, background: color }} />

      {/* Label below the line */}
      <span
        style={{
          fontSize: 10,
          color,
          whiteSpace: "nowrap",
          fontWeight: accent ? 700 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}
