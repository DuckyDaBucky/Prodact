"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/components/cn";

type SettingsTabId =
  | "workspace-profile"
  | "access-security"
  | "store-scope"
  | "ai-defaults"
  | "notifications"
  | "reports-exports"
  | "display-options";

type SettingsTab = {
  id: SettingsTabId;
  label: string;
  description: string;
  icon: LucideIcon;
};

type SettingsGroup = {
  title: string;
  items: SettingsTab[];
};

type SummaryItem = {
  label: string;
  value: string;
};

type DetailRow =
  | {
      type: "value";
      label: string;
      helper: string;
      value: string;
      tone?: "accent" | "neutral";
    }
  | {
      type: "toggle";
      label: string;
      helper: string;
      enabled: boolean;
    };

type DetailCard = {
  title: string;
  description: string;
  rows: DetailRow[];
};

type TabContent = {
  eyebrow: string;
  title: string;
  description: string;
  summary: SummaryItem[];
  cards: DetailCard[];
  guidanceTitle: string;
  guidance: string[];
};

const settingsGroups: SettingsGroup[] = [
  {
    title: "Profile",
    items: [
      {
        id: "workspace-profile",
        label: "Workspace profile",
        description: "Target identity, owners, and account details.",
        icon: UserRound,
      },
      {
        id: "access-security",
        label: "Access and security",
        description: "Role controls, sessions, and approval rules.",
        icon: ShieldCheck,
      },
      {
        id: "store-scope",
        label: "Store scope",
        description: "Regions, categories, and competitor coverage.",
        icon: Store,
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        id: "ai-defaults",
        label: "AI analysis defaults",
        description: "Model behavior, thresholds, and summaries.",
        icon: Sparkles,
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Alert routing, quiet hours, and digests.",
        icon: Bell,
      },
      {
        id: "reports-exports",
        label: "Reports and exports",
        description: "Deck format, delivery, and redaction rules.",
        icon: FileText,
      },
      {
        id: "display-options",
        label: "Display options",
        description: "Density, chart layout, and saved view defaults.",
        icon: Eye,
      },
    ],
  },
];

const tabContent: Record<SettingsTabId, TabContent> = {
  "workspace-profile": {
    eyebrow: "Profile",
    title: "Workspace profile for Target product intelligence",
    description:
      "Set the primary team identity and ownership details that appear across AI analysis dashboards, reports, and shareable exports.",
    summary: [
      { label: "Workspace name", value: "Target Product Intelligence" },
      { label: "Primary owner", value: "Merch Strategy Team" },
      { label: "Default region", value: "US National" },
    ],
    cards: [
      {
        title: "Identity details",
        description:
          "These fields define how the workspace appears in internal AI surfaces and scheduled reports.",
        rows: [
          {
            type: "value",
            label: "Workspace name",
            helper: "Used across dashboards and summary exports.",
            value: "Target Product Intelligence",
            tone: "accent",
          },
          {
            type: "value",
            label: "Team alias",
            helper: "Short label shown in AI insight headers.",
            value: "TGT Merch Ops",
          },
          {
            type: "value",
            label: "Primary owner",
            helper: "Default approver for major preference changes.",
            value: "Alyssa Chen",
          },
        ],
      },
      {
        title: "Account behavior",
        description:
          "Profile settings that shape how team context is reused in daily work.",
        rows: [
          {
            type: "toggle",
            label: "Pin morning briefing",
            helper: "Keep the daily AI recap at the top of the workspace.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Show owner initials on cards",
            helper: "Makes approval ownership visible in multi-team reviews.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Auto-open last active store view",
            helper: "Restores the most recent store comparison on sign-in.",
            enabled: false,
          },
        ],
      },
    ],
    guidanceTitle: "Profile guidance",
    guidance: [
      "Keep the workspace name broad enough to support both category and store-level analysis.",
      "Use a team owner instead of an individual mailbox when multiple merch leads review insights.",
      "Turn on the morning briefing only if teams rely on the dashboard as their daily operating page.",
    ],
  },
  "access-security": {
    eyebrow: "Profile",
    title: "Access and security controls",
    description:
      "Protect pricing, inventory, and AI-generated recommendations with clear access rules, stronger approval paths, and session defaults.",
    summary: [
      { label: "Admin roles", value: "4 active" },
      { label: "Session timeout", value: "30 minutes" },
      { label: "MFA coverage", value: "100%" },
    ],
    cards: [
      {
        title: "Authentication rules",
        description:
          "These controls keep high-sensitivity product intelligence behind stronger access boundaries.",
        rows: [
          {
            type: "value",
            label: "Sign-in method",
            helper: "Primary authentication path for Target employees.",
            value: "Target SSO",
            tone: "accent",
          },
          {
            type: "toggle",
            label: "Require MFA re-check for exports",
            helper: "Adds a second confirmation before downloading reports.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Lock stale sessions automatically",
            helper: "Ends inactive sessions after the configured timeout.",
            enabled: true,
          },
        ],
      },
      {
        title: "Approval boundaries",
        description:
          "Use approval rules when changes affect alert routing or AI behavior at scale.",
        rows: [
          {
            type: "value",
            label: "Protected settings",
            helper: "Sections that require elevated approval.",
            value: "Exports, alerts, AI thresholds",
          },
          {
            type: "value",
            label: "Escalation owner",
            helper: "Fallback reviewer for blocked requests.",
            value: "Digital Governance",
          },
          {
            type: "toggle",
            label: "Require approval for watchlist edits",
            helper: "Prevents silent changes to competitor coverage.",
            enabled: true,
          },
        ],
      },
    ],
    guidanceTitle: "Security notes",
    guidance: [
      "Use protected settings for any control that changes what data can leave the workspace.",
      "Keep watchlist edits gated if competitor monitoring feeds executive reporting.",
      "If teams share devices on the floor, shorten the session timeout from thirty minutes.",
    ],
  },
  "store-scope": {
    eyebrow: "Profile",
    title: "Store scope and comparison coverage",
    description:
      "Control which Target business areas the AI should analyze by default, and set the competitor frame used for benchmarking.",
    summary: [
      { label: "Coverage", value: "National + 12 pilot markets" },
      { label: "Tracked categories", value: "18" },
      { label: "Primary benchmark", value: "Walmart" },
    ],
    cards: [
      {
        title: "Scope defaults",
        description:
          "These settings determine which stores, markets, and assortments appear when a teammate opens the app.",
        rows: [
          {
            type: "value",
            label: "Default region",
            helper: "Used for overview dashboards and saved comparisons.",
            value: "US National",
            tone: "accent",
          },
          {
            type: "value",
            label: "Pilot markets",
            helper: "Extra detail views enabled for test-and-learn execution.",
            value: "Chicago, Dallas, Atlanta + 9 more",
          },
          {
            type: "value",
            label: "Assortment focus",
            helper: "Default item group pulled into AI summaries.",
            value: "Household essentials",
          },
        ],
      },
      {
        title: "Benchmark behavior",
        description:
          "Define how the app frames competitive context when analysts start a new comparison.",
        rows: [
          {
            type: "value",
            label: "Primary competitor",
            helper: "Default benchmark across product analysis pages.",
            value: "Walmart",
          },
          {
            type: "toggle",
            label: "Include online-only assortment gaps",
            helper: "Adds competitor web-only SKU differences into summaries.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Blend regional pricing into baseline",
            helper: "Uses local pricing where pilot-market coverage exists.",
            enabled: false,
          },
        ],
      },
    ],
    guidanceTitle: "Scope recommendations",
    guidance: [
      "Keep one default benchmark store for cleaner AI comparisons and more stable summaries.",
      "Use pilot markets sparingly so teams can distinguish national signals from experimental noise.",
      "Only enable online-only assortment gaps when e-commerce teams review the same workspace.",
    ],
  },
  "ai-defaults": {
    eyebrow: "Preferences",
    title: "AI analysis defaults",
    description:
      "Shape how the product analysis engine summarizes market movement, flags anomalies, and recommends next actions for Target teams.",
    summary: [
      { label: "Insight depth", value: "Strategic" },
      { label: "Anomaly threshold", value: "6%" },
      { label: "Weekly summary", value: "Enabled" },
    ],
    cards: [
      {
        title: "Model behavior",
        description:
          "Tune the tone and aggressiveness of AI-generated product and competitor insights.",
        rows: [
          {
            type: "value",
            label: "Narrative style",
            helper: "Default writing style for summaries and briefs.",
            value: "Executive concise",
            tone: "accent",
          },
          {
            type: "value",
            label: "Insight depth",
            helper: "Controls how much evidence and caveat detail appears.",
            value: "Strategic",
          },
          {
            type: "toggle",
            label: "Surface next-step recommendations",
            helper: "Adds action-oriented suggestions beneath each AI summary.",
            enabled: true,
          },
        ],
      },
      {
        title: "Automation thresholds",
        description:
          "Set the minimum change levels required before the AI treats a pricing or stock movement as meaningful.",
        rows: [
          {
            type: "value",
            label: "Price-change threshold",
            helper: "Minimum delta for competitor pricing alerts.",
            value: "3.0%",
          },
          {
            type: "value",
            label: "Anomaly threshold",
            helper: "Trigger level for unusual sales or stock swings.",
            value: "6.0%",
          },
          {
            type: "toggle",
            label: "Send weekly competitor digest",
            helper: "Creates a summary of changes across tracked benchmark stores.",
            enabled: true,
          },
        ],
      },
    ],
    guidanceTitle: "AI tuning tips",
    guidance: [
      "Use executive concise when insights are shared broadly with merch and leadership partners.",
      "Lower anomaly thresholds only when the team can actively review a higher alert volume.",
      "Keep next-step recommendations on if the page is used as a decision-support surface rather than a read-only dashboard.",
    ],
  },
  notifications: {
    eyebrow: "Preferences",
    title: "Notification routing and quiet hours",
    description:
      "Decide how quickly teams hear about competitor changes, stock instability, and AI-detected pricing issues.",
    summary: [
      { label: "Primary channel", value: "Ops Slack" },
      { label: "Quiet hours", value: "10 PM - 6 AM" },
      { label: "Digest cadence", value: "Daily" },
    ],
    cards: [
      {
        title: "Alert destinations",
        description:
          "Notifications can go to shared channels for fast response or roll into calmer end-of-day digests.",
        rows: [
          {
            type: "value",
            label: "Primary channel",
            helper: "First destination for high-priority market shifts.",
            value: "#prodact-ops",
            tone: "accent",
          },
          {
            type: "value",
            label: "Email digest",
            helper: "Summary delivery for leaders who prefer inbox reviews.",
            value: "merch-ops@target.example",
          },
          {
            type: "toggle",
            label: "Escalate out-of-stock surges instantly",
            helper: "Bypasses digests for major availability disruptions.",
            enabled: true,
          },
        ],
      },
      {
        title: "Timing rules",
        description:
          "Quiet hours help protect the team from noisy alerts while keeping urgent issues visible.",
        rows: [
          {
            type: "value",
            label: "Quiet hours",
            helper: "Reduced-notification window for non-critical updates.",
            value: "10:00 PM - 6:00 AM",
          },
          {
            type: "value",
            label: "Daily digest delivery",
            helper: "When the summary lands for the broader team.",
            value: "8:15 AM CT",
          },
          {
            type: "toggle",
            label: "Weekend digest",
            helper: "Send a lighter Saturday/Sunday recap for active pilots.",
            enabled: false,
          },
        ],
      },
    ],
    guidanceTitle: "Alert strategy",
    guidance: [
      "Reserve instant alerts for price breaks, stock collapses, and high-confidence AI anomalies.",
      "Use quiet hours to reduce notification fatigue unless a team actively operates overnight.",
      "Daily digests work best when paired with a pinned morning briefing in the workspace.",
    ],
  },
  "reports-exports": {
    eyebrow: "Preferences",
    title: "Reports and export defaults",
    description:
      "Control how charts, summaries, and AI findings are packaged for recurring reviews, deck prep, and cross-functional sharing.",
    summary: [
      { label: "Default format", value: "Slides + CSV" },
      { label: "Delivery owner", value: "Weekly Business Review" },
      { label: "Redaction", value: "Employee IDs hidden" },
    ],
    cards: [
      {
        title: "Export format",
        description:
          "Pick the default structure for deck-ready reporting and data pulls.",
        rows: [
          {
            type: "value",
            label: "Primary export",
            helper: "Default output when analysts click export.",
            value: "Slides + CSV",
            tone: "accent",
          },
          {
            type: "value",
            label: "Chart density",
            helper: "Amount of annotation shown on charts by default.",
            value: "Leadership overview",
          },
          {
            type: "toggle",
            label: "Attach AI narrative appendix",
            helper: "Adds a separate page with model-generated commentary.",
            enabled: true,
          },
        ],
      },
      {
        title: "Delivery rules",
        description:
          "Set who receives regular reports and how sensitive details should be treated.",
        rows: [
          {
            type: "value",
            label: "Scheduled deck owner",
            helper: "Default report recipient group.",
            value: "Weekly Business Review",
          },
          {
            type: "toggle",
            label: "Redact employee identifiers",
            helper: "Hides internal user details from exported documents.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Allow raw inventory CSV download",
            helper: "Only enable when the receiving team needs operational data.",
            enabled: false,
          },
        ],
      },
    ],
    guidanceTitle: "Export guidance",
    guidance: [
      "Use leadership overview density for recurring decks and reserve detailed views for analyst-only exports.",
      "Keep employee identifiers redacted unless the audience is strictly internal and operational.",
      "Disable raw CSV downloads if the workspace is mostly used for strategy and executive reviews.",
    ],
  },
  "display-options": {
    eyebrow: "Preferences",
    title: "Display options and saved view defaults",
    description:
      "Fine-tune how Target teams see the interface, from dashboard density to comparison layouts and chart readability.",
    summary: [
      { label: "View density", value: "Balanced" },
      { label: "Comparison layout", value: "Split view" },
      { label: "Pinned KPIs", value: "4 cards" },
    ],
    cards: [
      {
        title: "Workspace appearance",
        description:
          "These defaults help the app feel consistent across fast-moving daily workflows.",
        rows: [
          {
            type: "value",
            label: "View density",
            helper: "Controls spacing and data density across list-heavy pages.",
            value: "Balanced",
            tone: "accent",
          },
          {
            type: "value",
            label: "Comparison layout",
            helper: "Preferred chart arrangement for Target vs competitor analysis.",
            value: "Split view",
          },
          {
            type: "toggle",
            label: "Keep KPI cards pinned",
            helper: "Leaves the top KPI stack visible on longer pages.",
            enabled: true,
          },
        ],
      },
      {
        title: "Chart readability",
        description:
          "Adjust what visual helpers appear by default for analysts and leadership viewers.",
        rows: [
          {
            type: "toggle",
            label: "Show benchmark labels on hover cards",
            helper: "Makes competitor identification clearer during presentations.",
            enabled: true,
          },
          {
            type: "toggle",
            label: "Use condensed legends",
            helper: "Frees more room for charts on smaller laptop screens.",
            enabled: false,
          },
          {
            type: "value",
            label: "Pinned KPI order",
            helper: "Top-level metrics shown first across dashboards.",
            value: "Sales, Stock, Price, Margin",
          },
        ],
      },
    ],
    guidanceTitle: "Display recommendations",
    guidance: [
      "Balanced density works well for cross-functional teams switching between dashboards and settings.",
      "Split view is the clearest default when users frequently compare Target against one benchmark store.",
      "Only condense legends if chart labels remain readable in live review meetings.",
    ],
  },
};

const surfaceGridStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(75, 29, 29, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(75, 29, 29, 0.05) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("workspace-profile");
  const activeContent = tabContent[activeTab];

  return (
    <section
      className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-4 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur sm:p-6"
      style={surfaceGridStyle}
    >
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.8rem] border border-[var(--border)] bg-[rgba(255,255,255,0.94)] p-5 shadow-[0_16px_40px_rgba(120,54,54,0.08)]">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-50 p-3 text-[var(--target-red)]">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--target-red)]">
                Settings
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                Target workspace
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Adjust profile details and AI preferences for the internal product analysis workspace.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-red-100 bg-red-50/70 p-4">
            <p className="text-sm font-semibold text-[var(--target-ink)]">
              Shared team defaults
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Changes here shape what merch, pricing, and operations teams see first when they open Prodact.
            </p>
          </div>

          <div className="mt-8 space-y-7">
            {settingsGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                  {group.title}
                </p>
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => {
                    const isActive = item.id === activeTab;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-[1.3rem] border px-4 py-3 text-left transition",
                          isActive
                            ? "border-red-200 bg-white shadow-[0_16px_32px_rgba(204,0,0,0.08)]"
                            : "border-transparent bg-white/40 hover:border-[var(--border)] hover:bg-white/80",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 rounded-full p-2",
                            isActive
                              ? "bg-red-50 text-[var(--target-red)]"
                              : "bg-stone-100 text-[var(--muted)]",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[var(--target-ink)]">
                              {item.label}
                            </p>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 shrink-0",
                                isActive
                                  ? "text-[var(--target-red)]"
                                  : "text-[var(--muted)]",
                              )}
                            />
                          </div>
                          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="rounded-[1.8rem] border border-[var(--border)] bg-[rgba(255,255,255,0.96)] p-6 shadow-[0_16px_40px_rgba(120,54,54,0.08)]">
          <div className="flex min-h-[760px] flex-col">
            <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                  {activeContent.eyebrow}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                  {activeContent.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {activeContent.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--target-ink)]"
                >
                  <Eye className="h-4 w-4 text-[var(--target-red)]" />
                  Preview impact
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--target-red)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(204,0,0,0.18)]"
                >
                  <Check className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {activeContent.summary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.35rem] border border-[var(--border)] bg-red-50/40 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--target-ink)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {activeContent.cards.map((card) => (
                <section
                  key={card.title}
                  className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5"
                >
                  <h4 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--target-ink)]">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {card.description}
                  </p>

                  <div className="mt-5 space-y-4">
                    {card.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-stone-100 bg-stone-50/70 px-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--target-ink)]">
                            {row.label}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                            {row.helper}
                          </p>
                        </div>
                        {row.type === "value" ? (
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-3 py-2 text-sm font-semibold",
                              row.tone === "accent"
                                ? "bg-red-50 text-[var(--target-red)]"
                                : "bg-white text-[var(--target-ink)]",
                            )}
                          >
                            {row.value}
                          </span>
                        ) : (
                          <Toggle enabled={row.enabled} />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--target-red)]">
                  {activeContent.guidanceTitle}
                </p>
                <ul className="mt-4 space-y-3">
                  {activeContent.guidance.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--target-ink)]">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[var(--target-red)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--target-ink)] p-5 text-white">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100">
                  <Sparkles className="h-4 w-4" />
                  AI workspace status
                </p>
                <p className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight">
                  Settings are aligned for Target internal use.
                </p>
                <p className="mt-3 text-sm leading-6 text-red-50/90">
                  The current configuration prioritizes fast competitor visibility, protected exports, and executive-ready summaries.
                </p>
                <div className="mt-5 space-y-3">
                  <StatusPill icon={ShieldCheck} label="Protected settings enabled" />
                  <StatusPill icon={Download} label="Exports require governed defaults" />
                  <StatusPill icon={Bell} label="Daily digest routing configured" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ToggleProps = {
  enabled: boolean;
};

function Toggle({ enabled }: ToggleProps) {
  return (
    <div className="shrink-0">
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold",
          enabled
            ? "bg-red-50 text-[var(--target-red)]"
            : "bg-stone-200 text-stone-600",
        )}
      >
        <span
          className={cn(
            "relative h-6 w-10 rounded-full transition",
            enabled ? "bg-[var(--target-red)]" : "bg-stone-400",
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-4 w-4 rounded-full bg-white transition",
              enabled ? "left-5" : "left-1",
            )}
          />
        </span>
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}

type StatusPillProps = {
  icon: LucideIcon;
  label: string;
};

function StatusPill({ icon: Icon, label }: StatusPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-white/10 px-4 py-3">
      <div className="rounded-full bg-white/10 p-2 text-red-100">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-white">{label}</p>
    </div>
  );
}
