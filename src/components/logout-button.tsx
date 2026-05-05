"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);
    await authClient.signOut();
    setIsSubmitting(false);

    startTransition(() => {
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--target-ink)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4 text-[var(--muted)]" />
      {isSubmitting ? "Signing out…" : "Log out"}
    </button>
  );
}
