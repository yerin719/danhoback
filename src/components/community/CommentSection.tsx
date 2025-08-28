"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type Comment } from "@/lib/community";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  totalComments: number;
}

export default function CommentSection({ postId, comments, totalComments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 댓글을 부모-자식 관계로 정리
  const parentComments = comments.filter(comment => !comment.parentId);
  const replyComments = comments.filter(comment => comment.parentId);

  const getReplies = (parentId: string) => {
    return replyComments.filter(reply => reply.parentId === parentId);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // TODO: API 호출로 댓글 저장
    console.log("새 댓글:", { postId, content: newComment });
    
    // 시뮬레이션: 1초 후 완료
    setTimeout(() => {
      setNewComment("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* 댓글 헤더 */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <span className="font-semibold">댓글 {totalComments}개</span>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="flex gap-2 sm:gap-3">
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1">
          <AvatarFallback className="text-xs sm:text-sm">나</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full min-h-[60px] sm:min-h-[80px] text-sm sm:text-base border border-border rounded-md p-2 sm:p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
              className="text-sm"
            >
              {isSubmitting ? "작성 중..." : "댓글 작성"}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {parentComments.length > 0 ? (
          parentComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <CommentItem comment={comment} />
              
              {/* 답글들 */}
              {getReplies(comment.id).map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}