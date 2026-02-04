import { toOddsByWeek } from "./stats";

describe("toOddsByWeek", () => {
  it("returns an empty array when input is empty", () => {
    const results: number[] = [];
    const odds = toOddsByWeek(results);
    expect(odds).toEqual([]);
  });

  it("calculates odds correctly for a single week", () => {
    const results = [1, 1, 1];
    const odds = toOddsByWeek(results);
    expect(odds).toEqual([{ weeks: 1, count: 3, p: 1 }]);
  });

  it("calculates cumulative odds for multiple weeks", () => {
    const results = [1, 2, 3, 4, 5];
    const odds = toOddsByWeek(results);
    expect(odds).toEqual([
      { weeks: 1, p: 0.2, count: 1 },
      { weeks: 2, p: 0.4, count: 2 },
      { weeks: 3, p: 0.6, count: 3 },
      { weeks: 4, p: 0.8, count: 4 },
      { weeks: 5, p: 1.0, count: 5 },
    ]);
  });
});
