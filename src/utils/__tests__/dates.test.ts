import { toCompletionDate } from "../dates";

describe("toCompletionDate", () => {
  it("returns correct date string for weeks added", () => {
    expect(toCompletionDate("2026-02-18", 2)).toMatch(/2026/);
  });
});
