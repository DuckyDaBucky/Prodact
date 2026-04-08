import { PlaceholderPage } from "@/components/placeholder-page";

export default function AlertsPage() {
  return (
    <PlaceholderPage
      title="Alerts"
      description="Use this page for stockout risks, pricing anomalies, and future notification workflows."
      checkpoints={[
        "Add severity filters and alert categories.",
        "Connect alert cards to inventory or pricing detail pages.",
        "Track status such as new, acknowledged, and resolved.",
      ]}
    />
  );
}
