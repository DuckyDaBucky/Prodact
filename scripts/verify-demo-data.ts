import { config as loadEnv } from "dotenv";

import { targetProduct } from "../src/db/schema";

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

  const [{ db }, { recommendationService }, { generateProductAiInsight }] = await Promise.all([
    import("../src/db/index"),
    import("../src/lib/recommendations"),
    import("../src/lib/gemini"),
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
  const insight = await generateProductAiInsight(sourceProduct, result.recommendations);

  console.log("Prodact demo data verification passed.");
  console.log(`Seeded product checked: ${sourceProduct.title}`);
  console.log(`Recommendations returned: ${result.recommendations.length}`);
  console.log(`Provider: ${result.provider}`);
  console.log(`AI insight provider: ${insight.provider} (${insight.model})`);
}

main().catch((error) => {
  console.error("Prodact demo data verification failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
