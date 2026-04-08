import { PlaceholderPage } from "@/components/placeholder-page";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Reserve this route for executive summaries, downloadable artifacts, and future presentation-ready reporting."
      checkpoints={[
        "Add date-range filters and report templates.",
        "Support export actions once the data layer is ready.",
        "Keep report components printable and presentation-friendly.",
      ]}
    />
  );
}
