"use client";

import { useMemo, useState } from "react";

import { ChatInput } from "@/components/chatbot/ChatInput";
import { ChatMessage } from "@/components/chatbot/ChatMessage";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { ChatMessage as ChatMessageType } from "@/types";

const starters = [
  "Who are the underperformers this month?",
  "Which section has the most overdue files?",
  "Give me a summary of Ramesh's performance",
  "What are the top 3 bottlenecks?"
];

export function ChatWindow({ initialContext = "overview" }: { initialContext?: "overview" | "section" | "employee" }) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "seed-assistant",
      role: "assistant",
      content: "Ask about productivity trends, overdue work, or section-level performance. I will ground the answer in current dashboard data.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [context, setContext] = useState(initialContext);
  const [isLoading, setIsLoading] = useState(false);

  const sortedMessages = useMemo(() => messages, [messages]);

  async function sendMessage(content: string) {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };

    const assistantMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString()
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          messages: [...messages, userMessage]
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aggregated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aggregated += decoder.decode(value, { stream: true });
          setMessages((current) =>
            current.map((message) => (message.id === assistantMessage.id ? { ...message, content: aggregated } : message))
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex min-h-[72vh] flex-col">
      <CardHeader
        title="Natural Language Productivity Assistant"
        description="Query the current metrics dataset in plain language."
        action={
          <select
            className="rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm"
            value={context}
            onChange={(event) => setContext(event.target.value as typeof context)}
          >
            <option value="overview">Overview</option>
            <option value="section">My Section</option>
            <option value="employee">My Profile</option>
          </select>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {starters.map((prompt) => (
          <Button key={prompt} variant="ghost" className="rounded-full" onClick={() => sendMessage(prompt)} disabled={isLoading}>
            {prompt}
          </Button>
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl bg-forest-50/70 p-4">
        {sortedMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className="mt-4">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </Card>
  );
}
