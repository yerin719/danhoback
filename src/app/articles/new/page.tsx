"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CategoryBadge from "@/components/articles/CategoryBadge";
import ArticleContent from "@/components/articles/ArticleContent";
import { articleCategories, type ArticleCategory } from "@/lib/articles";
import { ArrowLeft, Eye, Save } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// 마크다운 에디터를 dynamic import로 로드 (SSR 이슈 방지)
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function NewArticlePage() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "" as ArticleCategory | "",
    featuredImage: "",
    tags: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 실제로는 API 호출로 저장
    console.log("새 글 저장:", {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : []
    });
    
    // 저장 후 목록 페이지로 이동
    router.push("/articles");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/articles" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            글 목록으로
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 폼 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                새 글 작성
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isPreview ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsPreview(false)}
                  >
                    편집
                  </Button>
                  <Button
                    type="button"
                    variant={isPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreview(true)}
                    disabled={!formData.content}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    미리보기
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="글 제목을 입력하세요"
                    required
                  />
                </div>

                {/* 요약 */}
                <div>
                  <Label htmlFor="summary">요약 *</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    placeholder="글의 간단한 요약을 입력하세요"
                    rows={3}
                    required
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <Label>카테고리 *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ArticleCategory) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
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
                  {formData.category && (
                    <div className="mt-2">
                      <CategoryBadge category={formData.category} />
                    </div>
                  )}
                </div>

                {/* 대표 이미지 URL */}
                <div>
                  <Label htmlFor="featuredImage">대표 이미지 URL</Label>
                  <Input
                    id="featuredImage"
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* 태그 */}
                <div>
                  <Label htmlFor="tags">태그</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="태그를 쉼표로 구분해서 입력하세요 (예: 단백질, 운동, 다이어트)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    쉼표(,)로 구분하여 여러 태그를 입력할 수 있습니다
                  </p>
                </div>

                {/* 마크다운 에디터 */}
                {!isPreview && (
                  <div>
                    <Label>내용 *</Label>
                    <div className="mt-2">
                      <MDEditor
                        value={formData.content}
                        onChange={(value) => handleInputChange("content", value || "")}
                        preview="edit"
                        height={400}
                        data-color-mode="light"
                      />
                    </div>
                  </div>
                )}

                {/* 저장 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    글 저장
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              {isPreview && formData.content ? (
                <div className="space-y-4">
                  {/* 미리보기 헤더 */}
                  <div>
                    {formData.category && (
                      <div className="mb-2">
                        <CategoryBadge category={formData.category} />
                      </div>
                    )}
                    {formData.title && (
                      <h1 className="text-2xl font-bold mb-3">{formData.title}</h1>
                    )}
                    {formData.summary && (
                      <p className="text-muted-foreground mb-4">{formData.summary}</p>
                    )}
                    <div className="border-b pb-4 mb-4">
                      <p className="text-sm text-muted-foreground">
                        작성자: 현재 사용자 • 방금 전
                      </p>
                    </div>
                  </div>
                  
                  {/* 미리보기 콘텐츠 */}
                  <ArticleContent content={formData.content} />
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>미리보기를 보려면 내용을 입력하고</p>
                  <p>미리보기 버튼을 클릭하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}