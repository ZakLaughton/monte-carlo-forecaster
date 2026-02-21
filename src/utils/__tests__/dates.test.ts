import { toCompletionDate } from "../dates";

describe("toCompletionDate", () => {
  it("returns correct formatted date for weeks added", () => {
    // Feb 18, 2026 + 2 weeks = Mar 4, 2026
    expect(toCompletionDate("2026-02-18", 2)).toBe("Mar 4, 2026");
  });

  it("returns null for empty startDate", () => {
    expect(toCompletionDate("", 2)).toBeNull();
  });

  it("returns null for invalid startDate", () => {
    expect(toCompletionDate("not-a-date", 2)).toBeNull();
  });

  it("handles zero weeks correctly", () => {
    expect(toCompletionDate("2026-02-18", 0)).toBe("Feb 18, 2026");
  });
});
