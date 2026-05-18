import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { streamChatResponse } from "@/lib/llm";
import { chatSchema } from "@/lib/schemas";
import { getDashboardSnapshot } from "@/lib/server-data";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = chatSchema.parse(await request.json());
    const snapshot = await getDashboardSnapshot(session);
    const stream = await streamChatResponse({
      messages: body.messages,
      snapshot
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to process chat request"
      },
      { status: 400 }
    );
  }
}
