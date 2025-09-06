"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterButtonProps {
  label: string;
  value: string;
  isActive: boolean;
  children: React.ReactNode | (({ onClose }: { onClose: () => void }) => React.ReactNode);
  onOpenChange?: (open: boolean) => void;
}

export default function FilterButton({
  label,
  value,
  isActive,
  children,
  onOpenChange,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className="h-9 px-3 text-sm whitespace-nowrap flex items-center gap-1"
        >
          <span className="font-medium">{label}</span>
          {isActive && value && <span className="text-sm opacity-90">{value}</span>}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start" sideOffset={4}>
        {typeof children === "function" ? children({ onClose: () => setIsOpen(false) }) : children}
      </PopoverContent>
    </Popover>
  );
}
