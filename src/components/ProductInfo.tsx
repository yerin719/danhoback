"use client";

import RequestButton from "@/components/RequestButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface ProductInfoProps {
  productLineInfo: {
    id: string;
    name: string;
    description?: string;
    form: string;
  };
  brandInfo: {
    id: string;
    name: string;
    name_en?: string;
    logo_url?: string;
    website?: string;
    is_active?: boolean;
  };
  selectedSku: {
    id: string;
    name: string;
    size: string;
    servings_per_container?: number;
    package_type?: string;
    protein_types?: Array<{
      id: string;
      type: string;
      name: string;
      description?: string;
    }>;
  };
}

export default function ProductInfo({ productLineInfo, brandInfo, selectedSku }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* 브랜드와 요청 버튼 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Avatar>
            <AvatarImage src={brandInfo?.logo_url || ""} />
            <AvatarFallback>{brandInfo?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{brandInfo?.name}</span>
        </div>
        <RequestButton
          prefillUrl={typeof window !== "undefined" ? window.location.href : undefined}
        />
      </div>

      {/* 제품명 */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold leading-tight mb-3">
          {selectedSku.name || productLineInfo.name}
        </h1>
        {/* 칩들 */}
        <div className="flex flex-wrap gap-2">
          {/* 단백질 종류 칩들 */}
          {selectedSku.protein_types?.map((proteinType) => (
            <Badge key={proteinType.id} variant="outline" className="text-sm">
              {proteinType.name}
            </Badge>
          ))}

          {/* 사이즈 칩 */}
          {selectedSku.size && (
            <Badge variant="outline" className="text-sm">
              {selectedSku.size}
            </Badge>
          )}

          {/* 회분 칩 - 벌크일 때만 노출 */}
          {selectedSku.servings_per_container && selectedSku.package_type === "bulk" && (
            <Badge variant="outline" className="text-sm">
              {selectedSku.servings_per_container}회분
            </Badge>
          )}

          {/* 제품 형태 칩 */}
          {productLineInfo.form && (
            <Badge variant="outline" className="text-sm">
              {productLineInfo.form === "powder" ? "파우더" : "드링크"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}