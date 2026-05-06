import {
  ArrowUpRight,
  Bot,
  ChartColumnIncreasing,
  CircleDollarSign,
  Database,
  type LucideIcon,
  Search,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/components/cn";
import { deriveNotifications, listDemoProducts } from "@/lib/demo-data";
import { requireSession } from "@/lib/session";

const salesData = [4.1, 4.8, 5.2, 5.9, 6.4, 7.1, 7.6];
const salesLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const budgetSegments = [
  { label: "Inventory", value: 42, color: "#cc0000" },
  { label: "Pricing", value: 24, color: "#f06b6b" },
  { label: "Promotions", value: 19, color: "#fbb4b4" },
  { label: "Ops reserve", value: 15, color: "#3a3f4a" },
];
const salesMin = Math.min(...salesData);
const salesMax = Math.max(...salesData);

const quickCards = [
  {
    label: "Recent change",
    value: "+4.8%",
    detail: "Household essentials sales climbed versus last week.",
    delta: "up",
    tone: "accent",
  },
  {
    label: "Sales forecast",
    value: "$12.4M",
    detail: "Projected seven-day revenue across tracked Target categories.",
    delta: "up",
    tone: "neutral",
  },
  {
    label: "Items needing review",
    value: "4",
    detail: "Pricing gaps and alerts need attention before tomorrow morning.",
    delta: "flat",
    tone: "neutral",
  },
] as const;

function buildServiceCards(productCount: number, notificationCount: number, geminiReady: boolean) {
  return [
    {
      title: "Web Scraper",
      status: productCount > 0 ? `${productCount} Target rows loaded` : "Seed data pending",
      detail:
        "Downloads, parses, normalizes, and upserts the Target product dataset through npm run db:seed.",
      evidence: "scripts/seed-target-products.ts",
      icon: Search,
    },
    {
      title: "Database",
      status: "Drizzle + Neon wired",
      detail: `Stores employee auth records, Target product rows, direct messages, recommendation runs, and ${notificationCount} derived alerts.`,
      evidence: "target_product + recommendation_run",
      icon: Database,
    },
    {
      title: "Authentication",
      status: "Employee sessions protected",
      detail:
        "Better Auth validates employee IDs and protects every internal page through the shared app layout.",
      evidence: "/login + /internal-signup",
      icon: ShieldCheck,
    },
    {
      title: "AI Recommendation",
      status: geminiReady ? "Gemini provider configured" : "Fallback provider active",
      detail:
        "Processes selected products with Gemini when configured, then falls back to explainable heuristic scoring if needed.",
      evidence: "/search + /product-analysis",
      icon: Bot,
    },
  ] as const;
}

export default async function DashboardPage() {
  const [session, products] = await Promise.all([
    requireSession(),
    listDemoProducts(120).catch(() => []),
  ]);
  const notifications = deriveNotifications(products);
  const geminiReady = Boolean(process.env.GEMINI_API_KEY?.trim());
  const serviceCards = buildServiceCards(products.length, notifications.length, geminiReady);
  const salesPath = buildLinePath(salesData, 56, 472, 210, 44);

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-base font-semibold tracking-tight text-[var(--target-ink)]">
              Prodact
            </p>
            <p className="text-xs text-[var(--muted)]">
              Target internal intelligence dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            All services healthy
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
              Dashboard
            </p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Welcome back, {session.user.employeeId}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-strong)]">
                  Your Target workspace is ready with updated pricing signals,
                  forecast movement, and budget distribution across the week.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Today&rsquo;s AI focus
                </p>
                <p className="mt-1 text-sm text-[var(--target-ink)]">
                  Value baskets are outperforming forecast in the Midwest region.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {quickCards.map((card) => (
              <QuickCard
                key={card.label}
                label={card.label}
                value={card.value}
                detail={card.detail}
                delta={card.delta}
                tone={card.tone}
              />
            ))}
          </div>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  PA4 MVP services
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                  Backend slices ready for demo
                </h3>
              </div>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
                These cards map the implemented codebase to the assigned Web
                Scraper, Database, Authentication, and AI Recommendation
                services.
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {serviceCards.map((card) => (
                <ServiceCard
                  key={card.title}
                  title={card.title}
                  status={card.status}
                  detail={card.detail}
                  evidence={card.evidence}
                  icon={card.icon}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                    Weekly sales
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                    Weekly sales momentum
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Revenue forecast accelerating into the weekend, led by household
                    and pantry staples.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                    <ArrowUpRight className="h-3 w-3" />
                    +12.4%
                  </span>
                  <div className="rounded-md bg-[var(--target-red-soft)] p-2 text-[var(--target-red)]">
                    <ChartColumnIncreasing className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
                <svg
                  viewBox="0 0 520 280"
                  className="h-[280px] w-full"
                  role="img"
                  aria-label="Sales line chart"
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <line
                      key={`h-${index}`}
                      x1="56"
                      x2="472"
                      y1={56 + index * 40}
                      y2={56 + index * 40}
                      stroke="rgba(15, 23, 42, 0.06)"
                    />
                  ))}

                  {salesLabels.map((label, index) => {
                    const x = 56 + index * ((472 - 56) / (salesLabels.length - 1));

                    return (
                      <text
                        key={label}
                        x={x}
                        y="252"
                        textAnchor="middle"
                        fill="rgba(107, 114, 128, 1)"
                        fontSize="11"
                      >
                        {label}
                      </text>
                    );
                  })}

                  <path
                    d={`${salesPath} L 472 210 L 56 210 Z`}
                    fill="rgba(204, 0, 0, 0.08)"
                  />
                  <path
                    d={salesPath}
                    fill="none"
                    stroke="rgba(204, 0, 0, 1)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {salesData.map((point, index) => {
                    const x = 56 + index * ((472 - 56) / (salesData.length - 1));
                    const y = mapValue(point, salesMin, salesMax, 210, 44);

                    return (
                      <circle
                        key={`${salesLabels[index]}-${point}`}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="white"
                        stroke="rgba(204, 0, 0, 1)"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
                <MiniStat label="Peak day" value="Sunday" sub="$2.1M" />
                <MiniStat label="Avg / day" value="$1.78M" sub="up 6.1%" />
                <MiniStat label="Forecast" value="$12.4M" sub="next 7 days" />
              </div>
            </article>

            <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                    Budget mix
                  </p>
                  <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                    Budget allocation
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Inventory and pricing remain the two biggest investment areas
                    for this week&rsquo;s product planning cycle.
                  </p>
                </div>
                <div className="rounded-md bg-[var(--target-red-soft)] p-2 text-[var(--target-red)]">
                  <CircleDollarSign className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
                <div className="mx-auto w-full max-w-[280px]">
                  <div className="relative mx-auto aspect-square w-full max-w-[240px] rounded-full bg-[conic-gradient(#cc0000_0deg_151.2deg,#f06b6b_151.2deg_237.6deg,#fbb4b4_237.6deg_306deg,#3a3f4a_306deg_360deg)]">
                    <div className="absolute inset-[24%] flex items-center justify-center rounded-full bg-[var(--surface)] shadow-[inset_0_0_0_1px_var(--border)]">
                      <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                          Weekly mix
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--target-ink)]">
                          $3.2M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {budgetSegments.map((segment) => (
                    <div
                      key={segment.label}
                      className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: segment.color }}
                        />
                        <p className="text-sm font-medium text-[var(--target-ink)]">
                          {segment.label}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--target-ink)]">
                        {segment.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

type ServiceCardProps = {
  title: string;
  status: string;
  detail: string;
  evidence: string;
  icon: LucideIcon;
};

function ServiceCard({
  title,
  status,
  detail,
  evidence,
  icon: Icon,
}: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--target-red-soft)] text-[var(--target-red)]">
          <Icon className="h-4 w-4" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          MVP
        </span>
      </div>
      <h4 className="mt-3 text-sm font-semibold text-[var(--target-ink)]">
        {title}
      </h4>
      <p className="mt-0.5 text-xs font-medium text-[var(--target-red)]">
        {status}
      </p>
      <p className="mt-2 flex-1 text-xs leading-5 text-[var(--muted-strong)]">
        {detail}
      </p>
      <p className="mt-3 truncate rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[10px] text-[var(--muted-strong)]">
        {evidence}
      </p>
    </article>
  );
}

type QuickCardProps = {
  label: string;
  value: string;
  detail: string;
  delta: "up" | "down" | "flat";
  tone: "accent" | "neutral";
};

function QuickCard({ label, value, detail, delta, tone }: QuickCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border p-5",
        tone === "accent"
          ? "border-[var(--target-red-soft)] bg-[var(--target-red-soft)]"
          : "border-[var(--border)] bg-[var(--surface)]",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
          {label}
        </p>
        {delta === "up" ? (
          <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            <ArrowUpRight className="h-3 w-3" />
            up
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
            stable
          </span>
        )}
      </div>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
        {detail}
      </p>
    </article>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--target-ink)]">{value}</p>
      <p className="text-xs text-[var(--muted)]">{sub}</p>
    </div>
  );
}

function mapValue(
  value: number,
  minValue: number,
  maxValue: number,
  bottom: number,
  top: number,
) {
  const span = Math.max(maxValue - minValue, 1);
  return bottom - ((value - minValue) / span) * (bottom - top);
}

function buildLinePath(
  values: number[],
  left: number,
  right: number,
  bottom: number,
  top: number,
) {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  return values
    .map((value, index) => {
      const x = left + index * ((right - left) / Math.max(values.length - 1, 1));
      const y = mapValue(value, minValue, maxValue, bottom, top);

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}
