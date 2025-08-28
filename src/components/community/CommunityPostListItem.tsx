"use client";

import { Badge } from "@/components/ui/badge";
import { type CommunityPost } from "@/lib/community";
import { formatCount, formatDate } from "@/lib/community-utils";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface CommunityPostListItemProps {
  post: CommunityPost;
  hideCategories?: boolean;
}

export default function CommunityPostListItem({ post, hideCategories = false }: CommunityPostListItemProps) {

  return (
    <div className="py-3 border-b border-border/40 last:border-b-0">
      <div className="flex items-center gap-4 text-sm">
        {/* 카테고리 */}
        {!hideCategories && (
          <div className="w-16 flex-shrink-0">
            <Badge variant="outline" className="text-xs h-5">
              {post.category}
            </Badge>
          </div>
        )}

        {/* 제목 */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/community/${post.id}`}
            className="font-medium hover:text-primary transition-colors truncate block"
          >
            {post.title}
          </Link>
        </div>

        {/* 작성자 */}
        <div className="w-20 flex-shrink-0 text-muted-foreground text-right">
          {post.author.name}
        </div>

        {/* 시간 */}
        <div className="w-28 flex-shrink-0 text-muted-foreground text-right">
          {formatDate(post.createdAt)}
        </div>

        {/* 하트 */}
        <div className="w-8 flex-shrink-0 flex items-center justify-end gap-1 text-muted-foreground">
          <Heart className="h-3 w-3" />
          <span>{formatCount(post.likes)}</span>
        </div>

        {/* 댓글 */}
        <div className="w-8 flex-shrink-0 flex items-center justify-end gap-1 text-muted-foreground">
          <MessageCircle className="h-3 w-3" />
          <span>{formatCount(post.comments)}</span>
        </div>

        {/* 조회수 */}
        <div className="w-12 flex-shrink-0 flex items-center justify-start gap-1 text-muted-foreground">
          <Eye className="h-3 w-3" />
          <span>{formatCount(post.views)}</span>
        </div>
      </div>
    </div>
  );
}
