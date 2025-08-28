"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type CommunityPost } from "@/lib/community";
import { formatCount, formatDate } from "@/lib/community-utils";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface CommunityPostItemProps {
  post: CommunityPost;
  hideCategories?: boolean;
}

export default function CommunityPostItem({
  post,
  hideCategories = false,
}: CommunityPostItemProps) {

  return (
    <div className="py-5 border-b border-border/60 last:border-b-0 first:py-3">
      <div className="flex-1 min-w-0 space-y-3">
        {/* 상단: 제목과 배지들 */}
        <div className="space-y-2">
          <Link
            href={`/community/${post.id}`}
            className="font-semibold text-lg leading-tight hover:text-primary transition-colors block line-clamp-2"
          >
            {post.title}
          </Link>
          {!hideCategories && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-medium bg-background/80">
                {post.category}
              </Badge>
            </div>
          )}
        </div>

        {/* 하단: 메타 정보 */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium text-xs">
                {post.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground/80">{post.author.name}</span>
            <span className="text-muted-foreground/60">·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="font-medium">{formatCount(post.likes)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">{formatCount(post.comments)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="font-medium">{formatCount(post.views)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
