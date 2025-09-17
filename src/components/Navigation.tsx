"use client";

import SearchInput from "@/components/SearchInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Heart, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const navigationItems = [
  // { href: "/products", label: "제품" },
  { href: "/articles", label: "아티클" },
  // { href: "/community", label: "커뮤니티" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, profile, displayName, avatarInitial, signOut, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // 로그인 버튼 URL 생성
  const loginUrl = `/auth/login?redirectedFrom=${encodeURIComponent(pathname)}`;

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOut();
      toast.success("로그아웃되었습니다");
    } catch {
      toast.error("로그아웃 중 오류가 발생했습니다");
    } finally {
      // 로그아웃 상태를 약간의 지연 후 리셋 (빠른 재클릭 방지)
      setTimeout(() => {
        setIsSigningOut(false);
      }, 1000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 데스크탑 네비게이션 */}
        <div className="hidden md:flex h-16 items-center justify-between">
          {/* 좌측 - 로고와 메뉴 */}
          <div className="flex items-center">
            <Link href="/" className="mr-8 flex items-center">
              <Image src="/images/logo.png" alt="단호박" width={60} height={60} priority />
            </Link>
            <div className="flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 우측 - 검색 및 사용자 영역 */}
          <div className="flex items-center space-x-3">
            {/* 검색창 - 찜 버튼 좌측에 위치 */}
            <SearchInput className="w-64" />
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <>
                {
                  /* 알림 드롭다운 */
                  /* <NotificationDropdown /> */
                  /* 찜 아이콘 */
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/favorites">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                }
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile?.avatar_url || undefined}
                          alt={displayName}
                          className="object-cover"
                        />
                        <AvatarFallback>{avatarInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{displayName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        프로필
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* 비로그인 상태 */
              <Button variant="default" size="sm" asChild>
                <Link href={loginUrl}>로그인</Link>
              </Button>
            )}
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/images/logo.png" alt="단호박" width={50} height={50} priority />
          </Link>

          {/* 검색창 - 중앙에 위치하며 가능한 공간 모두 사용 */}
          <div className="flex-1 mx-3">
            <SearchInput className="w-full" placeholder="검색" />
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              /* 모바일에서는 찜버튼과 프로필 버튼 숨김 - 하단 네비게이션에서 접근 가능 */
              <></>
            ) : (
              <Button variant="default" size="sm" asChild className="text-xs">
                <Link href={loginUrl}>로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
