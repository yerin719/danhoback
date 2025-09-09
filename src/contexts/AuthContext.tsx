"use client";

import { createClient } from "@/lib/supabase/client";
import { getProfile, type Profile, getDisplayName, getAvatarInitial } from "@/features/users/queries";
import { isAuthRequiredPage } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
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
  const displayName = getDisplayName(profile, user?.user_metadata, user?.email || undefined);
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
        const { data: { session } } = await supabase.auth.getSession();
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
      }
    );

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

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    } catch (error) {
      throw error;
    }
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