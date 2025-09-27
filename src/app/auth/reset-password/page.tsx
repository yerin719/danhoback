"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestData,
} from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function ResetPasswordContent() {
  const { resetPasswordForEmail } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // URL 파라미터에서 오류 확인
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (error || errorCode) {
      let message = "비밀번호 재설정 중 문제가 발생했습니다.";

      if (errorCode === "otp_expired") {
        message = "비밀번호 재설정 링크가 만료되었습니다. 다시 시도해주세요.";
      } else if (errorDescription) {
        message = decodeURIComponent(errorDescription.replace(/\+/g, " "));
      }

      toast.error(message);
    }
  }, [error, errorCode, errorDescription]);

  const form = useForm<ResetPasswordRequestData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: ResetPasswordRequestData) => {
    setIsLoading(true);

    try {
      await resetPasswordForEmail(data.email);
      setEmailSent(true);
      toast.success("비밀번호 재설정 이메일을 발송했습니다.");
    } catch (error) {
      // Rate limit 오류 처리
      if (error instanceof Error && error.message.includes("rate limit")) {
        toast.error("일일 이메일 전송 한도를 초과했습니다. 24시간 후에 다시 시도해주세요.");
        return;
      }

      console.log(error instanceof Error && error.message);
      // 보안을 위해 다른 오류는 이메일 존재 여부를 노출하지 않음
      setEmailSent(true);
      toast.success("비밀번호 재설정 이메일을 발송했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-center">이메일을 확인해주세요</CardTitle>
            <CardDescription className="text-center">
              비밀번호 재설정 링크를 이메일로 보내드렸습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{form.getValues("email")}</strong>로 비밀번호 재설정 링크를 발송했습니다.
                이메일을 확인하시고 링크를 클릭하여 새 비밀번호를 설정해주세요.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • 이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요
              </p>
              <p className="text-sm text-muted-foreground">
                • 몇 분 내로 이메일이 도착하지 않으면 다시 시도해주세요
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                로그인 페이지로 돌아가기
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
          <CardTitle className="text-2xl font-semibold text-center">
            <Link href="/" className="flex items-center justify-center mb-2">
              <Image
                src="/images/logo.png"
                alt="단호박"
                width={80}
                height={40}
                className="object-cover w-20 h-10"
              />
            </Link>
            비밀번호 재설정
          </CardTitle>
          <CardDescription className="text-center">
            가입하신 이메일 주소를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || errorCode) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorCode === "otp_expired"
                  ? "링크가 만료되었습니다. 아래에서 다시 요청해주세요."
                  : "문제가 발생했습니다. 다시 시도해주세요."}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "전송 중..." : "비밀번호 재설정 이메일 보내기"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인 페이지로 돌아가기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              <Link href="/" className="flex items-center justify-center mb-2">
                <Image
                  src="/images/logo.png"
                  alt="단호박"
                  width={80}
                  height={40}
                  className="object-cover w-20 h-10"
                />
              </Link>
              비밀번호 재설정
            </CardTitle>
            <CardDescription className="text-center">
              가입하신 이메일 주소를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">이메일</label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  disabled
                />
              </div>
              <Button className="w-full" disabled>
                비밀번호 재설정 이메일 보내기
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                로그인 페이지로 돌아가기
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
