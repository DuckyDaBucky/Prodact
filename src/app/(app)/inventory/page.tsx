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
    <section className="space-y-6">
      <div className="rounded-[1.9rem] border border-(--border) bg-(--card-strong) p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--target-red)">
          Inventory Service
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-(--target-ink)">
              Restock planning from seeded Target rows
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-(--muted)">
              The MVP derives on-hand units, incoming stock, reorder points, sales velocity, and
              return risk from each seeded product so the workflow is demoable without a live POS
              integration.
            </p>
          </div>
          <form className="flex w-full gap-2 lg:w-[360px]" action="/inventory">
            <label className="relative flex-1">
              <span className="sr-only">Search inventory</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
              <input
                className="w-full rounded-2xl border border-(--border) bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-(--target-red)"
                defaultValue={query}
                name="q"
                placeholder="Search product stock"
              />
            </label>
            <button className="rounded-2xl bg-(--target-red) px-4 py-3 text-sm font-semibold text-white">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[1.8rem] border border-(--border) bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
                Product stock table
              </p>
              <h3 className="mt-2 text-xl font-semibold text-(--target-ink)">
                Restock candidates
              </h3>
            </div>
            <span className="rounded-full bg-(--card) px-3 py-1 text-xs font-semibold text-(--muted)">
              Demo-derived
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-(--border)">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] bg-(--card) px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-(--muted)">
              <span>Product</span>
              <span>On hand</span>
              <span>Incoming</span>
              <span>Weekly sales</span>
              <span>Risk</span>
            </div>
            {products.map((product) => {
              const signals = deriveProductSignals(product);
              const selected = product.productId === selectedProduct?.productId;

              return (
                <Link
                  key={product.productId}
                  className={[
                    "grid grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr_0.7fr] border-t border-(--border) px-4 py-4 text-sm transition",
                    selected ? "bg-red-50/70" : "bg-white hover:bg-red-50/35",
                  ].join(" ")}
                  href={`/inventory?q=${encodeURIComponent(query)}&productId=${encodeURIComponent(
                    product.productId,
                  )}`}
                >
                  <span className="min-w-0">
                    <span className="line-clamp-1 font-semibold text-(--target-ink)">
                      {product.title}
                    </span>
                    <span className="mt-1 block text-xs text-(--muted)">
                      {product.primaryCategory ?? "Uncategorized"} -{" "}
                      {formatCurrency(product.finalPrice, product.currency)}
                    </span>
                  </span>
                  <span>{signals.stockOnHand}</span>
                  <span>{signals.incomingUnits}</span>
                  <span>{signals.weeklySales}</span>
                  <span className={riskClassName(signals.inventoryRisk)}>
                    {signals.inventoryRisk}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          {selectedProduct && selectedSignals ? (
            <section className="rounded-[1.8rem] border border-(--border) bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
                Selected SKU
              </p>
              <h3 className="mt-2 text-xl font-semibold text-(--target-ink)">
                {selectedProduct.title}
              </h3>
              <p className="mt-2 text-sm text-(--muted)">
                {selectedProduct.primaryCategory ?? "Uncategorized"}
              </p>

              <div className="mt-5 space-y-3">
                <SignalRow label="Sales floor" value={`${selectedSignals.salesFloorUnits} units`} />
                <SignalRow label="Backroom" value={`${selectedSignals.backroomUnits} units`} />
                <SignalRow label="Reorder point" value={`${selectedSignals.reorderPoint} units`} />
                <SignalRow label="Return rate" value={`${selectedSignals.returnRate}%`} />
                <SignalRow label="Review volume" value={formatNumber(selectedProduct.reviewsCount)} />
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-red-100 bg-red-50/50 p-4">
                <p className="text-sm font-semibold text-(--target-ink)">Restock action</p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  {selectedSignals.inventoryRisk === "high"
                    ? "Create a restock task before the next sales cycle. On-hand units are below the derived reorder threshold."
                    : selectedSignals.inventoryRisk === "medium"
                      ? "Monitor this SKU and confirm incoming shipment timing before placing a new order."
                      : "No immediate restock action is required, but keep the item visible in weekly inventory review."}
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
};

function MetricCard({ icon: Icon, label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[1.35rem] border border-(--border) bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-50 p-2 text-(--target-red)">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold text-(--target-ink)">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-(--muted)">{detail}</p>
    </div>
  );
}

function SignalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-(--border) bg-(--card) px-4 py-3 text-sm">
      <span className="text-(--muted)">{label}</span>
      <span className="font-semibold text-(--target-ink)">{value}</span>
    </div>
  );
}

function riskClassName(risk: "low" | "medium" | "high") {
  const base = "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold";

  if (risk === "high") {
    return `${base} bg-red-50 text-(--target-red)`;
  }

  if (risk === "medium") {
    return `${base} bg-amber-50 text-amber-700`;
  }

  return `${base} bg-emerald-50 text-emerald-700`;
}
