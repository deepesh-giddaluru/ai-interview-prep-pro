import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  context?: any;
  onMessagesChange?: (messages: Message[]) => void;
}

import { API_BASE_URL } from "@/src/lib/api";

export function ChatInterface({ context, onMessagesChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Interviewer. I will ask market-focused interview questions inspired by top companies, and I will guide you step by step. Are you ready to begin?",
    },
  ]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
          })),
          context
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.text };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border-subtle bg-bg-card shadow-2xl overflow-hidden backdrop-blur-xl">
      <div className="bg-bg-sidebar px-6 py-4 flex items-center justify-between border-b border-border-subtle">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Mock Interview Session</h3>
          <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">AI Interview Engine • Active</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
      >
        <div className="flex flex-col">
          {messages.map((message, i) => (
            <ChatMessage key={i} {...message} />
          ))}
          {isLoading && (
            <div className="p-6 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#1A1A1E] border border-white/10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-brand" />
              </div>
              <p className="text-xs text-text-muted font-medium italic">Interviewer is formulating a response...</p>
            </div>
          )}
          {messages.length === 1 && messages[0].role === "assistant" && !isLoading && (
            <div className="p-6 flex flex-col items-center gap-4 border-t border-white/10 bg-white/5">
              <p className="text-sm text-text-secondary">Click below to start the interview immediately.</p>
              <button
                type="button"
                onClick={() => handleSendMessage("Yes, I am ready")}
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Yes, I am ready
              </button>
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
