import Link from "next/link";
import {
  Bell,
  CircleAlert,
  Database,
  PackageSearch,
  Tags,
  type LucideIcon,
} from "lucide-react";

import { deriveNotifications, listDemoProducts } from "@/lib/demo-data";

const typeLabels = {
  product: "Product",
  restock: "Restock",
  pricing: "Pricing",
  "data-quality": "Data quality",
} as const;

export default async function AlertsPage() {
  const products = await listDemoProducts(160).catch(() => []);
  const notifications = deriveNotifications(products);
  const unreadCount = notifications.filter((notification) => notification.status === "unread").length;
  const highCount = notifications.filter((notification) => notification.severity === "high").length;
  const restockCount = notifications.filter((notification) => notification.type === "restock").length;
  const pricingCount = notifications.filter((notification) => notification.type === "pricing").length;
  const grouped = {
    high: notifications.filter((notification) => notification.severity === "high"),
    medium: notifications.filter((notification) => notification.severity === "medium"),
    low: notifications.filter((notification) => notification.severity === "low"),
  };

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
          Notification service
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
              Derived alert center
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Product, restock, pricing, and data-quality alerts are generated
              from seeded Target rows. This is a product-only MVP service with
              deterministic read/unread demo state.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--muted-strong)]">
            <Database className="h-3.5 w-3.5" />
            target_product backed
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Bell} label="Total alerts" value={notifications.length} />
        <MetricCard icon={CircleAlert} label="Unread" value={unreadCount} tone="alert" />
        <MetricCard icon={PackageSearch} label="Restock" value={restockCount} />
        <MetricCard icon={Tags} label="Pricing" value={pricingCount} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--target-red)]">
            Status
          </p>
          <div className="mt-4 space-y-2">
            <StatusRow label="High severity" value={highCount} tone="high" />
            <StatusRow label="Medium severity" value={grouped.medium.length} tone="medium" />
            <StatusRow label="Data rows scanned" value={products.length} tone="low" />
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-xs leading-5 text-[var(--muted)]">
            Read state is derived for the MVP. A future production service would
            persist user-level notification reads in Postgres.
          </div>
        </aside>

        <div className="space-y-4">
          {(["high", "medium", "low"] as const).map((severity) => (
            <section
              key={severity}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                    {severity} severity
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold text-[var(--target-ink)]">
                    {grouped[severity].length} generated notifications
                  </h3>
                </div>
                <span className={severityPillClassName(severity)}>{severity}</span>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {grouped[severity].map((notification) => (
                  <article key={notification.id} className="px-5 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-[var(--target-red-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--target-red)]">
                            {typeLabels[notification.type]}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${
                              notification.status === "unread"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-[var(--surface-subtle)] text-[var(--muted-strong)]"
                            }`}
                          >
                            {notification.status}
                          </span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-[var(--target-ink)]">
                          {notification.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-strong)]">
                          {notification.body}
                        </p>
                      </div>
                      <Link
                        className="shrink-0 self-start rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--target-ink)] transition hover:border-[var(--target-red)] hover:text-[var(--target-red)]"
                        href={`/product-analysis?productId=${encodeURIComponent(
                          notification.productId,
                        )}`}
                      >
                        Review product
                      </Link>
                    </div>
                  </article>
                ))}

                {grouped[severity].length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[var(--muted)]">
                    No {severity} severity notifications were generated from the
                    current seeded rows.
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: "default" | "alert";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-md ${
            tone === "alert"
              ? "bg-[var(--target-red-soft)] text-[var(--target-red)]"
              : "bg-[var(--surface-subtle)] text-[var(--muted-strong)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "high" | "medium" | "low";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={severityPillClassName(tone)}>{value}</span>
    </div>
  );
}

function severityPillClassName(severity: "high" | "medium" | "low") {
  const base = "inline-flex w-fit rounded-md px-2 py-0.5 text-[11px] font-medium capitalize";

  if (severity === "high") {
    return `${base} bg-[var(--target-red-soft)] text-[var(--target-red)]`;
  }

  if (severity === "medium") {
    return `${base} bg-amber-50 text-amber-700`;
  }

  return `${base} bg-emerald-50 text-emerald-700`;
}
