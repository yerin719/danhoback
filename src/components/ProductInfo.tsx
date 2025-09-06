"use client";

import { getProteinTypeDisplayName, ProductForm, ProteinType } from "@/features/products/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface ProductInfoProps {
  productInfo: {
    id: string;
    name: string;
    protein_type: ProteinType;
    form: ProductForm;
    is_active: boolean;
  };
  brandInfo: {
    id: string;
    name: string;
    name_en?: string | null;
    logo_url?: string | null;
    website?: string | null;
    is_active: boolean;
  };
  variant: {
    id: string;
    name: string;
    total_amount?: number | null;
    servings_per_container?: number | null;
    package_type?: string | null;
  };
}

export default function ProductInfo({ productInfo, brandInfo, variant }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* 브랜드 */}
      <div className="flex items-center gap-1">
        <Avatar>
          <AvatarImage src={brandInfo?.logo_url || ""} />
          <AvatarFallback>{brandInfo?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{brandInfo?.name}</span>
      </div>

      {/* 제품명 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
          {variant.name || productInfo.name}
        </h1>
        {/* 칩들 */}
        <div className="flex flex-wrap gap-2">
          {/* 단백질 종류 칩 */}
          <Badge variant="outline" className="text-sm">
            {getProteinTypeDisplayName(productInfo.protein_type)}
          </Badge>
          {/* 총 내용량 칩 */}
          {variant.total_amount && (
            <Badge variant="outline" className="text-sm">
              {variant.total_amount}g
            </Badge>
          )}
          {/* 회분 칩 - 벌크일 때만 노출 */}
          {variant.servings_per_container && variant.package_type === "bulk" && (
            <Badge variant="outline" className="text-sm">
              {variant.servings_per_container}회분
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
