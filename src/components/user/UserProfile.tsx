import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/user";
import { Settings } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
  user: User;
  isOwner: boolean;
}

export default function UserProfile({ user, isOwner }: UserProfileProps) {
  return (
    <div className="pb-8 mb-8 border-b">
      <div className="flex items-start gap-6">
        {/* 아바타 */}
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
        </Avatar>

        {/* 기본 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            {/* 설정 버튼 (본인인 경우만) */}
            {isOwner && (
              <Button asChild variant="outline" size="sm">
                <Link href="/profile" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  설정
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}