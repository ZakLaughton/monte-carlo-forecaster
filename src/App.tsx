import { useState } from "react";
import "./App.css";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { ForecastResults } from "./components/ForecastResults";
import { DeliveryOddsChart } from "./components/DeliveryOddsChart";

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
      <ForecastResults data={simulationResults} />
      <DeliveryOddsChart />
    </div>
  );
}

export default App;
