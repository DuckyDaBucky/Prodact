import { cn } from "./cn";
import { TargetLogo } from "./target-logo";

type BrandLockupProps = {
  className?: string;
  subtitle?: string;
};

export function BrandLockup({ className, subtitle }: BrandLockupProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <TargetLogo className="h-11 w-11 shrink-0" />
      <div className="space-y-0.5">
        <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
          Prodact
        </p>
        {subtitle ? <p className="text-sm text-[var(--muted)]">{subtitle}</p> : null}
      </div>
    </div>
  );
}
