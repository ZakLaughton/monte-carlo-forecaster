# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm test             # Run all Jest tests with coverage
npm run coverage:open # Open coverage report in browser
```

**Run a single test file:**
```bash
npx jest src/components/__tests__/SimulationForm.test.tsx
```

**Type-check (app source only):**
```bash
npx tsc -p tsconfig.app.json --noEmit
```

## Architecture

This is a single-page Vite + React app for probabilistic sprint/project delivery forecasting using Monte Carlo simulation.

**Data flow:**

```
SimulationForm (weekly throughput, project size, start date)
  → onRun callback → App.tsx
  → simulateDeliveryWeeks() [src/utils/monte-carlo.ts]
     runs 10,000 iterations, returns raw week counts array
  → toOddsByWeek() [src/utils/stats.ts]
     builds cumulative probability curve: [{weeks, p, count}]
  → ResultsPanel → KeyOutcomes, DeliveryOddsTable, DeliveryOddsBarChart
```

**App.tsx** is the single source of truth for simulation state (`simulationResults`, `forecastStartDate`, `isRunning`, `isRevealing`). It uses two timer refs to enforce a 400ms minimum loading display (MIN_RUNNING_MS) and a 200ms reveal transition (REVEAL_TRANSITION_MS). It computes `oddsByWeek` via `useMemo` and passes it down via props — no global state manager.

**SimulationForm** manages its own form state via `useSimulationFormStorage` (in `src/hooks/`), which persists to localStorage automatically. This state does not live in App.

## Testing

- **Test utilities:** Always import `render` and screen utilities from `src/test-utils` (not directly from @testing-library/react). The custom `render` wraps components with MantineProvider.
- **Fake timers:** Tests that exercise the 400ms/200ms delays in App.tsx use `jest.useFakeTimers()` + `act(() => { jest.advanceTimersByTime(N) })`. Use `userEvent.setup({ delay: null })` when combining userEvent with fake timers.
- **Mocking the simulation:** `jest.mock("../utils/monte-carlo")` + `(simulateDeliveryWeeks as jest.Mock).mockReturnValue([...])` for deterministic results.
- **localStorage:** Call `localStorage.clear()` in `beforeEach` in any test that touches form persistence.
- **ts-jest config:** Jest uses `tsconfig.jest.json` (CommonJS module mode) — separate from `tsconfig.app.json` (bundler/ESNext mode used by Vite and the IDE).

## Code Style

**Function order — newspaper style:** In every file, exported (public) functions come first, followed by the private helpers they call. A reader should be able to understand what a file does from the top without scrolling through implementation details first.

## Key File Locations

| Concern | File |
|---|---|
| Simulation engine | `src/utils/monte-carlo.ts` |
| Statistics (cumulative odds) | `src/utils/stats.ts` |
| Date formatting (conditional year) | `src/utils/dates.ts` |
| Form localStorage hook | `src/hooks/useSimulationFormStorage.ts` |
| Crossfade reveal animation | `src/components/Crossfade.tsx`, `src/animations.css` |
| CSS class-based state indicator | `src/components/StatusCard.tsx` |
| Test render wrapper | `src/test-utils.tsx` |
