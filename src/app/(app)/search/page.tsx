import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

import { ProductAiInsightPanel } from "@/components/product-ai-insight";
import {
  deriveProductSignals,
  formatCurrency,
  formatNumber,
  searchDemoProducts,
} from "@/lib/demo-data";
import { generateProductAiInsight } from "@/lib/gemini";
import { getTargetProductById, recommendationService } from "@/lib/recommendations";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    productId?: string;
  }>;
};

export default async function ProductSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const products = await searchDemoProducts(query, 36).catch(() => []);
  const selectedProduct =
    (params.productId ? await getTargetProductById(params.productId).catch(() => null) : null) ??
    products[0] ??
    null;
  const recommendationResult = selectedProduct
    ? await recommendationService
        .recommend(selectedProduct.productId, { limit: 5, persist: false })
        .catch(() => null)
    : null;
  const insight = selectedProduct
    ? await generateProductAiInsight(
        selectedProduct,
        recommendationResult?.recommendations ?? [],
      )
    : null;

  return (
    <section className="space-y-6">
      <div className="rounded-[1.9rem] border border-(--border) bg-(--card-strong) p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--target-red)">
          Search
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-(--target-ink)">
              Search seeded Target products
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-(--muted)">
              Results come from the Drizzle `target_product` table. Selecting a product sends its
              seeded fields and derived signals through Gemini for live demo analysis.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-(--target-red)">
            <Sparkles className="h-4 w-4" />
            Gemini-ready
          </span>
        </div>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row" action="/search">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
            <input
              className="w-full rounded-2xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm text-(--target-ink) outline-none transition focus:border-(--target-red)"
              defaultValue={query}
              name="q"
              placeholder="Search by item, category, or product ID"
            />
          </label>
          <button
            className="rounded-2xl bg-(--target-red) px-6 py-3 text-sm font-semibold text-white transition hover:bg-(--target-red-dark)"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-[1.8rem] border border-(--border) bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
                Dataset results
              </p>
              <h3 className="mt-2 text-xl font-semibold text-(--target-ink)">
                {products.length} seeded products found
              </h3>
            </div>
            <span className="rounded-full bg-(--card) px-3 py-1 text-xs font-semibold text-(--muted)">
              target_product
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {products.map((product) => {
              const signals = deriveProductSignals(product);
              const isSelected = product.productId === selectedProduct?.productId;

              return (
                <Link
                  key={product.productId}
                  className={[
                    "block rounded-[1.25rem] border p-4 transition",
                    isSelected
                      ? "border-red-200 bg-red-50/60"
                      : "border-(--border) bg-(--card) hover:border-red-200 hover:bg-red-50/35",
                  ].join(" ")}
                  href={`/search?q=${encodeURIComponent(query)}&productId=${encodeURIComponent(
                    product.productId,
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold text-(--target-ink)">
                        {product.title}
                      </p>
                      <p className="mt-1 text-xs text-(--muted)">
                        {product.primaryCategory ?? "Uncategorized"} - {product.productId}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--target-red)">
                      {formatCurrency(product.finalPrice, product.currency)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-(--muted)">
                    <span>{product.rating ?? "n/a"} stars</span>
                    <span>{formatNumber(product.reviewsCount)} reviews</span>
                    <span>{signals.stockOnHand} on hand</span>
                    <span>{signals.inventoryRisk} restock risk</span>
                  </div>
                </Link>
              );
            })}

            {products.length === 0 ? (
              <div className="rounded-[1.25rem] border border-dashed border-red-200 bg-red-50/50 p-5 text-sm text-(--muted)">
                No seeded products matched that search. Run `npm run db:seed` if the Target data
                has not been loaded yet.
              </div>
            ) : null}
          </div>
        </section>

        <div className="space-y-5">
          {selectedProduct && insight ? (
            <>
              <section className="rounded-[1.8rem] border border-(--border) bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
                  Selected result
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--target-ink)">
                  {selectedProduct.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  {selectedProduct.productDescription ??
                    "This seeded row did not include a product description."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    className="rounded-full bg-(--target-red) px-4 py-2 text-sm font-semibold text-white"
                    href={`/product-analysis?productId=${encodeURIComponent(
                      selectedProduct.productId,
                    )}`}
                  >
                    Open Product Analysis
                  </Link>
                  <Link
                    className="rounded-full border border-(--border) bg-white px-4 py-2 text-sm font-semibold text-(--target-ink)"
                    href={selectedProduct.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open Target listing
                  </Link>
                </div>
              </section>

              <ProductAiInsightPanel insight={insight} />
            </>
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-red-200 bg-red-50/50 p-6 text-sm leading-6 text-(--muted)">
              Search for a seeded product to run Gemini-backed product analysis.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
