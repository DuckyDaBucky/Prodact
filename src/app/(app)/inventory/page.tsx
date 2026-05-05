import Link from "next/link";
import {
  Boxes,
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
import { getTargetProductById } from "@/lib/recommendations";

type InventoryPageProps = {
  searchParams: Promise<{
    q?: string;
    productId?: string;
  }>;
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const products = await searchDemoProducts(query, 24).catch(() => []);
  const selectedProduct =
    (params.productId ? await getTargetProductById(params.productId).catch(() => null) : null) ??
    products[0] ??
    null;
  const selectedSignals = selectedProduct ? deriveProductSignals(selectedProduct) : null;
  const highRiskCount = products.filter(
    (product) => deriveProductSignals(product).inventoryRisk === "high",
  ).length;
  const incomingTotal = products.reduce(
    (total, product) => total + deriveProductSignals(product).incomingUnits,
    0,
  );
  const onHandTotal = products.reduce(
    (total, product) => total + deriveProductSignals(product).stockOnHand,
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
              The MVP derives on-hand units, incoming stock, reorder points,
              sales velocity, and return risk from each seeded product so the
              workflow is demoable without a live POS integration.
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
            </div>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-[11px] font-medium text-[var(--muted-strong)]">
              Demo-derived
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] border-b border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-strong)]">
              <span>Product</span>
              <span>On hand</span>
              <span>Incoming</span>
              <span>Weekly sales</span>
              <span>Risk</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {products.map((product) => {
                const signals = deriveProductSignals(product);
                const selected = product.productId === selectedProduct?.productId;

                return (
                  <Link
                    key={product.productId}
                    className={[
                      "grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] items-center px-5 py-3.5 text-sm transition",
                      selected
                        ? "bg-[var(--target-red-soft)]"
                        : "hover:bg-[var(--surface-subtle)]",
                    ].join(" ")}
                    href={`/inventory?q=${encodeURIComponent(query)}&productId=${encodeURIComponent(
                      product.productId,
                    )}`}
                  >
                    <span className="min-w-0 pr-3">
                      <span className="line-clamp-1 font-medium text-[var(--target-ink)]">
                        {product.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">
                        {product.primaryCategory ?? "Uncategorized"} &middot;{" "}
                        {formatCurrency(product.finalPrice, product.currency)}
                      </span>
                    </span>
                    <span className="text-[var(--target-ink)]">{signals.stockOnHand}</span>
                    <span className="text-[var(--target-ink)]">{signals.incomingUnits}</span>
                    <span className="text-[var(--target-ink)]">{signals.weeklySales}</span>
                    <span>
                      <span className={riskClassName(signals.inventoryRisk)}>
                        {signals.inventoryRisk}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {selectedProduct && selectedSignals ? (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
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
