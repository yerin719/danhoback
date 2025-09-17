"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

// 개발 모드 컴포넌트 - 이메일 없이 비밀번호 재설정 테스트
export default function DevModeResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDevLogin = async () => {
    setIsLoading(true);
    try {
      // 개발 모드에서 테스트 계정으로 로그인
      const { error } = await supabase.auth.signInWithPassword({
        email: "test@example.com", // 테스트 이메일
        password: "test123!", // 테스트 비밀번호
      });

      if (error) {
        // 계정이 없으면 생성
        const { error: signUpError } = await supabase.auth.signUp({
          email: "test@example.com",
          password: "test123!",
        });

        if (signUpError) throw signUpError;

        // 다시 로그인
        await supabase.auth.signInWithPassword({
          email: "test@example.com",
          password: "test123!",
        });
      }

      toast.success("개발 모드 로그인 성공!");
      router.push("/auth/reset-password/confirm");
    } catch (error) {
      console.error("Dev login error:", error);
      toast.error("개발 모드 로그인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualToken = () => {
    // Supabase 대시보드에서 복사한 토큰으로 직접 이동
    const token = prompt("Supabase 대시보드에서 복사한 recovery token을 입력하세요:");
    if (token) {
      window.location.href = `/auth/reset-password/confirm?token=${token}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">🔧 개발 모드 - 비밀번호 재설정</CardTitle>
          <CardDescription>
            이메일 전송 없이 비밀번호 재설정을 테스트합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>개발 환경 전용</strong>
              <br />
              Supabase 무료 플랜은 이메일 전송이 제한적입니다.
              아래 방법 중 하나를 선택하세요.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={handleDevLogin}
              className="w-full"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "로그인 중..." : "테스트 계정으로 로그인"}
            </Button>

            <Button
              onClick={handleManualToken}
              className="w-full"
              variant="outline"
            >
              Recovery Token 직접 입력
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            <Link href="/auth/reset-password" className="block">
              <Button variant="default" className="w-full">
                일반 비밀번호 재설정 페이지로
              </Button>
            </Link>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>💡 <strong>Supabase 대시보드에서 직접 확인:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Supabase Dashboard → Authentication → Logs</li>
              <li>이메일 전송 기록 확인</li>
              <li>Users 탭에서 "Send recovery email" 클릭</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}