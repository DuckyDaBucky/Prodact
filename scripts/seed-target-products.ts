import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

import { inArray } from "drizzle-orm";
import { config as loadEnv } from "dotenv";
import { parse } from "csv-parse";

import { targetProduct } from "../src/db/schema";

const REMOTE_DATASET_URL =
  "https://raw.githubusercontent.com/luminati-io/Target-dataset-samples/main/target-products.csv";
const BATCH_SIZE = 200;

type CsvRow = Record<string, string | undefined>;
type TargetProductInsert = typeof targetProduct.$inferInsert;

function loadEnvironment() {
  loadEnv({ path: ".env.local", override: false });
  loadEnv({ override: false });
}

function parseArgs(argv: string[]) {
  const args = {
    file: undefined as string | undefined,
    limit: undefined as number | undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--file") {
      args.file = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      const parsedLimit = Number.parseInt(argv[index + 1] ?? "", 10);
      if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
        args.limit = parsedLimit;
      }
      index += 1;
    }
  }

  return args;
}

async function openInputStream(filePath?: string) {
  if (filePath) {
    return createReadStream(filePath);
  }

  const response = await fetch(REMOTE_DATASET_URL);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download dataset: ${response.status} ${response.statusText}`);
  }

  return Readable.fromWeb(response.body as never);
}

function normalizeDatabaseUrl(url: string) {
  if (url.includes("sslmode=require")) {
    return url.replace("sslmode=require", "sslmode=verify-full");
  }

  return url;
}

function cleanString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseInteger(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/[^\d-]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNumericString(value: string | undefined, fractionDigits = 2) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/[^\d.-]/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed.toFixed(fractionDigits) : null;
}

function parseJsonish<T>(value: string | undefined, fallback: T): T {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  const candidates = [
    trimmed,
    trimmed.replace(/""/g, '"'),
    trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed,
  ];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;

      if (typeof parsed === "string" && parsed !== candidate) {
        try {
          return JSON.parse(parsed) as T;
        } catch {
          return parsed as T;
        }
      }

      return parsed as T;
    } catch {
      continue;
    }
  }

  return fallback;
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.trim();
      }

      if (entry && typeof entry === "object") {
        const label =
          ("title" in entry && typeof entry.title === "string" && entry.title) ||
          ("name" in entry && typeof entry.name === "string" && entry.name) ||
          ("url" in entry && typeof entry.url === "string" && entry.url);

        if (label) {
          return label.trim();
        }
      }

      return null;
    })
    .filter((entry): entry is string => Boolean(entry));
}

function normalizeMixedArray(value: unknown): Array<Record<string, unknown> | string> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<Array<Record<string, unknown> | string>>((result, entry) => {
    if (typeof entry === "string") {
      const trimmed = entry.trim();
      if (trimmed) {
        result.push(trimmed);
      }

      return result;
    }

    if (entry && typeof entry === "object") {
      result.push(entry as Record<string, unknown>);
    }

    return result;
  }, []);
}

function normalizeSpecifications(
  value: unknown,
): Record<string, string | string[] | null> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => {
    if (Array.isArray(entryValue)) {
      return [
        key,
        entryValue
          .map((item) => (typeof item === "string" ? item.trim() : String(item)))
          .filter(Boolean),
      ] as const;
    }

    if (entryValue == null) {
      return [key, null] as const;
    }

    if (typeof entryValue === "string") {
      return [key, entryValue.trim() || null] as const;
    }

    return [key, String(entryValue)] as const;
  });

  return Object.fromEntries(entries);
}

function normalizeStars(value: unknown): Record<string, number> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, entryValue]) => [key, Number(entryValue)] as const)
    .filter(([, entryValue]) => Number.isFinite(entryValue));

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function toText(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (value == null) {
    return null;
  }

  return JSON.stringify(value);
}

function buildProductRow(record: CsvRow): TargetProductInsert | null {
  const productId = cleanString(record.product_id);
  const url = cleanString(record.url);
  const title = cleanString(record.title);

  if (!productId || !url || !title) {
    return null;
  }

  const breadcrumbs = normalizeStringArray(parseJsonish(record.breadcrumbs, []));
  const relatedCategories = normalizeStringArray(parseJsonish(record.related_categories, []));
  const images = normalizeStringArray(parseJsonish(record.images, []));
  const primaryCategory = breadcrumbs.at(-1) ?? relatedCategories.at(0) ?? null;

  return {
    productId,
    url,
    title,
    productDescription: cleanString(record.product_description),
    rating: parseNumericString(record.rating),
    reviewsCount: parseInteger(record.reviews_count),
    initialPrice: parseNumericString(record.initial_price),
    finalPrice: parseNumericString(record.final_price),
    currency: cleanString(record.currency),
    sellerName: cleanString(record.seller_name),
    breadcrumbs,
    relatedCategories,
    images,
    productSpecifications: normalizeSpecifications(
      parseJsonish(record.product_specifications, null),
    ),
    shippingReturnsPolicy: toText(
      parseJsonish(record.shipping_returns_policy, record.shipping_returns_policy ?? null),
    ),
    amountOfStars: normalizeStars(parseJsonish(record.amount_of_stars, null)),
    recommendations: normalizeMixedArray(parseJsonish(record.recommendations, [])),
    findAlternative: normalizeMixedArray(parseJsonish(record.find_alternative, [])),
    summaryOfReviews: toText(
      parseJsonish(record.summary_of_reviews, record.summary_of_reviews ?? null),
    ),
    primaryCategory,
  };
}

function buildUpsertSet(product: TargetProductInsert) {
  return {
    url: product.url,
    title: product.title,
    productDescription: product.productDescription,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    initialPrice: product.initialPrice,
    finalPrice: product.finalPrice,
    currency: product.currency,
    sellerName: product.sellerName,
    breadcrumbs: product.breadcrumbs,
    relatedCategories: product.relatedCategories,
    images: product.images,
    productSpecifications: product.productSpecifications,
    shippingReturnsPolicy: product.shippingReturnsPolicy,
    amountOfStars: product.amountOfStars,
    recommendations: product.recommendations,
    findAlternative: product.findAlternative,
    summaryOfReviews: product.summaryOfReviews,
    primaryCategory: product.primaryCategory,
    updatedAt: new Date(),
  };
}

async function flushBatch(
  batch: TargetProductInsert[],
  db: Awaited<ReturnType<typeof importDb>>["db"],
) {
  if (batch.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  const productIds = batch.map((product) => product.productId);
  const existingProducts = await db
    .select({ productId: targetProduct.productId })
    .from(targetProduct)
    .where(inArray(targetProduct.productId, productIds));

  const existingIds = new Set(existingProducts.map((product) => product.productId));

  for (const product of batch) {
    await db
      .insert(targetProduct)
      .values(product)
      .onConflictDoUpdate({
        target: targetProduct.productId,
        set: buildUpsertSet(product),
      });
  }

  return {
    inserted: batch.length - existingIds.size,
    updated: existingIds.size,
  };
}

async function importDb() {
  loadEnvironment();

  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);
  }

  return import("../src/db/index");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { db } = await importDb();
  const input = await openInputStream(args.file);
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
  });

  let processed = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let batch: TargetProductInsert[] = [];

  for await (const record of input.pipe(parser) as AsyncIterable<CsvRow>) {
    if (args.limit && processed >= args.limit) {
      break;
    }

    processed += 1;
    const normalized = buildProductRow(record);

    if (!normalized) {
      skipped += 1;
      continue;
    }

    batch.push(normalized);

    if (batch.length >= BATCH_SIZE) {
      const result = await flushBatch(batch, db);
      inserted += result.inserted;
      updated += result.updated;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await flushBatch(batch, db);
    inserted += result.inserted;
    updated += result.updated;
  }

  console.log(
    `Seed complete. processed=${processed} inserted=${inserted} updated=${updated} skipped=${skipped}`,
  );
}

main().catch((error) => {
  console.error("Target product seed failed.");
  console.error(error);
  process.exit(1);
});
