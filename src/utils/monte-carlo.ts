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
  if (projectSize <= 0) return [];
  if (velocityHistory.length === 0) return [];
  if (velocityHistory.every(v => v === 0)) return [];

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
    remaining -= pickRandomItem(velocityHistory);
  }
  return weeks;
}

/**
 * Picks a random element from an array..
 */
function pickRandomItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
