type ForecastResultsProps = {
  data: number[];
};

export const ForecastResults = ({ data }: ForecastResultsProps) => {
  return (
    <div>
      <h3>Data</h3>
      <h4>Simulation</h4>
      {data.length === 0 || !data ? (
        <p>Waiting for data submission</p>
      ) : (
        data.join(", ")
      )}
    </div>
  );
};
