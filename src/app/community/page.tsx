"use client";

import CommunityFilters from "@/components/community/CommunityFilters";
import CommunityPostItem from "@/components/community/CommunityPostItem";
import CommunityPostListItem from "@/components/community/CommunityPostListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { communityPosts, searchPosts, type CommunityCategory } from "@/lib/community";
import { COMMUNITY_CONSTANTS } from "@/lib/community-utils";
import { Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 실제 입력 필드 값
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 홈 상태인지 확인
  const isHome = !selectedCategory && !searchQuery.trim();

  // 필터링된 포스트 계산
  const filteredPosts = useMemo(() => {
    let posts = communityPosts;

    // 검색어 필터링
    if (searchQuery.trim()) {
      posts = searchPosts(searchQuery);
    }

    // 카테고리 필터링
    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    // 최신순 정렬
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [selectedCategory, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    // 검색 시 필터 초기화
    if (searchInput.trim()) {
      setSelectedCategory(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSearchInput("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
  };

  const hasActiveFilters = selectedCategory || searchQuery.trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">커뮤니티</h1>
          <p className="text-muted-foreground mt-1">단백질 생활의 모든 이야기를 나누어보세요</p>
        </div>
        <Link href="/community/write">
          <Button className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="flex gap-8">
        {/* 데스크톱 필터 사이드바 */}
        <aside className="hidden lg:block">
          <div className="w-80 space-y-4">
            {/* 검색바 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 내용, 해시태그로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>

            <CommunityFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onReset={resetFilters}
              onClearSearch={clearSearch}
            />
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1">
          {/* 모바일 검색바 */}
          <div className="lg:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 내용, 해시태그로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
          </div>

          {/* 모바일 필터 버튼 */}
          <div className="lg:hidden mb-4">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  필터
                  {hasActiveFilters && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                      {selectedCategory ? 1 : 0}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>필터</SheetTitle>
                  <SheetDescription>
                    카테고리와 해시태그로 게시글을 필터링할 수 있습니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <CommunityFilters
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    onReset={resetFilters}
                    onClearSearch={clearSearch}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 포스트 목록 */}
          {isHome ? (
            /* 홈 화면: 최신글/인기글 섹션 */
            <div className="space-y-8">
              {/* 최신글 섹션 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">최신글</h2>
                <div className="bg-card">
                  {communityPosts
                    .sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                    )
                    .slice(0, COMMUNITY_CONSTANTS.HOME_SECTION_POST_LIMIT)
                    .map((post) => (
                      <CommunityPostListItem key={`latest-${post.id}`} post={post} />
                    ))}
                </div>
              </div>

              {/* 인기글 섹션 */}
              <div>
                <h2 className="text-xl font-semibold mb-4">인기글</h2>
                <div className="bg-card">
                  {communityPosts
                    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
                    .slice(0, COMMUNITY_CONSTANTS.HOME_SECTION_POST_LIMIT)
                    .map((post) => (
                      <CommunityPostListItem key={`popular-${post.id}`} post={post} />
                    ))}
                </div>
              </div>
            </div>
          ) : filteredPosts.length > 0 ? (
            /* 필터링된 목록 */
            <div>
              {/* 선택된 필터 표시 */}
              {(selectedCategory || searchQuery.trim()) && (
                <h2 className="text-xl font-semibold mb-4">
                  {selectedCategory || `"${searchQuery}" 검색결과`}
                </h2>
              )}

              <div className="bg-card">
                {filteredPosts.map((post) =>
                  searchQuery.trim() ? (
                    <CommunityPostListItem key={post.id} post={post} />
                  ) : (
                    <CommunityPostItem
                      key={post.id}
                      post={post}
                      hideCategories={selectedCategory ? true : false}
                    />
                  ),
                )}
              </div>
            </div>
          ) : (
            /* 검색 결과 없음 */
            <div>
              {/* 선택된 필터 표시 */}
              {(selectedCategory || searchQuery.trim()) && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory || `"${searchQuery}" 검색결과`}
                  </h2>
                </div>
              )}

              <div className="text-center py-12">
                <div className="text-muted-foreground">검색 조건에 맞는 게시글이 없습니다.</div>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  필터 초기화
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
