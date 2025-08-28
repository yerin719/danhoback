"use client";

import type { ArticleCategory } from "@/lib/articles";
import { getCategoryIcon } from "@/lib/category-icons";
import Image from "next/image";
import { useState } from "react";

interface ArticleImageProps {
  src: string;
  alt: string;
  category: ArticleCategory;
  className?: string;
  iconSize?: "sm" | "md" | "lg" | "xl";
}

export default function ArticleImage({ src, alt, category, className, iconSize = "md" }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);

  const getIconSizeClass = (size: string) => {
    switch (size) {
      case "sm": return "h-4 w-4";
      case "md": return "h-8 w-8";
      case "lg": return "h-12 w-12";
      case "xl": return "h-16 w-16";
      default: return "h-8 w-8";
    }
  };

  if (imageError || !src) {
    const { icon: Icon, bgColor, iconColor } = getCategoryIcon(category);

    return (
      <div className={`w-full h-full flex items-center justify-center rounded-lg ${bgColor}`}>
        <Icon className={`${getIconSizeClass(iconSize)} ${iconColor}`} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      unoptimized
      onError={() => setImageError(true)}
    />
  );
}
