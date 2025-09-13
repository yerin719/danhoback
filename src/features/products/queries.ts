import defaultClient from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../database.types";

// ============================================
// TYPE DEFINITIONS
// ============================================

// 제품 검색 결과 타입 (search_products RPC 함수의 반환 타입)
export type ProductSearchResult =
  Database["public"]["Functions"]["search_products"]["Returns"][0] & {
    slug: string; // slug 필드 추가
  };

// Database 기반으로 Json을 구체적인 타입으로 변환
type ProductDetailRow = {
  selected_variant: Database["public"]["Tables"]["product_variants"]["Row"] & {
    nutrition?: Database["public"]["Tables"]["variant_nutrition"]["Row"];
  };
  product_info: Database["public"]["Tables"]["products"]["Row"];
  brand_info: Database["public"]["Tables"]["brands"]["Row"];
  related_variants: Array<
    Pick<
      Database["public"]["Tables"]["product_variants"]["Row"],
      | "id"
      | "name"
      | "slug"
      | "flavor_category"
      | "flavor_name"
      | "primary_image"
      | "package_type"
      | "size"
      | "images"
    >
  >;
  is_favorited: boolean;
};

// 필터 옵션 인터페이스
export interface FilterOption {
  option_type: string;
  option_value: string;
}

// 필터 상태 인터페이스 (UI 컴포넌트용)
export interface FilterState {
  flavors: string[];
  proteinTypes: string[];
  proteinRange: [number, number];
  caloriesRange: [number, number];
  carbsRange: [number, number];
  sugarRange: [number, number];
  forms: string[];
  packageTypes: string[];
  searchQuery?: string;
}

// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * 제품 검색 및 필터링
 * RPC 함수를 사용하여 서버사이드에서 모든 필터링 처리
 */
export async function searchProducts(
  filters: FilterState,
  sortBy: string = "favorites_count",
  sortOrder: "asc" | "desc" = "desc",
  limit: number = 100,
  offset: number = 0,
  supabaseClient?: SupabaseClient<Database>,
): Promise<ProductSearchResult[]> {
  const client = supabaseClient || defaultClient;
  const rpcParams = {
    filter_flavors: filters.flavors.length > 0 ? filters.flavors : undefined,
    filter_protein_types: filters.proteinTypes.length > 0 ? filters.proteinTypes : undefined,
    filter_forms: filters.forms.length > 0 ? filters.forms : undefined,
    filter_package_types: filters.packageTypes.length > 0 ? filters.packageTypes : undefined,
    min_protein: filters.proteinRange[0],
    max_protein: filters.proteinRange[1],
    min_calories: filters.caloriesRange[0],
    max_calories: filters.caloriesRange[1],
    min_carbs: filters.carbsRange[0],
    max_carbs: filters.carbsRange[1],
    min_sugar: filters.sugarRange[0],
    max_sugar: filters.sugarRange[1],
    search_query: filters.searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    limit_count: limit,
    offset_count: offset,
  };

  const { data, error } = await client.rpc("search_products", rpcParams);

  if (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }

  return data || [];
}

/**
 * 단일 제품 상세 정보 조회 (slug 기준)
 * 선택된 variant의 상세 정보와 같은 라인의 다른 variants 반환
 */
export async function getProductDetail(
  slug: string,
  supabaseClient?: SupabaseClient<Database>,
): Promise<ProductDetailRow | null> {
  const client = supabaseClient || defaultClient;
  const { data, error } = await client.rpc("get_product_detail", {
    variant_slug_param: slug,
  });

  if (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as ProductDetailRow;
}

/**
 * 필터 옵션 조회
 */
export async function getFilterOptions(
  optionType?: "flavor" | "protein_type" | "form" | "package_type" | "brand",
  supabaseClient?: SupabaseClient<Database>,
): Promise<FilterOption[]> {
  const client = supabaseClient || defaultClient;
  const { data, error } = await client.rpc("get_filter_options", {
    filter_type: optionType || undefined,
  });

  if (error) {
    console.error("Error fetching filter options:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      optionType,
    });

    // RPC 함수가 없을 경우 빈 배열 반환
    if (
      error.code === "42883" ||
      error.message?.includes("function") ||
      error.message?.includes("does not exist")
    ) {
      console.warn("RPC function 'get_filter_options' not found. Please run SQL migration.");
      return [];
    }

    return [];
  }

  return (data as FilterOption[]) || [];
}

/**
 * 모든 필터 옵션을 한 번에 가져오는 함수
 * 한 번의 API 호출로 모든 필터 데이터를 가져와서 타입별로 분류
 */
export async function getAllFilterOptions(supabaseClient?: SupabaseClient<Database>) {
  const client = supabaseClient || defaultClient;
  const { data, error } = await client.rpc("get_filter_options");

  if (error) {
    console.error("Error fetching all filter options:", error);
    return {
      flavors: [],
      proteinTypes: [],
      forms: [],
      packageTypes: [],
      brands: [],
    };
  }

  const allOptions = (data as FilterOption[]) || [];

  // 타입별로 옵션 분류 및 정렬
  return {
    flavors: allOptions
      .filter((opt) => opt.option_type === "flavor")
      .map((opt) => opt.option_value)
      .sort(),
    proteinTypes: allOptions
      .filter((opt) => opt.option_type === "protein_type")
      .map((opt) => opt.option_value)
      .sort(),
    forms: allOptions
      .filter((opt) => opt.option_type === "form")
      .map((opt) => opt.option_value)
      .sort(),
    packageTypes: allOptions
      .filter((opt) => opt.option_type === "package_type")
      .map((opt) => opt.option_value)
      .sort(),
    brands: allOptions
      .filter((opt) => opt.option_type === "brand")
      .map((opt) => opt.option_value)
      .sort((a, b) => a.localeCompare(b)),
  };
}

/**
 * 특정 타입의 필터 옵션만 조회 (헬퍼 함수들)
 * @deprecated getAllFilterOptions를 사용하세요
 */
export async function getFlavorOptions(): Promise<string[]> {
  const options = await getFilterOptions("flavor");
  return options.map((opt) => opt.option_value).sort();
}

export async function getProteinTypes(): Promise<string[]> {
  const options = await getFilterOptions("protein_type");
  return options.map((opt) => opt.option_value).sort();
}

export async function getProductForms(): Promise<string[]> {
  const options = await getFilterOptions("form");
  return options.map((opt) => opt.option_value).sort();
}

export async function getPackageTypes(): Promise<string[]> {
  const options = await getFilterOptions("package_type");
  return options.map((opt) => opt.option_value).sort();
}

export async function getBrands(): Promise<string[]> {
  const options = await getFilterOptions("brand");
  return options.map((opt) => opt.option_value).sort((a, b) => a.localeCompare(b));
}

/**
 * View를 직접 조회하는 간단한 쿼리 (필요시 사용)
 */
export async function getProductsFromView(
  limit: number = 100,
  offset: number = 0,
  supabaseClient?: SupabaseClient<Database>,
) {
  const client = supabaseClient || defaultClient;
  const { data, error } = await client
    .from("products_with_details")
    .select("*")
    .limit(limit)
    .range(offset, offset + limit - 1)
    .order("favorites_count", { ascending: false });

  if (error) {
    console.error("Error fetching products from view:", error);
    return [];
  }

  return data || [];
}

/**
 * 제품 그룹핑 헬퍼 함수
 * 여러 variant를 가진 제품들을 그룹핑
 */
export function groupProductsByProductId<T extends { product_id: string }>(
  products: T[],
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  products.forEach((product) => {
    const existing = grouped.get(product.product_id) || [];
    existing.push(product);
    grouped.set(product.product_id, existing);
  });

  return grouped;
}

/**
 * 필터 유효성 검증
 */
export function validateFilters(filters: FilterState): boolean {
  return (
    filters.proteinRange[0] <= filters.proteinRange[1] &&
    filters.caloriesRange[0] <= filters.caloriesRange[1] &&
    filters.carbsRange[0] <= filters.carbsRange[1] &&
    filters.sugarRange[0] <= filters.sugarRange[1] &&
    filters.proteinRange[0] >= 0 &&
    filters.caloriesRange[0] >= 0 &&
    filters.carbsRange[0] >= 0 &&
    filters.sugarRange[0] >= 0
  );
}
