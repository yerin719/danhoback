"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, UserPost } from "@/lib/user";
import { Edit, Heart, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SimplePostsListProps {
  posts: UserPost[];
}

export default function SimplePostsList({ posts }: SimplePostsListProps) {
  const [userPosts, setUserPosts] = useState(posts);

  const handleLike = (postId: string) => {
    setUserPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleEdit = (postId: string) => {
    console.log("편집:", postId);
  };

  const handleDelete = (postId: string) => {
    const confirmed = window.confirm("게시물을 삭제하시겠습니까?");
    if (confirmed) {
      setUserPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const getCategoryInfo = (category: UserPost['category']) => {
    return { label: category, variant: 'outline' as const };
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">
            아직 작성한 게시물이 없습니다
          </h3>
          <p className="text-sm text-muted-foreground">
            첫 번째 글을 작성해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userPosts.map((post) => {
        const categoryInfo = getCategoryInfo(post.category);
        
        return (
          <div key={post.id} className="group pb-6 border-b border-border/50 last:border-b-0 relative">
            {/* 우측 하단 호버시 나타나는 편집/삭제 버튼 */}
            <div className="absolute bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(post.id)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.id)}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* 헤더 */}
              <div className="flex items-center gap-3">
                <Badge variant={categoryInfo.variant} className="text-xs">
                  {categoryInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>

              {/* 제목 */}
              <Link href={`/community/${post.id}`}>
                <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                  {post.title}
                </h3>
              </Link>

              {/* 내용 미리보기 */}
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                {post.content}
              </p>

              {/* 인터랙션 */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      post.isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span>{post.likes}</span>
                </button>

                <Link
                  href={`/community/${post.id}#comments`}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}