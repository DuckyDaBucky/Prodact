/*import { PlaceholderPage } from "@/components/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="This is the authenticated home base for Prodact. Use it later for KPI cards, store summaries, executive snapshots, and cross-page navigation."
      checkpoints={[
        "Add summary cards for inventory, pricing, and alerts.",
        "Map widgets back to the MVP requirements table in the SED.",
        "Keep shared metrics components reusable across feature pages.",
      ]}
    />
  );
}*/
import { ChevronRight, Clock3, LayoutGrid, Search, ShoppingBag, Users } from "lucide-react";

const metricCards = [
  {
    title: "Total Sales",
    subtitle: "Orders",
    value: "$184,320",
    detail: "Sales increase/decrease",
    icon: ShoppingBag,
    featured: true,
  },
  {
    title: "Number of Customers",
    subtitle: "This month",
    value: "12,480",
    detail: "Stats compared to last week/year",
    icon: Users,
  },
  {
    title: "Refunds/Loss",
    subtitle: "Storewide",
    value: "#418",
    detail: "Includes canceled orders and returns",
    icon: Clock3,
  },
];

const topProducts = ["Item #1", "Item #2", "Item #3"];

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

function TrendChart() {
  const width = 620;
  const height = 260;
  const pad = 24;
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
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Sales performance chart">
      {[0, 1, 2, 3, 4].map((row) => {
        const y = pad + row * ((height - pad * 2) / 4);

        return (
          <line
            key={row}
            x1={pad}
            y1={y}
            x2={width - pad}
            y2={y}
            stroke="rgba(38, 38, 43, 0.12)"
            strokeWidth="1"
          />
        );
      })}
      <path d={line(chartRows.map((row) => row.traffic))} fill="none" stroke="#d8cabd" strokeWidth="3" strokeLinecap="round" />
      <path d={line(chartRows.map((row) => row.returns))} fill="none" stroke="#ebbc97" strokeWidth="3" strokeLinecap="round" />
      <path d={line(chartRows.map((row) => row.sales))} fill="none" stroke="#232429" strokeWidth="3.5" strokeLinecap="round" />
      {chartRows.map((row, index) => {
        const x = pad + index * step;
        const y = height - pad - (row.sales / 80) * (height - pad * 2);

        return <circle key={index} cx={x} cy={y} r="4.5" fill="#232429" />;
      })}
    </svg>
  );
}

export default function StoreDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee] p-3 text-[#232429] sm:p-6">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#f0ede7] shadow-[0_30px_80px_rgba(35,36,41,0.08)] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="flex min-h-full flex-col bg-[#1f2024] px-8 py-9 text-white">
          <div className="text-lg font-semibold">Target</div>
          <nav className="mt-12 space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-[#1f2024]">
              <LayoutGrid className="h-4 w-4" />
              <span>Overview</span>
            </div>
            <div className="px-4 py-2 text-white/45">Products</div>
            <div className="px-4 py-2 text-white/45">Orders</div>
            <div className="px-4 py-2 text-white/45">Customers</div>
          </nav>
          <div className="mt-auto border-t border-white/10 pt-8 text-white/30">Store analytics</div>
        </aside>

        <section className="space-y-6 bg-[#f7f5f1] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#7a7b80]">Target Sales Statistics</p>
            </div>
            <div className="flex h-11 items-center gap-3 rounded-full bg-white px-4 text-sm text-[#9a9ca1] shadow-[0_12px_24px_rgba(35,36,41,0.04)]">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_150px]">
            <div className="grid gap-4 md:grid-cols-3">
              {metricCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className={[
                      "rounded-[1.75rem] px-5 py-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)]",
                      card.featured ? "bg-[#232429] text-white" : "bg-white text-[#232429]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-3">
                        <div
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                            card.featured ? "bg-white/10" : "bg-[#f3f1ec]",
                          ].join(" ")}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-base font-semibold">{card.title}</p>
                          <p className={card.featured ? "text-sm text-white/55" : "text-sm text-[#8a8b8f]"}>{card.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className={card.featured ? "h-4 w-4 text-white/65" : "h-4 w-4 text-[#8a8b8f]"} />
                    </div>
                    <div className="mt-8">
                      <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
                      <p className={card.featured ? "mt-3 text-sm text-white/75" : "mt-3 text-sm text-[#75767b]"}>{card.detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden xl:block" />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
            <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)] sm:p-6">
              <h2 className="text-xl font-semibold">Sales Performance</h2>
              <div className="mt-5 h-[320px] rounded-[1.4rem] bg-[linear-gradient(180deg,#faf8f4_0%,#f7f3ee_100%)] p-4">
                <TrendChart />
              </div>
            </section>

            <aside className="rounded-[2rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)] sm:p-6">
              <h2 className="text-xl font-semibold">Top Products</h2>
              <ul className="mt-8 space-y-4 text-sm font-semibold">
                {topProducts.map((product, index) => (
                  <li key={product} className="flex items-center gap-3">
                    <span
                      className={[
                        "h-3 w-3 rounded-sm",
                        index === 0 ? "bg-[#2b2c31]" : index === 1 ? "bg-[#8f9095]" : "bg-[#e3e4e8]",
                      ].join(" ")}
                    />
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-24 flex justify-end text-[#2b2c31]">
                <ChevronRight className="h-5 w-5" />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
