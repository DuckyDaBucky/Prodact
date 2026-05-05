"use client";

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("workspace-profile");
  const activeContent = tabContent[activeTab];

  return (
    <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--border)] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--target-red-soft)] text-[var(--target-red)]">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                Settings
              </p>
              <h2 className="mt-0.5 font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--target-ink)]">
                Target workspace
              </h2>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Adjust profile details and AI preferences for the internal
                workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-4">
          {settingsGroups.map((group, groupIndex) => (
            <div key={group.title} className={groupIndex > 0 ? "mt-4" : undefined}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.id === activeTab;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "group relative flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition",
                        isActive
                          ? "bg-[var(--target-red-soft)]"
                          : "hover:bg-[var(--surface-subtle)]",
                      )}
                    >
                      {isActive ? (
                        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[var(--target-red)]" />
                      ) : null}
                      <Icon
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isActive
                            ? "text-[var(--target-red)]"
                            : "text-[var(--muted)]",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isActive
                                ? "text-[var(--target-red-dark)]"
                                : "text-[var(--target-ink)]",
                            )}
                          >
                            {item.label}
                          </p>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive
                                ? "text-[var(--target-red)]"
                                : "text-[var(--muted)] opacity-0 group-hover:opacity-100",
                            )}
                          />
                        </div>
                        <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
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

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
              {activeContent.eyebrow}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              {activeContent.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {activeContent.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--target-ink)] transition hover:bg-[var(--surface-subtle)]"
            >
              <Eye className="h-4 w-4 text-[var(--muted)]" />
              Preview impact
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--target-red)] px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--target-red-dark)]"
            >
              <Check className="h-4 w-4" />
              Save changes
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            {activeContent.summary.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3.5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-base font-semibold text-[var(--target-ink)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {activeContent.cards.map((card) => (
              <section
                key={card.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h4 className="text-base font-semibold tracking-tight text-[var(--target-ink)]">
                  {card.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {card.description}
                </p>

                <div className="mt-4 space-y-2">
                  {card.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3.5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--target-ink)]">
                          {row.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-[var(--muted)]">
                          {row.helper}
                        </p>
                      </div>
                      {row.type === "value" ? (
                        <span
                          className={cn(
                            "shrink-0 rounded-md border px-2 py-1 text-xs font-medium",
                            row.tone === "accent"
                              ? "border-red-200 bg-[var(--target-red-soft)] text-[var(--target-red)]"
                              : "border-[var(--border)] bg-[var(--surface)] text-[var(--target-ink)]",
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

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
                {activeContent.guidanceTitle}
              </p>
              <ul className="mt-3 space-y-2.5">
                {activeContent.guidance.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-[var(--target-ink)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--target-red)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-[var(--target-ink)] bg-[var(--target-ink)] p-5 text-white">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-200">
                <Sparkles className="h-3.5 w-3.5" />
                AI workspace status
              </p>
              <p className="mt-3 text-base font-semibold tracking-tight">
                Settings are aligned for Target internal use.
              </p>
              <p className="mt-1.5 text-xs leading-5 text-white/70">
                The current configuration prioritizes fast competitor
                visibility, protected exports, and executive-ready summaries.
              </p>
              <div className="mt-4 space-y-1.5">
                <StatusPill icon={ShieldCheck} label="Protected settings enabled" />
                <StatusPill icon={Download} label="Exports require governed defaults" />
                <StatusPill icon={Bell} label="Daily digest routing configured" />
              </div>
            </section>
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
    <span
      role="switch"
      aria-checked={enabled}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition",
        enabled ? "bg-[var(--target-red)]" : "bg-stone-300",
      )}
    >
      <span
        className={cn(
          "absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition",
          enabled ? "left-[18px]" : "left-1",
        )}
      />
    </span>
  );
}

type StatusPillProps = {
  icon: LucideIcon;
  label: string;
};

function StatusPill({ icon: Icon, label }: StatusPillProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-3 py-2">
      <Icon className="h-3.5 w-3.5 text-red-200" />
      <p className="text-xs text-white">{label}</p>
    </div>
  );
}
