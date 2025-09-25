// ============================================
// PAGINATION & QUERY SETTINGS
// ============================================

// 페이지네이션 관련 상수
export const PRODUCTS_PER_PAGE = 20;

// 정렬 관련 상수
export const DEFAULT_SORT_BY = "favorites_count";
export const DEFAULT_SORT_ORDER = "desc" as const;

// 쿼리 캐시 시간 (밀리초)
export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5분
export const QUERY_GC_TIME = 10 * 60 * 1000; // 10분

// ============================================
// FILTER RANGES
// ============================================

// 필터 범위 기본값 상수
export const FILTER_RANGES = {
  PROTEIN: { MIN: 0, MAX: 100 },
  CALORIES: { MIN: 0, MAX: 1000 },
  CARBS: { MIN: 0, MAX: 50 },
  SUGAR: { MIN: 0, MAX: 30 },
} as const;

// ============================================
// FLAVOR CATEGORIES MAPPING
// ============================================

export const FLAVOR_CATEGORIES = {
  grain: "곡물",
  chocolate: "초코",
  strawberry: "딸기",
  banana: "바나나",
  milk: "우유",
  coffee: "커피",
  original: "오리지날",
  black_sesame: "흑임자",
  milktea: "밀크티",
  greentea: "녹차",
  anilla: "바닐라",
  corn: "옥수수",
  other: "기타",
} as const;

export type FlavorCategory = keyof typeof FLAVOR_CATEGORIES;

// ============================================
// PROTEIN TYPES MAPPING
// ============================================

export const PROTEIN_TYPES = {
  wpi: "분리유청단백(WPI)",
  wpc: "농축유청단백(WPC)",
  wph: "가수분해유청단백(WPH)",
  wpih: "가수분해분리유청단백(WPIH)",
  casein: "카제인",
  goat_milk: "산양유",
  colostrum: "초유",
  isp: "분리대두단백(ISP)",
  spc: "농축대두단백(SPC)",
  pea: "완두단백",
  rice: "현미단백",
  oat: "귀리단백",
  mpc: "농축우유단백(MPC)",
  mpi: "분리우유단백(MPI)",
  egg: "난백",
  mixed: "혼합",
} as const;

export type ProteinType = keyof typeof PROTEIN_TYPES;

// ============================================
// PRODUCT FORMS MAPPING
// ============================================

export const PRODUCT_FORMS = {
  powder: "파우더",
  rtd: "드링크",
} as const;

export type ProductForm = keyof typeof PRODUCT_FORMS;

// ============================================
// PACKAGE TYPES MAPPING
// ============================================

export const PACKAGE_TYPES = {
  bulk: "대용량",
  pouch: "파우치",
  stick: "스틱",
} as const;

export type PackageType = keyof typeof PACKAGE_TYPES;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFlavorDisplayName(category: FlavorCategory | null | undefined): string {
  if (!category) return "오리지널";
  return FLAVOR_CATEGORIES[category] || category;
}

export function getProteinTypeDisplayName(type: ProteinType | null | undefined): string {
  if (!type) return "미분류";
  return PROTEIN_TYPES[type] || type;
}

export function getFormDisplayName(form: ProductForm | string | null | undefined): string {
  if (!form) return "파우더";
  return PRODUCT_FORMS[form as ProductForm] || form;
}

export function getPackageTypeDisplayName(
  packageType: PackageType | string | null | undefined,
): string {
  if (!packageType) return "";
  return PACKAGE_TYPES[packageType as PackageType] || packageType;
}

// ============================================
// SLUG HELPERS
// ============================================

export const FLAVOR_SLUG_MAP = {
  grain: "grain",
  chocolate: "choco",
  strawberry: "strawberry",
  banana: "banana",
  milk: "milk",
  coffee: "coffee",
  original: "original",
  black_sesame: "black-sesame",
  milktea: "milktea",
  greentea: "greentea",
  anilla: "vanilla",
  corn: "corn",
  other: "other",
} as const;

export function generateVariantSlug(
  brandNameEn: string | null,
  productName: string,
  flavorCategory: FlavorCategory | null,
  size: string | null,
  variantId: string,
): string {
  const parts = [];

  if (brandNameEn) {
    parts.push(brandNameEn.toLowerCase().replace(/\s+/g, "-"));
  }

  parts.push(productName.toLowerCase().split(" ")[0]);

  if (flavorCategory) {
    parts.push(FLAVOR_SLUG_MAP[flavorCategory]);
  }

  if (size) {
    parts.push(size.replace(/\./g, "-").toLowerCase());
  }

  parts.push(variantId.slice(0, 6));

  return parts.join("-");
}
