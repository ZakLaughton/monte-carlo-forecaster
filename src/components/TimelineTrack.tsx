import type { TimelinePositions, TimelinePin } from "../utils/outcomes";

// Horizontal inset so edge pin labels don't clip
const INSET = 20;

// Vertical layout constants (px)
const DATE_HEIGHT = 15; // space reserved above the track bar for date text
const TRACK_HEIGHT = 6;
const TICK_HEIGHT = 16;
const LABEL_HEIGHT = 14;
const CONTAINER_HEIGHT = DATE_HEIGHT + TRACK_HEIGHT + TICK_HEIGHT + LABEL_HEIGHT + 4;

function pinLeft(positionPct: number) {
  return `calc(${INSET}px + ${positionPct / 100} * (100% - ${INSET * 2}px))`;
}

type Props = {
  positions: TimelinePositions;
};

export function TimelineTrack({ positions }: Props) {
  return (
    <div>
      {/* Explicitly sized container so absolute pins and track bar share the same coordinate space */}
      <div style={{ position: "relative", height: CONTAINER_HEIGHT }}>
        {/* Track bar */}
        <div
          style={{
            position: "absolute",
            top: DATE_HEIGHT,
            left: INSET,
            right: INSET,
            height: TRACK_HEIGHT,
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
        <Pin pin={positions.p50} label="50%" muted left={pinLeft(positions.p50.positionPct)} />
        <Pin pin={positions.p85} label="★ 85%" accent left={pinLeft(positions.p85.positionPct)} />
        <Pin pin={positions.p95} label="95%" muted left={pinLeft(positions.p95.positionPct)} />
        <Pin pin={positions.slowest} label="slowest" faint left={pinLeft(positions.slowest.positionPct)} />
      </div>

      <p
        style={{
          margin: "6px 0 0",
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
  left: string;
  faint?: boolean;
  muted?: boolean;
  accent?: boolean;
};

function Pin({ pin, label, left, faint, accent }: PinProps) {
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
        left,
        top: 0,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <span style={{ fontSize: 11, color, whiteSpace: "nowrap", lineHeight: `${DATE_HEIGHT}px` }}>
        {pin.date}
      </span>
      <div style={{ width: 1, height: TICK_HEIGHT, background: color }} />
      <span style={{ fontSize: 10, color, whiteSpace: "nowrap", fontWeight: accent ? 700 : 400 }}>
        {label}
      </span>
    </div>
  );
}
