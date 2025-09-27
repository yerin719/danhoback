import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { deleteProductImage } from "@/lib/r2/products";

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
    const imageUrl = formData.get("imageUrl") as string;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl이 필요합니다" },
        { status: 400 }
      );
    }

    await deleteProductImage(imageUrl);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("상품 이미지 삭제 에러:", error);

    const errorMessage = error instanceof Error ? error.message : "상품 이미지 삭제에 실패했습니다";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}