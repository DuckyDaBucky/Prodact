import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProductAiInsightLoader } from "@/components/product-ai-insight-loader";
import { ProductPicker } from "@/components/product-picker";
import {
  getFirstTargetProduct,
  getLatestRecommendationRun,
  listTargetProductsForPicker,
  recommendationService,
  type TargetProductRecord,
} from "@/lib/recommendations";

type ProductAnalysisPageProps = {
  searchParams: Promise<{
    productId?: string;
  }>;
};

const numberFormatter = new Intl.NumberFormat("en-US");
const timestampFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});
const currencyFormatters = new Map<string, Intl.NumberFormat>();

function formatCurrency(amount: string | null, currency: string | null) {
  if (!amount) {
    return "Unavailable";
  }

  const parsedAmount = Number.parseFloat(amount);

  if (!Number.isFinite(parsedAmount)) {
    return amount;
  }

  const normalizedCurrency = currency?.trim().toUpperCase();
  const currencyCode =
    !normalizedCurrency || normalizedCurrency === "$" || normalizedCurrency.length !== 3
      ? "USD"
      : normalizedCurrency;
  let formatter = currencyFormatters.get(currencyCode);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    });
    currencyFormatters.set(currencyCode, formatter);
  }

  return formatter.format(parsedAmount);
}

function formatNumber(value: number | null) {
  return numberFormatter.format(value ?? 0);
}

function formatTimestamp(value: Date) {
  return timestampFormatter.format(value);
}

function toNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateDiscountPercent(product: TargetProductRecord) {
  const initialPrice = toNumber(product.initialPrice);
  const finalPrice = toNumber(product.finalPrice);

  if (!initialPrice || !finalPrice || initialPrice <= finalPrice) {
    return null;
  }

  return Math.round(((initialPrice - finalPrice) / initialPrice) * 100);
}

function calculateCompleteness(product: TargetProductRecord) {
  const fields = [
    product.title,
    product.productDescription,
    product.rating,
    product.reviewsCount,
    product.finalPrice,
    product.primaryCategory,
    product.images[0],
    product.summaryOfReviews,
  ];
  const completeFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== "",
  ).length;

  return Math.round((completeFields / fields.length) * 100);
}

export default async function ProductAnalysisPage({
  searchParams,
}: ProductAnalysisPageProps) {
  const params = await searchParams;
  const [pickerProducts, fallbackProduct] = await Promise.all([
    listTargetProductsForPicker(1000),
    getFirstTargetProduct(),
  ]).catch(() => [[], null] as const);
  const requestedProductId = params.productId;
  const selectedProductId = requestedProductId ?? fallbackProduct?.productId;

  if (!fallbackProduct || !selectedProductId) {
    return <ProductSetupState />;
  }

  const recommendationResult = await recommendationService
    .recommend(selectedProductId, {
      limit: 5,
    })
    .catch(async () => {
      if (requestedProductId && requestedProductId !== fallbackProduct.productId) {
        return recommendationService.recommend(fallbackProduct.productId, {
          limit: 5,
        });
      }

      return null;
    });

  if (!recommendationResult) {
    return <ProductSetupState />;
  }

  const { sourceProduct, recommendations, provider, generatedAt } = recommendationResult;
  const latestRun = await getLatestRecommendationRun(sourceProduct.productId).catch(() => null);
  const discountPercent = calculateDiscountPercent(sourceProduct);
  const completeness = calculateCompleteness(sourceProduct);
  const strongMatches = recommendations.filter((recommendation) => recommendation.score >= 0.55);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          Product analysis
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
          AI Recommendation Service
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          Reads seeded Target rows from Postgres, ranks adjacent products with
          Gemini processing plus deterministic fallback scoring, and persists
          recommendation runs for repeatable demo evidence.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          {
            label: "Seeded products",
            value: formatNumber(pickerProducts.length),
            detail: "Loaded from target_product",
          },
          {
            label: "Data completeness",
            value: `${completeness}%`,
            detail: "Selected SKU fields",
          },
          {
            label: "Discount signal",
            value: discountPercent ? `${discountPercent}%` : "n/a",
            detail: "Initial vs current price",
          },
          {
            label: "Strong matches",
            value: formatNumber(strongMatches.length),
            detail: "Score at or above 55%",
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1.35fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <ProductPicker
              currentProductId={sourceProduct.productId}
              products={pickerProducts}
            />
          </div>

          <article className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Selected product
                </p>
                <h3 className="text-lg font-semibold text-[var(--target-ink)]">
                  {sourceProduct.title}
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  {sourceProduct.primaryCategory ?? "Uncategorized"} &middot;{" "}
                  <span className="font-mono">{sourceProduct.productId}</span>
                </p>
              </div>
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-sm font-semibold text-[var(--target-red)]">
                {formatCurrency(sourceProduct.finalPrice, sourceProduct.currency)}
              </div>
            </div>

            {sourceProduct.images[0] ? (
              <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={sourceProduct.title}
                  className="h-56 w-full object-cover"
                  src={sourceProduct.images[0]}
                />
              </div>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2">
              <MetricBlock
                label="Rating"
                value={`${sourceProduct.rating ?? "n/a"} / 5`}
                detail={`${formatNumber(sourceProduct.reviewsCount)} shopper reviews`}
              />
              <MetricBlock
                label="Seller"
                value={sourceProduct.sellerName ?? "Target marketplace"}
                detail={sourceProduct.productId}
              />
              <MetricBlock
                label="Current price"
                value={formatCurrency(sourceProduct.finalPrice, sourceProduct.currency)}
                detail={`Initial: ${formatCurrency(
                  sourceProduct.initialPrice,
                  sourceProduct.currency,
                )}`}
              />
              <MetricBlock
                label="Dataset hints"
                value={formatNumber(sourceProduct.recommendations.length)}
                detail={`${formatNumber(sourceProduct.findAlternative.length)} alternatives`}
              />
            </div>

            {sourceProduct.breadcrumbs.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                  Breadcrumbs
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sourceProduct.breadcrumbs.map((crumb) => (
                    <span
                      key={crumb}
                      className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 text-xs text-[var(--target-ink)]"
                    >
                      {crumb}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="text-sm leading-6 text-[var(--muted-strong)]">
              {sourceProduct.productDescription ??
                "No product description was included in the sample row."}
            </p>

            {sourceProduct.summaryOfReviews ? (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-3.5 text-sm leading-6 text-[var(--muted-strong)]">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                  Review summary
                </p>
                {sourceProduct.summaryOfReviews}
              </div>
            ) : null}

            <Link
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--target-red)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)]"
              href={sourceProduct.url}
              rel="noreferrer"
              target="_blank"
            >
              Open Target listing
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Ranked recommendations
                </p>
                <h3 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                  Top matches for the selected SKU
                </h3>
              </div>
              <div className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs text-[var(--muted-strong)]">
                {recommendations.length} results
              </div>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {recommendations.map((recommendation) => (
                <article
                  key={recommendation.product.productId}
                  className="px-5 py-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm font-semibold text-[var(--target-ink)]">
                        {recommendation.product.title}
                      </h4>
                      <p className="text-xs text-[var(--muted)]">
                        {recommendation.product.primaryCategory ?? "Uncategorized"}{" "}
                        &middot;{" "}
                        {formatCurrency(
                          recommendation.product.finalPrice,
                          recommendation.product.currency,
                        )}
                      </p>
                    </div>
                    <div className="lg:min-w-[160px]">
                      <div className="flex items-center justify-between text-xs font-semibold text-[var(--target-ink)]">
                        <span>Match score</span>
                        <span>{Math.round(recommendation.score * 100)}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
                        <div
                          className="h-full rounded-full bg-[var(--target-red)]"
                          style={{
                            width: `${Math.max(
                              8,
                              Math.round(recommendation.score * 100),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recommendation.reasons.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-md bg-[var(--surface-subtle)] px-2 py-0.5 text-[11px] text-[var(--muted-strong)]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </article>
              ))}

              {recommendations.length === 0 ? (
                <div className="m-5 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-5 text-sm text-[var(--muted)]">
                  The seeded row did not have enough comparable neighbors yet.
                  Try another product with richer category and rating data.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
              Service evidence
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted-strong)]">
              Generated with{" "}
              <span className="font-semibold text-[var(--target-ink)]">{provider}</span>{" "}
              using seeded Target product data. Gemini insight loads through the protected
              product insight API after the page is interactive. Current request computed{" "}
              {formatTimestamp(generatedAt)}.
              {latestRun ? ` Latest stored run: ${formatTimestamp(latestRun.createdAt)}.` : ""}
            </p>
          </div>

          <ProductAiInsightLoader productId={sourceProduct.productId} />
        </div>
      </div>
    </section>
  );
}

function ProductSetupState() {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
        Product analysis
      </p>
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
        Seed the Target sample data first
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
        This page becomes active after the Drizzle migrations are applied and
        the Web Scraper Service imports the Target product dataset.
      </p>
      <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-sm leading-6 text-[var(--muted-strong)]">
        Run{" "}
        <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">
          npm run db:migrate
        </code>{" "}
        and then{" "}
        <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-xs">
          npm run db:seed
        </code>
        , then refresh this route.
      </div>
    </section>
  );
}

type MetricBlockProps = {
  label: string;
  value: string;
  detail: string;
};

function MetricBlock({ label, value, detail }: MetricBlockProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--target-ink)]">{value}</p>
      <p className="text-xs text-[var(--muted)]">{detail}</p>
    </div>
  );
}
