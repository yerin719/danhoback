"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <ImageOff className="h-12 w-12 text-muted-foreground" />
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