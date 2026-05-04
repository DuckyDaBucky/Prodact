import { Search, Star, TrendingUp, Truck } from "lucide-react";

const inventoryMetrics = [
  {
    label: "Units on Hand",
    value: "248",
    note: "Healthy coverage across active locations",
    icon: TrendingUp,
  },
  {
    label: "On the Way",
    value: "64",
    note: "Two replenishment shipments in transit",
    icon: Truck,
  },
  {
    label: "Need to be Ordered",
    value: "32",
    note: "Suggested reorder threshold for next cycle",
    icon: Star,
  },
];

const productDetails = [
  { label: "Product", value: "Apple AirPods" },
  { label: "Reviews and Rating", value: "4.8 / 5 from 1,284 reviews" },
  { label: "Sale History", value: "18% higher than last month" },
  { label: "Return Rate", value: "1.6% in the last 90 days" },
];

export default function InventoryPage() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,#f8f8f6_0%,#f1f1ee_100%)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="rounded-[1.7rem] border border-[#ecebe7] bg-white/90 px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] backdrop-blur sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-neutral-400">
              Inventory
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[2.2rem]">
              Products
            </h1>
          </div>

          <label className="flex h-12 w-full max-w-sm items-center gap-3 rounded-full border border-neutral-200 bg-[#fbfbfa] px-4 text-neutral-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <Search className="h-4 w-4" />
            <input
              type="search"
              placeholder="Search product"
              className="w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <article className="overflow-hidden rounded-[1.8rem] border border-white/80 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
            <div className="relative flex min-h-[410px] items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#f6f7fb_42%,#eef0f5_100%)] p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(226,232,240,0.7),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(203,213,225,0.36),transparent_30%)]" />

              <svg
                viewBox="0 0 420 420"
                className="relative z-10 h-full max-h-[320px] w-full max-w-[280px]"
                aria-label="Apple AirPods product illustration"
                role="img"
              >
                <defs>
                  <radialGradient id="airpodShell" cx="35%" cy="25%" r="85%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="58%" stopColor="#f5f7fb" />
                    <stop offset="100%" stopColor="#e4e8f1" />
                  </radialGradient>
                  <linearGradient id="airpodStem" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="60%" stopColor="#edf1f7" />
                    <stop offset="100%" stopColor="#d8deea" />
                  </linearGradient>
                  <linearGradient id="airpodMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2b2b2b" />
                    <stop offset="45%" stopColor="#d7dbe4" />
                    <stop offset="100%" stopColor="#232323" />
                  </linearGradient>
                  <filter id="airpodShadow" x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow
                      dx="0"
                      dy="16"
                      stdDeviation="14"
                      floodColor="#94a3b8"
                      floodOpacity="0.22"
                    />
                  </filter>
                </defs>

                <g filter="url(#airpodShadow)" transform="translate(28 38)">
                  <g transform="rotate(-17 110 120)">
                    <path
                      d="M48 93c0-43 31-76 69-76 36 0 64 30 64 68 0 31-17 56-41 67-12 6-20 14-20 30v114c0 18-13 32-30 32-16 0-29-14-29-32V170c0-14-7-24-18-33C26 127 48 116 48 93Z"
                      fill="url(#airpodShell)"
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
                    <rect x="68" y="170" width="44" height="154" rx="22" fill="url(#airpodStem)" />
                    <ellipse cx="110" cy="297" rx="23" ry="7" fill="url(#airpodMetal)" />
                  </g>

                  <g transform="translate(122 0)">
                    <path
                      d="M52 60c0-45 33-79 73-79 39 0 69 32 69 72 0 39-27 68-60 73-19 3-31 12-31 29v132c0 18-13 32-30 32s-30-14-30-32V60Z"
                      fill="url(#airpodShell)"
                    />
                    <rect x="74" y="136" width="44" height="176" rx="22" fill="url(#airpodStem)" />
                    <ellipse cx="99" cy="82" rx="23" ry="31" fill="#242424" />
                    <ellipse cx="99" cy="82" rx="16" ry="24" fill="#383838" />
                    <ellipse cx="62" cy="84" rx="5" ry="8" fill="#3d3d3d" />
                    <ellipse cx="142" cy="86" rx="4" ry="7" fill="#3f3f3f" />
                    <ellipse cx="156" cy="86" rx="4" ry="7" fill="#3f3f3f" />
                    <ellipse cx="97" cy="287" rx="22" ry="7" fill="url(#airpodMetal)" />
                  </g>
                </g>
              </svg>
            </div>

            <div className="border-t border-neutral-100 px-6 py-4">
              <p className="text-center text-lg font-semibold text-neutral-900">Apple AirPods</p>
              <p className="mt-1 text-center text-sm text-neutral-500">
                Wireless earbuds product preview
              </p>
            </div>
          </article>

          <div className="rounded-[1.6rem] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
              Snapshot
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              High-performing audio accessory with strong review sentiment and steady replenishment
              demand.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            {inventoryMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article
                  key={metric.label}
                  className="rounded-[1.5rem] border border-white/80 bg-white px-5 py-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                      Stock
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-neutral-600">{metric.label}</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-neutral-950">
                    {metric.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">{metric.note}</p>
                </article>
              );
            })}
          </div>

          <article className="rounded-[1.8rem] border border-white/80 bg-white px-6 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="flex flex-col gap-3 border-b border-neutral-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Product Overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                  Inventory details
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-600">
                Updated today
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {productDetails.map((detail, index) => (
                <div
                  key={detail.label}
                  className={[
                    "rounded-[1.35rem] px-5 py-4",
                    index === 0
                      ? "bg-[linear-gradient(180deg,#f8f8f6_0%,#f1f1ee_100%)]"
                      : "bg-neutral-50",
                  ].join(" ")}
                >
                  <p className="text-sm font-semibold text-neutral-900">{detail.label}</p>
                  <p className="mt-2 text-lg leading-8 text-neutral-600">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] bg-[linear-gradient(135deg,#111827_0%,#1f2937_100%)] px-5 py-5 text-white shadow-[0_18px_38px_rgba(17,24,39,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Merchandising Note
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/82">
                Apple AirPods continue to perform as a dependable premium accessory. Strong
                ratings, low return behavior, and stable inbound inventory make this a good
                candidate for featured placement and cross-sell bundles.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
