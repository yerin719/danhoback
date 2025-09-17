"use client";

import {
  getAvatarInitial,
  getDisplayName,
  getProfile,
  type Profile,
} from "@/features/users/queries";
import { deleteUserAccount } from "@/features/users/mutations";
import { isAuthRequiredPage } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  displayName: string;
  avatarInitial: string;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signInWithNaver: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // 표시 이름과 아바타 이니셜 계산
  const displayName = getDisplayName(profile);
  const avatarInitial = getAvatarInitial(displayName);

  // 프로필 정보 로드
  const loadProfile = async (userId: string) => {
    try {
      const profileData = await getProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  };

  // 프로필 새로고침
  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  useEffect(() => {
    // 현재 세션 체크
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // 사용자가 있으면 프로필 정보 로드
        if (currentUser?.id) {
          await loadProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 인증 상태 변화 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === "SIGNED_IN" && currentUser?.id) {
        try {
          await loadProfile(currentUser.id);
          router.refresh();
        } catch (error) {
          console.error("프로필 로드 실패:", error);
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null);

        // 현재 페이지가 인증이 필요한 페이지인지 확인
        const needsRedirect = isAuthRequiredPage(pathname);

        if (needsRedirect) {
          try {
            router.push("/");
          } catch (error) {
            console.error("리디렉션 실패:", error);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  // OAuth 로그인용 콜백 URL 생성 헬퍼 함수
  const getOAuthCallbackUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectedFrom = urlParams.get("redirectedFrom");

    return redirectedFrom
      ? `${window.location.origin}/auth/callback?redirectedFrom=${encodeURIComponent(redirectedFrom)}`
      : `${window.location.origin}/auth/callback`;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthCallbackUrl(),
      },
    });
    if (error) throw error;
  };

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: getOAuthCallbackUrl(),
      },
    });
    if (error) throw error;
  };

  const signInWithNaver = async () => {
    // Naver는 Supabase에서 직접 지원하지 않으므로 커스텀 OAuth 구현 필요
    // 여기서는 placeholder로 구현
    throw new Error("Naver 로그인은 추가 설정이 필요합니다");
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 페이지 새로고침으로 모든 상태 초기화
      window.location.reload();
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user?.id) {
        throw new Error("사용자 정보를 찾을 수 없습니다");
      }

      // RPC 함수를 통한 계정 삭제
      await deleteUserAccount();

      // 계정은 삭제되었지만 클라이언트 세션은 남아있으므로 강제로 정리
      try {
        await supabase.auth.signOut();
      } catch {
        // 이미 삭제된 계정이므로 signOut 에러는 무시
      }

      // 홈페이지로 리디렉션
      window.location.href = "/";
    } catch (error) {
      throw error;
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        displayName,
        avatarInitial,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithKakao,
        signInWithNaver,
        signOut,
        refreshProfile,
        deleteAccount,
        resetPasswordForEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
