/**
 * Props for simulateDeliveryWeeks.
 * @property velocityHistory - Array of past velocities per week.
 * @property projectSize - Total units of work to deliver.
 * @property iterationCount - Number of Monte Carlo simulations (default: 10,000).
 */
type SimulateDeliveryWeeksProps = {
  velocityHistory: number[];
  projectSize: number;
  iterationCount?: number;
};

/**
 * Runs Monte Carlo simulations to estimate delivery weeks for a project.
 * @param velocityHistory Array of past weekly velocities.
 * @param projectSize Total units of work to deliver.
 * @param iterationCount Number of simulations to run (default: 10,000).
 * @returns Array of simulated delivery weeks for each run.
 */
export const simulateDeliveryWeeks = ({
  velocityHistory,
  projectSize,
  iterationCount = 10000,
}: SimulateDeliveryWeeksProps): number[] => {
  // Return empty if project size is invalid or no velocity history
  if (projectSize <= 0) return [];
  if (velocityHistory.length === 0) return [];

  const results: number[] = [];
  for (let i = 0; i < iterationCount; i++) {
    results.push(simulateSingleDelivery(velocityHistory, projectSize));
  }
  return results;
};

/**
 * Simulates delivery for a single run.
 * @param velocityHistory Array of past weekly velocities.
 * @param projectSize Total units of work to deliver.
 * @returns Number of weeks to complete the project in this simulation.
 */
function simulateSingleDelivery(
  velocityHistory: number[],
  projectSize: number,
): number {
  let remaining = projectSize;
  let weeks = 0;
  while (remaining > 0) {
    weeks++;
    const randomHistoricalVelocity = pickRandomItem(velocityHistory);
    remaining -= randomHistoricalVelocity;
  }
  return weeks;
}

/**
 * Picks a random element from an array.
 * @param arr The array to pick from.
 * @returns A random element from the array.
 */
function pickRandomItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
