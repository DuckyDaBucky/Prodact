import Link from "next/link";
import { Bell, Search, ShieldCheck } from "lucide-react";

import type { AuthSession } from "@/lib/auth";

import { LogoutButton } from "./logout-button";

type AppHeaderProps = {
  session: AuthSession;
};

export function AppHeader({ session }: AppHeaderProps) {
  const displayName = session.user.name || session.user.employeeId;
  const initials = getInitials(displayName);

  return (
    <header className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-sm)] lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--target-red-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          <ShieldCheck className="h-3 w-3" />
          Internal access
        </div>
        <h1 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
          Welcome back, {displayName}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/search"
          className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--target-ink)] sm:inline-flex"
        >
          <Search className="h-4 w-4" />
          Search
        </Link>
        <Link
          href="/alerts"
          aria-label="View notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--target-ink)]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--target-red)] ring-2 ring-[var(--surface)]" />
        </Link>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--target-red)] text-[11px] font-semibold text-white">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-tight text-[var(--target-ink)]">
              {displayName}
            </p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              {session.user.role ?? "employee"}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "TM";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }

  const candidate = parts[0]!;
  return candidate.slice(0, 2).toUpperCase();
}
