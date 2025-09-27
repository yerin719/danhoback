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
    <div className={isMobile ? "flex flex-col h-full" : "p-8 space-y-4"}>
      {/* 슬라이더 영역 */}
      <div className={isMobile ? "flex-1 px-6 pt-10" : ""}>
        <div className={isMobile ? "space-y-4" : "space-y-3"}>
          {/* 설명 텍스트 */}
          <div className="text-center">
            <span className={`text-black font-semibold ${isMobile ? "text-lg" : "text-sm"}`}>
              {label}을 설정해주세요.
            </span>
          </div>

          <div className="flex justify-center items-center">
            <span className={`text-black font-semibold ${isMobile ? "text-3xl" : "text-2xl"}`}>
              <span className="text-yellow-500">{tempValue[0]}</span>
              {unit} ~ <span className="text-yellow-500">{tempValue[1]}</span>
              {unit}
            </span>
          </div>

          <div className={isMobile ? "py-4 mb-12" : "mb-10"}>
            <Slider
              value={tempValue}
              onValueChange={(newValue) => setTempValue(newValue as [number, number])}
              min={min}
              max={max}
              step={step}
              className="w-full [&_[role=slider]]:!h-[30px] [&_[role=slider]]:!w-[30px] [&_[role=slider]]:!border-black [&_[role=slider]]:!border-1"
            />
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
            className={isMobile ? "h-12 flex-1 font-semibold" : "h-12 flex-1 font-semibold"}
          >
            초기화
          </Button>
          <Button
            size={isMobile ? "default" : "sm"}
            onClick={handleApply}
            className={isMobile ? "h-12 flex-[2] font-semibold" : "h-12 flex-[2] font-semibold"}
          >
            상품보기
          </Button>
        </div>
      </div>
    </div>
  );
}
