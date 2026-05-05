"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

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
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-strong)]">
        Choose seeded product
      </span>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 pr-10 text-sm text-[var(--target-ink)] outline-none transition focus:border-[var(--target-red)] focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-60"
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
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
      </div>
    </label>
  );
}
