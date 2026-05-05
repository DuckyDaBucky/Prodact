"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { LoaderCircle, Search, SendHorizontal, UserRound } from "lucide-react";

import type { MessageThread, MessageThreadSummary, RecipientSummary } from "@/lib/messages";

type MessagesPanelProps = {
  currentUserId: string;
  initialThreads: MessageThreadSummary[];
  initialActiveThread: MessageThread | null;
};

type SearchResponse = {
  results: RecipientSummary[];
};

type MessagesResponse = {
  threads: MessageThreadSummary[];
  activeThread: MessageThread | null;
  error?: string;
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MessagesPanel({
  currentUserId,
  initialThreads,
  initialActiveThread,
}: MessagesPanelProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeThread, setActiveThread] = useState(initialActiveThread);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RecipientSummary[]>([]);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    const trimmedQuery = deferredSearchQuery.trim();

    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoadingSearch(true);

    fetch(`/api/messages/users?query=${encodeURIComponent(trimmedQuery)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to search employees right now.");
        }

        return (await response.json()) as SearchResponse;
      })
      .then((payload) => {
        setSearchResults(payload.results);
      })
      .catch((requestError) => {
        if ((requestError as Error).name !== "AbortError") {
          setError(requestError instanceof Error ? requestError.message : "Unable to search employees.");
        }
      })
      .finally(() => {
        setIsLoadingSearch(false);
      });

    return () => {
      controller.abort();
    };
  }, [deferredSearchQuery]);

  async function loadThread(recipientId: string) {
    setError(null);
    setIsLoadingThread(true);

    try {
      const response = await fetch(`/api/messages?recipientId=${encodeURIComponent(recipientId)}`);
      const payload = (await response.json()) as MessagesResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to open that conversation.");
      }

      setThreads(payload.threads);
      setActiveThread(payload.activeThread);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to open that conversation.");
    } finally {
      setIsLoadingThread(false);
    }
  }

  async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeThread || !composer.trim()) {
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: activeThread.recipient.id,
          body: composer,
        }),
      });

      const payload = (await response.json()) as MessagesResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send that message.");
      }

      setThreads(payload.threads);
      setActiveThread(payload.activeThread);
      setComposer("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send that message.");
    } finally {
      setIsSending(false);
    }
  }

  const activeRecipientId = activeThread?.recipient.id ?? null;

  return (
    <div className="grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--border)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
            Employee directory
          </p>
          <label
            htmlFor="message-search"
            className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 transition focus-within:border-[var(--target-red)] focus-within:bg-[var(--surface)]"
          >
            {isLoadingSearch ? (
              <LoaderCircle className="h-4 w-4 animate-spin text-[var(--muted)]" />
            ) : (
              <Search className="h-4 w-4 text-[var(--muted)]" />
            )}
            <input
              id="message-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or employee ID"
              className="w-full bg-transparent text-sm text-[var(--target-ink)] outline-none placeholder:text-[var(--muted)]"
            />
          </label>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Type at least two characters to find a coworker.
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--target-ink)]">
            Recent threads
          </h2>
          <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-strong)]">
            {threads.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {searchQuery.trim().length >= 2 ? (
            <div className="space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => loadThread(result.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--surface-subtle)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--target-red-soft)] text-[var(--target-red)]">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[var(--target-ink)]">
                        {result.name}
                      </span>
                      <span className="block truncate text-xs text-[var(--muted)]">
                        {result.employeeId}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-4 text-sm text-[var(--muted)]">
                  No matching employees found yet.
                </div>
              )}
            </div>
          ) : threads.length > 0 ? (
            <div className="space-y-0.5">
              {threads.map((thread) => {
                const isActive = activeRecipientId === thread.recipient.id;

                return (
                  <button
                    key={thread.recipient.id}
                    type="button"
                    onClick={() => loadThread(thread.recipient.id)}
                    className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      isActive
                        ? "bg-[var(--target-red-soft)]"
                        : "hover:bg-[var(--surface-subtle)]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-[var(--target-red)] text-white"
                          : "bg-[var(--surface-subtle)] text-[var(--muted-strong)]"
                      }`}
                    >
                      {thread.recipient.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span
                          className={`truncate text-sm font-medium ${
                            isActive
                              ? "text-[var(--target-red-dark)]"
                              : "text-[var(--target-ink)]"
                          }`}
                        >
                          {thread.recipient.name}
                        </span>
                        {thread.lastMessage ? (
                          <span className="shrink-0 text-[11px] text-[var(--muted)]">
                            {formatTimestamp(thread.lastMessage.createdAt)}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                        {thread.lastMessage?.body ?? "No messages yet."}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="m-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-6 text-sm leading-6 text-[var(--muted)]">
              No conversations yet. Search for an employee by name to send the
              first message.
            </div>
          )}
        </div>
      </aside>

      <section className="flex min-h-[38rem] flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        {activeThread ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--target-red-soft)] text-sm font-semibold text-[var(--target-red)]">
                  {activeThread.recipient.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[var(--target-ink)]">
                    {activeThread.recipient.name}
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Employee ID: {activeThread.recipient.employeeId}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--surface-subtle)] px-6 py-5">
              {activeThread.messages.length > 0 ? (
                activeThread.messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[36rem] rounded-2xl px-4 py-2.5 ${
                          isCurrentUser
                            ? "rounded-br-md bg-[var(--target-red)] text-white"
                            : "rounded-bl-md border border-[var(--border)] bg-[var(--surface)] text-[var(--target-ink)]"
                        }`}
                      >
                        <p className="text-sm leading-6">{message.body}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            isCurrentUser ? "text-white/75" : "text-[var(--muted)]"
                          }`}
                        >
                          {formatTimestamp(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-md rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-8 py-10 text-center">
                    <p className="text-base font-semibold text-[var(--target-ink)]">
                      Start the conversation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Send a message below and the conversation will be created
                      automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t border-[var(--border)] px-6 py-4"
            >
              <textarea
                value={composer}
                onChange={(event) => setComposer(event.target.value)}
                placeholder={`Message ${activeThread.recipient.name}`}
                rows={3}
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)]"
              />
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-xs text-[var(--muted)]">
                  Press <kbd className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1 text-[10px]">Enter</kbd> + <kbd className="rounded border border-[var(--border)] bg-[var(--surface-subtle)] px-1 text-[10px]">Shift</kbd> for a new line.
                </p>
                <button
                  type="submit"
                  disabled={isSending || !composer.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--target-red)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="w-full max-w-2xl rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] px-8 py-12 text-center">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                Pick an employee
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Search by name to open a direct thread, or select an existing
                conversation from the list.
              </p>
            </div>
          </div>
        )}

        {error ? (
          <div className="border-t border-red-200 bg-[var(--target-red-soft)] px-6 py-3 text-sm text-[var(--target-red-dark)]">
            {error}
          </div>
        ) : null}
        {isLoadingThread ? (
          <div className="border-t border-[var(--border)] bg-[var(--surface-subtle)] px-6 py-2 text-xs text-[var(--muted)]">
            Loading conversation…
          </div>
        ) : null}
      </section>
    </div>
  );
}
