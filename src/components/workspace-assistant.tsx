"use client";

import { useState } from "react";
import { Cpu, LoaderCircle, SendHorizontal } from "lucide-react";

import type { WorkspaceAssistantReply } from "@/lib/gemini";

type AssistantResponse = {
  reply?: WorkspaceAssistantReply;
  error?: string;
};

export function WorkspaceAssistant() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<WorkspaceAssistantReply | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const payload = (await response.json()) as AssistantResponse;

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Assistant did not respond.");
      }

      setReply(payload.reply);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Assistant did not respond.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
            Workspace assistant
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--target-ink)]">
            Ask about any Prodact feature
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Uses the seeded Target dataset and current demo feature map. If Gemini is unavailable,
            the response falls back to deterministic project context.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-xs text-[var(--muted-strong)]">
          <Cpu className="h-3.5 w-3.5" />
          Protected endpoint
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 lg:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask how inventory, search, product analysis, or competitor analysis works"
          className="min-h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--ring)]"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--target-red)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          Ask
        </button>
      </form>

      {reply ? (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-[var(--target-ink)]">
              {reply.provider === "gemini" ? "Gemini response" : "Fallback response"}
            </p>
            <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-[11px] text-[var(--muted-strong)]">
              {reply.model}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted-strong)]">
            {reply.answer}
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="mt-3 rounded-lg border border-red-200 bg-[var(--target-red-soft)] px-3 py-2 text-sm text-[var(--target-red-dark)]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
