"use client";

import SimplePostsList from "@/components/user/SimplePostsList";
import UserProfile from "@/components/user/UserProfile";
import { currentUser, userPosts } from "@/lib/user";

export default function MyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 프로필 영역 */}
      <UserProfile user={currentUser} />

      {/* 게시물 목록 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-6">게시물</h2>
        <SimplePostsList posts={userPosts} />
      </div>
    </div>
  );
}
