"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--target-ink)]" htmlFor="employee-id">
          Employee ID
        </label>
        <input
          id="employee-id"
          name="employee-id"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          placeholder="TM-2048"
          autoComplete="username"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--target-red)] focus:ring-4 focus:ring-red-100"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--target-ink)]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--target-red)] focus:ring-4 focus:ring-red-100"
          required
        />
      </div>
      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-[var(--target-red)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--target-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Enter Prodact"}
      </button>
      <p className="text-xs leading-5 text-[var(--muted)]">
        Access is intended for internal Target team workflows. The account-creation route is intentionally hidden from the main UI.
      </p>
    </form>
  );
}
