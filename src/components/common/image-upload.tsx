"use client";

import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = "video",
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setUploading(true);

      try {
        // 실제 구현에서는 서버에 업로드하고 URL을 받아와야 함
        // 지금은 임시로 FileReader를 사용해 base64로 변환
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        handleFileUpload(imageFile);
      }
    },
    [handleFileUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handleRemove = () => {
    onChange("");
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video";
      case "square":
        return "aspect-square";
      default:
        return "aspect-auto";
    }
  };

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <div className={cn("relative overflow-hidden rounded-lg bg-muted", getAspectRatioClass())}>
          <Image
            src={value}
            alt="업로드된 이미지"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed border-border transition-colors",
          "hover:border-primary/50 cursor-pointer",
          dragOver && "border-primary bg-primary/5",
          uploading && "pointer-events-none opacity-50",
          getAspectRatioClass(),
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm">업로드 중...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mb-4" />
              <div className="text-center">
                <p className="text-sm font-medium mb-1">이미지를 업로드하세요</p>
                <p className="text-xs text-muted-foreground">
                  드래그하거나 클릭하여 파일을 선택하세요
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF (최대 10MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
