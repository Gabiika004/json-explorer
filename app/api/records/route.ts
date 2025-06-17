// app/api/records/route.ts
import { NextRequest } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

// Típus: Visszatérési objektum a frontend számára
export type ChatSummary = {
  id: string;
  date: string;
  agentEmails: string[];
  content: {
    sender: string;
    text: string;
  }[];
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filterDate = searchParams.get("date"); // pl: 2025-06-12
    const filterAgent = searchParams.get("agent"); // pl: vegasonline

    const jsonFiles = await getAllJsonFiles(DATA_DIR);
    const results: ChatSummary[] = [];

    for (const file of jsonFiles) {
      const content = await readFile(file, "utf-8");
      const parsed = JSON.parse(content);
      const chats = Array.isArray(parsed) ? parsed : [];

      if (!Array.isArray(chats)) continue;

      for (const chat of chats) {
        const id = chat.id;
        const createdAtRaw = chat.thread?.created_at;
        const date = createdAtRaw
          ? new Date(createdAtRaw).toISOString().split("T")[0]
          : "Invalid Date";

        // Szűrés dátum szerint
        if (filterDate && date !== filterDate) continue;

        // Agent emailek kinyerése
        const agentEmails = (chat.users || [])
          .filter((u: any) => u.type === "agent" && typeof u.email === "string")
          .map((u: any) => u.email);

        // Szűrés agent szerint
        if (
          filterAgent &&
          !agentEmails.some((email: string) =>
            email.toLowerCase().includes(filterAgent.toLowerCase())
          )
        ) {
          continue;
        }

        // Tartalom kinyerése: csak message vagy system_message
        const content = (chat.thread?.events || [])
          .filter((e: any) => ["message", "system_message"].includes(e.type))
          .map((e: any) => {
            const sender = agentEmails.includes(e.author_id)
              ? "Agent"
              : "Felhasználó";
            return {
              sender,
              text: e.text || "",
            };
          });

        results.push({
          id,
          date,
          agentEmails,
          content,
        });
      }
    }

    return Response.json(results);
  } catch (err) {
    console.error("API hiba:", err);
    return new Response(JSON.stringify({ error: "Szerverhiba" }), {
      status: 500,
    });
  }
}

// Rekurzív mappa bejárás: visszaadja az összes json fájlt
async function getAllJsonFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir, { withFileTypes: true });
  const result: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const nested = await getAllJsonFiles(fullPath);
      result.push(...nested);
    } else if (file.name.endsWith(".json")) {
      result.push(fullPath);
    }
  }

  return result;
}
