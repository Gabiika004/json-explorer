"use client";

import { ChatSummary } from "@/types";
import { ChatCard } from "./chatCard";

interface CardListProps {
  data: ChatSummary[];
}

export function CardList({ data }: CardListProps) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-sm">Nincs találat.</p>;
  }

  // Egyedi id-k szerint szűrés (első előfordulás marad)
  const uniqueChats = Array.from(
    new Map(data.map((item) => [item.id, item])).values()
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {uniqueChats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
