"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
// API 라우트를 통해 서버사이드에서 R2 함수 실행
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings, Trash2, Upload, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(1, "사용자명을 입력해주세요")
    .max(15, "사용자명은 최대 15자까지 가능합니다")
    .regex(/^[a-zA-Z0-9가-힣_-]+$/, "한글, 영문, 숫자, _, - 만 사용 가능합니다"),
});

export default function ProfilePageContent() {
  const { user, profile, avatarInitial, refreshProfile, deleteAccount, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [finalDeleteConfirmed, setFinalDeleteConfirmed] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // URL 파라미터에서 activeSection을 가져오고, 기본값은 "profile"
  const activeSection = (searchParams.get("tab") as "profile" | "account") || "profile";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
    },
  });

  // profile이 로드되면 form 값을 업데이트
  useEffect(() => {
    if (profile?.username) {
      form.setValue("username", profile.username);
    }
  }, [profile?.username, form]);

  // 아바타 파일 선택 처리
  const handleAvatarFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 파일 업로드 실행
    handleAvatarUpload(file);
  };

  // 아바타 업로드 처리
  const handleAvatarUpload = async (file: File) => {
    if (!user?.id) {
      toast.error("사용자 정보를 찾을 수 없습니다");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);

      // API 라우트 호출
      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '업로드에 실패했습니다');
      }

      toast.success("프로필 이미지가 업데이트되었습니다");
      setAvatarPreview(null); // 미리보기 초기화

      // AuthContext를 통해 profile 데이터 새로고침
      await refreshProfile();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다";
      toast.error(errorMessage);
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // input 초기화
      }
    }
  };

  // 아바타 삭제 처리
  const handleAvatarDelete = async () => {
    if (!user?.id) {
      toast.error("사용자 정보를 찾을 수 없습니다");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // API 라우트 호출
      const response = await fetch('/api/avatar/delete', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '삭제에 실패했습니다');
      }

      toast.success("프로필 이미지가 삭제되었습니다");

      // AuthContext를 통해 profile 데이터 새로고침
      await refreshProfile();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "이미지 삭제에 실패했습니다";
      toast.error(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // 사용자명 중복 체크 함수 (submit용)
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    if (!username || username === profile?.username) {
      return false; // 현재 사용자명과 같으면 중복 아님
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116: No rows found
        throw error;
      }

      return !!data; // 데이터가 있으면 중복
    } catch (error) {
      console.error("Username check error:", error);
      return false;
    }
  };

  // 프로필 업데이트
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user?.id) {
      toast.error("사용자 정보를 찾을 수 없습니다");
      return;
    }

    setIsLoading(true);

    try {
      // 사용자명 중복 체크
      const isUsernameExists = await checkUsernameExists(values.username);
      if (isUsernameExists) {
        form.setError("username", {
          type: "manual",
          message: "이미 사용중인 사용자명입니다",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username: values.username })
        .eq("id", user.id);

      if (error) {
        // PostgreSQL unique constraint violation
        if (error.code === "23505") {
          form.setError("username", {
            type: "manual",
            message: "이미 사용중인 사용자명입니다",
          });
          return;
        }
        throw error;
      }
      toast.success("사용자명이 업데이트되었습니다");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "사용자명 업데이트에 실패했습니다";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 변경
  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast.error("새 이메일을 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;
      toast.success("이메일 변경 요청이 전송되었습니다. 새 이메일을 확인해주세요.");
      setNewEmail("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "이메일 변경에 실패했습니다";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="container mx-auto py-8 flex items-center justify-center"></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-8">프로필 설정</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* 좌측 사이드바 - 메뉴 */}
        <Card className="h-fit">
          <CardContent className="px-6">
            <nav className="space-y-2">
              <button
                onClick={() => router.push("/profile?tab=profile")}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
                  activeSection === "profile"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">프로필 정보</span>
              </button>
              <button
                onClick={() => router.push("/profile?tab=account")}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
                  activeSection === "account"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">계정 관리</span>
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* 우측 컨텐츠 영역 */}
        <div className="space-y-6">
          {activeSection === "profile" && (
            <div className="space-y-6">
              {/* 프로필 이미지 및 사용자명 */}
              <Card>
                <CardContent className="space-y-6">
                  {/* 프로필 이미지 */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={avatarPreview || profile?.avatar_url || undefined}
                          alt={profile?.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl">{avatarInitial}</AvatarFallback>
                      </Avatar>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">프로필 이미지</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, WebP 파일을 업로드할 수 있습니다. (최대 2MB)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={isUploadingAvatar}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          이미지 변경
                        </Button>
                        {profile?.avatar_url && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" disabled={isUploadingAvatar}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>프로필 이미지 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  프로필 이미지를 삭제하시겠습니까?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAvatarDelete}>
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleAvatarFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 사용자명 */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                              <FormLabel>닉네임</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading} className="mb-0">
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              저장 중...
                            </>
                          ) : (
                            "저장"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* 로그아웃 버튼 - 모바일에서만 노출 */}
              <div className="flex justify-center md:hidden">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await signOut();
                      toast.success("로그아웃되었습니다");
                      router.push("/");
                    } catch {
                      toast.error("로그아웃 중 오류가 발생했습니다");
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  로그아웃
                </Button>
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-6">
              {/* 이메일 변경 섹션 */}
              <Card>
                <CardHeader>
                  <CardTitle>이메일 변경</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentEmail">현재 이메일</Label>
                    <Input
                      id="currentEmail"
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  {user.app_metadata?.provider === "email" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">새 이메일</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="새 이메일을 입력하세요"
                          disabled={isLoading}
                        />
                      </div>
                      <Button onClick={handleChangeEmail} disabled={isLoading || !newEmail}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            변경 중...
                          </>
                        ) : (
                          "이메일 변경"
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        이메일 변경 시 새 이메일 주소로 확인 메일이 전송됩니다.
                      </p>
                    </>
                  ) : (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        소셜 로그인 계정은 해당 서비스({user.app_metadata?.provider})에서 이메일을
                        관리합니다. 이메일을 변경하려면 로그인한 서비스에서 직접 변경해주세요.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 회원탈퇴 섹션 */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">계정 삭제</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 계정 상태 정보 */}
                  <div className="rounded-lg border border-muted p-4 space-y-2">
                    <h4 className="font-medium">계정 정보</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• 가입일: {new Date(user.created_at).toLocaleDateString("ko-KR")}</p>
                      <p>
                        • 로그인 방식:{" "}
                        {user.app_metadata?.provider === "email"
                          ? "이메일"
                          : user.app_metadata?.provider}
                      </p>
                    </div>
                  </div>

                  {/* 데이터 삭제 안내 */}
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      계정 삭제 시 다음과 같이 처리됩니다:
                    </h4>
                    <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      <li>• 프로필 정보 및 설정이 영구적으로 삭제됩니다</li>
                      <li>• 작성한 게시글과 댓글은 익명처리되어 서비스에 남습니다</li>
                      <li>• 북마크 및 좋아요 기록이 영구적으로 삭제됩니다</li>
                      <li>• 활동 내역이 영구적으로 삭제됩니다</li>
                    </ul>
                  </div>

                  {/* 동의 체크박스 및 계정 삭제 버튼 */}
                  <div className="pt-4 border-t border-destructive/20 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="delete-confirm-1"
                          checked={deleteConfirmed}
                          onCheckedChange={(checked) => setDeleteConfirmed(checked === true)}
                        />
                        <Label
                          htmlFor="delete-confirm-1"
                          className="text-sm leading-relaxed cursor-pointer"
                        >
                          위의 내용을 모두 확인했으며, 계정 삭제 시 모든 데이터가 영구적으로
                          삭제됨을 이해합니다. 작성된 게시물은 삭제되지 않으며, 익명처리 후 서비스로
                          소유권이 귀속됩니다.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="delete-confirm-2"
                          checked={finalDeleteConfirmed}
                          disabled={!deleteConfirmed}
                          onCheckedChange={(checked) => setFinalDeleteConfirmed(checked === true)}
                        />
                        <Label
                          htmlFor="delete-confirm-2"
                          className="text-sm leading-relaxed cursor-pointer"
                        >
                          계정 삭제 후에는 복구가 불가능함을 확인하며, 이에 동의합니다.
                        </Label>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={!deleteConfirmed || !finalDeleteConfirmed || isDeletingAccount}
                      onClick={async () => {
                        try {
                          setIsDeletingAccount(true);
                          await deleteAccount();
                          toast.success("계정이 삭제되었습니다. 이용해 주셔서 감사합니다.");
                          // deleteAccount 내부에서 홈으로 리디렉션 처리됨
                        } catch (error) {
                          console.error("계정 삭제 실패:", error);
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "계정 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
                          );
                        } finally {
                          setIsDeletingAccount(false);
                        }
                      }}
                    >
                      {isDeletingAccount ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          계정 삭제 중...
                        </>
                      ) : (
                        "계정 영구 삭제"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
