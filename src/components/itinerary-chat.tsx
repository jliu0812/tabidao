"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

interface ItineraryChatProps {
  itineraryId: string;
}

export function ItineraryChat({ itineraryId }: ItineraryChatProps) {
  const runtime = useChatRuntime({
    api: "/api/chat",
    body: { itineraryId },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex flex-col h-full overflow-hidden">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
