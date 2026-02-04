import { useState } from "react";
import "./App.css";
import { SimulationForm } from "./components/simulation-form";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";

function App() {
  const [simulationResults, setSimulationResults] = useState<number[]>([]);

  const runSimulation = (velocityStr: string, projectSize: number) => {
    const velocityHistory = velocityStr.split(",").map((num) => Number(num));
    const simulatedLengths = simulateDeliveryWeeks({
      velocityHistory,
      projectSize,
    });

    setSimulationResults(simulatedLengths);
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

export default App;
