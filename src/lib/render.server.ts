import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { cwd } from "node:process";

const WORKSPACE_DIR = resolve(join(cwd(), "workspace"));

export async function executeTypst(
  input: string,
  format: string,
): Promise<{ ok: boolean; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const process = spawn("typst", [
      "compile",
      "--root",
      WORKSPACE_DIR,
      "--format",
      format,
      "-",
      "-",
    ]);

    const chunks: Buffer[] = [];
    let outputType = 0;

    process.stdout.on("data", (chunk) => {
      switch (outputType) {
        case 0:
          outputType = 1;

        case 1:
          chunks.push(chunk);
          break;

        case 2:
          console.warn("[Typst] Emitted stdout after stderr");
          break;
      }
    });

    process.stderr.on("data", (chunk) => {
      switch (outputType) {
        case 0:
          outputType = 2;

        case 2:
          chunks.push(chunk);
          break;

        case 1:
          console.warn("[Typst] Emitted stderr after stdout");
          break;
      }
    });

    process.on("close", (code) => {
      resolve({
        ok: code === 0,
        data: Buffer.concat(chunks),
      });
    });

    // Handle process errors
    process.on("error", (err) => {
      console.error("[Typst] Error:", err);
      reject(new Error(`Failed to execute Typst: ${err.message}`));
    });

    // Write typst source to stdin and close it
    process.stdin.write(input);
    process.stdin.end();
  });
}
