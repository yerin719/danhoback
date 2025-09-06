"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">{label}</Label>
          <span className="text-sm text-muted-foreground">
            {tempValue[0]}{unit} ~ {tempValue[1]}{unit}
          </span>
        </div>
        
        <Slider
          value={tempValue}
          onValueChange={(newValue) => setTempValue(newValue as [number, number])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex-1"
        >
          초기화
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          className="flex-1"
        >
          적용
        </Button>
      </div>
    </div>
  );
}