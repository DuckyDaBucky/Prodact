import {
  deriveNotifications,
  deriveProductSignals,
  formatCurrency,
  listDemoProducts,
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
  "Messages",
  "Store Layout",
  "Settings",
];

export async function POST(request: Request) {
  await requireSession();

  const payload = (await request.json().catch(() => ({}))) as AssistantRequest;
  const question = typeof payload.question === "string" ? payload.question.trim() : "";

  if (question.length < 2) {
    return Response.json({ error: "Ask a question first." }, { status: 400 });
  }

  const products = await listDemoProducts(16).catch(() => []);
  const notifications = deriveNotifications(products);
  const sampleProducts = products.slice(0, 6).map((product) => {
    const signals = deriveProductSignals(product);

    return {
      title: product.title,
      category: product.primaryCategory,
      price: formatCurrency(product.finalPrice, product.currency),
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      inventoryRisk: signals.inventoryRisk,
    };
  });

  const reply = await generateWorkspaceAssistantReply(question, {
    productCount: products.length,
    alertCount: notifications.length,
    featureAreas,
    sampleProducts,
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
