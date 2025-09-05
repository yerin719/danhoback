// ============================================
// FLAVOR CATEGORIES MAPPING
// ============================================

export const FLAVOR_CATEGORIES = {
  chocolate: "초코",
  strawberry: "딸기",
  vanilla: "바닐라",
  banana: "바나나",
  matcha: "말차",
  grain: "곡물",
  milktea: "밀크티",
  greentea: "녹차",
  coffee: "커피",
  mint: "민트",
  cookies: "쿠키",
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

export function getPackageTypeDisplayName(packageType: PackageType | string | null | undefined): string {
  if (!packageType) return "";
  return PACKAGE_TYPES[packageType as PackageType] || packageType;
}

// ============================================
// SLUG HELPERS
// ============================================

export const FLAVOR_SLUG_MAP = {
  chocolate: "choco",
  strawberry: "strawberry",
  vanilla: "vanilla",
  banana: "banana",
  matcha: "matcha",
  grain: "grain",
  milktea: "milktea",
  greentea: "greentea",
  coffee: "coffee",
  mint: "mint",
  cookies: "cookies",
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
