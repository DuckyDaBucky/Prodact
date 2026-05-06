import { Clock3, ShoppingBag, Users } from "lucide-react";

import {
  deriveProductSignals,
  formatCurrency,
  formatNumber,
  listDemoProducts,
} from "@/lib/demo-data";

function buildMetricCards(products: Awaited<ReturnType<typeof listDemoProducts>>) {
  let revenue = 0;
  let customers = 0;
  let returns = 0;

  for (const product of products) {
    const signals = deriveProductSignals(product);
    const price = Number.parseFloat(product.finalPrice ?? "0");

    revenue += signals.weeklySales * (Number.isFinite(price) ? price : 0);
    customers += Math.round(signals.weeklySales * 0.72);
    returns += Math.round(signals.weeklySales * (signals.returnRate / 100));
  }

  return [
    {
      title: "Total Sales",
      subtitle: "Derived weekly revenue",
      value: formatCurrency(revenue),
      detail: "Calculated from seeded price and sales velocity signals",
      icon: ShoppingBag,
      featured: true,
    },
    {
      title: "Customers",
      subtitle: "Demo traffic",
      value: formatNumber(customers),
      detail: "Estimated shoppers served by tracked products",
      icon: Users,
    },
    {
      title: "Refunds / loss",
      subtitle: "Storewide",
      value: formatNumber(returns),
      detail: "Derived from sales velocity and return-rate signals",
      icon: Clock3,
    },
  ];
}

const chartRows = [
  { month: "Jan", lastYear: 54, thisYear: 61, competitor: 49 },
  { month: "Feb", lastYear: 42, thisYear: 58, competitor: 46 },
  { month: "Mar", lastYear: 37, thisYear: 63, competitor: 52 },
  { month: "Apr", lastYear: 61, thisYear: 72, competitor: 57 },
  { month: "May", lastYear: 47, thisYear: 68, competitor: 59 },
  { month: "Jun", lastYear: 58, thisYear: 77, competitor: 64 },
  { month: "Jul", lastYear: 44, thisYear: 73, competitor: 61 },
  { month: "Aug", lastYear: 68, thisYear: 84, competitor: 69 },
];
const chartMax = 90;
const yAxisTicks = [0, 30, 60, 90];

function TrendChart() {
  const width = 620;
  const height = 300;
  const padLeft = 64;
  const padRight = 28;
  const padTop = 28;
  const padBottom = 52;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;
  const step = chartWidth / (chartRows.length - 1);
  const getPoint = (value: number, index: number) => ({
    x: padLeft + index * step,
    y: padTop + chartHeight - (value / chartMax) * chartHeight,
  });

  const line = (values: number[]) =>
    values
      .map((value, index) => {
        const point = getPoint(value, index);
        return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Monthly money earned chart comparing last year, this year, and competitor sales"
    >
      <text
        x={width / 2}
        y={height - 8}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="rgba(107, 114, 128, 1)"
      >
        Months
      </text>
      <text
        x="14"
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90 14 ${height / 2})`}
        fontSize="11"
        fontWeight="600"
        fill="rgba(107, 114, 128, 1)"
      >
        Money earned ($K)
      </text>

      {yAxisTicks.map((tick) => {
        const y = padTop + chartHeight - (tick / chartMax) * chartHeight;

        return (
          <g key={tick}>
            <line
              x1={padLeft}
              y1={y}
              x2={width - padRight}
              y2={y}
              stroke="rgba(15, 23, 42, 0.06)"
              strokeWidth="1"
            />
            <text
              x={padLeft - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(107, 114, 128, 1)"
            >
              ${tick}K
            </text>
          </g>
        );
      })}
      <line
        x1={padLeft}
        y1={padTop + chartHeight}
        x2={width - padRight}
        y2={padTop + chartHeight}
        stroke="rgba(15, 23, 42, 0.16)"
      />
      <line
        x1={padLeft}
        y1={padTop}
        x2={padLeft}
        y2={padTop + chartHeight}
        stroke="rgba(15, 23, 42, 0.16)"
      />

      {chartRows.map((row, index) => {
        const x = padLeft + index * step;
        return (
          <text
            key={row.month}
            x={x}
            y={height - 31}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(107, 114, 128, 1)"
          >
            {row.month}
          </text>
        );
      })}
      <path
        d={line(chartRows.map((row) => row.lastYear))}
        fill="none"
        stroke="rgba(107, 114, 128, 0.75)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={line(chartRows.map((row) => row.competitor))}
        fill="none"
        stroke="rgba(245, 158, 11, 0.88)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
      <path
        d={line(chartRows.map((row) => row.thisYear))}
        fill="none"
        stroke="#cc0000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {chartRows.map((row, index) => {
        const point = getPoint(row.thisYear, index);

        return (
          <circle
            key={row.month}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill="white"
            stroke="#cc0000"
            strokeWidth="2"
          />
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
  const orderCount = products.reduce(
    (total, product) => total + deriveProductSignals(product).weeklySales,
    0,
  );
  const sidebarRows = [
    { label: "Products", value: formatNumber(products.length) },
    { label: "Orders", value: formatNumber(orderCount) },
    { label: "Customers", value: metricCards[1]?.value ?? "0" },
  ];

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

      <div className="grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 shadow-[var(--shadow-sm)]">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
            Store views
          </p>
          <div className="mt-2 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--target-ink)] shadow-[var(--shadow-sm)]">
            Overview
          </div>
          <div className="mt-3 space-y-1.5">
            {sidebarRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-[var(--muted-strong)]"
              >
                <span>{row.label}</span>
                <span className="font-semibold text-[var(--target-ink)]">{row.value}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                Trend
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                Monthly money earned
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--muted-strong)]">
              <LegendDot color="rgba(107, 114, 128, 0.75)" label="Last year" solid />
              <LegendDot color="#cc0000" label="This year" solid />
              <LegendDot color="rgba(245, 158, 11, 0.88)" label="Competitor sales" />
            </div>
          </div>
          <div className="mt-4 h-[320px] rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
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
                No products available - run the seed script to populate.
              </li>
            ) : null}
          </ol>
        </aside>
        </div>
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
