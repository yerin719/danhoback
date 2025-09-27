"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

function SearchInputContent({
  className,
  placeholder = "제품명, 브랜드명 검색",
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // URL의 검색 파라미터와 동기화
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  const handleSearch = () => {
    if (query.trim()) {
      // 기존 필터 파라미터 유지하면서 검색어 추가
      const params = new URLSearchParams(searchParams);
      params.set("q", query.trim());
      router.push(`/products?${params.toString()}`);
    } else {
      // 검색어가 없으면 q 파라미터 제거
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
      router.push(newUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
    router.push(newUrl);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full",
          query ? "pr-20" : "pr-12"
        )}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <Suspense fallback={
      <div className={cn("relative", props.className)}>
        <Input
          type="text"
          placeholder={props.placeholder || "제품명, 브랜드명 검색"}
          disabled
          className="w-full pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    }>
      <SearchInputContent {...props} />
    </Suspense>
  );
}