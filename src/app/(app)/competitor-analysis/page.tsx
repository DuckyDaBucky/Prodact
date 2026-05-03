import {
  ArrowUpRight,
  BadgeDollarSign,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";

const competitors = [
  {
    name: "Walmart Supercenter",
    distance: "1.8 mi",
    rating: "4.1",
    priceIndex: "96",
    traffic: "High",
    strength: "Everyday grocery pricing",
    risk: "Price pressure on pantry staples",
    accent: "bg-sky-500",
  },
  {
    name: "Costco Wholesale",
    distance: "4.6 mi",
    rating: "4.6",
    priceIndex: "91",
    traffic: "Medium",
    strength: "Bulk household goods",
    risk: "Weekend basket migration",
    accent: "bg-emerald-500",
  },
  {
    name: "Kroger Marketplace",
    distance: "2.4 mi",
    rating: "4.3",
    priceIndex: "101",
    traffic: "Medium",
    strength: "Fresh food loyalty",
    risk: "Produce and meal kits",
    accent: "bg-amber-500",
  },
];

const recommendations = [
  {
    title: "Protect grocery trip frequency",
    impact: "+3.8% projected basket retention",
    detail:
      "Match weekly-visible staples within 2% of Walmart and bundle Target Circle offers around breakfast, pasta, and snack aisles.",
  },
  {
    title: "Win weekend family stock-ups",
    impact: "+$18K monthly opportunity",
    detail:
      "Promote household essentials in endcaps near checkout from Friday through Sunday to blunt Costco bulk-trip substitution.",
  },
  {
    title: "Lift fresh food confidence",
    impact: "+11 NPS points in food categories",
    detail:
      "Feature locally relevant produce, grab-and-go dinners, and freshness signage where Kroger is currently over-indexing.",
  },
];

const marketSignals = [
  { label: "Local demand index", value: "84", note: "+7 vs. metro avg" },
  { label: "Price competitiveness", value: "B+", note: "2 gaps flagged" },
  { label: "Share risk", value: "12%", note: "Near-term watch" },
  { label: "Promo intensity", value: "High", note: "Weekend weighted" },
];

const categoryGaps = [
  { category: "Pantry staples", target: "$4.28", competitor: "$4.12", delta: "-3.7%" },
  { category: "Household paper", target: "$11.49", competitor: "$10.94", delta: "-4.8%" },
  { category: "Fresh produce", target: "$3.76", competitor: "$3.89", delta: "+3.5%" },
  { category: "Beauty basics", target: "$8.19", competitor: "$8.42", delta: "+2.8%" },
];

export default function CompetitorAnalysisPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--target-red)]">
              <MapPin className="h-4 w-4" />
              Location intelligence
            </div>
            <div className="space-y-3">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                Competitor Analysis
              </h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                Target Store T-1842, Austin Southpark Meadows. Dummy market data for nearby retailers, local price pressure, category gaps, and AI-generated action recommendations.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <Store className="h-5 w-5 text-[var(--target-red)]" />
              <p className="mt-3 text-2xl font-semibold text-[var(--target-ink)]">3</p>
              <p className="text-xs text-[var(--muted)]">Primary competitors</p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-2xl font-semibold text-[var(--target-ink)]">+5.4%</p>
              <p className="text-xs text-[var(--muted)]">Opportunity lift</p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <Clock3 className="h-5 w-5 text-amber-600" />
              <p className="mt-3 text-2xl font-semibold text-[var(--target-ink)]">14 days</p>
              <p className="text-xs text-[var(--muted)]">Action window</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(120,54,54,0.06)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--target-red)]">
                  Competitive set
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--target-ink)]">
                  Nearby Retailers
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--target-ink)]"
              >
                <ArrowUpRight className="h-4 w-4" />
                Export
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {competitors.map((competitor) => (
                <article
                  key={competitor.name}
                  className="grid gap-4 rounded-[1.3rem] border border-[var(--border)] bg-[#fffdfb] p-4 md:grid-cols-[1fr_auto]"
                >
                  <div className="flex gap-4">
                    <span className={`mt-1 h-10 w-2 rounded-full ${competitor.accent}`} />
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-semibold text-[var(--target-ink)]">
                          {competitor.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          <MapPin className="h-3.5 w-3.5" />
                          {competitor.distance}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {competitor.rating}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {competitor.strength}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--target-ink)]">
                        {competitor.risk}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm md:w-52">
                    <div className="rounded-[1rem] bg-red-50 p-3">
                      <p className="text-xs text-[var(--muted)]">Price index</p>
                      <p className="mt-1 font-semibold text-[var(--target-ink)]">
                        {competitor.priceIndex}
                      </p>
                    </div>
                    <div className="rounded-[1rem] bg-emerald-50 p-3">
                      <p className="text-xs text-[var(--muted)]">Traffic</p>
                      <p className="mt-1 font-semibold text-[var(--target-ink)]">
                        {competitor.traffic}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(120,54,54,0.06)]">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5 text-[var(--target-red)]" />
              <h3 className="text-xl font-semibold text-[var(--target-ink)]">
                Category Price Gaps
              </h3>
            </div>
            <div className="mt-5 overflow-hidden rounded-[1.2rem] border border-[var(--border)]">
              <div className="grid grid-cols-4 bg-red-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span>Category</span>
                <span>Target</span>
                <span>Market</span>
                <span>Delta</span>
              </div>
              {categoryGaps.map((gap) => (
                <div
                  key={gap.category}
                  className="grid grid-cols-4 border-t border-[var(--border)] px-4 py-3 text-sm"
                >
                  <span className="font-medium text-[var(--target-ink)]">{gap.category}</span>
                  <span className="text-[var(--muted)]">{gap.target}</span>
                  <span className="text-[var(--muted)]">{gap.competitor}</span>
                  <span className="font-semibold text-[var(--target-ink)]">{gap.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[#10251f] p-6 text-white shadow-[0_18px_50px_rgba(16,37,31,0.18)]">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-300" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                AI Recommendations
              </p>
            </div>
            <div className="mt-5 space-y-4">
              {recommendations.map((recommendation) => (
                <article
                  key={recommendation.title}
                  className="rounded-[1.25rem] border border-white/10 bg-white/8 p-4"
                >
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <div>
                      <h4 className="font-semibold">{recommendation.title}</h4>
                      <p className="mt-1 text-sm font-semibold text-emerald-200">
                        {recommendation.impact}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/72">
                        {recommendation.detail}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(120,54,54,0.06)]">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[var(--target-red)]" />
              <h3 className="text-xl font-semibold text-[var(--target-ink)]">
                Market Signals
              </h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {marketSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="flex items-center justify-between rounded-[1.2rem] border border-[var(--border)] bg-[#fffdfb] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--target-ink)]">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{signal.note}</p>
                  </div>
                  <p className="text-xl font-semibold text-[var(--target-ink)]">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-100 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--target-red)]" />
              <div>
                <h3 className="font-semibold text-[var(--target-ink)]">
                  Suggested Next Move
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Approve a two-week local pricing test for pantry staples and run the recommended household essentials display during peak weekend hours.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
