"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";

interface RangeFilterPopoverProps {
  label: string;
  value: [number, number];
  min: number;
  max: number;
  step: number;
  unit: string;
  onApply: (value: [number, number]) => void;
  onClose: () => void;
}

export default function RangeFilterPopover({
  label,
  value,
  min,
  max,
  step,
  unit,
  onApply,
  onClose,
}: RangeFilterPopoverProps) {
  const [tempValue, setTempValue] = useState<[number, number]>(value);

  const handleApply = () => {
    onApply(tempValue);
    onClose();
  };

  const handleReset = () => {
    const resetValue: [number, number] = [min, max];
    setTempValue(resetValue);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={isMobile ? "flex flex-col h-full" : "p-4 space-y-4"}>
      {/* 슬라이더 영역 */}
      <div className={isMobile ? "flex-1 px-6 pt-6" : ""}>
        <div className={isMobile ? "space-y-4" : "space-y-2"}>
          <div className="flex justify-center items-center">
            <span
              className={`text-muted-foreground ${isMobile ? "text-base font-semibold" : "text-sm"}`}
            >
              {tempValue[0]}
              {unit} ~ {tempValue[1]}
              {unit}
            </span>
          </div>

          <div className={isMobile ? "py-4" : ""}>
            <Slider
              value={tempValue}
              onValueChange={(newValue) => setTempValue(newValue as [number, number])}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
          </div>

          <div
            className={`flex justify-between text-muted-foreground ${isMobile ? "text-sm" : "text-xs"}`}
          >
            <span>
              {min}
              {unit}
            </span>
            <span>
              {max}
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className={isMobile ? "p-6 pt-4 border-t bg-background flex-shrink-0" : ""}>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={handleReset}
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
