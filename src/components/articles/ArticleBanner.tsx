"use client";

import { BookOpen } from "lucide-react";

export default function ArticleBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="relative px-6 py-12">
        <div className="flex items-center justify-center gap-4">
          <BookOpen className="h-8 w-8 opacity-90" />
          <h1 className="text-xl font-semibold mb-1">단백질 전문 가이드</h1>
          <p className="text-sm text-blue-100">
            성분 해설부터 섭취법까지, 전문가가 작성한 신뢰할 수 있는 콘텐츠
          </p>
        </div>
      </div>
    </div>
  );
}
