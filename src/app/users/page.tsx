import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function MyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            설정
          </Link>
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="text-muted-foreground">
          내가 작성한 글과 댓글을 확인할 수 있습니다.
        </div>
        
        {/* TODO: 실제 내 활동 내용들 */}
      </div>
    </div>
  );
}