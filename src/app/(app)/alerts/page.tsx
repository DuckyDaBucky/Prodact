import Link from "next/link";
import { ChevronDown, ChevronLeft, Bell, Sparkles } from "lucide-react";

const notificationGroups = [
  {
    title: "Product Notifications",
    icon: Bell,
    accent: "from-red-100 via-white to-red-50",
    emptyState: "No notifications",
    helperText: "Restock requests, pricing updates, and product health alerts will appear here.",
  },
  {
    title: "Social Notifications",
    icon: Sparkles,
    accent: "from-amber-100 via-white to-orange-50",
    emptyState: "No notifications",
    helperText: "Team mentions, comments, and shared activity updates will appear here.",
  },
] as const;

export default function AlertsPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-4 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:flex-row sm:items-center sm:p-5">
        <Link
          href="/dashboard"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--target-ink)] transition hover:-translate-y-0.5 hover:border-red-200 hover:text-[var(--target-red)]"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1 rounded-[1.6rem] bg-[linear-gradient(135deg,rgba(204,0,0,0.08),rgba(255,255,255,0.98))] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
            Notification Center
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
            Notifications Page
          </h2>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-7">
        <div className="space-y-4">
          {notificationGroups.map((group) => {
            const Icon = group.icon;

            return (
              <details
                key={group.title}
                open
                className="group overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white/80"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[linear-gradient(135deg,rgba(75,29,29,0.92),rgba(108,52,52,0.88))] px-5 py-4 text-white marker:content-none">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/16 ring-1 ring-white/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xl font-semibold">{group.title}</p>
                      <p className="text-sm text-white/70">{group.helperText}</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                </summary>
                <div className={`bg-gradient-to-br ${group.accent} px-5 py-8 sm:px-7 sm:py-10`}>
                  <div className="flex min-h-52 flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.78)] px-6 text-center">
                    <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)] sm:text-4xl">
                      {group.emptyState}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                      Once this module is connected to live workflows, this area can surface incoming updates without changing the page structure.
                    </p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
