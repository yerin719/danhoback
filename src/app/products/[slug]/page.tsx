import { getProductDetail } from "@/features/products/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const productData = await getProductDetail(slug, supabase);

  if (!productData) {
    return {
      title: "제품을 찾을 수 없습니다 - 단호박",
      description: "요청하신 제품 정보를 찾을 수 없습니다.",
    };
  }

  const productName = productData.selected_sku?.name || productData.product_line_info?.name;
  const brandName = productData.brand_info?.name;
  const productDescription = productData.product_line_info?.description;

  // SEO 키워드 생성
  const baseKeywords = [
    "단백질보충",
    "단백질쉐이크",
    "단백질다이어트",
    "단백질음식",
    "다이어트쉐이크",
    "다이어트식단",
    "단기다이어트",
    "식사대용",
    "식사대용단백질",
    "다이어트식사대용",
    "단백질파우더",
  ];

  // 브랜드명 추가
  const keywords = [...baseKeywords, brandName].join(", ");

  return {
    title: productName,
    description: productDescription || `${brandName} ${productName}`,
    keywords,
    openGraph: {
      title: `${productName} - 단호박`,
      description: productDescription || `${brandName} ${productName}`,
      type: "website",
      locale: "ko_KR",
      siteName: "단호박",
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
