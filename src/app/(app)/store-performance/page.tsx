import {
  ArrowUpRight,
  Clock3,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

import { deriveProductSignals, formatCurrency, formatNumber, listDemoProducts } from "@/lib/demo-data";

function buildMetricCards(products: Awaited<ReturnType<typeof listDemoProducts>>) {
  const revenue = products.reduce((total, product) => {
    const signals = deriveProductSignals(product);
    const price = Number.parseFloat(product.finalPrice ?? "0");
    return total + signals.weeklySales * (Number.isFinite(price) ? price : 0);
  }, 0);
  const customers = products.reduce(
    (total, product) => total + Math.round(deriveProductSignals(product).weeklySales * 0.72),
    0,
  );
  const returns = products.reduce(
    (total, product) =>
      total +
      Math.round(
        deriveProductSignals(product).weeklySales *
          (deriveProductSignals(product).returnRate / 100),
      ),
    0,
  );

  return [
    {
      title: "Total Sales",
      subtitle: "Derived weekly revenue",
      value: formatCurrency(revenue),
      detail: "Calculated from seeded price and sales velocity signals",
      icon: ShoppingBag,
      delta: "+12.4%",
      featured: true,
    },
    {
      title: "Customers",
      subtitle: "Demo traffic",
      value: formatNumber(customers),
      detail: "Estimated shoppers served by tracked products",
      icon: Users,
      delta: "+5.8%",
    },
    {
      title: "Refunds / loss",
      subtitle: "Storewide",
      value: formatNumber(returns),
      detail: "Derived from sales velocity and return-rate signals",
      icon: Clock3,
      delta: "-1.2%",
    },
  ];
}

const chartRows = [
  { sales: 54, traffic: 28, returns: 16 },
  { sales: 42, traffic: 35, returns: 22 },
  { sales: 37, traffic: 31, returns: 19 },
  { sales: 61, traffic: 49, returns: 33 },
  { sales: 47, traffic: 36, returns: 24 },
  { sales: 58, traffic: 52, returns: 34 },
  { sales: 44, traffic: 41, returns: 26 },
  { sales: 68, traffic: 56, returns: 38 },
];

const chartLabels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

function TrendChart() {
  const width = 620;
  const height = 260;
  const pad = 28;
  const step = (width - pad * 2) / (chartRows.length - 1);

  const line = (values: number[]) =>
    values
      .map((value, index) => {
        const x = pad + index * step;
        const y = height - pad - (value / 80) * (height - pad * 2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Sales performance chart"
    >
      {[0, 1, 2, 3, 4].map((row) => {
        const y = pad + row * ((height - pad * 2) / 4);

        return (
          <line
            key={row}
            x1={pad}
            y1={y}
            x2={width - pad}
            y2={y}
            stroke="rgba(15, 23, 42, 0.06)"
            strokeWidth="1"
          />
        );
      })}
      {chartLabels.map((label, index) => {
        const x = pad + index * step;
        return (
          <text
            key={label}
            x={x}
            y={height - 6}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(107, 114, 128, 1)"
          >
            {label}
          </text>
        );
      })}
      <path
        d={line(chartRows.map((row) => row.traffic))}
        fill="none"
        stroke="rgba(107, 114, 128, 0.55)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d={line(chartRows.map((row) => row.returns))}
        fill="none"
        stroke="rgba(245, 158, 11, 0.7)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d={line(chartRows.map((row) => row.sales))}
        fill="none"
        stroke="#cc0000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {chartRows.map((row, index) => {
        const x = pad + index * step;
        const y = height - pad - (row.sales / 80) * (height - pad * 2);

        return (
          <circle key={index} cx={x} cy={y} r="3.5" fill="white" stroke="#cc0000" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

export default async function StorePerformancePage() {
  const products = await listDemoProducts(24).catch(() => []);
  const metricCards = buildMetricCards(products);
  const topProducts = products
    .map((product) => ({ product, signals: deriveProductSignals(product) }))
    .sort((left, right) => right.signals.weeklySales - left.signals.weeklySales)
    .slice(0, 4);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          Store performance
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Target sales statistics
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Storewide revenue, traffic, and returns derived from seeded
              product signals. Toggle range and segment filters when the live
              POS feed comes online.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-1 text-xs font-medium text-[var(--muted-strong)]">
            {["7d", "30d", "Quarter", "YTD"].map((range, index) => (
              <button
                key={range}
                type="button"
                className={
                  index === 1
                    ? "rounded-md bg-[var(--surface)] px-3 py-1.5 text-[var(--target-ink)] shadow-[var(--shadow-sm)]"
                    : "rounded-md px-3 py-1.5 hover:text-[var(--target-ink)]"
                }
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.delta.startsWith("+");

          return (
            <article
              key={card.title}
              className={
                card.featured
                  ? "rounded-xl border border-[var(--target-ink)] bg-[var(--target-ink)] p-5 text-white"
                  : "rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={
                    card.featured
                      ? "flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white"
                      : "flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-subtle)] text-[var(--muted-strong)]"
                  }
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={
                    isPositive
                      ? card.featured
                        ? "inline-flex items-center gap-0.5 rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-200"
                        : "inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700"
                      : "inline-flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-700"
                  }
                >
                  <ArrowUpRight
                    className={`h-3 w-3 ${isPositive ? "" : "rotate-90"}`}
                  />
                  {card.delta}
                </span>
              </div>
              <div className="mt-5">
                <p
                  className={
                    card.featured
                      ? "text-xs uppercase tracking-[0.14em] text-white/60"
                      : "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]"
                  }
                >
                  {card.title}
                </p>
                <p
                  className={
                    card.featured
                      ? "mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight"
                      : "mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]"
                  }
                >
                  {card.value}
                </p>
                <p
                  className={
                    card.featured
                      ? "mt-2 text-xs leading-5 text-white/70"
                      : "mt-2 text-xs leading-5 text-[var(--muted)]"
                  }
                >
                  {card.detail}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                Trend
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                Sales performance
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--muted-strong)]">
              <LegendDot color="#cc0000" label="Sales" solid />
              <LegendDot color="rgba(107, 114, 128, 0.7)" label="Traffic" />
              <LegendDot color="rgba(245, 158, 11, 0.8)" label="Returns" />
            </div>
          </div>
          <div className="mt-4 h-[280px] rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <TrendChart />
          </div>
        </section>

        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--target-ink)]">Top products</h2>
            <span className="text-[11px] text-[var(--muted)]">This week</span>
          </div>
          <ol className="mt-4 space-y-3">
            {topProducts.map(({ product, signals }, index) => (
              <li key={product.productId} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface-subtle)] text-[11px] font-semibold text-[var(--muted-strong)]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--target-ink)]">
                    {product.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {signals.weeklySales} weekly units
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
                    <div
                      className="h-full rounded-full bg-[var(--target-red)]"
                      style={{
                        width: `${Math.min(100, (signals.weeklySales / Math.max(topProducts[0]?.signals.weeklySales ?? 1, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
            {topProducts.length === 0 ? (
              <li className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-3 text-xs text-[var(--muted)]">
                No products available — run the seed script to populate.
              </li>
            ) : null}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function LegendDot({ color, label, solid = false }: { color: string; label: string; solid?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-3 rounded-sm"
        style={{
          backgroundColor: solid ? color : "transparent",
          borderTop: solid ? undefined : `2px dashed ${color}`,
        }}
      />
      {label}
    </span>
  );
}
