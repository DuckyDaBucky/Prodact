import {
  deriveNotifications,
  deriveProductSignals,
  formatCurrency,
  listDemoProducts,
  searchDemoProducts,
} from "@/lib/demo-data";
import { generateWorkspaceAssistantReply } from "@/lib/gemini";
import { requireSession } from "@/lib/session";

type AssistantRequest = {
  question?: unknown;
};

const featureAreas = [
  "Dashboard",
  "Search",
  "Product Analysis",
  "Inventory",
  "Store Performance",
  "Competitor Analysis",
  "Notifications",
  "AskProdact",
  "Store Layout",
  "Settings",
];

const featureRoutes = [
  { route: "/dashboard", purpose: "MVP service evidence and executive overview" },
  { route: "/search", purpose: "DB-backed seeded Target product search" },
  { route: "/product-analysis", purpose: "Product details, recommendations, and AI insights" },
  { route: "/inventory", purpose: "Restock planning from derived inventory signals" },
  { route: "/store-performance", purpose: "Monthly sales and store performance demo" },
  { route: "/competitor-analysis", purpose: "Target vs Walmart pricing, stock, sales, sentiment" },
  { route: "/alerts", purpose: "Derived restock, pricing, product, and data-quality notifications" },
  { route: "/messages", purpose: "AI assistant grounded in app and database context" },
  { route: "/store-layout", purpose: "Current and recommended store layout concept" },
  { route: "/settings", purpose: "Workspace configuration and demo preferences" },
];

export async function POST(request: Request) {
  await requireSession();

  const payload = (await request.json().catch(() => ({}))) as AssistantRequest;
  const question = typeof payload.question === "string" ? payload.question.trim() : "";

  if (question.length < 2) {
    return Response.json({ error: "Ask a question first." }, { status: 400 });
  }

  const [products, matchedProducts] = await Promise.all([
    listDemoProducts(120).catch(() => []),
    searchDemoProducts(question, 8).catch(() => []),
  ]);
  const notifications = deriveNotifications(products);
  const highRiskCount = products.filter(
    (product) => deriveProductSignals(product).inventoryRisk === "high",
  ).length;
  const productContext = (matchedProducts.length > 0 ? matchedProducts : products.slice(0, 8)).map((product) => {
    const signals = deriveProductSignals(product);

    return {
      productId: product.productId,
      title: product.title,
      category: product.primaryCategory,
      price: formatCurrency(product.finalPrice, product.currency),
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      inventoryRisk: signals.inventoryRisk,
      stockOnHand: signals.stockOnHand,
      reorderPoint: signals.reorderPoint,
      weeklySales: signals.weeklySales,
    };
  });

  const reply = await generateWorkspaceAssistantReply(question, {
    productCount: products.length,
    alertCount: notifications.length,
    highRiskCount,
    featureAreas,
    featureRoutes,
    matchedProductCount: matchedProducts.length,
    sampleProducts: productContext,
  });

  return Response.json(
    {
      reply,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
