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
    <section className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-8 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
          Future Work Surface
        </p>
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[1.6rem] border border-dashed border-red-200 bg-red-50/60 p-6">
          <p className="text-sm font-semibold text-[var(--target-ink)]">
            Empty on purpose
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            This route is protected and ready for implementation, but the business widgets, charts, tables, and API calls are intentionally deferred to future teammates.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-[var(--target-red)] px-4 py-2 text-sm font-semibold text-white"
            >
              Add feature widgets
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--target-ink)]"
            >
              Connect real data
            </button>
          </div>
        </div>
        <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-semibold text-[var(--target-ink)]">
            Suggested build-out
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            {checkpoints.map((checkpoint) => (
              <li key={checkpoint} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--target-red)]" />
                <span>{checkpoint}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
