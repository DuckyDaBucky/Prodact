import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function normalizeDatabaseUrl(url: string) {
  let normalized = url.trim().replace(/^['"]|['"]$/g, "");
  normalized = normalized.replace("sslmode=require", "sslmode=verify-full");
  normalized = normalized.replace(/([?&])channel_binding=require(&?)/, (_match, prefix, suffix) =>
    suffix ? prefix : "",
  );

  return normalized;
}

const databaseUrl = normalizeDatabaseUrl(
  process.env.DATABASE_URL ??
    "postgresql://demo:demo@localhost:5432/prodact?sslmode=verify-full",
);

const sql = neon(databaseUrl);

export const db = drizzle({
  client: sql,
  schema,
});

export { schema };
