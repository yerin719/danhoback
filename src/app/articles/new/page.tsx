"use client";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { articleCategories, type ArticleCategory } from "@/lib/articles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewArticlePage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishData, setPublishData] = useState({
    featuredImage: "",
    summary: "",
    category: "" as ArticleCategory | "",
    isPublic: true,
  });

  // Admin 권한 체크
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("관리자만 접근할 수 있습니다.");
      router.push("/articles");
    }
  }, [isAdmin, authLoading, router]);

  const handlePublish = () => {
    // 출간 모달 오픈 시 제목 미리 채우기
    setPublishData((prev) => ({ ...prev, summary: formData.title }));
    setShowPublishModal(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublishDataChange = (field: string, value: string | boolean) => {
    setPublishData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinalPublish = async () => {
    // 최종 출간 로직
    const articleData = {
      ...formData,
      ...publishData,
      tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
    };

    console.log("출간할 데이터:", articleData);

    // TODO: API 호출
    // await publishArticle(articleData);

    // 성공 시 상세 페이지로 이동
    router.push("/articles");
  };

  // 로딩 중이거나 권한이 없는 경우
  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 뒤로 가기 버튼 */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/articles" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />글 목록으로
            </Link>
          </Button>
        </div>

        {/* 메인 폼 */}
        <div className="space-y-6">
          {/* 제목 */}
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="글 제목을 입력하세요..."
            className="!text-3xl md:!text-3xl font-semibold border-0 border-b-2 border-border rounded-none px-0 py-8 focus-visible:ring-0 focus-visible:border-primary"
            style={{ fontSize: "1.875rem" }}
          />

          {/* 태그 */}
          <Input
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            placeholder="태그를 입력하세요... (예: 단백질, 운동, 다이어트)"
            className="border-0 rounded-none px-0 py-3 focus-visible:ring-0 shadow-none"
          />

          {/* 내용 */}
          <Textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="내용을 작성하세요..."
            className="min-h-[calc(100vh-500px)] font-mono resize-none border-0 rounded-none px-0 py-4 focus-visible:ring-0 text-base leading-relaxed shadow-none"
          />

          {/* 출간 버튼 */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handlePublish}
              size="lg"
              className="px-8 py-3 text-lg"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              출간하기
            </Button>
          </div>
        </div>
      </div>

      {/* 출간 설정 모달 */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-[90vw] w-[90vw] sm:max-w-[90vw] lg:max-w-[80vw] max-h-[90vh] overflow-y-auto min-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">글 출간 설정</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* 좌측: 썸네일 및 콘텐츠 */}
            <div className="space-y-6">
              {/* 썸네일 업로드 */}
              <div>
                <Label>썸네일 이미지</Label>
                <div className="mt-2">
                  <ImageUpload
                    value={publishData.featuredImage}
                    onChange={(value) => handlePublishDataChange("featuredImage", value)}
                    aspectRatio="video"
                  />
                </div>
              </div>

              {/* 제목 확인 */}
              <div>
                <Label>제목</Label>
                <Input value={formData.title} className="mt-2 text-lg font-semibold" disabled />
              </div>

              {/* 요약 */}
              <div>
                <Label>글 요약</Label>
                <Textarea
                  value={publishData.summary}
                  onChange={(e) => handlePublishDataChange("summary", e.target.value)}
                  placeholder="독자가 볼 수 있는 글 요약을 작성하세요..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>

            {/* 우측: 설정 */}
            <div className="space-y-6">
              {/* 공개 설정 */}
              <div>
                <Label>공개 설정</Label>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={publishData.isPublic === true}
                      onChange={() => handlePublishDataChange("isPublic", true)}
                      className="w-4 h-4"
                    />
                    <span>전체 공개</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={publishData.isPublic === false}
                      onChange={() => handlePublishDataChange("isPublic", false)}
                      className="w-4 h-4"
                    />
                    <span>비공개</span>
                  </label>
                </div>
              </div>

              {/* 카테고리 설정 */}
              <div>
                <Label>카테고리</Label>
                <Select
                  value={publishData.category}
                  onValueChange={(value: ArticleCategory) =>
                    handlePublishDataChange("category", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {articleCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 버튼들 */}
              <div className="flex flex-col gap-3 pt-6">
                <Button
                  onClick={handleFinalPublish}
                  size="lg"
                  disabled={!publishData.summary.trim() || !publishData.category}
                  className="w-full"
                >
                  출간하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPublishModal(false)}
                  size="lg"
                  className="w-full"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
