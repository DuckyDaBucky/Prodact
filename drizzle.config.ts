import { config as loadEnv } from "dotenv";

import { defineConfig } from "drizzle-kit";

loadEnv({ path: ".env.local", override: false });
loadEnv({ override: false });

function normalizeDatabaseUrl(url: string) {
  let normalized = url.trim().replace(/^['"]|['"]$/g, "");
  normalized = normalized.replace("sslmode=require", "sslmode=verify-full");
  normalized = normalized.replace(/([?&])channel_binding=require(&?)/, (_match, prefix, suffix) =>
    suffix ? prefix : "",
  );

  return normalized;
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: normalizeDatabaseUrl(
      process.env.DATABASE_URL ??
      "postgresql://demo:demo@localhost:5432/prodact?sslmode=require",
    ),
  },
});
