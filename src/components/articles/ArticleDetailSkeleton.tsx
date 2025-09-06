import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 뒤로 가기 버튼 스켈레톤 */}
      <div className="mb-8">
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* 메인 콘텐츠 */}
        <div className="xl:col-span-2">
          <article>
            {/* 헤더 */}
            <header className="mb-12">
              {/* 대표 이미지 스켈레톤 */}
              <Skeleton className="aspect-video w-full mb-8 rounded-lg" />

              {/* 제목 스켈레톤 */}
              <div className="space-y-3 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-4/5" />
              </div>

              {/* 요약 스켈레톤 */}
              <div className="space-y-2 mb-8">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>

              {/* 메타 정보 스켈레톤 */}
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* 구분선 */}
              <div className="border-b mb-4" />

              {/* 태그 스켈레톤 */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-14 rounded" />
                </div>
              </div>
            </header>

            {/* 콘텐츠 스켈레톤 */}
            <div className="mb-16 space-y-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={`h-4 ${
                    i % 4 === 3 ? 'w-3/4' : 
                    i % 4 === 2 ? 'w-5/6' : 
                    i % 4 === 1 ? 'w-full' : 'w-4/5'
                  }`} 
                />
              ))}
            </div>
          </article>
        </div>

        {/* 사이드바 스켈레톤 - 데스크탑 */}
        <div className="hidden xl:block">
          <div className="sticky top-8">
            <div className="space-y-6">
              {/* 관련 글 제목 */}
              <Skeleton className="h-7 w-20" />
              
              {/* 관련 글 항목들 */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 mb-6">
                  <Skeleton className="flex-shrink-0 w-20 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 관련 글 - 모바일 */}
      <div className="xl:hidden">
        <div className="space-y-6">
          <Skeleton className="h-7 w-20" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}