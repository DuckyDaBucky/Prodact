import type { CSSProperties } from "react";

import {
  Bot,
  Boxes,
  ChartColumnIncreasing,
  CircleDollarSign,
  MessageSquareText,
  Sparkles,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

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

const surfaceGridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(75, 29, 29, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 29, 29, 0.06) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
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
    tagClassName: "bg-red-50 text-[var(--target-red)]",
    dotClassName: "bg-[var(--target-red)]",
    barClassName: "bg-[var(--target-red)]",
    summary:
      "Higher inventory consistency and stronger promo conversion are keeping core household baskets competitive.",
    graphs: ["Pricing graph", "Stock graph", "Sales graph"],
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
    tagClassName: "bg-stone-100 text-stone-700",
    dotClassName: "bg-stone-700",
    barClassName: "bg-stone-700",
    summary:
      "Aggressive opening-price posture is helping traffic, but stock interruptions are limiting conversion on multi-pack items.",
    graphs: ["Pricing graph", "Stock graph", "Sales graph"],
    metrics: [
      { label: "Price index", value: "94 / 100", score: 74 },
      { label: "In-stock rate", value: "85%", score: 85 },
      { label: "Sales growth", value: "+7.8%", score: 69 },
    ],
    note:
      "Risk signal: value perception remains strong, but the model flags availability gaps as the main reason Target is gaining share.",
  },
] as const;

export default function CompetitorAnalysisPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--card-strong)] px-6 py-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--target-red)]">
              <Sparkles className="h-3.5 w-3.5" />
              AI competitor analysis
            </span>
            <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Household essentials
            </span>
          </div>
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
              Target Corporation vs Walmart
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Pricing, stock, and sales benchmarks across high-volume weekly products.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <MetricPill
              icon={CircleDollarSign}
              label="Price gap"
              value="3.6%"
            />
            <MetricPill icon={TrendingUp} label="Share gain" value="+2.8 pts" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="space-y-6">
          {storeCards.map((card) => (
            <article
              key={card.name}
              className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${card.tagClassName}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${card.dotClassName}`}
                    />
                    {card.tag}
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                    {card.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {card.summary}
                  </p>
                </div>
                <Store className="h-6 w-6 shrink-0 text-[var(--muted)]" />
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Graph focus
                </p>
                <ul className="mt-3 space-y-2 text-base text-[var(--target-ink)]">
                  {card.graphs.map((graph) => (
                    <li key={graph} className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${card.dotClassName}`}
                      />
                      <span>{graph}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-white/80 p-4">
                <div className="space-y-4">
                  {card.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--target-ink)]">
                          {metric.label}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {metric.value}
                        </p>
                      </div>
                      <div className="h-2.5 rounded-full bg-stone-100">
                        <div
                          className={`h-full rounded-full ${card.barClassName}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[1.4rem] border border-red-100 bg-red-50/70 p-4">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--target-red)]">
                  <Bot className="h-3.5 w-3.5" />
                  AI note
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--target-ink)]">
                  {card.note}
                </p>
              </div>
            </article>
          ))}
        </aside>

        <div className="space-y-6">
          <article className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                  Pricing and stock
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Competitive pressure across core household SKUs
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  The top plot tracks relative price movement while the lower band shows in-stock stability. The AI callout surfaces the strongest operational difference between both retailers.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <LegendPill className="bg-red-50 text-[var(--target-red)]" label="Target price" />
                <LegendPill className="bg-stone-100 text-stone-700" label="Walmart price" />
                <LegendPill className="bg-red-100/70 text-[var(--target-red)]" label="Target stock" />
                <LegendPill className="bg-stone-200 text-stone-700" label="Walmart stock" />
              </div>
            </div>

            <div
              className="relative mt-6 overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white"
              style={surfaceGridStyle}
            >
              <svg
                viewBox="0 0 720 340"
                className="relative z-10 h-[360px] w-full"
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
                    stroke="rgba(75, 29, 29, 0.12)"
                    strokeDasharray="4 8"
                  />
                ))}

                <text x="24" y="58" fill="rgba(111, 98, 93, 1)" fontSize="12">
                  Price
                </text>
                <text x="18" y="234" fill="rgba(111, 98, 93, 1)" fontSize="12">
                  Stock
                </text>

                {comparisonPeriods.map((period, index) => {
                  const x = 68 + index * ((652 - 68) / (comparisonPeriods.length - 1));
                  const targetHeight =
                    24 +
                    ((stockSeries.target[index] - 80) / (96 - 80)) * 72;
                  const competitorHeight =
                    24 +
                    ((stockSeries.competitor[index] - 80) / (96 - 80)) * 72;

                  return (
                    <g key={period}>
                      <rect
                        x={x - 26}
                        y={294 - targetHeight}
                        width="16"
                        height={targetHeight}
                        rx="8"
                        fill="rgba(204, 0, 0, 0.18)"
                      />
                      <rect
                        x={x - 4}
                        y={294 - competitorHeight}
                        width="16"
                        height={competitorHeight}
                        rx="8"
                        fill="rgba(68, 64, 60, 0.18)"
                      />
                    </g>
                  );
                })}

                <path
                  d={toPath(pricePoints)}
                  fill="none"
                  stroke="rgba(204, 0, 0, 1)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPath(competitorPricePoints)}
                  fill="none"
                  stroke="rgba(68, 64, 60, 0.85)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {pricePoints.map((point, index) => (
                  <circle
                    key={`target-price-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    fill="white"
                    stroke="rgba(204, 0, 0, 1)"
                    strokeWidth="3"
                  />
                ))}
                {competitorPricePoints.map((point, index) => (
                  <circle
                    key={`competitor-price-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="4.5"
                    fill="white"
                    stroke="rgba(68, 64, 60, 0.85)"
                    strokeWidth="3"
                  />
                ))}
              </svg>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[260px] max-w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-5 py-4 text-center shadow-[0_24px_50px_rgba(35,24,21,0.12)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--target-red)]">
                  AI readout
                </p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Target holds the stronger availability edge.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Walmart is cheaper on opening-price items, but Target sustains a 9-point in-stock advantage across the tracked basket.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={Boxes} label="Tracked SKUs" value="248" />
              <SummaryCard icon={CircleDollarSign} label="Promo match candidates" value="3 items" />
              <SummaryCard icon={TrendingUp} label="Availability edge" value="+9 pts" />
            </div>
          </article>

          <article className="rounded-[1.9rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                  Sales and sentiment
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Sales momentum paired with customer perception
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  Grouped bars show relative unit velocity by month. Dashed lines trace review sentiment to show how conversion and customer feedback are moving together.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <LegendPill className="bg-red-50 text-[var(--target-red)]" label="Target sales" />
                <LegendPill className="bg-stone-100 text-stone-700" label="Walmart sales" />
                <LegendPill className="border border-red-200 bg-white text-[var(--target-red)]" label="Target sentiment" />
                <LegendPill className="border border-stone-300 bg-white text-stone-700" label="Walmart sentiment" />
              </div>
            </div>

            <div
              className="relative mt-6 overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white"
              style={surfaceGridStyle}
            >
              <svg
                viewBox="0 0 720 340"
                className="relative z-10 h-[360px] w-full"
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
                    stroke="rgba(75, 29, 29, 0.12)"
                    strokeDasharray="4 8"
                  />
                ))}

                <text x="18" y="58" fill="rgba(111, 98, 93, 1)" fontSize="12">
                  Rating
                </text>
                <text x="24" y="236" fill="rgba(111, 98, 93, 1)" fontSize="12">
                  Sales
                </text>

                {comparisonPeriods.map((period, index) => {
                  const x = 68 + index * ((652 - 68) / (comparisonPeriods.length - 1));
                  const targetHeight =
                    40 +
                    ((salesSeries.target[index] - 68) / (90 - 68)) * 96;
                  const competitorHeight =
                    34 +
                    ((salesSeries.competitor[index] - 68) / (90 - 68)) * 90;

                  return (
                    <g key={period}>
                      <rect
                        x={x - 28}
                        y={302 - targetHeight}
                        width="18"
                        height={targetHeight}
                        rx="9"
                        fill="rgba(204, 0, 0, 0.72)"
                      />
                      <rect
                        x={x - 4}
                        y={302 - competitorHeight}
                        width="18"
                        height={competitorHeight}
                        rx="9"
                        fill="rgba(68, 64, 60, 0.56)"
                      />
                    </g>
                  );
                })}

                <path
                  d={toPath(sentimentTargetPoints)}
                  fill="none"
                  stroke="rgba(204, 0, 0, 1)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={toPath(sentimentCompetitorPoints)}
                  fill="none"
                  stroke="rgba(68, 64, 60, 0.85)"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {sentimentTargetPoints.map((point, index) => (
                  <circle
                    key={`target-sentiment-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="white"
                    stroke="rgba(204, 0, 0, 1)"
                    strokeWidth="2.5"
                  />
                ))}
                {sentimentCompetitorPoints.map((point, index) => (
                  <circle
                    key={`competitor-sentiment-${comparisonPeriods[index]}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="white"
                    stroke="rgba(68, 64, 60, 0.85)"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[260px] max-w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-5 py-4 text-center shadow-[0_24px_50px_rgba(35,24,21,0.12)] backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--target-red)]">
                  AI readout
                </p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Target is gaining share without a sentiment drop.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Sales velocity keeps rising while ratings improve, which suggests pricing pressure is being absorbed by a better on-shelf experience.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={ChartColumnIncreasing} label="Sales delta" value="+12.4%" />
              <SummaryCard icon={MessageSquareText} label="Sentiment edge" value="+0.5 stars" />
              <SummaryCard icon={Sparkles} label="AI confidence" value="94%" />
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
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--target-ink)]">
      <Icon className="h-4 w-4 text-[var(--target-red)]" />
      <span className="font-semibold">{label}</span>
      <span className="text-[var(--muted)]">{value}</span>
    </div>
  );
}

type LegendPillProps = {
  className: string;
  label: string;
};

function LegendPill({ className, label }: LegendPillProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${className}`}>
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
    <div className="rounded-[1.35rem] border border-[var(--border)] bg-white px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-50 p-2 text-[var(--target-red)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--target-ink)]">
            {value}
          </p>
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
