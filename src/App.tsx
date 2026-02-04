import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [pastVelocity, setPastVelocity] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!inputValue) return;

    setPastVelocity(inputValue.split(",").map((num) => Number(num)));
  };

  return (
    <div>
      <h1>Forecasting tool</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Add past sprint velocity. Use the number of tickets moved to "done"
          each week. Format: 1,3,4,3,2.
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button type="submit">Add</button>
      </form>

      <div>
        <h3>History</h3>
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
