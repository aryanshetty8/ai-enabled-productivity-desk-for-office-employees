import { cn, formatDate } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow-sm",
          message.role === "user" ? "bg-forest-600 text-white" : "bg-white text-forest-900"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={cn("mt-2 text-[11px]", message.role === "user" ? "text-white/65" : "text-forest-900/45")}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
