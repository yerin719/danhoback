"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Comment } from "@/lib/community";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

export default function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "방금 전";
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 30) {
      return `${diffInDays}일 전`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths}개월 전`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears}년 전`;
    }
  };

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${isReply ? "ml-6 sm:ml-12 pl-2 sm:pl-4 border-l-2 border-muted" : ""}`}
    >
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback className="text-xs sm:text-sm">{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-medium text-xs sm:text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm leading-relaxed">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleLike}
          >
            <Heart className={`h-3 w-3 mr-1 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {likeCount > 0 && likeCount}
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              답글
            </Button>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-3 pl-2 sm:pl-4">
            <div className="flex gap-2">
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6 mt-1">
                <AvatarFallback className="text-xs">나</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  placeholder="답글을 작성하세요..."
                  className="w-full min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm border border-border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowReplyForm(false)}
                  >
                    취소
                  </Button>
                  <Button size="sm" className="text-xs">
                    작성
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
