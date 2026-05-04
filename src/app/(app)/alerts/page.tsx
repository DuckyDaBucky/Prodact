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
    <section className="space-y-6">
      <div className="rounded-[1.9rem] border border-(--border) bg-(--card-strong) p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--target-red)">
          Notification Service
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-(family-name:--font-heading) text-3xl font-semibold tracking-tight text-(--target-ink)">
              Derived alert center
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-(--muted)">
              Product, restock, pricing, and data-quality alerts are generated from seeded Target
              rows. This is a product-only MVP service with deterministic read/unread demo state.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-(--target-red)">
            <Database className="h-4 w-4" />
            target_product backed
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Bell} label="Total alerts" value={notifications.length} />
        <MetricCard icon={CircleAlert} label="Unread" value={unreadCount} />
        <MetricCard icon={PackageSearch} label="Restock" value={restockCount} />
        <MetricCard icon={Tags} label="Pricing" value={pricingCount} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[1.7rem] border border-(--border) bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
            Status
          </p>
          <div className="mt-4 space-y-3">
            <StatusRow label="High severity" value={highCount} tone="high" />
            <StatusRow label="Medium severity" value={grouped.medium.length} tone="medium" />
            <StatusRow label="Data rows scanned" value={products.length} tone="low" />
          </div>
          <div className="mt-5 rounded-[1.25rem] border border-dashed border-red-200 bg-red-50/50 p-4 text-sm leading-6 text-(--muted)">
            Read state is derived for the MVP. A future production service would persist user-level
            notification reads in Postgres.
          </div>
        </aside>

        <div className="space-y-5">
          {(["high", "medium", "low"] as const).map((severity) => (
            <section
              key={severity}
              className="rounded-[1.7rem] border border-(--border) bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--target-red)">
                    {severity} severity
                  </p>
                  <h3 className="mt-2 text-xl font-semibold capitalize text-(--target-ink)">
                    {grouped[severity].length} generated notifications
                  </h3>
                </div>
                <span className={severityPillClassName(severity)}>{severity}</span>
              </div>

              <div className="mt-5 space-y-3">
                {grouped[severity].map((notification) => (
                  <article
                    key={notification.id}
                    className="rounded-[1.25rem] border border-(--border) bg-(--card) p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--target-red)">
                            {typeLabels[notification.type]}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--muted)">
                            {notification.status}
                          </span>
                        </div>
                        <h4 className="mt-3 text-base font-semibold text-(--target-ink)">
                          {notification.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-(--muted)">
                          {notification.body}
                        </p>
                      </div>
                      <Link
                        className="shrink-0 rounded-full bg-(--target-red) px-4 py-2 text-sm font-semibold text-white"
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
                  <div className="rounded-[1.25rem] border border-dashed border-(--border) bg-(--card) p-4 text-sm text-(--muted)">
                    No {severity} severity notifications were generated from the current seeded
                    rows.
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
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.35rem] border border-(--border) bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-50 p-2 text-(--target-red)">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--muted)">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-semibold text-(--target-ink)">{value}</p>
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
    <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-(--border) bg-(--card) px-4 py-3 text-sm">
      <span className="text-(--muted)">{label}</span>
      <span className={severityPillClassName(tone)}>{value}</span>
    </div>
  );
}

function severityPillClassName(severity: "high" | "medium" | "low") {
  const base = "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize";

  if (severity === "high") {
    return `${base} bg-red-50 text-(--target-red)`;
  }

  if (severity === "medium") {
    return `${base} bg-amber-50 text-amber-700`;
  }

  return `${base} bg-emerald-50 text-emerald-700`;
}
