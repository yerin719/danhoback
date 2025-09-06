"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  return (
    <div className="p-4 space-y-4">
      <ScrollArea className="rounded border h-48 scrollbar-hide">
        <div className="p-3 space-y-2">
          {options.map((option) => (
            <div key={option.code} className="flex items-center space-x-2">
              <Checkbox
                id={`${label}-${option.code}`}
                checked={tempValues.includes(option.code)}
                onCheckedChange={(checked) => handleToggle(option.code, checked as boolean)}
              />
              <Label htmlFor={`${label}-${option.code}`} className="text-sm cursor-pointer flex-1">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleClearAll} className="flex-1">
          초기화
        </Button>
        <Button size="sm" onClick={handleApply} className="flex-1">
          적용
        </Button>
      </div>
    </div>
  );
}
