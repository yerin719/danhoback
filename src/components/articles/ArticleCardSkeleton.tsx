import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton() {
  return (
    <Card className="h-full border-none shadow-none p-0">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="aspect-video w-full mb-4 rounded-lg" />

      <CardContent className="pt-0 p-0">
        <div className="space-y-3">
          {/* 제목 스켈레톤 */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          {/* 요약 스켈레톤 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* 카테고리 스켈레톤 */}
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}