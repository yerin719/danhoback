import { createServerSupabaseClient } from "@/lib/supabase/server";
import { deleteAvatar } from "@/features/users/mutations-r2";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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

    // 아바타 삭제
    await deleteAvatar(user.id);

    return NextResponse.json({
      success: true,
      message: "아바타가 삭제되었습니다",
    });
  } catch (error) {
    console.error("아바타 삭제 에러:", error);

    const errorMessage = error instanceof Error ? error.message : "아바타 삭제에 실패했습니다";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}