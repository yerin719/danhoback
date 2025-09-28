"use client";

import { ProductVariant } from "@/features/products/hooks/useProductDetail";
import Link from "next/link";
import ProductImage from "./ProductImage";

interface RelatedProductThumbnailsProps {
  variants: ProductVariant[];
  currentVariantId: string;
}

export default function RelatedProductThumbnails({
  variants,
  currentVariantId,
}: RelatedProductThumbnailsProps) {
  // 현재 variant 제외
  const filteredVariants = variants.filter((variant) => variant.id !== currentVariantId);

  if (filteredVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8">
        {filteredVariants.map((variant) => {
          const imageUrl = (() => {
            // primary_image가 있으면 우선 사용
            if (variant.primary_image) {
              return variant.primary_image;
            }

            // images가 배열이면 첫 번째 이미지 사용
            if (Array.isArray(variant.images) && variant.images.length > 0) {
              const firstImage = variant.images[0];
              return typeof firstImage === "string" ? firstImage : "/placeholder.svg";
            }

            return "/placeholder.svg";
          })();

          return (
            <Link key={variant.id} href={`/products/${variant.slug}`} className="group block">
              <div className="space-y-1">
                {/* 썸네일 이미지 */}
                <div className="aspect-square relative rounded-md overflow-hidden border border-muted transition-colors group-hover:border-muted-foreground">
                  <ProductImage
                    src={imageUrl}
                    alt={variant.name || "제품 이미지"}
                    className="object-cover"
                  />
                </div>

                {/* 맛 라벨 */}
                <p className="text-[10px] text-center text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {variant.flavor?.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
