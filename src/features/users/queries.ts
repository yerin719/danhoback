import client from "@/lib/supabase/client";
import { Database } from "../../../database.types";

// ============================================
// TYPE DEFINITIONS
// ============================================

// Profile 타입 정의 (데이터베이스 기반)
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * 사용자 프로필 조회
 * @param userId - auth.users.id
 * @returns Profile 정보 또는 null
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await client.from("profiles").select("*").eq("id", userId).single();

    if (error) {
      if (error.code === "PGRST116") {
        // Profile이 존재하지 않음
        console.warn(`Profile not found for user: ${userId}`);
        return null;
      }
      console.error("Error fetching profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getProfile:", error);
    return null;
  }
}

/**
 * username 중복 체크
 * @param username - 체크할 username
 * @param excludeUserId - 제외할 사용자 ID (자신의 ID)
 * @returns 사용 가능하면 true, 중복이면 false
 */
export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string,
): Promise<boolean> {
  try {
    let query = client.from("profiles").select("id").eq("username", username);

    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking username availability:", error);
      return false;
    }

    // 결과가 없으면 사용 가능
    return !data || data.length === 0;
  } catch (error) {
    console.error("Error in isUsernameAvailable:", error);
    return false;
  }
}

/**
 * 프로필 정보 업데이트 (추후 구현용)
 * @param userId - 사용자 ID
 * @param updates - 업데이트할 데이터
 * @returns 성공 여부
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, "username" | "avatar_url">>,
): Promise<boolean> {
  try {
    const { error } = await client
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return false;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * 사용자 표시 이름 생성
 * 우선순위: profile.username > user_metadata.full_name > email prefix
 */
export function getDisplayName(profile: Profile | null): string {
  if (profile?.username) {
    return profile.username;
  }

  return "";
}

/**
 * 아바타 이니셜 생성
 */
export function getAvatarInitial(displayName: string): string {
  return displayName.charAt(0).toUpperCase();
}
