import { simulateDeliveryWeeks } from "../monte-carlo";

describe("simulateDeliveryWeeks", () => {
  it("returns empty array if all velocities are zero", () => {
    expect(
      simulateDeliveryWeeks({
        velocityHistory: [0, 0, 0],
        projectSize: 10,
        iterationCount: 3,
      }),
    ).toEqual([]);
  });
  it("returns empty array for projectSize <= 0", () => {
    expect(
      simulateDeliveryWeeks({ velocityHistory: [1, 2, 3], projectSize: 0 }),
    ).toEqual([]);
    expect(
      simulateDeliveryWeeks({ velocityHistory: [1, 2, 3], projectSize: -5 }),
    ).toEqual([]);
  });

  it("returns empty array for empty velocityHistory", () => {
    expect(
      simulateDeliveryWeeks({ velocityHistory: [], projectSize: 10 }),
    ).toEqual([]);
  });

  it("returns an array of correct length for default iterationCount", () => {
    const result = simulateDeliveryWeeks({
      velocityHistory: [2, 3],
      projectSize: 10,
    });
    expect(result.length).toBe(10000);
  });

  it("returns an array of correct length for custom iterationCount", () => {
    const result = simulateDeliveryWeeks({
      velocityHistory: [2, 3],
      projectSize: 10,
      iterationCount: 5,
    });
    expect(result.length).toBe(5);
  });

  it("simulates delivery weeks with expected values", () => {
    // With velocityHistory [10], projectSize 20, always takes 2 weeks
    const result = simulateDeliveryWeeks({
      velocityHistory: [10],
      projectSize: 20,
      iterationCount: 3,
    });
    expect(result).toEqual([2, 2, 2]);
  });
});
