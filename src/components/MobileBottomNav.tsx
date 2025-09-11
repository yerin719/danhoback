"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Heart, Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  { href: "/", label: "홈", icon: Home },
  // { href: "/products", label: "상품", icon: Package },
  { href: "/articles", label: "아티클", icon: BookOpen },
  // { href: "/community", label: "커뮤니티", icon: MessageSquare },
  { href: "/favorites", label: "찜", icon: Heart },
  { href: "/profile", label: "마이페이지", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-4 h-16">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
