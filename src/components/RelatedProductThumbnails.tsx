"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  flavor: string;
  nutritionFacts: {
    servingSize: number;
    calories: number;
    carbs: number;
    sugar: number;
    protein: number;
    fat?: number;
  };
}

interface RelatedProductThumbnailsProps {
  relatedProducts: Product[];
  currentProductId: string;
}

export default function RelatedProductThumbnails({
  relatedProducts,
  currentProductId,
}: RelatedProductThumbnailsProps) {
  // 현재 제품 제외
  const filteredProducts = relatedProducts.filter((product) => product.id !== currentProductId);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group block">
            <div className="space-y-1">
              {/* 썸네일 이미지 */}
              <div className="aspect-square relative rounded-md overflow-hidden border border-muted transition-colors group-hover:border-muted-foreground">
                <ProductImage
                  src={product.image}
                  alt={`${product.name} 썸네일`}
                  className="object-cover"
                />
              </div>

              {/* 맛 라벨 */}
              <p className="text-[10px] text-center text-muted-foreground group-hover:text-foreground transition-colors truncate">
                {product.flavor}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
