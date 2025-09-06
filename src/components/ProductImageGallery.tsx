"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import ProductImage from "./ProductImage";
import { Button } from "./ui/button";

interface ProductImageGalleryProps {
  images: (string | { url: string })[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 이미지 배열을 문자열 배열로 정규화
  const imageUrls = images.map(img => typeof img === 'string' ? img : img?.url || '/placeholder.svg');

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // 단일 이미지인 경우 간단히 표시
  if (imageUrls.length === 1) {
    return (
      <div className="space-y-4">
        <div className="aspect-square relative">
          <ProductImage
            src={imageUrls[0]}
            alt={alt}
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="aspect-square relative group">
        <ProductImage
          src={imageUrls[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          className="object-cover rounded-lg"
        />
        
        {/* 네비게이션 버튼 */}
        {imageUrls.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* 썸네일 */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {imageUrls.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground"
              }`}
            >
              <ProductImage
                src={image}
                alt={`${alt} 썸네일 ${index + 1}`}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}