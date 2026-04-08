import { ShieldCheck } from "lucide-react";

import type { AuthSession } from "@/lib/auth";

import { LogoutButton } from "./logout-button";

type AppHeaderProps = {
  session: AuthSession;
};

export function AppHeader({ session }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] px-6 py-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Internal Access
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
            Welcome back, {session.user.employeeId}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            This boilerplate protects the core navigation and gives your team a shared shell for PA4 feature work.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--target-ink)]">
          Role: <span className="font-semibold">{session.user.role ?? "employee"}</span>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
