import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [pastVelocity, setPastVelocity] = useState<number[]>([]);
  const [velocityInput, setVelocityInput] = useState<string>("");

  const [projectSize, setProjectSize] = useState<number>(20);
  const [projectSizeInput, setProjectSizeInput] = useState<number>("20");

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    const parsedSize = Number(projectSizeInput);
    if (!Number.isNaN(parsedSize) && parsedSize >= 0) {
      setProjectSize(parsedSize);
    }
    setPastVelocity(velocityInput.split(",").map((num) => Number(num)));
  };

  return (
    <div>
      <h1>Forecasting tool</h1>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block" }}>
          Add past sprint velocity. Use the number of tickets moved to "done"
          each week. Format: 1,3,4,3,2.
          <input
            type="text"
            value={velocityInput}
            onChange={(e) => setVelocityInput(e.target.value)}
          />
        </label>
        <label>
          Project size (number of stories)
          <input
            type="number"
            value={projectSizeInput}
            onChange={(e) => setProjectSizeInput(Number(e.target.value))}
          />
        </label>
        <button type="submit">Add</button>
      </form>

      <div>
        <h3>Data</h3>
        <h4>Project size</h4>
        {projectSize}
        <h4>Velocity</h4>
        {pastVelocity.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ul>
            {pastVelocity.map((velocity, index) => (
              <li key={index}>
                Week {index + 1}: {velocity} completed
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
