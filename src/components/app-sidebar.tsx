"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <aside className="flex w-full max-w-xs flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
      <BrandLockup subtitle="Internal product operations workspace" />
      <div className="mt-8 rounded-[1.5rem] bg-red-50 px-4 py-4 text-sm text-[var(--target-ink)]">
        <p className="font-semibold">{employeeId ?? "Employee session"}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          {role ?? "employee"}
        </p>
      </div>
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-[1.4rem] px-4 py-3 transition",
                isActive
                  ? "bg-[var(--target-red)] text-white shadow-[0_14px_28px_rgba(204,0,0,0.18)]"
                  : "text-[var(--target-ink)] hover:bg-white",
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className={cn("text-xs leading-5", isActive ? "text-red-50" : "text-[var(--muted)]")}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
