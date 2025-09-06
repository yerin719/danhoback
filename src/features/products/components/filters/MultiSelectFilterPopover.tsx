"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";

interface Option {
  code: string;
  label: string;
}

interface MultiSelectFilterPopoverProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  onClose: () => void;
  onRealTimeChange?: (values: string[]) => void;
}

export default function MultiSelectFilterPopover({
  label,
  options,
  selectedValues,
  onApply,
  onClose,
  onRealTimeChange,
}: MultiSelectFilterPopoverProps) {
  const [tempValues, setTempValues] = useState<string[]>(selectedValues);

  const handleToggle = (code: string, checked: boolean) => {
    const newValues = checked ? [...tempValues, code] : tempValues.filter((v) => v !== code);

    setTempValues(newValues);

    // 실시간으로 부모에게 변경사항 알림 (제품형태 필터인 경우에만)
    if (onRealTimeChange && (label === "제품 형태" || label === "제품형태")) {
      onRealTimeChange(newValues);
    }
  };

  const handleClearAll = () => {
    setTempValues([]);
  };

  const handleApply = () => {
    onApply(tempValues);
    onClose();
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={isMobile ? "flex flex-col h-full" : "p-4 space-y-4"}>
      {/* 스크롤 영역 */}
      <div className={isMobile ? "flex-1 px-6 pt-2" : ""}>
        <ScrollArea className={`rounded border scrollbar-hide ${isMobile ? "h-64" : "h-48"} mb-2`}>
          <div className={isMobile ? "p-4 space-y-4" : "p-3 space-y-2"}>
            {options.map((option) => (
              <div
                key={option.code}
                className={`flex items-center space-x-3 ${isMobile ? "py-2" : ""}`}
              >
                <Checkbox
                  id={`${label}-${option.code}`}
                  checked={tempValues.includes(option.code)}
                  onCheckedChange={(checked) => handleToggle(option.code, checked as boolean)}
                  className={isMobile ? "h-5 w-5" : ""}
                />
                <Label
                  htmlFor={`${label}-${option.code}`}
                  className={`cursor-pointer flex-1 ${isMobile ? "text-base" : "text-sm"}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 버튼 영역 */}
      <div className={isMobile ? "p-6 pt-4 border-t bg-background flex-shrink-0" : ""}>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={handleClearAll}
            className={isMobile ? "h-12 flex-1" : "flex-1"}
          >
            초기화
          </Button>
          <Button
            size={isMobile ? "default" : "sm"}
            onClick={handleApply}
            className={isMobile ? "h-12 flex-[2]" : "flex-1"}
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}
