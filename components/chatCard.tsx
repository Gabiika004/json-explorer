"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatSummary } from "@/types";

interface ChatCardProps {
  chat: ChatSummary;
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <Card className="bg-card border border-border text-card-foreground rounded-xl shadow-md shadow-black/10 dark:shadow-white/10">
      <CardHeader className="text-sm font-semibold text-card-foreground space-y-1">
        {/* Dátum */}
        <p className="text-primary">
          <span className="font-bold">Dátum:</span> {chat.date}
        </p>

        {/* Időbélyeg (pontos idő) */}
        {chat.timestamp && (
          <p className="text-muted-foreground">
            <span className="font-bold">Időpont:</span>{" "}
            {new Date(chat.timestamp).toISOString().slice(11, 19)}
          </p>
        )}

        {/* Ticket ID */}
        <p className="text-pink-500 dark:text-pink-300">
          <span className="font-bold">Ticket ID:</span> {chat.id}
        </p>

        {/* Ügyfél e-mail */}
        {chat.customerEmail && (
          <p className="text-yellow-600 dark:text-yellow-300">
            <span className="font-bold">Ügyfél email:</span>{" "}
            {chat.customerEmail}
          </p>
        )}

        {/* Ügyfél név */}
        {chat.customerName && (
          <p className="text-orange-600 dark:text-orange-300">
            <span className="font-bold">Ügyfél név:</span> {chat.customerName}
          </p>
        )}

        {/* Agent(ek) */}
        <p className="text-sky-600 dark:text-sky-300">
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
                ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                : "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
