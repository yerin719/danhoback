"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FILTER_RANGES,
  FLAVOR_CATEGORIES,
  PACKAGE_TYPES,
  PRODUCT_FORMS,
  PROTEIN_TYPES,
} from "@/features/products/constants";
import { useAllFilterOptions } from "@/features/products/hooks/useFilterOptions";
import { FilterState } from "@/features/products/queries";
import { getDefaultFilters } from "@/features/products/utils/urlParams";
import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import FilterButton from "./filters/FilterButton";
import ButtonSelectFilterPopover from "./filters/ButtonSelectFilterPopover";
import RangeFilterPopover from "./filters/RangeFilterPopover";
import {
  formatMultiSelectValue,
  formatRangeValue,
  getFilterActiveState,
  isDefaultFilters,
} from "./filters/filterUtils";

interface CompactProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function CompactProductFilters({
  filters,
  onFiltersChange,
}: CompactProductFiltersProps) {
  // DB에서 실제 필터 옵션 가져오기 (한 번의 API 호출)
  const { data: filterOptions, isLoading } = useAllFilterOptions();

  // DB에서 받은 코드를 한글 레이블과 매핑
  const flavorOptions = useMemo(() => {
    if (!filterOptions?.flavors) return [];
    return filterOptions.flavors
      .map((code) => ({
        code,
        label: FLAVOR_CATEGORIES[code as keyof typeof FLAVOR_CATEGORIES] || code,
      }))
      .filter((item) => item.label !== item.code);
  }, [filterOptions?.flavors]);

  const proteinTypeOptions = useMemo(() => {
    if (!filterOptions?.proteinTypes) return [];
    return filterOptions.proteinTypes.map((code) => ({
      code,
      label: PROTEIN_TYPES[code as keyof typeof PROTEIN_TYPES] || code,
    }));
  }, [filterOptions?.proteinTypes]);

  const formOptions = useMemo(() => {
    if (!filterOptions?.forms) return [];
    return filterOptions.forms.map((code) => ({
      code,
      label: PRODUCT_FORMS[code as keyof typeof PRODUCT_FORMS] || code,
    }));
  }, [filterOptions?.forms]);

  const packageTypeOptions = useMemo(() => {
    if (!filterOptions?.packageTypes) return [];
    return filterOptions.packageTypes.map((code) => ({
      code,
      label: PACKAGE_TYPES[code as keyof typeof PACKAGE_TYPES] || code,
    }));
  }, [filterOptions?.packageTypes]);

  // 필터 활성화 상태 확인
  const activeStates = getFilterActiveState(filters);

  // 필터 값 포맷팅
  const proteinValue = formatRangeValue(
    filters.proteinRange,
    [FILTER_RANGES.PROTEIN.MIN, FILTER_RANGES.PROTEIN.MAX],
    "g",
  );
  const caloriesValue = formatRangeValue(
    filters.caloriesRange,
    [FILTER_RANGES.CALORIES.MIN, FILTER_RANGES.CALORIES.MAX],
    "kcal",
  );
  const carbsValue = formatRangeValue(
    filters.carbsRange,
    [FILTER_RANGES.CARBS.MIN, FILTER_RANGES.CARBS.MAX],
    "g",
  );
  const sugarValue = formatRangeValue(
    filters.sugarRange,
    [FILTER_RANGES.SUGAR.MIN, FILTER_RANGES.SUGAR.MAX],
    "g",
  );
  const flavorsValue = formatMultiSelectValue(filters.flavors, flavorOptions.length);
  const proteinTypesValue = formatMultiSelectValue(filters.proteinTypes, proteinTypeOptions.length);
  const formsValue = formatMultiSelectValue(filters.forms, formOptions.length);
  const packageTypesValue = formatMultiSelectValue(filters.packageTypes, packageTypeOptions.length);

  // 필터 변경 핸들러들
  const handleRangeChange = (
    key: "proteinRange" | "caloriesRange" | "carbsRange" | "sugarRange",
    value: [number, number],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelectChange = (
    key: "flavors" | "proteinTypes" | "forms" | "packageTypes",
    values: string[],
  ) => {
    if (key === "forms") {
      // 파우더가 선택 해제되면 packageTypes 초기화
      const newPackageTypes = values.includes("powder") ? filters.packageTypes : [];
      onFiltersChange({
        ...filters,
        [key]: values,
        packageTypes: newPackageTypes,
      });
    } else {
      onFiltersChange({
        ...filters,
        [key]: values,
      });
    }
  };

  const resetFilters = () => {
    onFiltersChange(getDefaultFilters());
  };


  // 필터 버튼 스켈레톤 컴포넌트
  const FilterButtonSkeleton = ({ width }: { width: string }) => (
    <Skeleton className={`h-9 ${width} rounded-md flex-shrink-0`} />
  );

  if (isLoading) {
    return (
      <div className="border-b pb-4 mb-4">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <div className="flex gap-2 min-w-max">
            {/* Range 필터 스켈레톤 */}
            <FilterButtonSkeleton width="w-20" />
            <FilterButtonSkeleton width="w-20" />
            <FilterButtonSkeleton width="w-24" />
            <FilterButtonSkeleton width="w-16" />

            {/* MultiSelect 필터 스켈레톤 */}
            <FilterButtonSkeleton width="w-16" />
            <FilterButtonSkeleton width="w-24" />
            <FilterButtonSkeleton width="w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b pb-4 mb-4">
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div className="flex gap-2 min-w-max">
          {/* 단백질 필터 */}
          <FilterButton
            label="단백질"
            value={proteinValue}
            isActive={activeStates.protein}
            type="range"
          >
            {({ onClose }) => (
              <RangeFilterPopover
                label="단백질 함량"
                value={filters.proteinRange}
                min={FILTER_RANGES.PROTEIN.MIN}
                max={FILTER_RANGES.PROTEIN.MAX}
                step={1}
                unit="g"
                onApply={(value) => handleRangeChange("proteinRange", value)}
                onClose={onClose}
              />
            )}
          </FilterButton>

          {/* 칼로리 필터 */}
          <FilterButton
            label="칼로리"
            value={caloriesValue}
            isActive={activeStates.calories}
            type="range"
          >
            {({ onClose }) => (
              <RangeFilterPopover
                label="칼로리"
                value={filters.caloriesRange}
                min={FILTER_RANGES.CALORIES.MIN}
                max={FILTER_RANGES.CALORIES.MAX}
                step={10}
                unit="kcal"
                onApply={(value) => handleRangeChange("caloriesRange", value)}
                onClose={onClose}
              />
            )}
          </FilterButton>

          {/* 탄수화물 필터 */}
          <FilterButton
            label="탄수화물"
            value={carbsValue}
            isActive={activeStates.carbs}
            type="range"
          >
            {({ onClose }) => (
              <RangeFilterPopover
                label="탄수화물 함량"
                value={filters.carbsRange}
                min={FILTER_RANGES.CARBS.MIN}
                max={FILTER_RANGES.CARBS.MAX}
                step={1}
                unit="g"
                onApply={(value) => handleRangeChange("carbsRange", value)}
                onClose={onClose}
              />
            )}
          </FilterButton>

          {/* 당 필터 */}
          <FilterButton
            label="당"
            value={sugarValue}
            isActive={activeStates.sugar}
            type="range"
          >
            {({ onClose }) => (
              <RangeFilterPopover
                label="당 함량"
                value={filters.sugarRange}
                min={FILTER_RANGES.SUGAR.MIN}
                max={FILTER_RANGES.SUGAR.MAX}
                step={1}
                unit="g"
                onApply={(value) => handleRangeChange("sugarRange", value)}
                onClose={onClose}
              />
            )}
          </FilterButton>

          {/* 맛 필터 */}
          {flavorOptions.length > 0 && (
            <FilterButton
              label="맛"
              value={flavorsValue}
              isActive={activeStates.flavors}
            >
              {({ onClose }) => (
                <ButtonSelectFilterPopover
                  label="맛"
                  options={flavorOptions}
                  selectedValues={filters.flavors}
                  onApply={(values) => handleMultiSelectChange("flavors", values)}
                  onClose={onClose}
                />
              )}
            </FilterButton>
          )}

          {/* 단백질 종류 필터 */}
          {proteinTypeOptions.length > 0 && (
            <FilterButton
              label="단백질 종류"
              value={proteinTypesValue}
              isActive={activeStates.proteinTypes}
            >
              {({ onClose }) => (
                <ButtonSelectFilterPopover
                  label="단백질 종류"
                  options={proteinTypeOptions}
                  selectedValues={filters.proteinTypes}
                  onApply={(values) => handleMultiSelectChange("proteinTypes", values)}
                  onClose={onClose}
                />
              )}
            </FilterButton>
          )}

          {/* 제품 형태 필터 */}
          {formOptions.length > 0 && (
            <FilterButton
              label="제품 형태"
              value={formsValue}
              isActive={activeStates.forms}
            >
              {({ onClose }) => (
                <ButtonSelectFilterPopover
                  label="제품 형태"
                  options={formOptions}
                  selectedValues={filters.forms}
                  onApply={(values) => handleMultiSelectChange("forms", values)}
                  onClose={onClose}
                  onRealTimeChange={(values) => handleMultiSelectChange("forms", values)}
                />
              )}
            </FilterButton>
          )}

          {/* 포장 타입 필터 (파우더 선택 시만 표시) */}
          {filters.forms.includes("powder") && packageTypeOptions.length > 0 && (
            <FilterButton
              label="포장 타입"
              value={packageTypesValue}
              isActive={activeStates.packageTypes}
            >
              {({ onClose }) => (
                <ButtonSelectFilterPopover
                  label="포장 타입"
                  options={packageTypeOptions}
                  selectedValues={filters.packageTypes}
                  onApply={(values) => handleMultiSelectChange("packageTypes", values)}
                  onClose={onClose}
                />
              )}
            </FilterButton>
          )}
        </div>

        {/* 초기화 버튼 */}
        {!isDefaultFilters(filters) && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="ml-2 h-9 px-3 flex-shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
