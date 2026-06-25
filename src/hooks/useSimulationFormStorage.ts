import { useEffect, useRef, useState } from "react";
import { parseShareParams } from "../utils/share-params";

export type SimulationFormState = {
  weeklyThroughput: (number | null)[];
  projectSize: number | null;
  startDate: string;
};

const DEFAULT_STORAGE_KEY = "delivery-forecaster-form";

export function getTodayIsoDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getDefaultFormState(): SimulationFormState {
  return {
    weeklyThroughput: [null],
    projectSize: null,
    startDate: getTodayIsoDate(),
  };
}

export function getSampleFormState(): SimulationFormState {
  return {
    weeklyThroughput: [5, 4, 6, 5, 7],
    projectSize: 30,
    startDate: getTodayIsoDate(),
  };
}

function isFormEmpty(state: SimulationFormState): boolean {
  return (
    state.weeklyThroughput.every((w) => w === null) && state.projectSize === null
  );
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
  if (typeof window === "undefined") return getSampleFormState();

  const shareParams = parseShareParams(window.location.search);
  if (shareParams) {
    return {
      weeklyThroughput: shareParams.weeks,
      projectSize: shareParams.size,
      startDate: shareParams.start,
    };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return getSampleFormState();
    const state = sanitizeState(JSON.parse(raw) as Partial<SimulationFormState>);
    if (isFormEmpty(state)) return getSampleFormState();
    return state;
  } catch {
    return getSampleFormState();
  }
}

export function useSimulationFormStorage(storageKey = DEFAULT_STORAGE_KEY) {
  const [formState, setFormState] = useState<SimulationFormState>(() =>
    loadInitialState(storageKey),
  );
  const skipNextWrite = useRef(
    typeof window !== "undefined" &&
      !!parseShareParams(window.location.search),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
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
