import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "portfolio-demo");
const dest = join(root, "dist", "portfolio");

if (!existsSync(src)) {
  console.warn("portfolio-demo/ no encontrado — se omite copia.");
  process.exit(0);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
mkdirSync(join(root, "dist"), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copiado portfolio-demo → dist/portfolio");
