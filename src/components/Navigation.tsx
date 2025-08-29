"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, getNotificationIcon, getUnreadNotificationCount, notifications } from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { Bell, Heart, LogOut, MessageCircle, Tag, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/products", label: "제품" },
  { href: "/articles", label: "아티클" },
  { href: "/community", label: "커뮤니티" },
];

export default function Navigation() {
  const pathname = usePathname();
  const unreadCount = getUnreadNotificationCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 좌측 - 로고와 메뉴 */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary mr-8">
              단호박
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
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

          {/* 우측 - 사용자 영역 */}
          <div className="flex items-center space-x-4">
            {/* 알림 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {/* 알림 뱃지 */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    알림이 없습니다
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => {
                      const iconName = getNotificationIcon(notification.type);
                      const IconComponent = {
                        MessageCircle,
                        Heart,
                        UserPlus,
                        Bell,
                        Tag,
                      }[iconName] || Bell;
                      
                      return (
                        <DropdownMenuItem
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-3 p-4 cursor-pointer",
                            !notification.isRead && "bg-blue-50/50",
                          )}
                        >
                          <IconComponent className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="font-medium pr-2">{notification.title}</div>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatRelativeTime(notification.createdAt)}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-sm text-muted-foreground">
                      모든 알림 읽기
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 찜 아이콘 */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* 사용자 아바타 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="사용자" />
                    <AvatarFallback>홍</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">홍길동</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/users">
                    <User className="mr-2 h-4 w-4" />
                    마이페이지
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
