import {
  FILTER_RANGES,
  FLAVOR_CATEGORIES,
  PACKAGE_TYPES,
  PRODUCT_FORMS,
  PROTEIN_TYPES,
} from "@/features/products/constants";
import { type FilterState } from "../queries";

// 기본 필터 값을 반환하는 함수
export function getDefaultFilters(): FilterState {
  return {
    flavors: [],
    proteinTypes: [],
    proteinRange: [FILTER_RANGES.PROTEIN.MIN, FILTER_RANGES.PROTEIN.MAX],
    caloriesRange: [FILTER_RANGES.CALORIES.MIN, FILTER_RANGES.CALORIES.MAX],
    carbsRange: [FILTER_RANGES.CARBS.MIN, FILTER_RANGES.CARBS.MAX],
    sugarRange: [FILTER_RANGES.SUGAR.MIN, FILTER_RANGES.SUGAR.MAX],
    forms: [],
    packageTypes: [],
    searchQuery: undefined,
  };
}

// URL 파라미터 타입 정의
export type SearchParamsType = {
  // 필터 파라미터
  flavor?: string | string[];
  type?: string | string[];
  form?: string | string[];
  package?: string | string[];
  protein_min?: string;
  protein_max?: string;
  calorie_min?: string;
  calorie_max?: string;
  carb_min?: string;
  carb_max?: string;
  sugar_min?: string;
  sugar_max?: string;
  q?: string;
  // 정렬 파라미터
  sort?: string;
  order?: "asc" | "desc";
};

// 유효성 검증 헬퍼 함수들
const isValidFlavorCategory = (flavor: string): boolean => {
  return Object.keys(FLAVOR_CATEGORIES).includes(flavor);
};

const isValidProteinType = (type: string): boolean => {
  return Object.keys(PROTEIN_TYPES).includes(type);
};

const isValidProductForm = (form: string): boolean => {
  return Object.keys(PRODUCT_FORMS).includes(form);
};

const isValidPackageType = (packageType: string): boolean => {
  return Object.keys(PACKAGE_TYPES).includes(packageType);
};

const isValidSortBy = (sort: string): boolean => {
  return ["favorites_count", "protein", "calories", "name"].includes(sort);
};

const isValidOrder = (order: string): boolean => {
  return ["asc", "desc"].includes(order);
};

const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * URL 파라미터를 검증하고 유효하지 않은 값들을 제거한 결과를 반환
 */
export function parseSearchParams(params: SearchParamsType): {
  filters: FilterState;
  sortBy: string;
  sortOrder: "asc" | "desc";
  hasInvalidParams: boolean;
  cleanedParams: SearchParamsType;
} {
  const defaultFilters = getDefaultFilters();
  let hasInvalidParams = false;
  const cleanedParams: SearchParamsType = {};

  // 타입 안전한 파라미터 할당 헬퍼
  const setCleanedParam = (key: string, value: string | string[]) => {
    switch (key) {
      case 'flavor':
        cleanedParams.flavor = value;
        break;
      case 'type':
        cleanedParams.type = value;
        break;
      case 'form':
        cleanedParams.form = value;
        break;
      case 'package':
        cleanedParams.package = value;
        break;
      case 'protein_min':
      case 'protein_max':
      case 'calorie_min':
      case 'calorie_max':
      case 'carb_min':
      case 'carb_max':
      case 'sugar_min':
      case 'sugar_max':
        cleanedParams[key as keyof Pick<SearchParamsType, 'protein_min' | 'protein_max' | 'calorie_min' | 'calorie_max' | 'carb_min' | 'carb_max' | 'sugar_min' | 'sugar_max'>] = value as string;
        break;
      case 'q':
        cleanedParams.q = value as string;
        break;
      case 'sort':
        cleanedParams.sort = value as string;
        break;
      case 'order':
        cleanedParams.order = value as "asc" | "desc";
        break;
    }
  };

  // 배열 형태로 변환하고 유효성 검증
  const toValidatedArray = (
    value: string | string[] | undefined,
    validator: (item: string) => boolean,
    paramKey: string,
  ): string[] => {
    if (!value) return [];
    const array = Array.isArray(value) ? value : [value];
    const validItems = array.filter(validator);

    if (validItems.length !== array.length) {
      hasInvalidParams = true;
    }

    if (validItems.length > 0) {
      const cleanValue = validItems.length === 1 ? validItems[0] : validItems;
      setCleanedParam(paramKey, cleanValue);
    }

    return validItems;
  };

  // 숫자 검증 및 범위 체크
  const toValidatedNumber = (
    value: string | undefined,
    defaultValue: number,
    min: number,
    max: number,
    paramKey: string,
  ): number => {
    if (!value) return defaultValue;

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      hasInvalidParams = true;
      return defaultValue;
    }

    if (!isInRange(num, min, max)) {
      hasInvalidParams = true;
      return defaultValue;
    }

    setCleanedParam(paramKey, value);
    return num;
  };

  // 검색어 검증
  const validateSearchQuery = (query: string | undefined): string | undefined => {
    if (!query || !query.trim()) return undefined;

    // HTML 태그 제거 및 길이 제한
    const cleaned = query
      .replace(/<[^>]*>/g, "")
      .trim()
      .substring(0, 100);

    if (cleaned !== query) {
      hasInvalidParams = true;
    }

    if (cleaned) {
      setCleanedParam('q', cleaned);
    }

    return cleaned;
  };

  // 정렬 파라미터 검증
  const validateSort = (sort: string | undefined): string => {
    if (!sort) return "favorites_count";

    if (!isValidSortBy(sort)) {
      hasInvalidParams = true;
      return "favorites_count";
    }

    if (sort !== "favorites_count") {
      setCleanedParam('sort', sort);
    }

    return sort;
  };

  const validateOrder = (order: string | undefined): "asc" | "desc" => {
    if (!order) return "desc";

    if (!isValidOrder(order)) {
      hasInvalidParams = true;
      return "desc";
    }

    if (order !== "desc") {
      setCleanedParam('order', order);
    }

    return order as "asc" | "desc";
  };

  // 필터 검증 실행
  const flavors = toValidatedArray(params.flavor, isValidFlavorCategory, "flavor");
  const proteinTypes = toValidatedArray(params.type, isValidProteinType, "type");
  const forms = toValidatedArray(params.form, isValidProductForm, "form");
  const packageTypes = toValidatedArray(params.package, isValidPackageType, "package");

  const proteinMin = toValidatedNumber(
    params.protein_min,
    defaultFilters.proteinRange[0],
    FILTER_RANGES.PROTEIN.MIN,
    FILTER_RANGES.PROTEIN.MAX,
    "protein_min",
  );
  const proteinMax = toValidatedNumber(
    params.protein_max,
    defaultFilters.proteinRange[1],
    FILTER_RANGES.PROTEIN.MIN,
    FILTER_RANGES.PROTEIN.MAX,
    "protein_max",
  );

  const caloriesMin = toValidatedNumber(
    params.calorie_min,
    defaultFilters.caloriesRange[0],
    FILTER_RANGES.CALORIES.MIN,
    FILTER_RANGES.CALORIES.MAX,
    "calorie_min",
  );
  const caloriesMax = toValidatedNumber(
    params.calorie_max,
    defaultFilters.caloriesRange[1],
    FILTER_RANGES.CALORIES.MIN,
    FILTER_RANGES.CALORIES.MAX,
    "calorie_max",
  );

  const carbsMin = toValidatedNumber(
    params.carb_min,
    defaultFilters.carbsRange[0],
    FILTER_RANGES.CARBS.MIN,
    FILTER_RANGES.CARBS.MAX,
    "carb_min",
  );
  const carbsMax = toValidatedNumber(
    params.carb_max,
    defaultFilters.carbsRange[1],
    FILTER_RANGES.CARBS.MIN,
    FILTER_RANGES.CARBS.MAX,
    "carb_max",
  );

  const sugarMin = toValidatedNumber(
    params.sugar_min,
    defaultFilters.sugarRange[0],
    FILTER_RANGES.SUGAR.MIN,
    FILTER_RANGES.SUGAR.MAX,
    "sugar_min",
  );
  const sugarMax = toValidatedNumber(
    params.sugar_max,
    defaultFilters.sugarRange[1],
    FILTER_RANGES.SUGAR.MIN,
    FILTER_RANGES.SUGAR.MAX,
    "sugar_max",
  );

  const searchQuery = validateSearchQuery(params.q);
  const sortBy = validateSort(params.sort);
  const sortOrder = validateOrder(params.order);

  return {
    filters: {
      flavors,
      proteinTypes,
      forms,
      packageTypes,
      proteinRange: [proteinMin, proteinMax],
      caloriesRange: [caloriesMin, caloriesMax],
      carbsRange: [carbsMin, carbsMax],
      sugarRange: [sugarMin, sugarMax],
      searchQuery,
    },
    sortBy,
    sortOrder,
    hasInvalidParams,
    cleanedParams,
  };
}

/**
 * FilterState를 URL 파라미터로 변환
 */
export function filtersToSearchParams(
  filters: FilterState,
  sortBy: string = "favorites_count",
  sortOrder: "asc" | "desc" = "desc",
): URLSearchParams {
  const params = new URLSearchParams();
  const defaultFilters = getDefaultFilters();

  // 필터 파라미터 설정
  if (filters.flavors.length > 0) {
    filters.flavors.forEach((f) => params.append("flavor", f));
  }
  if (filters.proteinTypes.length > 0) {
    filters.proteinTypes.forEach((t) => params.append("type", t));
  }
  if (filters.forms.length > 0) {
    filters.forms.forEach((f) => params.append("form", f));
  }
  if (filters.packageTypes.length > 0) {
    filters.packageTypes.forEach((p) => params.append("package", p));
  }

  // 범위 파라미터 설정 (기본값과 다를 때만)
  if (filters.proteinRange[0] > defaultFilters.proteinRange[0]) {
    params.set("protein_min", filters.proteinRange[0].toString());
  }
  if (filters.proteinRange[1] < defaultFilters.proteinRange[1]) {
    params.set("protein_max", filters.proteinRange[1].toString());
  }
  if (filters.caloriesRange[0] > defaultFilters.caloriesRange[0]) {
    params.set("calorie_min", filters.caloriesRange[0].toString());
  }
  if (filters.caloriesRange[1] < defaultFilters.caloriesRange[1]) {
    params.set("calorie_max", filters.caloriesRange[1].toString());
  }
  if (filters.carbsRange[0] > defaultFilters.carbsRange[0]) {
    params.set("carb_min", filters.carbsRange[0].toString());
  }
  if (filters.carbsRange[1] < defaultFilters.carbsRange[1]) {
    params.set("carb_max", filters.carbsRange[1].toString());
  }
  if (filters.sugarRange[0] > defaultFilters.sugarRange[0]) {
    params.set("sugar_min", filters.sugarRange[0].toString());
  }
  if (filters.sugarRange[1] < defaultFilters.sugarRange[1]) {
    params.set("sugar_max", filters.sugarRange[1].toString());
  }

  // 검색어
  if (filters.searchQuery) {
    params.set("q", filters.searchQuery);
  }

  // 정렬
  if (sortBy !== "favorites_count") {
    params.set("sort", sortBy);
  }
  if (sortOrder !== "desc") {
    params.set("order", sortOrder);
  }

  return params;
}
