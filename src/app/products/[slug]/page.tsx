import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getProductDetail } from "@/features/products/queries";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  
  // 서버사이드에서 데이터 페칭
  const productData = await getProductDetail(slug, supabase);
  
  if (!productData) {
    notFound();
  }

  // React Query를 위한 QueryClient 생성
  const queryClient = new QueryClient();
  
  // 데이터 프리페칭
  await queryClient.prefetchQuery({
    queryKey: ["product", "detail", slug],
    queryFn: () => productData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailClient slug={slug} />
    </HydrationBoundary>
  );
}