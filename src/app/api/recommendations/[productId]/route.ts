import { recommendationService } from "@/lib/recommendations";
import { requireSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  await requireSession();

  const { productId } = await context.params;
  const { searchParams } = new URL(request.url);
  const parsedLimit = Number.parseInt(searchParams.get("limit") ?? "5", 10);
  const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 5;

  try {
    const result = await recommendationService.recommend(productId, { limit });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown recommendation error.";
    const status = message.includes("was not found") ? 404 : 500;

    return Response.json({ error: message }, { status });
  }
}
