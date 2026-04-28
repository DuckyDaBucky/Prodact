import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { recommendationRun, targetProduct } from "@/db/schema";

export type TargetProductRecord = typeof targetProduct.$inferSelect;

export type Recommendation = {
  product: TargetProductRecord;
  score: number;
  reasons: string[];
};

export type RecommendationResult = {
  sourceProduct: TargetProductRecord;
  recommendations: Recommendation[];
  provider: string;
  generatedAt: Date;
};

export interface RecommendationProvider {
  recommend(
    sourceId: string,
    options?: {
      limit?: number;
      persist?: boolean;
    },
  ): Promise<RecommendationResult>;
}

const PROVIDER_NAME = "heuristic-v1";

function toNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTokens(values: string[]) {
  return new Set(
    values
      .flatMap((value) => value.split(/[>/|,]/))
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

function jaccardSimilarity(left: Set<string>, right: Set<string>) {
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersection = 0;

  for (const token of left) {
    if (right.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...left, ...right]).size;
  return union > 0 ? intersection / union : 0;
}

function priceProximity(sourcePrice: number | null, candidatePrice: number | null) {
  if (!sourcePrice || !candidatePrice || sourcePrice <= 0) {
    return 0;
  }

  const allowedGap = sourcePrice * 0.25;
  const difference = Math.abs(sourcePrice - candidatePrice);

  if (difference > allowedGap) {
    return 0;
  }

  return Math.max(0, 1 - difference / allowedGap);
}

function ratingQuality(rating: number | null, reviewsCount: number | null) {
  if (!rating || rating < 4) {
    return 0;
  }

  const ratingScore = Math.min(1, (rating - 4) / 1);
  const reviewVolumeScore = Math.min(
    1,
    Math.log10((reviewsCount ?? 0) + 1) / Math.log10(1000),
  );

  return 0.65 * ratingScore + 0.35 * reviewVolumeScore;
}

function buildRecommendationHintSet(product: TargetProductRecord) {
  return new Set(
    product.recommendations.flatMap((entry) => {
      if (typeof entry === "string") {
        const lowered = entry.trim().toLowerCase();
        return lowered ? [lowered] : [];
      }

      const productId =
        typeof entry.product_id === "string" ? entry.product_id.trim().toLowerCase() : null;
      const title = typeof entry.title === "string" ? entry.title.trim().toLowerCase() : null;
      const name = typeof entry.name === "string" ? entry.name.trim().toLowerCase() : null;
      const url = typeof entry.url === "string" ? entry.url.trim().toLowerCase() : null;

      return [productId, title, name, url].filter((value): value is string => Boolean(value));
    }),
  );
}

function coRecommendationBonus(sourceHints: Set<string>, candidate: TargetProductRecord) {
  const keys = [
    candidate.productId.toLowerCase(),
    candidate.title.toLowerCase(),
    candidate.url.toLowerCase(),
  ];

  return keys.some((key) => sourceHints.has(key)) ? 1 : 0;
}

function buildReasons(params: {
  sourceProduct: TargetProductRecord;
  candidate: TargetProductRecord;
  categoryScore: number;
  priceScore: number;
  ratingScore: number;
  coRecommendationScore: number;
}) {
  const reasons: string[] = [];
  const {
    sourceProduct,
    candidate,
    categoryScore,
    priceScore,
    ratingScore,
    coRecommendationScore,
  } = params;

  if (categoryScore >= 0.2) {
    reasons.push(
      `Shares category context with ${sourceProduct.primaryCategory ?? "the selected product"}.`,
    );
  }

  if (priceScore > 0) {
    const sourcePrice = toNumber(sourceProduct.finalPrice);
    const candidatePrice = toNumber(candidate.finalPrice);

    if (sourcePrice && candidatePrice) {
      const delta = Math.round((Math.abs(sourcePrice - candidatePrice) / sourcePrice) * 100);
      reasons.push(`Within ${delta}% of the source product's price.`);
    }
  }

  if (ratingScore > 0) {
    reasons.push(
      `Strong shopper feedback (${candidate.rating ?? "n/a"} stars across ${candidate.reviewsCount ?? 0} reviews).`,
    );
  }

  if (coRecommendationScore > 0) {
    reasons.push("Appears in the dataset's built-in recommendation signals.");
  }

  return reasons;
}

async function persistRecommendationRun(result: RecommendationResult) {
  await db.insert(recommendationRun).values({
    id: randomUUID(),
    sourceProductId: result.sourceProduct.productId,
    provider: result.provider,
    payload: result.recommendations.map((recommendation) => ({
      productId: recommendation.product.productId,
      score: recommendation.score,
      reasons: recommendation.reasons,
    })),
    createdAt: result.generatedAt,
  });
}

export async function listTargetProductsForPicker(limit = 250) {
  return db
    .select({
      productId: targetProduct.productId,
      title: targetProduct.title,
      primaryCategory: targetProduct.primaryCategory,
    })
    .from(targetProduct)
    .orderBy(targetProduct.title)
    .limit(limit);
}

export async function getTargetProductById(productId: string) {
  const [product] = await db
    .select()
    .from(targetProduct)
    .where(eq(targetProduct.productId, productId))
    .limit(1);

  return product ?? null;
}

export async function getFirstTargetProduct() {
  const [product] = await db.select().from(targetProduct).orderBy(targetProduct.title).limit(1);
  return product ?? null;
}

export async function getLatestRecommendationRun(sourceProductId: string) {
  const [latestRun] = await db
    .select()
    .from(recommendationRun)
    .where(eq(recommendationRun.sourceProductId, sourceProductId))
    .orderBy(desc(recommendationRun.createdAt))
    .limit(1);

  return latestRun ?? null;
}

export class HeuristicRecommendationProvider implements RecommendationProvider {
  async recommend(
    sourceId: string,
    options?: {
      limit?: number;
      persist?: boolean;
    },
  ): Promise<RecommendationResult> {
    const limit = options?.limit ?? 5;
    const persist = options?.persist ?? true;

    const sourceProduct = await getTargetProductById(sourceId);

    if (!sourceProduct) {
      throw new Error(`Target product ${sourceId} was not found.`);
    }

    const allProducts = await db.select().from(targetProduct);
    const otherProducts = allProducts.filter((product) => product.productId !== sourceId);
    const sourceCategoryTokens = normalizeTokens([
      ...sourceProduct.breadcrumbs,
      ...sourceProduct.relatedCategories,
      sourceProduct.primaryCategory ?? "",
    ]);
    const sourceHints = buildRecommendationHintSet(sourceProduct);
    const sourcePrice = toNumber(sourceProduct.finalPrice);

    const recommendations = otherProducts
      .map((candidate) => {
        const candidateCategoryTokens = normalizeTokens([
          ...candidate.breadcrumbs,
          ...candidate.relatedCategories,
          candidate.primaryCategory ?? "",
        ]);

        const categoryScore = jaccardSimilarity(sourceCategoryTokens, candidateCategoryTokens);
        const priceScore = priceProximity(sourcePrice, toNumber(candidate.finalPrice));
        const candidateRatingScore = ratingQuality(
          toNumber(candidate.rating),
          candidate.reviewsCount,
        );
        const coRecommendationScore = coRecommendationBonus(sourceHints, candidate);

        const score =
          categoryScore * 0.4 +
          priceScore * 0.25 +
          candidateRatingScore * 0.2 +
          coRecommendationScore * 0.15;

        return {
          product: candidate,
          score: Number(score.toFixed(3)),
          reasons: buildReasons({
            sourceProduct,
            candidate,
            categoryScore,
            priceScore,
            ratingScore: candidateRatingScore,
            coRecommendationScore,
          }),
        };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);

    const result: RecommendationResult = {
      sourceProduct,
      recommendations,
      provider: PROVIDER_NAME,
      generatedAt: new Date(),
    };

    if (persist) {
      await persistRecommendationRun(result);
    }

    return result;
  }
}

export const recommendationService: RecommendationProvider =
  new HeuristicRecommendationProvider();
