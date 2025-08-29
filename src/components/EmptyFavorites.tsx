import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6">
        <div className="relative">
          <Heart className="h-24 w-24 text-muted-foreground/20" />
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40 absolute bottom-0 right-0" />
        </div>
      </div>
      
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-semibold text-muted-foreground">
          찜한 제품이 없습니다
        </h2>
        <p className="text-muted-foreground">
          마음에 드는 제품을 찜해보세요!
        </p>
      </div>

      <Button asChild size="lg">
        <Link href="/products" className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          제품 둘러보기
        </Link>
      </Button>
    </div>
  );
}