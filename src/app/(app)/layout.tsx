import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { requireSession } from "@/lib/session";

export default async function InternalAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AppSidebar
          employeeId={session.user.employeeId}
          role={session.user.role}
        />
        <main className="min-w-0 space-y-6">
          <AppHeader session={session} />
          {children}
        </main>
      </div>
    </div>
  );
}
