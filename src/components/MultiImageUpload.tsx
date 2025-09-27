"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MultiImageUploadProps {
  value: string;
  onChange: (urls: string) => void;
  slug: string;
  disabled?: boolean;
}

export function MultiImageUpload({
  value,
  onChange,
  slug,
  disabled = false,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUrls = value ? value.split(",").map(url => url.trim()).filter(Boolean) : [];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter(
      file => file.size > 2 * 1024 * 1024 ||
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("일부 파일이 유효하지 않습니다. (2MB 이하, JPG/PNG/WebP만 가능)");
      return;
    }

    try {
      setUploading(true);

      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug);
        formData.append("imageType", `secondary-${imageUrls.length + index + 1}`);

        const response = await fetch("/api/products/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "업로드 실패");
        }

        const data = await response.json();
        return data.imageUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      const allUrls = [...imageUrls, ...newUrls];
      onChange(allUrls.join(", "));
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (index: number) => {
    const urlToDelete = imageUrls[index];

    // R2에서 이미지 삭제
    try {
      const formData = new FormData();
      formData.append("imageUrl", urlToDelete);

      await fetch("/api/products/delete", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("이미지 삭제 실패:", error);
    }

    const newUrls = imageUrls.filter((_, i) => i !== index);
    onChange(newUrls.join(", "));
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative w-full h-32 border rounded-lg overflow-hidden">
            <Image
              src={url}
              alt={`추가 이미지 ${index + 1}`}
              fill
              className="object-contain"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemove(index)}
                disabled={uploading}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}

        {!disabled && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              {uploading ? "업로드 중..." : "이미지 추가"}
            </div>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        여러 이미지를 한 번에 선택할 수 있습니다 (각 2MB 이하)
      </p>
    </div>
  );
}