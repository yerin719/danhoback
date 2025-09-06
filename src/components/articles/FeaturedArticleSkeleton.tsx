import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedArticleSkeleton() {
  return (
    <Card className="border-none shadow-none overflow-hidden p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* 왼쪽: 이미지 스켈레톤 */}
        <Skeleton className="aspect-video w-full" />

        {/* 오른쪽: 콘텐츠 스켈레톤 */}
        <div className="p-8 flex flex-col justify-center">
          <div className="space-y-4">
            {/* 제목 스켈레톤 */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5" />
            </div>

            {/* 요약 스켈레톤 */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* 카테고리 스켈레톤 */}
            <Skeleton className="h-4 w-20" />

            {/* 여백 */}
            <div className="pt-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}