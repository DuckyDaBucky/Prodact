import { Bot, CheckCircle2, Sparkles, TriangleAlert } from "lucide-react";

import type { ProductAiInsight } from "@/lib/gemini";

type ProductAiInsightPanelProps = {
  insight: ProductAiInsight;
};

export function ProductAiInsightPanel({ insight }: ProductAiInsightPanelProps) {
  const processedByGemini = insight.provider === "gemini";

  return (
    <section className="rounded-[1.6rem] border border-(--border) bg-white p-6 shadow-[0_12px_30px_rgba(120,54,54,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
            <Sparkles className="h-4 w-4" />
            {processedByGemini ? "Processed by Gemini" : "Fallback AI insight"}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-(--target-ink)">
            Product decision support
          </h3>
        </div>
        <span
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold",
            processedByGemini ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {processedByGemini ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <TriangleAlert className="h-4 w-4" />
          )}
          {insight.model}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-(--muted)">{insight.summary}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.25rem] border border-(--border) bg-(--card) p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--target-ink)">
            <TriangleAlert className="h-4 w-4 text-(--target-red)" />
            Risks
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-(--muted)">
            {insight.risks.map((risk) => (
              <li key={risk} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-(--target-red)" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.25rem] border border-(--border) bg-(--card) p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-(--target-ink)">
            <Bot className="h-4 w-4 text-(--target-red)" />
            Recommendation rationale
          </p>
          <p className="mt-3 text-sm leading-6 text-(--muted)">
            {insight.recommendationRationale}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.25rem] border border-red-100 bg-red-50/45 p-4">
        <p className="text-sm font-semibold text-(--target-ink)">Next actions</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {insight.nextActions.map((action) => (
            <span
              key={action}
              className="rounded-full border border-red-100 bg-white px-3 py-1 text-xs text-(--target-ink)"
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
