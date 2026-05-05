"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { IdCard, LoaderCircle, Lock, UserRound } from "lucide-react";

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
      <Field
        id="signup-name"
        label="Full name"
        icon={<UserRound className="h-4 w-4 text-[var(--muted)]" />}
        value={name}
        onChange={setName}
        placeholder="Jordan Lee"
        autoComplete="name"
      />
      <Field
        id="signup-employee-id"
        label="Employee ID"
        icon={<IdCard className="h-4 w-4 text-[var(--muted)]" />}
        value={employeeId}
        onChange={setEmployeeId}
        placeholder="TM-2048"
        autoComplete="username"
      />
      <Field
        id="signup-password"
        label="Password"
        icon={<Lock className="h-4 w-4 text-[var(--muted)]" />}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        type="password"
      />
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
            Creating account…
          </>
        ) : (
          "Create demo account"
        )}
      </button>
      <p className="text-xs leading-5 text-[var(--muted)]">
        This hidden route exists only for class-project setup. New accounts
        default to the{" "}
        <span className="font-semibold text-[var(--target-ink)]">employee</span>{" "}
        role.
      </p>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
};

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-strong)]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          type={type}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)]"
          required
        />
      </div>
    </div>
  );
}
