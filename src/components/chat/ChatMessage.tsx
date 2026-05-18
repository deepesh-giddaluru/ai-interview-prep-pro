import { motion } from "motion/react";
import { User, Bot } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-6 transition-colors",
        isAssistant ? "bg-white/[0.02]" : "bg-transparent"
      )}
    >
      <div className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-xl border shadow-sm",
        isAssistant ? "bg-[#1A1A1E] border-white/10" : "bg-brand border-brand/20"
      )}>
        {isAssistant ? (
          <Bot className="h-5 w-5 text-brand" />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className={cn(
          "inline-block",
          isAssistant ? "chat-bubble-ai" : "chat-bubble-user"
        )}>
          {content}
        </div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mt-1 px-1">
          {isAssistant ? "AI Interviewer" : "You"}
        </p>
      </div>
    </motion.div>
  );
}
