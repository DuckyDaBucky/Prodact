"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, LifeBuoy } from "lucide-react";

import { navItems } from "@/lib/navigation";

import { BrandLockup } from "./brand-lockup";
import { cn } from "./cn";

type AppSidebarProps = {
  employeeId?: string | null;
  role?: string | null;
};

export function AppSidebar({ employeeId, role }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full max-w-xs flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <BrandLockup subtitle="Internal product intelligence" />
      </div>

      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--target-red-soft)] text-[var(--target-red)]">
            <CircleUserRound className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--target-ink)]">
              {employeeId ?? "Employee session"}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              {role ?? "employee"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Workspace
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const className = cn(
            "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
            isActive
              ? "bg-[var(--target-red-soft)] text-[var(--target-red)]"
              : "text-[var(--target-ink)] hover:bg-[var(--surface-subtle)]",
          );
          const children = (
            <>
              {isActive ? (
                <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[var(--target-red)]" />
              ) : null}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  item.href === "/messages"
                    ? "text-[var(--target-red)]"
                    : isActive
                    ? "text-[var(--target-red)]"
                    : "text-[var(--muted)] group-hover:text-[var(--target-ink)]",
                )}
              />
              <span className="font-medium">{item.label}</span>
            </>
          );

          if (item.href === "/search") {
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={className}
              >
                {children}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={className}
              prefetch={false}
            >
              {children}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-5 py-4">
        <Link
          href="/settings"
          className="flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--target-ink)]"
        >
          <LifeBuoy className="h-4 w-4" />
          Help & support
        </Link>
        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
          Prodact &middot; v0.4 internal
        </p>
      </div>
    </aside>
  );
}
