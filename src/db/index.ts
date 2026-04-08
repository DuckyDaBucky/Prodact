import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function normalizeDatabaseUrl(url: string) {
  if (url.includes("sslmode=require")) {
    return url.replace("sslmode=require", "sslmode=verify-full");
  }

  return url;
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
