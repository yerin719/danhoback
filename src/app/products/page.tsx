import { searchProducts, getAllFilterOptions } from "@/features/products/queries";
import { parseSearchParams, type SearchParamsType } from "@/features/products/utils/urlParams";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import ProductsClient from "./ProductsClient";

interface ProductsPageProps {
  searchParams: Promise<SearchParamsType>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // URL 파라미터를 검증하고 유효하지 않은 값들을 제거
  const { filters, sortBy, sortOrder, hasInvalidParams, cleanedParams } = parseSearchParams(params);
  
  // 유효하지 않은 파라미터가 있으면 깨끗한 URL로 리다이렉트
  if (hasInvalidParams) {
    const cleanUrl = Object.keys(cleanedParams).length > 0 
      ? `/products?${new URLSearchParams(cleanedParams as Record<string, string>).toString()}`
      : "/products";
    redirect(cleanUrl);
  }

  // React Query 클라이언트 생성
  const queryClient = new QueryClient();
  
  // 서버용 Supabase 클라이언트 생성
  const supabaseClient = await createServerSupabaseClient();

  // 서버에서 데이터 prefetch (병렬 처리)
  await Promise.all([
    // 제품 목록 prefetch
    queryClient.prefetchQuery({
      queryKey: ["products", "search", filters, sortBy, sortOrder, 100, 0],
      queryFn: () => searchProducts(filters, sortBy, sortOrder, 100, 0, supabaseClient),
    }),
    // 필터 옵션 prefetch
    queryClient.prefetchQuery({
      queryKey: ["filters", "all"],
      queryFn: () => getAllFilterOptions(supabaseClient),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient
        initialFilters={filters}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
      />
    </HydrationBoundary>
  );
}
