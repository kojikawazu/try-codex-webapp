import type { ReactNode } from "react";

type Card = {
  label: string;
  value: string | number;
  testId: string;
  accent?: ReactNode;
};

type SummaryCardsProps = {
  total: number;
  active: number;
  completed: number;
};

const buildCards = (props: SummaryCardsProps): Card[] => [
  { label: "合計", value: props.total, testId: "summary-total" },
  { label: "未完了", value: props.active, testId: "summary-active" },
  { label: "完了", value: props.completed, testId: "summary-completed" },
];

export default function SummaryCards(props: SummaryCardsProps) {
  const cards = buildCards(props);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          data-testid={card.testId}
          className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-[0_18px_50px_rgba(19,16,12,0.08)]"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent-2)]">
            {card.label}
          </span>
          <span className="text-3xl font-semibold text-[var(--foreground)]">
            {card.value}
          </span>
        </div>
      ))}
    </section>
  );
}
