"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Option {
  code: string;
  label: string;
}

interface ButtonSelectFilterPopoverProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  onClose: () => void;
  onRealTimeChange?: (values: string[]) => void;
}

export default function ButtonSelectFilterPopover({
  label,
  options,
  selectedValues,
  onApply,
  onClose,
  onRealTimeChange,
}: ButtonSelectFilterPopoverProps) {
  const [tempValues, setTempValues] = useState<string[]>(selectedValues);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // 데스크톱에서 페이지당 8개 (4행 × 2열), 모바일은 전체
  const itemsPerPage = isMobile ? options.length : 8;
  const totalPages = Math.ceil(options.length / itemsPerPage);

  // 현재 페이지의 옵션들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOptions = isMobile ? options : options.slice(startIndex, endIndex);

  const handleToggle = (code: string) => {
    const newValues = tempValues.includes(code)
      ? tempValues.filter((v) => v !== code)
      : [...tempValues, code];

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={isMobile ? "flex flex-col h-full" : "p-4 space-y-4"}>
      {/* 버튼 그리드 영역 */}
      <div className={isMobile ? "flex-1 px-6 pt-2 overflow-auto" : ""}>
        <div className="grid grid-cols-2 gap-2 p-3">
          {currentOptions.map((option) => (
            <Button
              key={option.code}
              variant="ghost"
              onClick={() => handleToggle(option.code)}
              className={cn(
                "h-[45px] w-full min-w-[140px] justify-center font-bold transition-all border-0 hover:bg-current",
                option.label.length > 12 ? "text-sm" : "text-base",
                tempValues.includes(option.code)
                  ? "bg-primary text-primary-foreground hover:bg-primary"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100",
              )}
            >
              {option.label}
            </Button>
          ))}

          {/* 빈 칸 채우기 (데스크톱에서 마지막 페이지) */}
          {!isMobile && currentOptions.length < itemsPerPage && (
            <>
              {Array.from({ length: itemsPerPage - currentOptions.length }).map((_, index) => (
                <div key={`empty-${index}`} className="h-[45px] invisible" />
              ))}
            </>
          )}
        </div>

        {/* 데스크톱 페이지네이션 */}
        {!isMobile && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className={isMobile ? "p-6 pt-4 border-t bg-background flex-shrink-0 sticky bottom-0" : ""}>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={handleClearAll}
            className={isMobile ? "h-12 flex-1 font-bold" : "h-12 flex-1 font-bold"}
          >
            초기화
          </Button>
          <Button
            size={isMobile ? "default" : "sm"}
            onClick={handleApply}
            className={isMobile ? "h-12 flex-[2] font-bold" : "h-12 flex-[2] font-bold"}
          >
            상품보기
          </Button>
        </div>
      </div>
    </div>
  );
}