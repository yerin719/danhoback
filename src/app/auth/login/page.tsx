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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from "@/features/auth/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function LoginPageContent() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // redirectedFrom 쿼리 파라미터에서 이전 페이지 URL 가져오기
  const redirectedFrom = searchParams.get("redirectedFrom");

  // 로그인 폼
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 회원가입 폼
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);
      toast.success("로그인되었습니다!");

      // redirectedFrom이 있으면 해당 페이지로, 없으면 홈페이지로 이동
      const targetUrl = redirectedFrom && redirectedFrom.startsWith('/') ? redirectedFrom : '/';
      router.push(targetUrl);
    } catch (error) {
      let errorMessage = "로그인에 실패했습니다";

      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "이메일 인증을 완료해주세요";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      await signUpWithEmail(data.email, data.password);
      toast.success("회원가입되었습니다! 이메일을 확인해주세요.");
      signupForm.reset();
    } catch (error) {
      let errorMessage = "회원가입에 실패했습니다";

      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "이미 가입된 이메일입니다";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "비밀번호는 최소 6자 이상이어야 합니다";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "구글 로그인에 실패했습니다";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithKakao();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "카카오 로그인에 실패했습니다";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

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
            <Link href="/" className="text-primary">
              단호박에 오신것을 환영합니다
            </Link>
          </CardTitle>
          <CardDescription className="text-center">단백질 정보 비교는 단호박으로</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4" noValidate>
                  <FormField
                    control={loginForm.control}
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
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "로그인 중..." : "로그인"}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleEmailSignup)} className="space-y-4" noValidate>
                  <FormField
                    control={signupForm.control}
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
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "가입 중..." : "회원가입"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              구글로 계속하기
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleKakaoLogin}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#000000">
                <path d="M12 3c-5.799 0-10.5 3.664-10.5 8.185 0 2.857 1.884 5.364 4.73 6.818l-.768 2.807c-.058.213.151.406.363.292l3.148-1.687c.337.047.68.07 1.027.07 5.799 0 10.5-3.664 10.5-8.185S17.799 3 12 3z" />
              </svg>
              카카오로 계속하기
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full text-muted-foreground">
            계속 진행하면{" "}
            <Link href="/terms" className="underline">
              이용약관
            </Link>{" "}
            및{" "}
            <Link href="/privacy" className="underline">
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
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
              <Link href="/" className="text-primary">
                단호박에 오신것을 환영합니다
              </Link>
            </CardTitle>
            <CardDescription className="text-center">단백질 정보 비교는 단호박으로</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input type="email" placeholder="example@email.com" disabled />
              <Input type="password" placeholder="••••••••" disabled />
              <Button className="w-full" disabled>
                로그인
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
