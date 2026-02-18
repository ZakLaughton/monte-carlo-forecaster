import { useEffect, useState } from "react";

export type SimulationFormState = {
  weeklyThroughput: (number | null)[];
  projectSize: number | null;
  startDate: string;
};

const DEFAULT_STORAGE_KEY = "delivery-forecaster-form";

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getDefaultFormState(): SimulationFormState {
  return {
    weeklyThroughput: [null],
    projectSize: null,
    startDate: getTodayIsoDate(),
  };
}

function sanitizeState(
  parsed: Partial<SimulationFormState>,
): SimulationFormState {
  const weeklyThroughput = Array.isArray(parsed.weeklyThroughput)
    ? parsed.weeklyThroughput
        .map((value) =>
          typeof value === "number" && value >= 0 ? value : null,
        )
        .slice(0, 100)
    : [null];

  return {
    weeklyThroughput: weeklyThroughput.length > 0 ? weeklyThroughput : [null],
    projectSize:
      typeof parsed.projectSize === "number" ? parsed.projectSize : null,
    startDate:
      typeof parsed.startDate === "string" && parsed.startDate.trim().length > 0
        ? parsed.startDate
        : getTodayIsoDate(),
  };
}

function loadInitialState(storageKey: string): SimulationFormState {
  const fallback = getDefaultFormState();

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;
    return sanitizeState(JSON.parse(raw) as Partial<SimulationFormState>);
  } catch {
    return fallback;
  }
}

export function useSimulationFormStorage(storageKey = DEFAULT_STORAGE_KEY) {
  const [formState, setFormState] = useState<SimulationFormState>(() =>
    loadInitialState(storageKey),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(formState));
  }, [storageKey, formState]);

  const setWeeklyThroughput = (weeklyThroughput: (number | null)[]) => {
    setFormState((prev) => ({ ...prev, weeklyThroughput }));
  };

  const setProjectSize = (projectSize: number | null) => {
    setFormState((prev) => ({ ...prev, projectSize }));
  };

  const setStartDate = (startDate: string) => {
    setFormState((prev) => ({ ...prev, startDate }));
  };

  const resetForm = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
    setFormState(getDefaultFormState());
  };

  return {
    ...formState,
    setWeeklyThroughput,
    setProjectSize,
    setStartDate,
    resetForm,
  };
}
