import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST() {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "scripts", "generate-index.ts");
    const nodePath = process.execPath; // node abszolút útja
    const tsxPath = path.join(
      process.cwd(),
      "node_modules",
      "tsx",
      "dist",
      "cli.mjs"
    );

    exec(
      `"${nodePath}" "${tsxPath}" "${scriptPath}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("[RELOAD API] Script futtatási hiba:", error, stderr);
          resolve(
            NextResponse.json(
              { success: false, error: stderr || error.message },
              { status: 500 }
            )
          );
        } else {
          console.log("[RELOAD API] Script sikeresen lefutott.");
          console.log("[RELOAD API] stdout:", stdout);
          if (stderr) {
            console.warn("[RELOAD API] stderr:", stderr);
          }
          resolve(NextResponse.json({ success: true, output: stdout }));
        }
      }
    );
  });
}
