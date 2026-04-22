"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

function buildInternalEmail(employeeId: string) {
  return `${employeeId.toLowerCase()}@prodact.internal`;
}

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const normalizedEmployeeId = employeeId.trim();

    const result = await authClient.signUp.email({
      name: name.trim(),
      email: buildInternalEmail(normalizedEmployeeId),
      password,
      username: normalizedEmployeeId,
      employeeId: normalizedEmployeeId,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to create the account.");
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
        <label className="text-sm font-semibold text-[var(--target-ink)]" htmlFor="signup-name">
          Full name
        </label>
        <input
          id="signup-name"
          name="signup-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jordan Lee"
          autoComplete="name"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--target-red)] focus:ring-4 focus:ring-red-100"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--target-ink)]" htmlFor="signup-employee-id">
          Employee ID
        </label>
        <input
          id="signup-employee-id"
          name="signup-employee-id"
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          placeholder="TM-2048"
          autoComplete="username"
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--target-red)] focus:ring-4 focus:ring-red-100"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--target-ink)]" htmlFor="signup-password">
          Password
        </label>
        <input
          id="signup-password"
          name="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
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
        {isSubmitting ? "Creating account..." : "Create demo account"}
      </button>
      <p className="text-xs leading-5 text-[var(--muted)]">
        This hidden route exists only for class-project setup. New accounts default to the <span className="font-semibold text-[var(--target-ink)]">employee</span> role.
      </p>
    </form>
  );
}
