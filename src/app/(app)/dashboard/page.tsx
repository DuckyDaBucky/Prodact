import { PlaceholderPage } from "@/components/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="This is the authenticated home base for Prodact. Use it later for KPI cards, store summaries, executive snapshots, and cross-page navigation."
      checkpoints={[
        "Add summary cards for inventory, pricing, and alerts.",
        "Map widgets back to the MVP requirements table in the SED.",
        "Keep shared metrics components reusable across feature pages.",
      ]}
    />
  );
}
