import { Bot, CheckCircle2, Sparkles, TriangleAlert } from "lucide-react";

import type { ProductAiInsight } from "@/lib/gemini";

type ProductAiInsightPanelProps = {
  insight: ProductAiInsight;
};

export function ProductAiInsightPanel({ insight }: ProductAiInsightPanelProps) {
  const processedByGemini = insight.provider === "gemini";
  const risks =
    insight.risks.length > 0
      ? insight.risks
      : ["No major risk text was returned by the AI provider for this product."];
  const nextActions =
    insight.nextActions.length > 0
      ? insight.nextActions
      : ["Review the ranked product recommendations and inventory signals."];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
            <Sparkles className="h-3 w-3" />
            {processedByGemini ? "Processed by Gemini" : "Fallback AI insight"}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-[var(--target-ink)]">
            Product decision support
          </h3>
        </div>
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium",
            processedByGemini
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {processedByGemini ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <TriangleAlert className="h-3.5 w-3.5" />
          )}
          {insight.model}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--muted-strong)]">
        {insight.summary}
      </p>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--target-ink)]">
            <TriangleAlert className="h-4 w-4 text-[var(--target-red)]" />
            Risks
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-strong)]">
            {risks.map((risk) => (
              <li key={risk} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--target-red)]" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--target-ink)]">
            <Bot className="h-4 w-4 text-[var(--target-red)]" />
            Recommendation rationale
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted-strong)]">
            {insight.recommendationRationale}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--target-red-soft)] p-4">
        <p className="text-sm font-semibold text-[var(--target-ink)]">
          Next actions
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {nextActions.map((action) => (
            <span
              key={action}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--target-ink)]"
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
