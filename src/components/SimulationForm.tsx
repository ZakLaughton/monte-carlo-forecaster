import { useState } from "react";

type Props = {
  onRun: (velocityStr: string, size: number) => void;
};

export const SimulationForm = ({ onRun }: Props) => {
  const [velocityStr, setVelocityStr] = useState("3,5,2,4,5,4,3");
  const [projectSize, setProjectSize] = useState(20);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onRun(velocityStr, projectSize);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Add past sprint velocity:
          <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
            Use the number of tickets moved to "done" each week. Format:
            1,3,4,3,2.
          </span>
          <input
            type="text"
            value={velocityStr}
            onChange={(e) => setVelocityStr(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Project size (number of stories):
          <input
            type="number"
            value={projectSize}
            onChange={(e) => setProjectSize(Number(e.target.value))}
            style={{
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Run simulation
        </button>
      </form>
    </>
  );
};
