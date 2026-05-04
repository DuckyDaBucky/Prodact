import { config as loadEnv } from "dotenv";
import { neon } from "@neondatabase/serverless";

function loadEnvironment() {
  loadEnv({ path: ".env.local", override: false });
  loadEnv({ override: false });
}

function normalizeDatabaseUrl(url: string) {
  let normalized = url.trim().replace(/^['"]|['"]$/g, "");
  normalized = normalized.replace("sslmode=require", "sslmode=verify-full");
  normalized = normalized.replace(/([?&])channel_binding=require(&?)/, (_match, prefix, suffix) =>
    suffix ? prefix : "",
  );

  return normalized;
}

async function main() {
  loadEnvironment();

  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);
  }

  const [{ db }, { migrate }] = await Promise.all([
    import("../src/db/index"),
    import("drizzle-orm/neon-http/migrator"),
  ]);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
  } catch (error) {
    if (process.env.DATABASE_URL && (await schemaLooksApplied(process.env.DATABASE_URL))) {
      console.log("Existing Drizzle schema detected; migrations are already applied.");
      return;
    }

    throw error;
  }

  console.log("Drizzle migrations applied.");
}

async function schemaLooksApplied(databaseUrl: string) {
  const sql = neon(databaseUrl);
  const rows = await sql.query(
    `select
      to_regclass('public.user') as user_table,
      to_regclass('public.target_product') as target_product_table,
      to_regclass('public.recommendation_run') as recommendation_run_table,
      to_regclass('public.direct_message') as direct_message_table`,
  );
  const firstRow = rows[0] as
    | {
        user_table: string | null;
        target_product_table: string | null;
        recommendation_run_table: string | null;
        direct_message_table: string | null;
      }
    | undefined;

  return Boolean(
    firstRow?.user_table &&
      firstRow.target_product_table &&
      firstRow.recommendation_run_table &&
      firstRow.direct_message_table,
  );
}

main().catch((error) => {
  console.error("Drizzle migration failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
