"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { resetPasswordConfirmSchema, type ResetPasswordConfirmData } from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordConfirmPage() {
  const { updatePassword, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordConfirmData>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 페이지 로드 시 사용자 인증 상태 확인
  useEffect(() => {
    // Supabase는 이메일 링크 클릭 시 자동으로 사용자를 인증함
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isLoading && user === null) {
      // 약간의 지연을 두어 인증 상태가 로드될 시간을 줌
      const timer = setTimeout(() => {
        if (!user) {
          toast.error("유효하지 않거나 만료된 링크입니다.");
          router.push("/auth/login");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, router, isLoading]);

  const handleSubmit = async (data: ResetPasswordConfirmData) => {
    setIsLoading(true);

    try {
      await updatePassword(data.password);
      setPasswordUpdated(true);
      toast.success("비밀번호가 성공적으로 변경되었습니다.");

      // 3초 후 홈페이지로 이동 (이미 로그인된 상태)
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      let errorMessage = "비밀번호 변경에 실패했습니다.";

      if (error instanceof Error) {
        if (error.message.includes("Auth session missing")) {
          errorMessage = "세션이 만료되었습니다. 다시 시도해주세요.";
        } else if (error.message.includes("same as the old")) {
          errorMessage = "새 비밀번호는 이전 비밀번호와 달라야 합니다.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              비밀번호 변경 완료
            </CardTitle>
            <CardDescription className="text-center">
              새 비밀번호로 로그인할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              잠시 후 홈페이지로 이동합니다...
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button className="w-full">
                홈페이지로 이동
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <Link href="/" className="flex items-center justify-center mb-2">
              <Image
                src="/images/logo.png"
                alt="단호박"
                width={80}
                height={40}
                className="object-cover w-20 h-10"
              />
            </Link>
            새 비밀번호 설정
          </CardTitle>
          <CardDescription className="text-center">
            새로운 비밀번호를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>새 비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground">
                • 최소 6자 이상
                <br />
                • 영문과 숫자를 포함
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "변경 중..." : "비밀번호 변경하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}