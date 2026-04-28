"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProductOption = {
  productId: string;
  title: string;
  primaryCategory: string | null;
};

type ProductPickerProps = {
  currentProductId: string;
  products: ProductOption[];
};

export function ProductPicker({
  currentProductId,
  products,
}: ProductPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const options = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        label: product.primaryCategory
          ? `${product.title} (${product.primaryCategory})`
          : product.title,
      })),
    [products],
  );

  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-(--target-red)">
        Choose seeded product
      </span>
      <select
        className="w-full rounded-2xl border border-(--border) bg-white px-4 py-3 text-sm text-(--target-ink) outline-none transition focus:border-(--target-red)"
        defaultValue={currentProductId}
        disabled={isPending}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("productId", event.target.value);

          startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
          });
        }}
      >
        {options.map((product) => (
          <option key={product.productId} value={product.productId}>
            {product.label}
          </option>
        ))}
      </select>
    </label>
  );
}
