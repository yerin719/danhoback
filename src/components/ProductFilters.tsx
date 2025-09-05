"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { PACKAGE_TYPES, PRODUCT_FORMS } from "@/features/products/constants";
import { flavorOptions } from "@/lib/products";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

// 대표 단백질 종류 (기본 노출)
const mainProteinTypes = [
  "분리유청단백(WPI)",
  "농축유청단백(WPC)",
  "완두단백",
  "카제인",
  "분리대두단백(ISP)",
];

// 추가 단백질 종류 (접기/펼치기)
const additionalProteinTypes = [
  "가수분해유청단백(WPH)",
  "가수분해분리유청단백(WPIH)",
  "농축대두단백(SPC)",
  "현미단백",
  "귀리단백",
  "농축우유단백(MPC)",
  "분리우유단백(MPI)",
  "산양유",
  "초유",
  "난백",
];

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [isProteinExpanded, setIsProteinExpanded] = useState(false);

  const handleFlavorChange = (flavor: string, checked: boolean) => {
    const newFlavors = checked
      ? [...filters.flavors, flavor]
      : filters.flavors.filter((f) => f !== flavor);

    onFiltersChange({
      ...filters,
      flavors: newFlavors,
    });
  };

  const handleProteinTypeChange = (proteinType: string, checked: boolean) => {
    const newProteinTypes = checked
      ? [...filters.proteinTypes, proteinType]
      : filters.proteinTypes.filter((p) => p !== proteinType);

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

  const handleFormChange = (form: string, checked: boolean) => {
    const newForms = checked
      ? [...filters.forms, form]
      : filters.forms.filter((f) => f !== form);

    // 파우더가 선택 해제되면 packageTypes 초기화
    const newPackageTypes = newForms.includes("powder")
      ? filters.packageTypes
      : [];

    onFiltersChange({
      ...filters,
      forms: newForms,
      packageTypes: newPackageTypes,
    });
  };

  const handlePackageTypeChange = (packageType: string, checked: boolean) => {
    const newPackageTypes = checked
      ? [...filters.packageTypes, packageType]
      : filters.packageTypes.filter((p) => p !== packageType);

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
          {/* 맛 필터 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">맛</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {flavorOptions
                .filter((f) => f !== "전체")
                .map((flavor) => (
                  <div key={flavor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`flavor-${flavor}`}
                      checked={filters.flavors.includes(flavor)}
                      onCheckedChange={(checked) => handleFlavorChange(flavor, checked as boolean)}
                    />
                    <label htmlFor={`flavor-${flavor}`} className="text-sm cursor-pointer">
                      {flavor}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* 단백질 종류 필터 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">단백질 종류</label>
            </div>

            {/* 대표 단백질 종류 */}
            <div className="grid grid-cols-2 gap-2">
              {mainProteinTypes.map((proteinType) => (
                <div key={proteinType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`protein-${proteinType}`}
                    checked={filters.proteinTypes.includes(proteinType)}
                    onCheckedChange={(checked) =>
                      handleProteinTypeChange(proteinType, checked as boolean)
                    }
                  />
                  <label htmlFor={`protein-${proteinType}`} className="text-sm cursor-pointer">
                    {proteinType}
                  </label>
                </div>
              ))}
            </div>

            {/* 접기/펼치기 추가 단백질 종류 */}
            <Collapsible open={isProteinExpanded} onOpenChange={setIsProteinExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <span className="text-xs text-muted-foreground">
                    {isProteinExpanded ? "접기" : `더보기 (${additionalProteinTypes.length}개)`}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${isProteinExpanded ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="grid grid-cols-2 gap-2 mt-2">
                {additionalProteinTypes.map((proteinType) => (
                  <div key={proteinType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`protein-${proteinType}`}
                      checked={filters.proteinTypes.includes(proteinType)}
                      onCheckedChange={(checked) =>
                        handleProteinTypeChange(proteinType, checked as boolean)
                      }
                    />
                    <label htmlFor={`protein-${proteinType}`} className="text-sm cursor-pointer">
                      {proteinType}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* 제품 형태 & 포장 타입 필터 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">제품 형태</label>
            </div>

            {/* 제품 형태 */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PRODUCT_FORMS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`form-${key}`}
                    checked={filters.forms.includes(key)}
                    onCheckedChange={(checked) => handleFormChange(key, checked as boolean)}
                  />
                  <label htmlFor={`form-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>

            {/* 포장 타입 (파우더 선택 시만 표시) */}
            {filters.forms.includes("powder") && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">포장 타입</label>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(PACKAGE_TYPES).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`package-${key}`}
                        checked={filters.packageTypes.includes(key)}
                        onCheckedChange={(checked) => handlePackageTypeChange(key, checked as boolean)}
                      />
                      <label htmlFor={`package-${key}`} className="text-sm cursor-pointer">
                        {label}
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
