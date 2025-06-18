import { NextRequest } from "next/server";
import fs from "fs/promises";
import { readdir, readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { ChatSummary } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

// yyyy-mm-dd formátum
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// JSON fájlok beolvasása
async function readJsonFiles(dir: string): Promise<ChatSummary[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const results: ChatSummary[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subResults = await readJsonFiles(fullPath);
      results.push(...subResults);
    } else if (entry.name.endsWith(".json")) {
      const fileContent = await fs.readFile(fullPath, "utf-8");
      try {
        const json = JSON.parse(fileContent);

        const conversations = Array.isArray(json) ? json : [];

        for (const conversation of conversations) {
          const thread = conversation.thread || {};
          const users = conversation.users || [];

          const agentEmails = users
            .filter((u: any) => u.type === "agent")
            .map((u: any) => u.email || "ismeretlen");

          const customer = users.find(
            (u: any) => u.type === "customer" || u.type === "user"
          );

          const messages =
            thread?.events?.filter((e: any) => e.type === "message") || [];
          const parsedMessages = messages.map((msg: any) => ({
            sender: msg.author_id === customer?.id ? "Customer" : "Agent",
            text: msg.text || "(nincs szöveg)",
          }));

          results.push({
            id: conversation.id,
            date: thread.created_at
              ? formatDate(new Date(thread.created_at))
              : "ismeretlen",
            agentEmails,
            customerEmail: customer?.email,
            customerName: customer?.name,
            timestamp: thread?.created_at,
            content: parsedMessages,
          });
        }
      } catch (err) {
        console.error("Hiba a JSON feldolgozásakor:", fullPath, err);
      }
    }
  }

  return results;
}

//GET végpont – keresés agent, dátum, email, ticket ID alapján
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const searchAgent = searchParams.get("agent")?.toLowerCase();
  const searchDate = searchParams.get("date");
  const customerEmail = searchParams.get("customerEmail")?.toLowerCase();
  const customerName = searchParams.get("customerName")?.toLowerCase();
  const ticketId = searchParams.get("ticketId")?.toLowerCase();

  const chats = await readJsonFiles(DATA_DIR);

  const filtered = chats.filter((chat) => {
    if (
      searchAgent &&
      !chat.agentEmails.some((email) =>
        email.toLowerCase().includes(searchAgent)
      )
    ) {
      return false;
    }
    if (searchDate && chat.date !== searchDate) {
      return false;
    }
    if (
      customerEmail &&
      !chat.customerEmail?.toLowerCase().includes(customerEmail)
    ) {
      return false;
    }
    if (
      customerName &&
      !chat.customerName?.toLowerCase().includes(customerName)
    ) {
      return false;
    }
    if (ticketId && !chat.id.toLowerCase().includes(ticketId)) {
      return false;
    }
    return true;
  });

  return NextResponse.json(filtered);
}
