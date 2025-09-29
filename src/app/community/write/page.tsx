"use client";

import {
  SimpleEditor,
  type SimpleEditorRef,
} from "@/components/common/tiptap/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { communityCategories, type CommunityCategory } from "@/lib/community";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function CommunityWritePage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const editorRef = useRef<SimpleEditorRef>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Admin 권한 체크
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("관리자만 접근할 수 있습니다.");
      router.push("/community");
    }
  }, [isAdmin, authLoading, router]);

  const handleSubmit = async (saveAsDraft = false) => {
    const contentHTML = editorRef.current?.getHTML() || "";
    const contentText = editorRef.current?.getText() || "";

    if (!title.trim() || !contentText.trim() || !category) {
      toast.error("제목, 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setIsDraft(saveAsDraft);

    try {
      // TODO: API 호출로 게시글 저장
      console.log("게시글 저장:", {
        title: title.trim(),
        content: contentHTML,
        category,
        isDraft: saveAsDraft,
      });

      // 시뮬레이션: 2초 후 완료
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (saveAsDraft) {
        toast.success("임시저장되었습니다.");
      } else {
        toast.success("게시글이 작성되었습니다.");
        setTimeout(() => router.push("/community"), 1500);
      }
    } catch {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setIsDraft(false);
    }
  };
  console.log(editorRef.current?.getText());

  // 로딩 중이거나 권한이 없는 경우
  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:py-8 sm:px-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/community">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 sm:ml-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">커뮤니티로 돌아가기</span>
              <span className="sm:hidden">뒤로</span>
            </Button>
          </Link>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting && !isDraft ? "게시 중..." : "게시하기"}
          </Button>
        </div>
      </div>

      {/* 작성 폼 */}
      <div className="space-y-6">
        {/* 카테고리 선택 */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {communityCategories.map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className="h-8"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div className="space-y-2">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            className="!text-xl md:!text-2xl !py-5 !font-medium !border-0 !border-b !border-border !rounded-none !bg-transparent !shadow-none focus-visible:!ring-0 focus-visible:!border-primary"
            maxLength={100}
          />
          <div className="text-xs text-muted-foreground text-right">{title.length}/100</div>
        </div>

        {/* 내용 에디터 */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground text-right">
            <p>건전한 커뮤니티 문화를 위해 욕설, 비방은 자제해주세요.</p>
          </div>
          <SimpleEditor ref={editorRef} />
        </div>

        {/* 하단 버튼 (모바일) */}
        <div className="sm:hidden sticky bottom-4 bg-background border rounded-lg p-4 shadow-lg">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && !isDraft ? "게시 중..." : "게시하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
