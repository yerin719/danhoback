import client from "@/lib/supabase/client";
import type { Database } from "database.types";

// ============================================
// TYPE DEFINITIONS
// ============================================

// Database types
type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"];
type ProductSkuRow = Database["public"]["Tables"]["product_skus"]["Row"];
type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

export interface FavoriteWithDetails extends FavoriteRow {
  sku?: ProductSkuRow;
  product?: ProductRow;
  brand?: BrandRow;
}

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * 사용자의 찜 목록 조회 (RPC 함수 사용)
 * @returns 찜한 제품 목록
 */
export async function getUserFavorites() {
  const { data, error } = await client.rpc("get_user_favorites");

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data || [];
}

/**
 * 특정 제품의 찜 여부 확인
 * @param productSkuId - 제품 SKU ID
 * @param userId - 사용자 ID
 * @returns 찜 여부
 */
export async function checkIsFavorited(productSkuId: string, userId: string): Promise<boolean> {
  const { data, error } = await client
    .from("favorites")
    .select("user_id") // id 컬럼이 없으므로 user_id 선택
    .eq("user_id", userId)
    .eq("product_sku_id", productSkuId)
    .maybeSingle(); // single() 대신 maybeSingle() 사용 - 데이터 없어도 에러 안남

  if (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }

  return !!data;
}

/**
 * 찜 추가
 * @param productSkuId - 제품 SKU ID
 * @param userId - 사용자 ID
 * @returns 추가 결과
 */
export async function addFavorite(
  productSkuId: string,
  userId: string,
): Promise<{ success: boolean; error?: string; data?: FavoriteRow }> {
  const { data, error } = await client
    .from("favorites")
    .insert({
      user_id: userId,
      product_sku_id: productSkuId,
    })
    .select()
    .single();

  if (error) {
    // 중복 키 에러인 경우 (이미 찜한 상품)
    if (error.code === "23505") {
      return { success: false, error: "Already favorited" };
    }
    console.error("Error adding favorite:", error);
    return { success: false, error: "Failed to add favorite" };
  }

  return { success: true, data };
}

/**
 * 찜 삭제
 * @param productSkuId - 제품 SKU ID
 * @param userId - 사용자 ID
 * @returns 삭제 결과
 */
export async function removeFavorite(
  productSkuId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await client
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_sku_id", productSkuId);

  if (error) {
    console.error("Error deleting favorite:", error);
    return { success: false, error: "Failed to remove favorite" };
  }

  return { success: true };
}

/**
 * 찜 토글 (추가/삭제)
 * @param productSkuId - 제품 SKU ID
 * @param userId - 사용자 ID
 * @param currentStatus - 현재 찜 상태 (클라이언트에서 전달)
 * @returns 토글 결과
 */
export async function toggleFavorite(
  productSkuId: string,
  userId: string,
  currentStatus: boolean,
): Promise<{ success: boolean; action?: "added" | "removed"; error?: string }> {
  if (currentStatus) {
    const result = await removeFavorite(productSkuId, userId);
    return { ...result, action: "removed" };
  } else {
    const result = await addFavorite(productSkuId, userId);
    return { ...result, action: "added" };
  }
}

/**
 * 제품별 찜 카운트 조회
 * @param productSkuId - 제품 SKU ID
 * @returns 찜 개수
 */
export async function getFavoriteCount(productSkuId: string): Promise<number> {
  const { count, error } = await client
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("product_sku_id", productSkuId);

  if (error) {
    console.error("Error getting favorite count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * 여러 제품의 찜 여부 일괄 확인
 * @param productSkuIds - 제품 SKU ID 배열
 * @param userId - 사용자 ID
 * @returns 찜 여부 Map
 */
export async function checkMultipleFavorites(
  productSkuIds: string[],
  userId: string,
): Promise<Map<string, boolean>> {
  const { data, error } = await client
    .from("favorites")
    .select("product_sku_id")
    .eq("user_id", userId)
    .in("product_sku_id", productSkuIds);

  const favoriteMap = new Map<string, boolean>();

  if (error) {
    console.error("Error checking multiple favorites:", error);
    productSkuIds.forEach((id) => favoriteMap.set(id, false));
    return favoriteMap;
  }

  const favoritedIds = new Set((data || []).map((f) => f.product_sku_id));
  productSkuIds.forEach((id) => {
    favoriteMap.set(id, favoritedIds.has(id));
  });

  return favoriteMap;
}
