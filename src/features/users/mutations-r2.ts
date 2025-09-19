import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uploadAvatar, deleteAvatarFromStorage, deleteAllUserAvatars } from '@/lib/r2/avatar';

/**
 * 사용자 계정 삭제 (R2 버전)
 * RPC 함수를 통해 트랜잭션으로 안전하게 처리
 * @returns void
 * @throws Error if deletion fails
 */
export async function deleteUserAccount(): Promise<void> {
  const supabase = await createServerSupabaseClient();

  try {
    // 1. 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      throw new Error("사용자 정보를 찾을 수 없습니다");
    }

    // 2. 유저 ID 폴더의 모든 아바타 파일 삭제 (R2)
    await deleteAllUserAvatars(user.id);

    // 3. RPC 함수를 통한 계정 삭제
    const { error } = await supabase.rpc("delete_user_account");

    if (error) {
      throw new Error(error.message || "계정 삭제에 실패했습니다");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("계정 삭제에 실패했습니다");
  }
}

// 파일 검증 유틸리티
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // 파일 크기 검증 (2MB 제한)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: "파일 크기는 2MB 이하여야 합니다." };
  }

  // 파일 형식 검증
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "JPG, PNG, WebP 형식만 지원됩니다." };
  }

  return { isValid: true };
}

// 아바타 이미지 업로드 및 업데이트 (R2 버전)
export async function updateAvatar(userId: string, file: File): Promise<string> {
  const supabase = await createServerSupabaseClient();

  // 현재 인증된 사용자와 userId 일치 확인 (추가 보안)
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser || currentUser.id !== userId) {
    throw new Error("권한이 없습니다. 본인의 아바타만 수정할 수 있습니다.");
  }

  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    // 기존 아바타 URL 가져오기 (삭제용) - 본인 프로필만 조회
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error("프로필을 찾을 수 없습니다.");
    }

    // R2에 이미지 업로드
    const avatarUrl = await uploadAvatar(userId, file);

    // profiles 테이블의 avatar_url 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      // DB 업데이트 실패 시 업로드된 파일 삭제
      await deleteAvatarFromStorage(avatarUrl);
      throw new Error(`프로필 업데이트 실패: ${updateError.message}`);
    }

    // 기존 아바타가 있었다면 삭제 (새 파일 업로드 성공 후)
    if (profile?.avatar_url) {
      await deleteAvatarFromStorage(profile.avatar_url);
    }

    return avatarUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("아바타 업데이트에 실패했습니다.");
  }
}

// 아바타 이미지 삭제 (R2 버전)
export async function deleteAvatar(userId: string): Promise<void> {
  const supabase = await createServerSupabaseClient();

  // 현재 인증된 사용자와 userId 일치 확인 (추가 보안)
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser || currentUser.id !== userId) {
    throw new Error("권한이 없습니다. 본인의 아바타만 삭제할 수 있습니다.");
  }

  try {
    // 현재 프로필에서 avatar_url 가져오기 - 본인 프로필만 조회
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw new Error(`프로필 정보 조회 실패: ${fetchError.message}`);
    }

    // avatar_url이 있는 경우 R2에서 삭제
    if (profile?.avatar_url) {
      await deleteAvatarFromStorage(profile.avatar_url);
    }

    // profiles 테이블의 avatar_url을 null로 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      throw new Error(`프로필 업데이트 실패: ${updateError.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("아바타 삭제에 실패했습니다.");
  }
}

// 사용자명 업데이트 (기존 로직을 이곳으로 이동 가능)
export async function updateUsername(
  userId: string,
  username: string,
  currentUsername?: string,
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  // 사용자명 중복 체크
  if (username !== currentUsername) {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116: No rows found
      throw error;
    }

    if (data) {
      throw new Error("이미 사용중인 사용자명입니다.");
    }
  }

  // 사용자명 업데이트
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      username,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateError) {
    if (updateError.code === "23505") {
      // PostgreSQL unique constraint violation
      throw new Error("이미 사용중인 사용자명입니다.");
    }
    throw new Error(`사용자명 업데이트 실패: ${updateError.message}`);
  }
}