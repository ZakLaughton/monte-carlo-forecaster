# monte-carlo-forecaster

Project Goal: A Proof-of-Concept (PoC) tool to automate probabilistic sprint planning.

Context: Moving away from time-based estimation toward historical velocity data can reduce sprint planning overhead. This prototype explores using a Monte Carlo simulation to visualize "percent likelihood" of delivery dates based on past throughput.

Tech Stack Experiments:
• Vite + React: Exploring lightweight build tooling for fast prototyping.
• Monte Carlo Logic: Client-side simulation of 10,000+ iterations.
• Visualization: Rendering statistical distribution using Recharts.

## Common Commands

- **Start development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Run ESLint:** `npm run lint`
- **Run tests:** `npm test`

## Plausible Analytics

Analytics is initialized in `src/main.tsx` using `@plausible-analytics/tracker`.

- Tracking runs **only in production** (`import.meta.env.PROD`)
- Tracking is explicitly disabled on localhost (`captureOnLocalhost: false`)
- Domain is hardcoded to `forecaster.zaklaughton.dev`
