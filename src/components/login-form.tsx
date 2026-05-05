"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Lock, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await authClient.signIn.username({
      username: employeeId.trim(),
      password,
      rememberMe: true,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to sign in with that employee ID.");
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label
          className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-strong)]"
          htmlFor="employee-id"
        >
          Employee ID
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="employee-id"
            name="employee-id"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            placeholder="TM-2048"
            autoComplete="username"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)]"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-strong)]"
            htmlFor="password"
          >
            Password
          </label>
          <button
            type="button"
            className="text-xs font-medium text-[var(--target-red)] hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)]"
            required
          />
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-[var(--target-red-soft)] px-3 py-2 text-sm text-[var(--target-red-dark)]">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--target-red)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--target-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in to Prodact"
        )}
      </button>
      <p className="text-center text-xs leading-5 text-[var(--muted)]">
        Internal access only. Account creation is provisioned by IT.
      </p>
    </form>
  );
}
