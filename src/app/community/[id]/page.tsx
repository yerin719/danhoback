"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/community/CommentSection";
import CommunityPostListItem from "@/components/community/CommunityPostListItem";
import { getCommentsByPostId, getPostById, getRelatedPosts } from "@/lib/community";
import { ArrowLeft, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState, use } from "react";

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const postId = id;
  const post = getPostById(postId);
  const comments = getCommentsByPostId(postId);
  const relatedPosts = post ? getRelatedPosts(postId, post.category) : [];

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);

  if (!post) {
    notFound();
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto max-w-5xl xl:max-w-7xl px-4 py-4 sm:py-8 sm:px-6">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-4 sm:mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 sm:ml-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">커뮤니티로 돌아가기</span>
            <span className="sm:hidden">뒤로</span>
          </Button>
        </Link>
      </div>

      <div className="flex gap-8">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 max-w-4xl">
          {/* 메인 게시글 */}
          <div className="bg-background p-4 sm:p-6 mb-6 sm:mb-8">
          {/* 게시글 헤더 */}
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {post.category}
            </Badge>
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 leading-tight">{post.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm sm:text-base">{post.author.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 게시글 내용 */}
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-line text-base leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* 이미지들 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6 space-y-4">
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`게시글 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          {/* 반응 및 공유 버튼 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="gap-2 text-sm"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">좋아요</span>
                {likeCount > 0 && <span>{likeCount}</span>}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">댓글</span> {post.comments}
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="gap-2 text-sm self-start sm:hidden">
              <Share2 className="h-4 w-4" />
              공유
            </Button>
          </div>
      </div>

          {/* 댓글 섹션 */}
          <div className="bg-background p-4 sm:p-6 mb-6 sm:mb-8">
            <CommentSection
              postId={postId}
              comments={comments}
              totalComments={post.comments}
            />
          </div>
        </div>

        {/* 사이드바 - 관련 게시글 */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          {relatedPosts.length > 0 && (
            <div className="sticky top-8 p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">같은 카테고리의 다른 글</h2>
              <div className="bg-card space-y-3">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="p-3 border-b border-border/20 last:border-b-0">
                    <Link href={`/community/${relatedPost.id}`} className="block hover:bg-muted/50 rounded p-2 -m-2 transition-colors">
                      <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{relatedPost.author.name}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {relatedPost.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {relatedPost.comments}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* 모바일용 관련 게시글 */}
      {relatedPosts.length > 0 && (
        <div className="lg:hidden mt-8">
          <h2 className="text-lg font-semibold mb-4">같은 카테고리의 다른 글</h2>
          <div className="bg-card">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="px-4 sm:px-6">
                <CommunityPostListItem
                  post={relatedPost}
                  hideCategories={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}