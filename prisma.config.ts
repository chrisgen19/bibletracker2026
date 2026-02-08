import path from "node:path";
import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// Load .env.local for DATABASE_URL
try {
  loadEnvFile(path.resolve(__dirname, ".env.local"));
} catch {
  // fallback to .env if .env.local doesn't exist
  try {
    loadEnvFile(path.resolve(__dirname, ".env"));
  } catch {}
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
