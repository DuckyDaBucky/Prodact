import {
  Bot,
  Boxes,
  ChartColumnIncreasing,
  CircleDollarSign,
  MessageSquareText,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { deriveProductSignals, formatNumber, listDemoProducts } from "@/lib/demo-data";

const comparisonPeriods = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const priceSeries = {
  target: [104, 102, 101, 99, 98, 97],
  competitor: [101, 100, 98, 96, 95, 94],
};

const stockSeries = {
  target: [91, 92, 90, 93, 95, 96],
  competitor: [84, 82, 80, 81, 83, 85],
};

const salesSeries = {
  target: [72, 75, 79, 82, 86, 90],
  competitor: [68, 69, 71, 73, 75, 77],
};

const sentimentSeries = {
  target: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7],
  competitor: [4.0, 4.0, 4.1, 4.1, 4.2, 4.2],
};

const pricePoints = getLinePoints({
  values: priceSeries.target,
  minValue: Math.min(...priceSeries.target, ...priceSeries.competitor),
  maxValue: Math.max(...priceSeries.target, ...priceSeries.competitor),
  left: 68,
  right: 652,
  top: 48,
  bottom: 172,
});

const competitorPricePoints = getLinePoints({
  values: priceSeries.competitor,
  minValue: Math.min(...priceSeries.target, ...priceSeries.competitor),
  maxValue: Math.max(...priceSeries.target, ...priceSeries.competitor),
  left: 68,
  right: 652,
  top: 48,
  bottom: 172,
});

const sentimentTargetPoints = getLinePoints({
  values: sentimentSeries.target,
  minValue: Math.min(...sentimentSeries.target, ...sentimentSeries.competitor),
  maxValue: Math.max(...sentimentSeries.target, ...sentimentSeries.competitor),
  left: 68,
  right: 652,
  top: 52,
  bottom: 156,
});

const sentimentCompetitorPoints = getLinePoints({
  values: sentimentSeries.competitor,
  minValue: Math.min(...sentimentSeries.target, ...sentimentSeries.competitor),
  maxValue: Math.max(...sentimentSeries.target, ...sentimentSeries.competitor),
  left: 68,
  right: 652,
  top: 52,
  bottom: 156,
});

const storeCards = [
  {
    name: "Target Corporation",
    tag: "Owned portfolio",
    accent: "var(--target-red)",
    summary:
      "Higher inventory consistency and stronger promo conversion are keeping core household baskets competitive.",
    metrics: [
      { label: "Price index", value: "97 / 100", score: 79 },
      { label: "In-stock rate", value: "96%", score: 96 },
      { label: "Sales growth", value: "+12.4%", score: 84 },
    ],
    note:
      "Recommendation: keep premium bundle pricing steady, but match Walmart on opening-price paper goods to defend entry baskets.",
  },
  {
    name: "Walmart",
    tag: "Benchmark store",
    accent: "#3a3f4a",
    summary:
      "Aggressive opening-price posture is helping traffic, but stock interruptions are limiting conversion on multi-pack items.",
    metrics: [
      { label: "Price index", value: "94 / 100", score: 74 },
      { label: "In-stock rate", value: "85%", score: 85 },
      { label: "Sales growth", value: "+7.8%", score: 69 },
    ],
    note:
      "Risk signal: value perception remains strong, but the model flags availability gaps as the main reason Target is gaining share.",
  },
] as const;

export default async function CompetitorAnalysisPage() {
  const products = await listDemoProducts(80).catch(() => []);
  const signals = products.map((product) => deriveProductSignals(product));
  const averagePriceGap =
    signals.length > 0
      ? Math.round(
          signals.reduce((total, signal) => total + Math.abs(signal.priceGapPercent ?? 0), 0) /
            signals.length,
        )
      : 0;
  const availabilityEdge = Math.max(
    1,
    Math.round(
      signals.reduce((total, signal) => total + (signal.inventoryRisk === "low" ? 1 : -0.25), 0),
    ),
  );
  const averageRating =
    products.length > 0
      ? products.reduce((total, product) => total + Number.parseFloat(product.rating ?? "0"), 0) /
        products.length
      : 0;
  const categoryLabel = products[0]?.primaryCategory ?? "Household essentials";

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--target-red-soft)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--target-red)]">
              AI competitor analysis
            </span>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted-strong)]">
              {categoryLabel}
            </span>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Target Corporation vs Walmart
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Pricing, stock, and sales benchmarks across high-volume weekly
              products.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetricPill
              icon={CircleDollarSign}
              label="Price gap"
              value={`${averagePriceGap}%`}
            />
            <MetricPill
              icon={TrendingUp}
              label="Rows compared"
              value={formatNumber(products.length)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="space-y-4">
          {storeCards.map((card) => (
            <article
              key={card.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em]"
                    style={{
                      backgroundColor: card.accent === "var(--target-red)" ? "var(--target-red-soft)" : "rgba(58, 63, 74, 0.08)",
                      color: card.accent,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: card.accent }}
                    />
                    {card.tag}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                    {card.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
                    {card.summary}
                  </p>
                </div>
                <Store className="h-5 w-5 shrink-0 text-[var(--muted)]" />
              </div>

              <div className="mt-4 space-y-3">
                {card.metrics.map((metric) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-[var(--target-ink)]">
                        {metric.label}
                      </p>
                      <p className="text-xs font-semibold text-[var(--target-ink)]">
                        {metric.value}
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--surface-subtle)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${metric.score}%`,
                          backgroundColor: card.accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--target-red)]">
                  <Bot className="h-3 w-3" />
                  AI note
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--muted-strong)]">
                  {card.note}
                </p>
              </div>
            </article>
          ))}
        </aside>

        <div className="space-y-4">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Pricing and stock
                </p>
                <h3 className="mt-0.5 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                  Competitive pressure across core household SKUs
                </h3>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  Top plot tracks relative price movement; bottom band shows
                  in-stock stability.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <LegendPill swatch="var(--target-red)" label="Target price" />
                <LegendPill swatch="#3a3f4a" label="Walmart price" />
                <LegendPill swatch="var(--target-red)" outline label="Target stock" />
                <LegendPill swatch="#3a3f4a" outline label="Walmart stock" />
              </div>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <svg
                viewBox="0 0 720 340"
                className="h-[340px] w-full"
                aria-label="Price and stock comparison chart"
                role="img"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <line
                    key={`price-grid-${index}`}
                    x1="68"
                    x2="652"
                    y1={52 + index * 56}
                    y2={52 + index * 56}
                    stroke="rgba(15, 23, 42, 0.06)"
                  />
                ))}

                <text x="24" y="58" fill="rgba(107, 114, 128, 1)" fontSize="11">
                  Price
                </text>
                <text x="18" y="234" fill="rgba(107, 114, 128, 1)" fontSize="11">
                  Stock
                </text>

                {comparisonPeriods.map((period, index) => {
                  const x = 68 + index * ((652 - 68) / (comparisonPeriods.length - 1));
                  const targetHeight =
                    24 + ((stockSeries.target[index] - 80) / (96 - 80)) * 72;
                  const competitorHeight =
                    24 + ((stockSeries.competitor[index] - 80) / (96 - 80)) * 72;

                  return (
                    <g key={period}>
                      <rect
                        x={x - 26}
                        y={294 - targetHeight}
                        width="14"
                        height={targetHeight}
                        rx="4"
                        fill="rgba(204, 0, 0, 0.7)"
                      />
                      <rect
                        x={x - 4}
                        y={294 - competitorHeight}
                        width="14"
                        height={competitorHeight}
                        rx="4"
                        fill="rgba(58, 63, 74, 0.55)"
                      />
                      <text
                        x={x}
                        y="312"
                        textAnchor="middle"
                        fill="rgba(107, 114, 128, 1)"
                        fontSize="10"
                      >
                        {period}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={toPath(pricePoints)}
                  fill="none"
                  stroke="#cc0000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPath(competitorPricePoints)}
                  fill="none"
                  stroke="#3a3f4a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {pricePoints.map((point, index) => (
                  <circle
                    key={`target-price-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    fill="white"
                    stroke="#cc0000"
                    strokeWidth="2"
                  />
                ))}
                {competitorPricePoints.map((point, index) => (
                  <circle
                    key={`competitor-price-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    fill="white"
                    stroke="#3a3f4a"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--target-red-soft)] p-4">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                AI readout
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--target-ink)]">
                Target holds the stronger availability edge.
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-strong)]">
                Walmart is cheaper on opening-price items, but Target sustains a
                9-point in-stock advantage across the tracked basket.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={Boxes} label="Tracked SKUs" value={formatNumber(products.length)} />
              <SummaryCard icon={CircleDollarSign} label="Promo match candidates" value="3 items" />
              <SummaryCard icon={TrendingUp} label="Availability edge" value={`+${availabilityEdge} pts`} />
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Sales and sentiment
                </p>
                <h3 className="mt-0.5 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                  Sales momentum paired with customer perception
                </h3>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  Bars compare unit velocity by month; dashed lines trace review
                  sentiment.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <LegendPill swatch="var(--target-red)" label="Target sales" />
                <LegendPill swatch="#3a3f4a" label="Walmart sales" />
                <LegendPill swatch="var(--target-red)" dashed label="Target sentiment" />
                <LegendPill swatch="#3a3f4a" dashed label="Walmart sentiment" />
              </div>
            </div>

            <div className="relative mt-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
              <svg
                viewBox="0 0 720 340"
                className="h-[340px] w-full"
                aria-label="Sales and sentiment comparison chart"
                role="img"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <line
                    key={`sales-grid-${index}`}
                    x1="68"
                    x2="652"
                    y1={56 + index * 54}
                    y2={56 + index * 54}
                    stroke="rgba(15, 23, 42, 0.06)"
                  />
                ))}

                <text x="18" y="58" fill="rgba(107, 114, 128, 1)" fontSize="11">
                  Rating
                </text>
                <text x="24" y="236" fill="rgba(107, 114, 128, 1)" fontSize="11">
                  Sales
                </text>

                {comparisonPeriods.map((period, index) => {
                  const x = 68 + index * ((652 - 68) / (comparisonPeriods.length - 1));
                  const targetHeight =
                    40 + ((salesSeries.target[index] - 68) / (90 - 68)) * 96;
                  const competitorHeight =
                    34 + ((salesSeries.competitor[index] - 68) / (90 - 68)) * 90;

                  return (
                    <g key={period}>
                      <rect
                        x={x - 28}
                        y={302 - targetHeight}
                        width="16"
                        height={targetHeight}
                        rx="4"
                        fill="rgba(204, 0, 0, 0.85)"
                      />
                      <rect
                        x={x - 4}
                        y={302 - competitorHeight}
                        width="16"
                        height={competitorHeight}
                        rx="4"
                        fill="rgba(58, 63, 74, 0.7)"
                      />
                      <text
                        x={x}
                        y="318"
                        textAnchor="middle"
                        fill="rgba(107, 114, 128, 1)"
                        fontSize="10"
                      >
                        {period}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={toPath(sentimentTargetPoints)}
                  fill="none"
                  stroke="#cc0000"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPath(sentimentCompetitorPoints)}
                  fill="none"
                  stroke="#3a3f4a"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {sentimentTargetPoints.map((point, index) => (
                  <circle
                    key={`target-sentiment-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="white"
                    stroke="#cc0000"
                    strokeWidth="2"
                  />
                ))}
                {sentimentCompetitorPoints.map((point, index) => (
                  <circle
                    key={`competitor-sentiment-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="white"
                    stroke="#3a3f4a"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--target-red-soft)] p-4">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                AI readout
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[var(--target-ink)]">
                Target is gaining share without a sentiment drop.
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-strong)]">
                Sales velocity keeps rising while ratings improve, suggesting
                pricing pressure is being absorbed by a better on-shelf
                experience.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={ChartColumnIncreasing} label="Sales delta" value="+12.4%" />
              <SummaryCard
                icon={MessageSquareText}
                label="Sentiment edge"
                value={`+${Math.max(0.1, averageRating - 4).toFixed(1)} stars`}
              />
              <SummaryCard icon={ChartColumnIncreasing} label="AI confidence" value="94%" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

type MetricPillProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function MetricPill({ icon: Icon, label, value }: MetricPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5 text-xs">
      <Icon className="h-3.5 w-3.5 text-[var(--target-red)]" />
      <span className="font-semibold text-[var(--target-ink)]">{label}</span>
      <span className="text-[var(--muted-strong)]">{value}</span>
    </div>
  );
}

type LegendPillProps = {
  swatch: string;
  label: string;
  outline?: boolean;
  dashed?: boolean;
};

function LegendPill({ swatch, label, outline, dashed }: LegendPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-medium text-[var(--muted-strong)]">
      <span
        className="h-1.5 w-3 rounded-sm"
        style={{
          backgroundColor: outline || dashed ? "transparent" : swatch,
          border: outline ? `1.5px solid ${swatch}` : undefined,
          borderTop: dashed ? `2px dashed ${swatch}` : undefined,
        }}
      />
      {label}
    </span>
  );
}

type SummaryCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--target-red)]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
            {label}
          </p>
          <p className="text-base font-semibold text-[var(--target-ink)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

type Point = {
  x: number;
  y: number;
};

type GetLinePointsArgs = {
  values: number[];
  minValue: number;
  maxValue: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

function getLinePoints({
  values,
  minValue,
  maxValue,
  left,
  right,
  top,
  bottom,
}: GetLinePointsArgs) {
  const horizontalStep = (right - left) / Math.max(values.length - 1, 1);
  const verticalSpan = Math.max(maxValue - minValue, 1);

  return values.map((value, index) => {
    const x = left + horizontalStep * index;
    const y =
      bottom - ((value - minValue) / verticalSpan) * (bottom - top);

    return { x, y };
  });
}

function toPath(points: Point[]) {
  return points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");
}
