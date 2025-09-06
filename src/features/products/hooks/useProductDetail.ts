import { getProductDetail } from "@/features/products/queries";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ["product", "detail", productId],
    queryFn: () => getProductDetail(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

// 자동 추론된 타입들
export type ProductDetail = Awaited<ReturnType<typeof getProductDetail>>;
export type ProductBrand = NonNullable<ProductDetail>["brand_info"];
export type ProductVariant = NonNullable<ProductDetail>["related_variants"][number];
export type SelectedVariant = NonNullable<ProductDetail>["selected_variant"];
export type ProductNutrition = NonNullable<SelectedVariant["nutrition"]>;
