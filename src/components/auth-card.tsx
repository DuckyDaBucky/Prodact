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
    <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-8 shadow-[0_24px_70px_rgba(120,54,54,0.14)] backdrop-blur">
      <BrandLockup subtitle="Target internal product intelligence tool" />
      <div className="mt-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
          {eyebrow}
        </p>
        <div className="space-y-2">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
            {title}
          </h1>
          <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
