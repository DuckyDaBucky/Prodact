/*import { PlaceholderPage } from "@/components/placeholder-page";

export default function InventoryPage() {
  return (
    <PlaceholderPage
      title="Inventory"
      description="Reserve this route for on-hand stock, backroom counts, in-transit inventory, and future inventory alerts."
      checkpoints={[
        "Add inventory table and store filters.",
        "Connect inventory API queries and loading states.",
        "Surface low-stock and restock recommendation cards.",
      ]}
    />
  );
}*/
import {
  CircleDollarSign,
  PackageOpen,
  Search,
  Star,
  TrendingUp,
  Truck,
  Undo2,
} from "lucide-react";

const inventoryStats = [
  {
    label: "Units on Hand",
    value: "248",
    note: "Healthy stock across top variants",
    icon: PackageOpen,
  },
  {
    label: "On the Way",
    value: "64",
    note: "Expected in 4 days",
    icon: Truck,
  },
  {
    label: "Need to be Ordered",
    value: "32",
    note: "Reorder point reached for black finish",
    icon: TrendingUp,
  },
];

const productMeta = [
  { label: "Price", value: "$129.99" },
  { label: "Reviews and Rating", value: "1,284 reviews • 4.8/5" },
  { label: "Sale History", value: "Up 18% month over month" },
  { label: "Return Rate", value: "1.6% across last 90 days" },
];

export default function ProductInventoryPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[var(--page)] p-4 shadow-[0_30px_80px_rgba(35,36,41,0.08)] sm:p-6">
        <section className="rounded-[1.8rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Inventory: Product</p>
              <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Aster Wireless Headphones
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                One product inventory view with pricing, fulfillment status, reviews, and sales
                performance, designed to match the soft retail dashboard theme across the site.
              </p>
            </div>
            <div className="flex h-11 items-center gap-3 rounded-full bg-[var(--page)] px-4 text-sm text-[var(--muted)] shadow-[inset_0_0_0_1px_rgba(32,33,38,0.05)]">
              <Search className="h-4 w-4" />
              <span>Search product</span>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-5">
            <article className="rounded-[1.8rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)] sm:p-6">
              <div className="flex aspect-square items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,#f9f7f3_0%,#f3efe9_100%)]">
                <div className="relative h-44 w-44 rounded-[2rem] border-[7px] border-[#1f2024]">
                  <div className="absolute left-6 top-16 h-[7px] w-24 origin-left -rotate-[38deg] rounded-full bg-[#1f2024]" />
                  <div className="absolute left-[72px] top-[92px] h-[7px] w-10 origin-left rotate-[44deg] rounded-full bg-[#1f2024]" />
                  <div className="absolute left-[98px] top-[84px] h-[7px] w-11 origin-left -rotate-[42deg] rounded-full bg-[#1f2024]" />
                  <div className="absolute left-[122px] top-[50px] h-8 w-8 rounded-full border-[7px] border-[#1f2024]" />
                  <div className="absolute inset-x-0 bottom-3 mx-auto h-[7px] w-[86%] rounded-full bg-[#1f2024]" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-[var(--foreground)]">Product Image</p>
            </article>

            <article className="rounded-[1.8rem] bg-[#232429] p-5 text-white shadow-[0_18px_40px_rgba(35,36,41,0.08)] sm:p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-white/55">Current Price</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">$129.99</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Premium-tier pricing with room for bundle campaigns during seasonal promotions.
              </p>
            </article>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 xl:grid-cols-3">
              {inventoryStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-[1.8rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)]"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--page)]">
                      <Icon className="h-4 w-4 text-[var(--foreground)]" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{stat.value}</p>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{stat.note}</p>
                  </article>
                );
              })}
            </div>

            <article className="rounded-[1.8rem] bg-white p-5 shadow-[0_18px_40px_rgba(35,36,41,0.05)] sm:p-6">
              <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--foreground)]">Product Snapshot</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Key selling and operational metrics for one product card.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--page)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                  <Star className="h-4 w-4" />
                  Featured audio product
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {productMeta.map((item, index) => (
                  <div
                    key={item.label}
                    className={[
                      "rounded-[1.4rem] p-4",
                      index === 0 ? "bg-[#f7f4ee]" : "bg-[var(--page)]/65",
                    ].join(" ")}
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    <p className="mt-2 text-base leading-7 text-[var(--muted)]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.6rem] bg-[linear-gradient(180deg,#faf8f4_0%,#f3efe9_100%)] p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Merchandising Note</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    This product performs best when featured as the hero item in premium audio
                    collections. Low returns, strong reviews, and consistent reorder pressure make
                    it a strong candidate for paid placement and bundle offers.
                  </p>
                </div>
                <div className="rounded-[1.6rem] bg-[var(--page)] p-5">
                  <div className="flex items-center gap-3">
                    <Undo2 className="h-5 w-5 text-[var(--foreground)]" />
                    <p className="text-sm font-semibold text-[var(--foreground)]">Returns Outlook</p>
                  </div>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Stable
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Quality signals remain strong, with most returns tied to shipping damage rather
                    than product dissatisfaction.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
