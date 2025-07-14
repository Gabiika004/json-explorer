// scripts/generate-index.ts
// Ez a script rekurzívan beolvassa a data mappában található összes .json fájlt,
// minden objektumhoz hozzáadja a sourceFile mezőt, hibakezeléssel és logolással,
// majd az eredményt kiírja a public/index.json fájlba. A public mappát létrehozza, ha nem létezik.

import fs from "fs/promises";
import path from "path";

// A projekt gyökere
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const OUTPUT_FILE = path.join(PUBLIC_DIR, "index.json");

// Rekurzív JSON fájlgyűjtő
async function collectJsonFiles(dir: string): Promise<any[]> {
  let results: any[] = [];
  let entries: any[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`Nem sikerült beolvasni a könyvtárat: ${dir}`, err);
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Almappák rekurzív feldolgozása
      const subResults = await collectJsonFiles(fullPath);
      results.push(...subResults);
    } else if (entry.name.endsWith(".json")) {
      try {
        const fileContent = await fs.readFile(fullPath, "utf-8");
        const json = JSON.parse(fileContent);
        // Ha tömb, minden elemhez hozzáadjuk a sourceFile mezőt
        if (Array.isArray(json)) {
          for (const conversation of json) {
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
                ? new Date(thread.created_at).toISOString().split("T")[0]
                : "ismeretlen",
              agentEmails,
              customerEmail: customer?.email,
              customerName: customer?.name,
              timestamp: thread?.created_at,
              content: parsedMessages,
              sourceFile: path.relative(ROOT_DIR, fullPath),
            });
          }
        } else {
          // Egyedi objektum esetén is próbáljuk feldolgozni
          const conversation = json;
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
              ? new Date(thread.created_at).toISOString().split("T")[0]
              : "ismeretlen",
            agentEmails,
            customerEmail: customer?.email,
            customerName: customer?.name,
            timestamp: thread?.created_at,
            content: parsedMessages,
            sourceFile: path.relative(ROOT_DIR, fullPath),
          });
        }
      } catch (err) {
        console.error(`Hibás JSON vagy olvasási hiba: ${fullPath}`, err);
      }
    }
  }
  return results;
}

async function main() {
  // Ellenőrizzük, hogy létezik-e a data mappa
  try {
    const stat = await fs.stat(DATA_DIR);
    if (!stat.isDirectory()) {
      console.error("A data nem könyvtár!");
      process.exit(1);
    }
  } catch (err) {
    console.error("A data mappa nem található a projekt gyökerében!");
    process.exit(1);
  }

  // JSON fájlok összegyűjtése
  console.log("JSON fájlok keresése a data mappában...");
  const allData = await collectJsonFiles(DATA_DIR);
  console.log(`Összesen ${allData.length} objektum található.`);

  // public mappa létrehozása, ha nem létezik
  try {
    await fs.mkdir(PUBLIC_DIR, { recursive: true });
  } catch (err) {
    console.error("Nem sikerült létrehozni a public mappát!", err);
    process.exit(1);
  }

  // Eredmény kiírása
  try {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(allData, null, 2), "utf-8");
    console.log(`Sikeresen kiírva: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Nem sikerült kiírni az index.json fájlt!", err);
    process.exit(1);
  }
}

main();
