import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpDown,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  PackageCheck,
  Search,
  Truck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import {
  deriveProductSignals,
  formatCurrency,
  formatNumber,
  searchDemoProducts,
} from "@/lib/demo-data";
import { getTargetProductById, type TargetProductRecord } from "@/lib/recommendations";

type InventoryPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    productId?: string;
    sort?: InventorySortKey;
    dir?: "asc" | "desc";
  }>;
};

type InventorySortKey = "product" | "stock" | "incoming" | "reorder" | "movement" | "risk";

const demoAirPodsProduct: TargetProductRecord = {
  productId: "DEMO-AIRPODS-PRO-2",
  url: "https://www.target.com/s?searchTerm=airpods+pro",
  title: "Apple AirPods Pro (2nd generation) with MagSafe Case (USB-C)",
  productDescription:
    "Apple AirPods Pro with active noise cancellation, transparency mode, spatial audio, and a MagSafe charging case. This fallback keeps the inventory side panel focused on AirPods when the seeded dataset is not available.",
  rating: "4.80",
  reviewsCount: 12543,
  initialPrice: "249.99",
  finalPrice: "189.99",
  currency: "USD",
  sellerName: "Target",
  breadcrumbs: ["Electronics", "Headphones", "Earbuds"],
  relatedCategories: ["Electronics", "Headphones", "Apple"],
  images: [],
  productSpecifications: {
    brand: "Apple",
    model: "AirPods Pro 2",
    connection: "Bluetooth",
  },
  shippingReturnsPolicy: "Shipping and returns depend on Target store availability.",
  amountOfStars: null,
  recommendations: [],
  findAlternative: [],
  summaryOfReviews:
    "Customers commonly cite noise cancellation, fit, and iPhone pairing as the main purchase drivers.",
  primaryCategory: "AirPods",
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const sortKey = isInventorySortKey(params.sort) ? params.sort : "risk";
  const sortDirection = params.dir === "asc" ? "asc" : "desc";
  const pageSize = 10;
  const [products, requestedProduct, airPodsProducts] = await Promise.all([
    searchDemoProducts(query, 120).catch(() => []),
    params.productId
      ? getTargetProductById(params.productId).catch(() => null)
      : Promise.resolve(null),
    searchDemoProducts("airpods", 8).catch(() => []),
  ]);
  const inventoryRows = products.map((product) => ({
    product,
    signals: deriveProductSignals(product),
  }));
  const sortedRows = [...inventoryRows].sort((left, right) =>
    compareInventoryRows(left, right, sortKey, sortDirection),
  );
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleRows = sortedRows.slice(startIndex, startIndex + pageSize);
  const displayStart = sortedRows.length === 0 ? 0 : startIndex + 1;
  const displayEnd = startIndex + visibleRows.length;
  const defaultAirPodsProduct =
    airPodsProducts.find(isAirPodsProduct) ??
    products.find(isAirPodsProduct) ??
    demoAirPodsProduct;
  const selectedProduct = requestedProduct ?? defaultAirPodsProduct;
  const selectedSignals = selectedProduct ? deriveProductSignals(selectedProduct) : null;
  const highRiskCount = inventoryRows.filter(
    ({ signals }) => signals.inventoryRisk === "high",
  ).length;
  const incomingTotal = inventoryRows.reduce(
    (total, { signals }) => total + signals.incomingUnits,
    0,
  );
  const onHandTotal = inventoryRows.reduce(
    (total, { signals }) => total + signals.stockOnHand,
    0,
  );

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          Inventory service
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Restock planning from seeded Target rows
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Prodact derives on-hand units, incoming stock, reorder points,
              sales velocity, and return risk from each seeded product. Sort the
              table like a spreadsheet to review the products that need action.
            </p>
          </div>
          <form className="flex w-full gap-2 lg:w-[360px]" action="/inventory">
            <label className="relative flex-1">
              <span className="sr-only">Search inventory</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--target-red)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--ring)]"
                defaultValue={query}
                name="q"
                placeholder="Search product stock"
              />
            </label>
            <button className="rounded-lg bg-[var(--target-red)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--target-red-dark)]">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          icon={Boxes}
          label="Tracked products"
          value={formatNumber(products.length)}
          detail="Current filtered rows"
        />
        <MetricCard
          icon={PackageCheck}
          label="On hand"
          value={formatNumber(onHandTotal)}
          detail="Derived units"
        />
        <MetricCard
          icon={Truck}
          label="Incoming"
          value={formatNumber(incomingTotal)}
          detail="Expected units"
        />
        <MetricCard
          icon={TriangleAlert}
          label="High risk"
          value={formatNumber(highRiskCount)}
          detail="Below reorder threshold"
          tone="alert"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                Product stock table
              </p>
              <h3 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                Restock candidates
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Showing {displayStart}-{displayEnd} of {products.length} filtered products
              </p>
            </div>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-[11px] font-medium text-[var(--muted-strong)]">
              Demo-derived
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-strong)]">
                <tr>
                  <SortableHeader
                    className="px-5 py-2.5"
                    query={query}
                    sortKey="product"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    Product
                  </SortableHeader>
                  <SortableHeader
                    className="px-3 py-2.5"
                    query={query}
                    sortKey="stock"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    On hand
                  </SortableHeader>
                  <SortableHeader
                    className="px-3 py-2.5"
                    query={query}
                    sortKey="incoming"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    Incoming
                  </SortableHeader>
                  <SortableHeader
                    className="px-3 py-2.5"
                    query={query}
                    sortKey="reorder"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    Reorder
                  </SortableHeader>
                  <SortableHeader
                    className="px-3 py-2.5"
                    query={query}
                    sortKey="movement"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    Movement
                  </SortableHeader>
                  <SortableHeader
                    className="px-3 py-2.5"
                    query={query}
                    sortKey="risk"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                  >
                    Risk
                  </SortableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {visibleRows.map(({ product, signals }) => {
                  const selected = product.productId === selectedProduct?.productId;

                  return (
                    <tr
                      key={product.productId}
                      className={selected ? "bg-[var(--target-red-soft)]" : undefined}
                    >
                      <td className="max-w-[24rem] px-5 py-3.5">
                        <Link
                          className="block hover:text-[var(--target-red)]"
                          href={buildInventoryHref({
                            query,
                            page: safePage,
                            sortKey,
                            sortDirection,
                            productId: product.productId,
                          })}
                        >
                          <span className="line-clamp-1 font-medium text-[var(--target-ink)]">
                            {product.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-[var(--muted)]">
                            {product.primaryCategory ?? "Uncategorized"} &middot;{" "}
                            {formatCurrency(product.finalPrice, product.currency)}
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3.5 text-[var(--target-ink)]">
                        {signals.stockOnHand} on hand
                      </td>
                      <td className="px-3 py-3.5 text-[var(--target-ink)]">
                        {signals.incomingUnits}
                      </td>
                      <td className="px-3 py-3.5 text-[var(--target-ink)]">
                        {signals.reorderPoint}
                      </td>
                      <td className="px-3 py-3.5 text-[var(--target-ink)]">
                        {signals.weeklySales} weekly
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={riskClassName(signals.inventoryRisk)}>
                            {signals.inventoryRisk}
                          </span>
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                            title={riskExplanation(
                              signals.inventoryRisk,
                              signals.stockOnHand,
                              signals.reorderPoint,
                              signals.weeklySales,
                            )}
                          >
                            <CircleHelp className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedRows.length > pageSize ? (
            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3 text-sm">
              {safePage > 1 ? (
                <Link
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 font-medium text-[var(--target-ink)] transition hover:bg-[var(--surface-subtle)]"
                  href={buildInventoryHref({
                    query,
                    page: safePage - 1,
                    sortKey,
                    sortDirection,
                  })}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 font-medium text-[var(--muted)] opacity-60">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </span>
              )}
              <span className="text-xs font-medium text-[var(--muted-strong)]">
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages ? (
                <Link
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 font-medium text-[var(--target-ink)] transition hover:bg-[var(--surface-subtle)]"
                  href={buildInventoryHref({
                    query,
                    page: safePage + 1,
                    sortKey,
                    sortDirection,
                  })}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1.5 font-medium text-[var(--muted)] opacity-60">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          {selectedProduct && selectedSignals ? (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
              <ProductPreview product={selectedProduct} />

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                Selected SKU
              </p>
              <h3 className="mt-1 text-base font-semibold text-[var(--target-ink)]">
                {selectedProduct.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {selectedProduct.primaryCategory ?? "Uncategorized"} &middot;{" "}
                <span className="font-mono">{selectedProduct.productId}</span>
              </p>

              <dl className="mt-5 space-y-1.5">
                <SignalRow label="Sales floor" value={`${selectedSignals.salesFloorUnits} units`} />
                <SignalRow label="Backroom" value={`${selectedSignals.backroomUnits} units`} />
                <SignalRow label="Reorder point" value={`${selectedSignals.reorderPoint} units`} />
                <SignalRow label="Return rate" value={`${selectedSignals.returnRate}%`} />
                <SignalRow label="Review volume" value={formatNumber(selectedProduct.reviewsCount)} />
              </dl>

              <div
                className={`mt-5 rounded-lg border p-3.5 ${
                  selectedSignals.inventoryRisk === "high"
                    ? "border-red-200 bg-[var(--target-red-soft)]"
                    : selectedSignals.inventoryRisk === "medium"
                      ? "border-amber-200 bg-amber-50"
                      : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--target-ink)]">
                  Restock action
                </p>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted-strong)]">
                  {selectedSignals.inventoryRisk === "high"
                    ? "Create a restock task before the next sales cycle. On-hand units are below the derived reorder threshold."
                    : selectedSignals.inventoryRisk === "medium"
                      ? "Monitor this SKU and confirm incoming shipment timing before placing a new order."
                      : "No immediate restock action required. Keep this item on the weekly inventory review."}
                </p>
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "alert";
};

function MetricCard({ icon: Icon, label, value, detail, tone = "default" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-md ${
            tone === "alert"
              ? "bg-[var(--target-red-soft)] text-[var(--target-red)]"
              : "bg-[var(--surface-subtle)] text-[var(--muted-strong)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{detail}</p>
    </div>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-semibold text-[var(--target-ink)]">{value}</dd>
    </div>
  );
}

function SortableHeader({
  children,
  className,
  query,
  sortKey,
  activeSortKey,
  direction,
}: {
  children: ReactNode;
  className: string;
  query: string;
  sortKey: InventorySortKey;
  activeSortKey: InventorySortKey;
  direction: "asc" | "desc";
}) {
  const isActive = sortKey === activeSortKey;
  const nextDirection = isActive && direction === "desc" ? "asc" : "desc";

  return (
    <th className={className}>
      <Link
        className="inline-flex items-center gap-1.5 transition hover:text-[var(--target-red)]"
        href={buildInventoryHref({
          query,
          page: 1,
          sortKey,
          sortDirection: nextDirection,
        })}
      >
        {children}
        <ArrowUpDown
          className={`h-3.5 w-3.5 ${
            isActive ? "text-[var(--target-red)]" : "text-[var(--muted)]"
          }`}
        />
      </Link>
    </th>
  );
}

function riskClassName(risk: "low" | "medium" | "high") {
  const base = "inline-flex w-fit rounded-md px-2 py-0.5 text-[11px] font-medium capitalize";

  if (risk === "high") {
    return `${base} bg-[var(--target-red-soft)] text-[var(--target-red)]`;
  }

  if (risk === "medium") {
    return `${base} bg-amber-50 text-amber-700`;
  }

  return `${base} bg-emerald-50 text-emerald-700`;
}

function riskExplanation(
  risk: "low" | "medium" | "high",
  stockOnHand: number,
  reorderPoint: number,
  weeklySales: number,
) {
  if (risk === "high") {
    return `High risk because ${stockOnHand} units are on hand, below 65% of the ${reorderPoint} reorder point. Weekly movement is ${weeklySales}.`;
  }

  if (risk === "medium") {
    return `Medium risk because ${stockOnHand} units are below the ${reorderPoint} reorder point, but not yet below the high-risk threshold. Weekly movement is ${weeklySales}.`;
  }

  return `Low risk because ${stockOnHand} units meet or exceed the ${reorderPoint} reorder point. Weekly movement is ${weeklySales}.`;
}

function compareInventoryRows(
  left: {
    product: Awaited<ReturnType<typeof searchDemoProducts>>[number];
    signals: ReturnType<typeof deriveProductSignals>;
  },
  right: {
    product: Awaited<ReturnType<typeof searchDemoProducts>>[number];
    signals: ReturnType<typeof deriveProductSignals>;
  },
  sortKey: InventorySortKey,
  direction: "asc" | "desc",
) {
  const multiplier = direction === "asc" ? 1 : -1;
  let result = 0;

  if (sortKey === "product") {
    result = left.product.title.localeCompare(right.product.title);
  } else if (sortKey === "stock") {
    result = left.signals.stockOnHand - right.signals.stockOnHand;
  } else if (sortKey === "incoming") {
    result = left.signals.incomingUnits - right.signals.incomingUnits;
  } else if (sortKey === "reorder") {
    result = left.signals.reorderPoint - right.signals.reorderPoint;
  } else if (sortKey === "movement") {
    result = left.signals.weeklySales - right.signals.weeklySales;
  } else {
    result =
      riskSortValue(left.signals.inventoryRisk) - riskSortValue(right.signals.inventoryRisk);
  }

  if (result === 0) {
    result = left.product.title.localeCompare(right.product.title);
  }

  return result * multiplier;
}

function riskSortValue(risk: "low" | "medium" | "high") {
  if (risk === "high") {
    return 3;
  }

  if (risk === "medium") {
    return 2;
  }

  return 1;
}

function isInventorySortKey(value: string | undefined): value is InventorySortKey {
  return (
    value === "product" ||
    value === "stock" ||
    value === "incoming" ||
    value === "reorder" ||
    value === "movement" ||
    value === "risk"
  );
}

function buildInventoryHref({
  query,
  page,
  sortKey,
  sortDirection,
  productId,
}: {
  query: string;
  page: number;
  sortKey: InventorySortKey;
  sortDirection: "asc" | "desc";
  productId?: string;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  if (sortKey !== "risk") {
    params.set("sort", sortKey);
  }

  if (sortDirection !== "desc") {
    params.set("dir", sortDirection);
  }

  if (productId) {
    params.set("productId", productId);
  }

  const queryString = params.toString();

  return queryString ? `/inventory?${queryString}` : "/inventory";
}

function isAirPodsProduct(product: TargetProductRecord) {
  return /airpods/i.test(product.title) || /airpods/i.test(product.primaryCategory ?? "");
}

function ProductPreview({ product }: { product: TargetProductRecord }) {
  if (isAirPodsProduct(product)) {
    return <AirPodsPreview />;
  }

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-4">
      <div className="mx-auto flex h-40 w-full max-w-[220px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="px-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Selected SKU
          </p>
          <p className="mt-2 line-clamp-3 text-sm font-semibold text-[var(--target-ink)]">
            {product.primaryCategory ?? "Inventory item"}
          </p>
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-medium text-[var(--muted-strong)]">
        Selected product preview
      </p>
    </div>
  );
}

function AirPodsPreview() {
  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[radial-gradient(circle_at_top,#ffffff_0%,#f6f7fb_46%,#eef0f5_100%)] px-5 py-4">
      <svg
        viewBox="0 0 420 240"
        className="mx-auto h-40 w-full max-w-[220px]"
        aria-label="AirPods product visual"
        role="img"
      >
        <defs>
          <radialGradient id="airpodShellSmall" cx="35%" cy="25%" r="85%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#f5f7fb" />
            <stop offset="100%" stopColor="#e4e8f1" />
          </radialGradient>
          <linearGradient id="airpodStemSmall" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#edf1f7" />
            <stop offset="100%" stopColor="#d8deea" />
          </linearGradient>
          <filter id="airpodShadowSmall" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="12"
              floodColor="#94a3b8"
              floodOpacity="0.22"
            />
          </filter>
        </defs>

        <g filter="url(#airpodShadowSmall)" transform="translate(60 18) scale(0.72)">
          <g transform="rotate(-17 110 120)">
            <path
              d="M48 93c0-43 31-76 69-76 36 0 64 30 64 68 0 31-17 56-41 67-12 6-20 14-20 30v114c0 18-13 32-30 32-16 0-29-14-29-32V170c0-14-7-24-18-33C26 127 48 116 48 93Z"
              fill="url(#airpodShellSmall)"
            />
            <ellipse cx="84" cy="95" rx="8" ry="8" fill="#3a3a3a" />
            <ellipse
              cx="132"
              cy="61"
              rx="16"
              ry="5"
              transform="rotate(-22 132 61)"
              fill="#4b4b4b"
            />
            <rect x="68" y="170" width="44" height="154" rx="22" fill="url(#airpodStemSmall)" />
          </g>

          <g transform="translate(122 0)">
            <path
              d="M52 60c0-45 33-79 73-79 39 0 69 32 69 72 0 39-27 68-60 73-19 3-31 12-31 29v132c0 18-13 32-30 32s-30-14-30-32V60Z"
              fill="url(#airpodShellSmall)"
            />
            <rect x="74" y="136" width="44" height="176" rx="22" fill="url(#airpodStemSmall)" />
            <ellipse cx="99" cy="82" rx="23" ry="31" fill="#242424" />
            <ellipse cx="99" cy="82" rx="16" ry="24" fill="#383838" />
            <ellipse cx="62" cy="84" rx="5" ry="8" fill="#3d3d3d" />
          </g>
        </g>
      </svg>
      <p className="text-center text-xs font-medium text-[var(--muted-strong)]">
        Product visual preview
      </p>
    </div>
  );
}
