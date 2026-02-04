type SimulateDeliveryWeeksProps = {
  velocityHistory: number[];
  projectSize: number;
  iterationCount?: number;
};

export const simulateDeliveryWeeks = ({
  velocityHistory,
  projectSize,
  iterationCount = 10000,
}: SimulateDeliveryWeeksProps) => {
  const results: number[] = [];

  for (let i = 0; i < iterationCount; i++) {
    let remaining = projectSize;
    let weeks = 0;

    while (remaining > 0) {
      weeks++;
      const randomHistoricalVelocity = pickRandomItem(velocityHistory);
      remaining -= randomHistoricalVelocity;
    }

    results.push(weeks);
  }

  return results;
};

/**
 * Picks a random element from an array.
 * @param arr The array to pick from.
 * @returns A random element from the array, or undefined if the array is empty.
 */
function pickRandomItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
