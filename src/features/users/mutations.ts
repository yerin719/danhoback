import { createClient } from "@/lib/supabase/client";

/**
 * 사용자 계정 삭제
 * RPC 함수를 통해 트랜잭션으로 안전하게 처리
 * @returns void
 * @throws Error if deletion fails
 */
export async function deleteUserAccount(): Promise<void> {
  const supabase = createClient();

  try {
    // 1. 현재 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      throw new Error("사용자 정보를 찾을 수 없습니다");
    }

    // 2. 유저 ID 폴더의 모든 아바타 파일 삭제
    const { data: files } = await supabase.storage.from("avatars").list(user.id);

    if (files && files.length > 0) {
      const filesToDelete = files.map((file) => `${user.id}/${file.name}`);
      await supabase.storage.from("avatars").remove(filesToDelete);
    }

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

// 아바타 이미지 업로드 및 업데이트
export async function updateAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient();

  // 파일 검증
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  try {
    // 파일명 생성 (timestamp + 원본 파일명)
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
    }

    // 업로드된 파일의 공개 URL 생성
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

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
      await supabase.storage.from("avatars").remove([filePath]);
      throw new Error(`프로필 업데이트 실패: ${updateError.message}`);
    }

    return avatarUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("아바타 업데이트에 실패했습니다.");
  }
}

// 아바타 이미지 삭제
export async function deleteAvatar(userId: string): Promise<void> {
  const supabase = createClient();

  try {
    // 현재 프로필에서 avatar_url 가져오기
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw new Error(`프로필 정보 조회 실패: ${fetchError.message}`);
    }

    // avatar_url이 있고 Supabase Storage URL인 경우만 삭제
    if (profile?.avatar_url && profile.avatar_url.includes("/avatars/")) {
      // URL에서 파일 경로 추출
      const urlParts = profile.avatar_url.split("/avatars/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];

        // Storage에서 파일 삭제
        const { error: deleteError } = await supabase.storage.from("avatars").remove([filePath]);

        if (deleteError) {
          console.warn("Storage 파일 삭제 실패:", deleteError.message);
        }
      }
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
  const supabase = createClient();

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
