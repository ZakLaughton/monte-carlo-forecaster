import { useState } from "react";
import "./App.css";
import { SimulationForm } from "./components/simulation-form";

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);

  const runSimulation = (velocityStr: string, projectSize: number) => {
    const parsedVelocityStr = velocityStr.split(",").map((num) => Number(num));
    if (parsedVelocityStr.length === 0) return;

    const simulations = [];

    for (let i = 0; i < 10000; i++) {
      let remainingStories = projectSize;
      let totalWeeks = 0;

      while (remainingStories > 0) {
        totalWeeks++;
        const completedThisWeek = pickRandomItem(parsedVelocityStr);
        remainingStories -= completedThisWeek;
      }
      simulations.push(totalWeeks);
    }

    setSimulationResults(simulations);
  };

  return (
    <div>
      <h1>Data-Driven Sprint Forecaster</h1>
      <SimulationForm onRun={runSimulation} />

      <div>
        <h3>Data</h3>
        <h4>Simulation</h4>
        {simulationResults.join(", ")}
      </div>
    </div>
  );
}

/**
 * Picks a random element from an array.
 * @param arr The array to pick from.
 * @returns A random element from the array, or undefined if the array is empty.
 */
function pickRandomItem<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export default App;
