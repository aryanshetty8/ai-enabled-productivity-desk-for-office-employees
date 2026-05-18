"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatInput({
  onSend,
  disabled
}: {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return;
    const next = value;
    setValue("");
    await onSend(next);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about underperformers, overdue files, section bottlenecks, or monthly trends."
        rows={4}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Send
        </Button>
      </div>
    </form>
  );
}
