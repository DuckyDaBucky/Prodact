"use client";

import { useState } from "react";
import { Cpu, LoaderCircle, SendHorizontal } from "lucide-react";

import type { WorkspaceAssistantReply } from "@/lib/gemini";

type AssistantResponse = {
  reply?: WorkspaceAssistantReply;
  error?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  body: string;
  meta?: string;
};

const recommendedPrompts = [
  "Find high-risk inventory and explain what to restock first.",
  "Summarize how Search and Product Analysis use the Target database.",
  "Which competitor analysis signals should we mention in the demo?",
  "Explain what parts of Prodact are real DB-backed versus demo-derived.",
];

export function WorkspaceAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      body:
        "Ask about product search, inventory, product analysis, competitor analysis, notifications, store performance, or deployment evidence. Answers are grounded in the current seeded Target data and app routes.",
      meta: "AskProdact",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendQuestion(question);
  }

  async function sendQuestion(nextQuestion: string) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestion("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: "user",
        body: trimmedQuestion,
      },
    ]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });
      const payload = (await response.json()) as AssistantResponse;

      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? "Assistant did not respond.");
      }

      const assistantReply = payload.reply;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          body: assistantReply.answer,
          meta:
            assistantReply.provider === "gemini"
              ? `Gemini - ${assistantReply.model}`
              : `Fallback - ${assistantReply.model}`,
        },
      ]);
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
    <section className="space-y-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
              AskProdact
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--target-ink)]">
              Database-grounded assistant
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Ask questions across the current app. The endpoint retrieves seeded Target products,
              inventory signals, feature routes, and derived alerts before calling Gemini.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-xs text-[var(--muted-strong)]">
            <Cpu className="h-3.5 w-3.5" />
            DB-grounded
          </span>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {recommendedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendQuestion(prompt)}
              disabled={isLoading}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-left text-sm leading-5 text-[var(--target-ink)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-[34rem] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--surface-subtle)] p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[48rem] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "rounded-br-md bg-[var(--target-red)] text-white"
                    : "rounded-bl-md border border-[var(--border)] bg-[var(--surface)] text-[var(--target-ink)]"
                }`}
              >
                {message.meta ? (
                  <p
                    className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      message.role === "user" ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {message.meta}
                  </p>
                ) : null}
                <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
              </div>
            </div>
          ))}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted-strong)]">
                <LoaderCircle className="h-4 w-4 animate-spin text-[var(--target-red)]" />
                Checking database context and Gemini...
              </div>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-4">
          <div className="flex flex-col gap-2 lg:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about a product, inventory risk, competitor signal, route, or deployment evidence"
              className="min-h-10 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)]"
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
              Send
            </button>
          </div>
        </form>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-[var(--target-red-soft)] px-3 py-2 text-sm text-[var(--target-red-dark)]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
