import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@/auth";
import { buildTools, SYSTEM_PROMPT } from "@/lib/chat-tools";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { messages, itineraryId } = await req.json();
  if (!itineraryId) return new Response("itineraryId required", { status: 400 });

  const result = await streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages,
    tools: buildTools(itineraryId, session.user.id),
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
