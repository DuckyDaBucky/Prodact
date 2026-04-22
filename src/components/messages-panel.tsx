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
    <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <aside className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
            Employee Directory
          </p>
          <label
            htmlFor="message-search"
            className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[linear-gradient(135deg,rgba(35,24,21,0.08),rgba(255,255,255,0.96))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
          >
            {isLoadingSearch ? (
              <LoaderCircle className="h-6 w-6 animate-spin text-[var(--muted)]" />
            ) : (
              <Search className="h-6 w-6 text-[var(--muted)]" />
            )}
            <input
              id="message-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name"
              className="w-full bg-transparent text-lg font-semibold tracking-tight text-[var(--target-ink)] outline-none placeholder:text-[var(--target-ink)]/70"
            />
          </label>
          <p className="text-sm text-[var(--muted)]">
            Type at least two characters to look up a coworker and start a direct conversation.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Recent Threads
            </h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--target-ink)] ring-1 ring-[var(--border)]">
              {threads.length}
            </span>
          </div>

          {searchQuery.trim().length >= 2 ? (
            <div className="space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => loadThread(result.id)}
                    className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white/80 px-4 py-3 text-left transition hover:border-[var(--target-red)] hover:bg-white"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[var(--target-red)]">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-[var(--target-ink)]">
                        {result.name}
                      </span>
                      <span className="block truncate text-sm text-[var(--muted)]">
                        {result.employeeId}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-white/70 px-4 py-5 text-sm text-[var(--muted)]">
                  No matching employees found yet.
                </div>
              )}
            </div>
          ) : threads.length > 0 ? (
            <div className="space-y-2">
              {threads.map((thread) => (
                <button
                  key={thread.recipient.id}
                  type="button"
                  onClick={() => loadThread(thread.recipient.id)}
                  className={`flex w-full items-start gap-3 rounded-[1.5rem] border px-4 py-3 text-left transition ${
                    activeRecipientId === thread.recipient.id
                      ? "border-[var(--target-red)] bg-red-50/70"
                      : "border-[var(--border)] bg-white/80 hover:border-[var(--target-red)] hover:bg-white"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--target-red)] ring-1 ring-[var(--border)]">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold text-[var(--target-ink)]">
                        {thread.recipient.name}
                      </span>
                      {thread.lastMessage ? (
                        <span className="shrink-0 text-xs text-[var(--muted)]">
                          {formatTimestamp(thread.lastMessage.createdAt)}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block truncate text-sm text-[var(--muted)]">
                      {thread.lastMessage?.body ?? "No messages yet."}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-[var(--border)] bg-white/70 px-5 py-6 text-sm leading-6 text-[var(--muted)]">
              No conversations yet. Search for an employee by name to send the first message.
            </div>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-7">
        <div className="flex min-h-[38rem] flex-col rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(35,24,21,0.06),rgba(35,24,21,0.03))] px-6 py-8 sm:px-8 sm:py-10">
          {activeThread ? (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
                    Direct Messages
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                    {activeThread.recipient.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Employee ID: {activeThread.recipient.employeeId}
                  </p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[var(--target-ink)] ring-1 ring-[var(--border)]">
                  {isLoadingThread ? (
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-6 w-6" />
                  )}
                </span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto py-6">
                {activeThread.messages.length > 0 ? (
                  activeThread.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[36rem] rounded-[1.6rem] px-4 py-3 shadow-sm ${
                            isCurrentUser
                              ? "bg-[var(--target-red)] text-white"
                              : "border border-[var(--border)] bg-white text-[var(--target-ink)]"
                          }`}
                        >
                          <p className="text-sm leading-6">{message.body}</p>
                          <p
                            className={`mt-2 text-xs ${
                              isCurrentUser ? "text-white/80" : "text-[var(--muted)]"
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
                    <div className="max-w-md rounded-[1.8rem] border border-dashed border-[var(--border)] bg-white/75 px-8 py-10 text-center">
                      <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                        Start the conversation
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        This thread is ready. Send a message below and the conversation will be created automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3 border-t border-[var(--border)] pt-5">
                <textarea
                  value={composer}
                  onChange={(event) => setComposer(event.target.value)}
                  placeholder={`Message ${activeThread.recipient.name}`}
                  rows={4}
                  className="w-full resize-none rounded-[1.5rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-4 focus:ring-red-100"
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-[var(--muted)]">
                    Search anyone by name to switch recipients. No friend request step needed.
                  </p>
                  <button
                    type="submit"
                    disabled={isSending || !composer.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--target-red)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--target-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-2xl rounded-[1.8rem] border border-dashed border-[var(--border)] bg-white/70 px-8 py-12 text-center">
                <p className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--target-ink)] sm:text-5xl">
                  Pick an employee
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                  Search by name to open a direct thread, or select an existing conversation from the list.
                </p>
              </div>
            </div>
          )}

          {error ? (
            <div className="mt-4 rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
