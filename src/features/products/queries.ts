import client from "@/supabase";

// ============================================
// TYPE DEFINITIONS
// ============================================

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
) {
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
 * 단일 제품 상세 정보 조회
 */
export async function getProductDetail(productId: string) {
  const { data, error } = await client.rpc("get_product_detail", {
    product_id_param: productId,
  });

  if (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0];
}

/**
 * 필터 옵션 조회
 */
export async function getFilterOptions(
  optionType?: "flavor" | "protein_type" | "form" | "package_type" | "brand",
): Promise<FilterOption[]> {
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
 * 특정 타입의 필터 옵션만 조회 (헬퍼 함수들)
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
export async function getProductsFromView(limit: number = 100, offset: number = 0) {
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
 * 필터 초기값 생성 헬퍼
 */
export function getDefaultFilters(): FilterState {
  return {
    flavors: [],
    proteinTypes: [],
    proteinRange: [0, 100],
    caloriesRange: [0, 1000],
    carbsRange: [0, 100],
    sugarRange: [0, 50],
    forms: [],
    packageTypes: [],
    searchQuery: "",
  };
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
