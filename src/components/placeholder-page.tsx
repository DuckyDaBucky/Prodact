import { ArrowRight, Database, Sparkles } from "lucide-react";

type PlaceholderPageProps = {
  title: string;
  description: string;
  checkpoints: string[];
};

export function PlaceholderPage({
  title,
  description,
  checkpoints,
}: PlaceholderPageProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="space-y-3">
        <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          <Sparkles className="h-3 w-3" />
          Future work surface
        </p>
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-6">
          <p className="text-sm font-semibold text-[var(--target-ink)]">
            Empty on purpose
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            This route is protected and ready for implementation, but the
            business widgets, charts, tables, and API calls are intentionally
            deferred to future teammates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--target-red)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)]"
            >
              Add feature widgets
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--target-ink)] transition hover:bg-[var(--surface-subtle)]"
            >
              <Database className="h-4 w-4 text-[var(--muted)]" />
              Connect real data
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
            Suggested build-out
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {checkpoints.map((checkpoint, index) => (
              <li key={checkpoint} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[10px] font-semibold text-[var(--target-red)]">
                  {index + 1}
                </span>
                <span>{checkpoint}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
