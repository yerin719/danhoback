"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  FLAVOR_CATEGORIES,
  PACKAGE_TYPES,
  PRODUCT_FORMS,
  PROTEIN_TYPES,
} from "@/features/products/constants";
import { useAllFilterOptions } from "@/features/products/hooks/useFilterOptions";
import { useMemo } from "react";

interface FilterState {
  flavors: string[];
  proteinTypes: string[];
  proteinRange: [number, number];
  caloriesRange: [number, number];
  carbsRange: [number, number];
  sugarRange: [number, number];
  forms: string[];
  packageTypes: string[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  // DB에서 실제 필터 옵션 가져오기
  const { flavors, proteinTypes, forms, packageTypes, isLoading } = useAllFilterOptions();

  // DB에서 받은 코드를 한글 레이블과 매핑
  const flavorOptions = useMemo(() => {
    if (!flavors.data) return [];
    return flavors.data
      .map((code) => ({
        code,
        label: FLAVOR_CATEGORIES[code as keyof typeof FLAVOR_CATEGORIES] || code,
      }))
      .filter((item) => item.label !== item.code); // 매핑이 없는 항목 제외
  }, [flavors.data]);

  const proteinTypeOptions = useMemo(() => {
    if (!proteinTypes.data) return [];
    return proteinTypes.data.map((code) => ({
      code,
      label: PROTEIN_TYPES[code as keyof typeof PROTEIN_TYPES] || code,
    }));
  }, [proteinTypes.data]);

  const formOptions = useMemo(() => {
    if (!forms.data) return [];
    return forms.data.map((code) => ({
      code,
      label: PRODUCT_FORMS[code as keyof typeof PRODUCT_FORMS] || code,
    }));
  }, [forms.data]);

  const packageTypeOptions = useMemo(() => {
    if (!packageTypes.data) return [];
    return packageTypes.data.map((code) => ({
      code,
      label: PACKAGE_TYPES[code as keyof typeof PACKAGE_TYPES] || code,
    }));
  }, [packageTypes.data]);

  const handleFlavorChange = (flavorCode: string, checked: boolean) => {
    const newFlavors = checked
      ? [...filters.flavors, flavorCode]
      : filters.flavors.filter((f) => f !== flavorCode);

    onFiltersChange({
      ...filters,
      flavors: newFlavors,
    });
  };

  const handleProteinTypeChange = (proteinCode: string, checked: boolean) => {
    const newProteinTypes = checked
      ? [...filters.proteinTypes, proteinCode]
      : filters.proteinTypes.filter((p) => p !== proteinCode);

    onFiltersChange({
      ...filters,
      proteinTypes: newProteinTypes,
    });
  };

  const handleRangeChange = (
    key: "proteinRange" | "caloriesRange" | "carbsRange" | "sugarRange",
    value: [number, number],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleFormChange = (formCode: string, checked: boolean) => {
    const newForms = checked
      ? [...filters.forms, formCode]
      : filters.forms.filter((f) => f !== formCode);

    // 파우더가 선택 해제되면 packageTypes 초기화
    const newPackageTypes = newForms.includes("powder") ? filters.packageTypes : [];

    onFiltersChange({
      ...filters,
      forms: newForms,
      packageTypes: newPackageTypes,
    });
  };

  const handlePackageTypeChange = (packageCode: string, checked: boolean) => {
    const newPackageTypes = checked
      ? [...filters.packageTypes, packageCode]
      : filters.packageTypes.filter((p) => p !== packageCode);

    onFiltersChange({
      ...filters,
      packageTypes: newPackageTypes,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      flavors: [],
      proteinTypes: [],
      proteinRange: [15, 30],
      caloriesRange: [80, 200],
      carbsRange: [0, 15],
      sugarRange: [0, 10],
      forms: [],
      packageTypes: [],
    });
  };

  if (isLoading) {
    return (
      <div className="bg-background border-b pb-6 mb-8">
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-muted-foreground">필터 옵션을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-b pb-6 mb-8">
      <div className="space-y-6">
        {/* Slider 필터 행 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 단백질 함량 슬라이더 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">단백질</label>
              <span className="text-xs text-muted-foreground">
                {filters.proteinRange[0]}g - {filters.proteinRange[1]}g
              </span>
            </div>
            <Slider
              value={filters.proteinRange}
              onValueChange={(value) =>
                handleRangeChange("proteinRange", value as [number, number])
              }
              min={15}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15g</span>
              <span>30g</span>
            </div>
          </div>

          {/* 칼로리 슬라이더 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">칼로리</label>
              <span className="text-xs text-muted-foreground">
                {filters.caloriesRange[0]}kcal - {filters.caloriesRange[1]}kcal
              </span>
            </div>
            <Slider
              value={filters.caloriesRange}
              onValueChange={(value) =>
                handleRangeChange("caloriesRange", value as [number, number])
              }
              min={80}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>80kcal</span>
              <span>200kcal</span>
            </div>
          </div>

          {/* 탄수화물 함량 슬라이더 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">탄수화물</label>
              <span className="text-xs text-muted-foreground">
                {filters.carbsRange[0]}g - {filters.carbsRange[1]}g
              </span>
            </div>
            <Slider
              value={filters.carbsRange}
              onValueChange={(value) => handleRangeChange("carbsRange", value as [number, number])}
              min={0}
              max={15}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>15g</span>
            </div>
          </div>

          {/* 당 함량 슬라이더 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">당</label>
              <span className="text-xs text-muted-foreground">
                {filters.sugarRange[0]}g - {filters.sugarRange[1]}g
              </span>
            </div>
            <Slider
              value={filters.sugarRange}
              onValueChange={(value) => handleRangeChange("sugarRange", value as [number, number])}
              min={0}
              max={10}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>10g</span>
            </div>
          </div>
        </div>

        {/* Checkbox 필터 행 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 맛 필터 - DB 데이터 사용 */}
          {flavorOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">맛</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {flavorOptions.map((flavor) => (
                  <div key={flavor.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`flavor-${flavor.code}`}
                      checked={filters.flavors.includes(flavor.code)}
                      onCheckedChange={(checked) =>
                        handleFlavorChange(flavor.code, checked as boolean)
                      }
                    />
                    <label htmlFor={`flavor-${flavor.code}`} className="text-sm cursor-pointer">
                      {flavor.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 단백질 종류 필터 - DB 데이터 사용 */}
          {proteinTypeOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">단백질 종류</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {proteinTypeOptions.map((proteinType) => (
                  <div key={proteinType.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`protein-${proteinType.code}`}
                      checked={filters.proteinTypes.includes(proteinType.code)}
                      onCheckedChange={(checked) =>
                        handleProteinTypeChange(proteinType.code, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`protein-${proteinType.code}`}
                      className="text-sm cursor-pointer"
                    >
                      {proteinType.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제품 형태 & 포장 타입 필터 - DB 데이터 사용 */}
          <div className="space-y-3">
            {formOptions.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">제품 형태</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formOptions.map((form) => (
                    <div key={form.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`form-${form.code}`}
                        checked={filters.forms.includes(form.code)}
                        onCheckedChange={(checked) =>
                          handleFormChange(form.code, checked as boolean)
                        }
                      />
                      <label htmlFor={`form-${form.code}`} className="text-sm cursor-pointer">
                        {form.label}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 포장 타입 (파우더 선택 시만 표시) */}
            {filters.forms.includes("powder") && packageTypeOptions.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">포장 타입</label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {packageTypeOptions.map((packageType) => (
                    <div key={packageType.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`package-${packageType.code}`}
                        checked={filters.packageTypes.includes(packageType.code)}
                        onCheckedChange={(checked) =>
                          handlePackageTypeChange(packageType.code, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`package-${packageType.code}`}
                        className="text-sm cursor-pointer"
                      >
                        {packageType.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 필터 초기화 버튼 */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}