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
        {/* Dátum */}
        <p className="text-[#00FF85]">
          <span className="font-bold">Dátum:</span> {chat.date}
        </p>

        {/* Időbélyeg (pontos idő) */}
        {chat.timestamp && (
          <p className="text-[#AAAAAA]">
            <span className="font-bold">Időpont:</span>{" "}
            {new Date(chat.timestamp).toLocaleString()}
          </p>
        )}

        {/* Ticket ID */}
        <p className="text-[#FF0099]">
          <span className="font-bold">Ticket ID:</span> {chat.id}
        </p>

        {/* Ügyfél e-mail */}
        {chat.customerEmail && (
          <p className="text-[#FFD700]">
            <span className="font-bold">Ügyfél email:</span>{" "}
            {chat.customerEmail}
          </p>
        )}

        {/* Ügyfél név */}
        {chat.customerName && (
          <p className="text-[#FFA500]">
            <span className="font-bold">Ügyfél név:</span> {chat.customerName}
          </p>
        )}

        {/* Agent(ek) */}
        <p className="text-[#33ccff]">
          <span className="font-bold">Agent(ek):</span>{" "}
          {chat.agentEmails.length ? chat.agentEmails.join(", ") : "Ismeretlen"}
        </p>
      </CardHeader>

      {/* Üzenetek listája */}
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
