import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(webRoot, "../..");
const src = join(repoRoot, "portfolio-demo");
const dest = join(webRoot, "dist", "portfolio");

if (!existsSync(src)) {
  console.warn("portfolio-demo/ no encontrado — se omite copia.");
  process.exit(0);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
mkdirSync(join(webRoot, "dist"), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("Copiado portfolio-demo → apps/web/dist/portfolio");
