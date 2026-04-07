# Delivery Forecast

A fast, lightweight tool for probabilistic project forecasting. Enter your team's historical weekly throughput and remaining work — get a realistic range of delivery dates in seconds, no story pointing required.

Live at [deliveryforecast.app](https://deliveryforecast.app)

---

## What it does

Traditional estimation asks teams to size every ticket upfront, which is slow and often inaccurate. This tool takes a different approach: use what your team has actually delivered historically to predict what they'll deliver in the future.

Enter a few weeks of completed work items and your remaining story count. The tool runs 10,000 Monte Carlo simulations and shows you the range of likely delivery dates — with explicit probabilities at the 50%, 85%, and 95% likelihood thresholds.

Key benefits over story pointing:
- **No per-ticket estimation** — just count completed tasks/stories each week
- **Realistic uncertainty** — shows a range of outcomes, not a false single date
- **Naturally accounts for variability** — vacations, bugs, unplanned work are already baked into your historical throughput. No manual adjustments needed.

---

## Features

- **Weekly throughput input** — add as many historical weeks as you have. More weeks = more reliable forecast
- **Key outcomes** — delivery dates at 50%, 85%, and 95% likelihood
- **Distribution chart** — visualizes the full spread of simulation outcomes
- **Shareable URLs** — results are encoded in the URL so you can share a forecast directly with teammates. Anyone who opens the link sees the same inputs and gets a fresh simulation run
- **Persistent form state** — inputs are saved to localStorage so your data is there when you come back
- **Works for any team** — not tied to any specific tool. Count tickets from Jira, Linear, GitHub, a spreadsheet — anything

---

## Planned

- **Historical forecast snapshots** — save and compare forecasts over time to see how the project is tracking week to week
- **In-app guidance** — FAQ and how-to content to help teams get started, including how to pull throughput data from tools like Jira

---

## Development

### Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # tsc -b && vite build
npm run lint         # ESLint
npm test             # Run all Jest tests with coverage
npm run coverage:open # Open coverage report in browser
```

### Stack

- Vite + React + TypeScript
- Mantine UI
- Recharts for visualizations
- Jest + React Testing Library
- Monte Carlo simulation runs client-side (no backend)

### Testing

Jest and React Testing Library. See `CLAUDE.md` for testing conventions and architecture details.

- **Run all tests:** `npm test`
- **Run a single file:** `npx jest src/components/__tests__/SimulationForm.test.tsx`
- **Run only changed files:** `npm test -- --onlyChanged`

Coverage reports output to `coverage/`. Open with `npm run coverage:open`.

### Analytics

Plausible Analytics is initialized in `src/main.tsx`. Runs in production only (`import.meta.env.PROD`), disabled on localhost.
