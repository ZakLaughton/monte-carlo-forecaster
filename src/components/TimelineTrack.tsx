import type { TimelinePositions, TimelinePin } from "../utils/outcomes";

// Horizontal inset so edge pin labels don't clip
const INSET = 36;

// Vertical layout — all values in px, derived from a shared track center point
const DATE_HEIGHT = 20;    // space above track for date text
const TRACK_HEIGHT = 6;
const TICK_HEIGHT = 16;
const LABEL_HEIGHT = 14;
const SUBLABEL_HEIGHT = 13;

const TRACK_CENTER = DATE_HEIGHT + TRACK_HEIGHT / 2;       // 23
const TICK_TOP = TRACK_CENTER - TICK_HEIGHT / 2;            // 15 — tick extends equally above/below track
const TICK_BOTTOM = TRACK_CENTER + TICK_HEIGHT / 2;         // 31
const LABELS_TOP = TICK_BOTTOM + 3;                         // 34
const CONTAINER_HEIGHT = LABELS_TOP + LABEL_HEIGHT + SUBLABEL_HEIGHT + 2; // 63

function pinLeft(positionPct: number) {
  return `calc(${INSET}px + ${positionPct / 100} * (100% - ${INSET * 2}px))`;
}

type Props = {
  positions: TimelinePositions;
};

export function TimelineTrack({ positions }: Props) {
  return (
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
            background: "var(--mantine-color-green-3)",
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
      <Pin pin={positions.p50} label="50% done" subLabel="by this date" muted left={pinLeft(positions.p50.positionPct)} />
      <Pin pin={positions.p85} label="85% done" subLabel="by this date" accent starOnDate left={pinLeft(positions.p85.positionPct)} />
      <Pin pin={positions.p95} label="95% done" subLabel="by this date" muted left={pinLeft(positions.p95.positionPct)} />
    </div>
  );
}

type PinProps = {
  pin: TimelinePin;
  label: string;
  subLabel?: string;
  left: string;
  faint?: boolean;
  muted?: boolean;
  accent?: boolean;
  starOnDate?: boolean;
};

function Pin({ pin, label, subLabel, left, faint, accent, starOnDate }: PinProps) {
  const color = accent
    ? "var(--mantine-color-green-4)"
    : faint
      ? "var(--mantine-color-dark-2)"
      : "var(--mantine-color-gray-5)";

  const center: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    whiteSpace: "nowrap",
  };

  return (
    <div
      data-pin
      style={{ position: "absolute", left, top: 0, transform: "translateX(-50%)" }}
    >
      {/* Date — bottom-aligned above the tick */}
      <div style={{ ...center, top: 0, height: TICK_TOP, alignItems: "flex-end" }}>
        <span style={{ fontSize: 11, color }}>
          {pin.date}{starOnDate ? " ★" : ""}
        </span>
      </div>

      {/* Tick — centered on track bar */}
      <div
        style={{
          position: "absolute",
          top: TICK_TOP,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: TICK_HEIGHT,
          background: color,
        }}
      />

      {/* Labels — top-aligned below the tick */}
      <div style={{ ...center, top: LABELS_TOP, flexDirection: "column", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 10, color, fontWeight: accent ? 700 : 400 }}>
          {label}
        </span>
        {subLabel && (
          <span style={{ fontSize: 10, color }}>{subLabel}</span>
        )}
      </div>
    </div>
  );
}
