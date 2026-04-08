import { PlaceholderPage } from "@/components/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="This space can later hold profile preferences, role visibility, integration toggles, and admin-only internal controls."
      checkpoints={[
        "Add session/account details for the logged-in employee.",
        "Add future role-management and audit controls.",
        "Keep destructive settings behind stronger admin rules later.",
      ]}
    />
  );
}
