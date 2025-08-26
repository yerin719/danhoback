"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function ArticleBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative px-8 py-12 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <BookOpen className="h-16 w-16 opacity-90" />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            단백질 전문 가이드
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            성분 해설부터 섭취법까지, 단백질에 대한 모든 정보를 
            <br className="hidden sm:block" />
            전문가들이 직접 작성한 신뢰할 수 있는 콘텐츠로 만나보세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              asChild
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/articles/new">
                글 작성하기
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="#articles-list">
                전체 글 보기
              </Link>
            </Button>
          </div>
          
          {/* 통계 정보 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-6 w-6 text-blue-200" />
              </div>
              <div className="text-2xl font-bold">150+</div>
              <div className="text-blue-200 text-sm">전문 가이드</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 text-purple-200" />
              </div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-purple-200 text-sm">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-pink-200" />
              </div>
              <div className="text-2xl font-bold">1M+</div>
              <div className="text-pink-200 text-sm">월간 조회수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}