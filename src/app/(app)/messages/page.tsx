import { MessagesPanel } from "@/components/messages-panel";
import { getThread, listThreads } from "@/lib/messages";
import { requireSession } from "@/lib/session";

export default async function MessagesPage() {
  const session = await requireSession();
  const threads = await listThreads(session.user.id);
  const initialActiveThread = threads[0]
    ? await getThread(session.user.id, threads[0].recipient.id)
    : null;

  return (
    <MessagesPanel
      currentUserId={session.user.id}
      initialThreads={threads}
      initialActiveThread={initialActiveThread}
    />
  );
}
