"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  slug: string;
  imageType?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  slug,
  imageType = 'primary',
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("파일 크기는 2MB 이하여야 합니다.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("JPG, PNG, WebP 형식만 지원됩니다.");
      return;
    }

    try {
      setUploading(true);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", slug);
      formData.append("imageType", imageType);
      if (value) {
        formData.append("oldImageUrl", value);
      }

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "업로드 실패");
      }

      const data = await response.json();
      onChange(data.imageUrl);
      setPreview(data.imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
      setPreview(value);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="상품 이미지"
            fill
            className="object-contain"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {uploading ? "업로드 중..." : "이미지 업로드"}
          </div>
          <div className="text-xs text-muted-foreground">
            JPG, PNG, WebP (최대 2MB)
          </div>
        </button>
      )}
    </div>
  );
}