import { useMemo, useState } from "react";
import "./App.css";
import { SimulationForm } from "./components/SimulationForm";
import { simulateDeliveryWeeks } from "./utils/monte-carlo";
import { ForecastResults } from "./components/ForecastResults";
import { DeliveryOddsChart } from "./components/DeliveryOddsChart";
import { toOddsByWeek } from "./utils/stats";

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

  const oddsByWeek = useMemo(
    () => toOddsByWeek(simulationResults),
    [simulationResults],
  );

  return (
    <div>
      <h1>Data-Driven Sprint Forecaster</h1>
      <SimulationForm onRun={runSimulation} />
      {oddsByWeek.length > 0 && <DeliveryOddsChart data={oddsByWeek} />}
      <ForecastResults data={simulationResults} />
    </div>
  );
}

export default App;
