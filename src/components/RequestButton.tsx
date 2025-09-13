"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface RequestButtonProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  prefillUrl?: string;
}

const GOOGLE_FORM_BASE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeq3McMnn5jkQchqcnTNU66NiQCdpWP0LR9AuLzHDy7ydiAYw/viewform?usp=header";

export default function RequestButton({
  size = "sm",
  variant = "outline",
  className = "",
  prefillUrl,
}: RequestButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      // 로그인되지 않은 경우 로그인 페이지로 리디렉션
      router.push("/auth/login");
      return;
    }

    // 구글 폼 URL 생성
    let formUrl = GOOGLE_FORM_BASE_URL;

    // prefillUrl이 있으면 entry.817142687 파라미터로 추가
    if (prefillUrl) {
      const encodedUrl = encodeURIComponent(prefillUrl);
      formUrl += `?entry.817142687=${encodedUrl}`;
    }

    // 로그인된 경우 구글 폼을 새 창에서 열기
    const screenHeight = window.screen.height;
    const height = Math.floor(screenHeight * 0.8); // 80vh 효과
    window.open(
      formUrl,
      "_blank",
      `width=800,height=${height},scrollbars=yes,resizable=yes,noopener,noreferrer`,
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      정보 등록/수정 요청
    </Button>
  );
}
