import { generateProductAiInsight } from "@/lib/gemini";
import { getTargetProductById, recommendationService } from "@/lib/recommendations";
import { requireSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  await requireSession();

  const { productId } = await context.params;
  const product = await getTargetProductById(productId);

  if (!product) {
    return Response.json({ error: `Target product ${productId} was not found.` }, { status: 404 });
  }

  const recommendationResult = await recommendationService
    .recommend(product.productId, {
      limit: 5,
      persist: false,
    })
    .catch(() => null);
  const insight = await generateProductAiInsight(
    product,
    recommendationResult?.recommendations ?? [],
  );

  return Response.json(
    {
      productId: product.productId,
      insight,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
