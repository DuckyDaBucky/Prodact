const conversations = [
  {
    id: "vendor-ops",
    name: "Vendor Ops",
    subject: "Shipment timing update",
    preview: "Carrier confirmed the weekend delay and asked for the revised dock window.",
    time: "8:42 AM",
    unread: 3,
    status: "Needs reply",
  },
  {
    id: "store-214",
    name: "Store 214",
    subject: "Endcap reset photos",
    preview: "The team uploaded fresh shelf photos and flagged one missing SKU label.",
    time: "7:18 AM",
    unread: 1,
    status: "Review",
  },
  {
    id: "pricing-pod",
    name: "Pricing Pod",
    subject: "Promo mismatch resolved",
    preview: "Yesterday's discrepancy was fixed in the morning push and stores are synced.",
    time: "Yesterday",
    unread: 0,
    status: "Closed loop",
  },
  {
    id: "regional-leads",
    name: "Regional Leads",
    subject: "Weekly field feedback",
    preview: "Three recurring customer questions came up around bundle signage and substitutions.",
    time: "Yesterday",
    unread: 0,
    status: "FYI",
  },
];

const timeline = [
  {
    sender: "Vendor Ops",
    role: "External partner",
    time: "8:42 AM",
    body: "Morning team, the inbound truck for the patio assortment is now expected after 2 PM on Saturday. If you want us to preserve the unload sequence, send the revised dock window by noon.",
    tone: "inbound",
  },
  {
    sender: "Prodact",
    role: "Internal note",
    time: "8:51 AM",
    body: "We can keep the unload sequence if receiving is shifted to the secondary bay. Inventory and merchandising should confirm shelf prep before responding.",
    tone: "internal",
  },
  {
    sender: "Store 214",
    role: "Store lead",
    time: "9:03 AM",
    body: "Reset photos are uploaded. One shelf tag printed with the previous item description, but the product on the floor is correct.",
    tone: "inbound",
  },
];

const quickActions = [
  "Escalate stockout risk to inventory",
  "Send pricing clarification to stores",
  "Attach field photos to a report",
  "Convert a thread into an alert ticket",
];

export default function MessagesPage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.08fr_1.45fr]">
      <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
              Operations Inbox
            </p>
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--target-ink)]">
                Messages
              </h2>
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
                Monitor vendor updates, field questions, and internal coordination in one shared workspace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-[var(--target-red)] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(204,0,0,0.18)]"
            >
              New message
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--target-ink)]"
            >
              Filter inbox
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Open Threads
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--target-ink)]">18</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              5 waiting on response today
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Unread
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--target-ink)]">7</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Across vendors, stores, and pod leads
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Avg. Response
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--target-ink)]">23m</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Faster than last week by 11%
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {conversations.map((conversation, index) => (
            <article
              key={conversation.id}
              className={`rounded-[1.6rem] border p-5 transition ${
                index === 0
                  ? "border-red-200 bg-red-50/70 shadow-[0_16px_32px_rgba(204,0,0,0.08)]"
                  : "border-[var(--border)] bg-white"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--target-ink)]">
                      {conversation.name}
                    </h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--target-red)]">
                      {conversation.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--target-ink)]">
                    {conversation.subject}
                  </p>
                  <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    {conversation.preview}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--muted)] sm:flex-col sm:items-end">
                  <span>{conversation.time}</span>
                  {conversation.unread > 0 ? (
                    <span className="rounded-full bg-[var(--target-red)] px-3 py-1 text-xs font-semibold text-white">
                      {conversation.unread} new
                    </span>
                  ) : (
                    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                      Read
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_rgba(120,54,54,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--target-red)]">
              Active Thread
            </p>
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--target-ink)]">
                Shipment timing update
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                Coordinate revised arrival timing with receiving, merchandising, and the vendor team before noon.
              </p>
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--target-ink)]">
            SLA remaining: <span className="font-semibold">2h 14m</span>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.7rem] border border-[var(--border)] bg-white p-5">
          {timeline.map((message) => (
            <div
              key={`${message.sender}-${message.time}`}
              className={`max-w-[92%] rounded-[1.4rem] px-4 py-4 ${
                message.tone === "internal"
                  ? "ml-auto bg-[var(--target-ink)] text-white"
                  : "bg-red-50 text-[var(--target-ink)]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-80">
                <span>{message.sender}</span>
                <span>{message.role}</span>
                <span>{message.time}</span>
              </div>
              <p className="mt-3 text-sm leading-6">{message.body}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.6rem] border border-dashed border-red-200 bg-red-50/60 p-5">
            <p className="text-sm font-semibold text-[var(--target-ink)]">
              Draft reply
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Thanks for the update. We can preserve the unload sequence if the truck arrives at the secondary bay after 2 PM. Receiving and merchandising are confirming prep now, and we will send the final dock window before noon.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-[var(--target-red)] px-4 py-2 text-sm font-semibold text-white"
              >
                Send reply
              </button>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--target-ink)]"
              >
                Save draft
              </button>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white p-5">
            <p className="text-sm font-semibold text-[var(--target-ink)]">
              Quick actions
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {quickActions.map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[var(--target-red)]" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
