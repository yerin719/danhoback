import { FILTER_RANGES } from "@/features/products/constants";
import { FilterState } from "@/features/products/queries";

/**
 * 범위 필터 값을 버튼 텍스트로 변환
 */
export function formatRangeValue(
  range: [number, number],
  defaultRange: [number, number],
  unit: string,
): string {
  const [min, max] = range;
  const [defaultMin, defaultMax] = defaultRange;

  // 기본값과 같으면 빈 문자열 반환
  if (min === defaultMin && max === defaultMax) {
    return "";
  }

  return `${min}${unit}~${max}${unit}`;
}

/**
 * 다중 선택 필터 값을 버튼 텍스트로 변환
 */
export function formatMultiSelectValue(selectedValues: string[], totalOptions: number): string {
  const count = selectedValues.length;

  if (count === 0) {
    return "";
  }

  if (count === totalOptions) {
    return "전체";
  }

  return `${count}`;
}

/**
 * 필터 상태에서 각 필터의 활성화 여부 확인
 */
export function getFilterActiveState(filters: FilterState) {
  const defaultFilters = {
    proteinRange: [FILTER_RANGES.PROTEIN.MIN, FILTER_RANGES.PROTEIN.MAX] as [number, number],
    caloriesRange: [FILTER_RANGES.CALORIES.MIN, FILTER_RANGES.CALORIES.MAX] as [number, number],
    carbsRange: [FILTER_RANGES.CARBS.MIN, FILTER_RANGES.CARBS.MAX] as [number, number],
    sugarRange: [FILTER_RANGES.SUGAR.MIN, FILTER_RANGES.SUGAR.MAX] as [number, number],
  };

  return {
    protein: !arraysEqual(filters.proteinRange, defaultFilters.proteinRange),
    calories: !arraysEqual(filters.caloriesRange, defaultFilters.caloriesRange),
    carbs: !arraysEqual(filters.carbsRange, defaultFilters.carbsRange),
    sugar: !arraysEqual(filters.sugarRange, defaultFilters.sugarRange),
    flavors: filters.flavors.length > 0,
    proteinTypes: filters.proteinTypes.length > 0,
    forms: filters.forms.length > 0,
    packageTypes: filters.packageTypes.length > 0,
  };
}

/**
 * 배열 동등성 비교 유틸리티
 */
function arraysEqual(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * 모든 필터가 기본값인지 확인
 */
export function isDefaultFilters(filters: FilterState): boolean {
  const activeState = getFilterActiveState(filters);
  return !Object.values(activeState).some(Boolean);
}
