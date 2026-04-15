"use client";

import { useState } from "react";

import { Sparkles, Store } from "lucide-react";

const tabs = [
  { id: "current", label: "Current Layout" },
  { id: "recommended", label: "Recommended Layout" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[1.2rem] px-6 py-3 text-lg font-semibold transition sm:px-10",
        active
          ? "bg-[linear-gradient(135deg,rgba(35,24,21,0.12),rgba(255,255,255,0.96))] text-[var(--target-ink)] shadow-[0_12px_28px_rgba(120,54,54,0.08)]"
          : "text-[var(--target-ink)]/90 hover:bg-white/70",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function CurrentLayoutPlan() {
  const aisleColumns = Array.from({ length: 5 });
  const frontFixtures = Array.from({ length: 8 });
  const decorDots = Array.from({ length: 9 });

  return (
    <div className="rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,#f7efe7_0%,#fbf7f2_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] sm:p-6">
      <div className="rounded-[1.2rem] bg-white p-4 shadow-[0_18px_40px_rgba(120,54,54,0.12)]">
        <div className="grid grid-cols-[3.6rem_minmax(0,1fr)_4.5rem] gap-4">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-[#f2c164] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#7b4c00] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Bakery
            </div>
            <div className="flex-1 rounded-xl bg-[#b9f0b2] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#2f7a33] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Produce
            </div>
            <div className="rounded-xl bg-[#dfb9ef] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#74408e] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Flowers
            </div>
            <div className="rounded-xl bg-[#9eb2df] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#35508b]">
              ATM
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_1.6fr_1.6fr_1fr] gap-4">
              <div className="rounded-lg bg-[#ffef74] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#6c6200]">
                Dairy
              </div>
              <div className="rounded-lg bg-[#f09ac0] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#7f204a]">
                Meat & Poultry
              </div>
              <div className="rounded-lg bg-[#f09ac0] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#7f204a]">
                Fresh Cuts
              </div>
              <div className="rounded-lg bg-[#b5d8fb] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#245988]">
                Frozen
              </div>
            </div>

            <div className="grid grid-cols-[1.5rem_repeat(5,minmax(0,1fr))_3rem] gap-5">
              <div className="rounded-md bg-[#e7d4e4]" />
              {aisleColumns.map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="h-3 w-16 rounded-full bg-[#dbc8d9]" />
                  <div className="h-36 w-full rounded-[0.9rem] bg-[#8f6aac] shadow-[inset_0_-14px_0_rgba(0,0,0,0.18)]" />
                </div>
              ))}
              <div className="rounded-[0.9rem] bg-[#9de0f0]" />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-[58%] rounded-md bg-[#f06d61] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Impulse Buy
              </div>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  {frontFixtures.map((_, index) => (
                    <div key={index} className="h-12 w-6 rounded-md bg-[#efe49c]" />
                  ))}
                </div>
                <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Register
                </p>
              </div>
              <div className="flex items-end gap-4">
                <div className="rounded-[0.9rem] border border-[#d3d3d3] bg-[#fafafa] px-4 py-3 text-center text-sm text-[#9d9d9d] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                  Cart
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {decorDots.map((_, index) => (
                    <span key={index} className="h-3 w-3 rounded-full bg-[#e4c387]" />
                  ))}
                </div>
                <div className="rounded-[0.9rem] bg-[#e2ca9d] px-3 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#71531f] [writing-mode:vertical-rl] [text-orientation:mixed]">
                  Blend Coffee Bar
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-2">
              <div className="space-y-2">
                <div className="h-1 rounded-full bg-[#2c2c2c]" />
                <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--target-ink)]">
                  Entrance
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-1 rounded-full bg-[#2c2c2c]" />
                <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--target-ink)]">
                  Exit
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-[#acd3f8] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#2b5f92] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Seafood
            </div>
            <div className="rounded-xl bg-[#c7ece9] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#2f6e6a] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Pharmacy
            </div>
            <div className="rounded-xl bg-[#101010] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white">
              Grab & Go
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoreLayoutPage() {
  const [activeTab, setActiveTab] = useState<TabId>("current");

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-7">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[0_24px_70px_rgba(120,54,54,0.08)] sm:p-7">
        {activeTab === "current" ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
                  In-Store Mapping
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Current Layout
                </h2>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--target-ink)] ring-1 ring-[var(--border)]">
                <Store className="h-6 w-6" />
              </span>
            </div>
            <CurrentLayoutPlan />
          </div>
        ) : (
          <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(35,24,21,0.06),rgba(35,24,21,0.03))] px-6 py-10 sm:px-8 sm:py-12">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
                  Optimization View
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Recommended Layout
                </h2>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--target-ink)] ring-1 ring-[var(--border)]">
                <Sparkles className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-6 flex min-h-[28rem] items-start justify-center rounded-[1.6rem] border border-dashed border-[var(--border)] bg-white/65 px-6 pt-10 text-center">
              <div className="max-w-xl">
                <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)] sm:text-4xl">
                  Needs more Information.
                </p>
                <p className="mt-3 text-lg text-[var(--target-ink)]">
                  Please finish store profile setup.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
