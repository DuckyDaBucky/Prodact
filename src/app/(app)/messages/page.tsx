import { Search, SendHorizontal } from "lucide-react";

export default function MessagesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-6">
        <label
          htmlFor="message-search"
          className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[linear-gradient(135deg,rgba(35,24,21,0.08),rgba(255,255,255,0.96))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
        >
          <Search className="h-7 w-7 text-[var(--muted)]" />
          <input
            id="message-search"
            type="search"
            placeholder="Search Messages"
            className="w-full bg-transparent text-2xl font-semibold tracking-tight text-[var(--target-ink)] outline-none placeholder:text-[var(--target-ink)]/90"
          />
        </label>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-7">
        <div className="flex min-h-[34rem] flex-col rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(35,24,21,0.06),rgba(35,24,21,0.03))] px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
                Faculty Messages
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                Messages
              </h2>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[var(--target-ink)] ring-1 ring-[var(--border)]">
              <SendHorizontal className="h-6 w-6" />
            </span>
          </div>

          <div className="flex flex-1 items-start justify-center pt-10 text-center">
            <div className="w-full max-w-2xl rounded-[1.8rem] border border-dashed border-[var(--border)] bg-white/70 px-8 py-12">
              <p className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--target-ink)] sm:text-5xl">
                No Faculty
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Search results and direct conversations can live here once faculty messaging is connected to real data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
