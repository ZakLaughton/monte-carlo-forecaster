import { useEffect } from "react";
import { parseShareParams } from "../utils/share-params";

export function useAutoRunFromUrlParams(
  runSimulation: (weeks: number[], size: number, start: string) => void,
) {
  useEffect(() => {
    const params = parseShareParams(window.location.search);
    if (params) {
      runSimulation(params.weeks, params.size, params.start);
    }
  }, [runSimulation]);
}
