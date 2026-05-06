import { WorkspaceAssistant } from "@/components/workspace-assistant";
import { requireSession } from "@/lib/session";

export default async function MessagesPage() {
  await requireSession();

  return <WorkspaceAssistant />;
}
