# FAQ Modal — Spec

## Summary

Add a FAQ modal reachable via a link in the page header, next to the "Delivery Forecast" title. The modal answers common questions about how the tool works and what the results mean.

---

## UI

### Trigger

A small `"How does this work?"` link (Mantine `Anchor` or `Button variant="subtle"`) floated to the right of the `"Delivery Forecast"` title in the header.

```
  Delivery Forecast                    How does this work?
  ─────────────────────────────────────────────────────────
  [ form ]                [ results ]
```

On mobile, the link can wrap below the title or stay inline — `Group justify="space-between"` handles this.

### Modal

- Mantine `Modal`, centered, `size="lg"`
- Title: `"Frequently Asked Questions"`
- Body: Mantine `Accordion` — each item is one question
- No scrolling needed; each answer is short

---

## Component plan

| File | Role |
|---|---|
| `src/components/FaqModal.tsx` | Modal UI — Accordion with all Q&A content |
| `src/hooks/useFaqModal.ts` | `{ opened, open, close }` — thin wrapper around `useDisclosure` |
| `src/App.tsx` | Wire trigger into header; render `<FaqModal>` |

Tests go in `src/components/__tests__/FaqModal.test.tsx`.

---

## Questions and answers

### 1. What is this tool?

Delivery Forecast is a probabilistic project forecasting tool. You give it your team's recent weekly output and the number of work items remaining, and it runs a Monte Carlo simulation to tell you the likelihood of finishing by different dates.

### 2. What is a Monte Carlo simulation?

It's a technique that runs thousands of random scenarios using your historical data. Each scenario samples randomly from your past weeks to simulate a possible future. The results show how often each delivery week occurred across all 10,000 runs — so "85% confidence" means the project finished by that date in 8,500 out of 10,000 simulations.

### 3. How do I use this?

1. Enter your team's completed work items for each recent week (the more history, the better).
2. Enter the number of work items remaining.
3. Set a forecast start date (usually today).
4. Click **Run simulation**.

The results show delivery date probabilities at the 50%, 70%, 85%, and 95% confidence levels.

### 4. What counts as a "work item"?

Whatever your team consistently tracks as a unit of completion — user stories, tickets, tasks. The key is consistency: use the same definition for your historical throughput and your remaining count.

### 5. How do I find my weekly throughput?

Count how many items your team completed each week for the past several weeks. Tools like Jira, Linear, or GitHub Projects can filter by completion date to help with this. Aim for 4–8 weeks of history for more reliable forecasts.

### 6. Why doesn't this use story points?

Story points are estimates, and estimates compound error. Throughput — how many items actually got done — is objective. Using real output avoids the "how big is a point?" debate and tends to produce more honest forecasts.

### 7. How many weeks of history do I need?

One week is the minimum, but results will be highly variable. Three to six weeks gives a reasonable signal. More history smooths out unusual weeks (holidays, incidents) and narrows the confidence interval.

### 8. What do the confidence percentages mean?

Each percentage is a threshold: "85% confidence" means the simulation predicts the team will finish by that date 85% of the time under similar conditions. Higher confidence = later date = safer commitment.

### 9. Can I share my forecast?

Yes. After running a simulation, the URL updates with your inputs encoded as query parameters. Copy and share the URL — anyone who opens it will see the same inputs and the simulation will run automatically.

---

## Implementation sequence

1. Write failing tests for `FaqModal`
2. Implement `useFaqModal.ts`
3. Implement `FaqModal.tsx`
4. Wire into `App.tsx` header
5. Run tests, verify in browser
