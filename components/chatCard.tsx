// components/ChatCard.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatSummary } from "@/types";

interface ChatCardProps {
  chat: ChatSummary;
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <Card className="bg-[#0D0D0D] border border-white/10 text-white rounded-xl shadow-md shadow-white/10">
      <CardHeader className="text-sm font-semibold text-white space-y-1">
        <p className="text-[#00FF85]">
          <span className="font-bold">Dátum:</span> {chat.date}
        </p>
        <p className="text-[#33ccff]">
          <span className="font-bold">Agent(ek):</span>{" "}
          {chat.agentEmails.length ? chat.agentEmails.join(", ") : "Ismeretlen"}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {chat.content.map((msg, index) => (
          <div
            key={index}
            className={`rounded px-3 py-2 whitespace-pre-wrap text-sm font-medium transition-all duration-200 shadow-sm ${
              msg.sender === "Agent"
                ? "bg-blue-100 text-blue-900"
                : "bg-green-100 text-green-900"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
