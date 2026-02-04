import { useState } from "react";

type Props = {
  onRun: (velocityStr: string, size: number) => void;
};

export const SimulationForm = ({ onRun }: Props) => {
  const [velocityStr, setVelocityStr] = useState("3,5,2,4");
  const [projectSize, setProjectSize] = useState(20);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onRun(velocityStr, projectSize);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block" }}>
          Add past sprint velocity. Use the number of tickets moved to "done"
          each week. Format: 1,3,4,3,2.
          <input
            type="text"
            value={velocityStr}
            onChange={(e) => setVelocityStr(e.target.value)}
          />
        </label>
        <label>
          Project size (number of stories)
          <input
            type="number"
            value={projectSize}
            onChange={(e) => setProjectSize(Number(e.target.value))}
          />
        </label>
        <button type="submit">Run simulation</button>
      </form>
    </>
  );
};
