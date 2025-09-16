"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterButtonProps {
  label: string;
  value: string;
  isActive: boolean;
  children: React.ReactNode | (({ onClose }: { onClose: () => void }) => React.ReactNode);
  onOpenChange?: (open: boolean) => void;
  type?: "range" | "multiselect";
}

export default function FilterButton({
  label,
  value,
  isActive,
  children,
  onOpenChange,
  type = "multiselect",
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const triggerButton = (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`h-9 px-3 text-sm whitespace-nowrap flex items-center gap-1 ${
        isOpen && !isActive ? "bg-accent" : ""
      }`}
    >
      {type === "range" && isActive && value ? (
        <span className="font-medium">{value}</span>
      ) : (
        <>
          <span className="font-medium">{label}</span>
          {isActive && value && <span className="text-sm opacity-90">{value}</span>}
        </>
      )}
      <ChevronDown className="h-3 w-3 opacity-50" />
    </Button>
  );

  const filterContent =
    typeof children === "function" ? children({ onClose: () => setIsOpen(false) }) : children;

  // 모바일: Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent className="h-[50vh] p-0 flex flex-col">
          {/* 제목 */}
          <div className="px-6 py-4 border-b flex-shrink-0">
            <h3 className="text-lg font-semibold text-center">{label}</h3>
          </div>

          {/* 필터 내용 */}
          <div className="flex-1 overflow-auto">{filterContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // 데스크톱: Popover
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        className="w-[450px] p-0 z-40"
        align="start"
        sideOffset={8}
        avoidCollisions={true}
      >
        {filterContent}
      </PopoverContent>
    </Popover>
  );
}
