import { ChatWindow } from "@/components/chatbot/ChatWindow";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ChatbotPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chatbot"
        title="Natural Language Productivity Query"
        description="Use the integrated assistant to ask questions about employee performance, overdue trends, and section bottlenecks."
      />
      <ChatWindow />
    </div>
  );
}
