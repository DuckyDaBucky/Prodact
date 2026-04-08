import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://demo:demo@localhost:5432/prodact?sslmode=require";

const sql = neon(databaseUrl);

export const db = drizzle({
  client: sql,
  schema,
});

export { schema };
