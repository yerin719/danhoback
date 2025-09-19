import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateAvatar, validateImageFile } from "@/features/users/mutations-r2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // 사용자 인증 확인
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

    // FormData에서 파일 추출
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 필요합니다" },
        { status: 400 }
      );
    }

    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 아바타 업데이트
    const avatarUrl = await updateAvatar(user.id, file);

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    console.error("아바타 업로드 에러:", error);

    const errorMessage = error instanceof Error ? error.message : "아바타 업로드에 실패했습니다";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}