import type { Recommendation, TargetProductRecord } from "@/lib/recommendations";

import { deriveProductSignals, formatCurrency, formatNumber } from "./demo-data";

export type ProductAiInsight = {
  provider: "gemini" | "fallback";
  model: string;
  summary: string;
  risks: string[];
  recommendationRationale: string;
  nextActions: string[];
  generatedAt: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type GeminiInsightPayload = {
  summary?: unknown;
  risks?: unknown;
  recommendationRationale?: unknown;
  nextActions?: unknown;
};

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

function parseGeminiJson(text: string): GeminiInsightPayload | null {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  const jsonMatch = withoutFence.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return null;
  }

  try {
    return JSON.parse(jsonMatch[0]) as GeminiInsightPayload;
  } catch {
    return null;
  }
}

function extractStringField(text: string, field: string) {
  const match = text.match(new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"\\s*,`, "i"));
  return match?.[1]
    ?.replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanGeminiText(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/[{}[\]"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeEnvValue(value: string | undefined, fallback: string) {
  const normalized = value?.trim().replace(/^["']|["']$/g, "");

  return normalized || fallback;
}

function buildFallbackInsight(
  product: TargetProductRecord,
  recommendations: Recommendation[] = [],
  reason = "Gemini was unavailable, so Prodact used deterministic demo analysis.",
): ProductAiInsight {
  const signals = deriveProductSignals(product);
  const topRecommendation = recommendations[0]?.product.title;
  const risks = [
    signals.inventoryRisk === "high"
      ? "Restock risk is high because on-hand inventory is below the reorder point."
      : "Inventory risk is currently manageable based on derived on-hand stock.",
    signals.discountPercent
      ? `The product is ${signals.discountPercent}% below its initial price.`
      : "No markdown signal is visible from the seeded price fields.",
    signals.completeness < 80
      ? `Seeded product data is ${signals.completeness}% complete, so analysis should be reviewed for gaps.`
      : "The seeded row has enough product detail for a strong demo analysis.",
  ];

  return {
    provider: "fallback",
    model: "heuristic-demo",
    summary: `${product.title} is a ${product.primaryCategory ?? "Target"} product with ${product.rating ?? "n/a"} stars, ${formatNumber(product.reviewsCount)} reviews, and a current price of ${formatCurrency(product.finalPrice, product.currency ?? "USD")}. ${reason}`,
    risks,
    recommendationRationale: topRecommendation
      ? `${topRecommendation} is the strongest adjacent item because the local recommender matched category, price, ratings, and dataset hints.`
      : "No strong adjacent item was available, so the safest action is to inspect category and product data quality first.",
    nextActions: [
      signals.inventoryRisk === "high" ? "Prepare a restock request for this product." : "Monitor inventory during the next sales cycle.",
      signals.priceGapPercent !== null
        ? `Compare against ${signals.competitorName}; the derived price gap is ${signals.priceGapPercent}%.`
        : "Confirm competitor price data before pricing action.",
      "Use Product Analysis recommendations for bundle or comparison planning.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

function buildGeminiTextInsight(
  product: TargetProductRecord,
  recommendations: Recommendation[],
  model: string,
  text: string,
): ProductAiInsight {
  const fallback = buildFallbackInsight(product, recommendations);
  const summary = extractStringField(text, "summary") ?? cleanGeminiText(text).slice(0, 700);

  return {
    ...fallback,
    provider: "gemini",
    model,
    summary: summary || fallback.summary,
    generatedAt: new Date().toISOString(),
  };
}

function truncate(value: string | null, maxLength: number) {
  if (!value) {
    return null;
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function summarizeDatasetHints(product: TargetProductRecord) {
  return product.recommendations.slice(0, 4).map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }

    const title = typeof entry.title === "string" ? entry.title : null;
    const name = typeof entry.name === "string" ? entry.name : null;
    const productId = typeof entry.product_id === "string" ? entry.product_id : null;

    return title ?? name ?? productId ?? "dataset recommendation hint";
  });
}

function buildPrompt(product: TargetProductRecord, recommendations: Recommendation[]) {
  const signals = deriveProductSignals(product);
  const recommendationSummary = recommendations.slice(0, 5).map((recommendation) => ({
    productId: recommendation.product.productId,
    title: recommendation.product.title,
    category: recommendation.product.primaryCategory,
    score: recommendation.score,
    reasons: recommendation.reasons,
  }));

  return `You are Prodact's AI Recommendation Service for a Target internal product intelligence demo.
Use only the supplied seeded dataset fields and derived signals. Do not invent live enterprise integrations.
Return strict JSON with exactly these keys:
{
  "summary": "2 sentence product analysis",
  "risks": ["risk 1", "risk 2", "risk 3"],
  "recommendationRationale": "plain-language rationale for the top related products",
  "nextActions": ["action 1", "action 2", "action 3"]
}

Product:
${JSON.stringify(
  {
    productId: product.productId,
    title: product.title,
    category: product.primaryCategory,
    price: product.finalPrice,
    initialPrice: product.initialPrice,
    currency: product.currency,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    seller: product.sellerName,
    description: truncate(product.productDescription, 700),
    breadcrumbs: product.breadcrumbs,
    reviewSummary: truncate(product.summaryOfReviews, 500),
    datasetRecommendationHints: summarizeDatasetHints(product),
    derivedSignals: signals,
    rankedRecommendations: recommendationSummary,
  },
  null,
  2,
)}`;
}

export async function generateProductAiInsight(
  product: TargetProductRecord,
  recommendations: Recommendation[] = [],
): Promise<ProductAiInsight> {
  const apiKey = normalizeEnvValue(process.env.GEMINI_API_KEY, "");
  const model = normalizeEnvValue(process.env.GEMINI_MODEL, "gemini-3-flash-preview");

  if (!apiKey) {
    return buildFallbackInsight(product, recommendations, "No Gemini API key is configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(product, recommendations) }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 700,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return buildFallbackInsight(
        product,
        recommendations,
        `Gemini returned HTTP ${response.status}.`,
      );
    }

    const data = (await response.json()) as GeminiResponse;
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter((part): part is string => Boolean(part))
        .join("\n") ?? "";
    const parsed = parseGeminiJson(text);

    if (!parsed || typeof parsed.summary !== "string") {
      if (process.env.GEMINI_DEBUG === "1") {
        console.error("Gemini raw response:", text.slice(0, 1200));
      }

      if (text.trim()) {
        return buildGeminiTextInsight(product, recommendations, model, text);
      }

      return buildFallbackInsight(product, recommendations, "Gemini returned an unreadable response.");
    }

    return {
      provider: "gemini",
      model,
      summary: parsed.summary,
      risks: asStringArray(parsed.risks).slice(0, 4),
      recommendationRationale:
        typeof parsed.recommendationRationale === "string"
          ? parsed.recommendationRationale
          : "Gemini processed the seeded product fields and recommendation candidates.",
      nextActions: asStringArray(parsed.nextActions).slice(0, 4),
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "Gemini timed out."
        : "Gemini request failed.";

    return buildFallbackInsight(product, recommendations, reason);
  } finally {
    clearTimeout(timeout);
  }
}
