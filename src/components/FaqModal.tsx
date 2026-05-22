import { Modal, Accordion } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
};

const FAQ_ITEMS = [
  {
    value: "what-is-this",
    question: "What is this tool?",
    answer:
      "Delivery Forecast is a probabilistic project forecasting tool. You give it your team's recent weekly output and the number of work items remaining, and it runs a Monte Carlo simulation to tell you the likelihood of finishing by different dates.",
  },
  {
    value: "what-is-monte-carlo",
    question: "What is a Monte Carlo simulation?",
    answer:
      "It's a technique that runs thousands of random scenarios using your historical data. Each scenario samples randomly from your past weeks to simulate a possible future. The results show how often each delivery week occurred across all 10,000 runs — so \"85% confidence\" means the project finished by that date in 8,500 out of 10,000 simulations.",
  },
  {
    value: "how-to-use",
    question: "How do I use this?",
    answer:
      "Enter your team's completed work items for each recent week (the more history, the better). Enter the number of work items remaining. Set a forecast start date (usually today). Click Run simulation. The results show delivery date probabilities at the 50%, 70%, 85%, and 95% confidence levels.",
  },
  {
    value: "what-counts",
    question: "What counts as a \"work item\"?",
    answer:
      "Whatever your team consistently tracks as a unit of completion — user stories, tickets, tasks. The key is consistency: use the same definition for your historical throughput and your remaining count.",
  },
  {
    value: "find-throughput",
    question: "How do I find my weekly throughput?",
    answer:
      "Count how many items your team completed each week for the past several weeks. Tools like Jira, Linear, or GitHub Projects can filter by completion date to help with this. Aim for 4–8 weeks of history for more reliable forecasts.",
  },
  {
    value: "no-story-points",
    question: "Why doesn't this use story points?",
    answer:
      "Story points are estimates, and estimates compound error. Throughput — how many items actually got done — is objective. Using real output avoids the \"how big is a point?\" debate and tends to produce more honest forecasts.",
  },
  {
    value: "how-many-weeks",
    question: "How many weeks of history do I need?",
    answer:
      "One week is the minimum, but results will be highly variable. Three to six weeks gives a reasonable signal. More history smooths out unusual weeks (holidays, incidents) and narrows the confidence interval.",
  },
  {
    value: "confidence-percentages",
    question: "What do the confidence percentages mean?",
    answer:
      "Each percentage is a threshold: \"85% confidence\" means the simulation predicts the team will finish by that date 85% of the time under similar conditions. Higher confidence = later date = safer commitment.",
  },
  {
    value: "sharing",
    question: "Can I share my forecast?",
    answer:
      "Yes. After running a simulation, the URL updates with your inputs encoded as query parameters. Copy and share the URL — anyone who opens it will see the same inputs and the simulation will run automatically.",
  },
];

export function FaqModal({ opened, onClose }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Frequently Asked Questions"
      size="lg"
      centered
    >
      <Accordion variant="separated">
        {FAQ_ITEMS.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Control>{question}</Accordion.Control>
            <Accordion.Panel>{answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Modal>
  );
}
