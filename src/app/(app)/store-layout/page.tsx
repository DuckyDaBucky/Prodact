"use client";

import { useState } from "react";

import { Store } from "lucide-react";

import { cn } from "@/components/cn";

const tabs = [
  { id: "current", label: "Current Layout" },
  { id: "recommended", label: "Recommended Layout" },
] as const;

const recommendedZones = [
  {
    label: "Front endcaps",
    value: "Move high-demand household essentials closer to checkout.",
  },
  {
    label: "Center aisles",
    value: "Pair strong recommendation matches beside source products.",
  },
  {
    label: "Backroom flow",
    value: "Reserve faster restock paths for high-risk inventory signals.",
  },
  {
    label: "Promotion lane",
    value: "Group markdown products by discount signal and review strength.",
  },
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
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-[var(--surface)] text-[var(--target-ink)] shadow-[var(--shadow-sm)]"
          : "text-[var(--muted-strong)] hover:text-[var(--target-ink)]",
      )}
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-6">
      <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
        <div className="grid grid-cols-[3.6rem_minmax(0,1fr)_4.5rem] gap-4">
          <div className="flex flex-col gap-3">
            <div className="rounded-md bg-[#f2c164] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#7b4c00] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Bakery
            </div>
            <div className="flex-1 rounded-md bg-[#b9f0b2] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#2f7a33] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Produce
            </div>
            <div className="rounded-md bg-[#dfb9ef] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#74408e] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Flowers
            </div>
            <div className="rounded-md bg-[#9eb2df] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#35508b]">
              ATM
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_1.6fr_1.6fr_1fr] gap-4">
              <div className="rounded-md bg-[#ffef74] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#6c6200]">
                Dairy
              </div>
              <div className="rounded-md bg-[#f09ac0] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#7f204a]">
                Meat & Poultry
              </div>
              <div className="rounded-md bg-[#f09ac0] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#7f204a]">
                Fresh Cuts
              </div>
              <div className="rounded-md bg-[#b5d8fb] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#245988]">
                Frozen
              </div>
            </div>

            <div className="grid grid-cols-[1.5rem_repeat(5,minmax(0,1fr))_3rem] gap-5">
              <div className="rounded-md bg-[#e7d4e4]" />
              {aisleColumns.map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="h-3 w-16 rounded-full bg-[#dbc8d9]" />
                  <div className="h-36 w-full rounded-md bg-[#8f6aac] shadow-[inset_0_-14px_0_rgba(0,0,0,0.18)]" />
                </div>
              ))}
              <div className="rounded-md bg-[#9de0f0]" />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-[58%] rounded-md bg-[#f06d61] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white">
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
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Register
                </p>
              </div>
              <div className="flex items-end gap-4">
                <div className="rounded-md border border-[#d3d3d3] bg-[#fafafa] px-4 py-3 text-center text-sm text-[#9d9d9d]">
                  Cart
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {decorDots.map((_, index) => (
                    <span key={index} className="h-3 w-3 rounded-full bg-[#e4c387]" />
                  ))}
                </div>
                <div className="rounded-md bg-[#e2ca9d] px-3 py-4 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#71531f] [writing-mode:vertical-rl] [text-orientation:mixed]">
                  Blend Coffee Bar
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-2">
              <div className="space-y-2">
                <div className="h-1 rounded-full bg-[var(--target-ink)]" />
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-ink)]">
                  Entrance
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-1 rounded-full bg-[var(--target-ink)]" />
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-ink)]">
                  Exit
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-md bg-[#acd3f8] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#2b5f92] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Seafood
            </div>
            <div className="rounded-md bg-[#c7ece9] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#2f6e6a] [writing-mode:vertical-rl] [text-orientation:mixed]">
              Pharmacy
            </div>
            <div className="rounded-md bg-[#101010] px-2 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
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
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] p-1">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-[var(--muted)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live floor data
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        {activeTab === "current" ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  In-store mapping
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Current layout
                </h2>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-strong)]">
                <Store className="h-4 w-4" />
              </span>
            </div>
            <CurrentLayoutPlan />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Optimization view
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                  Recommended layout
                </h2>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--target-red-soft)] text-[var(--target-red)]">
                <Store className="h-4 w-4" />
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
                <div className="grid min-h-[28rem] grid-cols-4 gap-3">
                  <div className="rounded-md bg-[var(--target-red-soft)] p-4 text-sm font-semibold text-[var(--target-red)]">
                    Promo endcaps
                  </div>
                  <div className="col-span-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 text-center text-sm font-medium text-[var(--target-ink)]">
                    Recommended cross-merchandising aisle
                  </div>
                  <div className="rounded-md bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    Fast restock lane
                  </div>
                  <div className="col-span-4 grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }, (_, index) => (
                      <div
                        key={index}
                        className={[
                          "h-24 rounded-md border border-[var(--border)]",
                          index % 3 === 0
                            ? "bg-[var(--target-red-soft)]"
                            : index % 3 === 1
                              ? "bg-[var(--surface)]"
                              : "bg-amber-50",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <div className="col-span-2 rounded-md bg-[var(--target-ink)] p-4 text-center text-sm font-semibold text-white">
                    Entrance
                  </div>
                  <div className="col-span-2 rounded-md bg-[var(--target-red-soft)] p-4 text-center text-sm font-semibold text-[var(--target-red)]">
                    Checkout conversion zone
                  </div>
                </div>
              </div>

              <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                  Layout recommendations
                </p>
                <div className="mt-4 space-y-2">
                  {recommendedZones.map((zone) => (
                    <div
                      key={zone.label}
                      className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5"
                    >
                      <p className="text-sm font-semibold text-[var(--target-ink)]">
                        {zone.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted-strong)]">
                        {zone.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-3 text-xs leading-5 text-[var(--muted)]">
                  The MVP uses product recommendation, discount, and restock
                  signals as the decision-support basis for layout planning.
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
