import type { ReactNode } from "react";

import { BrandLockup } from "./brand-lockup";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-elevated)]">
        <BrandLockup subtitle="Target product intelligence" />
        <div className="mt-7 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
            {eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
            {title}
          </h1>
          <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
        <div className="mt-7">{children}</div>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        Protected by Target single sign-on. Use of this system is monitored for
        team-member compliance.
      </p>
    </div>
  );
}
