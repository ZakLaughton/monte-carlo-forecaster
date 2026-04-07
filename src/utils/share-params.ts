export interface ShareParams {
  weeks: number[];
  size: number;
  start: string;
}

export function parseShareParams(search: string): ShareParams | null {
  const params = new URLSearchParams(search);

  const weeksRaw = params.get("weeks");
  const sizeRaw = params.get("size");
  const start = params.get("start");

  if (!weeksRaw || !sizeRaw || !start) return null;

  const weeks = weeksRaw.split(",").map(Number);
  if (weeks.length === 0 || weeks.some(isNaN)) return null;

  const size = Number(sizeRaw);
  if (isNaN(size)) return null;

  return { weeks, size, start };
}
