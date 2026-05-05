import { cn } from "./cn";
import { TargetLogo } from "./target-logo";

type BrandLockupProps = {
  className?: string;
  subtitle?: string;
};

export function BrandLockup({ className, subtitle }: BrandLockupProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <TargetLogo className="h-9 w-9 shrink-0" />
      <div className="leading-tight">
        <p className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--target-ink)]">
          Prodact
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
