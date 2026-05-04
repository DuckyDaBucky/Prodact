import type { CSSProperties } from "react";
import {
  Bell,
  ChartColumnIncreasing,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  MessageSquareText,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/components/cn";
import { requireSession } from "@/lib/session";

const shellGridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(75, 29, 29, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 29, 29, 0.05) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

const salesData = [4.1, 4.8, 5.2, 5.9, 6.4, 7.1, 7.6];
const salesLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const budgetSegments = [
  { label: "Inventory", value: 42, color: "#cc0000" },
  { label: "Pricing", value: 24, color: "#ff7a7a" },
  { label: "Promotions", value: 19, color: "#f3b2b2" },
  { label: "Ops reserve", value: 15, color: "#4b1d1d" },
];

const navigationItems = [
  "Dashboard overview",
  "Sales forecast",
  "Inventory health",
  "Pricing watchlist",
  "Category insights",
  "Store performance",
];

const applicationItems = [
  "Competitor analysis",
  "Alert center",
  "Report builder",
  "Scenario planner",
  "Assortment review",
  "Budget tracker",
];

const quickCards = [
  {
    label: "Recent change",
    value: "+4.8%",
    detail: "Household essentials sales climbed versus last week.",
    tone: "accent",
  },
  {
    label: "Sales forecast",
    value: "$12.4M",
    detail: "Projected seven-day revenue across tracked Target categories.",
    tone: "neutral",
  },
  {
    label: "More actions",
    value: "4 items",
    detail: "Pricing gaps and alerts need review before tomorrow morning.",
    tone: "neutral",
  },
] as const;

export default async function DashboardPage() {
  const session = await requireSession();
  const salesPath = buildLinePath(salesData, 56, 472, 210, 44);

  return (
    <section
      className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-4 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur sm:p-6"
      style={shellGridStyle}
    >
      <div className="rounded-[1.6rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] shadow-[0_18px_40px_rgba(120,54,54,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Prodact
            </p>
            <p className="text-sm text-[var(--muted)]">
              Target internal intelligence dashboard
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--target-ink)]">
            <TopAction icon={MessageSquareText} label="Messages" />
            <TopAction icon={Bell} label="Notifications" />
            <TopAction icon={UserRound} label="Profile" />
            <TopAction icon={Settings} label="Settings" />
          </div>
        </div>

        <div className="grid gap-5 p-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.96)] p-4 shadow-[0_12px_30px_rgba(120,54,54,0.06)]">
            <label className="flex items-center gap-3 rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3">
              <Search className="h-4 w-4 text-[var(--muted)]" />
              <input
                type="search"
                placeholder="Search"
                className="w-full bg-transparent text-sm text-[var(--target-ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </label>

            <div className="mt-6">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                Navigation
              </p>
              <div className="mt-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <SidebarRow
                    key={item}
                    label={item}
                    icon={index === 0 ? LayoutDashboard : ChevronRight}
                    active={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                Applications
              </p>
              <div className="mt-4 space-y-2">
                {applicationItems.map((item, index) => (
                  <SidebarRow
                    key={item}
                    label={item}
                    icon={index === 0 ? Sparkles : ShoppingBag}
                  />
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.96)] px-5 py-6 shadow-[0_12px_30px_rgba(120,54,54,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                Dashboard
              </p>
              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--target-ink)]">
                    Welcome back, {session.user.employeeId}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    Your Target workspace is ready with updated pricing signals, forecast movement, and budget distribution across the week.
                  </p>
                </div>
                <div className="rounded-[1.2rem] border border-red-100 bg-red-50/70 px-4 py-3 text-sm text-[var(--target-ink)]">
                  <p className="font-semibold">Today&apos;s AI focus</p>
                  <p className="mt-1 text-[var(--muted)]">
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
                  tone={card.tone}
                />
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.98)] p-5 shadow-[0_12px_30px_rgba(120,54,54,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                      Graph of sales
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                      Weekly sales momentum
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Revenue forecast is accelerating into the weekend, led by household and pantry staples.
                    </p>
                  </div>
                  <div className="rounded-full bg-red-50 p-3 text-[var(--target-red)]">
                    <ChartColumnIncreasing className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[var(--border)] bg-white">
                  <svg
                    viewBox="0 0 520 280"
                    className="h-[320px] w-full"
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
                        stroke="rgba(75, 29, 29, 0.10)"
                        strokeDasharray="4 8"
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
                          fill="rgba(111, 98, 93, 1)"
                          fontSize="12"
                        >
                          {label}
                        </text>
                      );
                    })}

                    <path
                      d={`${salesPath} L 472 210 L 56 210 Z`}
                      fill="rgba(204, 0, 0, 0.10)"
                    />
                    <path
                      d={salesPath}
                      fill="none"
                      stroke="rgba(204, 0, 0, 1)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {salesData.map((point, index) => {
                      const x = 56 + index * ((472 - 56) / (salesData.length - 1));
                      const y = mapValue(point, Math.min(...salesData), Math.max(...salesData), 210, 44);

                      return (
                        <circle
                          key={`${salesLabels[index]}-${point}`}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          stroke="rgba(204, 0, 0, 1)"
                          strokeWidth="3"
                        />
                      );
                    })}

                    <foreignObject x="144" y="104" width="232" height="88">
                      <div className="flex h-full items-center justify-center rounded-[1.2rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-4 text-center shadow-[0_16px_30px_rgba(35,24,21,0.10)]">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--target-red)]">
                            Forecast signal
                          </p>
                          <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                            Graph of Sales
                          </p>
                        </div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </article>

              <article className="rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.98)] p-5 shadow-[0_12px_30px_rgba(120,54,54,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                      Pie chart of budget
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                      Budget allocation
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Inventory and pricing remain the two biggest investment areas for this week&apos;s product planning cycle.
                    </p>
                  </div>
                  <div className="rounded-full bg-red-50 p-3 text-[var(--target-red)]">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 rounded-[1.4rem] border border-[var(--border)] bg-white p-5 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
                  <div className="mx-auto w-full max-w-[320px]">
                    <div className="relative mx-auto aspect-square w-full max-w-[280px] rounded-full bg-[conic-gradient(#cc0000_0deg_151.2deg,#ff7a7a_151.2deg_237.6deg,#f3b2b2_237.6deg_306deg,#4b1d1d_306deg_360deg)]">
                      <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(35,24,21,0.08)]">
                        <div className="text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--target-red)]">
                            Weekly mix
                          </p>
                          <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                            Budget
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {budgetSegments.map((segment) => (
                      <div
                        key={segment.label}
                        className="rounded-[1rem] border border-[var(--border)] bg-stone-50/70 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: segment.color }}
                            />
                            <p className="text-sm font-semibold text-[var(--target-ink)]">
                              {segment.label}
                            </p>
                          </div>
                          <p className="text-sm text-[var(--muted)]">
                            {segment.value}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type TopActionProps = {
  icon: LucideIcon;
  label: string;
};

function TopAction({ icon: Icon, label }: TopActionProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-[var(--border)] hover:bg-white"
    >
      <Icon className="h-4 w-4 text-[var(--target-red)]" />
      <span>{label}</span>
    </button>
  );
}

type SidebarRowProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

function SidebarRow({ label, icon: Icon, active = false }: SidebarRowProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-left transition",
        active
          ? "bg-red-50 text-[var(--target-ink)]"
          : "text-[var(--target-ink)] hover:bg-stone-50",
      )}
    >
      <div
        className={cn(
          "rounded-full p-2",
          active
            ? "bg-white text-[var(--target-red)]"
            : "bg-stone-100 text-[var(--muted)]",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

type QuickCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: "accent" | "neutral";
};

function QuickCard({ label, value, detail, tone }: QuickCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.4rem] border p-5 shadow-[0_12px_30px_rgba(120,54,54,0.06)]",
        tone === "accent"
          ? "border-red-200 bg-red-50/70"
          : "border-[var(--border)] bg-[rgba(255,255,255,0.96)]",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{detail}</p>
    </article>
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
