import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { lookupRecipients } from "@/lib/messages";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  return NextResponse.json({
    results: await lookupRecipients(session.user.id, query),
  });
}
