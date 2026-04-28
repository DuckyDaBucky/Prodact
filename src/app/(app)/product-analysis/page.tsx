import Link from "next/link";

import { ProductPicker } from "@/components/product-picker";
import {
  getFirstTargetProduct,
  listTargetProductsForPicker,
  recommendationService,
} from "@/lib/recommendations";

type ProductAnalysisPageProps = {
  searchParams: Promise<{
    productId?: string;
  }>;
};

function formatCurrency(amount: string | null, currency: string | null) {
  if (!amount) {
    return "Unavailable";
  }

  const parsedAmount = Number.parseFloat(amount);

  if (!Number.isFinite(parsedAmount)) {
    return amount;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
  }).format(parsedAmount);
}

function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function ProductAnalysisPage({
  searchParams,
}: ProductAnalysisPageProps) {
  const params = await searchParams;
  const pickerProducts = await listTargetProductsForPicker(1000);
  const fallbackProduct = await getFirstTargetProduct();
  const selectedProductId = params.productId ?? fallbackProduct?.productId;

  if (!fallbackProduct || !selectedProductId) {
    return (
      <section className="space-y-6 rounded-4xl border border-(--border) bg-(--card-strong) p-8 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--target-red)">
            Product Analysis
          </p>
          <h2 className="font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-(--target-ink)">
            Seed the Target sample data first
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-(--muted)">
            This page becomes active after the new Drizzle tables are migrated and populated with
            the Bright Data Target sample.
          </p>
        </div>
        <div className="rounded-[1.6rem] border border-dashed border-red-200 bg-red-50/60 p-6 text-sm leading-6 text-(--muted)">
          Run <code>npm run db:migrate</code> and then <code>npm run db:seed</code>, then refresh
          this route.
        </div>
      </section>
    );
  }

  const recommendationResult = await recommendationService.recommend(selectedProductId, {
    limit: 5,
  });
  const { sourceProduct, recommendations, provider, generatedAt } = recommendationResult;

  return (
    <section className="space-y-6 rounded-4xl border border-(--border) bg-(--card-strong) p-8 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--target-red)">
          Product Analysis
        </p>
        <div className="space-y-2">
          <h2 className="font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-(--target-ink)">
            AI Recommendation Service
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-(--muted)">
            This demo uses the seeded Target synthetic product sample to rank adjacent products by
            category similarity, price proximity, shopper ratings, and built-in recommendation
            hints from the dataset.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-(--border) bg-white p-6">
            <ProductPicker
              currentProductId={sourceProduct.productId}
              products={pickerProducts}
            />
          </div>

          <article className="space-y-5 rounded-[1.6rem] border border-(--border) bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--target-red)">
                  Selected product
                </p>
                <h3 className="text-xl font-semibold text-(--target-ink)">
                  {sourceProduct.title}
                </h3>
                <p className="text-sm text-(--muted)">
                  {sourceProduct.primaryCategory ?? "Uncategorized"}
                </p>
              </div>
              <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-(--target-red)">
                {formatCurrency(sourceProduct.finalPrice, sourceProduct.currency)}
              </div>
            </div>

            {sourceProduct.images[0] ? (
              <div className="overflow-hidden rounded-[1.4rem] border border-(--border) bg-red-50/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={sourceProduct.title}
                  className="h-56 w-full object-cover"
                  src={sourceProduct.images[0]}
                />
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-(--border) bg-(--card) p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">
                  Rating
                </p>
                <p className="mt-2 text-lg font-semibold text-(--target-ink)">
                  {sourceProduct.rating ?? "n/a"} / 5
                </p>
                <p className="text-sm text-(--muted)">
                  {sourceProduct.reviewsCount ?? 0} shopper reviews
                </p>
              </div>
              <div className="rounded-2xl border border-(--border) bg-(--card) p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">
                  Seller
                </p>
                <p className="mt-2 text-lg font-semibold text-(--target-ink)">
                  {sourceProduct.sellerName ?? "Target marketplace"}
                </p>
                <p className="text-sm text-(--muted)">{sourceProduct.productId}</p>
              </div>
            </div>

            {sourceProduct.breadcrumbs.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">
                  Breadcrumbs
                </p>
                <div className="flex flex-wrap gap-2">
                  {sourceProduct.breadcrumbs.map((crumb) => (
                    <span
                      key={crumb}
                      className="rounded-full border border-(--border) bg-(--card) px-3 py-1 text-xs text-(--target-ink)"
                    >
                      {crumb}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="text-sm leading-6 text-(--muted)">
              {sourceProduct.productDescription ?? "No product description was included in the sample row."}
            </div>

            <Link
              className="inline-flex rounded-full bg-(--target-red) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--target-red-dark)"
              href={sourceProduct.url}
              rel="noreferrer"
              target="_blank"
            >
              Open Target listing
            </Link>
          </article>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-(--border) bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--target-red)">
                  Ranked recommendations
                </p>
                <h3 className="mt-2 text-xl font-semibold text-(--target-ink)">
                  Top matches for the selected SKU
                </h3>
              </div>
              <div className="rounded-full border border-(--border) bg-(--card) px-4 py-2 text-sm text-(--target-ink)">
                {recommendations.length} results
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {recommendations.map((recommendation) => (
                <article
                  key={recommendation.product.productId}
                  className="rounded-[1.4rem] border border-(--border) bg-(--card) p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-(--target-ink)">
                        {recommendation.product.title}
                      </h4>
                      <p className="text-sm text-(--muted)">
                        {recommendation.product.primaryCategory ?? "Uncategorized"} ·{" "}
                        {formatCurrency(
                          recommendation.product.finalPrice,
                          recommendation.product.currency,
                        )}
                      </p>
                    </div>
                    <div className="min-w-32">
                      <div className="flex items-center justify-between text-sm font-semibold text-(--target-ink)">
                        <span>Match score</span>
                        <span>{Math.round(recommendation.score * 100)}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-red-100">
                        <div
                          className="h-full rounded-full bg-(--target-red)"
                          style={{ width: `${Math.max(8, Math.round(recommendation.score * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendation.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full border border-(--border) bg-white px-3 py-1 text-xs text-(--target-ink)"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </article>
              ))}

              {recommendations.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-red-200 bg-red-50/50 p-5 text-sm text-(--muted)">
                  The seeded row did not have enough comparable neighbors yet. Try another product
                  with richer category and rating data.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-dashed border-red-200 bg-red-50/50 p-6">
            <p className="text-sm font-semibold text-(--target-ink)">Why these?</p>
            <p className="mt-2 text-sm leading-6 text-(--muted)">
              Generated with <span className="font-semibold text-(--target-ink)">{provider}</span>{" "}
              using seeded Target sample data. Last computed {formatTimestamp(generatedAt)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
