import { asc, ilike, or } from "drizzle-orm";

import { db } from "@/db";
import { targetProduct } from "@/db/schema";
import type { TargetProductRecord } from "@/lib/recommendations";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatters = new Map<string, Intl.NumberFormat>();

export type DemoProductSignals = {
  completeness: number;
  discountPercent: number | null;
  stockOnHand: number;
  salesFloorUnits: number;
  backroomUnits: number;
  incomingUnits: number;
  reorderPoint: number;
  weeklySales: number;
  returnRate: number;
  inventoryRisk: "low" | "medium" | "high";
  alertSeverity: "low" | "medium" | "high";
  competitorPrice: number | null;
  competitorName: string;
  priceGapPercent: number | null;
  demandScore: number;
};

export type DerivedNotification = {
  id: string;
  type: "product" | "restock" | "pricing" | "data-quality";
  severity: "low" | "medium" | "high";
  title: string;
  body: string;
  productId: string;
  productTitle: string;
  status: "unread" | "read";
};

export function toNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrency(amount: string | number | null, currency: string | null = "USD") {
  if (amount === null || amount === undefined || amount === "") {
    return "Unavailable";
  }

  const parsedAmount = typeof amount === "number" ? amount : Number.parseFloat(amount);

  if (!Number.isFinite(parsedAmount)) {
    return String(amount);
  }

  const normalizedCurrency = currency?.trim().toUpperCase();
  const currencyCode =
    !normalizedCurrency || normalizedCurrency === "$" || normalizedCurrency.length !== 3
      ? "USD"
      : normalizedCurrency;
  let formatter = currencyFormatters.get(currencyCode);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    });
    currencyFormatters.set(currencyCode, formatter);
  }

  return formatter.format(parsedAmount);
}

export function formatNumber(value: number | null | undefined) {
  return numberFormatter.format(value ?? 0);
}

export function calculateDiscountPercent(product: TargetProductRecord) {
  const initialPrice = toNumber(product.initialPrice);
  const finalPrice = toNumber(product.finalPrice);

  if (!initialPrice || !finalPrice || initialPrice <= finalPrice) {
    return null;
  }

  return Math.round(((initialPrice - finalPrice) / initialPrice) * 100);
}

export function calculateCompleteness(product: TargetProductRecord) {
  const fields = [
    product.title,
    product.productDescription,
    product.rating,
    product.reviewsCount,
    product.finalPrice,
    product.primaryCategory,
    product.images[0],
    product.summaryOfReviews,
  ];
  const completeFields = fields.filter(
    (field) => field !== null && field !== undefined && field !== "",
  ).length;

  return Math.round((completeFields / fields.length) * 100);
}

export function stableHash(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function deriveProductSignals(product: TargetProductRecord): DemoProductSignals {
  const hash = stableHash(`${product.productId}:${product.title}`);
  const finalPrice = toNumber(product.finalPrice);
  const reviewsCount = product.reviewsCount ?? 0;
  const rating = toNumber(product.rating);
  const completeness = calculateCompleteness(product);
  const discountPercent = calculateDiscountPercent(product);
  const weeklySales = 36 + (hash % 420) + Math.min(260, Math.floor(reviewsCount / 18));
  const stockOnHand = 18 + ((hash >>> 3) % 240);
  const incomingUnits = (hash >>> 8) % 150;
  const reorderPoint = Math.max(35, Math.round(weeklySales * 0.62));
  const salesFloorUnits = Math.round(stockOnHand * (0.48 + ((hash % 17) / 100)));
  const backroomUnits = Math.max(0, stockOnHand - salesFloorUnits);
  const returnRate = Number((1.4 + ((hash >>> 5) % 84) / 10).toFixed(1));
  const demandScore = Math.min(99, Math.round(weeklySales / 8 + (rating ?? 3.8) * 12));
  const competitorName = hash % 2 === 0 ? "Walmart" : "Amazon";
  const competitorAdjustment = (((hash >>> 9) % 17) - 8) / 100;
  const competitorPrice = finalPrice
    ? Number((finalPrice * (1 + competitorAdjustment)).toFixed(2))
    : null;
  const priceGapPercent =
    finalPrice && competitorPrice
      ? Math.round(((finalPrice - competitorPrice) / finalPrice) * 100)
      : null;

  let inventoryRisk: DemoProductSignals["inventoryRisk"] = "low";
  if (stockOnHand < reorderPoint * 0.65) {
    inventoryRisk = "high";
  } else if (stockOnHand < reorderPoint) {
    inventoryRisk = "medium";
  }

  let alertSeverity: DemoProductSignals["alertSeverity"] = "low";
  if (inventoryRisk === "high" || completeness < 63 || (discountPercent ?? 0) >= 30) {
    alertSeverity = "high";
  } else if (inventoryRisk === "medium" || completeness < 80 || (discountPercent ?? 0) >= 15) {
    alertSeverity = "medium";
  }

  return {
    completeness,
    discountPercent,
    stockOnHand,
    salesFloorUnits,
    backroomUnits,
    incomingUnits,
    reorderPoint,
    weeklySales,
    returnRate,
    inventoryRisk,
    alertSeverity,
    competitorPrice,
    competitorName,
    priceGapPercent,
    demandScore,
  };
}

export async function listDemoProducts(limit = 250) {
  return db.select().from(targetProduct).orderBy(asc(targetProduct.title)).limit(limit);
}

export async function searchDemoProducts(query: string, limit = 40) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return listDemoProducts(limit);
  }

  return db
    .select()
    .from(targetProduct)
    .where(
      or(
        ilike(targetProduct.title, `%${normalizedQuery}%`),
        ilike(targetProduct.primaryCategory, `%${normalizedQuery}%`),
        ilike(targetProduct.productId, `%${normalizedQuery}%`),
      ),
    )
    .orderBy(asc(targetProduct.title))
    .limit(limit);
}

export function deriveNotifications(products: TargetProductRecord[]) {
  const notifications: DerivedNotification[] = [];

  for (const product of products) {
    const signals = deriveProductSignals(product);
    const rating = toNumber(product.rating);
    const reviewsCount = product.reviewsCount ?? 0;

    if (signals.inventoryRisk !== "low") {
      notifications.push({
        id: `restock-${product.productId}`,
        type: "restock",
        severity: signals.inventoryRisk === "high" ? "high" : "medium",
        title: "Restock review needed",
        body: `${product.title} has ${signals.stockOnHand} units on hand against a reorder point of ${signals.reorderPoint}.`,
        productId: product.productId,
        productTitle: product.title,
        status: signals.inventoryRisk === "high" ? "unread" : "read",
      });
    }

    if ((signals.discountPercent ?? 0) >= 15) {
      notifications.push({
        id: `pricing-${product.productId}`,
        type: "pricing",
        severity: (signals.discountPercent ?? 0) >= 30 ? "high" : "medium",
        title: "Markdown signal detected",
        body: `${product.title} is ${signals.discountPercent}% below its initial price.`,
        productId: product.productId,
        productTitle: product.title,
        status: "unread",
      });
    }

    if (rating !== null && rating < 4 && reviewsCount >= 50) {
      notifications.push({
        id: `product-${product.productId}`,
        type: "product",
        severity: "medium",
        title: "Low rating with review volume",
        body: `${product.title} has ${rating} stars across ${formatNumber(reviewsCount)} reviews.`,
        productId: product.productId,
        productTitle: product.title,
        status: "unread",
      });
    }

    if (signals.completeness < 75) {
      notifications.push({
        id: `quality-${product.productId}`,
        type: "data-quality",
        severity: signals.completeness < 63 ? "high" : "medium",
        title: "Product data needs cleanup",
        body: `${product.title} is ${signals.completeness}% complete in the seeded Target row.`,
        productId: product.productId,
        productTitle: product.title,
        status: "read",
      });
    }
  }

  return notifications
    .sort((left, right) => {
      const severityRank = { high: 3, medium: 2, low: 1 };
      return severityRank[right.severity] - severityRank[left.severity];
    })
    .slice(0, 18);
}
