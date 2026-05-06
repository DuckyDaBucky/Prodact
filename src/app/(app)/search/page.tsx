import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

import { ProductAiInsightLoader } from "@/components/product-ai-insight-loader";
import {
  deriveProductSignals,
  formatCurrency,
  formatNumber,
  searchDemoProducts,
} from "@/lib/demo-data";
import { getTargetProductById } from "@/lib/recommendations";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    productId?: string;
  }>;
};

export default async function ProductSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const productsPromise = searchDemoProducts(query, 36).catch(() => []);
  const requestedProductPromise = params.productId
    ? getTargetProductById(params.productId).catch(() => null)
    : Promise.resolve(null);
  const [products, requestedProduct] = await Promise.all([
    productsPromise,
    requestedProductPromise,
  ]);
  const selectedProduct =
    requestedProduct ?? products[0] ?? null;

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          Search
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Search seeded Target products
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Results come from the Drizzle <code className="rounded bg-[var(--surface-subtle)] px-1 py-0.5 text-xs">target_product</code> table.
              Selecting a product sends its seeded fields and derived signals
              through Gemini for live demo analysis.
            </p>
          </div>
          <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            Gemini-ready
          </span>
        </div>

        <form className="mt-5 flex flex-col gap-2 sm:flex-row" action="/search">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] py-2.5 pl-10 pr-3 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--ring)]"
              defaultValue={query}
              name="q"
              placeholder="Search by item, category, or product ID"
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--target-red)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--target-red-dark)]"
            type="submit"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                Dataset results
              </p>
              <h3 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                {products.length} seeded products found
              </h3>
            </div>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 font-mono text-[11px] text-[var(--muted-strong)]">
              target_product
            </span>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {products.map((product) => {
              const signals = deriveProductSignals(product);
              const isSelected = product.productId === selectedProduct?.productId;
              const riskClass = riskBadgeClass(signals.inventoryRisk);

              return (
                <Link
                  key={product.productId}
                  className={[
                    "block px-5 py-4 transition",
                    isSelected
                      ? "bg-[var(--target-red-soft)]"
                      : "hover:bg-[var(--surface-subtle)]",
                  ].join(" ")}
                  href={`/search?q=${encodeURIComponent(query)}&productId=${encodeURIComponent(
                    product.productId,
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-[var(--target-ink)]">
                        {product.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                        {product.primaryCategory ?? "Uncategorized"} &middot;{" "}
                        <span className="font-mono">{product.productId}</span>
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-semibold text-[var(--target-red)]">
                      {formatCurrency(product.finalPrice, product.currency)}
                    </span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                      {product.rating ?? "n/a"}
                    </span>
                    <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-0.5 text-[var(--muted-strong)]">
                      {formatNumber(product.reviewsCount)} reviews
                    </span>
                    <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-0.5 text-[var(--muted-strong)]">
                      {signals.stockOnHand} on hand
                    </span>
                    <span className={riskClass}>{signals.inventoryRisk} risk</span>
                  </div>
                </Link>
              );
            })}

            {products.length === 0 ? (
              <div className="m-5 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-5 text-sm text-[var(--muted)]">
                No seeded products matched that search. Run{" "}
                <code className="rounded bg-[var(--surface)] px-1 py-0.5 text-xs">
                  npm run db:seed
                </code>{" "}
                if the Target data has not been loaded yet.
              </div>
            ) : null}
          </div>
        </section>

        <div className="space-y-4">
          {selectedProduct ? (
            <>
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Selected result
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--target-ink)]">
                  {selectedProduct.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
                  {selectedProduct.productDescription ??
                    "This seeded row did not include a product description."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--target-red)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)]"
                    href={`/product-analysis?productId=${encodeURIComponent(
                      selectedProduct.productId,
                    )}`}
                  >
                    Open Product Analysis
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--target-ink)] transition hover:bg-[var(--surface-subtle)]"
                    href={selectedProduct.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open Target listing
                    <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
                  </Link>
                </div>
              </section>

              <ProductAiInsightLoader productId={selectedProduct.productId} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-6 text-sm leading-6 text-[var(--muted)]">
              Search for a seeded product to run Gemini-backed product analysis.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function riskBadgeClass(risk: "low" | "medium" | "high") {
  const base = "rounded-md px-2 py-0.5 font-medium capitalize";

  if (risk === "high") {
    return `${base} bg-[var(--target-red-soft)] text-[var(--target-red)]`;
  }

  if (risk === "medium") {
    return `${base} bg-amber-50 text-amber-700`;
  }

  return `${base} bg-emerald-50 text-emerald-700`;
}
