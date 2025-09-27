import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { uploadProductImage, deleteProductImage } from "@/lib/r2/products";

function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: "파일 크기는 2MB 이하여야 합니다." };
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "JPG, PNG, WebP 형식만 지원됩니다." };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;
    const imageType = (formData.get("imageType") as string) || 'primary';
    const oldImageUrl = formData.get("oldImageUrl") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 필요합니다" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "slug가 필요합니다" },
        { status: 400 }
      );
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 새 이미지 업로드
    const imageUrl = await uploadProductImage(slug, file, imageType);

    // 이전 이미지 삭제
    if (oldImageUrl) {
      await deleteProductImage(oldImageUrl);
    }

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("상품 이미지 업로드 에러:", error);

    const errorMessage = error instanceof Error ? error.message : "상품 이미지 업로드에 실패했습니다";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}