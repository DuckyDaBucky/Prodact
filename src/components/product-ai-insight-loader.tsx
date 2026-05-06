"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import { ProductAiInsightPanel } from "@/components/product-ai-insight";
import type { ProductAiInsight } from "@/lib/gemini";

type InsightResponse = {
  insight?: ProductAiInsight;
  error?: string;
};

type ProductAiInsightLoaderProps = {
  productId: string;
};

type InsightState =
  | { productId: string; status: "loading"; insight: null; error: null }
  | { productId: string; status: "ready"; insight: ProductAiInsight; error: null }
  | { productId: string; status: "error"; insight: null; error: string };

export function ProductAiInsightLoader({ productId }: ProductAiInsightLoaderProps) {
  const [state, setState] = useState<InsightState>({
    productId,
    status: "loading",
    insight: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/products/${encodeURIComponent(productId)}/ai-insight`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as InsightResponse;

        if (!response.ok || !payload.insight) {
          throw new Error(payload.error ?? "AI insight did not load.");
        }

        setState({
          productId,
          status: "ready",
          insight: payload.insight,
          error: null,
        });
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          productId,
          status: "error",
          insight: null,
          error: requestError instanceof Error
            ? requestError.message
            : "AI insight did not load.",
        });
      });

    return () => controller.abort();
  }, [productId]);

  if (state.productId !== productId || state.status === "loading") {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 text-sm text-[var(--muted-strong)]">
          <LoaderCircle className="h-4 w-4 animate-spin text-[var(--target-red)]" />
          Processing seeded product signals with Gemini or fallback analysis...
        </div>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-6 text-sm leading-6 text-[var(--muted-strong)]">
        <p className="inline-flex items-center gap-2 font-semibold text-[var(--target-ink)]">
          <TriangleAlert className="h-4 w-4 text-[var(--target-red)]" />
          AI insight unavailable
        </p>
        <p className="mt-2">
          {state.error}
        </p>
      </section>
    );
  }

  return <ProductAiInsightPanel insight={state.insight} />;
}
