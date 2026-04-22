import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getThread, listThreads, sendMessageToRecipient } from "@/lib/messages";
import { auth } from "@/lib/auth";

const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1).max(2000),
});

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const recipientId = searchParams.get("recipientId");
  const threads = await listThreads(sessionUser.id);

  if (!recipientId) {
    return NextResponse.json({
      threads,
      activeThread: threads[0] ? await getThread(sessionUser.id, threads[0].recipient.id) : null,
    });
  }

  const activeThread = await getThread(sessionUser.id, recipientId);

  if (!activeThread) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  return NextResponse.json({
    threads,
    activeThread,
  });
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = sendMessageSchema.safeParse(await request.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: parsedBody.error.issues[0]?.message ?? "Invalid message payload.",
      },
      { status: 400 },
    );
  }

  try {
    const activeThread = await sendMessageToRecipient(
      sessionUser.id,
      parsedBody.data.recipientId,
      parsedBody.data.body,
    );

    return NextResponse.json({
      threads: await listThreads(sessionUser.id),
      activeThread,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to send message.",
      },
      { status: 400 },
    );
  }
}
