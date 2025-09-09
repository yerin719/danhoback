"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, Settings, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, profile, displayName: contextDisplayName, avatarInitial } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");
  const [newEmail, setNewEmail] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [finalDeleteConfirmed, setFinalDeleteConfirmed] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "account">("profile");

  const supabase = createClient();

  // 프로필 업데이트
  const handleUpdateProfile = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });

      if (error) throw error;
      toast.success("프로필이 업데이트되었습니다");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "프로필 업데이트에 실패했습니다";
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
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">프로필 설정</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* 좌측 사이드바 - 메뉴 */}
        <Card className="h-fit">
          <CardContent className="px-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("profile")}
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
                onClick={() => setActiveSection("account")}
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
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profile?.avatar_url || user.user_metadata?.avatar_url}
                        alt={contextDisplayName}
                      />
                      <AvatarFallback className="text-2xl">{avatarInitial}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">프로필 이미지</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG 파일을 업로드할 수 있습니다. (최대 2MB)
                      </p>
                      <Button variant="outline" disabled>
                        이미지 변경 (준비중)
                      </Button>
                    </div>
                  </div>

                  {/* 사용자명 */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">사용자 이름</Label>
                      <Input
                        id="username"
                        type="text"
                        value={profile?.username || ""}
                        className="bg-muted"
                        readOnly
                      />
                    </div>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          저장 중...
                        </>
                      ) : (
                        "프로필 저장"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                        소셜 로그인 계정은 해당 서비스({user.app_metadata?.provider})에서 이메일을 관리합니다.
                        이메일을 변경하려면 로그인한 서비스에서 직접 변경해주세요.
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
                      disabled={!deleteConfirmed || !finalDeleteConfirmed}
                      onClick={() => {
                        // 기능은 구현하지 않음 (UI만)
                        alert("회원탈퇴 기능은 아직 구현되지 않았습니다.");
                      }}
                    >
                      계정 영구 삭제
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
