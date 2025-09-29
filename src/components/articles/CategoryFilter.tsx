"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ARTICLE_CATEGORIES } from "@/features/articles/constants";
import { Filter } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";

function CategoryFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const [open, setOpen] = useState(false);

  const handleCategoryChange = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`/articles?${params.toString()}`);
      setOpen(false); // drawer 닫기
    },
    [router, searchParams],
  );

  const getCurrentCategoryLabel = () => {
    if (currentCategory === "all") return "전체";
    return ARTICLE_CATEGORIES[currentCategory as keyof typeof ARTICLE_CATEGORIES] || "전체";
  };

  return (
    <>
      {/* 데스크톱 버전 (sm 이상) */}
      <div className="hidden sm:flex flex-wrap gap-3">
        <Button
          variant={currentCategory === "all" ? "default" : "outline"}
          onClick={() => handleCategoryChange("all")}
          size="sm"
        >
          전체
        </Button>
        {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
          <Button
            key={key}
            variant={currentCategory === key ? "default" : "outline"}
            onClick={() => handleCategoryChange(key)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* 모바일 버전 (sm 미만) */}
      <div className="sm:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {getCurrentCategoryLabel()}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>카테고리 선택</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <RadioGroup value={currentCategory} onValueChange={handleCategoryChange}>
                <div className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">
                    전체
                  </Label>
                </div>
                {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

export default function CategoryFilter() {
  return (
    <Suspense fallback={
      <>
        {/* 데스크톱 fallback */}
        <div className="hidden sm:flex flex-wrap gap-3">
          <Button variant="default" size="sm">
            전체
          </Button>
          {Object.entries(ARTICLE_CATEGORIES).map(([key, label]) => (
            <Button key={key} variant="outline" size="sm">
              {label}
            </Button>
          ))}
        </div>
        {/* 모바일 fallback */}
        <div className="sm:hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            전체
          </Button>
        </div>
      </>
    }>
      <CategoryFilterContent />
    </Suspense>
  );
}