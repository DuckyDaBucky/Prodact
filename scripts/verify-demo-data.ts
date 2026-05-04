import { config as loadEnv } from "dotenv";

import { targetProduct } from "../src/db/schema";

function loadEnvironment() {
  loadEnv({ path: ".env.local", override: false });
  loadEnv({ override: false });
}

function normalizeDatabaseUrl(url: string) {
  if (url.includes("sslmode=require")) {
    return url.replace("sslmode=require", "sslmode=verify-full");
  }

  return url;
}

async function main() {
  loadEnvironment();

  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);
  }

  const [{ db }, { recommendationService }] = await Promise.all([
    import("../src/db/index"),
    import("../src/lib/recommendations"),
  ]);

  const products = await db.select().from(targetProduct).limit(2);

  if (products.length === 0) {
    throw new Error(
      "No Target product rows were found. Run npm run db:migrate and npm run db:seed first.",
    );
  }

  const sourceProduct = products[0];
  const result = await recommendationService.recommend(sourceProduct.productId, {
    limit: 5,
    persist: false,
  });

  console.log("Prodact demo data verification passed.");
  console.log(`Seeded product checked: ${sourceProduct.title}`);
  console.log(`Recommendations returned: ${result.recommendations.length}`);
  console.log(`Provider: ${result.provider}`);
}

main().catch((error) => {
  console.error("Prodact demo data verification failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
