import { getProductDetail } from "@/features/products/queries";
import { useQuery } from "@tanstack/react-query";

export function useProductDetail(productSlug: string) {
  return useQuery({
    queryKey: ["product", "detail", productSlug],
    queryFn: () => getProductDetail(productSlug),
    enabled: !!productSlug,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

// 자동 추론된 타입들
export type ProductDetail = Awaited<ReturnType<typeof getProductDetail>>;
export type ProductBrand = NonNullable<ProductDetail>["brand_info"];
export type ProductVariant = NonNullable<ProductDetail>["related_skus"][number];
export type SelectedSku = NonNullable<ProductDetail>["selected_sku"];
export type ProductNutrition = NonNullable<SelectedSku["nutrition"]>;
