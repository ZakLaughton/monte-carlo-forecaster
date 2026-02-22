import { toCompletionDate } from "../dates";

// Pin "today" so year comparisons in formatCompletionDate are deterministic
// regardless of when the tests actually run.
beforeEach(() => {
  // new Date(year, month, day) creates local midnight — avoids the UTC timezone
  // issue where "2026-01-01" (UTC) resolves to Dec 31, 2025 in US timezones
  jest.useFakeTimers({ now: new Date(2026, 0, 1) });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("toCompletionDate", () => {
  it("omits the year when the completion date falls in the current year", () => {
    // 2026-02-18 + 2 weeks = Mar 4, 2026 — same year as pinned "today"
    expect(toCompletionDate("2026-02-18", 2)).toBe("Mar 4");
  });

  it("includes the year when the completion date falls in a future year", () => {
    // 2026-11-01 + 12 weeks = Jan 24, 2027
    expect(toCompletionDate("2026-11-01", 12)).toBe("Jan 24, 2027");
  });

  it("returns null for empty startDate", () => {
    expect(toCompletionDate("", 2)).toBeNull();
  });

  it("returns null for invalid startDate", () => {
    expect(toCompletionDate("not-a-date", 2)).toBeNull();
  });

  it("handles zero weeks (same day) correctly", () => {
    expect(toCompletionDate("2026-02-18", 0)).toBe("Feb 18");
  });
});
