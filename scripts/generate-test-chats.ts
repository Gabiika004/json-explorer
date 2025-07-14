import fs from "fs/promises";
import path from "path";

const OUT_PATH = path.join(process.cwd(), "data", "2025", "06", "12.json");

async function main() {
  // 120 db teszt chat objektum
  const chats = Array.from({ length: 120 }).map((_, i) => ({
    id: `TESTID${i + 1}`,
    users: [
      {
        id: `customer${i + 1}`,
        name: `Teszt Ügyfél ${i + 1}`,
        email: `teszt${i + 1}@example.com`,
        type: "customer",
        present: true,
      },
      {
        id: "testagent@teszt.hu",
        name: "Teszt Agent",
        email: "testagent@teszt.hu",
        type: "agent",
        present: true,
      },
    ],
    thread: {
      id: `THREAD${i + 1}`,
      created_at: "2025-06-12T10:00:00.000Z",
      events: [
        {
          id: `MSG${i + 1}_1`,
          type: "message",
          author_id: `customer${i + 1}`,
          text: `Ügyfél üzenete ${i + 1}`,
        },
        {
          id: `MSG${i + 1}_2`,
          type: "message",
          author_id: "testagent@teszt.hu",
          text: `Agent válasza ${i + 1}`,
        },
      ],
    },
  }));

  // Mappa létrehozása, ha nem létezik
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(chats, null, 2), "utf-8");
  console.log(`Sikeresen létrejött: ${OUT_PATH}`);
}

main();
